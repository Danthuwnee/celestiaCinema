package com.cinema.dto.response;

import java.math.BigDecimal;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@Builder
public class ComboResponse {

    private UUID comboId;
    private String comboName;
    private String description;
    private BigDecimal price;
    private String imageUrl;
}
