package com.cinema.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.cinema.dto.response.CouponResponse;
import com.cinema.entity.Coupon;
import com.cinema.enums.DiscountType;
import com.cinema.exception.BadRequestException;
import com.cinema.repository.CouponRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CouponService {

    private final CouponRepository couponRepository;

    public List<CouponResponse> getActiveCoupons() {
        return couponRepository.findAllActiveCoupons().stream()
                .map(c -> CouponResponse.builder()
                        .code(c.getCode())
                        .discountType(c.getDiscountType().name())
                        .discountValue(c.getDiscountValue())
                        .minOrderValue(c.getMinOrderValue())
                        .build())
                .collect(Collectors.toList());
    }

    public CouponResponse applyCoupon(String code, BigDecimal orderAmount) {
        if (code == null || orderAmount == null) {
            throw new BadRequestException("Mã giảm giá hoặc số tiền không hợp lệ");
        }
        Coupon coupon = couponRepository.findActiveCouponByCode(code)
                .orElseThrow(() -> new BadRequestException("Invalid or expired coupon code"));

        if (orderAmount.compareTo(coupon.getMinOrderValue()) < 0) {
            throw new BadRequestException(
                "Minimum order value is " + coupon.getMinOrderValue() + " for this coupon");
        }

        BigDecimal discountedAmount;
        if (coupon.getDiscountType() == DiscountType.PERCENTAGE) {
            discountedAmount = orderAmount.multiply(coupon.getDiscountValue())
                    .divide(BigDecimal.valueOf(100), 0, RoundingMode.DOWN);
        } else {
            discountedAmount = coupon.getDiscountValue();
        }

        if (discountedAmount.compareTo(orderAmount) > 0) {
            discountedAmount = orderAmount;
        }

        BigDecimal finalAmount = orderAmount.subtract(discountedAmount);

        return CouponResponse.builder()
                .code(coupon.getCode())
                .discountType(coupon.getDiscountType().name())
                .discountValue(coupon.getDiscountValue())
                .minOrderValue(coupon.getMinOrderValue())
                .discountedAmount(discountedAmount)
                .finalAmount(finalAmount)
                .build();
    }

    public void decrementCouponQuantity(Coupon coupon) {
        coupon.setQuantity(coupon.getQuantity() - 1);
        couponRepository.save(coupon);
    }

    public Coupon findActiveCoupon(String code) {
        return couponRepository.findActiveCouponByCode(code)
                .orElse(null);
    }
}
