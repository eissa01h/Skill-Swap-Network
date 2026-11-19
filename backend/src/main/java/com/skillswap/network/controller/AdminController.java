package com.skillswap.network.controller;

import com.skillswap.network.dto.*;
import com.skillswap.network.entity.User;
import com.skillswap.network.exception.ForbiddenException;
import com.skillswap.network.exception.UnauthorizedException;
import com.skillswap.network.repository.UserRepository;
import com.skillswap.network.service.AdminService;
import com.skillswap.network.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @Autowired
    private AuthService authService;

    @Autowired
    private UserRepository userRepository;

    // -------------------------------------------------------------
    // Reporting (Authenticated Members)
    // -------------------------------------------------------------

    @PostMapping("/reports")
    public ResponseEntity<ApiResponse<ReportDto>> submitReport(
            Authentication authentication,
            @Valid @RequestBody CreateReportRequest request) {
        User user = authService.getAuthenticatedUser(authentication.getName());
        ReportDto report = adminService.submitReport(user, request);
        return new ResponseEntity<>(ApiResponse.success("Incident report logged for staff review", report), HttpStatus.CREATED);
    }

    // -------------------------------------------------------------
    // Administration Portal (Designated Admin eissa.ej05@gmailcom Only)
    // -------------------------------------------------------------

    private void verifyAdminPrincipal(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new UnauthorizedException("Authentication required");
        }
        String email = authentication.getName();
        if (!AuthService.isAdminEmail(email)) {
            throw new ForbiddenException("Access denied: Only administrator eissa.ej05@gmailcom has access to this portal.");
        }
        User user = authService.getAuthenticatedUser(email);
        if (!"ROLE_ADMIN".equalsIgnoreCase(user.getRole())) {
            throw new ForbiddenException("Access denied: Administrator privileges required.");
        }
    }

    @GetMapping("/admin/reports")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<ReportDto>>> getReports(
            Authentication authentication,
            @RequestParam(required = false, defaultValue = "ALL") String status) {
        verifyAdminPrincipal(authentication);
        List<ReportDto> reports = adminService.getReports(status);
        return ResponseEntity.ok(ApiResponse.success(reports));
    }

    @GetMapping("/admin/reports/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ReportDto>> getReportById(
            Authentication authentication,
            @PathVariable UUID id) {
        verifyAdminPrincipal(authentication);
        ReportDto report = adminService.getReportById(id);
        return ResponseEntity.ok(ApiResponse.success(report));
    }

    @PostMapping("/admin/reports/{id}/resolve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ReportDto>> resolveReport(
            Authentication authentication,
            @PathVariable UUID id,
            @Valid @RequestBody ResolveReportRequest request) {
        verifyAdminPrincipal(authentication);
        User admin = authService.getAuthenticatedUser(authentication.getName());
        ReportDto resolved = adminService.resolveReport(admin, id, request);
        return ResponseEntity.ok(ApiResponse.success("Report resolved and action recorded", resolved));
    }

    @GetMapping("/admin/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<User>>> getAdminUsers(Authentication authentication) {
        verifyAdminPrincipal(authentication);
        List<User> users = userRepository.findAll();
        // Hide password hashes from response
        users.forEach(u -> u.setPasswordHash("[PROTECTED]"));
        return ResponseEntity.ok(ApiResponse.success(users));
    }

    @PostMapping("/admin/users/{userId}/block")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> blockUser(
            Authentication authentication,
            @PathVariable UUID userId,
            @RequestParam(required = false) String reason) {
        verifyAdminPrincipal(authentication);
        User admin = authService.getAuthenticatedUser(authentication.getName());
        adminService.blockUser(admin, userId, reason);
        return ResponseEntity.ok(ApiResponse.success("User account suspended", null));
    }

    @PostMapping("/admin/users/{userId}/unblock")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> unblockUser(
            Authentication authentication,
            @PathVariable UUID userId,
            @RequestParam(required = false) String reason) {
        verifyAdminPrincipal(authentication);
        User admin = authService.getAuthenticatedUser(authentication.getName());
        adminService.unblockUser(admin, userId, reason);
        return ResponseEntity.ok(ApiResponse.success("User account reinstated", null));
    }

    @GetMapping("/admin/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<AdminStatsDto>> getAdminStats(Authentication authentication) {
        verifyAdminPrincipal(authentication);
        AdminStatsDto stats = adminService.getAdminStats();
        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    @GetMapping("/admin/audit-logs")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<AuditLogDto>>> getAuditLogs(Authentication authentication) {
        verifyAdminPrincipal(authentication);
        List<AuditLogDto> logs = adminService.getAuditLogs();
        return ResponseEntity.ok(ApiResponse.success(logs));
    }
}

