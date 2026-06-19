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

import com.cinema.entity.Combo;
import com.cinema.enums.EntityStatus;
import com.cinema.exception.ResourceNotFoundException;
import com.cinema.repository.ComboRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/combos")
@RequiredArgsConstructor
public class AdminComboController {

    private final ComboRepository comboRepository;

    @GetMapping
    public ResponseEntity<Page<Combo>> getAllCombos(Pageable pageable) {
        return ResponseEntity.ok(comboRepository.findAll(pageable));
    }

    @PostMapping
    public ResponseEntity<Combo> createCombo(@RequestBody Combo combo) {
        return ResponseEntity.ok(comboRepository.save(combo));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Combo> updateCombo(@PathVariable UUID id, @RequestBody Combo combo) {
        combo.setComboId(id);
        return ResponseEntity.ok(comboRepository.save(combo));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> softDeleteCombo(@PathVariable UUID id) {
        Combo combo = comboRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Combo not found"));
        combo.setStatus(EntityStatus.INACTIVE);
        comboRepository.save(combo);
        return ResponseEntity.noContent().build();
    }
}
