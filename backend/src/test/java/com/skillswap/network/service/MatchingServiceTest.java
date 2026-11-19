package com.skillswap.network.service;

import com.skillswap.network.dto.PartnerMatchDto;
import com.skillswap.network.entity.*;
import com.skillswap.network.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class MatchingServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private UserProfileRepository userProfileRepository;

    @Mock
    private TeachingSkillRepository teachingSkillRepository;

    @Mock
    private LearningInterestRepository learningInterestRepository;

    @InjectMocks
    private MatchingService matchingService;

    private User currentUser;
    private User partnerUser;
    private Skill reactSkill;
    private Skill spanishSkill;
    private UserProfile partnerProfile;

    @BeforeEach
    void setUp() {
        currentUser = new User("sarah@example.com", "hash", "ROLE_USER");
        currentUser.setId(UUID.randomUUID());

        partnerUser = new User("carlos@example.com", "hash", "ROLE_USER");
        partnerUser.setId(UUID.randomUUID());

        reactSkill = new Skill("React Architecture", "Programming & Tech", "React 18");
        reactSkill.setId(UUID.randomUUID());

        spanishSkill = new Skill("Conversational Spanish", "Languages", "Native Spanish");
        spanishSkill.setId(UUID.randomUUID());

        partnerProfile = new UserProfile(partnerUser, "Carlos Rodriguez");
        partnerProfile.setAverageRating(new BigDecimal("4.95"));
        partnerProfile.setTotalReviews(12);
        partnerProfile.setAvailability("Weekends");
    }

    @Test
    void shouldIdentifyStrongMutualMatch() {
        // Current user: Teaches React, Wants Spanish
        TeachingSkill userTeachReact = new TeachingSkill(currentUser, reactSkill, "ADVANCED", BigDecimal.valueOf(4), "React mentor");
        LearningInterest userWantSpanish = new LearningInterest(currentUser, spanishSkill, "INTERMEDIATE", "HIGH", "Fluency");

        when(teachingSkillRepository.findByUserIdWithSkill(currentUser.getId())).thenReturn(List.of(userTeachReact));
        when(learningInterestRepository.findByUserIdWithSkill(currentUser.getId())).thenReturn(List.of(userWantSpanish));

        // Partner: Teaches Spanish, Wants React
        TeachingSkill partnerTeachSpanish = new TeachingSkill(partnerUser, spanishSkill, "EXPERT", BigDecimal.valueOf(8), "Native");
        LearningInterest partnerWantReact = new LearningInterest(partnerUser, reactSkill, "BEGINNER", "HIGH", "Web Dev");

        when(userRepository.findAll()).thenReturn(List.of(currentUser, partnerUser));
        when(userProfileRepository.findByUserId(partnerUser.getId())).thenReturn(Optional.of(partnerProfile));
        when(teachingSkillRepository.findByUserIdWithSkill(partnerUser.getId())).thenReturn(List.of(partnerTeachSpanish));
        when(learningInterestRepository.findByUserIdWithSkill(partnerUser.getId())).thenReturn(List.of(partnerWantReact));

        List<PartnerMatchDto> matches = matchingService.getMutualRecommendations(currentUser);

        assertNotNull(matches);
        assertEquals(1, matches.size());
        PartnerMatchDto match = matches.get(0);

        assertTrue(match.isMutualMatch(), "Match must be flagged as a mutual 2-way match");
        assertTrue(match.getMatchScore() >= 85, "Mutual match score must be at least 85%");
        assertEquals("Carlos Rodriguez", match.getName());
        assertEquals("Conversational Spanish", match.getPartnerTeachesYou());
        assertEquals("React Architecture", match.getPartnerWantsFromYou());
        assertTrue(match.getMatchExplanation().contains("Direct 2-way match"));
    }

    @Test
    void shouldReturnEmptyWhenUserHasNoSkillsListed() {
        when(teachingSkillRepository.findByUserIdWithSkill(currentUser.getId())).thenReturn(Collections.emptyList());
        when(learningInterestRepository.findByUserIdWithSkill(currentUser.getId())).thenReturn(Collections.emptyList());

        List<PartnerMatchDto> matches = matchingService.getMutualRecommendations(currentUser);

        assertNotNull(matches);
        assertTrue(matches.isEmpty(), "Must return empty result when no skills are registered");
    }
}
