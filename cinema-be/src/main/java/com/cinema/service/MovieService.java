package com.cinema.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.UUID;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cinema.dto.response.GenreResponse;
import com.cinema.dto.response.MovieResponse;
import com.cinema.dto.response.MovieWithShowtimesResponse;
import com.cinema.dto.response.ShowtimeResponse;
import com.cinema.entity.Movie;
import com.cinema.entity.Showtime;
import com.cinema.enums.EntityStatus;
import com.cinema.exception.ResourceNotFoundException;
import com.cinema.repository.MovieRepository;
import com.cinema.repository.ShowtimeRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MovieService {

    private final MovieRepository movieRepository;
    private final ShowtimeRepository showtimeRepository;

    public Page<MovieResponse> getMovies(String status, Pageable pageable) {
        Page<Movie> movies;
        if (status != null) {
            movies = movieRepository.findByStatus(EntityStatus.valueOf(status.toUpperCase()), pageable);
        } else {
            movies = movieRepository.findAll(pageable);
        }
        return movies.map(this::toMovieResponse);
    }

    public Page<MovieResponse> getNowShowing(Pageable pageable) {
        return movieRepository.findNowShowing(LocalDate.now(), pageable)
                .map(this::toMovieResponse);
    }

    public Page<MovieResponse> getComingSoon(Pageable pageable) {
        return movieRepository.findComingSoon(LocalDate.now(), pageable)
                .map(this::toMovieResponse);
    }

    public MovieResponse getMovieDetail(UUID movieId) {
        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new ResourceNotFoundException("Movie not found"));
        return toMovieResponse(movie);
    }

    @Transactional(readOnly = true)
    public List<MovieWithShowtimesResponse> getSchedule(LocalDate date) {
        LocalDateTime start = date.atStartOfDay();
        LocalDateTime end = date.plusDays(1).atStartOfDay();

        List<Showtime> showtimes = showtimeRepository.findActiveShowtimesByDate(start, end);

        Map<Movie, List<Showtime>> grouped = showtimes.stream()
                .collect(Collectors.groupingBy(Showtime::getMovie));

        return grouped.entrySet().stream()
                .map(entry -> {
                    Movie movie = entry.getKey();
                    List<ShowtimeResponse> stResponses = entry.getValue().stream()
                            .map(this::toShowtimeResponse)
                            .toList();
                    return MovieWithShowtimesResponse.builder()
                            .movieId(movie.getMovieId())
                            .title(movie.getTitle())
                            .description(movie.getDescription())
                            .duration(movie.getDuration())
                            .language(movie.getLanguage())
                            .languageDisplay(movie.getLanguageDisplay())
                            .ageRating(movie.getAgeRating().name())
                            .posterUrl(movie.getPosterUrl())
                            .director(movie.getDirector())
                            .actors(movie.getActors())
                            .showingStartDate(movie.getShowingStartDate())
                            .showingEndDate(movie.getShowingEndDate())
                            .genres(movie.getGenres().stream().map(g ->
                                    GenreResponse.builder()
                                            .genreId(g.getGenreId())
                                            .name(g.getName())
                                            .slug(g.getSlug())
                                            .build()
                            ).toList())
                            .showtimes(stResponses)
                            .build();
                })
                .toList();
    }

    public Page<MovieResponse> searchMovies(String keyword, Pageable pageable) {
        List<EntityStatus> statuses = List.of(EntityStatus.ACTIVE, EntityStatus.COMING_SOON);
        List<Movie> all = movieRepository.findAll();

        List<Movie> matched = all.stream()
                .filter(m -> statuses.contains(m.getStatus()))
                .filter(m -> keyword == null || keyword.trim().isEmpty() || matchesAllWords(m.getTitle(), keyword))
                .toList();

        int start = (int) pageable.getOffset();
        int end = Math.min(start + pageable.getPageSize(), matched.size());
        List<Movie> pageContent = start >= matched.size() ? List.of() : matched.subList(start, end);

        return new PageImpl<>(
                pageContent.stream().map(this::toMovieResponse).toList(),
                pageable,
                matched.size()
        );
    }

    private boolean matchesAllWords(String title, String keyword) {
        String[] words = keyword.trim().toLowerCase(Locale.ROOT).split("\\s+");
        String lowerTitle = title.toLowerCase(Locale.ROOT);
        for (String word : words) {
            if (!lowerTitle.matches(".*\\b" + Pattern.quote(word) + "\\b.*")) {
                return false;
            }
        }
        return true;
    }

    public Page<MovieResponse> searchMoviesAdmin(String keyword, Pageable pageable) {
        return movieRepository.findByTitleContainingIgnoreCase(keyword, pageable)
                .map(this::toMovieResponse);
    }

    public Page<MovieResponse> filterByGenres(List<UUID> genreIds, Pageable pageable) {
        List<EntityStatus> statuses = List.of(EntityStatus.ACTIVE, EntityStatus.COMING_SOON);
        return movieRepository.filterByGenres(genreIds, statuses, pageable)
                .map(this::toMovieResponse);
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

    private MovieResponse toMovieResponse(Movie movie) {
        return MovieResponse.builder()
                .movieId(movie.getMovieId())
                .title(movie.getTitle())
                .description(movie.getDescription())
                .duration(movie.getDuration())
                .language(movie.getLanguage())
                .languageDisplay(movie.getLanguageDisplay())
                .ageRating(movie.getAgeRating().name())
                .trailerUrl(movie.getTrailerUrl())
                .posterUrl(movie.getPosterUrl())
                .director(movie.getDirector())
                .actors(movie.getActors())
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
