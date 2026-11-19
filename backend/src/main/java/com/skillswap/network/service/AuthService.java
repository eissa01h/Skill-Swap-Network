package com.skillswap.network.service;

import com.skillswap.network.dto.AuthResponse;
import com.skillswap.network.dto.LoginRequest;
import com.skillswap.network.dto.RegisterRequest;
import com.skillswap.network.entity.User;
import com.skillswap.network.entity.UserProfile;
import com.skillswap.network.exception.BadRequestException;
import com.skillswap.network.exception.ConflictException;
import com.skillswap.network.exception.UnauthorizedException;
import com.skillswap.network.repository.UserProfileRepository;
import com.skillswap.network.repository.UserRepository;
import com.skillswap.network.security.JwtTokenProvider;
import com.skillswap.network.security.TokenBlacklistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserProfileRepository userProfileRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private TokenBlacklistService tokenBlacklistService;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        if (userRepository.existsByEmailIgnoreCase(email)) {
            throw new ConflictException("Email is already registered. Please login instead.");
        }

        // Hash password with BCrypt
        String hashedPassword = passwordEncoder.encode(request.getPassword());

        User user = new User(email, hashedPassword, "ROLE_USER");
        user = userRepository.save(user);

        // Create initial Profile
        UserProfile profile = new UserProfile(user, request.getFullName().trim());
        profile.setAvatarUrl("https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80");
        userProfileRepository.save(profile);

        String token = jwtTokenProvider.generateTokenFromUsername(user.getEmail());

        return new AuthResponse(token, user.getId(), user.getEmail(), profile.getFullName(), user.getRole(), profile.getAvatarUrl());
    }

    public AuthResponse login(LoginRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new UnauthorizedException("Invalid email or password"));

        if ("BLOCKED".equalsIgnoreCase(user.getStatus())) {
            throw new UnauthorizedException("Your account has been suspended for violating community guidelines. Contact support.");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new UnauthorizedException("Invalid email or password");
        }

        UserProfile profile = userProfileRepository.findByUserId(user.getId())
                .orElse(null);
        String fullName = profile != null ? profile.getFullName() : user.getEmail();
        String avatar = profile != null ? profile.getAvatarUrl() : null;

        String token = jwtTokenProvider.generateTokenFromUsername(user.getEmail());

        return new AuthResponse(token, user.getId(), user.getEmail(), fullName, user.getRole(), avatar);
    }

    public void logout(String token) {
        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
        tokenBlacklistService.invalidateToken(token, Instant.now().plusSeconds(86400));
    }

    public User getAuthenticatedUser(String email) {
        return userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new UnauthorizedException("User not authenticated or does not exist"));
    }
}
