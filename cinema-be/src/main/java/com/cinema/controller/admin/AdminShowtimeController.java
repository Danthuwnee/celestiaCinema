package com.cinema.controller.admin;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import jakarta.validation.Valid;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.cinema.dto.request.BatchCreateShowtimeRequest;
import com.cinema.dto.response.AvailableSlotsResponse;
import com.cinema.dto.response.ShowtimeResponse;
import com.cinema.dto.response.TimeSlotResponse;
import com.cinema.entity.Movie;
import com.cinema.entity.Room;
import com.cinema.entity.Showtime;
import com.cinema.enums.EntityStatus;
import com.cinema.exception.BadRequestException;
import com.cinema.exception.ResourceNotFoundException;
import com.cinema.repository.MovieRepository;
import com.cinema.repository.RoomRepository;
import com.cinema.repository.ShowtimeRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/showtimes")
@RequiredArgsConstructor
public class AdminShowtimeController {

    private final ShowtimeRepository showtimeRepository;
    private final RoomRepository roomRepository;
    private final MovieRepository movieRepository;

    @GetMapping
    @Transactional(readOnly = true)
    public ResponseEntity<?> getAllShowtimes(Pageable pageable) {
        LocalDateTime today = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0).withNano(0);
        Page<ShowtimeResponse> response = showtimeRepository.findByStartTimeGreaterThanEqualAndStatusNot(today, EntityStatus.CANCELLED, pageable)
            .map(this::toResponse);
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<?> createShowtime(@RequestBody Showtime showtime) {
        Room room = roomRepository.findById(showtime.getRoom().getRoomId())
                .orElseThrow(() -> new ResourceNotFoundException("Room not found"));
        if (room.getStatus() != EntityStatus.ACTIVE) {
            return ResponseEntity.badRequest().body("Room is not active");
        }

        if (showtime.getStartTime().isBefore(LocalDateTime.now())) {
            return ResponseEntity.badRequest().body("Cannot create showtime in the past");
        }
        if (showtimeRepository.existsOverlappingShowtime(
                showtime.getRoom().getRoomId(),
                showtime.getStartTime(),
                showtime.getEndTime())) {
            return ResponseEntity.badRequest().body("Overlapping showtime in the same room");
        }
        Showtime saved = showtimeRepository.save(showtime);
        return ResponseEntity.ok(toResponse(saved));
    }

    @GetMapping("/slots")
    public ResponseEntity<?> getAvailableSlots(
            @RequestParam UUID roomId,
            @RequestParam UUID movieId,
            @RequestParam String date) {
        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new ResourceNotFoundException("Movie not found"));
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found"));

        LocalDate localDate = LocalDate.parse(date);
        LocalDateTime dayStart = LocalDateTime.of(localDate, LocalTime.of(0, 0));
        LocalDateTime dayEnd = LocalDateTime.of(localDate, LocalTime.of(23, 59));
        LocalDateTime opStart = LocalDateTime.of(localDate, LocalTime.of(8, 30));
        LocalDateTime opEnd = LocalDateTime.of(localDate, LocalTime.of(23, 59));

        int duration = movie.getDuration() != null ? movie.getDuration() : 120;
        int totalMinutes = duration + 10;

        List<Showtime> existing = showtimeRepository.findOverlappingShowtimes(roomId, dayStart, dayEnd, EntityStatus.CANCELLED);
        LocalDateTime now = LocalDateTime.now();

        List<TimeSlotResponse> slots = new ArrayList<>();
        LocalDateTime slotTime = opStart;

        while (!slotTime.isAfter(opEnd)) {
            LocalDateTime slotEnd = slotTime.plusMinutes(totalMinutes);
            boolean available = true;
            String reason = null;

            if (slotTime.isBefore(now)) {
                available = false;
                reason = "Đã qua";
            } else {
                for (Showtime s : existing) {
                    if (slotTime.isBefore(s.getEndTime()) && slotEnd.isAfter(s.getStartTime())) {
                        available = false;
                        reason = "Trùng với suất " + s.getStartTime().toLocalTime().toString().substring(0, 5)
                                + "-" + s.getEndTime().toLocalTime().toString().substring(0, 5);
                        break;
                    }
                }
            }

            slots.add(TimeSlotResponse.builder()
                    .time(slotTime.toLocalTime().toString().substring(0, 5))
                    .available(available)
                    .conflictReason(reason)
                    .build());

            slotTime = slotTime.plusMinutes(30);
        }

