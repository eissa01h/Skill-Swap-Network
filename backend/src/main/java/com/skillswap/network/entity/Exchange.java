package com.skillswap.network.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "exchanges")
public class Exchange {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "request_id", nullable = false, unique = true)
    private ExchangeRequest request;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_a_id", nullable = false)
    private User userA;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_b_id", nullable = false)
    private User userB;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "skill_a_to_b_id", nullable = false)
    private Skill skillAToB;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "skill_b_to_a_id", nullable = false)
    private Skill skillBToA;

    @Column(nullable = false, length = 30)
    private String status = "ACTIVE";

    @Column(name = "total_sessions_planned", nullable = false)
    private int totalSessionsPlanned = 4;

    @Column(name = "sessions_completed", nullable = false)
    private int sessionsCompleted = 0;

    @Column(name = "user_a_completed", nullable = false)
    private boolean userACompleted = false;

    @Column(name = "user_b_completed", nullable = false)
    private boolean userBCompleted = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cancelled_by_user_id")
    private User cancelledByUser;

    @Column(name = "cancellation_reason", columnDefinition = "TEXT")
    private String cancellationReason;

    @Column(name = "started_at", nullable = false)
    private Instant startedAt = Instant.now();

    @Column(name = "completed_at")
    private Instant completedAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt = Instant.now();

    public Exchange() {}

    public Exchange(ExchangeRequest request, User userA, User userB, Skill skillAToB, Skill skillBToA, int totalSessionsPlanned) {
        this.request = request;
        this.userA = userA;
        this.userB = userB;
        this.skillAToB = skillAToB;
        this.skillBToA = skillBToA;
        this.totalSessionsPlanned = totalSessionsPlanned > 0 ? totalSessionsPlanned : 4;
        this.status = "ACTIVE";
        this.startedAt = Instant.now();
        this.updatedAt = Instant.now();
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = Instant.now();
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public ExchangeRequest getRequest() { return request; }
    public void setRequest(ExchangeRequest request) { this.request = request; }

    public User getUserA() { return userA; }
    public void setUserA(User userA) { this.userA = userA; }

    public User getUserB() { return userB; }
    public void setUserB(User userB) { this.userB = userB; }

    public Skill getSkillAToB() { return skillAToB; }
    public void setSkillAToB(Skill skillAToB) { this.skillAToB = skillAToB; }

    public Skill getSkillBToA() { return skillBToA; }
    public void setSkillBToA(Skill skillBToA) { this.skillBToA = skillBToA; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public int getTotalSessionsPlanned() { return totalSessionsPlanned; }
    public void setTotalSessionsPlanned(int totalSessionsPlanned) { this.totalSessionsPlanned = totalSessionsPlanned; }

    public int getSessionsCompleted() { return sessionsCompleted; }
    public void setSessionsCompleted(int sessionsCompleted) { this.sessionsCompleted = sessionsCompleted; }

    public boolean isUserACompleted() { return userACompleted; }
    public void setUserACompleted(boolean userACompleted) { this.userACompleted = userACompleted; }

    public boolean isUserBCompleted() { return userBCompleted; }
    public void setUserBCompleted(boolean userBCompleted) { this.userBCompleted = userBCompleted; }

    public User getCancelledByUser() { return cancelledByUser; }
    public void setCancelledByUser(User cancelledByUser) { this.cancelledByUser = cancelledByUser; }

    public String getCancellationReason() { return cancellationReason; }
    public void setCancellationReason(String cancellationReason) { this.cancellationReason = cancellationReason; }

    public Instant getStartedAt() { return startedAt; }
    public void setStartedAt(Instant startedAt) { this.startedAt = startedAt; }

    public Instant getCompletedAt() { return completedAt; }
    public void setCompletedAt(Instant completedAt) { this.completedAt = completedAt; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
