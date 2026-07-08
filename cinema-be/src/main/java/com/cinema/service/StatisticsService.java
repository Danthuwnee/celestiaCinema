package com.cinema.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.cinema.enums.BookingStatus;
import com.cinema.enums.EntityStatus;
import com.cinema.repository.BookingRepository;
import com.cinema.repository.MovieRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class StatisticsService {

    private final BookingRepository bookingRepository;

    private final MovieRepository movieRepository;

    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new LinkedHashMap<>();

        // KPI cards
        stats.put("totalRevenue", bookingRepository.totalRevenue());
        stats.put("paidBookings", bookingRepository.countByBookingStatus(BookingStatus.PAID));
        stats.put("pendingBookings", bookingRepository.countByBookingStatus(BookingStatus.PENDING));
        stats.put("cancelledBookings", bookingRepository.countByBookingStatus(BookingStatus.CANCELLED));
        stats.put("totalMovies", movieRepository.count());
        stats.put("activeMovies", movieRepository.countByStatus(EntityStatus.ACTIVE));
        stats.put("comingSoonMovies", movieRepository.countByStatus(EntityStatus.COMING_SOON));

        // Daily revenue (last 7 days, fill missing days with 0)
        LocalDate today = LocalDate.now();
        LocalDate sevenDaysAgo = today.minusDays(6);
        Map<String, Object> revenueReport = getRevenueReport(sevenDaysAgo, today);
        @SuppressWarnings("unchecked")
        Map<String, Double> revenueMap = ((List<Map<String, Object>>) revenueReport.get("dailyRevenue"))
                .stream().collect(Collectors.toMap(
                        m -> m.get("date").toString(),
                        m -> (Double) m.get("revenue")
                ));
        List<Map<String, Object>> fullDailyRevenue = new ArrayList<>();
        for (LocalDate date = sevenDaysAgo; !date.isAfter(today); date = date.plusDays(1)) {
            Map<String, Object> item = new LinkedHashMap<>();
            item.put("date", date.toString());
            item.put("revenue", revenueMap.getOrDefault(date.toString(), 0.0));
            fullDailyRevenue.add(item);
        }
        stats.put("dailyRevenue", fullDailyRevenue);

        // Recent bookings
        List<Map<String, Object>> recentBookings = bookingRepository.findRecentBookings().stream().map(row -> {
            Map<String, Object> item = new LinkedHashMap<>();
            item.put("bookingId", row[0].toString());
            item.put("totalAmount", row[1]);
            item.put("status", row[2].toString());
            item.put("createdAt", row[3].toString());
            item.put("customerName", row[4].toString());
            item.put("movieTitle", row[5] != null ? row[5].toString() : "N/A");
            item.put("showtime", row[6] != null ? row[6].toString() : "N/A");
            return item;
        }).collect(Collectors.toList());
        stats.put("recentBookings", recentBookings);

        // Popular movies
        List<Map<String, Object>> popularMovies = bookingRepository.findPopularMovies().stream().map(row -> {
            Map<String, Object> item = new LinkedHashMap<>();
            item.put("title", row[0].toString());
            item.put("totalBookings", ((Number) row[1]).longValue());
            item.put("totalRevenue", ((Number) row[2]).doubleValue());
            return item;
        }).collect(Collectors.toList());
        stats.put("popularMovies", popularMovies);

        // Genre distribution
        List<Map<String, Object>> genreDistribution = bookingRepository.findGenreDistribution().stream().map(row -> {
            Map<String, Object> item = new LinkedHashMap<>();
            item.put("name", row[0].toString());
            item.put("movieCount", ((Number) row[1]).intValue());
            return item;
        }).collect(Collectors.toList());
        stats.put("genreDistribution", genreDistribution);

        return stats;
    }

    public Map<String, Object> getRevenueReport(LocalDate startDate, LocalDate endDate) {
        LocalDateTime start = startDate.atStartOfDay();
        LocalDateTime end = endDate.atTime(LocalTime.MAX);

        double totalRevenue = bookingRepository.revenueBetween(start, end);
        List<Object[]> dailyData = bookingRepository.dailyRevenue(start, end);

        Map<String, Double> revenueMap = dailyData.stream().collect(Collectors.toMap(
                row -> row[0].toString(),
                row -> ((Number) row[1]).doubleValue()
        ));

        List<Map<String, Object>> dailyRevenue = new ArrayList<>();
        for (LocalDate date = startDate; !date.isAfter(endDate); date = date.plusDays(1)) {
            Map<String, Object> item = new LinkedHashMap<>();
            item.put("date", date.toString());
            item.put("revenue", revenueMap.getOrDefault(date.toString(), 0.0));
            dailyRevenue.add(item);
        }

        Map<String, Object> report = new LinkedHashMap<>();
        report.put("startDate", startDate);
        report.put("endDate", endDate);
        report.put("totalRevenue", BigDecimal.valueOf(totalRevenue));
        report.put("dailyRevenue", dailyRevenue);
        return report;
    }
}
