package com.skillswap.network.controller;

import com.skillswap.network.dto.ApiResponse;
import com.skillswap.network.dto.CancelExchangeDto;
import com.skillswap.network.dto.ExchangeDto;
import com.skillswap.network.entity.User;
import com.skillswap.network.service.AuthService;
import com.skillswap.network.service.ExchangeService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/exchanges")
public class ExchangeController {

    @Autowired
    private ExchangeService exchangeService;

    @Autowired
    private AuthService authService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ExchangeDto>>> getUserExchanges(Authentication authentication) {
        User user = authService.getAuthenticatedUser(authentication.getName());
        List<ExchangeDto> list = exchangeService.getUserExchanges(user);
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ExchangeDto>> getExchangeById(
            Authentication authentication,
            @PathVariable UUID id) {
        User user = authService.getAuthenticatedUser(authentication.getName());
        ExchangeDto dto = exchangeService.getExchangeById(user, id);
        return ResponseEntity.ok(ApiResponse.success(dto));
    }

    @PostMapping("/{id}/complete")
    public ResponseEntity<ApiResponse<ExchangeDto>> completeExchange(
            Authentication authentication,
            @PathVariable UUID id) {
        User user = authService.getAuthenticatedUser(authentication.getName());
        ExchangeDto completed = exchangeService.completeExchange(user, id);
        return ResponseEntity.ok(ApiResponse.success("Completion status updated", completed));
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse<ExchangeDto>> cancelExchange(
            Authentication authentication,
            @PathVariable UUID id,
            @Valid @RequestBody CancelExchangeDto cancelDto) {
        User user = authService.getAuthenticatedUser(authentication.getName());
        ExchangeDto cancelled = exchangeService.cancelExchange(user, id, cancelDto.getReason());
        return ResponseEntity.ok(ApiResponse.success("Exchange cancelled", cancelled));
    }
}