        return ResponseEntity.ok(AvailableSlotsResponse.builder()
                .date(date)
                .movieDuration(duration)
                .roomName(room.getRoomName())
                .movieTitle(movie.getTitle())
                .slots(slots)
                .build());
    }

    @PostMapping("/batch")
    public ResponseEntity<?> batchCreateShowtimes(@Valid @RequestBody BatchCreateShowtimeRequest request) {
        Room room = roomRepository.findById(request.getRoomId())
                .orElseThrow(() -> new ResourceNotFoundException("Room not found"));
        if (room.getStatus() != EntityStatus.ACTIVE) {
            return ResponseEntity.badRequest().body("Phòng không hoạt động");
        }

        Movie movie = movieRepository.findById(request.getMovieId())
                .orElseThrow(() -> new ResourceNotFoundException("Movie not found"));

        int duration = movie.getDuration() != null ? movie.getDuration() : 120;
        List<LocalDateTime> sortedTimes = new ArrayList<>(request.getStartTimes());
        sortedTimes.sort(LocalDateTime::compareTo);

        List<Showtime> toSave = new ArrayList<>();

        for (int i = 0; i < sortedTimes.size(); i++) {
            LocalDateTime start = sortedTimes.get(i);
            LocalDateTime end = start.plusMinutes(duration + 10);

            if (showtimeRepository.existsOverlappingShowtime(request.getRoomId(), start, end)) {
                return ResponseEntity.badRequest().body("Suất chiếu " + start + " trùng với suất chiếu khác");
            }

            for (int j = 0; j < i; j++) {
                LocalDateTime otherStart = sortedTimes.get(j);
                LocalDateTime otherEnd = otherStart.plusMinutes(duration + 10);
                if (start.isBefore(otherEnd) && end.isAfter(otherStart)) {
                    return ResponseEntity.badRequest().body("Suất chiếu " + start + " trùng với suất " + otherStart);
                }
            }

            toSave.add(Showtime.builder()
                    .movie(movie)
                    .room(room)
                    .startTime(start)
                    .endTime(end)
                    .basePrice(request.getBasePrice())
                    .build());
        }

        List<Showtime> saved = showtimeRepository.saveAll(toSave);
        List<ShowtimeResponse> responses = saved.stream().map(this::toResponse).collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateShowtime(@PathVariable UUID id, @RequestBody Showtime showtime) {
        Showtime existing = showtimeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Showtime not found"));
        showtime.setShowtimeId(existing.getShowtimeId());
        Showtime saved = showtimeRepository.save(showtime);
        return ResponseEntity.ok(toResponse(saved));
    }

    private ShowtimeResponse toResponse(Showtime s) {
        return ShowtimeResponse.builder()
                .showtimeId(s.getShowtimeId())
                .movieId(s.getMovie().getMovieId())
                .movieTitle(s.getMovie().getTitle())
                .roomId(s.getRoom().getRoomId())
                .roomName(s.getRoom().getRoomName())
                .startTime(s.getStartTime())
                .endTime(s.getEndTime())
                .basePrice(s.getBasePrice())
                .status(s.getStatus().name())
                .build();
    }

    @PostMapping("/batch-cancel")
    public ResponseEntity<Void> batchCancelShowtimes(@RequestBody List<UUID> ids) {
        List<Showtime> showtimes = showtimeRepository.findAllById(ids);
        showtimes.forEach(st -> st.setStatus(EntityStatus.CANCELLED));
        showtimeRepository.saveAll(showtimes);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancelShowtime(@PathVariable UUID id) {
        Showtime showtime = showtimeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Showtime not found"));
        showtime.setStatus(EntityStatus.CANCELLED);
        showtimeRepository.save(showtime);
        return ResponseEntity.noContent().build();
    }
}
