# Test Cases Specification: Skill Swap Network

**Document Version:** 1.0  
**Status:** Approved & Executed  
**Scope:** Functional Requirements (FR-01 to FR-13), User Stories (US-01 to US-08), Non-Functional Requirements (NFR-01 to NFR-07), Edge Cases  

---

## 1. Functional Requirements Test Cases (FR-01 to FR-13)

### FR-01: User Account Management
| Test Case ID | Description | Preconditions | Test Steps | Expected Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-FR01-01** | Member Registration with Valid Data | Database online, new email | Submit `fullName`, `email`, `password`, `location`, `bio`. | Account created, salted BCrypt hash generated, JWT token issued, HTTP 201. | ✅ PASS |
| **TC-FR01-02** | Duplicate Email Registration Prevention | User `alice@example.com` exists | Attempt to register with existing email `alice@example.com`. | System rejects registration with `409 Conflict` ("Email is already registered"). | ✅ PASS |
| **TC-FR01-03** | Member Login with Valid Credentials | User registered | Submit valid email and password. | JWT issued, user data returned, HTTP 200. | ✅ PASS |
| **TC-FR01-04** | Invalid Password Login Rejection | User registered | Submit valid email with incorrect password. | Rejected with `401 Unauthorized` ("Invalid email or password"). | ✅ PASS |
| **TC-FR01-05** | Token Invalidation on Logout | Authenticated session | Call `POST /api/v1/auth/logout` with Bearer token. | Token added to blacklist, subsequent requests with token return 401. | ✅ PASS |

### FR-02: User Profile Management
| Test Case ID | Description | Preconditions | Test Steps | Expected Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-FR02-01** | Retrieve Own Profile | Logged in as member | Call `GET /api/v1/profiles/me`. | Profile returned including private email, headline, bio, location, availability. | ✅ PASS |
| **TC-FR02-02** | Update Profile Information | Logged in as member | Submit updated `headline`, `bio`, `location`, `availability`. | Profile persisted with updated values; verified in subsequent queries. | ✅ PASS |
| **TC-FR02-03** | Public Profile Sanitization | Target user profile exists | Access `GET /api/v1/profiles/{id}` as public guest. | Public details shown; email, password hash, role, status completely stripped. | ✅ PASS |

### FR-03: Teaching Skill Management
| Test Case ID | Description | Preconditions | Test Steps | Expected Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-FR03-01** | Add Teaching Skill | User authenticated | Submit `name`, `category`, `level`, `experienceYears`. | Skill saved to user teaching inventory, HTTP 201. | ✅ PASS |
| **TC-FR03-02** | Duplicate Teaching Skill Prevention | User offers "Python" | Submit another teaching skill with name "python" or "  PYTHON  ". | System rejects with duplicate conflict error; single record maintained. | ✅ PASS |
| **TC-FR03-03** | Update Teaching Skill | Teaching skill exists | Edit proficiency level or experience years. | Skill attributes updated successfully. | ✅ PASS |
| **TC-FR03-04** | Delete Teaching Skill | Teaching skill exists | Call `DELETE /api/v1/skills/teaching/{id}`. | Skill removed from inventory; no longer returned in listings. | ✅ PASS |

### FR-04: Learning Skill Management
| Test Case ID | Description | Preconditions | Test Steps | Expected Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-FR04-01** | Add Learning Interest | User authenticated | Submit `name`, `category`, `targetLevel`, `priority`. | Learning goal created with priority tag, HTTP 201. | ✅ PASS |
| **TC-FR04-02** | Duplicate Learning Goal Prevention | User has goal "Spanish" | Attempt to add "spanish" to learning goals. | Rejected with conflict error; duplicate prevented. | ✅ PASS |
| **TC-FR04-03** | Update Learning Interest | Goal exists | Update target level from BEGINNER to ADVANCED. | Learning goal updated. | ✅ PASS |
| **TC-FR04-04** | Delete Learning Interest | Goal exists | Call `DELETE /api/v1/skills/learning/{id}`. | Goal removed from learning list. | ✅ PASS |

