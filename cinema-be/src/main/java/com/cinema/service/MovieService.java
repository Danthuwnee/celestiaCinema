package com.cinema.service;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cinema.dto.response.GenreResponse;
import com.cinema.dto.response.MovieResponse;
import com.cinema.entity.Movie;
import com.cinema.enums.EntityStatus;
import com.cinema.exception.ResourceNotFoundException;
import com.cinema.repository.MovieRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MovieService {

    private final MovieRepository movieRepository;

    public Page<MovieResponse> getMovies(String status, Pageable pageable) {
        Page<Movie> movies;
        if (status != null) {
            movies = movieRepository.findByStatus(EntityStatus.valueOf(status.toUpperCase()), pageable);
        } else {
            movies = movieRepository.findAll(pageable);
        }
        return movies.map(this::toMovieResponse);
    }

    public List<MovieResponse> getNowShowing() {
        return movieRepository.findNowShowing(LocalDate.now())
                .stream().map(this::toMovieResponse).collect(Collectors.toList());
    }

    public List<MovieResponse> getComingSoon() {
        return movieRepository.findComingSoon(LocalDate.now())
                .stream().map(this::toMovieResponse).collect(Collectors.toList());
    }

    public MovieResponse getMovieDetail(UUID movieId) {
        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new ResourceNotFoundException("Movie not found"));
        return toMovieResponse(movie);
    }

    public Page<MovieResponse> searchMovies(String keyword, Pageable pageable) {
        List<EntityStatus> statuses = List.of(EntityStatus.ACTIVE, EntityStatus.COMING_SOON);
        return movieRepository.searchByTitle(keyword, statuses, pageable)
                .map(this::toMovieResponse);
    }

    public Page<MovieResponse> filterByGenres(List<UUID> genreIds, Pageable pageable) {
        List<EntityStatus> statuses = List.of(EntityStatus.ACTIVE, EntityStatus.COMING_SOON);
        return movieRepository.filterByGenres(genreIds, statuses, pageable)
                .map(this::toMovieResponse);
    }

    private MovieResponse toMovieResponse(Movie movie) {
        return MovieResponse.builder()
                .movieId(movie.getMovieId())
                .title(movie.getTitle())
                .description(movie.getDescription())
                .duration(movie.getDuration())
                .language(movie.getLanguage())
                .ageRating(movie.getAgeRating().name())
                .trailerUrl(movie.getTrailerUrl())
                .posterUrl(movie.getPosterUrl())
                .showingStartDate(movie.getShowingStartDate())
                .showingEndDate(movie.getShowingEndDate())
                .status(movie.getStatus().name())
                .genres(movie.getGenres().stream().map(g ->
                        GenreResponse.builder()
                                .genreId(g.getGenreId())
                                .name(g.getName())
                                .slug(g.getSlug())
                                .build()
                ).toList())
                .build();
    }
}
