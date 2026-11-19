package com.skillswap.network.controller;

import com.skillswap.network.dto.ApiResponse;
import com.skillswap.network.dto.LessonDto;
import com.skillswap.network.dto.ScheduleLessonRequest;
import com.skillswap.network.dto.UpdateLessonRequest;
import com.skillswap.network.entity.User;
import com.skillswap.network.service.AuthService;
import com.skillswap.network.service.LessonService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/lessons")
public class LessonController {

    @Autowired
    private LessonService lessonService;

    @Autowired
    private AuthService authService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<LessonDto>>> getScheduledLessons(Authentication authentication) {
        User user = authService.getAuthenticatedUser(authentication.getName());
        List<LessonDto> lessons = lessonService.getScheduledLessons(user);
        return ResponseEntity.ok(ApiResponse.success(lessons));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<LessonDto>> scheduleLesson(
            Authentication authentication,
            @Valid @RequestBody ScheduleLessonRequest request) {
        User user = authService.getAuthenticatedUser(authentication.getName());
        LessonDto created = lessonService.scheduleLesson(user, request);
        return new ResponseEntity<>(ApiResponse.success("Lesson scheduled successfully", created), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<LessonDto>> getLessonDetails(
            Authentication authentication,
            @PathVariable UUID id) {
        User user = authService.getAuthenticatedUser(authentication.getName());
        LessonDto lesson = lessonService.getLessonDetails(user, id);
        return ResponseEntity.ok(ApiResponse.success(lesson));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<LessonDto>> updateLesson(
            Authentication authentication,
            @PathVariable UUID id,
            @RequestBody UpdateLessonRequest request) {
        User user = authService.getAuthenticatedUser(authentication.getName());
        LessonDto updated = lessonService.updateLesson(user, id, request);
        return ResponseEntity.ok(ApiResponse.success("Lesson updated", updated));
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse<LessonDto>> cancelLesson(
            Authentication authentication,
            @PathVariable UUID id) {
        User user = authService.getAuthenticatedUser(authentication.getName());
        LessonDto cancelled = lessonService.cancelLesson(user, id);
        return ResponseEntity.ok(ApiResponse.success("Lesson cancelled", cancelled));
    }
}
