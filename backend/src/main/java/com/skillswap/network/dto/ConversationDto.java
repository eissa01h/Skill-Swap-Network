package com.skillswap.network.dto;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public class ConversationDto {
    private UUID id;
    private UUID partnerId;
    private String partnerName;
    private String partnerAvatar;
    private UUID exchangeId;
    private String lastMessage;
    private Instant lastMessageAt;
    private long unreadCount;
    private List<MessageDto> messages;

    public ConversationDto() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getPartnerId() { return partnerId; }
    public void setPartnerId(UUID partnerId) { this.partnerId = partnerId; }

    public String getPartnerName() { return partnerName; }
    public void setPartnerName(String partnerName) { this.partnerName = partnerName; }

    public String getPartnerAvatar() { return partnerAvatar; }
    public void setPartnerAvatar(String partnerAvatar) { this.partnerAvatar = partnerAvatar; }

    public UUID getExchangeId() { return exchangeId; }
    public void setExchangeId(UUID exchangeId) { this.exchangeId = exchangeId; }

    public String getLastMessage() { return lastMessage; }
    public void setLastMessage(String lastMessage) { this.lastMessage = lastMessage; }

    public Instant getLastMessageAt() { return lastMessageAt; }
    public void setLastMessageAt(Instant lastMessageAt) { this.lastMessageAt = lastMessageAt; }

    public long getUnreadCount() { return unreadCount; }
    public void setUnreadCount(long unreadCount) { this.unreadCount = unreadCount; }

    public List<MessageDto> getMessages() { return messages; }
    public void setMessages(List<MessageDto> messages) { this.messages = messages; }
}
