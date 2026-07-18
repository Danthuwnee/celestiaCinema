package com.cinema.dto.request;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import com.cinema.enums.AgeRating;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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
public class CreateMovieRequest {
    @NotBlank(message = "Tên phim không được để trống")
    private String title;

    private String description;

    @NotNull(message = "Thời lượng không được để trống")
    @Min(value = 1, message = "Thời lượng phải lớn hơn 0")
    private Integer duration;

    @NotBlank(message = "Ngôn ngữ không được để trống")
    private String language;

    @NotNull(message = "Phân loại không được để trống")
    private AgeRating ageRating;

    private String trailerUrl;
    private String posterUrl;
    private String director;
    private String actors;

    @NotNull(message = "Ngày khởi chiếu không được để trống")
    private LocalDate showingStartDate;

    @NotNull(message = "Ngày kết thúc không được để trống")
    private LocalDate showingEndDate;

    private List<UUID> genreIds;
}
