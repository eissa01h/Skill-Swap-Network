package com.skillswap.network.repository;

import com.skillswap.network.entity.Lesson;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface LessonRepository extends JpaRepository<Lesson, UUID> {
    List<Lesson> findByExchangeIdOrderByLessonDateAscStartTimeAsc(UUID exchangeId);

    @Query("SELECT l FROM Lesson l WHERE (l.instructor.id = :userId OR l.learner.id = :userId) ORDER BY l.lessonDate ASC, l.startTime ASC")
    List<Lesson> findUserLessons(@Param("userId") UUID userId);

    @Query("SELECT l FROM Lesson l WHERE (l.instructor.id = :userId OR l.learner.id = :userId) AND l.status = :status ORDER BY l.lessonDate ASC, l.startTime ASC")
    List<Lesson> findUserLessonsByStatus(@Param("userId") UUID userId, @Param("status") String status);
}
