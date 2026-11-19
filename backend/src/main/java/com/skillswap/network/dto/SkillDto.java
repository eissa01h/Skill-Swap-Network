package com.skillswap.network.dto;

import java.util.UUID;

public class SkillDto {
    private UUID id;
    private String name;
    private String category;
    private String description;

    public SkillDto() {}

    public SkillDto(UUID id, String name, String category, String description) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.description = description;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}

