package com.cinema.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cinema.dto.request.BookingRequest;
import com.cinema.dto.response.BookingResponse;
import com.cinema.dto.response.CouponResponse;
import com.cinema.entity.Booking;
import com.cinema.entity.BookingCombo;
import com.cinema.entity.BookingSeat;
import com.cinema.entity.Combo;
import com.cinema.entity.Coupon;
import com.cinema.entity.Payment;
import com.cinema.entity.Seat;
import com.cinema.entity.Showtime;
import com.cinema.entity.User;
import com.cinema.enums.BookingStatus;
import com.cinema.enums.PaymentStatus;
import com.cinema.exception.BadRequestException;
import com.cinema.exception.ResourceNotFoundException;
import com.cinema.repository.BookingComboRepository;
import com.cinema.repository.BookingRepository;
import com.cinema.repository.BookingSeatRepository;
import com.cinema.repository.ComboRepository;
import com.cinema.repository.PaymentRepository;
import com.cinema.repository.SeatRepository;
import com.cinema.repository.UserRepository;
import com.cinema.security.UserPrincipal;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final BookingSeatRepository bookingSeatRepository;
    private final BookingComboRepository bookingComboRepository;
    private final UserRepository userRepository;
    private final SeatRepository seatRepository;
    private final ComboRepository comboRepository;
    private final ShowtimeService showtimeService;
    private final SeatService seatService;
    private final CouponService couponService;
    private final PaymentRepository paymentRepository;
    private final SimpMessagingTemplate messagingTemplate;

    @Transactional
    public BookingResponse createBooking(UserPrincipal principal, BookingRequest request) {
        User user = userRepository.findById(UUID.fromString(principal.getUserId()))
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Showtime showtime = showtimeService.getActiveShowtime(request.getShowtimeId());

        if (request.getSeatIds().size() > 8) {
            throw new BadRequestException("Maximum 8 seats per booking");
        }

        seatService.lockSeats(request.getShowtimeId(), request.getSeatIds(), principal.getUserId());

        List<Seat> seats = seatRepository.findAllById(request.getSeatIds());
        if (seats.size() != request.getSeatIds().size()) {
            seatService.unlockSeats(request.getShowtimeId(), request.getSeatIds());
            throw new BadRequestException("Some seats not found");
        }

        BigDecimal totalSeatAmount = BigDecimal.ZERO;
        List<BookingSeat> bookingSeats = new ArrayList<>();
        for (Seat seat : seats) {
            BigDecimal seatPrice = showtime.getBasePrice()
                    .multiply(seat.getSeatType().getPriceMultiplier());
            totalSeatAmount = totalSeatAmount.add(seatPrice);
        }

        BigDecimal totalComboAmount = BigDecimal.ZERO;
        List<BookingCombo> bookingCombos = new ArrayList<>();
        if (request.getCombos() != null) {
            for (BookingRequest.ComboItem item : request.getCombos()) {
                Combo combo = comboRepository.findById(item.getComboId())
                        .orElseThrow(() -> new ResourceNotFoundException("Combo not found"));
                BigDecimal comboTotal = combo.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
                totalComboAmount = totalComboAmount.add(comboTotal);

                bookingCombos.add(BookingCombo.builder()
                        .combo(combo)
                        .quantity(item.getQuantity())
                        .priceAtPurchase(combo.getPrice())
                        .build());
            }
        }

        BigDecimal rawTotal = totalSeatAmount.add(totalComboAmount);

        Coupon appliedCoupon = null;
        BigDecimal discount = BigDecimal.ZERO;
        if (request.getCouponCode() != null && !request.getCouponCode().isBlank()) {
            CouponResponse couponResp = couponService.applyCoupon(request.getCouponCode(), rawTotal);
            discount = couponResp.getDiscountedAmount();
            appliedCoupon = couponService.findActiveCoupon(request.getCouponCode());
        }

        BigDecimal finalTotal = rawTotal.subtract(discount);

        Booking booking = Booking.builder()
                .user(user)
                .coupon(appliedCoupon)
                .totalAmount(finalTotal)
                .bookingStatus(BookingStatus.PENDING)
                .build();
        booking = bookingRepository.save(booking);

        for (int i = 0; i < seats.size(); i++) {
            Seat seat = seats.get(i);
            BigDecimal seatPrice = showtime.getBasePrice()
                    .multiply(seat.getSeatType().getPriceMultiplier());
            BookingSeat bs = BookingSeat.builder()
                    .booking(booking)
                    .seat(seat)
                    .showtime(showtime)
                    .seatPrice(seatPrice)
                    .build();
            bookingSeatRepository.save(bs);
        }

        for (BookingCombo bc : bookingCombos) {
            bc.setBooking(booking);
            bookingComboRepository.save(bc);
        }

        if (appliedCoupon != null) {
            couponService.decrementCouponQuantity(appliedCoupon);
        }

        seatService.unlockSeats(request.getShowtimeId(), request.getSeatIds());

        messagingTemplate.convertAndSend(
            "/topic/seats/" + request.getShowtimeId(),
            request.getSeatIds().stream().map(id -> id.toString() + ":LOCKED").collect(Collectors.toList()));

        return toBookingResponse(booking);
    }

    @Transactional(readOnly = true)
    public Page<BookingResponse> getUserBookings(UserPrincipal principal, Pageable pageable) {
        UUID userId = UUID.fromString(principal.getUserId());
        return bookingRepository.findByUserUserIdOrderByCreatedAtDesc(userId, pageable)
                .map(this::toBookingResponse);
    }

    @Transactional(readOnly = true)
    public BookingResponse getBookingDetail(UUID bookingId, UserPrincipal principal) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
        UUID userId = UUID.fromString(principal.getUserId());
        if (!booking.getUser().getUserId().equals(userId)) {
            throw new BadRequestException("Access denied");
        }
        return toBookingResponse(booking);
    }

    public void cancelExpiredBookings() {
        LocalDateTime threshold = LocalDateTime.now().minusMinutes(15);
        List<Booking> expiredBookings = bookingRepository
                .findByBookingStatusAndCreatedAtBefore(BookingStatus.PENDING, threshold);

        for (Booking booking : expiredBookings) {
            booking.setBookingStatus(BookingStatus.CANCELLED);
            bookingRepository.save(booking);

            List<BookingSeat> bookingSeats = bookingSeatRepository.findByBookingBookingId(
                    booking.getBookingId());
            for (BookingSeat bs : bookingSeats) {
                messagingTemplate.convertAndSend(
                    "/topic/seats/" + bs.getShowtime().getShowtimeId(),
                    bs.getSeat().getSeatId().toString() + ":AVAILABLE");
            }
        }
    }

    private BookingResponse toBookingResponse(Booking booking) {
        List<BookingSeat> bookingSeats = bookingSeatRepository
                .findByBookingBookingId(booking.getBookingId());
        List<BookingCombo> bookingCombos = bookingComboRepository
                .findByBookingBookingId(booking.getBookingId());

        List<String> seatLabels = bookingSeats.stream()
                .map(bs -> bs.getSeat().getRowLabel() + bs.getSeat().getSeatNumber())
                .collect(Collectors.toList());

        Showtime showtime = bookingSeats.isEmpty() ? null : bookingSeats.get(0).getShowtime();
        Payment payment = paymentRepository.findByBookingBookingId(booking.getBookingId()).orElse(null);

        return BookingResponse.builder()
                .bookingId(booking.getBookingId())
                .bookingStatus(booking.getBookingStatus().name())
                .totalAmount(booking.getTotalAmount())
                .createdAt(booking.getCreatedAt())
                .movieTitle(showtime != null ? showtime.getMovie().getTitle() : null)
                .roomName(showtime != null ? showtime.getRoom().getRoomName() : null)
                .showtimeStart(showtime != null ? showtime.getStartTime() : null)
                .seatLabels(seatLabels)
                .combos(bookingCombos.stream()
                    .map(bc -> BookingResponse.ComboItemResponse.builder()
                        .comboName(bc.getCombo().getComboName())
                        .quantity(bc.getQuantity())
                        .priceAtPurchase(bc.getPriceAtPurchase())
                        .build())
                    .collect(Collectors.toList()))
                .couponCode(booking.getCoupon() != null ? booking.getCoupon().getCode() : null)
                .payment(payment != null ? BookingResponse.PaymentInfoResponse.builder()
                    .paymentMethod(payment.getPaymentMethod())
                    .transactionCode(payment.getTransactionCode())
                    .paymentStatus(payment.getPaymentStatus().name())
                    .paidAt(payment.getPaidAt())
                    .build() : null)
                .build();
    }
}
