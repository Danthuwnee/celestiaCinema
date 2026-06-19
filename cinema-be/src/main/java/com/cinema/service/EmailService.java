package com.cinema.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import com.cinema.entity.Booking;
import com.cinema.entity.BookingCombo;
import com.cinema.entity.BookingSeat;
import com.cinema.repository.BookingComboRepository;
import com.cinema.repository.BookingSeatRepository;

import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;
    private final SpringTemplateEngine templateEngine;
    private final BookingSeatRepository bookingSeatRepository;
    private final BookingComboRepository bookingComboRepository;

    @Async
    public void sendBookingConfirmation(Booking booking) {
        try {
            List<BookingSeat> seats = bookingSeatRepository
                    .findByBookingBookingId(booking.getBookingId());
            List<BookingCombo> combos = bookingComboRepository
                    .findByBookingBookingId(booking.getBookingId());

            Context context = new Context();
            context.setVariable("fullName", booking.getUser().getFullName());
            context.setVariable("bookingId", booking.getBookingId().toString().substring(0, 8).toUpperCase());
            context.setVariable("movieTitle", seats.get(0).getShowtime().getMovie().getTitle());
            context.setVariable("roomName", seats.get(0).getShowtime().getRoom().getRoomName());
            context.setVariable("showtime", seats.get(0).getShowtime().getStartTime());
            context.setVariable("seats", seats.stream()
                    .map(s -> s.getSeat().getRowLabel() + s.getSeat().getSeatNumber())
                    .collect(Collectors.joining(", ")));
            context.setVariable("combos", combos.stream()
                    .map(c -> c.getCombo().getComboName() + " x" + c.getQuantity())
                    .collect(Collectors.joining(", ")));
            context.setVariable("totalAmount", booking.getTotalAmount());

            String html = templateEngine.process("booking-confirmation", context);

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setTo(booking.getUser().getEmail());
            helper.setSubject("Xác nhận đặt vé - Mã: " + context.getVariable("bookingId"));
            helper.setText(html, true);

            mailSender.send(message);
        } catch (Exception e) {
            // Log error silently - don't fail the booking if email fails
            System.err.println("Failed to send email: " + e.getMessage());
        }
    }
}
