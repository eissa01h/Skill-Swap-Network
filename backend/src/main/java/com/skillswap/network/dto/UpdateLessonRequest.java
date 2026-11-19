package com.skillswap.network.dto;

import java.time.LocalDate;
import java.time.LocalTime;

public class UpdateLessonRequest {
    private String title;
    private LocalDate lessonDate;
    private LocalTime startTime;
    private Integer durationMinutes;
    private String deliveryMethod;
    private String meetingLink;
    private String notes;
    private String status;

    public UpdateLessonRequest() {}

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public LocalDate getLessonDate() { return lessonDate; }
    public void setLessonDate(LocalDate lessonDate) { this.lessonDate = lessonDate; }

    public LocalTime getStartTime() { return startTime; }
    public void setStartTime(LocalTime startTime) { this.startTime = startTime; }

    public Integer getDurationMinutes() { return durationMinutes; }
    public void setDurationMinutes(Integer durationMinutes) { this.durationMinutes = durationMinutes; }

    public String getDeliveryMethod() { return deliveryMethod; }
    public void setDeliveryMethod(String deliveryMethod) { this.deliveryMethod = deliveryMethod; }

    public String getMeetingLink() { return meetingLink; }
    public void setMeetingLink(String meetingLink) { this.meetingLink = meetingLink; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}

