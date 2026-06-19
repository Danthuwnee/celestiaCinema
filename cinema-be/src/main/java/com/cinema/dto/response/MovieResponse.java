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
public class MovieResponse {

    private UUID movieId;
    private String title;
    private String description;
    private Integer duration;
    private String language;
    private String ageRating;
    private String trailerUrl;
    private String posterUrl;
    private LocalDate showingStartDate;
    private LocalDate showingEndDate;
    private String status;
    private List<GenreResponse> genres;
}
