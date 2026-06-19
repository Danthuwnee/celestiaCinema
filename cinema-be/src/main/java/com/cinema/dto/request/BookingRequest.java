package com.cinema.dto.request;

import java.util.List;
import java.util.UUID;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BookingRequest {

    @NotNull
    private UUID showtimeId;

    @NotEmpty
    @Size(max = 8)
    private List<UUID> seatIds;

    private List<ComboItem> combos;

    private String couponCode;

    @Getter
    @Setter
    public static class ComboItem {
        @NotNull
        private UUID comboId;
        @NotNull
        private Integer quantity;
    }
}
