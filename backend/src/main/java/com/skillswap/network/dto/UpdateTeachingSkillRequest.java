package com.skillswap.network.dto;

import java.math.BigDecimal;

public class UpdateTeachingSkillRequest {
    private String proficiencyLevel;
    private BigDecimal yearsOfExperience;
    private String description;

    public UpdateTeachingSkillRequest() {}

    public String getProficiencyLevel() { return proficiencyLevel; }
    public void setProficiencyLevel(String proficiencyLevel) { this.proficiencyLevel = proficiencyLevel; }

    public BigDecimal getYearsOfExperience() { return yearsOfExperience; }
    public void setYearsOfExperience(BigDecimal yearsOfExperience) { this.yearsOfExperience = yearsOfExperience; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}

