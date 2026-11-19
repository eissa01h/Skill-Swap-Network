package com.skillswap.network.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.UUID;

public class CreateTeachingSkillRequest {

    private UUID skillId;

    private String skillName; // If user selects by name or creates custom skill
    private String category;

    @NotBlank(message = "Proficiency level is required (BEGINNER, INTERMEDIATE, ADVANCED, EXPERT)")
    private String proficiencyLevel;

    private BigDecimal yearsOfExperience;
    private String description;

    public CreateTeachingSkillRequest() {}

    public UUID getSkillId() { return skillId; }
    public void setSkillId(UUID skillId) { this.skillId = skillId; }

    public String getSkillName() { return skillName; }
    public void setSkillName(String skillName) { this.skillName = skillName; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getProficiencyLevel() { return proficiencyLevel; }
    public void setProficiencyLevel(String proficiencyLevel) { this.proficiencyLevel = proficiencyLevel; }

    public BigDecimal getYearsOfExperience() { return yearsOfExperience; }
    public void setYearsOfExperience(BigDecimal yearsOfExperience) { this.yearsOfExperience = yearsOfExperience; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}

