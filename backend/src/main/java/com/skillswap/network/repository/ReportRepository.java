package com.skillswap.network.repository;

import com.skillswap.network.entity.Report;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ReportRepository extends JpaRepository<Report, UUID> {
    List<Report> findAllByOrderByCreatedAtDesc();
    List<Report> findByStatusOrderByCreatedAtAsc(String status);
    List<Report> findByReportedUserIdOrderByCreatedAtDesc(UUID reportedUserId);
    long countByStatus(String status);
}

