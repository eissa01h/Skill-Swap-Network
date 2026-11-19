package com.skillswap.network.service;

import com.skillswap.network.dto.RatingFeedbackDto;
import com.skillswap.network.dto.SubmitFeedbackRequest;
import com.skillswap.network.entity.*;
import com.skillswap.network.exception.BadRequestException;
import com.skillswap.network.exception.ConflictException;
import com.skillswap.network.exception.ForbiddenException;
import com.skillswap.network.exception.ResourceNotFoundException;
import com.skillswap.network.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class FeedbackService {

    @Autowired
    private RatingFeedbackRepository ratingFeedbackRepository;

    @Autowired
    private ExchangeRepository exchangeRepository;

    @Autowired
    private UserProfileRepository userProfileRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Transactional
    public RatingFeedbackDto submitFeedback(User reviewer, SubmitFeedbackRequest request) {
        Exchange exchange = exchangeRepository.findById(request.getExchangeId())
                .orElseThrow(() -> new ResourceNotFoundException("Exchange not found with id: " + request.getExchangeId()));

        // Rule: Feedback allowed only after exchange completion
        if (!"COMPLETED".equalsIgnoreCase(exchange.getStatus())) {
            throw new BadRequestException("Ratings and feedback can only be submitted after an exchange has been completed.");
        }

        boolean isUserA = exchange.getUserA().getId().equals(reviewer.getId());
        boolean isUserB = exchange.getUserB().getId().equals(reviewer.getId());
        if (!isUserA && !isUserB) {
            throw new ForbiddenException("You were not a participant in this exchange.");
        }

        // Rule: Prevent duplicate feedback for the same exchange
        if (ratingFeedbackRepository.existsByExchangeIdAndReviewerId(exchange.getId(), reviewer.getId())) {
            throw new ConflictException("You have already submitted a review for this completed exchange.");
        }

        User reviewee = isUserA ? exchange.getUserB() : exchange.getUserA();
        Skill skillReviewed = isUserA ? exchange.getSkillBToA() : exchange.getSkillAToB();

        RatingFeedback rf = new RatingFeedback(
                exchange,
                reviewer,
                reviewee,
                skillReviewed,
                request.getRating(),
                request.getComment().trim()
        );
        rf.setPunctualityRating(request.getPunctualityRating());
        rf.setCommunicationRating(request.getCommunicationRating());
        rf.setTeachingClarityRating(request.getTeachingClarityRating());

        rf = ratingFeedbackRepository.save(rf);

        // Recalculate reviewee average rating and total reviews count
        updateUserReputationMetrics(reviewee.getId());

        // Notify reviewee
        Notification notification = new Notification(
                reviewee,
                "REVIEW_RECEIVED",
                "New Peer Review Received! ⭐",
                reviewer.getEmail() + " left a " + request.getRating() + "-star review for your exchange.",
                "REVIEW",
                rf.getId()
        );
        notificationRepository.save(notification);

        return mapToDto(rf);
    }

    public List<RatingFeedbackDto> getReviewsForUser(UUID userId) {
        return ratingFeedbackRepository.findByRevieweeIdOrderByCreatedAtDesc(userId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public List<RatingFeedbackDto> getReviewsForExchange(UUID exchangeId) {
        return ratingFeedbackRepository.findByExchangeId(exchangeId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private void updateUserReputationMetrics(UUID revieweeId) {
        Double avg = ratingFeedbackRepository.calculateAverageRatingForUser(revieweeId);
        long count = ratingFeedbackRepository.countReviewsForUser(revieweeId);

        userProfileRepository.findByUserId(revieweeId).ifPresent(p -> {
            p.setTotalReviews((int) count);
            if (avg != null) {
                p.setAverageRating(BigDecimal.valueOf(avg).setScale(2, RoundingMode.HALF_UP));
            }
            userProfileRepository.save(p);
        });
    }

    private RatingFeedbackDto mapToDto(RatingFeedback rf) {
        RatingFeedbackDto dto = new RatingFeedbackDto();
        dto.setId(rf.getId());
        dto.setExchangeId(rf.getExchange().getId());
        dto.setReviewerId(rf.getReviewer().getId());

        UserProfile rp = userProfileRepository.findByUserId(rf.getReviewer().getId()).orElse(null);
        UserProfile ep = userProfileRepository.findByUserId(rf.getReviewee().getId()).orElse(null);

        dto.setReviewerName(rp != null ? rp.getFullName() : rf.getReviewer().getEmail());
        dto.setReviewerAvatar(rp != null ? rp.getAvatarUrl() : null);

        dto.setRevieweeId(rf.getReviewee().getId());
        dto.setRevieweeName(ep != null ? ep.getFullName() : rf.getReviewee().getEmail());

        dto.setSkillReviewedName(rf.getSkillReviewed().getName());
        dto.setRating(rf.getRating());
        dto.setComment(rf.getFeedbackComment());
        dto.setPunctualityRating(rf.getPunctualityRating());
        dto.setCommunicationRating(rf.getCommunicationRating());
        dto.setTeachingClarityRating(rf.getTeachingClarityRating());
        dto.setCreatedAt(rf.getCreatedAt());
        return dto;
    }
}
