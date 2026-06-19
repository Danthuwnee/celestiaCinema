package com.cinema.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.cinema.entity.BookingCombo;

@Repository
public interface BookingComboRepository extends JpaRepository<BookingCombo, UUID> {

    List<BookingCombo> findByBookingBookingId(UUID bookingId);
}
