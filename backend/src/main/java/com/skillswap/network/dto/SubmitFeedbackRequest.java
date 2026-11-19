package com.skillswap.network.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.UUID;

public class SubmitFeedbackRequest {

    @NotNull(message = "Exchange ID is required")
    private UUID exchangeId;

    @NotNull(message = "Rating score is required (1 to 5)")
    @Min(value = 1, message = "Rating must be between 1 and 5 stars")
    @Max(value = 5, message = "Rating must be between 1 and 5 stars")
    private Short rating;

    @NotBlank(message = "Feedback comment cannot be empty")
    @Size(min = 5, message = "Feedback comment must be at least 5 characters")
    private String comment;

    private Short punctualityRating;
    private Short communicationRating;
    private Short teachingClarityRating;

    public SubmitFeedbackRequest() {}

    public UUID getExchangeId() { return exchangeId; }
    public void setExchangeId(UUID exchangeId) { this.exchangeId = exchangeId; }

    public Short getRating() { return rating; }
    public void setRating(Short rating) { this.rating = rating; }

    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }

    public Short getPunctualityRating() { return punctualityRating; }
    public void setPunctualityRating(Short punctualityRating) { this.punctualityRating = punctualityRating; }

    public Short getCommunicationRating() { return communicationRating; }
    public void setCommunicationRating(Short communicationRating) { this.communicationRating = communicationRating; }

    public Short getTeachingClarityRating() { return teachingClarityRating; }
    public void setTeachingClarityRating(Short teachingClarityRating) { this.teachingClarityRating = teachingClarityRating; }
}
