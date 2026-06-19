package com.cinema.service;

import java.util.List;
import java.util.UUID;

public interface SeatLockManager {

    boolean lockSeat(UUID showtimeId, UUID seatId, String holder, long ttlSeconds);

    void unlockSeat(UUID showtimeId, UUID seatId);

    String getLockHolder(UUID showtimeId, UUID seatId);

    boolean isSeatLocked(UUID showtimeId, UUID seatId);

    List<UUID> getLockedSeatIds(UUID showtimeId);
}
