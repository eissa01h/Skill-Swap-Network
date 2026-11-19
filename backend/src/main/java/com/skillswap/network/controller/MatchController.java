package com.skillswap.network.controller;

import com.skillswap.network.dto.ApiResponse;
import com.skillswap.network.dto.PartnerMatchDto;
import com.skillswap.network.dto.PartnerSearchRequest;
import com.skillswap.network.entity.User;
import com.skillswap.network.service.AuthService;
import com.skillswap.network.service.MatchingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/matches")
public class MatchController {

    @Autowired
    private MatchingService matchingService;

    @Autowired
    private AuthService authService;

    @GetMapping("/partners")
    public ResponseEntity<ApiResponse<List<PartnerMatchDto>>> searchPartners(
            Authentication authentication,
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Double minRating,
            @RequestParam(required = false) String location) {

        User user = authService.getAuthenticatedUser(authentication.getName());

        PartnerSearchRequest req = new PartnerSearchRequest();
        req.setQuery(query);
        req.setCategory(category);
        req.setMinRating(minRating);
        req.setLocation(location);

        List<PartnerMatchDto> results = matchingService.searchPartners(user, req);
        return ResponseEntity.ok(ApiResponse.success(results));
    }

    @GetMapping("/recommendations")
    public ResponseEntity<ApiResponse<List<PartnerMatchDto>>> getMutualRecommendations(Authentication authentication) {
        User user = authService.getAuthenticatedUser(authentication.getName());
        List<PartnerMatchDto> recommendations = matchingService.getMutualRecommendations(user);
        return ResponseEntity.ok(ApiResponse.success(recommendations));
    }
}

