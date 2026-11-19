package com.skillswap.network.service;

import com.skillswap.network.dto.ConversationDto;
import com.skillswap.network.dto.MessageDto;
import com.skillswap.network.dto.SendMessageRequest;
import com.skillswap.network.entity.Conversation;
import com.skillswap.network.entity.Message;
import com.skillswap.network.entity.User;
import com.skillswap.network.entity.UserProfile;
import com.skillswap.network.exception.ForbiddenException;
import com.skillswap.network.exception.ResourceNotFoundException;
import com.skillswap.network.repository.ConversationRepository;
import com.skillswap.network.repository.MessageRepository;
import com.skillswap.network.repository.UserProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ChatService {

    @Autowired
    private ConversationRepository conversationRepository;

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private UserProfileRepository userProfileRepository;

    public List<ConversationDto> getUserConversations(User user) {
        return conversationRepository.findUserConversations(user.getId()).stream()
                .map(c -> mapToDto(c, user.getId()))
                .collect(Collectors.toList());
    }

    @Transactional
    public List<MessageDto> getConversationMessages(User user, UUID conversationId) {
        Conversation conv = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new ResourceNotFoundException("Conversation not found with id: " + conversationId));

        validateParticipant(user, conv);

        List<Message> messages = messageRepository.findByConversationIdOrderBySentAtAsc(conversationId);

        // Mark incoming messages as read
        for (Message m : messages) {
            if (!m.getSender().getId().equals(user.getId()) && !m.isRead()) {
                m.setRead(true);
                m.setReadAt(Instant.now());
                messageRepository.save(m);
            }
        }

        return messages.stream()
                .map(m -> mapToMessageDto(m, user.getId()))
                .collect(Collectors.toList());
    }

    @Transactional
    public MessageDto sendMessage(User sender, UUID conversationId, SendMessageRequest request) {
        Conversation conv = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new ResourceNotFoundException("Conversation not found with id: " + conversationId));

        validateParticipant(sender, conv);

        Message message = new Message(conv, sender, request.getContent().trim());
        message = messageRepository.save(message);

        // Update conversation last message timestamp
        conv.setLastMessageAt(Instant.now());
        conversationRepository.save(conv);

        return mapToMessageDto(message, sender.getId());
    }

    private void validateParticipant(User user, Conversation conv) {
        boolean isParticipant = conv.getUserOne().getId().equals(user.getId()) ||
                conv.getUserTwo().getId().equals(user.getId());
        if (!isParticipant) {
            throw new ForbiddenException("You are not an authorized participant in this conversation.");
        }
    }

    private ConversationDto mapToDto(Conversation c, UUID currentUserId) {
        ConversationDto dto = new ConversationDto();
        dto.setId(c.getId());

        boolean isUserOne = c.getUserOne().getId().equals(currentUserId);
        User partner = isUserOne ? c.getUserTwo() : c.getUserOne();
        UserProfile partnerProfile = userProfileRepository.findByUserId(partner.getId()).orElse(null);

        dto.setPartnerId(partner.getId());
        dto.setPartnerName(partnerProfile != null ? partnerProfile.getFullName() : partner.getEmail());
        dto.setPartnerAvatar(partnerProfile != null ? partnerProfile.getAvatarUrl() : null);

        if (c.getExchange() != null) {
            dto.setExchangeId(c.getExchange().getId());
        }

        dto.setLastMessageAt(c.getLastMessageAt());
        dto.setUnreadCount(messageRepository.countUnreadMessages(c.getId(), currentUserId));

        // Get last message snippet
        List<Message> messages = messageRepository.findByConversationIdOrderBySentAtAsc(c.getId());
        if (!messages.isEmpty()) {
            dto.setLastMessage(messages.get(messages.size() - 1).getContent());
        }

        return dto;
    }

    private MessageDto mapToMessageDto(Message m, UUID currentUserId) {
        MessageDto dto = new MessageDto();
        dto.setId(m.getId());
        dto.setConversationId(m.getConversation().getId());
        dto.setSenderId(m.getSender().getId());

        UserProfile sp = userProfileRepository.findByUserId(m.getSender().getId()).orElse(null);
        dto.setSenderName(sp != null ? sp.getFullName() : m.getSender().getEmail());

        dto.setContent(m.getContent());
        dto.setRead(m.isRead());
        dto.setSelf(m.getSender().getId().equals(currentUserId));
        dto.setSentAt(m.getSentAt());
        return dto;
    }
}

