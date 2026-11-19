package com.skillswap.network.controller;

import com.skillswap.network.dto.ApiResponse;
import com.skillswap.network.dto.RatingFeedbackDto;
import com.skillswap.network.dto.SubmitFeedbackRequest;
import com.skillswap.network.entity.User;
import com.skillswap.network.service.AuthService;
import com.skillswap.network.service.FeedbackService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/feedback")
public class FeedbackController {

    @Autowired
    private FeedbackService feedbackService;

    @Autowired
    private AuthService authService;

    @PostMapping
    public ResponseEntity<ApiResponse<RatingFeedbackDto>> submitFeedback(
            Authentication authentication,
            @Valid @RequestBody SubmitFeedbackRequest request) {
        User user = authService.getAuthenticatedUser(authentication.getName());
        RatingFeedbackDto created = feedbackService.submitFeedback(user, request);
        return new ResponseEntity<>(ApiResponse.success("Review and rating submitted successfully", created), HttpStatus.CREATED);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<List<RatingFeedbackDto>>> getReviewsForUser(@PathVariable UUID userId) {
        List<RatingFeedbackDto> list = feedbackService.getReviewsForUser(userId);
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @GetMapping("/exchange/{exchangeId}")
    public ResponseEntity<ApiResponse<List<RatingFeedbackDto>>> getReviewsForExchange(@PathVariable UUID exchangeId) {
        List<RatingFeedbackDto> list = feedbackService.getReviewsForExchange(exchangeId);
        return ResponseEntity.ok(ApiResponse.success(list));
    }
}

