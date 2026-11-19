package com.skillswap.network.security;

import com.skillswap.network.dto.PublicUserProfileDto;
import com.skillswap.network.entity.User;
import com.skillswap.network.entity.UserProfile;
import com.skillswap.network.repository.LearningInterestRepository;
import com.skillswap.network.repository.TeachingSkillRepository;
import com.skillswap.network.repository.UserProfileRepository;
import com.skillswap.network.repository.UserRepository;
import com.skillswap.network.service.ProfileService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class ProfilePrivacySecurityTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private UserProfileRepository userProfileRepository;

    @Mock
    private TeachingSkillRepository teachingSkillRepository;

    @Mock
    private LearningInterestRepository learningInterestRepository;

    @InjectMocks
    private ProfileService profileService;

    private User targetUser;
    private UserProfile profile;
    private UUID targetId;

    @BeforeEach
    void setUp() {
        targetId = UUID.randomUUID();
        targetUser = new User("confidential.email@domain.com", "$2a$12$eX4mPL3H4sHSecretSaltValue", "ROLE_USER");
        targetUser.setId(targetId);
        targetUser.setStatus("ACTIVE");

        profile = new UserProfile(targetUser, "Sarah Chen");
        profile.setHeadline("Software Architect");
        profile.setBio("Passionate about peer learning and technology.");
        profile.setAverageRating(BigDecimal.valueOf(4.9));
        profile.setTotalReviews(14);
        profile.setCompletedExchangesCount(8);
    }

    @Test
    @DisplayName("NFR-01: Public profile strictly conceals private email address and password hash")
    void testPublicProfileDoesNotLeakPrivateData() {
        when(userRepository.findById(targetId)).thenReturn(Optional.of(targetUser));
        when(userProfileRepository.findByUserId(targetId)).thenReturn(Optional.of(profile));
        when(teachingSkillRepository.findByUserIdWithSkill(targetId)).thenReturn(Collections.emptyList());
        when(learningInterestRepository.findByUserIdWithSkill(targetId)).thenReturn(Collections.emptyList());

        PublicUserProfileDto result = profileService.getPublicProfile(targetId);

        assertNotNull(result);
        assertEquals("Sarah Chen", result.getFullName());
        assertEquals("Software Architect", result.getHeadline());
        assertEquals(BigDecimal.valueOf(4.9), result.getAverageRating());
        assertEquals(14, result.getTotalReviews());
        assertEquals(8, result.getCompletedExchangesCount());

        // Assert strictly that PublicUserProfileDto has NO getEmail() or getPasswordHash() method
        assertFalse(hasFieldOrMethod(result, "email"), "Public profile must NEVER expose private email addresses");
        assertFalse(hasFieldOrMethod(result, "password"), "Public profile must NEVER expose password hashes");
        assertFalse(hasFieldOrMethod(result, "passwordHash"), "Public profile must NEVER expose passwordHash");
        assertFalse(hasFieldOrMethod(result, "status"), "Public profile must NEVER expose account status flags");
        assertFalse(hasFieldOrMethod(result, "role"), "Public profile must NEVER expose authorization roles");
    }

    private boolean hasFieldOrMethod(Object obj, String propertyName) {
        try {
            obj.getClass().getMethod("get" + propertyName.substring(0, 1).toUpperCase() + propertyName.substring(1));
            return true;
        } catch (NoSuchMethodException e) {
            return false;
        }
    }
}
