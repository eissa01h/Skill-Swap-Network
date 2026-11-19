package com.skillswap.network.dto;

import java.time.Instant;
import java.util.UUID;

public class RatingFeedbackDto {
    private UUID id;
    private UUID exchangeId;
    private UUID reviewerId;
    private String reviewerName;
    private String reviewerAvatar;
    private UUID revieweeId;
    private String revieweeName;
    private String skillReviewedName;
    private short rating;
    private String comment;
    private Short punctualityRating;
    private Short communicationRating;
    private Short teachingClarityRating;
    private Instant createdAt;

    public RatingFeedbackDto() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getExchangeId() { return exchangeId; }
    public void setExchangeId(UUID exchangeId) { this.exchangeId = exchangeId; }

    public UUID getReviewerId() { return reviewerId; }
    public void setReviewerId(UUID reviewerId) { this.reviewerId = reviewerId; }

    public String getReviewerName() { return reviewerName; }
    public void setReviewerName(String reviewerName) { this.reviewerName = reviewerName; }

    public String getReviewerAvatar() { return reviewerAvatar; }
    public void setReviewerAvatar(String reviewerAvatar) { this.reviewerAvatar = reviewerAvatar; }

    public UUID getRevieweeId() { return revieweeId; }
    public void setRevieweeId(UUID revieweeId) { this.revieweeId = revieweeId; }

    public String getRevieweeName() { return revieweeName; }
    public void setRevieweeName(String revieweeName) { this.revieweeName = revieweeName; }

    public String getSkillReviewedName() { return skillReviewedName; }
    public void setSkillReviewedName(String skillReviewedName) { this.skillReviewedName = skillReviewedName; }

    public short getRating() { return rating; }
    public void setRating(short rating) { this.rating = rating; }

    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }

    public Short getPunctualityRating() { return punctualityRating; }
    public void setPunctualityRating(Short punctualityRating) { this.punctualityRating = punctualityRating; }

    public Short getCommunicationRating() { return communicationRating; }
    public void setCommunicationRating(Short communicationRating) { this.communicationRating = communicationRating; }

    public Short getTeachingClarityRating() { return teachingClarityRating; }
    public void setTeachingClarityRating(Short teachingClarityRating) { this.teachingClarityRating = teachingClarityRating; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
