package com.skillswap.network.repository;

import com.skillswap.network.entity.Conversation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ConversationRepository extends JpaRepository<Conversation, UUID> {
    Optional<Conversation> findByUserOneIdAndUserTwoId(UUID userOneId, UUID userTwoId);

    @Query("SELECT c FROM Conversation c WHERE c.userOne.id = :userId OR c.userTwo.id = :userId ORDER BY c.lastMessageAt DESC")
    List<Conversation> findUserConversations(@Param("userId") UUID userId);
}
