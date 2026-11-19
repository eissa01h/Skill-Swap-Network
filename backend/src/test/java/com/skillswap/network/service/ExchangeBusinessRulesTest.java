package com.skillswap.network.service;

import com.skillswap.network.dto.CreateExchangeRequestDto;
import com.skillswap.network.dto.SubmitFeedbackRequest;
import com.skillswap.network.entity.*;
import com.skillswap.network.exception.BadRequestException;
import com.skillswap.network.exception.ConflictException;
import com.skillswap.network.exception.ForbiddenException;
import com.skillswap.network.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ExchangeBusinessRulesTest {

    @Mock
    private ExchangeRequestRepository exchangeRequestRepository;

    @Mock
    private ExchangeRepository exchangeRepository;

    @Mock
    private RatingFeedbackRepository ratingFeedbackRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private UserProfileRepository userProfileRepository;

    @Mock
    private SkillRepository skillRepository;

    @Mock
    private ConversationRepository conversationRepository;

    @Mock
    private NotificationRepository notificationRepository;

    @InjectMocks
    private ExchangeRequestService exchangeRequestService;

    @InjectMocks
    private FeedbackService feedbackService;

    private User userA;
    private User userB;
    private User userC;
    private Skill skill1;
    private Skill skill2;

    @BeforeEach
    void setUp() {
        userA = new User("usera@example.com", "hash", "ROLE_USER");
        userA.setId(UUID.randomUUID());

        userB = new User("userb@example.com", "hash", "ROLE_USER");
        userB.setId(UUID.randomUUID());

        userC = new User("userc@example.com", "hash", "ROLE_USER");
        userC.setId(UUID.randomUUID());

        skill1 = new Skill("Python", "Programming & Tech", "Python 3");
        skill1.setId(UUID.randomUUID());

        skill2 = new Skill("Guitar", "Music & Audio", "Acoustic");
        skill2.setId(UUID.randomUUID());
    }

    @Test
    void shouldRejectSelfProposal() {
        CreateExchangeRequestDto dto = new CreateExchangeRequestDto();
        dto.setRecipientId(userA.getId()); // Sender proposing to themselves
        dto.setOfferedSkillId(skill1.getId());
        dto.setRequestedSkillId(skill2.getId());

        assertThrows(BadRequestException.class, () -> exchangeRequestService.createRequest(userA, dto));
    }

    @Test
    void shouldRejectIdenticalOfferedAndRequestedSkills() {
        CreateExchangeRequestDto dto = new CreateExchangeRequestDto();
        dto.setRecipientId(userB.getId());
        dto.setOfferedSkillId(skill1.getId());
        dto.setRequestedSkillId(skill1.getId()); // Same skill

        assertThrows(BadRequestException.class, () -> exchangeRequestService.createRequest(userA, dto));
    }

    @Test
    void shouldDisallowNonRecipientFromAcceptingProposal() {
        ExchangeRequest req = new ExchangeRequest(userA, userB, skill1, skill2, "Swap?", "Weekly");
        req.setId(UUID.randomUUID());

        when(exchangeRequestRepository.findById(req.getId())).thenReturn(Optional.of(req));

        // User C (or User A) trying to accept proposal meant for User B
        assertThrows(ForbiddenException.class, () -> exchangeRequestService.acceptRequest(userC, req.getId()));
        assertThrows(ForbiddenException.class, () -> exchangeRequestService.acceptRequest(userA, req.getId()));
    }

    @Test
    void shouldDisallowNonSenderFromCancellingPendingProposal() {
        ExchangeRequest req = new ExchangeRequest(userA, userB, skill1, skill2, "Swap?", "Weekly");
        req.setId(UUID.randomUUID());

        when(exchangeRequestRepository.findById(req.getId())).thenReturn(Optional.of(req));

        // User B or User C trying to cancel proposal that User A sent
        assertThrows(ForbiddenException.class, () -> exchangeRequestService.cancelRequest(userB, req.getId(), "Cancel"));
        assertThrows(ForbiddenException.class, () -> exchangeRequestService.cancelRequest(userC, req.getId(), "Cancel"));
    }

    @Test
    void shouldRejectFeedbackOnIncompleteExchange() {
        ExchangeRequest req = new ExchangeRequest(userA, userB, skill1, skill2, "Hi", "Weekly");
        Exchange activeExchange = new Exchange(req, userA, userB, skill1, skill2, 4);
        activeExchange.setId(UUID.randomUUID());
        activeExchange.setStatus("ACTIVE"); // Not COMPLETED yet

        when(exchangeRepository.findById(activeExchange.getId())).thenReturn(Optional.of(activeExchange));

        SubmitFeedbackRequest request = new SubmitFeedbackRequest();
        request.setExchangeId(activeExchange.getId());
        request.setRating((short) 5);
        request.setComment("Great sessions!");

        assertThrows(BadRequestException.class, () -> feedbackService.submitFeedback(userA, request));
    }

    @Test
    void shouldPreventDuplicateFeedbackForSameExchange() {
        ExchangeRequest req = new ExchangeRequest(userA, userB, skill1, skill2, "Hi", "Weekly");
        Exchange completedExchange = new Exchange(req, userA, userB, skill1, skill2, 4);
        completedExchange.setId(UUID.randomUUID());
        completedExchange.setStatus("COMPLETED");

        when(exchangeRepository.findById(completedExchange.getId())).thenReturn(Optional.of(completedExchange));
        when(ratingFeedbackRepository.existsByExchangeIdAndReviewerId(completedExchange.getId(), userA.getId())).thenReturn(true);

        SubmitFeedbackRequest request = new SubmitFeedbackRequest();
        request.setExchangeId(completedExchange.getId());
        request.setRating((short) 5);
        request.setComment("Another review!");

        assertThrows(ConflictException.class, () -> feedbackService.submitFeedback(userA, request));
    }
}

