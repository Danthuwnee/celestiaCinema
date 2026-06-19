package com.cinema.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.cinema.entity.Coupon;
import com.cinema.enums.EntityStatus;

@Repository
public interface CouponRepository extends JpaRepository<Coupon, UUID> {

    Optional<Coupon> findByCode(String code);

    @Query("SELECT c FROM Coupon c WHERE c.code = :code AND c.status = 'ACTIVE' AND c.expiredAt > CURRENT_TIMESTAMP AND c.quantity > 0")
    Optional<Coupon> findActiveCouponByCode(@Param("code") String code);
}
