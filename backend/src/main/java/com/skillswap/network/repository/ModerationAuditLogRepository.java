package com.skillswap.network.repository;

import com.skillswap.network.entity.ModerationAuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ModerationAuditLogRepository extends JpaRepository<ModerationAuditLog, UUID> {
    List<ModerationAuditLog> findAllByOrderByCreatedAtDesc();
}

