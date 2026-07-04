package com.cinema.dto.request;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
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
public class BatchCreateShowtimeRequest {

    @NotNull
    private UUID movieId;

    @NotNull
    private UUID roomId;

    @NotNull
    @Min(0)
    private BigDecimal basePrice;

    @NotEmpty
    private List<@NotNull LocalDateTime> startTimes;
}
