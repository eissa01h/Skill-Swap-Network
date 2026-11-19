package com.skillswap.network.service;

import com.skillswap.network.dto.PartnerMatchDto;
import com.skillswap.network.dto.PartnerSearchRequest;
import com.skillswap.network.entity.LearningInterest;
import com.skillswap.network.entity.TeachingSkill;
import com.skillswap.network.entity.User;
import com.skillswap.network.entity.UserProfile;
import com.skillswap.network.repository.LearningInterestRepository;
import com.skillswap.network.repository.TeachingSkillRepository;
import com.skillswap.network.repository.UserProfileRepository;
import com.skillswap.network.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class MatchingService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserProfileRepository userProfileRepository;

    @Autowired
    private TeachingSkillRepository teachingSkillRepository;

    @Autowired
    private LearningInterestRepository learningInterestRepository;

    public List<PartnerMatchDto> searchPartners(User currentUser, PartnerSearchRequest request) {
        List<User> allUsers = userRepository.findAll();
        List<PartnerMatchDto> results = new ArrayList<>();

        // Get current user's skills for mutual matching detection
        List<TeachingSkill> myTeaching = teachingSkillRepository.findByUserIdWithSkill(currentUser.getId());
        List<LearningInterest> myLearning = learningInterestRepository.findByUserIdWithSkill(currentUser.getId());

        Set<String> myTeachingNames = myTeaching.stream().map(t -> t.getSkill().getName().toLowerCase()).collect(Collectors.toSet());
        Set<String> myWantedNames = myLearning.stream().map(l -> l.getSkill().getName().toLowerCase()).collect(Collectors.toSet());

        for (User u : allUsers) {
            if (u.getId().equals(currentUser.getId())) continue;
            if (!"ACTIVE".equalsIgnoreCase(u.getStatus())) continue;

            UserProfile profile = userProfileRepository.findByUserId(u.getId()).orElse(null);
            if (profile == null) continue;

            // Rating filter
            if (request.getMinRating() != null && profile.getAverageRating().doubleValue() < request.getMinRating()) {
                continue;
            }

            // Location filter
            if (request.getLocation() != null && !request.getLocation().trim().isEmpty()) {
                if (profile.getLocation() == null || !profile.getLocation().toLowerCase().contains(request.getLocation().toLowerCase())) {
                    continue;
                }
            }

            List<TeachingSkill> partnerTeaching = teachingSkillRepository.findByUserIdWithSkill(u.getId());
            List<LearningInterest> partnerLearning = learningInterestRepository.findByUserIdWithSkill(u.getId());

            List<String> partnerTeachingNames = partnerTeaching.stream().map(t -> t.getSkill().getName()).collect(Collectors.toList());
            List<String> partnerWantedNames = partnerLearning.stream().map(l -> l.getSkill().getName()).collect(Collectors.toList());

            // Category filter
            if (request.getCategory() != null && !request.getCategory().equalsIgnoreCase("All Categories") && !request.getCategory().trim().isEmpty()) {
                boolean matchesCategory = partnerTeaching.stream().anyMatch(t -> t.getSkill().getCategory().equalsIgnoreCase(request.getCategory())) ||
                        partnerLearning.stream().anyMatch(l -> l.getSkill().getCategory().equalsIgnoreCase(request.getCategory()));
                if (!matchesCategory) continue;
            }

            // Keyword query filter
            if (request.getQuery() != null && !request.getQuery().trim().isEmpty()) {
                String q = request.getQuery().toLowerCase();
                boolean matchesQuery = profile.getFullName().toLowerCase().contains(q) ||
                        (profile.getBio() != null && profile.getBio().toLowerCase().contains(q)) ||
                        partnerTeachingNames.stream().anyMatch(s -> s.toLowerCase().contains(q)) ||
                        partnerWantedNames.stream().anyMatch(s -> s.toLowerCase().contains(q));
                if (!matchesQuery) continue;
            }

            // Calculate match metrics
            PartnerMatchDto match = buildMatchDto(profile, partnerTeaching, partnerLearning, myTeachingNames, myWantedNames);
            results.add(match);
        }

        // Sort mutual matches first, then by match score descending
        results.sort((a, b) -> {
            if (a.isMutualMatch() != b.isMutualMatch()) {
                return a.isMutualMatch() ? -1 : 1;
            }
            return Integer.compare(b.getMatchScore(), a.getMatchScore());
        });

        return results;
    }

    public List<PartnerMatchDto> getMutualRecommendations(User currentUser) {
        List<TeachingSkill> myTeaching = teachingSkillRepository.findByUserIdWithSkill(currentUser.getId());
        List<LearningInterest> myLearning = learningInterestRepository.findByUserIdWithSkill(currentUser.getId());

        if (myTeaching.isEmpty() && myLearning.isEmpty()) {
            return Collections.emptyList();
        }

        Set<String> myTeachingNames = myTeaching.stream().map(t -> t.getSkill().getName().toLowerCase()).collect(Collectors.toSet());
        Set<String> myWantedNames = myLearning.stream().map(l -> l.getSkill().getName().toLowerCase()).collect(Collectors.toSet());

        List<User> allUsers = userRepository.findAll();
        List<PartnerMatchDto> recommendations = new ArrayList<>();

        for (User u : allUsers) {
            if (u.getId().equals(currentUser.getId())) continue;
            if (!"ACTIVE".equalsIgnoreCase(u.getStatus())) continue;

            UserProfile profile = userProfileRepository.findByUserId(u.getId()).orElse(null);
            if (profile == null) continue;

            List<TeachingSkill> partnerTeaching = teachingSkillRepository.findByUserIdWithSkill(u.getId());
            List<LearningInterest> partnerLearning = learningInterestRepository.findByUserIdWithSkill(u.getId());

            PartnerMatchDto match = buildMatchDto(profile, partnerTeaching, partnerLearning, myTeachingNames, myWantedNames);

            // Recommendations strictly prioritize mutual reciprocity or strong compatibility
            if (match.isMutualMatch() || match.getMatchScore() >= 60) {
                recommendations.add(match);
            }
        }

        // Sort mutual matches first, then score descending, then rating descending
        recommendations.sort((a, b) -> {
            if (a.isMutualMatch() != b.isMutualMatch()) {
                return a.isMutualMatch() ? -1 : 1;
            }
            int scoreCompare = Integer.compare(b.getMatchScore(), a.getMatchScore());
            if (scoreCompare != 0) return scoreCompare;
            return b.getRating().compareTo(a.getRating());
        });

        return recommendations;
    }

    private PartnerMatchDto buildMatchDto(
            UserProfile profile,
            List<TeachingSkill> partnerTeaching,
            List<LearningInterest> partnerLearning,
            Set<String> myTeachingNames,
            Set<String> myWantedNames) {

        PartnerMatchDto dto = new PartnerMatchDto();
        dto.setPartnerId(profile.getUser().getId());
        dto.setName(profile.getFullName());
        dto.setHeadline(profile.getHeadline());
        dto.setAvatarUrl(profile.getAvatarUrl());
        dto.setLocation(profile.getLocation());
        dto.setRating(profile.getAverageRating());
        dto.setTotalReviews(profile.getTotalReviews());
        dto.setAvailability(profile.getAvailability());

        List<String> allTeaches = partnerTeaching.stream().map(t -> t.getSkill().getName()).collect(Collectors.toList());
        List<String> allWants = partnerLearning.stream().map(l -> l.getSkill().getName()).collect(Collectors.toList());
        dto.setAllTeaches(allTeaches);
        dto.setAllWants(allWants);

        // Find match overlaps
        String partnerTeachesMe = partnerTeaching.stream()
                .filter(t -> myWantedNames.contains(t.getSkill().getName().toLowerCase()))
                .map(t -> t.getSkill().getName())
                .findFirst()
                .orElse(allTeaches.isEmpty() ? "General Knowledge" : allTeaches.get(0));

        String partnerWantsFromMe = partnerLearning.stream()
                .filter(l -> myTeachingNames.contains(l.getSkill().getName().toLowerCase()))
                .map(l -> l.getSkill().getName())
                .findFirst()
                .orElse(allWants.isEmpty() ? "Practical Mentorship" : allWants.get(0));

        boolean partnerHasWhatIWant = partnerTeaching.stream()
                .anyMatch(t -> myWantedNames.contains(t.getSkill().getName().toLowerCase()));

        boolean partnerWantsWhatITeach = partnerLearning.stream()
                .anyMatch(l -> myTeachingNames.contains(l.getSkill().getName().toLowerCase()));

        boolean isMutual = partnerHasWhatIWant && partnerWantsWhatITeach;
        dto.setMutualMatch(isMutual);
        dto.setPartnerTeachesYou(partnerTeachesMe);
        dto.setPartnerWantsFromYou(partnerWantsFromMe);

        if (isMutual) {
            int score = 88;
            if (profile.getAverageRating().compareTo(new BigDecimal("4.8")) >= 0) score += 7;
            if (profile.getTotalReviews() >= 5) score += 3;
            dto.setMatchScore(Math.min(99, score));
            dto.setMatchExplanation("Direct 2-way match! " + profile.getFullName() + " teaches " + partnerTeachesMe +
                    " (which you want to learn), and desires " + partnerWantsFromMe + " (which you offer to teach).");
        } else if (partnerHasWhatIWant) {
            dto.setMatchScore(72);
            dto.setMatchExplanation(profile.getFullName() + " teaches " + partnerTeachesMe + ", which matches your learning goals.");
        } else if (partnerWantsWhatITeach) {
            dto.setMatchScore(65);
            dto.setMatchExplanation(profile.getFullName() + " wants to learn " + partnerWantsFromMe + ", which you teach.");
        } else {
            dto.setMatchScore(40);
            dto.setMatchExplanation("Community member with active skill listings.");
        }

        return dto;
    }
}

