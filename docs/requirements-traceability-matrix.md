# Requirements Traceability Matrix (RTM): Skill Swap Network

**Document Version:** 1.0  
**Status:** Approved & Traceable  
**Scope:** Complete SRS Mapping across Database, Backend, Frontend, and QA Test Suites  

---

## 1. Functional Requirements Traceability Matrix (FR-01 to FR-13)

| Requirement ID | Requirement Description | Database Entity / Table | Backend REST API & Service | Frontend UI Page & Component | Test Case ID | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :---: |
| **FR-01** | User Account Management | `users` | `AuthController`, `AuthService`<br>`/api/v1/auth/*` | `LoginPage`, `RegisterPage`, `AuthContext` | TC-FR01-01<br>TC-FR01-02<br>TC-FR01-03<br>TC-FR01-04<br>TC-FR01-05 | ✅ VERIFIED |
| **FR-02** | User Profile Management | `user_profiles` | `ProfileController`, `ProfileService`<br>`/api/v1/profiles/*` | `ProfilePage`, `EditProfilePage`, `PublicProfilePage` | TC-FR02-01<br>TC-FR02-02<br>TC-FR02-03 | ✅ VERIFIED |
| **FR-03** | Teaching Skill Management | `skills`, `teaching_skills` | `SkillController`, `SkillService`<br>`/api/v1/skills/teaching/*` | `TeachingSkillsPage`, `SkillTag`, `Modal` | TC-FR03-01<br>TC-FR03-02<br>TC-FR03-03<br>TC-FR03-04 | ✅ VERIFIED |
| **FR-04** | Learning Skill Management | `skills`, `learning_interests` | `SkillController`, `SkillService`<br>`/api/v1/skills/learning/*` | `LearningInterestsPage`, `SkillTag`, `Modal` | TC-FR04-01<br>TC-FR04-02<br>TC-FR04-03<br>TC-FR04-04 | ✅ VERIFIED |
| **FR-05** | Search and Filter | `skills`, `teaching_skills`, `user_profiles` | `MatchController`, `MatchingService`<br>`/api/v1/matches/partners` | `FindPartnersPage`, `Input`, `Select`, `EmptyState` | TC-FR05-01<br>TC-FR05-02<br>TC-FR05-03<br>TC-FR05-04 | ✅ VERIFIED |
| **FR-06** | Skill Matching & Recommendations | `teaching_skills`, `learning_interests` | `MatchController`, `MatchingService`<br>`/api/v1/matches/recommendations` | `RecommendedMatchesPage`, `MatchCard`, `DashboardPage` | TC-FR06-01<br>TC-FR06-02 | ✅ VERIFIED |
| **FR-07** | Exchange Request Management | `exchange_requests` | `ExchangeRequestController`, `ExchangeRequestService`<br>`/api/v1/requests` | `ExchangeRequestsPage`, `Modal`, `FindPartnersPage` | TC-FR07-01<br>TC-FR07-02<br>TC-FR07-03 | ✅ VERIFIED |
| **FR-08** | Request Status Management | `exchange_requests`, `exchanges` | `ExchangeRequestController`<br>`/api/v1/requests/{id}/*` | `ExchangeRequestsPage`, `StatusBadge`, `Button` | TC-FR08-01<br>TC-FR08-02<br>TC-FR08-03<br>TC-FR08-04 | ✅ VERIFIED |
| **FR-09** | Communication & Lesson Arrangement | `conversations`, `messages`, `lessons` | `ChatController`, `LessonController`<br>`/api/v1/conversations/*`, `/api/v1/lessons/*` | `MessagesPage`, `LessonSchedulePage`, `Modal` | TC-FR09-01<br>TC-FR09-02<br>TC-FR09-03 | ✅ VERIFIED |
| **FR-10** | Exchange Completion Management | `exchanges` | `ExchangeController`, `ExchangeService`<br>`/api/v1/exchanges/{id}/complete` | `MyExchangesPage`, `Button`, `StatusBadge` | TC-FR10-01<br>TC-FR10-02 | ✅ VERIFIED |
| **FR-11** | Ratings & Feedback Submission | `ratings_feedback` | `FeedbackController`, `FeedbackService`<br>`/api/v1/feedback` | `FeedbackPage`, `Modal`, `Select`, `Textarea` | TC-FR11-01<br>TC-FR11-02<br>TC-FR11-03 | ✅ VERIFIED |
| **FR-12** | Profile and Feedback Viewing | `ratings_feedback`, `user_profiles` | `FeedbackController`<br>`/api/v1/feedback/user/{id}` | `PublicProfilePage`, `FeedbackPage`, `Card` | TC-FR12-01 | ✅ VERIFIED |
| **FR-13** | Administration & Content Reporting | `reports`, `moderation_audit_logs`, `users` | `AdminController`, `AdminService`<br>`/api/v1/admin/*`, `/api/v1/reports` | `AdminDashboardPage`, `AdminUsersPage`, `AdminReportsPage`, `AdminReportDetailPage`, `AdminModerationPage` | TC-FR13-01<br>TC-FR13-02<br>TC-FR13-03<br>TC-FR13-04 | ✅ VERIFIED |

