package com.skillswap.network.dto;

import jakarta.validation.constraints.NotBlank;
import java.util.UUID;

public class CreateLearningInterestRequest {

    private UUID skillId;
    private String skillName;
    private String category;

    @NotBlank(message = "Target proficiency level is required")
    private String targetLevel;

    private String priority = "MEDIUM";
    private String learningGoals;

    public CreateLearningInterestRequest() {}

    public UUID getSkillId() { return skillId; }
    public void setSkillId(UUID skillId) { this.skillId = skillId; }

    public String getSkillName() { return skillName; }
    public void setSkillName(String skillName) { this.skillName = skillName; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getTargetLevel() { return targetLevel; }
    public void setTargetLevel(String targetLevel) { this.targetLevel = targetLevel; }

    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }

    public String getLearningGoals() { return learningGoals; }
    public void setLearningGoals(String learningGoals) { this.learningGoals = learningGoals; }
}

