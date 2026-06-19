package com.cinema.scheduler;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.cinema.service.BookingService;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class BookingCleanupScheduler {

    private final BookingService bookingService;

    @Scheduled(fixedRate = 900000)
    public void cleanupExpiredBookings() {
        bookingService.cancelExpiredBookings();
    }
}
