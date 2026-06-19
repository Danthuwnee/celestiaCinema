package com.cinema.security.oauth2;

import java.io.IOException;
import java.util.UUID;

import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import com.cinema.entity.User;
import com.cinema.enums.EntityStatus;
import com.cinema.enums.Role;
import com.cinema.repository.UserRepository;
import com.cinema.security.JwtTokenProvider;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {
        OAuth2AuthenticationToken oauthToken = (OAuth2AuthenticationToken) authentication;
        String email = oauthToken.getPrincipal().getAttribute("email");
        String name = oauthToken.getPrincipal().getAttribute("name");

        User user = userRepository.findByEmail(email).orElseGet(() ->
            userRepository.save(User.builder()
                .email(email)
                .fullName(name)
                .passwordHash("OAUTH2_" + UUID.randomUUID())
                .role(Role.CUSTOMER)
                .status(EntityStatus.ACTIVE)
                .build())
        );

        String accessToken = jwtTokenProvider.generateAccessToken(
            user.getUserId(), user.getEmail(), user.getRole().name(), user.getFullName());

        getRedirectStrategy().sendRedirect(request, response,
            "http://localhost:5173/oauth2/redirect?token=" + accessToken);
    }
}
