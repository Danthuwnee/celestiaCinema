package com.cinema.service;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
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
import com.sendgrid.Method;
import com.sendgrid.Request;
import com.sendgrid.SendGrid;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;

import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EmailService {

    @Value("${SENDGRID_API_KEY}")
    private String sendGridApiKey;

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

    public void sendOtpEmail(String to, String code) {
        Email from = new Email("celestiacinema@gmail.com");
        String subject = "Cinema - Đặt lại mật khẩu";
        Email toEmail = new Email(to);
        Content content = new Content("text/plain",
                "Mã xác nhận đặt lại mật khẩu của bạn là: " + code + "\n\nMã có hiệu lực trong 10 phút.");
        Mail mail = new Mail(from, subject, toEmail, content);

        SendGrid sg = new SendGrid(sendGridApiKey);
        Request request = new Request();
        try {
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());
            sg.api(request);
        } catch (IOException e) {
            throw new RuntimeException("Gửi email thất bại: " + e.getMessage());
        }
    }
}
