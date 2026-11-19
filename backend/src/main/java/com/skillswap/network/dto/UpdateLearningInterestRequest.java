package com.skillswap.network.dto;

public class UpdateLearningInterestRequest {
    private String targetLevel;
    private String priority;
    private String learningGoals;

    public UpdateLearningInterestRequest() {}

    public String getTargetLevel() { return targetLevel; }
    public void setTargetLevel(String targetLevel) { this.targetLevel = targetLevel; }

    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }

    public String getLearningGoals() { return learningGoals; }
    public void setLearningGoals(String learningGoals) { this.learningGoals = learningGoals; }
}

