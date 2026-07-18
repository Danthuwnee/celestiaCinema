package com.cinema.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@Builder
public class AdminCouponResponse {

    private UUID couponId;
    private String code;
    private String discountType;
    private BigDecimal discountValue;
    private Integer quantity;
    private BigDecimal minOrderValue;
    private LocalDateTime expiredAt;
    private String status;
}
