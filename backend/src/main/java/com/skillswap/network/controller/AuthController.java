package com.skillswap.network.controller;

import com.skillswap.network.dto.ApiResponse;
import com.skillswap.network.dto.AuthResponse;
import com.skillswap.network.dto.LoginRequest;
import com.skillswap.network.dto.RegisterRequest;
import com.skillswap.network.entity.User;
import com.skillswap.network.exception.TooManyRequestsException;
import com.skillswap.network.security.RateLimiterService;
import com.skillswap.network.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private RateLimiterService rateLimiterService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(
            HttpServletRequest servletRequest,
            @Valid @RequestBody RegisterRequest request) {

        String clientIp = extractClientIp(servletRequest);
        String rateLimitKey = "register:" + clientIp;

        if (!rateLimiterService.isAllowed(rateLimitKey)) {
            long retryAfter = rateLimiterService.getRetryAfterSeconds(rateLimitKey);
            throw new TooManyRequestsException(
                    "Too many registration requests. Please wait " + retryAfter + " seconds before trying again.",
                    retryAfter
            );
        }

        AuthResponse response = authService.register(request);
        return new ResponseEntity<>(ApiResponse.success("User registered successfully", response), HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(
            HttpServletRequest servletRequest,
            @Valid @RequestBody LoginRequest request) {

        String clientIp = extractClientIp(servletRequest);
        String rateLimitKey = "login:" + clientIp;

        if (!rateLimiterService.isAllowed(rateLimitKey)) {
            long retryAfter = rateLimiterService.getRetryAfterSeconds(rateLimitKey);
            throw new TooManyRequestsException(
                    "Too many login attempts. Account temporarily throttled for security. Please try again in " + retryAfter + " seconds.",
                    retryAfter
            );
        }

        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success("Login successful", response));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(@RequestHeader(value = "Authorization", required = false) String token) {
        authService.logout(token);
        return ResponseEntity.ok(ApiResponse.success("Logged out successfully", null));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<User>> getCurrentUser(Authentication authentication) {
        User user = authService.getAuthenticatedUser(authentication.getName());
        // Strictly sanitize password hash before returning
        user.setPasswordHash("[PROTECTED]");
        return ResponseEntity.ok(ApiResponse.success(user));
    }

    private String extractClientIp(HttpServletRequest request) {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader != null && !xfHeader.isEmpty() && !"unknown".equalsIgnoreCase(xfHeader)) {
            return xfHeader.split(",")[0].trim();
        }
        return request.getRemoteAddr() != null ? request.getRemoteAddr() : "127.0.0.1";
    }
}
