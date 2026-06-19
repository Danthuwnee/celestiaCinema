package com.cinema.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.cinema.enums.BookingStatus;
import com.cinema.repository.BookingRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class StatisticsService {

    private final BookingRepository bookingRepository;

    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new LinkedHashMap<>();
        stats.put("totalRevenue", bookingRepository.totalRevenue());
        stats.put("paidBookings", bookingRepository.countByBookingStatus(BookingStatus.PAID));
        stats.put("pendingBookings", bookingRepository.countByBookingStatus(BookingStatus.PENDING));
        stats.put("cancelledBookings", bookingRepository.countByBookingStatus(BookingStatus.CANCELLED));
        return stats;
    }

    public Map<String, Object> getRevenueReport(LocalDate startDate, LocalDate endDate) {
        LocalDateTime start = startDate.atStartOfDay();
        LocalDateTime end = endDate.atTime(LocalTime.MAX);

        double totalRevenue = bookingRepository.revenueBetween(start, end);
        List<Object[]> dailyData = bookingRepository.dailyRevenue(start, end);

        List<Map<String, Object>> dailyRevenue = dailyData.stream().map(row -> {
            Map<String, Object> item = new LinkedHashMap<>();
            item.put("date", row[0].toString());
            item.put("revenue", ((Number) row[1]).doubleValue());
            return item;
        }).collect(Collectors.toList());

        Map<String, Object> report = new LinkedHashMap<>();
        report.put("startDate", startDate);
        report.put("endDate", endDate);
        report.put("totalRevenue", BigDecimal.valueOf(totalRevenue));
        report.put("dailyRevenue", dailyRevenue);
        return report;
    }
}
