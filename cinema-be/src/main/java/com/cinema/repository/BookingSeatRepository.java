package com.cinema.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.cinema.entity.BookingSeat;
import com.cinema.enums.BookingStatus;

@Repository
public interface BookingSeatRepository extends JpaRepository<BookingSeat, UUID> {

    @Query("SELECT bs.seat.seatId FROM BookingSeat bs JOIN bs.booking b "
         + "WHERE bs.showtime.showtimeId = :showtimeId AND b.bookingStatus = 'PAID'")
    List<UUID> findSoldSeatIdsByShowtime(@Param("showtimeId") UUID showtimeId);

    @Query("SELECT bs.seat.seatId FROM BookingSeat bs JOIN bs.booking b "
         + "WHERE bs.showtime.showtimeId = :showtimeId AND b.bookingStatus IN :statuses")
    List<UUID> findSeatIdsByShowtimeAndStatuses(@Param("showtimeId") UUID showtimeId,
                                                 @Param("statuses") List<BookingStatus> statuses);

    List<BookingSeat> findByBookingBookingId(UUID bookingId);
}
