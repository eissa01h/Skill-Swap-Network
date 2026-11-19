package com.skillswap.network.controller;

import com.skillswap.network.dto.*;
import com.skillswap.network.entity.User;
import com.skillswap.network.service.AuthService;
import com.skillswap.network.service.SkillService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/skills")
public class SkillController {

    @Autowired
    private SkillService skillService;

    @Autowired
    private AuthService authService;

    // Master Catalog
    @GetMapping
    public ResponseEntity<ApiResponse<List<SkillDto>>> getSkillsCatalog() {
        List<SkillDto> skills = skillService.getSkillsCatalog();
        return ResponseEntity.ok(ApiResponse.success(skills));
    }

    // -------------------------------------------------------------
    // Teaching Skills
    // -------------------------------------------------------------

    @GetMapping("/teaching")
    public ResponseEntity<ApiResponse<List<TeachingSkillDto>>> getTeachingSkills(Authentication authentication) {
        User user = authService.getAuthenticatedUser(authentication.getName());
        List<TeachingSkillDto> list = skillService.getTeachingSkills(user);
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @PostMapping("/teaching")
    public ResponseEntity<ApiResponse<TeachingSkillDto>> addTeachingSkill(
            Authentication authentication,
            @Valid @RequestBody CreateTeachingSkillRequest request) {
        User user = authService.getAuthenticatedUser(authentication.getName());
        TeachingSkillDto created = skillService.addTeachingSkill(user, request);
        return new ResponseEntity<>(ApiResponse.success("Teaching skill added successfully", created), HttpStatus.CREATED);
    }

    @PutMapping("/teaching/{id}")
    public ResponseEntity<ApiResponse<TeachingSkillDto>> updateTeachingSkill(
            Authentication authentication,
            @PathVariable UUID id,
            @RequestBody UpdateTeachingSkillRequest request) {
        User user = authService.getAuthenticatedUser(authentication.getName());
        TeachingSkillDto updated = skillService.updateTeachingSkill(user, id, request);
        return ResponseEntity.ok(ApiResponse.success("Teaching skill updated successfully", updated));
    }

    @DeleteMapping("/teaching/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteTeachingSkill(
            Authentication authentication,
            @PathVariable UUID id) {
        User user = authService.getAuthenticatedUser(authentication.getName());
        skillService.deleteTeachingSkill(user, id);
        return ResponseEntity.ok(ApiResponse.success("Teaching skill removed", null));
    }

    // -------------------------------------------------------------
    // Learning Interests
    // -------------------------------------------------------------

    @GetMapping("/learning")
    public ResponseEntity<ApiResponse<List<LearningInterestDto>>> getLearningInterests(Authentication authentication) {
        User user = authService.getAuthenticatedUser(authentication.getName());
        List<LearningInterestDto> list = skillService.getLearningInterests(user);
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @PostMapping("/learning")
    public ResponseEntity<ApiResponse<LearningInterestDto>> addLearningInterest(
            Authentication authentication,
            @Valid @RequestBody CreateLearningInterestRequest request) {
        User user = authService.getAuthenticatedUser(authentication.getName());
        LearningInterestDto created = skillService.addLearningInterest(user, request);
        return new ResponseEntity<>(ApiResponse.success("Learning interest added successfully", created), HttpStatus.CREATED);
    }

    @PutMapping("/learning/{id}")
    public ResponseEntity<ApiResponse<LearningInterestDto>> updateLearningInterest(
            Authentication authentication,
            @PathVariable UUID id,
            @RequestBody UpdateLearningInterestRequest request) {
        User user = authService.getAuthenticatedUser(authentication.getName());
        LearningInterestDto updated = skillService.updateLearningInterest(user, id, request);
        return ResponseEntity.ok(ApiResponse.success("Learning interest updated successfully", updated));
    }

    @DeleteMapping("/learning/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteLearningInterest(
            Authentication authentication,
            @PathVariable UUID id) {
        User user = authService.getAuthenticatedUser(authentication.getName());
        skillService.deleteLearningInterest(user, id);
        return ResponseEntity.ok(ApiResponse.success("Learning interest removed", null));
    }
}

