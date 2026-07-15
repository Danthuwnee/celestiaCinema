package com.cinema.controller.admin;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cinema.dto.request.CreateCouponRequest;
import com.cinema.dto.request.UpdateCouponRequest;
import com.cinema.entity.Coupon;
import com.cinema.enums.EntityStatus;
import com.cinema.exception.ResourceNotFoundException;
import com.cinema.repository.CouponRepository;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/coupons")
@RequiredArgsConstructor
public class AdminCouponController {

    private final CouponRepository couponRepository;

    @GetMapping
    public ResponseEntity<Page<Coupon>> getAllCoupons(Pageable pageable) {
        return ResponseEntity.ok(couponRepository.findByStatus(EntityStatus.ACTIVE, pageable));
    }

    @PostMapping
    public ResponseEntity<Coupon> createCoupon(@Valid @RequestBody CreateCouponRequest request) {
        Coupon coupon = Coupon.builder()
                .code(request.getCode())
                .discountType(request.getDiscountType())
                .discountValue(request.getDiscountValue())
                .quantity(request.getQuantity())
                .minOrderValue(request.getMinOrderValue())
                .expiredAt(request.getExpiredAt())
                .status(EntityStatus.ACTIVE)
                .build();
        return ResponseEntity.ok(couponRepository.save(coupon));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Coupon> updateCoupon(@PathVariable UUID id, @Valid @RequestBody UpdateCouponRequest request) {
        Coupon existing = couponRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Coupon not found"));
        if (request.getCode() != null) existing.setCode(request.getCode());
        if (request.getDiscountType() != null) existing.setDiscountType(request.getDiscountType());
        if (request.getDiscountValue() != null) existing.setDiscountValue(request.getDiscountValue());
        if (request.getQuantity() != null) existing.setQuantity(request.getQuantity());
        if (request.getMinOrderValue() != null) existing.setMinOrderValue(request.getMinOrderValue());
        if (request.getExpiredAt() != null) existing.setExpiredAt(request.getExpiredAt());
        return ResponseEntity.ok(couponRepository.save(existing));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCoupon(@PathVariable UUID id) {
        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Coupon not found"));
        coupon.setStatus(EntityStatus.INACTIVE);
        couponRepository.save(coupon);
        return ResponseEntity.noContent().build();
    }
}
