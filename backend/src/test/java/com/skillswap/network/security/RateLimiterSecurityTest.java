package com.skillswap.network.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class RateLimiterSecurityTest {

    private RateLimiterService rateLimiterService;

    @BeforeEach
    void setUp() {
        rateLimiterService = new RateLimiterService();
    }

    @Test
    @DisplayName("NFR-01: Rate limiter permits up to max limit and rejects subsequent requests")
    void testSlidingWindowRateLimiting() {
        String clientIp = "192.168.1.100";
        int maxAttempts = 5;
        long windowSeconds = 60;

        // First 5 attempts must succeed
        for (int i = 1; i <= maxAttempts; i++) {
            boolean allowed = rateLimiterService.isAllowed(clientIp, maxAttempts, windowSeconds);
            assertTrue(allowed, "Attempt " + i + " within limit must be permitted");
        }

        // 6th attempt must be throttled
        boolean throttled = rateLimiterService.isAllowed(clientIp, maxAttempts, windowSeconds);
        assertFalse(throttled, "6th attempt exceeding limit must be blocked (HTTP 429 Too Many Requests)");

        // Verify positive retry-after duration
        long retryAfter = rateLimiterService.getRetryAfterSeconds(clientIp, windowSeconds);
        assertTrue(retryAfter > 0, "Retry-After seconds must be positive");
    }

    @Test
    @DisplayName("NFR-01: Rate limiter isolates different IP addresses")
    void testDifferentIpIsolation() {
        String ip1 = "10.0.0.1";
        String ip2 = "10.0.0.2";
        int maxAttempts = 2;

        // Exhaust ip1 limit
        assertTrue(rateLimiterService.isAllowed(ip1, maxAttempts, 60));
        assertTrue(rateLimiterService.isAllowed(ip1, maxAttempts, 60));
        assertFalse(rateLimiterService.isAllowed(ip1, maxAttempts, 60));

        // ip2 should still be completely unblocked
        assertTrue(rateLimiterService.isAllowed(ip2, maxAttempts, 60), "Unrelated IP must not be throttled");
    }

    @Test
    @DisplayName("NFR-01: Reset allows traffic again immediately")
    void testResetClearsThrottling() {
        String clientIp = "172.16.0.5";
        rateLimiterService.isAllowed(clientIp, 1, 60);
        assertFalse(rateLimiterService.isAllowed(clientIp, 1, 60));

        rateLimiterService.reset(clientIp);

        assertTrue(rateLimiterService.isAllowed(clientIp, 1, 60), "After reset, client should be permitted");
    }
}

