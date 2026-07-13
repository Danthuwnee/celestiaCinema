package com.cinema.controller.admin;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cinema.dto.request.CreateRoomRequest;
import com.cinema.dto.request.UpdateRoomRequest;
import com.cinema.entity.Room;
import com.cinema.entity.Seat;
import com.cinema.entity.SeatType;
import com.cinema.enums.EntityStatus;
import com.cinema.exception.BadRequestException;
import com.cinema.exception.ResourceNotFoundException;
import com.cinema.repository.BookingSeatRepository;
import com.cinema.repository.RoomRepository;
import com.cinema.repository.SeatRepository;
import com.cinema.repository.SeatTypeRepository;
import com.cinema.repository.ShowtimeRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/rooms")
@RequiredArgsConstructor
public class AdminRoomController {

    private final RoomRepository roomRepository;
    private final SeatRepository seatRepository;
    private final SeatTypeRepository seatTypeRepository;
    private final ShowtimeRepository showtimeRepository;
    private final BookingSeatRepository bookingSeatRepository;

    @GetMapping
    public ResponseEntity<List<Room>> getAllRooms() {
        return ResponseEntity.ok(roomRepository.findAll());
    }

    @GetMapping("/{roomId}/seats")
    public ResponseEntity<Map<String, UUID>> getRoomSeatTypes(@PathVariable UUID roomId) {
        List<Seat> seats = seatRepository.findActiveSeatsByRoom(roomId);
        Map<String, UUID> rowSeatTypes = seats.stream()
                .collect(Collectors.toMap(
                        Seat::getRowLabel,
                        s -> s.getSeatType().getSeatTypeId(),
                        (existing, replacement) -> existing));
        return ResponseEntity.ok(rowSeatTypes);
    }

    @GetMapping("/seat-types")
    public ResponseEntity<List<SeatType>> getSeatTypes() {
        return ResponseEntity.ok(seatTypeRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<Room> createRoom(@Valid @RequestBody CreateRoomRequest request) {
        Room room = Room.builder()
                .roomName(request.getRoomName())
                .totalRows(request.getTotalRows())
                .totalColumns(request.getTotalColumns())
                .aisleAfterColumns(request.getAisleAfterColumns() != null ? request.getAisleAfterColumns() : "4")
                .status(EntityStatus.ACTIVE)
                .build();
        room = roomRepository.save(room);
        generateSeats(room, request.getRowSeatTypes());
        return ResponseEntity.ok(room);
    }

    @PutMapping("/{id}")
    @Transactional
    public ResponseEntity<Room> updateRoom(@PathVariable UUID id, @Valid @RequestBody UpdateRoomRequest request) {
        Room existing = roomRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found"));
        boolean hasStructuralChanges = request.getRoomName() != null || request.getTotalRows() != null
                || request.getTotalColumns() != null || request.getAisleAfterColumns() != null
                || request.getRowSeatTypes() != null;
        if (hasStructuralChanges && hasActiveShowtimes(id)) {
            throw new BadRequestException("Cannot modify room with active showtimes");
        }
        if (request.getRoomName() != null) existing.setRoomName(request.getRoomName());
        if (request.getTotalRows() != null) existing.setTotalRows(request.getTotalRows());
        if (request.getTotalColumns() != null) existing.setTotalColumns(request.getTotalColumns());
        if (request.getAisleAfterColumns() != null) existing.setAisleAfterColumns(request.getAisleAfterColumns());
        if (request.getStatus() != null) existing.setStatus(EntityStatus.valueOf(request.getStatus()));
        existing = roomRepository.save(existing);

        if (request.getRowSeatTypes() != null) {
            List<Seat> oldSeats = seatRepository.findByRoomRoomIdOrderByRowLabelAscSeatNumberAsc(id);
            List<UUID> oldSeatIds = oldSeats.stream().map(Seat::getSeatId).collect(Collectors.toList());
            if (!oldSeatIds.isEmpty()) {
                bookingSeatRepository.deleteBySeatIdIn(oldSeatIds);
                seatRepository.deleteSeatsByRoomId(id);
            }
            generateSeats(existing, request.getRowSeatTypes());
        }

        return ResponseEntity.ok(roomRepository.save(existing));
    }

    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<Void> deleteRoom(@PathVariable UUID id) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found"));
        if (room.getStatus() != EntityStatus.INACTIVE) {
            throw new BadRequestException("Only inactive rooms can be permanently deleted");
        }
        if (showtimeRepository.existsByRoomRoomIdAndStatusAndStartTimeGreaterThanEqual(id, EntityStatus.ACTIVE, LocalDateTime.now())) {
            throw new BadRequestException("Cannot delete room with active showtimes");
        }
        List<UUID> seatIds = seatRepository.findByRoomRoomIdOrderByRowLabelAscSeatNumberAsc(id)
                .stream().map(Seat::getSeatId).collect(Collectors.toList());
        if (!seatIds.isEmpty()) {
            bookingSeatRepository.deleteBySeatIdIn(seatIds);
            showtimeRepository.deleteByRoomRoomId(id);
            seatRepository.deleteSeatsByRoomId(id);
        }
        roomRepository.delete(room);
        return ResponseEntity.noContent().build();
    }

    private void generateSeats(Room room, Map<String, UUID> rowSeatTypes) {
        List<SeatType> allTypes = seatTypeRepository.findAll();
        SeatType defaultType = allTypes.isEmpty()
                ? seatTypeRepository.save(SeatType.builder().typeName("Standard").priceMultiplier(java.math.BigDecimal.ONE).colorHex("#4CAF50").build())
                : allTypes.get(0);

        List<Seat> seats = new ArrayList<>();
        for (int row = 0; row < room.getTotalRows(); row++) {
            char rowChar = (char) ('A' + row);
            String rowLabel = String.valueOf(rowChar);

            SeatType type = defaultType;
            if (rowSeatTypes != null && rowSeatTypes.containsKey(rowLabel)) {
                UUID typeId = rowSeatTypes.get(rowLabel);
                type = allTypes.stream()
                        .filter(t -> t.getSeatTypeId().equals(typeId))
                        .findFirst()
                        .orElse(defaultType);
            }

            boolean isCouple = "Couple".equals(type.getTypeName());
            int cols = room.getTotalColumns();
            if (isCouple && cols % 2 != 0) cols--;

            for (int col = 1; col <= cols; col++) {
                Seat seat = Seat.builder()
                        .room(room)
                        .seatType(type)
                        .rowLabel(rowLabel)
                        .seatNumber(col)
                        .status(EntityStatus.ACTIVE)
                        .build();
                seats.add(seat);
            }
        }
        seatRepository.saveAll(seats);
    }

    private boolean hasActiveShowtimes(UUID roomId) {
        return showtimeRepository.existsByRoomRoomIdAndStatusAndStartTimeGreaterThanEqual(roomId, EntityStatus.ACTIVE, LocalDateTime.now());
    }
}