### FR-05: Search and Filter
| Test Case ID | Description | Preconditions | Test Steps | Expected Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-FR05-01** | Search by Keyword | Members have skills listed | Search query="Carlos". | Returns members matching name or skill query. | ✅ PASS |
| **TC-FR05-02** | Filter by Category | Multiple categories exist | Select category="Languages". | Returns only partners teaching Languages. | ✅ PASS |
| **TC-FR05-03** | Filter by Minimum Rating | Diverse ratings exist | Select minRating="4.9". | Returns partners with averageRating >= 4.9. | ✅ PASS |
| **TC-FR05-04** | Empty Results State | Search query has no match | Search query="NonExistentTopic999". | Returns empty list cleanly; UI shows EmptyState component. | ✅ PASS |

### FR-06: Skill Matching and Recommendations
| Test Case ID | Description | Preconditions | Test Steps | Expected Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-FR06-01** | Reciprocal Barter Matching | User A teaches what B learns, B teaches what A learns | Call `GET /api/v1/matches/recommendations`. | Partner returned with high compatibility score (80%+). | ✅ PASS |
| **TC-FR06-02** | Match Reasoning Transparency | Match identified | Inspect recommendation payload. | `teachesYou`, `wantsFromYou`, and clear rationale returned. | ✅ PASS |

### FR-07: Exchange Request Management
| Test Case ID | Description | Preconditions | Test Steps | Expected Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-FR07-01** | Propose Valid Barter Swap | 2 users with complementary skills | Submit recipient, offeredSkill, requestedSkill, schedule. | Request created with `PENDING` status; recipient notified. | ✅ PASS |
| **TC-FR07-02** | Prevent Self-Swap Proposal | User A authenticated | Propose swap where recipientId == userA.id. | Rejected with `400 Bad Request` ("Cannot send swap to yourself"). | ✅ PASS |
| **TC-FR07-03** | Prevent Same-Skill Barter | User proposes swap | Propose swap where offeredSkill == requestedSkill. | Rejected with `400 Bad Request` ("Skills must be distinct"). | ✅ PASS |

### FR-08: Request Status Management
| Test Case ID | Description | Preconditions | Test Steps | Expected Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-FR08-01** | Recipient Accepts Proposal | Proposal is `PENDING` | Recipient calls accept endpoint. | Status $\rightarrow$ `ACCEPTED`; active `Exchange` contract created automatically. | ✅ PASS |
| **TC-FR08-02** | Non-Recipient Cannot Accept | Proposal is `PENDING` | Sender or 3rd party attempts to accept. | Rejected with `403 Forbidden` ("Only recipient may accept"). | ✅ PASS |
| **TC-FR08-03** | Recipient Declines Proposal | Proposal is `PENDING` | Recipient calls decline endpoint. | Status $\rightarrow$ `DECLINED`; sender notified. | ✅ PASS |
| **TC-FR08-04** | Sender Cancels Proposal | Proposal is `PENDING` | Sender calls cancel endpoint. | Status $\rightarrow$ `CANCELLED`. | ✅ PASS |

### FR-09: Communication and Lesson Arrangement
| Test Case ID | Description | Preconditions | Test Steps | Expected Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-FR09-01** | Send Direct Peer Message | Exchange exists | Send text message in conversation thread. | Message saved, timestamped, displayed chronologically. | ✅ PASS |
| **TC-FR09-02** | Third-Party Message Block | Active conversation | Non-participant attempts to read or send messages. | Rejected with `403 Forbidden`. | ✅ PASS |
| **TC-FR09-03** | Schedule Virtual Lesson | Exchange active | Schedule lesson with topic, date, meeting link. | Lesson scheduled; status `UPCOMING`; meeting link generated. | ✅ PASS |

### FR-10: Exchange Completion Management
| Test Case ID | Description | Preconditions | Test Steps | Expected Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-FR10-01** | Track Session Progress | Active exchange | Update completed sessions counter. | Progress meter updates (e.g. 4/4 sessions completed). | ✅ PASS |
| **TC-FR10-02** | Dual Sign-Off Completion | All sessions completed | Both participants verify completion. | Status $\rightarrow$ `COMPLETED`; increments user swap count stats. | ✅ PASS |

### FR-11: Ratings and Feedback Submission
| Test Case ID | Description | Preconditions | Test Steps | Expected Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-FR11-01** | Submit 1–5 Star Review | Exchange `COMPLETED` | Submit rating (1–5), comment, sub-ratings. | Review saved; recalculates partner average rating and review count. | ✅ PASS |
| **TC-FR11-02** | Block Feedback Before Completion | Exchange `ACTIVE` | Participant attempts to review active exchange. | Rejected with `400 Bad Request` (completion required). | ✅ PASS |
| **TC-FR11-03** | Reject Duplicate Feedback | User already reviewed | Participant submits second review for same exchange. | Rejected with `409 Conflict` (single review constraint). | ✅ PASS |

