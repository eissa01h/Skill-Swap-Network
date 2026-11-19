package com.skillswap.network.security;

import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class TokenBlacklistService {

    // Set of invalidated tokens with their expiration time
    private final Map<String, Instant> blacklistedTokens = new ConcurrentHashMap<>();

    public void invalidateToken(String token, Instant expiresAt) {
        if (token != null) {
            blacklistedTokens.put(token, expiresAt != null ? expiresAt : Instant.now().plusSeconds(86400));
        }
    }

    public boolean isBlacklisted(String token) {
        if (token == null) return false;
        Instant expiry = blacklistedTokens.get(token);
        if (expiry == null) return false;
        if (Instant.now().isAfter(expiry)) {
            blacklistedTokens.remove(token);
            return false;
        }
        return true;
    }
}

