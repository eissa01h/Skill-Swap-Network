package com.skillswap.network.dto;

import jakarta.validation.constraints.NotBlank;

public class CancelExchangeDto {

    @NotBlank(message = "Cancellation reason is mandatory")
    private String reason;

    public CancelExchangeDto() {}

    public CancelExchangeDto(String reason) {
        this.reason = reason;
    }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
}
