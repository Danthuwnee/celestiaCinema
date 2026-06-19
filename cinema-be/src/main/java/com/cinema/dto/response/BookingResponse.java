package com.cinema.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@Builder
public class BookingResponse {

    private UUID bookingId;
    private String bookingStatus;
    private BigDecimal totalAmount;
    private LocalDateTime createdAt;
    private String movieTitle;
    private String roomName;
    private LocalDateTime showtimeStart;
    private List<String> seatLabels;
    private List<ComboItemResponse> combos;
    private String couponCode;
    private PaymentInfoResponse payment;

    @Getter
    @Setter
    @AllArgsConstructor
    @Builder
    public static class ComboItemResponse {
        private String comboName;
        private Integer quantity;
        private BigDecimal priceAtPurchase;
    }

    @Getter
    @Setter
    @AllArgsConstructor
    @Builder
    public static class PaymentInfoResponse {
        private String paymentMethod;
        private String transactionCode;
        private String paymentStatus;
        private LocalDateTime paidAt;
    }
}
