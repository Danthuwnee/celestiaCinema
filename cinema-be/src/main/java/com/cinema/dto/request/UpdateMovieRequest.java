package com.cinema.dto.request;

import java.time.LocalDate;

import com.cinema.enums.AgeRating;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateMovieRequest {
    private String title;
    private String description;
    private Integer duration;
    private String language;
    private AgeRating ageRating;
    private String trailerUrl;
    private String posterUrl;
    private String director;
    private String actors;
    private LocalDate showingStartDate;
    private LocalDate showingEndDate;
}