### FR-12: Profile and Feedback Viewing
| Test Case ID | Description | Preconditions | Test Steps | Expected Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-FR12-01** | View Verified Testimonials | Reviews exist | Access member profile reviews tab. | All peer reviews displayed with star rating, author name, and date. | ✅ PASS |

### FR-13: Administration and Content Moderation
| Test Case ID | Description | Preconditions | Test Steps | Expected Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-FR13-01** | Submit Community Incident Report | Member witnesses spam | Submit reportedUserId, category, description. | Report saved to admin moderation queue with status `PENDING`. | ✅ PASS |
| **TC-FR13-02** | Admin Reviews and Resolves | Report in queue | Administrator resolves with `WARNING_ISSUED`. | Report marked `RESOLVED`; action recorded in audit log. | ✅ PASS |
| **TC-FR13-03** | Admin Blocks Violator Account | Account in violation | Administrator executes block action. | User status $\rightarrow$ `BLOCKED`; session revoked; login blocked. | ✅ PASS |
| **TC-FR13-04** | Admin Reinstates Account | Account blocked | Administrator executes unblock action. | User status $\rightarrow$ `ACTIVE`; user can log in again. | ✅ PASS |

---

## 2. User Story Acceptance Test Cases (US-01 to US-08)

| Test Case ID | User Story | Acceptance Criteria | Execution Result |
| :--- | :--- | :--- | :---: |
| **TC-US01-01** | US-01: Profile Creation | New user creates account, bio, headline, availability. | ✅ PASS |
| **TC-US02-01** | US-02: Skill Inventory | Member lists teaching skills and learning goals with levels. | ✅ PASS |
| **TC-US03-01** | US-03: Partner Matching | Directory search filters and reciprocal matches display score. | ✅ PASS |
| **TC-US04-01** | US-04: Swap Proposals | Member sends, views, accepts, declines, and cancels proposals. | ✅ PASS |
| **TC-US05-01** | US-05: Chat & Lessons | Participants exchange messages and schedule virtual sessions. | ✅ PASS |
| **TC-US06-01** | US-06: Exchange Completion| Session counter tracks progress; exchange transitions to `COMPLETED`. | ✅ PASS |
| **TC-US07-01** | US-07: Feedback & Reviews | Post-completion 1–5 star reviews update member trust score. | ✅ PASS |
| **TC-US08-01** | US-08: Content Moderation | Incidents reported, admin queue reviewed, accounts suspended. | ✅ PASS |

---

## 3. Non-Functional Requirements Test Cases (NFR-01 to NFR-07)

| Test Case ID | NFR Category | Criteria & Threshold | Execution Result |
| :--- | :--- | :--- | :---: |
| **TC-NFR01-01** | Security & Privacy | Password hashing, role immutability, data stripping on public profile. | ✅ PASS |
| **TC-NFR01-02** | Brute-Force Rate Limiting | Max 5 requests/60s on auth endpoints; 6th rejected with HTTP 429. | ✅ PASS |
| **TC-NFR02-01** | Usability & Validation | User-friendly error messages on invalid input, feedback alerts. | ✅ PASS |
| **TC-NFR03-01** | Latency Benchmark | P95 latency <= 3000ms across 50 simulated operations (actual: < 20ms). | ✅ PASS |
| **TC-NFR03-02** | Bundle Size Constraint | Frontend gzipped production bundle < 350 kB (actual: 93.5 kB). | ✅ PASS |
| **TC-NFR04-01** | Data Integrity | Duplicate prevention on skills and reviews; state machine integrity. | ✅ PASS |
| **TC-NFR05-01** | Maintainability | Clean layered architecture, modular services, zero direct DB leaks. | ✅ PASS |
| **TC-NFR06-01** | Responsive Design | Design tokens, viewport breakpoints for desktop, tablet, and mobile. | ✅ PASS |
| **TC-NFR07-01** | Non-Monetary Constraint| Zero payment gateways, wallets, fees, or currency fields in schema/API. | ✅ PASS |

