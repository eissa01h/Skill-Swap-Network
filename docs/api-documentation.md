# REST API Specification: Skill Swap Network

**Document Version:** 2.0  
**Status:** Approved & Implemented  
**Base URL:** `/api/v1`  
**Data Format:** `application/json`  
**Authentication Scheme:** `Authorization: Bearer <JWT_TOKEN>`  
**Compliant with:** FR-01 through FR-13, NFR-01 through NFR-07, US-01 through US-08

---

## 1. Architectural Standards & Response Envelopes

### 1.1 Standard Success Envelope
All successful API endpoints return JSON conforming to the generic envelope `ApiResponse<T>`:

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... },
  "timestamp": "2026-11-19T18:00:00Z"
}
```

### 1.2 Standard Error Response Envelope
Handled centrally by `GlobalExceptionHandler`:

```json
{
  "message": "Validation error / Conflict / Forbidden / Not Found",
  "errors": [
    "Proficiency level is required (BEGINNER, INTERMEDIATE, ADVANCED, EXPERT)",
    "Email is already registered. Please login instead."
  ],
  "timestamp": "2026-11-19T18:00:00Z"
}
```

### 1.3 HTTP Status Codes Standard
- `200 OK`: Request succeeded.
- `201 CREATED`: Resource created successfully.
- `400 BAD REQUEST`: Invalid input payload or violation of domain rules (e.g. self-swap).
- `401 UNAUTHORIZED`: Missing, invalid, or blacklisted JWT token / bad credentials.
- `403 FORBIDDEN`: Insufficient role authority (e.g. non-admin accessing admin portal) or participant ownership violation.
- `404 NOT FOUND`: Target entity ID does not exist.
- `409 CONFLICT`: Duplicate skill addition or duplicate feedback attempt.
- `500 INTERNAL SERVER ERROR`: Unhandled server exception.

---

## 2. Complete REST Endpoint Inventory

### 2.1 Authentication & Session (`/api/v1/auth`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/register` | Public | Register new member account with salted BCrypt password hash. |
| `POST` | `/api/v1/auth/login` | Public | Authenticate with email/password; generates signed JWT token. |
| `POST` | `/api/v1/auth/logout` | Authenticated | Invalidates the active JWT token via `TokenBlacklistService`. |
| `GET` | `/api/v1/auth/me` | Authenticated | Retrieves current authenticated user entity and authority. |

#### Register Payload Example:
```json
{
  "fullName": "Sarah Chen",
  "email": "sarah.chen@example.com",
  "password": "SecurePassword123!"
}
```

#### Auth Response Data:
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "tokenType": "Bearer",
  "userId": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
  "email": "sarah.chen@example.com",
  "fullName": "Sarah Chen",
  "role": "ROLE_USER",
  "avatarUrl": "https://images.unsplash.com/photo-1494790108377-be9c29b29330..."
}
```

---

### 2.2 Profile Management (`/api/v1/profiles`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/profiles/me` | Authenticated | View authenticated user's own profile and account details. |
| `PUT` | `/api/v1/profiles/me` | Authenticated | Update bio, location, headline, avatar, and availability. |
| `GET` | `/api/v1/profiles/{userId}` | Public | View another user's public profile (strictly hides private email & status). |

---

### 2.3 Skills & Inventory (`/api/v1/skills`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/skills` | Public | View master catalog of categorized skills. |
| `GET` | `/api/v1/skills/teaching` | Authenticated | List skills authenticated user offers to teach. |
| `POST` | `/api/v1/skills/teaching` | Authenticated | Add teaching skill (enforces duplicate prevention). |
| `PUT` | `/api/v1/skills/teaching/{id}` | Authenticated | Edit proficiency level, experience, or curriculum description. |
| `DELETE` | `/api/v1/skills/teaching/{id}` | Authenticated | Remove skill from user's teaching inventory. |
| `GET` | `/api/v1/skills/learning` | Authenticated | List skills authenticated user wants to learn. |
| `POST` | `/api/v1/skills/learning` | Authenticated | Add learning interest (enforces duplicate prevention). |
| `PUT` | `/api/v1/skills/learning/{id}` | Authenticated | Update target proficiency, priority, or learning goals. |
| `DELETE` | `/api/v1/skills/learning/{id}` | Authenticated | Remove skill from user's learning goals. |

---

### 2.4 Search & Reciprocal Matching Engine (`/api/v1/matches`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/matches/partners` | Authenticated | Search directory with `query`, `category`, `minRating`, `location`. |
| `GET` | `/api/v1/matches/recommendations` | Authenticated | Two-way reciprocal matching algorithm prioritizing mutual barter pairs. |

