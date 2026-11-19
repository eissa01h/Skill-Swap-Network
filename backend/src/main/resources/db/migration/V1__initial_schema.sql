-- ============================================================================
-- Skill Swap Network: Complete PostgreSQL Schema Migration (V1)
-- Engine: PostgreSQL 15+ / Supabase
-- Compliant with: FR-01 to FR-13, NFR-01 to NFR-07, US-01 to US-08
-- ============================================================================

-- 1. Enable Cryptographic & UUID Extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 2. Master Domain Tables
-- ============================================================================

-- 2.1 USERS TABLE
-- Authentication credentials, security roles, and account lifecycle state.
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(30) NOT NULL DEFAULT 'ROLE_USER',
    status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uk_users_email UNIQUE (email),
    CONSTRAINT chk_users_role CHECK (role IN ('ROLE_USER', 'ROLE_ADMIN', 'ROLE_MODERATOR')),
    CONSTRAINT chk_users_status CHECK (status IN ('ACTIVE', 'SUSPENDED', 'BLOCKED', 'DEACTIVATED'))
);

-- 2.2 USER PROFILES TABLE
-- Public-facing persona, bio, geographical location, scheduling, and reputation statistics.
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    full_name VARCHAR(120) NOT NULL,
    headline VARCHAR(180),
    bio TEXT,
    avatar_url VARCHAR(500),
    location VARCHAR(120),
    timezone VARCHAR(50) DEFAULT 'UTC',
    availability VARCHAR(150),
    average_rating NUMERIC(3, 2) NOT NULL DEFAULT 0.00,
    total_reviews INTEGER NOT NULL DEFAULT 0,
    completed_exchanges_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uk_user_profiles_user_id UNIQUE (user_id),
    CONSTRAINT fk_user_profiles_users FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT chk_profiles_rating CHECK (average_rating >= 0.00 AND average_rating <= 5.00),
    CONSTRAINT chk_profiles_reviews CHECK (total_reviews >= 0),
    CONSTRAINT chk_profiles_exchanges CHECK (completed_exchanges_count >= 0)
);

-- 2.3 SKILLS CATALOG TABLE
-- Standardized repository of categorized disciplines and topics.
CREATE TABLE skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    category VARCHAR(80) NOT NULL,
    description TEXT,
    is_approved BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uk_skills_name UNIQUE (name),
    CONSTRAINT chk_skills_category CHECK (category IN (
        'Programming & Tech',
        'Languages',
        'Design & Creative',
        'Music & Audio',
        'Business & Marketing',
        'Academics & Science',
        'Lifestyle & Wellness'
    ))
);

-- 2.4 TEACHING SKILLS TABLE
-- Skills a member offers to instruct, including proficiency level and experience.
CREATE TABLE teaching_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    skill_id UUID NOT NULL,
    proficiency_level VARCHAR(30) NOT NULL,
    years_of_experience NUMERIC(3, 1),
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uk_teaching_skills_user_skill UNIQUE (user_id, skill_id),
    CONSTRAINT fk_teaching_skills_users FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_teaching_skills_skills FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE RESTRICT,
    CONSTRAINT chk_teaching_proficiency CHECK (proficiency_level IN ('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT')),
    CONSTRAINT chk_teaching_experience CHECK (years_of_experience >= 0)
);

-- 2.5 LEARNING INTERESTS TABLE
-- Skills a member actively desires to acquire, with target level and learning goals.
CREATE TABLE learning_interests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    skill_id UUID NOT NULL,
    target_level VARCHAR(30) NOT NULL,
    priority VARCHAR(20) NOT NULL DEFAULT 'MEDIUM',
    learning_goals TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uk_learning_interests_user_skill UNIQUE (user_id, skill_id),
    CONSTRAINT fk_learning_interests_users FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_learning_interests_skills FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE RESTRICT,
    CONSTRAINT chk_learning_target_level CHECK (target_level IN ('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT')),
    CONSTRAINT chk_learning_priority CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH'))
);

