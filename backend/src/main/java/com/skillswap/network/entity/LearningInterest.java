package com.skillswap.network.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "learning_interests", uniqueConstraints = {
    @UniqueConstraint(name = "uk_learning_interests_user_skill", columnNames = {"user_id", "skill_id"})
})
public class LearningInterest {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "skill_id", nullable = false)
    private Skill skill;

    @Column(name = "target_level", nullable = false, length = 30)
    private String targetLevel;

    @Column(nullable = false, length = 20)
    private String priority = "MEDIUM";

    @Column(name = "learning_goals", columnDefinition = "TEXT")
    private String learningGoals;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt = Instant.now();

    public LearningInterest() {}

    public LearningInterest(User user, Skill skill, String targetLevel, String priority, String learningGoals) {
        this.user = user;
        this.skill = skill;
        this.targetLevel = targetLevel;
        this.priority = priority != null ? priority : "MEDIUM";
        this.learningGoals = learningGoals;
        this.createdAt = Instant.now();
        this.updatedAt = Instant.now();
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = Instant.now();
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Skill getSkill() { return skill; }
    public void setSkill(Skill skill) { this.skill = skill; }

    public String getTargetLevel() { return targetLevel; }
    public void setTargetLevel(String targetLevel) { this.targetLevel = targetLevel; }

    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }

    public String getLearningGoals() { return learningGoals; }
    public void setLearningGoals(String learningGoals) { this.learningGoals = learningGoals; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
