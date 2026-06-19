package com.cinema.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cinema.dto.response.ShowtimeResponse;
import com.cinema.entity.Showtime;
import com.cinema.exception.ResourceNotFoundException;
import com.cinema.repository.ShowtimeRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ShowtimeService {

    private final ShowtimeRepository showtimeRepository;

    @Transactional(readOnly = true)
    public List<ShowtimeResponse> getShowtimesByMovie(UUID movieId) {
        return showtimeRepository.findAvailableShowtimes(movieId, LocalDateTime.now())
                .stream().map(this::toShowtimeResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Showtime getActiveShowtime(UUID showtimeId) {
        return showtimeRepository.findActiveById(showtimeId)
                .orElseThrow(() -> new ResourceNotFoundException("Showtime not found or inactive"));
    }

    @Transactional(readOnly = true)
    public ShowtimeResponse getShowtimeDetail(UUID showtimeId) {
        Showtime showtime = getActiveShowtime(showtimeId);
        return toShowtimeResponse(showtime);
    }

    private ShowtimeResponse toShowtimeResponse(Showtime showtime) {
        return ShowtimeResponse.builder()
                .showtimeId(showtime.getShowtimeId())
                .movieId(showtime.getMovie().getMovieId())
                .movieTitle(showtime.getMovie().getTitle())
                .roomId(showtime.getRoom().getRoomId())
                .roomName(showtime.getRoom().getRoomName())
                .startTime(showtime.getStartTime())
                .endTime(showtime.getEndTime())
                .basePrice(showtime.getBasePrice())
                .status(showtime.getStatus().name())
                .build();
    }
}
