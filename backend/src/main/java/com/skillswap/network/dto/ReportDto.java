package com.skillswap.network.dto;

import java.time.Instant;
import java.util.UUID;

public class ReportDto {
    private UUID id;
    private UUID reporterId;
    private String reporterName;
    private String reporterEmail;
    private UUID reportedUserId;
    private String reportedUserName;
    private String reportedUserEmail;
    private String targetType;
    private UUID targetId;
    private String category;
    private String description;
    private String evidenceText;
    private String status;
    private String adminAction;
    private String adminNotes;
    private Instant resolvedAt;
    private Instant createdAt;

    public ReportDto() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getReporterId() { return reporterId; }
    public void setReporterId(UUID reporterId) { this.reporterId = reporterId; }

    public String getReporterName() { return reporterName; }
    public void setReporterName(String reporterName) { this.reporterName = reporterName; }

    public String getReporterEmail() { return reporterEmail; }
    public void setReporterEmail(String reporterEmail) { this.reporterEmail = reporterEmail; }

    public UUID getReportedUserId() { return reportedUserId; }
    public void setReportedUserId(UUID reportedUserId) { this.reportedUserId = reportedUserId; }

    public String getReportedUserName() { return reportedUserName; }
    public void setReportedUserName(String reportedUserName) { this.reportedUserName = reportedUserName; }

    public String getReportedUserEmail() { return reportedUserEmail; }
    public void setReportedUserEmail(String reportedUserEmail) { this.reportedUserEmail = reportedUserEmail; }

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

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getAdminAction() { return adminAction; }
    public void setAdminAction(String adminAction) { this.adminAction = adminAction; }

    public String getAdminNotes() { return adminNotes; }
    public void setAdminNotes(String adminNotes) { this.adminNotes = adminNotes; }

    public Instant getResolvedAt() { return resolvedAt; }
    public void setResolvedAt(Instant resolvedAt) { this.resolvedAt = resolvedAt; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
