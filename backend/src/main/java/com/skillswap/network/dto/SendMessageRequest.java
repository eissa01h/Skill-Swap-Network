package com.skillswap.network.dto;

import jakarta.validation.constraints.NotBlank;

public class SendMessageRequest {

    @NotBlank(message = "Message text cannot be empty")
    private String content;

    public SendMessageRequest() {}

    public SendMessageRequest(String content) {
        this.content = content;
    }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
}
