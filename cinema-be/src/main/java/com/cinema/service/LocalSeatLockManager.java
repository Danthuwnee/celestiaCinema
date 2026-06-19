package com.cinema.service;

import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

@Component
@ConditionalOnProperty(name = "app.redis.enabled", havingValue = "false", matchIfMissing = true)
public class LocalSeatLockManager implements SeatLockManager {

    private final Map<String, LockEntry> locks = new ConcurrentHashMap<>();

    private record LockEntry(String holder, Instant expiresAt) {}

    private String key(UUID showtimeId, UUID seatId) {
        return showtimeId + ":" + seatId;
    }

    @Override
    public boolean lockSeat(UUID showtimeId, UUID seatId, String holder, long ttlSeconds) {
        String k = key(showtimeId, seatId);
        LockEntry entry = new LockEntry(holder, Instant.now().plusSeconds(ttlSeconds));
        LockEntry existing = locks.putIfAbsent(k, entry);
        if (existing == null) return true;
        if (existing.expiresAt.isBefore(Instant.now())) {
            boolean replaced = locks.replace(k, existing, entry);
            if (replaced) return true;
        }
        return existing.holder.equals(holder);
    }

    @Override
    public void unlockSeat(UUID showtimeId, UUID seatId) {
        locks.remove(key(showtimeId, seatId));
    }

    @Override
    public String getLockHolder(UUID showtimeId, UUID seatId) {
        LockEntry entry = locks.get(key(showtimeId, seatId));
        if (entry == null) return null;
        if (entry.expiresAt.isBefore(Instant.now())) {
            locks.remove(key(showtimeId, seatId));
            return null;
        }
        return entry.holder;
    }

    @Override
    public boolean isSeatLocked(UUID showtimeId, UUID seatId) {
        return getLockHolder(showtimeId, seatId) != null;
    }

    @Override
    public List<UUID> getLockedSeatIds(UUID showtimeId) {
        Instant now = Instant.now();
        return locks.entrySet().stream()
                .filter(e -> e.getKey().startsWith(showtimeId + ":"))
                .filter(e -> e.getValue().expiresAt.isAfter(now))
                .map(e -> UUID.fromString(e.getKey().split(":")[1]))
                .collect(Collectors.toList());
    }
}
