package com.skillswap.network.dto;

import java.time.Instant;
import java.util.UUID;

public class ExchangeRequestDto {
    private UUID id;
    private UUID senderId;
    private String senderName;
    private String senderAvatar;
    private UUID recipientId;
    private String recipientName;
    private String recipientAvatar;
    private UUID offeredSkillId;
    private String offeredSkillName;
    private UUID requestedSkillId;
    private String requestedSkillName;
    private String status;
    private String message;
    private String proposedSchedule;
    private Instant respondedAt;
    private String cancellationReason;
    private Instant createdAt;

    public ExchangeRequestDto() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getSenderId() { return senderId; }
    public void setSenderId(UUID senderId) { this.senderId = senderId; }

    public String getSenderName() { return senderName; }
    public void setSenderName(String senderName) { this.senderName = senderName; }

    public String getSenderAvatar() { return senderAvatar; }
    public void setSenderAvatar(String senderAvatar) { this.senderAvatar = senderAvatar; }

    public UUID getRecipientId() { return recipientId; }
    public void setRecipientId(UUID recipientId) { this.recipientId = recipientId; }

    public String getRecipientName() { return recipientName; }
    public void setRecipientName(String recipientName) { this.recipientName = recipientName; }

    public String getRecipientAvatar() { return recipientAvatar; }
    public void setRecipientAvatar(String recipientAvatar) { this.recipientAvatar = recipientAvatar; }

    public UUID getOfferedSkillId() { return offeredSkillId; }
    public void setOfferedSkillId(UUID offeredSkillId) { this.offeredSkillId = offeredSkillId; }

    public String getOfferedSkillName() { return offeredSkillName; }
    public void setOfferedSkillName(String offeredSkillName) { this.offeredSkillName = offeredSkillName; }

    public UUID getRequestedSkillId() { return requestedSkillId; }
    public void setRequestedSkillId(UUID requestedSkillId) { this.requestedSkillId = requestedSkillId; }

    public String getRequestedSkillName() { return requestedSkillName; }
    public void setRequestedSkillName(String requestedSkillName) { this.requestedSkillName = requestedSkillName; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getProposedSchedule() { return proposedSchedule; }
    public void setProposedSchedule(String proposedSchedule) { this.proposedSchedule = proposedSchedule; }

    public Instant getRespondedAt() { return respondedAt; }
    public void setRespondedAt(Instant respondedAt) { this.respondedAt = respondedAt; }

    public String getCancellationReason() { return cancellationReason; }
    public void setCancellationReason(String cancellationReason) { this.cancellationReason = cancellationReason; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
