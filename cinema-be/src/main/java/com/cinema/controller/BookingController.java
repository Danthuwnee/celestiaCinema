package com.cinema.controller;

import java.util.Map;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cinema.dto.request.BookingRequest;
import com.cinema.dto.response.BookingResponse;
import com.cinema.security.UserPrincipal;
import com.cinema.service.BookingService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    public ResponseEntity<?> createBooking(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody BookingRequest request) {
        if (!"CUSTOMER".equals(principal.getRole())) {
            return ResponseEntity.badRequest().body("Admin không thể đặt vé");
        }
        return ResponseEntity.ok(bookingService.createBooking(principal, request));
    }

    @GetMapping
    public ResponseEntity<?> getUserBookings(
            @AuthenticationPrincipal UserPrincipal principal,
            Pageable pageable) {
        if (!"CUSTOMER".equals(principal.getRole())) {
            return ResponseEntity.badRequest().body("Admin không thể xem lịch sử đặt vé");
        }
        return ResponseEntity.ok(bookingService.getUserBookings(principal, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getBookingDetail(
            @PathVariable UUID id,
            @AuthenticationPrincipal UserPrincipal principal) {
        if (!"CUSTOMER".equals(principal.getRole())) {
            return ResponseEntity.badRequest().body("Admin không thể xem chi tiết vé");
        }
        return ResponseEntity.ok(bookingService.getBookingDetail(id, principal));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<?> cancelBooking(
            @PathVariable UUID id,
            @AuthenticationPrincipal UserPrincipal principal) {
        if (!"CUSTOMER".equals(principal.getRole())) {
            return ResponseEntity.badRequest().body("Admin không thể hủy vé");
        }
        bookingService.cancelBooking(id, principal);
        return ResponseEntity.ok(Map.of("message", "Hủy vé thành công, tiền sẽ được hoàn lại"));
    }
}
