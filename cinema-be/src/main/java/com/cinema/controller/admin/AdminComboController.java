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

import com.cinema.dto.request.CreateComboRequest;
import com.cinema.dto.request.UpdateComboRequest;
import com.cinema.dto.response.ComboResponse;
import com.cinema.entity.Combo;
import com.cinema.enums.EntityStatus;
import com.cinema.exception.ResourceNotFoundException;
import com.cinema.repository.ComboRepository;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/combos")
@RequiredArgsConstructor
public class AdminComboController {

    private final ComboRepository comboRepository;

    @GetMapping
    public ResponseEntity<Page<ComboResponse>> getAllCombos(Pageable pageable) {
        Page<Combo> page = comboRepository.findByStatus(EntityStatus.ACTIVE, pageable);
        return ResponseEntity.ok(page.map(this::toComboResponse));
    }

    @PostMapping
    public ResponseEntity<ComboResponse> createCombo(@Valid @RequestBody CreateComboRequest request) {
        Combo combo = Combo.builder()
                .comboName(request.getComboName())
                .description(request.getDescription())
                .price(request.getPrice())
                .imageUrl(request.getImageUrl())
                .status(EntityStatus.ACTIVE)
                .build();
        return ResponseEntity.ok(toComboResponse(comboRepository.save(combo)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ComboResponse> updateCombo(@PathVariable UUID id, @Valid @RequestBody UpdateComboRequest request) {
        Combo existing = comboRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Combo not found"));
        if (request.getComboName() != null) existing.setComboName(request.getComboName());
        if (request.getDescription() != null) existing.setDescription(request.getDescription());
        if (request.getPrice() != null) existing.setPrice(request.getPrice());
        if (request.getImageUrl() != null) existing.setImageUrl(request.getImageUrl());
        return ResponseEntity.ok(toComboResponse(comboRepository.save(existing)));
    }

    private ComboResponse toComboResponse(Combo c) {
        return ComboResponse.builder()
                .comboId(c.getComboId())
                .comboName(c.getComboName())
                .description(c.getDescription())
                .price(c.getPrice())
                .imageUrl(c.getImageUrl())
                .build();
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
