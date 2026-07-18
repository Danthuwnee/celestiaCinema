package com.cinema.controller;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.cinema.dto.response.MovieResponse;
import com.cinema.dto.response.MovieWithShowtimesResponse;
import com.cinema.service.MovieService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/movies")
@RequiredArgsConstructor
public class MovieController {

    private final MovieService movieService;

    @GetMapping
    public ResponseEntity<Page<MovieResponse>> getMovies(
            @RequestParam(required = false) String status,
            Pageable pageable) {
        return ResponseEntity.ok(movieService.getMovies(status, pageable));
    }

    @GetMapping("/schedule")
    public ResponseEntity<List<MovieWithShowtimesResponse>> getSchedule(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(movieService.getSchedule(date));
    }

    @GetMapping("/now-showing")
    public ResponseEntity<Page<MovieResponse>> getNowShowing(Pageable pageable) {
        return ResponseEntity.ok(movieService.getNowShowing(pageable));
    }

    @GetMapping("/hero")
    public ResponseEntity<Page<MovieResponse>> getHeroMovies(Pageable pageable) {
        return ResponseEntity.ok(movieService.getNowShowing(pageable));
    }

    @GetMapping("/coming-soon")
    public ResponseEntity<Page<MovieResponse>> getComingSoon(Pageable pageable) {
        return ResponseEntity.ok(movieService.getComingSoon(pageable));
    }

    @GetMapping("/search")
    public ResponseEntity<Page<MovieResponse>> searchMovies(
            @RequestParam String keyword,
            Pageable pageable) {
        return ResponseEntity.ok(movieService.searchMovies(keyword, pageable));
    }

    @GetMapping("/filter")
    public ResponseEntity<Page<MovieResponse>> filterByGenres(
            @RequestParam List<UUID> genreIds,
            Pageable pageable) {
        return ResponseEntity.ok(movieService.filterByGenres(genreIds, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<MovieResponse> getMovieDetail(@PathVariable UUID id) {
        return ResponseEntity.ok(movieService.getMovieDetail(id));
    }
}
