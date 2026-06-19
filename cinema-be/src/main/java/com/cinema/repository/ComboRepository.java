package com.cinema.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.cinema.entity.Combo;
import com.cinema.enums.EntityStatus;

@Repository
public interface ComboRepository extends JpaRepository<Combo, UUID> {

    List<Combo> findByStatus(EntityStatus status);
}
