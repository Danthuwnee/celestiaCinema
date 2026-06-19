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
public class SeatResponse {

    private UUID seatId;
    private String rowLabel;
    private Integer seatNumber;
    private UUID seatTypeId;
    private String seatTypeName;
    private BigDecimal priceMultiplier;
    private String colorHex;
    private BigDecimal calculatedPrice;
    private String status;
}