#### Mutual Match Recommendation Response:
```json
{
  "partnerId": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
  "name": "Carlos Rodriguez",
  "headline": "Bilingual Translator & Tech Enthusiast",
  "avatarUrl": "https://images.unsplash.com/photo-1507003211169...",
  "location": "Austin, TX",
  "rating": 4.95,
  "totalReviews": 12,
  "availability": "Weekends, Evenings",
  "matchScore": 95,
  "isMutualMatch": true,
  "matchExplanation": "Direct 2-way match! Carlos Rodriguez teaches Conversational Spanish (which you want to learn), and desires React Architecture (which you offer to teach).",
  "partnerTeachesYou": "Conversational Spanish",
  "partnerWantsFromYou": "React Architecture",
  "allTeaches": ["Conversational Spanish"],
  "allWants": ["React Architecture"]
}
```

---

### 2.5 Exchange Requests Pipeline (`/api/v1/requests`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/requests` | Authenticated | Propose a new barter swap request (validates distinct skills & users). |
| `GET` | `/api/v1/requests/sent` | Authenticated | List all outgoing proposals submitted by current user. |
| `GET` | `/api/v1/requests/received` | Authenticated | List all incoming proposals awaiting user's response. |
| `POST` | `/api/v1/requests/{id}/accept` | Recipient Only | Accept proposal; automatically provisions active `exchanges` contract. |
| `POST` | `/api/v1/requests/{id}/decline`| Recipient Only | Decline proposal (`PENDING` -> `DECLINED`). |
| `POST` | `/api/v1/requests/{id}/cancel` | Sender Only | Cancel pending proposal (`PENDING` -> `CANCELLED`). |

---

### 2.6 Active Exchange Contracts (`/api/v1/exchanges`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/exchanges` | Authenticated | List user's active and completed exchange agreements. |
| `GET` | `/api/v1/exchanges/{id}` | Participants | View full details of an exchange agreement. |
| `POST` | `/api/v1/exchanges/{id}/complete` | Participants | Sign off on exchange completion (both verify -> `COMPLETED`). |
| `POST` | `/api/v1/exchanges/{id}/cancel` | Participants | Premature termination with mandatory cancellation reason. |

---

### 2.7 Direct Messaging & Chat (`/api/v1/conversations`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/conversations` | Authenticated | List user's active direct message threads with partner details. |
| `GET` | `/api/v1/conversations/{id}/messages` | Participants | View chronological message history; marks unread as read. |
| `POST` | `/api/v1/conversations/{id}/messages` | Participants | Send text message to partner. |

---

### 2.8 Lesson Scheduling & Meetings (`/api/v1/lessons`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/lessons` | Authenticated | View upcoming and past scheduled sessions. |
| `POST` | `/api/v1/lessons` | Participants | Schedule lesson with date, start time, delivery method, and video link. |
| `GET` | `/api/v1/lessons/{id}` | Participants | View specific lesson agenda and video meeting room link. |
| `PUT` | `/api/v1/lessons/{id}` | Participants | Reschedule or edit lesson agenda/duration. |
| `POST` | `/api/v1/lessons/{id}/cancel` | Participants | Cancel an individual scheduled lesson. |

---

### 2.9 Peer Reviews & Feedback (`/api/v1/feedback`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/feedback` | Participants | Submit 1-5 star review (strictly requires completed exchange; no duplicates). |
| `GET` | `/api/v1/feedback/user/{userId}` | Public | View verified peer reviews received by a member. |
| `GET` | `/api/v1/feedback/exchange/{exchangeId}` | Authenticated | View feedback left for a specific exchange. |

---

### 2.10 Incident Reporting & Administration Portal (`/api/v1/admin`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/reports` | Authenticated | Submit safety report (commercial solicitation, harassment, spam). |
| `GET` | `/api/v1/admin/reports` | `ROLE_ADMIN` | Moderation queue: list all community flags filtered by status. |
| `GET` | `/api/v1/admin/reports/{id}` | `ROLE_ADMIN` | Full incident investigation with transcripts and statements. |
| `POST` | `/api/v1/admin/reports/{id}/resolve`| `ROLE_ADMIN` | Resolve report with enforcement action (`WARNING`, `BAN`, `DISMISS`). |
| `GET` | `/api/v1/admin/users` | `ROLE_ADMIN` | Member directory with account standing (passwords stripped). |
| `POST` | `/api/v1/admin/users/{userId}/block` | `ROLE_ADMIN` | Suspend user account and revoke JWT authentication. |
| `POST` | `/api/v1/admin/users/{userId}/unblock`| `ROLE_ADMIN` | Reclaim and reinstate user account. |
| `GET` | `/api/v1/admin/stats` | `ROLE_ADMIN` | Live platform metrics (total users, active swaps, resolution rate). |
| `GET` | `/api/v1/admin/audit-logs` | `ROLE_ADMIN` | Immutable audit trail of administrative enforcements. |
