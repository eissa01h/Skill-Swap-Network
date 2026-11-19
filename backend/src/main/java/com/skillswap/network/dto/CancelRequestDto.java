package com.skillswap.network.dto;

public class CancelRequestDto {
    private String reason;

    public CancelRequestDto() {}

    public CancelRequestDto(String reason) {
        this.reason = reason;
    }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
}
