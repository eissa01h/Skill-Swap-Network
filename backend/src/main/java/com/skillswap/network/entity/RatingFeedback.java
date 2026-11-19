package com.skillswap.network.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "ratings_feedback", uniqueConstraints = {
    @UniqueConstraint(name = "uk_ratings_exchange_reviewer", columnNames = {"exchange_id", "reviewer_id"})
})
public class RatingFeedback {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "exchange_id", nullable = false)
    private Exchange exchange;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "reviewer_id", nullable = false)
    private User reviewer;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "reviewee_id", nullable = false)
    private User reviewee;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "skill_reviewed_id", nullable = false)
    private Skill skillReviewed;

    @Column(nullable = false)
    private short rating;

    @Column(name = "feedback_comment", nullable = false, columnDefinition = "TEXT")
    private String feedbackComment;

    @Column(name = "punctuality_rating")
    private Short punctualityRating;

    @Column(name = "communication_rating")
    private Short communicationRating;

    @Column(name = "teaching_clarity_rating")
    private Short teachingClarityRating;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt = Instant.now();

    public RatingFeedback() {}

    public RatingFeedback(Exchange exchange, User reviewer, User reviewee, Skill skillReviewed, short rating, String feedbackComment) {
        this.exchange = exchange;
        this.reviewer = reviewer;
        this.reviewee = reviewee;
        this.skillReviewed = skillReviewed;
        this.rating = rating;
        this.feedbackComment = feedbackComment;
        this.createdAt = Instant.now();
        this.updatedAt = Instant.now();
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = Instant.now();
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public Exchange getExchange() { return exchange; }
    public void setExchange(Exchange exchange) { this.exchange = exchange; }

    public User getReviewer() { return reviewer; }
    public void setReviewer(User reviewer) { this.reviewer = reviewer; }

    public User getReviewee() { return reviewee; }
    public void setReviewee(User reviewee) { this.reviewee = reviewee; }

    public Skill getSkillReviewed() { return skillReviewed; }
    public void setSkillReviewed(Skill skillReviewed) { this.skillReviewed = skillReviewed; }

    public short getRating() { return rating; }
    public void setRating(short rating) { this.rating = rating; }

    public String getFeedbackComment() { return feedbackComment; }
    public void setFeedbackComment(String feedbackComment) { this.feedbackComment = feedbackComment; }

    public Short getPunctualityRating() { return punctualityRating; }
    public void setPunctualityRating(Short punctualityRating) { this.punctualityRating = punctualityRating; }

    public Short getCommunicationRating() { return communicationRating; }
    public void setCommunicationRating(Short communicationRating) { this.communicationRating = communicationRating; }

    public Short getTeachingClarityRating() { return teachingClarityRating; }
    public void setTeachingClarityRating(Short teachingClarityRating) { this.teachingClarityRating = teachingClarityRating; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}

