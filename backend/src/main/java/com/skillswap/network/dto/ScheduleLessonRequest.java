package com.skillswap.network.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

public class ScheduleLessonRequest {

    @NotNull(message = "Exchange ID is required")
    private UUID exchangeId;

    @NotNull(message = "Instructor ID is required")
    private UUID instructorId;

    @NotNull(message = "Topic skill ID is required")
    private UUID skillId;

    @NotBlank(message = "Lesson title is required")
    private String title;

    @NotNull(message = "Lesson date is required")
    private LocalDate lessonDate;

    @NotNull(message = "Start time is required")
    private LocalTime startTime;

    private int durationMinutes = 60;
    private String deliveryMethod = "ONLINE_VIDEO";
    private String meetingLink;
    private String notes;

    public ScheduleLessonRequest() {}

    public UUID getExchangeId() { return exchangeId; }
    public void setExchangeId(UUID exchangeId) { this.exchangeId = exchangeId; }

    public UUID getInstructorId() { return instructorId; }
    public void setInstructorId(UUID instructorId) { this.instructorId = instructorId; }

    public UUID getSkillId() { return skillId; }
    public void setSkillId(UUID skillId) { this.skillId = skillId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public LocalDate getLessonDate() { return lessonDate; }
    public void setLessonDate(LocalDate lessonDate) { this.lessonDate = lessonDate; }

    public LocalTime getStartTime() { return startTime; }
    public void setStartTime(LocalTime startTime) { this.startTime = startTime; }

    public int getDurationMinutes() { return durationMinutes; }
    public void setDurationMinutes(int durationMinutes) { this.durationMinutes = durationMinutes; }

    public String getDeliveryMethod() { return deliveryMethod; }
    public void setDeliveryMethod(String deliveryMethod) { this.deliveryMethod = deliveryMethod; }

    public String getMeetingLink() { return meetingLink; }
    public void setMeetingLink(String meetingLink) { this.meetingLink = meetingLink; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}

