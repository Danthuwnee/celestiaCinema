package com.cinema.controller.admin;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cinema.entity.Room;
import com.cinema.entity.Seat;
import com.cinema.entity.SeatType;
import com.cinema.enums.EntityStatus;
import com.cinema.exception.ResourceNotFoundException;
import com.cinema.repository.RoomRepository;
import com.cinema.repository.SeatRepository;
import com.cinema.repository.SeatTypeRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/rooms")
@RequiredArgsConstructor
public class AdminRoomController {

    private final RoomRepository roomRepository;
    private final SeatRepository seatRepository;
    private final SeatTypeRepository seatTypeRepository;

    @GetMapping
    public ResponseEntity<List<Room>> getAllRooms() {
        return ResponseEntity.ok(roomRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<Room> createRoom(@RequestBody Room room) {
        room = roomRepository.save(room);
        generateSeats(room);
        return ResponseEntity.ok(room);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Room> updateRoom(@PathVariable UUID id, @RequestBody Room room) {
        Room existing = roomRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found"));
        if (hasActiveShowtimes(id)) {
            throw new RuntimeException("Cannot modify room with active showtimes");
        }
        room.setRoomId(existing.getRoomId());
        return ResponseEntity.ok(roomRepository.save(room));
    }

    private void generateSeats(Room room) {
        List<SeatType> seatTypes = seatTypeRepository.findAll();
        SeatType defaultType = seatTypes.isEmpty()
                ? seatTypeRepository.save(SeatType.builder().typeName("Standard").priceMultiplier(java.math.BigDecimal.ONE).colorHex("#4CAF50").build())
                : seatTypes.get(0);

        List<Seat> seats = new ArrayList<>();
        for (int row = 0; row < room.getTotalRows(); row++) {
            char rowChar = (char) ('A' + row);
            for (int col = 1; col <= room.getTotalColumns(); col++) {
                SeatType type = defaultType;
                Seat seat = Seat.builder()
                        .room(room)
                        .seatType(type)
                        .rowLabel(String.valueOf(rowChar))
                        .seatNumber(col)
                        .status(EntityStatus.ACTIVE)
                        .build();
                seats.add(seat);
            }
        }
        seatRepository.saveAll(seats);
    }

    private boolean hasActiveShowtimes(UUID roomId) {
        return false;
    }
}
