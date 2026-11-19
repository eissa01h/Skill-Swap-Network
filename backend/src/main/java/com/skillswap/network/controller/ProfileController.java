package com.skillswap.network.controller;

import com.skillswap.network.dto.ApiResponse;
import com.skillswap.network.dto.PublicUserProfileDto;
import com.skillswap.network.dto.UpdateProfileRequest;
import com.skillswap.network.dto.UserProfileDto;
import com.skillswap.network.entity.User;
import com.skillswap.network.service.AuthService;
import com.skillswap.network.service.ProfileService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/profiles")
public class ProfileController {

    @Autowired
    private ProfileService profileService;

    @Autowired
    private AuthService authService;

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserProfileDto>> getOwnProfile(Authentication authentication) {
        User user = authService.getAuthenticatedUser(authentication.getName());
        UserProfileDto profile = profileService.getOwnProfile(user);
        return ResponseEntity.ok(ApiResponse.success(profile));
    }

    @PutMapping("/me")
    public ResponseEntity<ApiResponse<UserProfileDto>> updateOwnProfile(
            Authentication authentication,
            @Valid @RequestBody UpdateProfileRequest request) {
        User user = authService.getAuthenticatedUser(authentication.getName());
        UserProfileDto updated = profileService.updateOwnProfile(user, request);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", updated));
    }

    @GetMapping("/{userId}")
    public ResponseEntity<ApiResponse<PublicUserProfileDto>> getPublicProfile(@PathVariable UUID userId) {
        PublicUserProfileDto profile = profileService.getPublicProfile(userId);
        return ResponseEntity.ok(ApiResponse.success(profile));
    }
}
