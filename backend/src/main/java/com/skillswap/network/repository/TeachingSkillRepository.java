package com.skillswap.network.repository;

import com.skillswap.network.entity.TeachingSkill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TeachingSkillRepository extends JpaRepository<TeachingSkill, UUID> {
    List<TeachingSkill> findByUserId(UUID userId);
    List<TeachingSkill> findBySkillId(UUID skillId);
    Optional<TeachingSkill> findByUserIdAndSkillId(UUID userId, UUID skillId);
    boolean existsByUserIdAndSkillId(UUID userId, UUID skillId);

    @Query("SELECT ts FROM TeachingSkill ts JOIN FETCH ts.skill WHERE ts.user.id = :userId")
    List<TeachingSkill> findByUserIdWithSkill(@Param("userId") UUID userId);

    @Query("SELECT DISTINCT ts.user.id FROM TeachingSkill ts WHERE ts.skill.id = :skillId")
    List<UUID> findUserIdsTeachingSkill(@Param("skillId") UUID skillId);
}

