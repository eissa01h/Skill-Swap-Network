package com.skillswap.network.dto;

import java.time.Instant;
import java.util.UUID;

public class AuditLogDto {
    private UUID id;
    private String adminName;
    private String action;
    private String targetEntityType;
    private UUID targetEntityId;
    private String reason;
    private Instant createdAt;

    public AuditLogDto() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getAdminName() { return adminName; }
    public void setAdminName(String adminName) { this.adminName = adminName; }

    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }

    public String getTargetEntityType() { return targetEntityType; }
    public void setTargetEntityType(String targetEntityType) { this.targetEntityType = targetEntityType; }

    public UUID getTargetEntityId() { return targetEntityId; }
    public void setTargetEntityId(UUID targetEntityId) { this.targetEntityId = targetEntityId; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
