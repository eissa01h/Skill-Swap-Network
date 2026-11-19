package com.skillswap.network.dto;

import java.time.Instant;
import java.util.UUID;

public class ExchangeDto {
    private UUID id;
    private UUID requestId;
    private UUID partnerId;
    private String partnerName;
    private String partnerAvatar;
    private String skillYouTeach;
    private String skillYouLearn;
    private String status;
    private int totalSessionsPlanned;
    private int sessionsCompleted;
    private boolean yourCompletionSignoff;
    private boolean partnerCompletionSignoff;
    private String cancellationReason;
    private Instant startedAt;
    private Instant completedAt;

    public ExchangeDto() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getRequestId() { return requestId; }
    public void setRequestId(UUID requestId) { this.requestId = requestId; }

    public UUID getPartnerId() { return partnerId; }
    public void setPartnerId(UUID partnerId) { this.partnerId = partnerId; }

    public String getPartnerName() { return partnerName; }
    public void setPartnerName(String partnerName) { this.partnerName = partnerName; }

    public String getPartnerAvatar() { return partnerAvatar; }
    public void setPartnerAvatar(String partnerAvatar) { this.partnerAvatar = partnerAvatar; }

    public String getSkillYouTeach() { return skillYouTeach; }
    public void setSkillYouTeach(String skillYouTeach) { this.skillYouTeach = skillYouTeach; }

    public String getSkillYouLearn() { return skillYouLearn; }
    public void setSkillYouLearn(String skillYouLearn) { this.skillYouLearn = skillYouLearn; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public int getTotalSessionsPlanned() { return totalSessionsPlanned; }
    public void setTotalSessionsPlanned(int totalSessionsPlanned) { this.totalSessionsPlanned = totalSessionsPlanned; }

    public int getSessionsCompleted() { return sessionsCompleted; }
    public void setSessionsCompleted(int sessionsCompleted) { this.sessionsCompleted = sessionsCompleted; }

    public boolean isYourCompletionSignoff() { return yourCompletionSignoff; }
    public void setYourCompletionSignoff(boolean yourCompletionSignoff) { this.yourCompletionSignoff = yourCompletionSignoff; }

    public boolean isPartnerCompletionSignoff() { return partnerCompletionSignoff; }
    public void setPartnerCompletionSignoff(boolean partnerCompletionSignoff) { this.partnerCompletionSignoff = partnerCompletionSignoff; }

    public String getCancellationReason() { return cancellationReason; }
    public void setCancellationReason(String cancellationReason) { this.cancellationReason = cancellationReason; }

    public Instant getStartedAt() { return startedAt; }
    public void setStartedAt(Instant startedAt) { this.startedAt = startedAt; }

    public Instant getCompletedAt() { return completedAt; }
    public void setCompletedAt(Instant completedAt) { this.completedAt = completedAt; }
}
