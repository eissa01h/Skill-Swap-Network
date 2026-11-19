package com.skillswap.network.controller;

import com.skillswap.network.dto.ApiResponse;
import com.skillswap.network.dto.CancelRequestDto;
import com.skillswap.network.dto.CreateExchangeRequestDto;
import com.skillswap.network.dto.ExchangeRequestDto;
import com.skillswap.network.entity.User;
import com.skillswap.network.service.AuthService;
import com.skillswap.network.service.ExchangeRequestService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/requests")
public class ExchangeRequestController {

    @Autowired
    private ExchangeRequestService exchangeRequestService;

    @Autowired
    private AuthService authService;

    @PostMapping
    public ResponseEntity<ApiResponse<ExchangeRequestDto>> createRequest(
            Authentication authentication,
            @Valid @RequestBody CreateExchangeRequestDto dto) {
        User user = authService.getAuthenticatedUser(authentication.getName());
        ExchangeRequestDto created = exchangeRequestService.createRequest(user, dto);
        return new ResponseEntity<>(ApiResponse.success("Exchange proposal delivered", created), HttpStatus.CREATED);
    }

    @GetMapping("/sent")
    public ResponseEntity<ApiResponse<List<ExchangeRequestDto>>> getSentRequests(Authentication authentication) {
        User user = authService.getAuthenticatedUser(authentication.getName());
        List<ExchangeRequestDto> list = exchangeRequestService.getSentRequests(user);
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @GetMapping("/received")
    public ResponseEntity<ApiResponse<List<ExchangeRequestDto>>> getReceivedRequests(Authentication authentication) {
        User user = authService.getAuthenticatedUser(authentication.getName());
        List<ExchangeRequestDto> list = exchangeRequestService.getReceivedRequests(user);
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @PostMapping("/{id}/accept")
    public ResponseEntity<ApiResponse<ExchangeRequestDto>> acceptRequest(
            Authentication authentication,
            @PathVariable UUID id) {
        User user = authService.getAuthenticatedUser(authentication.getName());
        ExchangeRequestDto accepted = exchangeRequestService.acceptRequest(user, id);
        return ResponseEntity.ok(ApiResponse.success("Exchange proposal accepted! Swap is now active.", accepted));
    }

    @PostMapping("/{id}/decline")
    public ResponseEntity<ApiResponse<ExchangeRequestDto>> declineRequest(
            Authentication authentication,
            @PathVariable UUID id) {
        User user = authService.getAuthenticatedUser(authentication.getName());
        ExchangeRequestDto declined = exchangeRequestService.declineRequest(user, id);
        return ResponseEntity.ok(ApiResponse.success("Exchange proposal declined", declined));
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse<ExchangeRequestDto>> cancelRequest(
            Authentication authentication,
            @PathVariable UUID id,
            @RequestBody(required = false) CancelRequestDto cancelDto) {
        User user = authService.getAuthenticatedUser(authentication.getName());
        String reason = cancelDto != null ? cancelDto.getReason() : "Sender withdrawn";
        ExchangeRequestDto cancelled = exchangeRequestService.cancelRequest(user, id, reason);
        return ResponseEntity.ok(ApiResponse.success("Exchange proposal cancelled", cancelled));
    }
}
