package com.cinema.dto.request;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.cinema.enums.DiscountType;

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
public class UpdateCouponRequest {
    private String code;
    private DiscountType discountType;
    private BigDecimal discountValue;
    private Integer quantity;
    private BigDecimal minOrderValue;
    private LocalDateTime expiredAt;
}
