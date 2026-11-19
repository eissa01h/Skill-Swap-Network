# System Architecture Specification: Skill Swap Network

## 1. Architectural Philosophy & Overview
Skill Swap Network is designed around a strictly decoupled **Three-Layer Architecture (Presentation, Business Logic, and Persistence)** to ensure separation of concerns, high maintainability, independent deployability, and robust security.

```
┌────────────────────────────────────────────────────────┐
│               PRESENTATION LAYER (Frontend)            │
│  React SPA (Vite, JavaScript, React Router, Context)   │
└───────────────────────────▲────────────────────────────┘
                            │ REST / JSON (HTTPS)
                            │ JWT Bearer Authorization
┌───────────────────────────▼────────────────────────────┐
│          BUSINESS LOGIC LAYER (Backend REST API)        │
│  Spring Boot (Spring Web, Spring Security, Data JPA)   │
│                                                        │
│  Controllers ──► Services ──► Repositories ──► Entities │
└───────────────────────────▲────────────────────────────┘
                            │ JDBC / Hibernate (SSL)
┌───────────────────────────▼────────────────────────────┐
│               PERSISTENCE LAYER (Database)             │
│        PostgreSQL Relational DB (Supabase Hosted)      │
└────────────────────────────────────────────────────────┘
```

---

## 2. Layer Definitions & Boundaries

### Layer 1: Presentation Layer (`/frontend`)
- **Technology:** React 18+, Vite, modern CSS3 with custom variables.
- **Responsibilities:**
  - Rendering UI views, layouts, and reusable components.
  - Managing client-side routing and protected routes.
  - Maintaining user session tokens in client storage via `AuthContext`.
  - Consuming backend REST endpoints with asynchronous `fetch`/`axios` clients.
  - Client-side form validation and user feedback display.
- **Boundary Restriction:** The presentation layer has zero direct connection or credentials to the database. All operations must pass through authenticated REST endpoints.

### Layer 2: Business Logic & API Layer (`/backend`)
- **Technology:** Java 17+, Spring Boot 3.x, Spring Web, Spring Security, Spring Data JPA.
- **Architecture Pattern:** Standard enterprise layered design:
  - **Controllers (`controller/`):** Expose REST endpoints, map HTTP requests, perform payload validation, and return standardized `ResponseEntity<ApiResponse<T>>`.
  - **Data Transfer Objects (`dto/`):** Decouple database entities from client request/response models.
  - **Services (`service/`):** Encapsulate all core business logic, matching algorithms, transaction boundaries (`@Transactional`), and authorization rules.
  - **Repositories (`repository/`):** Spring Data JPA repositories interfacing with the persistence layer.
  - **Entities (`entity/`):** Hibernate/JPA entity models mapped to relational database tables.
  - **Security (`security/`):** Stateless JWT filters, password encoders (BCrypt), and role/access rules.
  - **Exception Handling (`exception/`):** Global exception handling with `@RestControllerAdvice` emitting structured error payloads.

### Layer 3: Persistence Layer (`/database`)
- **Technology:** PostgreSQL (hosted on Supabase free-tier).
- **Responsibilities:**
  - Relational schema with primary keys, foreign keys, unique constraints, and indexes.
  - ACID compliance for swap proposals, status transitions, and user ratings.

---

## 3. Requirements Traceability

