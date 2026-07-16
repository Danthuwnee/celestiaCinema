package com.cinema.zalopay;

import java.util.Map;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cinema.security.UserPrincipal;
import com.cinema.service.PaymentService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/payments/zalopay")
@RequiredArgsConstructor
public class ZaloPayController {

    private final PaymentService paymentService;

    @PostMapping("/create/{bookingId}")
    public ResponseEntity<?> createZaloPayPayment(
            @PathVariable UUID bookingId,
            @AuthenticationPrincipal UserPrincipal principal) {
        try {
            Map<String, Object> result = paymentService.initiateZaloPayPayment(bookingId, principal);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/ipn")
    public ResponseEntity<String> handleIpn(@RequestBody Map<String, String> ipnData) {
        try {
            paymentService.handleZaloPayIpn(ipnData);
            return ResponseEntity.ok("OK");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("FAIL");
        }
    }
}
