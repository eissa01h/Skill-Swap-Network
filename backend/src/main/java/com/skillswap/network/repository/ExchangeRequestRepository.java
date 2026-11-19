package com.skillswap.network.repository;

import com.skillswap.network.entity.ExchangeRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ExchangeRequestRepository extends JpaRepository<ExchangeRequest, UUID> {
    List<ExchangeRequest> findBySenderIdOrderByCreatedAtDesc(UUID senderId);
    List<ExchangeRequest> findByRecipientIdOrderByCreatedAtDesc(UUID recipientId);
    List<ExchangeRequest> findBySenderIdAndStatus(UUID senderId, String status);
    List<ExchangeRequest> findByRecipientIdAndStatus(UUID recipientId, String status);

    @Query("SELECT r FROM ExchangeRequest r WHERE (r.sender.id = :userId OR r.recipient.id = :userId) AND r.status = :status")
    List<ExchangeRequest> findUserRequestsByStatus(@Param("userId") UUID userId, @Param("status") String status);
}
