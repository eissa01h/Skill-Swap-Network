package com.skillswap.network.dto;

import jakarta.validation.constraints.NotBlank;

public class ResolveReportRequest {

    @NotBlank(message = "Enforcement action is required (WARNING_ISSUED, CONTENT_REMOVED, ACCOUNT_BLOCKED, DISMISSED)")
    private String action;

    private String notes;

    public ResolveReportRequest() {}

    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}

