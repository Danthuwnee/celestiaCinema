package com.cinema.controller;

import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cinema.dto.response.SeatResponse;
import com.cinema.service.SeatService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/seats")
@RequiredArgsConstructor
public class SeatController {

    private final SeatService seatService;

    @GetMapping("/showtime/{showtimeId}")
    public ResponseEntity<List<SeatResponse>> getSeatsByShowtime(@PathVariable UUID showtimeId) {
        return ResponseEntity.ok(seatService.getSeatsByShowtime(showtimeId));
    }

    @PostMapping("/lock")
    public ResponseEntity<Void> lockSeats(@RequestBody Map<String, Object> request) {
        UUID showtimeId = UUID.fromString((String) request.get("showtimeId"));
        @SuppressWarnings("unchecked")
        List<String> seatIdStrings = (List<String>) request.get("seatIds");
        List<UUID> seatIds = seatIdStrings.stream().map(UUID::fromString).toList();
        String sessionId = (String) request.get("sessionId");

        seatService.lockSeats(showtimeId, seatIds, sessionId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/unlock")
    public ResponseEntity<Void> unlockSeats(@RequestBody Map<String, Object> request) {
        UUID showtimeId = UUID.fromString((String) request.get("showtimeId"));
        @SuppressWarnings("unchecked")
        List<String> seatIdStrings = (List<String>) request.get("seatIds");
        List<UUID> seatIds = seatIdStrings.stream().map(UUID::fromString).toList();

        seatService.unlockSeats(showtimeId, seatIds);
        return ResponseEntity.ok().build();
    }
}
