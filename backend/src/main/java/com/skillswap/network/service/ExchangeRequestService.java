package com.skillswap.network.service;

import com.skillswap.network.dto.CreateExchangeRequestDto;
import com.skillswap.network.dto.ExchangeRequestDto;
import com.skillswap.network.entity.*;
import com.skillswap.network.exception.BadRequestException;
import com.skillswap.network.exception.ConflictException;
import com.skillswap.network.exception.ForbiddenException;
import com.skillswap.network.exception.ResourceNotFoundException;
import com.skillswap.network.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ExchangeRequestService {

    @Autowired
    private ExchangeRequestRepository exchangeRequestRepository;

    @Autowired
    private ExchangeRepository exchangeRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserProfileRepository userProfileRepository;

    @Autowired
    private SkillRepository skillRepository;

    @Autowired
    private ConversationRepository conversationRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Transactional
    public ExchangeRequestDto createRequest(User sender, CreateExchangeRequestDto dto) {
        if (sender.getId().equals(dto.getRecipientId())) {
            throw new BadRequestException("You cannot send an exchange request to yourself.");
        }

        if (dto.getOfferedSkillId().equals(dto.getRequestedSkillId())) {
            throw new BadRequestException("Offered and requested skills must be distinct for a mutual barter.");
        }

        User recipient = userRepository.findById(dto.getRecipientId())
                .orElseThrow(() -> new ResourceNotFoundException("Recipient user not found with id: " + dto.getRecipientId()));

        if ("BLOCKED".equalsIgnoreCase(recipient.getStatus())) {
            throw new BadRequestException("Cannot propose an exchange with a suspended account.");
        }

        Skill offeredSkill = skillRepository.findById(dto.getOfferedSkillId())
                .orElseThrow(() -> new ResourceNotFoundException("Offered skill not found with id: " + dto.getOfferedSkillId()));

        Skill requestedSkill = skillRepository.findById(dto.getRequestedSkillId())
                .orElseThrow(() -> new ResourceNotFoundException("Requested skill not found with id: " + dto.getRequestedSkillId()));

        ExchangeRequest req = new ExchangeRequest(
                sender,
                recipient,
                offeredSkill,
                requestedSkill,
                dto.getMessage(),
                dto.getProposedSchedule()
        );

        req = exchangeRequestRepository.save(req);

        // Notify recipient
        Notification notification = new Notification(
                recipient,
                "SWAP_REQUEST_RECEIVED",
                "New Skill Swap Proposal",
                sender.getEmail() + " proposed exchanging " + offeredSkill.getName() + " for " + requestedSkill.getName(),
                "EXCHANGE_REQUEST",
                req.getId()
        );
        notificationRepository.save(notification);

        return mapToDto(req);
    }

    public List<ExchangeRequestDto> getSentRequests(User sender) {
        return exchangeRequestRepository.findBySenderIdOrderByCreatedAtDesc(sender.getId()).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public List<ExchangeRequestDto> getReceivedRequests(User recipient) {
        return exchangeRequestRepository.findByRecipientIdOrderByCreatedAtDesc(recipient.getId()).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public ExchangeRequestDto acceptRequest(User recipient, UUID requestId) {
        ExchangeRequest req = exchangeRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Exchange request not found with id: " + requestId));

        // Strict authorization rule: Only recipient may accept
        if (!req.getRecipient().getId().equals(recipient.getId())) {
            throw new ForbiddenException("Only the recipient of a proposal may accept it.");
        }

        if (!"PENDING".equalsIgnoreCase(req.getStatus())) {
            throw new ConflictException("Cannot accept request in status: " + req.getStatus());
        }

        req.setStatus("ACCEPTED");
        req.setRespondedAt(Instant.now());
        req = exchangeRequestRepository.save(req);

        // Automatically create active Exchange
        Exchange exchange = new Exchange(
                req,
                req.getSender(),
                req.getRecipient(),
                req.getOfferedSkill(),
                req.getRequestedSkill(),
                4
        );
        exchange = exchangeRepository.save(exchange);

        // Ensure direct messaging channel exists
        User u1 = req.getSender();
        User u2 = req.getRecipient();
        UUID firstId = u1.getId().toString().compareTo(u2.getId().toString()) < 0 ? u1.getId() : u2.getId();
        UUID secondId = firstId.equals(u1.getId()) ? u2.getId() : u1.getId();

        conversationRepository.findByUserOneIdAndUserTwoId(firstId, secondId)
                .orElseGet(() -> conversationRepository.save(new Conversation(u1, u2, exchange)));

        // Notify sender
        Notification notification = new Notification(
                req.getSender(),
                "SWAP_REQUEST_ACCEPTED",
                "Skill Swap Accepted! 🎉",
                recipient.getEmail() + " accepted your exchange proposal for " + req.getOfferedSkill().getName(),
                "EXCHANGE",
                exchange.getId()
        );
        notificationRepository.save(notification);

        return mapToDto(req);
    }

    @Transactional
    public ExchangeRequestDto declineRequest(User recipient, UUID requestId) {
        ExchangeRequest req = exchangeRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Exchange request not found with id: " + requestId));

        // Strict authorization rule: Only recipient may decline
        if (!req.getRecipient().getId().equals(recipient.getId())) {
            throw new ForbiddenException("Only the recipient of a proposal may decline it.");
        }

        if (!"PENDING".equalsIgnoreCase(req.getStatus())) {
            throw new ConflictException("Cannot decline request in status: " + req.getStatus());
        }

        req.setStatus("DECLINED");
        req.setRespondedAt(Instant.now());
        req = exchangeRequestRepository.save(req);

        // Notify sender
        Notification notification = new Notification(
                req.getSender(),
                "SWAP_REQUEST_DECLINED",
                "Proposal Declined",
                recipient.getEmail() + " was unable to accept your swap proposal at this time.",
                "EXCHANGE_REQUEST",
                req.getId()
        );
        notificationRepository.save(notification);

        return mapToDto(req);
    }

    @Transactional
    public ExchangeRequestDto cancelRequest(User sender, UUID requestId, String reason) {
        ExchangeRequest req = exchangeRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Exchange request not found with id: " + requestId));

        // Strict authorization rule: Only sender may cancel their pending proposal
        if (!req.getSender().getId().equals(sender.getId())) {
            throw new ForbiddenException("Only the sender may cancel their pending proposal.");
        }

        if (!"PENDING".equalsIgnoreCase(req.getStatus())) {
            throw new ConflictException("Cannot cancel a request that is already " + req.getStatus());
        }

        req.setStatus("CANCELLED");
        req.setCancellationReason(reason != null ? reason : "Sender withdrew proposal");
        req.setRespondedAt(Instant.now());
        req = exchangeRequestRepository.save(req);

        return mapToDto(req);
    }

    private ExchangeRequestDto mapToDto(ExchangeRequest req) {
        ExchangeRequestDto dto = new ExchangeRequestDto();
        dto.setId(req.getId());
        dto.setSenderId(req.getSender().getId());
        dto.setRecipientId(req.getRecipient().getId());

        UserProfile sp = userProfileRepository.findByUserId(req.getSender().getId()).orElse(null);
        UserProfile rp = userProfileRepository.findByUserId(req.getRecipient().getId()).orElse(null);

        dto.setSenderName(sp != null ? sp.getFullName() : req.getSender().getEmail());
        dto.setSenderAvatar(sp != null ? sp.getAvatarUrl() : null);

        dto.setRecipientName(rp != null ? rp.getFullName() : req.getRecipient().getEmail());
        dto.setRecipientAvatar(rp != null ? rp.getAvatarUrl() : null);

        dto.setOfferedSkillId(req.getOfferedSkill().getId());
        dto.setOfferedSkillName(req.getOfferedSkill().getName());

        dto.setRequestedSkillId(req.getRequestedSkill().getId());
        dto.setRequestedSkillName(req.getRequestedSkill().getName());

        dto.setStatus(req.getStatus());
        dto.setMessage(req.getMessage());
        dto.setProposedSchedule(req.getProposedSchedule());
        dto.setRespondedAt(req.getRespondedAt());
        dto.setCancellationReason(req.getCancellationReason());
        dto.setCreatedAt(req.getCreatedAt());
        return dto;
    }
}

