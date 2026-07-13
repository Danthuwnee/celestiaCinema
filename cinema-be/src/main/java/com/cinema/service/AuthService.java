package com.cinema.service;

import java.time.LocalDateTime;
import java.util.Random;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cinema.dto.request.ChangePasswordRequest;
import com.cinema.dto.request.ForgotPasswordRequest;
import com.cinema.dto.request.LoginRequest;
import com.cinema.dto.request.RegisterRequest;
import com.cinema.dto.request.ResetPasswordRequest;
import com.cinema.dto.request.UpdateProfileRequest;
import com.cinema.dto.response.AuthResponse;
import com.cinema.dto.response.ProfileResponse;
import com.cinema.entity.PasswordResetToken;
import com.cinema.entity.User;
import com.cinema.enums.EntityStatus;
import com.cinema.enums.Role;
import com.cinema.exception.BadRequestException;
import com.cinema.exception.ResourceNotFoundException;
import com.cinema.repository.PasswordResetTokenRepository;
import com.cinema.repository.UserRepository;
import com.cinema.security.JwtTokenProvider;
import com.cinema.security.UserPrincipal;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final JavaMailSender mailSender;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already registered");
        }

        User user = User.builder()
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .phone(request.getPhone())
                .role(Role.CUSTOMER)
                .status(EntityStatus.ACTIVE)
                .build();

        user = userRepository.save(user);

        return generateAuthResponse(user);
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadRequestException("Invalid email or password"));

        if (user.getStatus() != EntityStatus.ACTIVE) {
            throw new BadRequestException("Account is disabled");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new BadRequestException("Invalid email or password");
        }

        return generateAuthResponse(user);
    }

    @Transactional
    public ProfileResponse updateProfile(UserPrincipal principal, UpdateProfileRequest request) {
        User user = userRepository.findById(java.util.UUID.fromString(principal.getUserId()))
                .orElseThrow(() -> new ResourceNotFoundException("Người dùng không tồn tại"));

        if (request.getFullName() != null) user.setFullName(request.getFullName());
        if (request.getPhone() != null) user.setPhone(request.getPhone());
        if (request.getGender() != null) user.setGender(request.getGender());
        if (request.getDateOfBirth() != null) user.setDateOfBirth(request.getDateOfBirth());
        if (request.getAvatar() != null) user.setAvatar(request.getAvatar());

        user = userRepository.save(user);
        return toProfileResponse(user);
    }

    public ProfileResponse getProfile(UserPrincipal principal) {
        User user = userRepository.findById(java.util.UUID.fromString(principal.getUserId()))
                .orElseThrow(() -> new ResourceNotFoundException("Người dùng không tồn tại"));
        return toProfileResponse(user);
    }

    @Transactional
    public void changePassword(UserPrincipal principal, ChangePasswordRequest request) {
        User user = userRepository.findById(java.util.UUID.fromString(principal.getUserId()))
                .orElseThrow(() -> new ResourceNotFoundException("Người dùng không tồn tại"));

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPasswordHash())) {
            throw new BadRequestException("Mật khẩu hiện tại không đúng");
        }

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    private ProfileResponse toProfileResponse(User user) {
        return ProfileResponse.builder()
                .userId(user.getUserId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .gender(user.getGender())
                .dateOfBirth(user.getDateOfBirth())
                .avatar(user.getAvatar())
                .build();
    }

    public void forgotPassword(ForgotPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadRequestException("Email không tồn tại"));

        String code = String.format("%06d", new Random().nextInt(999999));

        PasswordResetToken token = PasswordResetToken.builder()
                .email(user.getEmail())
                .code(code)
                .expiresAt(LocalDateTime.now().plusMinutes(10))
                .used(false)
                .build();
        passwordResetTokenRepository.save(token);

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(user.getEmail());
            message.setSubject("Cinema - Đặt lại mật khẩu");
            message.setText("Mã xác nhận đặt lại mật khẩu của bạn là: " + code + "\n\nMã có hiệu lực trong 10 phút.");
            mailSender.send(message);
        } catch (Exception e) {
            throw new BadRequestException("Gửi email thất bại: " + e.getMessage());
        }

        System.out.println("======================================");
        System.out.println("OTP for " + user.getEmail() + ": " + code);
        System.out.println("======================================");
    }

    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        PasswordResetToken token = passwordResetTokenRepository
                .findByEmailAndCodeAndUsedFalse(request.getEmail(), request.getCode())
                .orElseThrow(() -> new BadRequestException("Mã không hợp lệ hoặc đã hết hạn"));

        if (token.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("Mã đã hết hạn");
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        token.setUsed(true);
        passwordResetTokenRepository.save(token);
    }

    private AuthResponse generateAuthResponse(User user) {
        String accessToken = jwtTokenProvider.generateAccessToken(
                user.getUserId(), user.getEmail(), user.getRole().name(), user.getFullName());
        String refreshToken = jwtTokenProvider.generateRefreshToken(user.getUserId());

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .userId(user.getUserId().toString())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .build();
    }
}
