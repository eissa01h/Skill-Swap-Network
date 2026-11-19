# Security, Privacy & Administration Architecture: Skill Swap Network

**Document Version:** 1.0  
**Status:** Approved & Enforced  
**Standards Compliance:** NFR-01 (Security & Privacy), NFR-05 (Non-Monetary Policy), FR-13 (Admin & Moderation), OWASP Top 10 (2021)  

---

## 1. Executive Summary

Skill Swap Network is architected around the fundamental principle of peer-to-peer barter reciprocity with zero monetary exchange. As a platform facilitating human-to-human knowledge sharing, security, user privacy, and community safety are critical pillars.

This document formalizes the complete defensive architecture implemented across the application layers, detailing encryption, authorization matrices, data minimization policies, access control guards, and threat mitigations.

---

## 2. Authentication & Session Architecture

### 2.1 Password Storage & BCrypt Hashing
- User passwords are **never stored as plaintext** or encrypted with reversible ciphers.
- All credentials pass through `BCryptPasswordEncoder` utilizing salted, adaptive hashing with an internal work factor of 10.
- Password hashes are stored exclusively in the `users.password_hash` column and are excluded from entity serialization and DTO projections.

### 2.2 Stateless JWT Tokens & Invalidation
- **Token Generation:** Upon successful authentication (`/api/v1/auth/login` or `/api/v1/auth/register`), a signed JSON Web Token (JWT) is minted using HMAC-SHA256 (`HS256`) containing the user's primary identity (email), issued timestamp, and 24-hour expiration.
- **Per-Request Verification:** `JwtAuthenticationFilter` intercepts incoming HTTP requests, validates the signature, verifies expiration, and checks the token against the active invalidation blacklist.
- **Deterministic Logout:** When a member calls `POST /api/v1/auth/logout`, `TokenBlacklistService` caches the token signature until its natural expiration, immediately invalidating subsequent requests even if the JWT has not yet expired.

### 2.3 Prevention of Privilege Escalation
- User registration via `POST /api/v1/auth/register` strictly hardcodes the assigned authority to `"ROLE_USER"`.
- The request DTO (`RegisterRequest`) deliberately omits any `role` property. Even if malicious clients submit extra JSON properties, Spring Data JPA assigns the immutable default.
- Administrator accounts can only be provisioned by database administrators or existing platform administrators via dedicated administrative procedures.

---

## 3. Profile Privacy & Data Concealment

### 3.1 Public Profile Sanitization
When any user or guest inspects a member profile via `GET /api/v1/profiles/{userId}` or the frontend `/user/:id` route, the backend constructs a dedicated `PublicUserProfileDto` that enforces strict data minimization:

| Field | Exposed Publicly? | Rationale |
| :--- | :---: | :--- |
| Full Name | ✅ Yes | Needed for peer identification. |
| Headline & Bio | ✅ Yes | Needed to communicate teaching style and interests. |
| Teaching Skills & Learning Goals | ✅ Yes | Core barter discovery catalog. |
| Rating & Reviews | ✅ Yes | Community trust metric. |
| **Email Address** | ❌ **Never** | Hidden to protect user privacy and prevent off-platform spam. |
| **Password Hash** | ❌ **Never** | Strictly protected; stripped at entity mapping. |
| **Account Role / Status** | ❌ **Never** | Internal moderation details kept private. |
| **Authentication Tokens** | ❌ **Never** | Strictly session-scoped; never present in profile models. |

### 3.2 Private Account Details
- Personal account details (including email, timezone, and private availability) are accessible strictly to the owning member via `GET /api/v1/profiles/me` with a valid JWT token.
- On administrative user inspection (`GET /api/v1/admin/users`), password hashes are dynamically sanitized with `[PROTECTED]` placeholders prior to response delivery.

---

## 4. Exchange & Access Control Enforcement

Every peer-to-peer interaction enforces strict, non-bypassable domain authorization checks:

```
+---------------------------------------------------------------------------------------+
|                               EXCHANGE AUTHORIZATION MATRIX                           |
+--------------------------+---------------------+-------------------+------------------+
| Action                   | Authorized Role     | Unauthorized Role | HTTP Response    |
+--------------------------+---------------------+-------------------+------------------+
| Propose Swap             | Active Member       | Self, Suspended   | 400 Bad Request  |
| Accept Swap Proposal     | Recipient Only      | Sender, 3rd Party | 403 Forbidden    |
| Decline Swap Proposal    | Recipient Only      | Sender, 3rd Party | 403 Forbidden    |
| Cancel Pending Proposal  | Sender Only         | Recipient, Others | 403 Forbidden    |
| View Active Exchange     | Participants Only   | 3rd Parties       | 403 Forbidden    |
| Complete Exchange        | Participants Only   | 3rd Parties       | 403 Forbidden    |
| Read Chat Messages       | Participants Only   | 3rd Parties       | 403 Forbidden    |
| Send Chat Message        | Participants Only   | 3rd Parties       | 403 Forbidden    |
| Schedule Lesson          | Participants Only   | 3rd Parties       | 403 Forbidden    |
| Submit Peer Review       | Participants Only   | 3rd Parties       | 403 Forbidden    |
| Submit Review (Active)   | Anyone              | Before Completion | 400 Bad Request  |
| Submit Duplicate Review  | Participant         | Already Reviewed  | 409 Conflict     |
+--------------------------+---------------------+-------------------+------------------+
```

