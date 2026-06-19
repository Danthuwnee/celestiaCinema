package com.cinema.service;

import java.time.Duration;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

@Component
@ConditionalOnProperty(name = "app.redis.enabled", havingValue = "true")
public class RedisSeatLockManager implements SeatLockManager {

    private final RedisTemplate<String, String> redisTemplate;

    public RedisSeatLockManager(RedisTemplate<String, String> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    private String key(UUID showtimeId, UUID seatId) {
        return "seat:lock:" + showtimeId + ":" + seatId;
    }

    private String keyPrefix(UUID showtimeId) {
        return "seat:lock:" + showtimeId + ":*";
    }

    @Override
    public boolean lockSeat(UUID showtimeId, UUID seatId, String holder, long ttlSeconds) {
        return Boolean.TRUE.equals(
            redisTemplate.opsForValue().setIfAbsent(key(showtimeId, seatId), holder, Duration.ofSeconds(ttlSeconds)));
    }

    @Override
    public void unlockSeat(UUID showtimeId, UUID seatId) {
        redisTemplate.delete(key(showtimeId, seatId));
    }

    @Override
    public String getLockHolder(UUID showtimeId, UUID seatId) {
        return redisTemplate.opsForValue().get(key(showtimeId, seatId));
    }

    @Override
    public boolean isSeatLocked(UUID showtimeId, UUID seatId) {
        return Boolean.TRUE.equals(redisTemplate.hasKey(key(showtimeId, seatId)));
    }

    @Override
    public List<UUID> getLockedSeatIds(UUID showtimeId) {
        Set<String> keys = redisTemplate.keys(keyPrefix(showtimeId));
        if (keys == null) return List.of();
        return keys.stream()
                .map(k -> UUID.fromString(k.split(":")[3]))
                .collect(Collectors.toList());
    }
}
