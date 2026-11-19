package com.skillswap.network.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public class CreateReportRequest {

    @NotNull(message = "Reported user ID is required")
    private UUID reportedUserId;

    @NotBlank(message = "Target type is required (USER_PROFILE, MESSAGE, EXCHANGE, COMMERCIAL_SOLICITATION)")
    private String targetType;

    private UUID targetId;

    @NotBlank(message = "Category is required (COMMERCIAL_SOLICITATION, HARASSMENT, SPAM, NO_SHOW, OTHER)")
    private String category;

    @NotBlank(message = "Description of the incident is required")
    private String description;

    private String evidenceText;

    public CreateReportRequest() {}

    public UUID getReportedUserId() { return reportedUserId; }
    public void setReportedUserId(UUID reportedUserId) { this.reportedUserId = reportedUserId; }

    public String getTargetType() { return targetType; }
    public void setTargetType(String targetType) { this.targetType = targetType; }

    public UUID getTargetId() { return targetId; }
    public void setTargetId(UUID targetId) { this.targetId = targetId; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getEvidenceText() { return evidenceText; }
    public void setEvidenceText(String evidenceText) { this.evidenceText = evidenceText; }
}
