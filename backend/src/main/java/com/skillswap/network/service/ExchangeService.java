package com.skillswap.network.service;

import com.skillswap.network.dto.ExchangeDto;
import com.skillswap.network.entity.Exchange;
import com.skillswap.network.entity.Lesson;
import com.skillswap.network.entity.User;
import com.skillswap.network.entity.UserProfile;
import com.skillswap.network.exception.BadRequestException;
import com.skillswap.network.exception.ForbiddenException;
import com.skillswap.network.exception.ResourceNotFoundException;
import com.skillswap.network.repository.ExchangeRepository;
import com.skillswap.network.repository.LessonRepository;
import com.skillswap.network.repository.UserProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ExchangeService {

    @Autowired
    private ExchangeRepository exchangeRepository;

    @Autowired
    private UserProfileRepository userProfileRepository;

    @Autowired
    private LessonRepository lessonRepository;

    public List<ExchangeDto> getUserExchanges(User user) {
        return exchangeRepository.findByUserId(user.getId()).stream()
                .map(e -> mapToDto(e, user.getId()))
                .collect(Collectors.toList());
    }

    public ExchangeDto getExchangeById(User user, UUID exchangeId) {
        Exchange exchange = exchangeRepository.findById(exchangeId)
                .orElseThrow(() -> new ResourceNotFoundException("Exchange not found with id: " + exchangeId));

        validateParticipant(user, exchange);
        return mapToDto(exchange, user.getId());
    }

    @Transactional
    public ExchangeDto completeExchange(User user, UUID exchangeId) {
        Exchange exchange = exchangeRepository.findById(exchangeId)
                .orElseThrow(() -> new ResourceNotFoundException("Exchange not found with id: " + exchangeId));

        validateParticipant(user, exchange);

        if ("COMPLETED".equalsIgnoreCase(exchange.getStatus())) {
            return mapToDto(exchange, user.getId());
        }

        if ("CANCELLED".equalsIgnoreCase(exchange.getStatus())) {
            throw new BadRequestException("Cannot complete a cancelled exchange.");
        }

        boolean isUserA = exchange.getUserA().getId().equals(user.getId());
        if (isUserA) {
            exchange.setUserACompleted(true);
        } else {
            exchange.setUserBCompleted(true);
        }

        // Mutual verification check or if sessions completed reaches planned
        if (exchange.isUserACompleted() && exchange.isUserBCompleted()) {
            exchange.setStatus("COMPLETED");
            exchange.setCompletedAt(Instant.now());
            exchange.setSessionsCompleted(exchange.getTotalSessionsPlanned());

            // Increment profile stats for both users
            incrementCompletedExchanges(exchange.getUserA().getId());
            incrementCompletedExchanges(exchange.getUserB().getId());
        }

        exchange = exchangeRepository.save(exchange);
        return mapToDto(exchange, user.getId());
    }

    @Transactional
    public ExchangeDto cancelExchange(User user, UUID exchangeId, String reason) {
        Exchange exchange = exchangeRepository.findById(exchangeId)
                .orElseThrow(() -> new ResourceNotFoundException("Exchange not found with id: " + exchangeId));

        validateParticipant(user, exchange);

        if ("COMPLETED".equalsIgnoreCase(exchange.getStatus())) {
            throw new BadRequestException("Cannot cancel an already completed exchange.");
        }

        if (reason == null || reason.trim().isEmpty()) {
            throw new BadRequestException("A cancellation reason is required.");
        }

        exchange.setStatus("CANCELLED");
        exchange.setCancelledByUser(user);
        exchange.setCancellationReason(reason.trim());

        // Cancel any future scheduled lessons under this exchange
        List<Lesson> lessons = lessonRepository.findByExchangeIdOrderByLessonDateAscStartTimeAsc(exchange.getId());
        for (Lesson lesson : lessons) {
            if ("SCHEDULED".equalsIgnoreCase(lesson.getStatus())) {
                lesson.setStatus("CANCELLED");
                lesson.setNotes("Cancelled due to exchange termination: " + reason);
                lessonRepository.save(lesson);
            }
        }

        exchange = exchangeRepository.save(exchange);
        return mapToDto(exchange, user.getId());
    }

    private void validateParticipant(User user, Exchange exchange) {
        boolean isParticipant = exchange.getUserA().getId().equals(user.getId()) ||
                exchange.getUserB().getId().equals(user.getId());
        if (!isParticipant && !"ROLE_ADMIN".equalsIgnoreCase(user.getRole())) {
            throw new ForbiddenException("You are not an authorized participant in this exchange.");
        }
    }

    private void incrementCompletedExchanges(UUID userId) {
        userProfileRepository.findByUserId(userId).ifPresent(p -> {
            p.setCompletedExchangesCount(p.getCompletedExchangesCount() + 1);
            userProfileRepository.save(p);
        });
    }

    private ExchangeDto mapToDto(Exchange e, UUID currentUserId) {
        ExchangeDto dto = new ExchangeDto();
        dto.setId(e.getId());
        dto.setRequestId(e.getRequest().getId());

        boolean isUserA = e.getUserA().getId().equals(currentUserId);
        User partner = isUserA ? e.getUserB() : e.getUserA();
        UserProfile partnerProfile = userProfileRepository.findByUserId(partner.getId()).orElse(null);

        dto.setPartnerId(partner.getId());
        dto.setPartnerName(partnerProfile != null ? partnerProfile.getFullName() : partner.getEmail());
        dto.setPartnerAvatar(partnerProfile != null ? partnerProfile.getAvatarUrl() : null);

        dto.setSkillYouTeach(isUserA ? e.getSkillAToB().getName() : e.getSkillBToA().getName());
        dto.setSkillYouLearn(isUserA ? e.getSkillBToA().getName() : e.getSkillAToB().getName());

        dto.setStatus(e.getStatus());
        dto.setTotalSessionsPlanned(e.getTotalSessionsPlanned());
        dto.setSessionsCompleted(e.getSessionsCompleted());
        dto.setYourCompletionSignoff(isUserA ? e.isUserACompleted() : e.isUserBCompleted());
        dto.setPartnerCompletionSignoff(isUserA ? e.isUserBCompleted() : e.isUserACompleted());
        dto.setCancellationReason(e.getCancellationReason());
        dto.setStartedAt(e.getStartedAt());
        dto.setCompletedAt(e.getCompletedAt());
        return dto;
    }
}
