package com.skillswap.network.security;

import com.skillswap.network.dto.SendMessageRequest;
import com.skillswap.network.dto.SubmitFeedbackRequest;
import com.skillswap.network.entity.*;
import com.skillswap.network.exception.BadRequestException;
import com.skillswap.network.exception.ConflictException;
import com.skillswap.network.exception.ForbiddenException;
import com.skillswap.network.repository.*;
import com.skillswap.network.service.ChatService;
import com.skillswap.network.service.ExchangeRequestService;
import com.skillswap.network.service.ExchangeService;
import com.skillswap.network.service.FeedbackService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ExchangeAccessControlTest {

    @Mock
    private ExchangeRequestRepository exchangeRequestRepository;

    @Mock
    private ExchangeRepository exchangeRepository;

    @Mock
    private ConversationRepository conversationRepository;

    @Mock
    private MessageRepository messageRepository;

    @Mock
    private RatingFeedbackRepository ratingFeedbackRepository;

    @Mock
    private NotificationRepository notificationRepository;

    @Mock
    private UserProfileRepository userProfileRepository;

    @InjectMocks
    private ExchangeRequestService exchangeRequestService;

    @InjectMocks
    private ExchangeService exchangeService;

    @InjectMocks
    private ChatService chatService;

    @InjectMocks
    private FeedbackService feedbackService;

    private User sender;
    private User recipient;
    private User maliciousThirdParty;
    private ExchangeRequest pendingRequest;
    private Exchange activeExchange;
    private Conversation conversation;

    @BeforeEach
    void setUp() {
        sender = new User("sender@example.com", "hash", "ROLE_USER");
        sender.setId(UUID.randomUUID());

        recipient = new User("recipient@example.com", "hash", "ROLE_USER");
        recipient.setId(UUID.randomUUID());

        maliciousThirdParty = new User("attacker@example.com", "hash", "ROLE_USER");
        maliciousThirdParty.setId(UUID.randomUUID());

        Skill skillA = new Skill("Python", "Programming");
        skillA.setId(UUID.randomUUID());
        Skill skillB = new Skill("Spanish", "Languages");
        skillB.setId(UUID.randomUUID());

        pendingRequest = new ExchangeRequest(sender, recipient, skillA, skillB, "Let's swap", "Sundays");
        pendingRequest.setId(UUID.randomUUID());
        pendingRequest.setStatus("PENDING");

        activeExchange = new Exchange(pendingRequest, sender, recipient, skillA, skillB, 4);
        activeExchange.setId(UUID.randomUUID());
        activeExchange.setStatus("ACTIVE");

        conversation = new Conversation(sender, recipient, activeExchange);
        conversation.setId(UUID.randomUUID());
    }

    @Test
    @DisplayName("NFR-01: Sender cannot accept their own proposal; only recipient is authorized")
    void testSenderCannotAcceptProposal() {
        when(exchangeRequestRepository.findById(pendingRequest.getId())).thenReturn(Optional.of(pendingRequest));

        assertThrows(ForbiddenException.class, () -> {
            exchangeRequestService.acceptRequest(sender, pendingRequest.getId());
        }, "Sender attempting to accept their own proposal must trigger ForbiddenException");
    }

    @Test
    @DisplayName("NFR-01: Third party cannot accept someone else's proposal")
    void testThirdPartyCannotAcceptProposal() {
        when(exchangeRequestRepository.findById(pendingRequest.getId())).thenReturn(Optional.of(pendingRequest));

        assertThrows(ForbiddenException.class, () -> {
            exchangeRequestService.acceptRequest(maliciousThirdParty, pendingRequest.getId());
        }, "Third party attempting to accept proposal must trigger ForbiddenException");
    }

    @Test
    @DisplayName("NFR-01: Recipient cannot cancel proposal; only sender is authorized")
    void testRecipientCannotCancelProposal() {
        when(exchangeRequestRepository.findById(pendingRequest.getId())).thenReturn(Optional.of(pendingRequest));

        assertThrows(ForbiddenException.class, () -> {
            exchangeRequestService.cancelRequest(recipient, pendingRequest.getId(), "Cancel reason");
        }, "Recipient attempting to cancel sender's proposal must trigger ForbiddenException");
    }

    @Test
    @DisplayName("NFR-01: Non-participant cannot access private exchange agreement details")
    void testThirdPartyCannotAccessExchange() {
        when(exchangeRepository.findById(activeExchange.getId())).thenReturn(Optional.of(activeExchange));

        assertThrows(ForbiddenException.class, () -> {
            exchangeService.getExchangeById(maliciousThirdParty, activeExchange.getId());
        }, "Unauthorized user accessing private exchange must trigger ForbiddenException");
    }

    @Test
    @DisplayName("NFR-01: Non-participant cannot read or send messages in private conversation")
    void testThirdPartyCannotAccessConversation() {
        when(conversationRepository.findById(conversation.getId())).thenReturn(Optional.of(conversation));

        assertThrows(ForbiddenException.class, () -> {
            chatService.getConversationMessages(maliciousThirdParty, conversation.getId());
        }, "Unauthorized user reading private conversation must trigger ForbiddenException");

        assertThrows(ForbiddenException.class, () -> {
            chatService.sendMessage(maliciousThirdParty, conversation.getId(), new SendMessageRequest("Injected message"));
        }, "Unauthorized user sending message to private conversation must trigger ForbiddenException");
    }

    @Test
    @DisplayName("FR-11: Feedback cannot be submitted on an ACTIVE exchange prior to COMPLETION")
    void testFeedbackBlockedBeforeCompletion() {
        SubmitFeedbackRequest req = new SubmitFeedbackRequest();
        req.setExchangeId(activeExchange.getId());
        req.setRating(5);
        req.setComment("Great sessions!");

        when(exchangeRepository.findById(activeExchange.getId())).thenReturn(Optional.of(activeExchange));

        assertThrows(BadRequestException.class, () -> {
            feedbackService.submitFeedback(sender, req);
        }, "Submitting feedback on an uncompleted exchange must be blocked");
    }

    @Test
    @DisplayName("FR-11: Duplicate feedback for the same completed exchange is strictly rejected")
    void testDuplicateFeedbackPrevention() {
        activeExchange.setStatus("COMPLETED");

        SubmitFeedbackRequest req = new SubmitFeedbackRequest();
        req.setExchangeId(activeExchange.getId());
        req.setRating(5);
        req.setComment("Excellent swap partner!");

        when(exchangeRepository.findById(activeExchange.getId())).thenReturn(Optional.of(activeExchange));
        when(ratingFeedbackRepository.existsByExchangeIdAndReviewerId(activeExchange.getId(), sender.getId())).thenReturn(true);

        assertThrows(ConflictException.class, () -> {
            feedbackService.submitFeedback(sender, req);
        }, "Duplicate feedback from the same participant must trigger ConflictException");
    }
}
