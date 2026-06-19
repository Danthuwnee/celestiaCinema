package com.cinema.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cinema.dto.response.GenreResponse;
import com.cinema.repository.GenreRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/genres")
@RequiredArgsConstructor
public class GenreController {

    private final GenreRepository genreRepository;

    @GetMapping
    public ResponseEntity<List<GenreResponse>> getAllGenres() {
        List<GenreResponse> genres = genreRepository.findAll().stream()
                .map(g -> GenreResponse.builder()
                        .genreId(g.getGenreId())
                        .name(g.getName())
                        .slug(g.getSlug())
                        .build())
                .toList();
        return ResponseEntity.ok(genres);
    }
}