### Functional Requirements (FR-01 to FR-13)
| Requirement ID | Description | Architectural Mapping |
| :--- | :--- | :--- |
| **FR-01** | User Registration & Profile Creation | `AuthController` -> `AuthService` -> `UserRepository` |
| **FR-02** | Secure Authentication & Session Handling | Spring Security + JWT Filter + BCrypt Hasher |
| **FR-03** | User Profile Management (Bio, Contact, Availability) | `UserProfileController` -> `UserService` |
| **FR-04** | Offered Skills Management (Add, Edit, Delete, Level) | `UserSkillController` -> `SkillService` (Type: OFFERED) |
| **FR-05** | Requested Skills Management (Skills user wants to learn) | `UserSkillController` -> `SkillService` (Type: WANTED) |
| **FR-06** | Skill Catalog & Categorization | `SkillCategoryController` -> Predefined or custom tags |
| **FR-07** | Search & Filter Skills (Keyword, Category, Proficiency) | `SkillSearchController` -> JPA Specifications / Search query |
| **FR-08** | Skill Match Recommendation Engine | `MatchService` -> Bidirectional swap compatibility algorithm |
| **FR-09** | Swap Request Creation & Proposal Submission | `SwapRequestController` -> `SwapService` (PENDING state) |
| **FR-10** | Swap Request Actions (Accept, Decline, Cancel) | `SwapService` state transitions with participant authorization |
| **FR-11** | Session Coordination & Status Tracking | `SwapService` (IN_PROGRESS, COMPLETED, CANCELLED lifecycle) |
| **FR-12** | Post-Swap Rating & Review System (1-5 stars, comments) | `ReviewController` -> `ReviewService` with aggregate score recalculation |
| **FR-13** | Notification System for Swap Events | `NotificationController` -> In-app event alerts |

### Non-Functional Requirements (NFR-01 to NFR-07)
| Requirement ID | Requirement | Architectural Enforcement |
| :--- | :--- | :--- |
| **NFR-01** | **Performance** | Sub-500ms API response target, indexed database queries, lightweight Vite bundle. |
| **NFR-02** | **Security** | BCrypt (cost factor 10) password hashing, stateless JWT with expiration, CORS origin filtering, SQL injection prevention via parameterized JPA queries. |
| **NFR-03** | **Scalability** | Stateless REST architecture allowing horizontal backend scaling; connection pooling via HikariCP. |
| **NFR-04** | **Reliability & Data Integrity** | PostgreSQL foreign key cascading rules, `@Transactional` boundaries on multi-step operations. |
| **NFR-05** | **Usability & Responsiveness** | Fully responsive CSS grid/flexbox layouts, accessible forms, consistent dark/light compatible styling. |
| **NFR-06** | **Maintainability** | Clean separation into distinct single-responsibility files; consistent DTO pattern; DRY principles. |
| **NFR-07** | **Portability & Zero Cost** | Configured via environment variables; built on 100% open-source software and free-tier infrastructure (Supabase PostgreSQL); no paid APIs or subscriptions. |

### User Stories (US-01 to US-08)
| User Story ID | User Story Title | User Goal |
| :--- | :--- | :--- |
| **US-01** | Account Registration & Onboarding | As a new learner/mentor, I want to create an account so I can join the community. |
| **US-02** | Skill Profile Setup | As a member, I want to list what I can teach and what I want to learn so others find me. |
| **US-03** | Skill Discovery & Filtering | As a user, I want to search skills by topic and level so I can find suitable partners. |
| **US-04** | Reciprocal Match Finding | As a user, I want the system to show reciprocal matches where each party has what the other needs. |
| **US-05** | Proposing a Skill Swap | As a learner, I want to send a swap proposal with details of what I can exchange. |
| **US-06** | Managing Swap Proposals | As a recipient, I want to review incoming proposals and accept or decline them. |
| **US-07** | Session Execution & Completion | As a participant, I want to mark our exchange as completed once we have shared knowledge. |
| **US-08** | Community Ratings & Reviews | As a participant, I want to rate and review my partner to build trust in the network. |

---

## 4. Security & Configuration
1. **No Hardcoded Credentials:** All credentials (database URLs, passwords, JWT secret keys) are ingested from `.env` files or runtime environment variables.
2. **CORS Policy:** Strict CORS configuration permitting communication exclusively between the configured frontend origin (`http://localhost:5173` in development) and backend API.
3. **Stateless JWT Flow:** Client transmits JWT in the HTTP `Authorization: Bearer <token>` header on every protected endpoint request.

