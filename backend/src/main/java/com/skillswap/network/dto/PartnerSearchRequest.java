package com.skillswap.network.dto;

public class PartnerSearchRequest {
    private String query;
    private String category;
    private Double minRating;
    private String location;

    public PartnerSearchRequest() {}

    public String getQuery() { return query; }
    public void setQuery(String query) { this.query = query; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public Double getMinRating() { return minRating; }
    public void setMinRating(Double minRating) { this.minRating = minRating; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
}
