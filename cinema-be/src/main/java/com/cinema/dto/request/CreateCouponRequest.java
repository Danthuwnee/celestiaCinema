package com.cinema.dto.request;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.cinema.enums.DiscountType;

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
public class CreateCouponRequest {
    @NotBlank(message = "Mã code không được để trống")
    private String code;

    @NotNull(message = "Loại giảm giá không được để trống")
    private DiscountType discountType;

    @NotNull(message = "Giá trị không được để trống")
    @Min(value = 1, message = "Giá trị phải lớn hơn 0")
    private BigDecimal discountValue;

    @NotNull(message = "Số lượng không được để trống")
    @Min(value = 0, message = "Số lượng không thể âm")
    private Integer quantity;

    @NotNull(message = "Đơn tối thiểu không được để trống")
    @Min(value = 0, message = "Đơn tối thiểu không thể âm")
    private BigDecimal minOrderValue;

    @NotNull(message = "Ngày hết hạn không được để trống")
    private LocalDateTime expiredAt;
}
