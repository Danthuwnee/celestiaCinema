package com.cinema.controller.admin;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.cinema.dto.request.CreateMovieRequest;
import com.cinema.dto.request.UpdateMovieRequest;
import com.cinema.dto.response.MovieResponse;
import com.cinema.entity.Genre;
import com.cinema.entity.Movie;
import com.cinema.entity.Showtime;
import com.cinema.enums.EntityStatus;
import com.cinema.exception.BadRequestException;
import com.cinema.exception.ResourceNotFoundException;
import com.cinema.repository.GenreRepository;
import com.cinema.repository.MovieRepository;
import com.cinema.repository.ShowtimeRepository;
import com.cinema.service.MovieService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/movies")
@RequiredArgsConstructor
public class AdminMovieController {

    private final MovieRepository movieRepository;
    private final MovieService movieService;
    private final GenreRepository genreRepository;
    private final ShowtimeRepository showtimeRepository;

    @GetMapping
    public ResponseEntity<Page<MovieResponse>> getAllMovies(
            @RequestParam(required = false) String keyword,
            Pageable pageable) {
        if (keyword != null && !keyword.trim().isEmpty()) {
            return ResponseEntity.ok(movieService.searchMoviesAdmin(keyword, pageable));
        }
        return ResponseEntity.ok(movieService.getMovies(null, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<MovieResponse> getMovie(@PathVariable UUID id) {
        Movie movie = movieRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Movie not found"));
        return ResponseEntity.ok(movieService.toMovieResponse(movie));
    }

    @PostMapping
    public ResponseEntity<MovieResponse> createMovie(@Valid @RequestBody CreateMovieRequest request) {
        if (request.getShowingEndDate() != null && request.getShowingStartDate() != null
                && request.getShowingEndDate().isBefore(request.getShowingStartDate())) {
            throw new BadRequestException("Ngày kết thúc phải sau ngày khởi chiếu");
        }
        Movie movie = Movie.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .duration(request.getDuration())
                .language(request.getLanguage())
                .ageRating(request.getAgeRating())
                .trailerUrl(request.getTrailerUrl())
                .posterUrl(request.getPosterUrl())
                .director(request.getDirector())
                .actors(request.getActors())
                .showingStartDate(request.getShowingStartDate())
                .showingEndDate(request.getShowingEndDate())
                .status(EntityStatus.ACTIVE)
                .build();
        if (request.getGenreIds() != null && !request.getGenreIds().isEmpty()) {
            List<Genre> genres = genreRepository.findAllById(request.getGenreIds());
            movie.setGenres(new HashSet<>(genres));
        }
        Movie saved = movieRepository.save(movie);
        return ResponseEntity.ok(movieService.toMovieResponse(saved));
    }

    @PutMapping("/{id}")
    public ResponseEntity<MovieResponse> updateMovie(@PathVariable UUID id, @Valid @RequestBody UpdateMovieRequest request) {
        Movie existing = movieRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Movie not found"));
        if (request.getTitle() != null) existing.setTitle(request.getTitle());
        if (request.getDescription() != null) existing.setDescription(request.getDescription());
        if (request.getDuration() != null) existing.setDuration(request.getDuration());
        if (request.getLanguage() != null) existing.setLanguage(request.getLanguage());
        if (request.getDirector() != null) existing.setDirector(request.getDirector());
        if (request.getActors() != null) existing.setActors(request.getActors());
        if (request.getAgeRating() != null) existing.setAgeRating(request.getAgeRating());
        if (request.getTrailerUrl() != null) existing.setTrailerUrl(request.getTrailerUrl());
        if (request.getPosterUrl() != null) existing.setPosterUrl(request.getPosterUrl());
        if (request.getShowingStartDate() != null) existing.setShowingStartDate(request.getShowingStartDate());
        if (request.getShowingEndDate() != null) {
            if (existing.getShowingStartDate() != null
                    && request.getShowingEndDate().isBefore(existing.getShowingStartDate())) {
                throw new BadRequestException("Ngày kết thúc phải sau ngày khởi chiếu");
            }
            existing.setShowingEndDate(request.getShowingEndDate());
        }
        if (request.getGenreIds() != null) {
            List<Genre> genres = genreRepository.findAllById(request.getGenreIds());
            existing.setGenres(new HashSet<>(genres));
        }
        Movie saved = movieRepository.save(existing);
        return ResponseEntity.ok(movieService.toMovieResponse(saved));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<MovieResponse> updateMovieStatus(
            @PathVariable UUID id,
            @RequestParam EntityStatus status) {
        Movie movie = movieRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Movie not found"));
        if (status == EntityStatus.INACTIVE) {
            List<Showtime> activeShowtimes = showtimeRepository
                    .findByMovieMovieIdAndStatusOrderByStartTimeAsc(id, EntityStatus.ACTIVE);
            if (!activeShowtimes.isEmpty()) {
                throw new BadRequestException("Không thể chuyển sang INACTIVE vì phim còn suất chiếu đang hoạt động");
            }
        }
        movie.setStatus(status);
        Movie saved = movieRepository.save(movie);
        return ResponseEntity.ok(movieService.toMovieResponse(saved));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> softDeleteMovie(@PathVariable UUID id) {
        Movie movie = movieRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Movie not found"));
        List<Showtime> activeShowtimes = showtimeRepository
                .findByMovieMovieIdAndStatusOrderByStartTimeAsc(id, EntityStatus.ACTIVE);
        if (!activeShowtimes.isEmpty()) {
            throw new BadRequestException("Không thể xóa phim vì còn suất chiếu đang hoạt động");
        }
        movie.setStatus(EntityStatus.INACTIVE);
        movieRepository.save(movie);
        return ResponseEntity.noContent().build();
    }
}
