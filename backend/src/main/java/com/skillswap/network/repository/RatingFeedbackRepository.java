package com.skillswap.network.repository;

import com.skillswap.network.entity.RatingFeedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface RatingFeedbackRepository extends JpaRepository<RatingFeedback, UUID> {
    List<RatingFeedback> findByRevieweeIdOrderByCreatedAtDesc(UUID revieweeId);
    List<RatingFeedback> findByExchangeId(UUID exchangeId);
    Optional<RatingFeedback> findByExchangeIdAndReviewerId(UUID exchangeId, UUID reviewerId);
    boolean existsByExchangeIdAndReviewerId(UUID exchangeId, UUID reviewerId);

    @Query("SELECT AVG(rf.rating) FROM RatingFeedback rf WHERE rf.reviewee.id = :userId")
    Double calculateAverageRatingForUser(@Param("userId") UUID userId);

    @Query("SELECT COUNT(rf) FROM RatingFeedback rf WHERE rf.reviewee.id = :userId")
    long countReviewsForUser(@Param("userId") UUID userId);
}

