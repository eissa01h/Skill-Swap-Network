# Database Setup & Configuration Guide: Skill Swap Network

**Document Version:** 1.0  
**Database Engine:** PostgreSQL 15+  
**Target Environments:** Local PostgreSQL Instance & Supabase Cloud Free Tier  
**Migration Tool:** Flyway (`V1__initial_schema.sql`)  

---

## 1. Relational Database Overview

Skill Swap Network relies on an ACID-compliant PostgreSQL relational database with 14 specialized tables:

1. `users`: Core account identity, salted BCrypt password hash, role (`ROLE_USER`, `ROLE_ADMIN`), account status.
2. `user_profiles`: Member profile metadata, bio, location, timezone, scheduling availability, reputation metrics.
3. `skills`: Master catalog of standardized skills with categories.
4. `teaching_skills`: User-offered skills with proficiency level, years of experience, and curriculum description.
5. `learning_interests`: User-desired learning topics with target proficiency and priority tags.
6. `exchange_requests`: Barter swap proposals with proposed schedule and lifecycle status.
7. `exchanges`: Active bilateral barter agreements tracking completed session progress and completion sign-offs.
8. `conversations`: 1-on-1 direct messaging threads with canonical ID sorting to prevent duplicate channels.
9. `messages`: Chronological text communications with read receipts.
10. `lessons`: Scheduled virtual meetings with date, start time, delivery method, and video room URLs.
11. `ratings_feedback`: Verified peer reviews with 1–5 star ratings, sub-ratings, and qualitative comments.
12. `reports`: Community incident flags with categories (solicitation, spam, harassment) and evidence text.
13. `moderation_audit_logs`: Immutable audit trail of administrative penalties, suspensions, and reinstatements.
14. `notifications`: In-app event alerts for incoming proposals, acceptances, and reviews.

---

## 2. Option A: Cloud Setup on Supabase (Free Tier)

### Step 1: Create Supabase Project
1. Log in to [https://supabase.com](https://supabase.com).
2. Click **New Project** and configure:
   - **Name:** `skill-swap-network-db`
   - **Database Password:** Enter a secure password (save securely).
   - **Region:** Choose closest region.
   - **Plan:** Free Tier ($0).

### Step 2: Retrieve Credentials
1. In the Supabase Dashboard, go to **Settings** $\rightarrow$ **Database**.
2. Copy the JDBC Connection URL or configure parameters:
   ```
   jdbc:postgresql://db.<PROJECT_REF>.supabase.co:5432/postgres?sslmode=require
   ```

### Step 3: Run Initial DDL Migration
1. Open the Supabase **SQL Editor**.
2. Open [`backend/src/main/resources/db/migration/V1__initial_schema.sql`](file:///c:/Users/AIRIN/OneDrive/Desktop/SE%20PRO/backend/src/main/resources/db/migration/V1__initial_schema.sql).
3. Copy the entire file content and execute it in the SQL Editor.
4. Verify all 14 tables and initial skills are populated.

---

## 3. Option B: Local PostgreSQL Installation

### Step 1: Install PostgreSQL
- **Windows:** Download and install from [https://www.postgresql.org/download/windows/](https://www.postgresql.org/download/windows/) (version 15 or 16).
- **macOS:** `brew install postgresql@15 && brew services start postgresql@15`
- **Linux (Ubuntu/Debian):** `sudo apt update && sudo apt install -y postgresql postgresql-contrib`

### Step 2: Create Database and User
Open PowerShell or bash and run `psql`:
```sql
CREATE DATABASE skill_swap_network;
CREATE USER postgres WITH ENCRYPTED PASSWORD 'postgres';
GRANT ALL PRIVILEGES ON DATABASE skill_swap_network TO postgres;
```

### Step 3: Run Migration
- **Via Flyway (Automated):** Simply run the Spring Boot backend (`./mvnw spring-boot:run`). Flyway will detect `V1__initial_schema.sql` and automatically initialize the schema.
- **Via psql (Manual):**
  ```bash
  psql -U postgres -d skill_swap_network -f backend/src/main/resources/db/migration/V1__initial_schema.sql
  ```

---

## 4. Integrity Constraints & Business Rule Verification

The schema enforces strict domain rules at the database level:
- `UNIQUE(email)` on `users` prevents duplicate accounts.
- `UNIQUE(user_id, skill_id)` on `teaching_skills` prevents duplicate teaching offerings.
- `UNIQUE(user_id, skill_id)` on `learning_interests` prevents duplicate learning goals.
- `UNIQUE(exchange_id, reviewer_id)` on `ratings_feedback` prevents duplicate reviews.
- `CHECK (sender_id <> recipient_id)` prevents self-swaps.
- `CHECK (offered_skill_id <> requested_skill_id)` prevents trading identical skills.
- `CHECK (rating >= 1 AND rating <= 5)` validates score ranges.
