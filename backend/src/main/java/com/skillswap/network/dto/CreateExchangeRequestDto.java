package com.skillswap.network.dto;

import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public class CreateExchangeRequestDto {

    @NotNull(message = "Recipient user ID is required")
    private UUID recipientId;

    @NotNull(message = "Offered skill ID is required")
    private UUID offeredSkillId;

    @NotNull(message = "Requested skill ID is required")
    private UUID requestedSkillId;

    private String message;
    private String proposedSchedule;

    public CreateExchangeRequestDto() {}

    public UUID getRecipientId() { return recipientId; }
    public void setRecipientId(UUID recipientId) { this.recipientId = recipientId; }

    public UUID getOfferedSkillId() { return offeredSkillId; }
    public void setOfferedSkillId(UUID offeredSkillId) { this.offeredSkillId = offeredSkillId; }

    public UUID getRequestedSkillId() { return requestedSkillId; }
    public void setRequestedSkillId(UUID requestedSkillId) { this.requestedSkillId = requestedSkillId; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getProposedSchedule() { return proposedSchedule; }
    public void setProposedSchedule(String proposedSchedule) { this.proposedSchedule = proposedSchedule; }
}