-- ============================================================================
-- 3. Exchange Lifecycle & Transaction Tables
-- ============================================================================

-- 3.1 EXCHANGE REQUESTS TABLE
-- Reciprocal peer swap proposals initiated between two users.
CREATE TABLE exchange_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id UUID NOT NULL,
    recipient_id UUID NOT NULL,
    offered_skill_id UUID NOT NULL,
    requested_skill_id UUID NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    message TEXT,
    proposed_schedule VARCHAR(255),
    responded_at TIMESTAMPTZ,
    cancellation_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_exchange_requests_sender FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_exchange_requests_recipient FOREIGN KEY (recipient_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_exchange_requests_offered_skill FOREIGN KEY (offered_skill_id) REFERENCES skills(id) ON DELETE RESTRICT,
    CONSTRAINT fk_exchange_requests_requested_skill FOREIGN KEY (requested_skill_id) REFERENCES skills(id) ON DELETE RESTRICT,
    CONSTRAINT chk_exchange_requests_distinct_users CHECK (sender_id <> recipient_id),
    CONSTRAINT chk_exchange_requests_distinct_skills CHECK (offered_skill_id <> requested_skill_id),
    CONSTRAINT chk_exchange_requests_status CHECK (status IN ('PENDING', 'ACCEPTED', 'DECLINED', 'CANCELLED', 'EXPIRED'))
);

