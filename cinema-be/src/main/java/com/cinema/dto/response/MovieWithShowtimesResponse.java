package com.cinema.dto.response;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@Builder
public class MovieWithShowtimesResponse {

    private UUID movieId;
    private String title;
    private String description;
    private Integer duration;
    private String language;
    private String languageDisplay;
    private String ageRating;
    private String posterUrl;
    private String director;
    private String actors;
    private LocalDate showingStartDate;
    private LocalDate showingEndDate;
    private List<GenreResponse> genres;
    private List<ShowtimeResponse> showtimes;
}
