package com.cinema.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.cinema.entity.Booking;
import com.cinema.enums.BookingStatus;

@Repository
public interface BookingRepository extends JpaRepository<Booking, UUID> {

    Page<Booking> findByUserUserIdOrderByCreatedAtDesc(UUID userId, Pageable pageable);

    List<Booking> findByBookingStatusAndCreatedAtBefore(BookingStatus status, LocalDateTime time);

    long countByBookingStatus(BookingStatus status);

    @Query("SELECT COALESCE(SUM(b.totalAmount), 0) FROM Booking b WHERE b.bookingStatus = 'PAID'")
    double totalRevenue();

    @Query("SELECT COALESCE(SUM(b.totalAmount), 0) FROM Booking b WHERE b.bookingStatus = 'PAID' AND b.createdAt BETWEEN :start AND :end")
    double revenueBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT FUNCTION('DATE', b.createdAt) as date, COALESCE(SUM(b.totalAmount), 0) FROM Booking b "
         + "WHERE b.bookingStatus = 'PAID' AND b.createdAt BETWEEN :start AND :end "
         + "GROUP BY FUNCTION('DATE', b.createdAt) ORDER BY date")
    List<Object[]> dailyRevenue(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);
}
