package com.skillswap.network.controller;

import com.skillswap.network.dto.ApiResponse;
import com.skillswap.network.dto.ConversationDto;
import com.skillswap.network.dto.MessageDto;
import com.skillswap.network.dto.SendMessageRequest;
import com.skillswap.network.entity.User;
import com.skillswap.network.service.AuthService;
import com.skillswap.network.service.ChatService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/conversations")
public class ChatController {

    @Autowired
    private ChatService chatService;

    @Autowired
    private AuthService authService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ConversationDto>>> getUserConversations(Authentication authentication) {
        User user = authService.getAuthenticatedUser(authentication.getName());
        List<ConversationDto> list = chatService.getUserConversations(user);
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @GetMapping("/{id}/messages")
    public ResponseEntity<ApiResponse<List<MessageDto>>> getConversationMessages(
            Authentication authentication,
            @PathVariable UUID id) {
        User user = authService.getAuthenticatedUser(authentication.getName());
        List<MessageDto> messages = chatService.getConversationMessages(user, id);
        return ResponseEntity.ok(ApiResponse.success(messages));
    }

    @PostMapping("/{id}/messages")
    public ResponseEntity<ApiResponse<MessageDto>> sendMessage(
            Authentication authentication,
            @PathVariable UUID id,
            @Valid @RequestBody SendMessageRequest request) {
        User user = authService.getAuthenticatedUser(authentication.getName());
        MessageDto sent = chatService.sendMessage(user, id, request);
        return new ResponseEntity<>(ApiResponse.success("Message sent", sent), HttpStatus.CREATED);
    }
}
