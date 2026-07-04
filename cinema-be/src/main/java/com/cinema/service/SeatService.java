package com.cinema.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cinema.dto.response.SeatResponse;
import com.cinema.entity.Seat;
import com.cinema.entity.Showtime;
import com.cinema.enums.BookingStatus;
import com.cinema.exception.BadRequestException;
import com.cinema.repository.BookingSeatRepository;
import com.cinema.repository.SeatRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SeatService {

    private final SeatRepository seatRepository;
    private final BookingSeatRepository bookingSeatRepository;
    private final SeatLockManager seatLockManager;
    private final ShowtimeService showtimeService;

    @Value("${app.redis.seat-lock-ttl}")
    private long seatLockTtl;

    @Value("${app.redis.max-seats-per-booking}")
    private int maxSeatsPerBooking;

    @Transactional(readOnly = true)
    public List<SeatResponse> getSeatsByShowtime(UUID showtimeId) {
        Showtime showtime = showtimeService.getActiveShowtime(showtimeId);
        List<Seat> seats = seatRepository.findActiveSeatsByRoom(showtime.getRoom().getRoomId());

        Set<UUID> soldSeatIds = Set.copyOf(
            bookingSeatRepository.findSeatIdsByShowtimeAndStatuses(showtimeId,
                List.of(BookingStatus.PAID, BookingStatus.PENDING)));

        List<UUID> lockedSeatIds = seatLockManager.getLockedSeatIds(showtimeId);
        Set<UUID> lockedIds = Set.copyOf(lockedSeatIds);

        return seats.stream().map(seat -> {
            BigDecimal calculatedPrice = showtime.getBasePrice()
                    .multiply(seat.getSeatType().getPriceMultiplier());

            String status;
            if (soldSeatIds.contains(seat.getSeatId())) {
                status = "SOLD";
            } else if (lockedIds.contains(seat.getSeatId())) {
                status = "LOCKED";
            } else {
                status = "AVAILABLE";
            }

            return SeatResponse.builder()
                    .seatId(seat.getSeatId())
                    .rowLabel(seat.getRowLabel())
                    .seatNumber(seat.getSeatNumber())
                    .seatTypeId(seat.getSeatType().getSeatTypeId())
                    .seatTypeName(seat.getSeatType().getTypeName())
                    .priceMultiplier(seat.getSeatType().getPriceMultiplier())
                    .colorHex(seat.getSeatType().getColorHex())
                    .calculatedPrice(calculatedPrice)
                    .status(status)
                    .aisleAfterColumns(showtime.getRoom().getAisleAfterColumns())
                    .build();
        }).collect(Collectors.toList());
    }

    public void lockSeats(UUID showtimeId, List<UUID> seatIds, String sessionId) {
        if (seatIds.size() > maxSeatsPerBooking) {
            throw new BadRequestException("Cannot lock more than " + maxSeatsPerBooking + " seats");
        }

        for (UUID seatId : seatIds) {
            boolean locked = seatLockManager.lockSeat(showtimeId, seatId, sessionId, seatLockTtl);
            if (!locked) {
                String currentHolder = seatLockManager.getLockHolder(showtimeId, seatId);
                if (!sessionId.equals(currentHolder)) {
                    throw new BadRequestException("Seat " + seatId + " is already locked by another user");
                }
            }
        }
    }

    public void unlockSeats(UUID showtimeId, List<UUID> seatIds) {
        for (UUID seatId : seatIds) {
            seatLockManager.unlockSeat(showtimeId, seatId);
        }
    }
}
