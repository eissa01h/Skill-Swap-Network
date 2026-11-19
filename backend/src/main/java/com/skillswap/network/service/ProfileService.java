package com.skillswap.network.service;

import com.skillswap.network.dto.*;
import com.skillswap.network.entity.LearningInterest;
import com.skillswap.network.entity.TeachingSkill;
import com.skillswap.network.entity.User;
import com.skillswap.network.entity.UserProfile;
import com.skillswap.network.exception.ResourceNotFoundException;
import com.skillswap.network.repository.LearningInterestRepository;
import com.skillswap.network.repository.TeachingSkillRepository;
import com.skillswap.network.repository.UserProfileRepository;
import com.skillswap.network.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ProfileService {

    @Autowired
    private UserProfileRepository userProfileRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TeachingSkillRepository teachingSkillRepository;

    @Autowired
    private LearningInterestRepository learningInterestRepository;

    public UserProfileDto getOwnProfile(User user) {
        UserProfile profile = userProfileRepository.findByUserId(user.getId())
                .orElseGet(() -> {
                    UserProfile p = new UserProfile(user, user.getEmail().split("@")[0]);
                    return userProfileRepository.save(p);
                });

        return mapToDto(profile, user);
    }

    @Transactional
    public UserProfileDto updateOwnProfile(User user, UpdateProfileRequest request) {
        UserProfile profile = userProfileRepository.findByUserId(user.getId())
                .orElseGet(() -> new UserProfile(user, request.getFullName()));

        profile.setFullName(request.getFullName().trim());
        if (request.getHeadline() != null) profile.setHeadline(request.getHeadline().trim());
        if (request.getBio() != null) profile.setBio(request.getBio().trim());
        if (request.getAvatarUrl() != null) profile.setAvatarUrl(request.getAvatarUrl().trim());
        if (request.getLocation() != null) profile.setLocation(request.getLocation().trim());
        if (request.getTimezone() != null) profile.setTimezone(request.getTimezone().trim());
        if (request.getAvailability() != null) profile.setAvailability(request.getAvailability().trim());

        profile = userProfileRepository.save(profile);
        return mapToDto(profile, user);
    }

    public PublicUserProfileDto getPublicProfile(UUID targetUserId) {
        User targetUser = userRepository.findById(targetUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + targetUserId));

        UserProfile profile = userProfileRepository.findByUserId(targetUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found for user id: " + targetUserId));

        // Load teaching and learning skills
        List<TeachingSkill> teaching = teachingSkillRepository.findByUserIdWithSkill(targetUserId);
        List<LearningInterest> learning = learningInterestRepository.findByUserIdWithSkill(targetUserId);

        PublicUserProfileDto dto = new PublicUserProfileDto();
        dto.setUserId(targetUser.getId());
        dto.setFullName(profile.getFullName());
        dto.setHeadline(profile.getHeadline());
        dto.setBio(profile.getBio());
        dto.setAvatarUrl(profile.getAvatarUrl());
        dto.setLocation(profile.getLocation());
        dto.setAvailability(profile.getAvailability());
        dto.setAverageRating(profile.getAverageRating());
        dto.setTotalReviews(profile.getTotalReviews());
        dto.setCompletedExchangesCount(profile.getCompletedExchangesCount());

        dto.setTeachingSkills(teaching.stream().map(t -> {
            TeachingSkillDto td = new TeachingSkillDto();
            td.setId(t.getId());
            td.setSkillId(t.getSkill().getId());
            td.setSkillName(t.getSkill().getName());
            td.setCategory(t.getSkill().getCategory());
            td.setProficiencyLevel(t.getProficiencyLevel());
            td.setYearsOfExperience(t.getYearsOfExperience());
            td.setDescription(t.getDescription());
            td.setCreatedAt(t.getCreatedAt());
            return td;
        }).collect(Collectors.toList()));

        dto.setLearningInterests(learning.stream().map(l -> {
            LearningInterestDto ld = new LearningInterestDto();
            ld.setId(l.getId());
            ld.setSkillId(l.getSkill().getId());
            ld.setSkillName(l.getSkill().getName());
            ld.setCategory(l.getSkill().getCategory());
            ld.setTargetLevel(l.getTargetLevel());
            ld.setPriority(l.getPriority());
            ld.setLearningGoals(l.getLearningGoals());
            ld.setCreatedAt(l.getCreatedAt());
            return ld;
        }).collect(Collectors.toList()));

        return dto;
    }

    private UserProfileDto mapToDto(UserProfile p, User u) {
        UserProfileDto dto = new UserProfileDto();
        dto.setId(p.getId());
        dto.setUserId(u.getId());
        dto.setEmail(u.getEmail());
        dto.setFullName(p.getFullName());
        dto.setHeadline(p.getHeadline());
        dto.setBio(p.getBio());
        dto.setAvatarUrl(p.getAvatarUrl());
        dto.setLocation(p.getLocation());
        dto.setTimezone(p.getTimezone());
        dto.setAvailability(p.getAvailability());
        dto.setAverageRating(p.getAverageRating());
        dto.setTotalReviews(p.getTotalReviews());
        dto.setCompletedExchangesCount(p.getCompletedExchangesCount());
        dto.setRole(u.getRole());
        dto.setStatus(u.getStatus());
        dto.setCreatedAt(p.getCreatedAt());
        return dto;
    }
}
