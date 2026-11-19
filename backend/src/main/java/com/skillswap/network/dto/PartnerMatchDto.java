package com.skillswap.network.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public class PartnerMatchDto {
    private UUID partnerId;
    private String name;
    private String headline;
    private String avatarUrl;
    private String location;
    private BigDecimal rating;
    private int totalReviews;
    private String availability;
    private int matchScore; // 0 to 100%
    private boolean isMutualMatch;
    private String matchExplanation; // Clear explanation of why matched
    private String partnerTeachesYou;
    private String partnerWantsFromYou;
    private List<String> allTeaches;
    private List<String> allWants;

    public PartnerMatchDto() {}

    public UUID getPartnerId() { return partnerId; }
    public void setPartnerId(UUID partnerId) { this.partnerId = partnerId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getHeadline() { return headline; }
    public void setHeadline(String headline) { this.headline = headline; }

    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public BigDecimal getRating() { return rating; }
    public void setRating(BigDecimal rating) { this.rating = rating; }

    public int getTotalReviews() { return totalReviews; }
    public void setTotalReviews(int totalReviews) { this.totalReviews = totalReviews; }

    public String getAvailability() { return availability; }
    public void setAvailability(String availability) { this.availability = availability; }

    public int getMatchScore() { return matchScore; }
    public void setMatchScore(int matchScore) { this.matchScore = matchScore; }

    public boolean isMutualMatch() { return isMutualMatch; }
    public void setMutualMatch(boolean mutualMatch) { isMutualMatch = mutualMatch; }

    public String getMatchExplanation() { return matchExplanation; }
    public void setMatchExplanation(String matchExplanation) { this.matchExplanation = matchExplanation; }

    public String getPartnerTeachesYou() { return partnerTeachesYou; }
    public void setPartnerTeachesYou(String partnerTeachesYou) { this.partnerTeachesYou = partnerTeachesYou; }

    public String getPartnerWantsFromYou() { return partnerWantsFromYou; }
    public void setPartnerWantsFromYou(String partnerWantsFromYou) { this.partnerWantsFromYou = partnerWantsFromYou; }

    public List<String> getAllTeaches() { return allTeaches; }
    public void setAllTeaches(List<String> allTeaches) { this.allTeaches = allTeaches; }

    public List<String> getAllWants() { return allWants; }
    public void setAllWants(List<String> allWants) { this.allWants = allWants; }
}

