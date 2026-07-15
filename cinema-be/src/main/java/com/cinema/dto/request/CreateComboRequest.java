package com.cinema.dto.request;

import java.math.BigDecimal;

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
public class CreateComboRequest {
    @NotBlank(message = "Tên combo không được để trống")
    private String comboName;

    private String description;

    @NotNull(message = "Giá không được để trống")
    @Min(value = 0, message = "Giá không thể âm")
    private BigDecimal price;

    private String imageUrl;
}
