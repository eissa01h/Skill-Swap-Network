package com.skillswap.network.repository;

import com.skillswap.network.entity.LearningInterest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface LearningInterestRepository extends JpaRepository<LearningInterest, UUID> {
    List<LearningInterest> findByUserId(UUID userId);
    List<LearningInterest> findBySkillId(UUID skillId);
    Optional<LearningInterest> findByUserIdAndSkillId(UUID userId, UUID skillId);
    boolean existsByUserIdAndSkillId(UUID userId, UUID skillId);

    @Query("SELECT li FROM LearningInterest li JOIN FETCH li.skill WHERE li.user.id = :userId")
    List<LearningInterest> findByUserIdWithSkill(@Param("userId") UUID userId);

    @Query("SELECT DISTINCT li.user.id FROM LearningInterest li WHERE li.skill.id = :skillId")
    List<UUID> findUserIdsWantingSkill(@Param("skillId") UUID skillId);
}
