package com.skillswap.network.service;

import com.skillswap.network.dto.CreateLearningInterestRequest;
import com.skillswap.network.dto.CreateTeachingSkillRequest;
import com.skillswap.network.entity.Skill;
import com.skillswap.network.entity.User;
import com.skillswap.network.exception.ConflictException;
import com.skillswap.network.repository.LearningInterestRepository;
import com.skillswap.network.repository.SkillRepository;
import com.skillswap.network.repository.TeachingSkillRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class DuplicateSkillPreventionTest {

    @Mock
    private SkillRepository skillRepository;

    @Mock
    private TeachingSkillRepository teachingSkillRepository;

    @Mock
    private LearningInterestRepository learningInterestRepository;

    @InjectMocks
    private SkillService skillService;

    private User user;
    private Skill skill;

    @BeforeEach
    void setUp() {
        user = new User("sarah@example.com", "hash", "ROLE_USER");
        user.setId(UUID.randomUUID());

        skill = new Skill("React Architecture", "Programming & Tech", "React 18");
        skill.setId(UUID.randomUUID());
    }

    @Test
    void shouldPreventDuplicateTeachingSkill() {
        CreateTeachingSkillRequest request = new CreateTeachingSkillRequest();
        request.setSkillId(skill.getId());
        request.setProficiencyLevel("ADVANCED");
        request.setYearsOfExperience(BigDecimal.valueOf(3));

        when(skillRepository.findById(skill.getId())).thenReturn(Optional.of(skill));
        when(teachingSkillRepository.existsByUserIdAndSkillId(user.getId(), skill.getId())).thenReturn(true);

        assertThrows(ConflictException.class, () -> skillService.addTeachingSkill(user, request));
    }

    @Test
    void shouldPreventDuplicateLearningInterest() {
        CreateLearningInterestRequest request = new CreateLearningInterestRequest();
        request.setSkillId(skill.getId());
        request.setTargetLevel("INTERMEDIATE");

        when(skillRepository.findById(skill.getId())).thenReturn(Optional.of(skill));
        when(learningInterestRepository.existsByUserIdAndSkillId(user.getId(), skill.getId())).thenReturn(true);

        assertThrows(ConflictException.class, () -> skillService.addLearningInterest(user, request));
    }
}
