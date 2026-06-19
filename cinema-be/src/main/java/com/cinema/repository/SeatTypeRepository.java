package com.cinema.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.cinema.entity.SeatType;

@Repository
public interface SeatTypeRepository extends JpaRepository<SeatType, UUID> {
}
