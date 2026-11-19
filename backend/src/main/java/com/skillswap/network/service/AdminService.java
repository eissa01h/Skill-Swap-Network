package com.skillswap.network.service;

import com.skillswap.network.dto.*;
import com.skillswap.network.entity.*;
import com.skillswap.network.exception.BadRequestException;
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
public class AdminService {

    @Autowired
    private ReportRepository reportRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserProfileRepository userProfileRepository;

    @Autowired
    private ModerationAuditLogRepository moderationAuditLogRepository;

    @Autowired
    private ExchangeRepository exchangeRepository;

    @Transactional
    public ReportDto submitReport(User reporter, CreateReportRequest request) {
        if (reporter.getId().equals(request.getReportedUserId())) {
            throw new BadRequestException("You cannot report yourself.");
        }

        User reportedUser = userRepository.findById(request.getReportedUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Reported user not found with id: " + request.getReportedUserId()));

        Report report = new Report(
                reporter,
                reportedUser,
                request.getTargetType(),
                request.getTargetId(),
                request.getCategory(),
                request.getDescription().trim(),
                request.getEvidenceText()
        );

        report = reportRepository.save(report);
        return mapToReportDto(report);
    }

    public List<ReportDto> getReports(String status) {
        List<Report> reports;
        if (status != null && !status.trim().isEmpty() && !"ALL".equalsIgnoreCase(status)) {
            reports = reportRepository.findByStatusOrderByCreatedAtAsc(status.toUpperCase());
        } else {
            reports = reportRepository.findAllByOrderByCreatedAtDesc();
        }

        return reports.stream()
                .map(this::mapToReportDto)
                .collect(Collectors.toList());
    }

    public ReportDto getReportById(UUID reportId) {
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found with id: " + reportId));
        return mapToReportDto(report);
    }

    @Transactional
    public ReportDto resolveReport(User admin, UUID reportId, ResolveReportRequest request) {
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found with id: " + reportId));

        report.setStatus("RESOLVED");
        report.setAdminAction(request.getAction());
        report.setAdminNotes(request.getNotes());
        report.setResolvedByAdmin(admin);
        report.setResolvedAt(Instant.now());

        // Enforce action if ACCOUNT_BLOCKED
        if ("ACCOUNT_BLOCKED".equalsIgnoreCase(request.getAction()) || "ACCOUNT_BANNED".equalsIgnoreCase(request.getAction())) {
            blockUser(admin, report.getReportedUser().getId(), "Enforced via Report #" + report.getId() + ": " + request.getNotes());
        }

        report = reportRepository.save(report);

        // Create audit log entry
        ModerationAuditLog audit = new ModerationAuditLog(
                admin,
                "RESOLVE_REPORT_" + request.getAction(),
                "REPORT",
                report.getId(),
                "Action taken: " + request.getAction() + ". Notes: " + request.getNotes(),
                "127.0.0.1"
        );
        moderationAuditLogRepository.save(audit);

        return mapToReportDto(report);
    }

    @Transactional
    public void blockUser(User admin, UUID userId, String reason) {
        User target = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        if ("ROLE_ADMIN".equalsIgnoreCase(target.getRole())) {
            throw new BadRequestException("Administrator accounts cannot be blocked.");
        }

        target.setStatus("BLOCKED");
        userRepository.save(target);

        ModerationAuditLog audit = new ModerationAuditLog(
                admin,
                "ACCOUNT_BLOCKED",
                "USER",
                target.getId(),
                reason != null ? reason : "Account suspended by administrator for policy violation",
                "127.0.0.1"
        );
        moderationAuditLogRepository.save(audit);
    }

    @Transactional
    public void unblockUser(User admin, UUID userId, String reason) {
        User target = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        target.setStatus("ACTIVE");
        userRepository.save(target);

        ModerationAuditLog audit = new ModerationAuditLog(
                admin,
                "ACCOUNT_UNBLOCKED",
                "USER",
                target.getId(),
                reason != null ? reason : "Account reinstated by administrator",
                "127.0.0.1"
        );
        moderationAuditLogRepository.save(audit);
    }

    public AdminStatsDto getAdminStats() {
        List<User> users = userRepository.findAll();
        long totalUsers = users.size();
        long blockedUsers = users.stream().filter(u -> "BLOCKED".equalsIgnoreCase(u.getStatus())).count();
        long activeUsers = totalUsers - blockedUsers;

        long activeSwaps = exchangeRepository.countByStatus("ACTIVE");
        long completedSwaps = exchangeRepository.countByStatus("COMPLETED");
        long pendingReports = reportRepository.countByStatus("PENDING");

        AdminStatsDto stats = new AdminStatsDto();
        stats.setTotalUsers(totalUsers);
        stats.setActiveUsers(activeUsers);
        stats.setBlockedUsers(blockedUsers);
        stats.setActiveSwapsThisMonth(activeSwaps);
        stats.setCompletedSwapsTotal(completedSwaps);
        stats.setPendingReports(pendingReports);
        return stats;
    }

    public List<AuditLogDto> getAuditLogs() {
        return moderationAuditLogRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(a -> {
                    AuditLogDto dto = new AuditLogDto();
                    dto.setId(a.getId());
                    dto.setAdminName(a.getAdmin().getEmail());
                    dto.setAction(a.getAction());
                    dto.setTargetEntityType(a.getTargetEntityType());
                    dto.setTargetEntityId(a.getTargetEntityId());
                    dto.setReason(a.getReason());
                    dto.setCreatedAt(a.getCreatedAt());
                    return dto;
                })
                .collect(Collectors.toList());
    }

    private ReportDto mapToReportDto(Report r) {
        ReportDto dto = new ReportDto();
        dto.setId(r.getId());
        dto.setReporterId(r.getReporter().getId());

        UserProfile rp = userProfileRepository.findByUserId(r.getReporter().getId()).orElse(null);
        UserProfile rep = userProfileRepository.findByUserId(r.getReportedUser().getId()).orElse(null);

        dto.setReporterName(rp != null ? rp.getFullName() : r.getReporter().getEmail());
        dto.setReporterEmail(r.getReporter().getEmail());

        dto.setReportedUserId(r.getReportedUser().getId());
        dto.setReportedUserName(rep != null ? rep.getFullName() : r.getReportedUser().getEmail());
        dto.setReportedUserEmail(r.getReportedUser().getEmail());

        dto.setTargetType(r.getTargetType());
        dto.setTargetId(r.getTargetId());
        dto.setCategory(r.getCategory());
        dto.setDescription(r.getDescription());
        dto.setEvidenceText(r.getEvidenceText());
        dto.setStatus(r.getStatus());
        dto.setAdminAction(r.getAdminAction());
        dto.setAdminNotes(r.getAdminNotes());
        dto.setResolvedAt(r.getResolvedAt());
        dto.setCreatedAt(r.getCreatedAt());
        return dto;
    }
}
