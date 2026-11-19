package com.skillswap.network.service;

import com.skillswap.network.dto.*;
import com.skillswap.network.entity.LearningInterest;
import com.skillswap.network.entity.Skill;
import com.skillswap.network.entity.TeachingSkill;
import com.skillswap.network.entity.User;
import com.skillswap.network.exception.ConflictException;
import com.skillswap.network.exception.ForbiddenException;
import com.skillswap.network.exception.ResourceNotFoundException;
import com.skillswap.network.repository.LearningInterestRepository;
import com.skillswap.network.repository.SkillRepository;
import com.skillswap.network.repository.TeachingSkillRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class SkillService {

    @Autowired
    private SkillRepository skillRepository;

    @Autowired
    private TeachingSkillRepository teachingSkillRepository;

    @Autowired
    private LearningInterestRepository learningInterestRepository;

    public List<SkillDto> getSkillsCatalog() {
        return skillRepository.findAll().stream()
                .map(s -> new SkillDto(s.getId(), s.getName(), s.getCategory(), s.getDescription()))
                .collect(Collectors.toList());
    }

    // -------------------------------------------------------------
    // Teaching Skills
    // -------------------------------------------------------------

    public List<TeachingSkillDto> getTeachingSkills(User user) {
        return teachingSkillRepository.findByUserIdWithSkill(user.getId()).stream()
                .map(this::mapToTeachingDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public TeachingSkillDto addTeachingSkill(User user, CreateTeachingSkillRequest request) {
        Skill skill = resolveSkill(request.getSkillId(), request.getSkillName(), request.getCategory());

        // Prevent duplicates
        if (teachingSkillRepository.existsByUserIdAndSkillId(user.getId(), skill.getId())) {
            throw new ConflictException("You have already added '" + skill.getName() + "' to your teaching skills.");
        }

        TeachingSkill ts = new TeachingSkill(
                user,
                skill,
                request.getProficiencyLevel(),
                request.getYearsOfExperience(),
                request.getDescription()
        );

        ts = teachingSkillRepository.save(ts);
        return mapToTeachingDto(ts);
    }

    @Transactional
    public TeachingSkillDto updateTeachingSkill(User user, UUID id, UpdateTeachingSkillRequest request) {
        TeachingSkill ts = teachingSkillRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Teaching skill not found with id: " + id));

        if (!ts.getUser().getId().equals(user.getId())) {
            throw new ForbiddenException("You cannot edit another user's teaching skills.");
        }

        if (request.getProficiencyLevel() != null) ts.setProficiencyLevel(request.getProficiencyLevel());
        if (request.getYearsOfExperience() != null) ts.setYearsOfExperience(request.getYearsOfExperience());
        if (request.getDescription() != null) ts.setDescription(request.getDescription());

        ts = teachingSkillRepository.save(ts);
        return mapToTeachingDto(ts);
    }

    @Transactional
    public void deleteTeachingSkill(User user, UUID id) {
        TeachingSkill ts = teachingSkillRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Teaching skill not found with id: " + id));

        if (!ts.getUser().getId().equals(user.getId())) {
            throw new ForbiddenException("You cannot delete another user's teaching skills.");
        }

        teachingSkillRepository.delete(ts);
    }

    // -------------------------------------------------------------
    // Learning Interests
    // -------------------------------------------------------------

    public List<LearningInterestDto> getLearningInterests(User user) {
        return learningInterestRepository.findByUserIdWithSkill(user.getId()).stream()
                .map(this::mapToLearningDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public LearningInterestDto addLearningInterest(User user, CreateLearningInterestRequest request) {
        Skill skill = resolveSkill(request.getSkillId(), request.getSkillName(), request.getCategory());

        // Prevent duplicates
        if (learningInterestRepository.existsByUserIdAndSkillId(user.getId(), skill.getId())) {
            throw new ConflictException("You have already listed '" + skill.getName() + "' as a learning interest.");
        }

        LearningInterest li = new LearningInterest(
                user,
                skill,
                request.getTargetLevel(),
                request.getPriority(),
                request.getLearningGoals()
        );

        li = learningInterestRepository.save(li);
        return mapToLearningDto(li);
    }

    @Transactional
    public LearningInterestDto updateLearningInterest(User user, UUID id, UpdateLearningInterestRequest request) {
        LearningInterest li = learningInterestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Learning goal not found with id: " + id));

        if (!li.getUser().getId().equals(user.getId())) {
            throw new ForbiddenException("You cannot edit another user's learning goals.");
        }

        if (request.getTargetLevel() != null) li.setTargetLevel(request.getTargetLevel());
        if (request.getPriority() != null) li.setPriority(request.getPriority());
        if (request.getLearningGoals() != null) li.setLearningGoals(request.getLearningGoals());

        li = learningInterestRepository.save(li);
        return mapToLearningDto(li);
    }

    @Transactional
    public void deleteLearningInterest(User user, UUID id) {
        LearningInterest li = learningInterestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Learning goal not found with id: " + id));

        if (!li.getUser().getId().equals(user.getId())) {
            throw new ForbiddenException("You cannot delete another user's learning goals.");
        }

        learningInterestRepository.delete(li);
    }

    private Skill resolveSkill(UUID skillId, String skillName, String category) {
        if (skillId != null) {
            return skillRepository.findById(skillId)
                    .orElseThrow(() -> new ResourceNotFoundException("Skill not found with id: " + skillId));
        }

        if (skillName == null || skillName.trim().isEmpty()) {
            throw new ResourceNotFoundException("Please provide a skillId or skillName");
        }

        String name = skillName.trim();
        return skillRepository.findByNameIgnoreCase(name)
                .orElseGet(() -> {
                    String cat = (category != null && !category.trim().isEmpty()) ? category : "Programming & Tech";
                    Skill created = new Skill(name, cat, "User created skill");
                    return skillRepository.save(created);
                });
    }

    private TeachingSkillDto mapToTeachingDto(TeachingSkill ts) {
        TeachingSkillDto dto = new TeachingSkillDto();
        dto.setId(ts.getId());
        dto.setSkillId(ts.getSkill().getId());
        dto.setSkillName(ts.getSkill().getName());
        dto.setCategory(ts.getSkill().getCategory());
        dto.setProficiencyLevel(ts.getProficiencyLevel());
        dto.setYearsOfExperience(ts.getYearsOfExperience());
        dto.setDescription(ts.getDescription());
        dto.setCreatedAt(ts.getCreatedAt());
        return dto;
    }

    private LearningInterestDto mapToLearningDto(LearningInterest li) {
        LearningInterestDto dto = new LearningInterestDto();
        dto.setId(li.getId());
        dto.setSkillId(li.getSkill().getId());
        dto.setSkillName(li.getSkill().getName());
        dto.setCategory(li.getSkill().getCategory());
        dto.setTargetLevel(li.getTargetLevel());
        dto.setPriority(li.getPriority());
        dto.setLearningGoals(li.getLearningGoals());
        dto.setCreatedAt(li.getCreatedAt());
        return dto;
    }
}