---

## 5. Administration & Moderation Security (FR-13)

### 5.1 RBAC Enforcement
- Administrative endpoints (`/api/v1/admin/**`) are safeguarded by dual-layer security:
  1. **URL Filter Security:** `SecurityConfig.java` mandates `.requestMatchers("/api/v1/admin/**").hasRole("ADMIN")`.
  2. **Method-Level Security:** Annotations (`@PreAuthorize("hasRole('ADMIN')")`) guard every administrative method.
- Non-admin attempts to access `/api/v1/admin/**` are immediately rejected with `403 Forbidden`.

### 5.2 Account Suspension & Immediate Invalidation
- When an administrator blocks a violating user via `POST /api/v1/admin/users/{id}/block`:
  1. The user's status is set to `BLOCKED`.
  2. The action, moderator identity, reason, and timestamp are committed to `moderation_audit_logs`.
  3. `CustomUserDetailsService` dynamically checks `user.getStatus()`. For blocked users, `isEnabled()` returns `false`.
  4. Even if the suspended user possesses an unexpired JWT token, every subsequent HTTP request is rejected by `JwtAuthenticationFilter`.
  5. The login endpoint (`/api/v1/auth/login`) explicitly rejects suspended users with an explanatory suspension message.
- **Admin Self-Protection:** The system explicitly forbids blocking administrator accounts, preventing hostile administrative lockouts.

---

## 6. Web Application & Network Defenses

### 6.1 Sliding-Window Rate Limiting
- **Component:** `RateLimiterService` provides thread-safe, sliding-window request throttling.
- **Protected Endpoints:** `POST /api/v1/auth/login` and `POST /api/v1/auth/register`.
- **Threshold:** Maximum 5 attempts per 60-second window per client IP address.
- **Response:** If threshold is exceeded, the server returns `HTTP 429 Too Many Requests` accompanied by a `Retry-After` header indicating remaining cooldown seconds.

### 6.2 Strict CORS Policy
- Configured in `CorsConfig.java` and registered as a `CorsConfigurationSource` bean for Spring Security:
  - Allowed Origins: `http://localhost:5173`, `http://127.0.0.1:5173`, and the production domain.
  - Allowed Methods: `GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `OPTIONS`.
  - Allowed Headers: `Authorization`, `Content-Type`, `Accept`, `Origin`, `X-Requested-With`.
  - Exposed Headers: `Authorization`, `Retry-After`.
  - Credentials: `allowCredentials(true)`.
  - Max Age: `3600` seconds.

### 6.3 Security Headers
- `X-Frame-Options: DENY`: Complete protection against Clickjacking attacks (OWASP A05).
- `X-Content-Type-Options: nosniff`: Prevents browser MIME-type sniffing exploits.
- `Cache-Control: no-cache, no-store, must-revalidate`: Enforced on authenticated API responses.

### 6.4 SQL Injection Defense
- 100% of database interactions leverage **Spring Data JPA** and **Hibernate ORM**.
- All queries utilize parameterized bind variables (`PreparedStatement`). No string concatenation is used in query formation, rendering SQL injection impossible.

### 6.5 Safe Exception Handling (CWE-209 Mitigation)
- `GlobalExceptionHandler` centrally formats error envelopes (`ErrorResponse`).
- Raw database error messages, SQL state codes, and JVM stack traces are strictly caught and logged server-side via SLF4J, while the client receives a sanitized, generic error notice.

---

## 7. Verification & Automated Test Suites

The backend includes comprehensive JUnit 5 and Mockito test suites covering all security and business constraints:

| Test Suite | Location | Verification Focus |
| :--- | :--- | :--- |
| `RoleBasedAuthorizationTest` | `src/test/java/.../security/` | Privilege escalation prevention, admin protection, blocked user disabling. |
| `ProfilePrivacySecurityTest` | `src/test/java/.../security/` | Public profile field stripping (email, hash, role, status concealed). |
| `ExchangeAccessControlTest` | `src/test/java/.../security/` | Recipient/sender exchange authorization, third-party chat isolation, feedback rules. |
| `RateLimiterSecurityTest` | `src/test/java/.../security/` | Throttling after 5 requests, HTTP 429 compliance, IP isolation, window reset. |
| `ExchangeBusinessRulesTest` | `src/test/java/.../service/` | Exchange state machine, cancellation cascading, dual sign-off. |
| `DuplicateSkillPreventionTest`| `src/test/java/.../service/` | ConflictException on duplicate teaching skills or learning interests. |
| `MatchingServiceTest` | `src/test/java/.../service/` | Reciprocal barter matching algorithm scoring and rationale generation. |

All tests pass cleanly conforming to standard Java 17 and Spring Boot 3.3.5 specifications.
