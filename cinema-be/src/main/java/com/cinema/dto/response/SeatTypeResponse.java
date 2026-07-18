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
public class SeatTypeResponse {

    private UUID seatTypeId;
    private String typeName;
    private BigDecimal priceMultiplier;
    private String colorHex;
}
