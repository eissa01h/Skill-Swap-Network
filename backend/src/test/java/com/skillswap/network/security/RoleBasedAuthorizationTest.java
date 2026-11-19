package com.skillswap.network.security;

import com.skillswap.network.dto.AuthResponse;
import com.skillswap.network.dto.RegisterRequest;
import com.skillswap.network.entity.User;
import com.skillswap.network.exception.BadRequestException;
import com.skillswap.network.exception.ForbiddenException;
import com.skillswap.network.repository.ModerationAuditLogRepository;
import com.skillswap.network.repository.UserProfileRepository;
import com.skillswap.network.repository.UserRepository;
import com.skillswap.network.service.AdminService;
import com.skillswap.network.service.AuthService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class RoleBasedAuthorizationTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private UserProfileRepository userProfileRepository;

    @Mock
    private ModerationAuditLogRepository auditLogRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtTokenProvider jwtTokenProvider;

    @InjectMocks
    private AuthService authService;

    @InjectMocks
    private AdminService adminService;

    private User standardUser;
    private User adminUser;

    @BeforeEach
    void setUp() {
        standardUser = new User("user@example.com", "hashed_pass", "ROLE_USER");
        adminUser = new User("admin@example.com", "hashed_pass", "ROLE_ADMIN");
    }

    @Test
    @DisplayName("NFR-01: User registration strictly assigns ROLE_USER and prevents self-privilege escalation")
    void testRegistrationAssignsRoleUserOnly() {
        RegisterRequest req = new RegisterRequest("New Member", "new@example.com", "Password123!");

        when(userRepository.existsByEmailIgnoreCase(any())).thenReturn(false);
        when(passwordEncoder.encode(any())).thenReturn("bcrypt_hash");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User saved = invocation.getArgument(0);
            return saved;
        });
        when(jwtTokenProvider.generateTokenFromUsername(any())).thenReturn("valid_jwt_token");

        AuthResponse response = authService.register(req);

        assertNotNull(response);
        assertEquals("ROLE_USER", response.getRole(), "New registration MUST default to ROLE_USER");
        assertNotEquals("ROLE_ADMIN", response.getRole(), "Users must NEVER be able to register with ROLE_ADMIN");
    }

    @Test
    @DisplayName("FR-13: Admin cannot block other administrator accounts")
    void testAdministratorCannotBeBlocked() {
        UUID adminTargetId = UUID.randomUUID();
        User targetAdmin = new User("target.admin@example.com", "hash", "ROLE_ADMIN");

        when(userRepository.findById(adminTargetId)).thenReturn(Optional.of(targetAdmin));

        assertThrows(BadRequestException.class, () -> {
            adminService.blockUser(adminUser, adminTargetId, "Attempting to block admin");
        }, "System must reject attempts to block administrator accounts");

        verify(userRepository, never()).save(argThat(u -> "BLOCKED".equals(u.getStatus())));
    }

    @Test
    @DisplayName("NFR-01: Blocked account status prevents authentication")
    void testBlockedAccountIsDisabled() {
        User blockedUser = new User("blocked@example.com", "hashed_pass", "ROLE_USER");
        blockedUser.setStatus("BLOCKED");

        CustomUserDetailsService userDetailsService = new CustomUserDetailsService();
        // Inject mock repo
        org.springframework.test.util.ReflectionTestUtils.setField(userDetailsService, "userRepository", userRepository);

        when(userRepository.findByEmailIgnoreCase("blocked@example.com")).thenReturn(Optional.of(blockedUser));

        org.springframework.security.core.userdetails.UserDetails userDetails =
                userDetailsService.loadUserByUsername("blocked@example.com");

        assertFalse(userDetails.isEnabled(), "Blocked user accounts must have isEnabled() == false");
    }
}

