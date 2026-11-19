package com.skillswap.network.repository;

import com.skillswap.network.entity.Exchange;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ExchangeRepository extends JpaRepository<Exchange, UUID> {
    Optional<Exchange> findByRequestId(UUID requestId);

    @Query("SELECT e FROM Exchange e WHERE (e.userA.id = :userId OR e.userB.id = :userId) ORDER BY e.updatedAt DESC")
    List<Exchange> findByUserId(@Param("userId") UUID userId);

    @Query("SELECT e FROM Exchange e WHERE (e.userA.id = :userId OR e.userB.id = :userId) AND e.status = :status ORDER BY e.updatedAt DESC")
    List<Exchange> findByUserIdAndStatus(@Param("userId") UUID userId, @Param("status") String status);

    long countByStatus(String status);
}
