package com.cinema.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cinema.entity.Combo;
import com.cinema.enums.EntityStatus;
import com.cinema.repository.ComboRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/combos")
@RequiredArgsConstructor
public class ComboController {

    private final ComboRepository comboRepository;

    @GetMapping
    public ResponseEntity<List<Combo>> getActiveCombos() {
        return ResponseEntity.ok(comboRepository.findByStatus(EntityStatus.ACTIVE));
    }
}