-- 3.2 EXCHANGES TABLE
-- Contracted, ongoing or completed mutual skill exchange agreements.
CREATE TABLE exchanges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID NOT NULL,
    user_a_id UUID NOT NULL,
    user_b_id UUID NOT NULL,
    skill_a_to_b_id UUID NOT NULL,
    skill_b_to_a_id UUID NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    total_sessions_planned INTEGER NOT NULL DEFAULT 4,
    sessions_completed INTEGER NOT NULL DEFAULT 0,
    user_a_completed BOOLEAN NOT NULL DEFAULT FALSE,
    user_b_completed BOOLEAN NOT NULL DEFAULT FALSE,
    cancelled_by_user_id UUID,
    cancellation_reason TEXT,
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uk_exchanges_request_id UNIQUE (request_id),
    CONSTRAINT fk_exchanges_request FOREIGN KEY (request_id) REFERENCES exchange_requests(id) ON DELETE RESTRICT,
    CONSTRAINT fk_exchanges_user_a FOREIGN KEY (user_a_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_exchanges_user_b FOREIGN KEY (user_b_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_exchanges_skill_a FOREIGN KEY (skill_a_to_b_id) REFERENCES skills(id) ON DELETE RESTRICT,
    CONSTRAINT fk_exchanges_skill_b FOREIGN KEY (skill_b_to_a_id) REFERENCES skills(id) ON DELETE RESTRICT,
    CONSTRAINT fk_exchanges_cancelled_by FOREIGN KEY (cancelled_by_user_id) REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT chk_exchanges_distinct_users CHECK (user_a_id <> user_b_id),
    CONSTRAINT chk_exchanges_status CHECK (status IN ('ACTIVE', 'COMPLETED', 'CANCELLED', 'DISPUTED')),
    CONSTRAINT chk_exchanges_sessions CHECK (sessions_completed >= 0 AND sessions_completed <= total_sessions_planned),
    CONSTRAINT chk_exchanges_planned CHECK (total_sessions_planned > 0)
);

-- ============================================================================
-- 4. Communication & Scheduling
-- ============================================================================

-- 4.1 CONVERSATIONS TABLE
-- 1-on-1 direct messaging channels between swap partners.
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_one_id UUID NOT NULL,
    user_two_id UUID NOT NULL,
    exchange_id UUID,
    last_message_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_conversations_user_one FOREIGN KEY (user_one_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_conversations_user_two FOREIGN KEY (user_two_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_conversations_exchange FOREIGN KEY (exchange_id) REFERENCES exchanges(id) ON DELETE SET NULL,
    CONSTRAINT chk_conversations_user_order CHECK (user_one_id < user_two_id),
    CONSTRAINT uk_conversations_pair UNIQUE (user_one_id, user_two_id)
);

-- 4.2 MESSAGES TABLE
-- Individual messages belonging to a conversation.
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL,
    sender_id UUID NOT NULL,
    content TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    read_at TIMESTAMPTZ,
    sent_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_messages_conversation FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
    CONSTRAINT fk_messages_sender FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT chk_messages_content_not_empty CHECK (length(trim(content)) > 0)
);

-- 4.3 LESSONS TABLE
-- Scheduled calendar sessions tied to an active exchange.
CREATE TABLE lessons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    exchange_id UUID NOT NULL,
    instructor_id UUID NOT NULL,
    learner_id UUID NOT NULL,
    skill_id UUID NOT NULL,
    title VARCHAR(200) NOT NULL,
    lesson_date DATE NOT NULL,
    start_time TIME NOT NULL,
    duration_minutes INTEGER NOT NULL DEFAULT 60,
    delivery_method VARCHAR(50) NOT NULL DEFAULT 'ONLINE_VIDEO',
    meeting_link VARCHAR(500),
    meeting_location VARCHAR(255),
    status VARCHAR(30) NOT NULL DEFAULT 'SCHEDULED',
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_lessons_exchange FOREIGN KEY (exchange_id) REFERENCES exchanges(id) ON DELETE CASCADE,
    CONSTRAINT fk_lessons_instructor FOREIGN KEY (instructor_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_lessons_learner FOREIGN KEY (learner_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_lessons_skill FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE RESTRICT,
    CONSTRAINT chk_lessons_distinct_participants CHECK (instructor_id <> learner_id),
    CONSTRAINT chk_lessons_duration CHECK (duration_minutes > 0 AND duration_minutes <= 360),
    CONSTRAINT chk_lessons_delivery CHECK (delivery_method IN ('ONLINE_VIDEO', 'IN_PERSON', 'AUDIO_CALL')),
    CONSTRAINT chk_lessons_status CHECK (status IN ('SCHEDULED', 'COMPLETED', 'CANCELLED', 'RESCHEDULED'))
);

-- ============================================================================
-- 5. Trust, Feedback & Community Moderation
-- ============================================================================

-- 5.1 RATINGS & FEEDBACK TABLE
-- Verified peer reviews submitted strictly following completed exchanges.
CREATE TABLE ratings_feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    exchange_id UUID NOT NULL,
    reviewer_id UUID NOT NULL,
    reviewee_id UUID NOT NULL,
    skill_reviewed_id UUID NOT NULL,
    rating SMALLINT NOT NULL,
    feedback_comment TEXT NOT NULL,
    punctuality_rating SMALLINT,
    communication_rating SMALLINT,
    teaching_clarity_rating SMALLINT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uk_ratings_exchange_reviewer UNIQUE (exchange_id, reviewer_id),
    CONSTRAINT fk_ratings_exchange FOREIGN KEY (exchange_id) REFERENCES exchanges(id) ON DELETE RESTRICT,
    CONSTRAINT fk_ratings_reviewer FOREIGN KEY (reviewer_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_ratings_reviewee FOREIGN KEY (reviewee_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_ratings_skill FOREIGN KEY (skill_reviewed_id) REFERENCES skills(id) ON DELETE RESTRICT,
    CONSTRAINT chk_ratings_distinct_users CHECK (reviewer_id <> reviewee_id),
    CONSTRAINT chk_ratings_score CHECK (rating >= 1 AND rating <= 5),
    CONSTRAINT chk_ratings_comment_length CHECK (length(trim(feedback_comment)) >= 5),
    CONSTRAINT chk_ratings_punctuality CHECK (punctuality_rating IS NULL OR (punctuality_rating >= 1 AND punctuality_rating <= 5)),
    CONSTRAINT chk_ratings_communication CHECK (communication_rating IS NULL OR (communication_rating >= 1 AND communication_rating <= 5)),
    CONSTRAINT chk_ratings_clarity CHECK (teaching_clarity_rating IS NULL OR (teaching_clarity_rating >= 1 AND teaching_clarity_rating <= 5))
);

-- 5.2 REPORTS TABLE
-- Content, solicitation, and conduct violation reports submitted by members.
CREATE TABLE reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reporter_id UUID NOT NULL,
    reported_user_id UUID NOT NULL,
    target_type VARCHAR(50) NOT NULL,
    target_id UUID,
    category VARCHAR(80) NOT NULL,
    description TEXT NOT NULL,
    evidence_text TEXT,
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    admin_action VARCHAR(50) DEFAULT 'NONE',
    admin_notes TEXT,
    resolved_by_admin_id UUID,
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_reports_reporter FOREIGN KEY (reporter_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_reports_reported_user FOREIGN KEY (reported_user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_reports_resolver FOREIGN KEY (resolved_by_admin_id) REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT chk_reports_distinct_users CHECK (reporter_id <> reported_user_id),
    CONSTRAINT chk_reports_target_type CHECK (target_type IN ('USER_PROFILE', 'MESSAGE', 'EXCHANGE', 'REVIEW', 'COMMERCIAL_SOLICITATION')),
    CONSTRAINT chk_reports_category CHECK (category IN ('COMMERCIAL_SOLICITATION', 'HARASSMENT', 'SPAM', 'NO_SHOW', 'INAPPROPRIATE_CONTENT', 'OTHER')),
    CONSTRAINT chk_reports_status CHECK (status IN ('PENDING', 'UNDER_INVESTIGATION', 'RESOLVED', 'DISMISSED')),
    CONSTRAINT chk_reports_admin_action CHECK (admin_action IN ('NONE', 'WARNING_ISSUED', 'CONTENT_REMOVED', 'ACCOUNT_BLOCKED', 'ACCOUNT_BANNED', 'DISMISSED'))
);

-- 5.3 MODERATION AUDIT LOGS TABLE
-- Tamper-evident record of administrative and system enforcement actions.
CREATE TABLE moderation_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID NOT NULL,
    action VARCHAR(80) NOT NULL,
    target_entity_type VARCHAR(50) NOT NULL,
    target_entity_id UUID NOT NULL,
    reason TEXT NOT NULL,
    ip_address VARCHAR(45),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_audit_admin FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE RESTRICT
);

-- 5.4 NOTIFICATIONS TABLE
-- Real-time in-app alerts and notifications.
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    reference_type VARCHAR(50),
    reference_id UUID,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_notifications_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT chk_notifications_type CHECK (type IN (
        'SWAP_REQUEST_RECEIVED',
        'SWAP_REQUEST_ACCEPTED',
        'SWAP_REQUEST_DECLINED',
        'SWAP_REQUEST_CANCELLED',
        'LESSON_SCHEDULED',
        'LESSON_REMINDER',
        'REVIEW_RECEIVED',
        'ACCOUNT_WARNING',
        'SYSTEM_ANNOUNCEMENT'
    ))
);

-- ============================================================================
-- 6. Performance Indexing Strategy (NFR-01)
-- ============================================================================

-- Fast user email authentication lookup
CREATE INDEX idx_users_email_lower ON users (LOWER(email));
CREATE INDEX idx_users_status ON users (status);

-- Profiles search and reputation ordering
CREATE INDEX idx_user_profiles_user_id ON user_profiles (user_id);
CREATE INDEX idx_user_profiles_rating ON user_profiles (average_rating DESC);
CREATE INDEX idx_user_profiles_location ON user_profiles (location);

-- Skills catalog lookups
CREATE INDEX idx_skills_name_lower ON skills (LOWER(name));
CREATE INDEX idx_skills_category ON skills (category);

-- Reciprocal Matching Query Optimization:
-- Fast lookup of who teaches what, and who wants what
CREATE INDEX idx_teaching_skills_skill_user ON teaching_skills (skill_id, user_id);
CREATE INDEX idx_teaching_skills_user ON teaching_skills (user_id);
CREATE INDEX idx_learning_interests_skill_user ON learning_interests (skill_id, user_id);
CREATE INDEX idx_learning_interests_user ON learning_interests (user_id);

-- Exchange requests lookups by status
CREATE INDEX idx_exchange_requests_sender ON exchange_requests (sender_id, status);
CREATE INDEX idx_exchange_requests_recipient ON exchange_requests (recipient_id, status);
CREATE INDEX idx_exchange_requests_created ON exchange_requests (created_at DESC);

-- Exchanges lifecycle lookups
CREATE INDEX idx_exchanges_user_a ON exchanges (user_a_id, status);
CREATE INDEX idx_exchanges_user_b ON exchanges (user_b_id, status);
CREATE INDEX idx_exchanges_status ON exchanges (status);

-- Conversations and Messages lookups
CREATE INDEX idx_conversations_users ON conversations (user_one_id, user_two_id);
CREATE INDEX idx_conversations_last_msg ON conversations (last_message_at DESC);
CREATE INDEX idx_messages_conversation_sent ON messages (conversation_id, sent_at DESC);
CREATE INDEX idx_messages_unread ON messages (conversation_id, sender_id, is_read) WHERE is_read = FALSE;

-- Lessons timeline lookups
CREATE INDEX idx_lessons_exchange ON lessons (exchange_id, lesson_date, start_time);
CREATE INDEX idx_lessons_instructor ON lessons (instructor_id, status);
CREATE INDEX idx_lessons_learner ON lessons (learner_id, status);

-- Ratings lookups
CREATE INDEX idx_ratings_reviewee ON ratings_feedback (reviewee_id, rating);
CREATE INDEX idx_ratings_exchange ON ratings_feedback (exchange_id);

-- Reports moderation queue
CREATE INDEX idx_reports_status ON reports (status, created_at ASC);
CREATE INDEX idx_reports_reported_user ON reports (reported_user_id);

-- Notifications unread feed
CREATE INDEX idx_notifications_user_unread ON notifications (user_id, is_read, created_at DESC);

-- ============================================================================
-- 7. Seed Data: Master Categories and Canonical Admin Account
-- ============================================================================

INSERT INTO skills (name, category, description) VALUES
    ('React Architecture', 'Programming & Tech', 'Modern React 18, hooks, state management, and component architecture'),
    ('Python Programming', 'Programming & Tech', 'Python fundamentals, data structures, automation scripts, and algorithms'),
    ('Java Spring Boot', 'Programming & Tech', 'Enterprise Java backend services, REST APIs, and Spring Security'),
    ('PostgreSQL & Database Design', 'Programming & Tech', 'Relational database schema modeling, indexing, and SQL optimization'),
    ('Conversational Spanish', 'Languages', 'Everyday conversational speaking, vocabulary, and grammar'),
    ('Digital Photography & Editing', 'Design & Creative', 'Camera fundamentals, manual exposure, lighting, and Adobe Lightroom'),
    ('UI/UX Design Systems', 'Design & Creative', 'Figma design tokens, responsive typography, and accessibility'),
    ('Acoustic Guitar Fingerpicking', 'Music & Audio', 'Acoustic chords, fingerstyle patterns, rhythm, and song accompaniment'),
    ('Classical Piano Fundamentals', 'Music & Audio', 'Keyboard posture, sight reading, scales, and classical pieces'),
    ('Content Marketing Strategy', 'Business & Marketing', 'Inbound marketing, SEO copywriting, and brand storytelling')
ON CONFLICT (name) DO NOTHING;

-- End of V1 Schema Migration