---

## 2. User Stories Traceability Matrix (US-01 to US-08)

| User Story ID | Narrative Summary | Key Acceptance Criteria | Test Case ID | Status |
| :--- | :--- | :--- | :--- | :---: |
| **US-01** | Account Registration & Profile Setup | Create account, upload avatar, set headline/bio, define scheduling availability. | TC-US01-01 | ✅ VERIFIED |
| **US-02** | Skill Inventory Management | List skills offered to teach and goals desired to learn with proficiency tags. | TC-US02-01 | ✅ VERIFIED |
| **US-03** | Finding & Matching Partners | Search directory by keyword/category and discover reciprocal barter matches. | TC-US03-01 | ✅ VERIFIED |
| **US-04** | Barter Swap Proposal Lifecycle | Send, view, accept, decline, and cancel exchange agreements. | TC-US04-01 | ✅ VERIFIED |
| **US-05** | In-App Messaging & Scheduling | Real-time style message threads and scheduling virtual video lessons. | TC-US05-01 | ✅ VERIFIED |
| **US-06** | Exchange Completion | Track progress bar of completed lessons and execute dual verification sign-off. | TC-US06-01 | ✅ VERIFIED |
| **US-07** | Peer Ratings & Testimonials | Submit 1–5 star reviews post-completion; reviews recalculate partner reputation. | TC-US07-01 | ✅ VERIFIED |
| **US-08** | Community Safety & Moderation | Submit guideline violation reports; admin moderation queue resolves and blocks. | TC-US08-01 | ✅ VERIFIED |

---

## 3. Non-Functional Requirements Traceability Matrix (NFR-01 to NFR-07)

| NFR ID | Quality Attribute | Technical Enforcement Mechanism | Test Case ID | Status |
| :--- | :--- | :--- | :--- | :---: |
| **NFR-01** | Security & Privacy | BCrypt password hashing, stateless JWT, RBAC guards, public profile data stripping, sliding-window rate limiting. | TC-NFR01-01<br>TC-NFR01-02 | ✅ VERIFIED |
| **NFR-02** | Usability | Responsive navigation, role-preview bar, accessible form validation, informative empty states, error boundaries. | TC-NFR02-01 | ✅ VERIFIED |
| **NFR-03** | Performance | Sub-second latency benchmark ($\le 3\text{s}$ threshold); optimized production bundle size ($\approx 99.7\text{ kB}$ total gzipped). | TC-NFR03-01<br>TC-NFR03-02 | ✅ VERIFIED |
| **NFR-04** | Reliability & Data Integrity | Relational integrity constraints (`UNIQUE`, `FOREIGN KEY`, `CHECK`), dual sign-off state machine, ACID transactions. | TC-NFR04-01 | ✅ VERIFIED |
| **NFR-05** | Maintainability | Strict 3-layer architecture, 12 isolated REST service modules, reusable atomic UI design system, comprehensive docs. | TC-NFR05-01 | ✅ VERIFIED |
| **NFR-06** | Compatibility & Responsiveness | Cross-browser compatibility (Chrome, Firefox, Edge), viewport breakpoints for desktop, tablet, and mobile. | TC-NFR06-01 | ✅ VERIFIED |
| **NFR-07** | Fairness & Non-Monetary Policy | Enforced direct barter exchange; absolute zero currency, subscription, credit, or wallet balance concepts. | TC-NFR07-01 | ✅ VERIFIED |
