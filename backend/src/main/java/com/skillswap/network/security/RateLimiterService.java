package com.skillswap.network.security;

import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentLinkedQueue;

/**
 * Thread-safe Sliding Window Rate Limiter for sensitive endpoints.
 * Defends against brute-force password attacks, automated spam registration,
 * and credential stuffing.
 */
@Service
public class RateLimiterService {

    // Default configuration: 5 requests per 60 seconds window
    private static final int DEFAULT_MAX_REQUESTS = 5;
    private static final long DEFAULT_WINDOW_SECONDS = 60;

    // Map: Key (e.g. clientIp + ":" + action) -> Queue of timestamps
    private final Map<String, ConcurrentLinkedQueue<Long>> requestHistory = new ConcurrentHashMap<>();

    /**
     * Checks if a request is allowed under the rate limit window.
     *
     * @param clientKey Unique client identifier (e.g. client IP or IP + action)
     * @return true if request is permitted, false if rate limit is exceeded
     */
    public boolean isAllowed(String clientKey) {
        return isAllowed(clientKey, DEFAULT_MAX_REQUESTS, DEFAULT_WINDOW_SECONDS);
    }

    /**
     * Checks if a request is allowed with custom limits.
     */
    public boolean isAllowed(String clientKey, int maxRequests, long windowSeconds) {
        long now = Instant.now().getEpochSecond();
        long windowStart = now - windowSeconds;

        ConcurrentLinkedQueue<Long> timestamps = requestHistory.computeIfAbsent(clientKey,
                k -> new ConcurrentLinkedQueue<>());

        // Evict timestamps older than the sliding window
        while (!timestamps.isEmpty() && timestamps.peek() <= windowStart) {
            timestamps.poll();
        }

        synchronized (timestamps) {
            if (timestamps.size() < maxRequests) {
                timestamps.add(now);
                return true;
            }
            return false;
        }
    }

    /**
     * Calculates remaining seconds until the client may retry.
     */
    public long getRetryAfterSeconds(String clientKey) {
        return getRetryAfterSeconds(clientKey, DEFAULT_WINDOW_SECONDS);
    }

    public long getRetryAfterSeconds(String clientKey, long windowSeconds) {
        ConcurrentLinkedQueue<Long> timestamps = requestHistory.get(clientKey);
        if (timestamps == null || timestamps.isEmpty()) {
            return 0;
        }
        Long oldest = timestamps.peek();
        if (oldest == null) {
            return 0;
        }
        long now = Instant.now().getEpochSecond();
        long diff = (oldest + windowSeconds) - now;
        return Math.max(diff, 1);
    }

    /**
     * Resets rate limiter memory for a specific client (useful for unit testing).
     */
    public void reset(String clientKey) {
        requestHistory.remove(clientKey);
    }

    /**
     * Clears all tracked history.
     */
    public void clearAll() {
        requestHistory.clear();
    }
}
