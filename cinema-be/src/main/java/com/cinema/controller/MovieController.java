package com.cinema.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.cinema.dto.response.MovieResponse;
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

    @GetMapping("/now-showing")
    public ResponseEntity<List<MovieResponse>> getNowShowing() {
        return ResponseEntity.ok(movieService.getNowShowing());
    }

    @GetMapping("/coming-soon")
    public ResponseEntity<List<MovieResponse>> getComingSoon() {
        return ResponseEntity.ok(movieService.getComingSoon());
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
