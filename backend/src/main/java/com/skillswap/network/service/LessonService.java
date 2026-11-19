package com.skillswap.network.service;

import com.skillswap.network.dto.LessonDto;
import com.skillswap.network.dto.ScheduleLessonRequest;
import com.skillswap.network.dto.UpdateLessonRequest;
import com.skillswap.network.entity.*;
import com.skillswap.network.exception.ForbiddenException;
import com.skillswap.network.exception.ResourceNotFoundException;
import com.skillswap.network.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class LessonService {

    @Autowired
    private LessonRepository lessonRepository;

    @Autowired
    private ExchangeRepository exchangeRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserProfileRepository userProfileRepository;

    @Autowired
    private SkillRepository skillRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    public List<LessonDto> getScheduledLessons(User user) {
        return lessonRepository.findUserLessons(user.getId()).stream()
                .map(l -> mapToDto(l, user.getId()))
                .collect(Collectors.toList());
    }

    public LessonDto getLessonDetails(User user, UUID lessonId) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new ResourceNotFoundException("Lesson not found with id: " + lessonId));

        validateParticipant(user, lesson);
        return mapToDto(lesson, user.getId());
    }

    @Transactional
    public LessonDto scheduleLesson(User user, ScheduleLessonRequest request) {
        Exchange exchange = exchangeRepository.findById(request.getExchangeId())
                .orElseThrow(() -> new ResourceNotFoundException("Exchange not found with id: " + request.getExchangeId()));

        boolean isUserA = exchange.getUserA().getId().equals(user.getId());
        boolean isUserB = exchange.getUserB().getId().equals(user.getId());
        if (!isUserA && !isUserB) {
            throw new ForbiddenException("You can only schedule sessions for your own active exchanges.");
        }

        User instructor = userRepository.findById(request.getInstructorId())
                .orElseThrow(() -> new ResourceNotFoundException("Instructor not found with id: " + request.getInstructorId()));

        User learner = instructor.getId().equals(exchange.getUserA().getId()) ? exchange.getUserB() : exchange.getUserA();

        Skill skill = skillRepository.findById(request.getSkillId())
                .orElseThrow(() -> new ResourceNotFoundException("Skill not found with id: " + request.getSkillId()));

        String meetingLink = request.getMeetingLink();
        if (meetingLink == null || meetingLink.trim().isEmpty()) {
            meetingLink = "https://meet.jit.si/skillswap-" + exchange.getId().toString().substring(0, 8);
        }

        Lesson lesson = new Lesson(
                exchange,
                instructor,
                learner,
                skill,
                request.getTitle().trim(),
                request.getLessonDate(),
                request.getStartTime(),
                request.getDurationMinutes(),
                request.getDeliveryMethod(),
                meetingLink
        );
        lesson.setNotes(request.getNotes());
        lesson = lessonRepository.save(lesson);

        // Notify other participant
        User partner = user.getId().equals(exchange.getUserA().getId()) ? exchange.getUserB() : exchange.getUserA();
        Notification notification = new Notification(
                partner,
                "LESSON_SCHEDULED",
                "New Lesson Scheduled",
                user.getEmail() + " scheduled a session for " + request.getTitle() + " on " + request.getLessonDate(),
                "LESSON",
                lesson.getId()
        );
        notificationRepository.save(notification);

        return mapToDto(lesson, user.getId());
    }

    @Transactional
    public LessonDto updateLesson(User user, UUID lessonId, UpdateLessonRequest request) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new ResourceNotFoundException("Lesson not found with id: " + lessonId));

        validateParticipant(user, lesson);

        if (request.getTitle() != null) lesson.setTitle(request.getTitle().trim());
        if (request.getLessonDate() != null) lesson.setLessonDate(request.getLessonDate());
        if (request.getStartTime() != null) lesson.setStartTime(request.getStartTime());
        if (request.getDurationMinutes() != null) lesson.setDurationMinutes(request.getDurationMinutes());
        if (request.getDeliveryMethod() != null) lesson.setDeliveryMethod(request.getDeliveryMethod());
        if (request.getMeetingLink() != null) lesson.setMeetingLink(request.getMeetingLink().trim());
        if (request.getNotes() != null) lesson.setNotes(request.getNotes().trim());
        if (request.getStatus() != null) lesson.setStatus(request.getStatus().trim());

        lesson = lessonRepository.save(lesson);
        return mapToDto(lesson, user.getId());
    }

    @Transactional
    public LessonDto cancelLesson(User user, UUID lessonId) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new ResourceNotFoundException("Lesson not found with id: " + lessonId));

        validateParticipant(user, lesson);

        lesson.setStatus("CANCELLED");
        lesson = lessonRepository.save(lesson);

        return mapToDto(lesson, user.getId());
    }

    private void validateParticipant(User user, Lesson lesson) {
        boolean isParticipant = lesson.getInstructor().getId().equals(user.getId()) ||
                lesson.getLearner().getId().equals(user.getId());
        if (!isParticipant && !"ROLE_ADMIN".equalsIgnoreCase(user.getRole())) {
            throw new ForbiddenException("You are not an authorized participant in this lesson.");
        }
    }

    private LessonDto mapToDto(Lesson l, UUID currentUserId) {
        LessonDto dto = new LessonDto();
        dto.setId(l.getId());
        dto.setExchangeId(l.getExchange().getId());
        dto.setInstructorId(l.getInstructor().getId());
        dto.setLearnerId(l.getLearner().getId());

        UserProfile ip = userProfileRepository.findByUserId(l.getInstructor().getId()).orElse(null);
        UserProfile lp = userProfileRepository.findByUserId(l.getLearner().getId()).orElse(null);

        dto.setInstructorName(ip != null ? ip.getFullName() : l.getInstructor().getEmail());
        dto.setLearnerName(lp != null ? lp.getFullName() : l.getLearner().getEmail());

        dto.setSkillId(l.getSkill().getId());
        dto.setSkillName(l.getSkill().getName());

        dto.setTitle(l.getTitle());
        dto.setLessonDate(l.getLessonDate());
        dto.setStartTime(l.getStartTime());
        dto.setDurationMinutes(l.getDurationMinutes());
        dto.setDeliveryMethod(l.getDeliveryMethod());
        dto.setMeetingLink(l.getMeetingLink());
        dto.setStatus(l.getStatus());
        dto.setNotes(l.getNotes());
        dto.setYouTeaching(l.getInstructor().getId().equals(currentUserId));
        dto.setCreatedAt(l.getCreatedAt());
        return dto;
    }
}
