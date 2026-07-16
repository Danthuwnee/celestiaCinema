package com.cinema.service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.scheduling.TaskScheduler;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.transaction.annotation.Transactional;

import com.cinema.dto.response.BookingResponse;
import com.cinema.entity.Booking;
import com.cinema.entity.BookingCombo;
import com.cinema.entity.BookingSeat;
import com.cinema.entity.Payment;
import com.cinema.entity.Showtime;
import com.cinema.enums.BookingStatus;
import com.cinema.enums.PaymentStatus;
import com.cinema.exception.BadRequestException;
import com.cinema.exception.ResourceNotFoundException;
import com.cinema.repository.BookingComboRepository;
import com.cinema.repository.BookingRepository;
import com.cinema.repository.BookingSeatRepository;
import com.cinema.repository.PaymentRepository;
import com.cinema.security.UserPrincipal;
import com.cinema.zalopay.ZaloPayService;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PaymentService {

    @Lazy
    @Autowired
    private PaymentService self;

    private final BookingRepository bookingRepository;
    private final PaymentRepository paymentRepository;
    private final BookingSeatRepository bookingSeatRepository;
    private final BookingComboRepository bookingComboRepository;
    private final TaskScheduler taskScheduler;
    private final ZaloPayService zaloPayService;
    private final ObjectMapper objectMapper;

    private static final long SIMULATE_DELAY_MS = 15_000;

    @Transactional
    public BookingResponse initiateBankPayment(UUID bookingId, UserPrincipal principal) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        UUID userId = UUID.fromString(principal.getUserId());
        if (!booking.getUser().getUserId().equals(userId)) {
            throw new BadRequestException("Booking does not belong to this user");
        }

        if (booking.getBookingStatus() != BookingStatus.PENDING) {
            throw new BadRequestException("Booking is not in PENDING status");
        }

        String txnCode = "BANK-" + bookingId.toString().substring(0, 8).toUpperCase();

        Payment payment = Payment.builder()
                .booking(booking)
                .paymentMethod("BANK_TRANSFER")
                .paymentStatus(PaymentStatus.PENDING)
                .transactionCode(txnCode)
                .build();
        paymentRepository.save(payment);

        scheduleSimulatePayment(payment.getPaymentId());

        return buildBookingResponse(booking, payment);
    }

    private void scheduleSimulatePayment(UUID paymentId) {
        taskScheduler.schedule(() -> {
            try {
                self.completePayment(paymentId);
            } catch (Exception e) {
                System.err.println("Simulate payment failed for payment " + paymentId + ": " + e.getMessage());
            }
        }, new java.util.Date(System.currentTimeMillis() + SIMULATE_DELAY_MS));
    }

    @Transactional
    public void completePayment(UUID paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found"));

        if (payment.getPaymentStatus() != PaymentStatus.PENDING) {
            return;
        }

        payment.setPaymentStatus(PaymentStatus.SUCCESS);
        payment.setPaidAt(LocalDateTime.now());

        Booking booking = payment.getBooking();
        booking.setBookingStatus(BookingStatus.PAID);
    }

    @Transactional
    public Map<String, Object> initiateZaloPayPayment(UUID bookingId, UserPrincipal principal) throws Exception {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        UUID userId = UUID.fromString(principal.getUserId());
        if (!booking.getUser().getUserId().equals(userId)) {
            throw new BadRequestException("Booking does not belong to this user");
        }
        if (booking.getBookingStatus() != BookingStatus.PENDING) {
            throw new BadRequestException("Booking is not in PENDING status");
        }

        String appUserId = principal.getUserId();
        long amount = booking.getTotalAmount().longValue();

        Map<String, Object> embedDataMap = new HashMap<>();
        embedDataMap.put("booking_id", bookingId.toString());
        String embedData = objectMapper.writeValueAsString(embedDataMap);

        String description = "Thanh toan ve xem phim";

        Map<String, Object> zpResult = zaloPayService.createOrder(appUserId, amount, description, embedData);
        String appTransId = (String) zpResult.get("app_trans_id");
        String orderUrl = (String) zpResult.get("order_url");

        String returnCode = String.valueOf(zpResult.get("return_code"));
        if (!"1".equals(returnCode)) {
            throw new RuntimeException("ZaloPay create order failed: " + zpResult.get("return_message"));
        }

        Payment payment = Payment.builder()
                .booking(booking)
                .paymentMethod("ZALOPAY")
                .paymentStatus(PaymentStatus.PENDING)
                .transactionCode(appTransId)
                .build();
        paymentRepository.save(payment);

        Map<String, Object> result = new HashMap<>();
        result.put("orderUrl", orderUrl);
        result.put("appTransId", appTransId);
        result.put("bookingId", bookingId.toString());
        return result;
    }

    @Transactional
    public void handleZaloPayIpn(Map<String, String> ipnData) throws Exception {
        if (!zaloPayService.verifyCallback(ipnData)) {
            throw new BadRequestException("Invalid MAC");
        }

        String dataJson = ipnData.get("data");
        Map<String, Object> data = objectMapper.readValue(dataJson, new TypeReference<Map<String, Object>>() {});

        String appTransId = (String) data.get("app_trans_id");
        String zpTransId = String.valueOf(data.get("zp_trans_id"));
        int returnCode = (int) data.get("return_code");

        Payment payment = paymentRepository.findByTransactionCode(appTransId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found for " + appTransId));

        if (payment.getPaymentStatus() != PaymentStatus.PENDING) return;

        if (returnCode == 1) {
            payment.setPaymentStatus(PaymentStatus.SUCCESS);
            payment.setPaidAt(LocalDateTime.now());
            payment.setZpTransId(zpTransId);
            payment.getBooking().setBookingStatus(BookingStatus.PAID);
        } else {
            payment.setPaymentStatus(PaymentStatus.FAILED);
        }
    }

    public Map<String, Object> getPaymentStatus(UUID bookingId, UserPrincipal principal) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        UUID userId = UUID.fromString(principal.getUserId());
        if (!booking.getUser().getUserId().equals(userId)) {
            throw new BadRequestException("Booking does not belong to this user");
        }

        Map<String, Object> result = new HashMap<>();
        result.put("bookingStatus", booking.getBookingStatus().name());

        paymentRepository.findByBookingBookingId(bookingId)
                .ifPresent(p -> {
                    result.put("paymentStatus", p.getPaymentStatus().name());
                });

        return result;
    }

    private BookingResponse buildBookingResponse(Booking booking, Payment payment) {
        List<BookingSeat> bookingSeats = bookingSeatRepository
                .findByBookingBookingId(booking.getBookingId());
        List<BookingCombo> bookingCombos = bookingComboRepository
                .findByBookingBookingId(booking.getBookingId());

        List<String> seatLabels = bookingSeats.stream()
                .map(bs -> bs.getSeat().getRowLabel() + bs.getSeat().getSeatNumber())
                .toList();

        Showtime showtime = bookingSeats.isEmpty() ? null : bookingSeats.get(0).getShowtime();

        List<BookingResponse.ComboItemResponse> combos = bookingCombos.stream()
                .map(bc -> BookingResponse.ComboItemResponse.builder()
                        .comboName(bc.getCombo().getComboName())
                        .quantity(bc.getQuantity())
                        .priceAtPurchase(bc.getPriceAtPurchase())
                        .build())
                .toList();

        BookingResponse.PaymentInfoResponse paymentInfo = BookingResponse.PaymentInfoResponse.builder()
                .paymentMethod(payment.getPaymentMethod())
                .transactionCode(payment.getTransactionCode())
                .paymentStatus(payment.getPaymentStatus().name())
                .paidAt(payment.getPaidAt())
                .build();

        return BookingResponse.builder()
                .bookingId(booking.getBookingId())
                .bookingStatus(booking.getBookingStatus().name())
                .totalAmount(booking.getTotalAmount())
                .createdAt(booking.getCreatedAt())
                .movieTitle(showtime != null ? showtime.getMovie().getTitle() : null)
                .roomName(showtime != null ? showtime.getRoom().getRoomName() : null)
                .showtimeStart(showtime != null ? showtime.getStartTime() : null)
                .seatLabels(seatLabels)
                .combos(combos)
                .couponCode(booking.getCoupon() != null ? booking.getCoupon().getCode() : null)
                .payment(paymentInfo)
                .build();
    }
}
