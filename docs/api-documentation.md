# REST API Specification: Skill Swap Network

## 1. API Architecture Overview
- **Base URL:** `/api/v1`
- **Data Format:** `application/json`
- **Authentication Scheme:** `Authorization: Bearer <JWT_TOKEN>`

### 1.1 Standard Response Envelope
All API endpoints return JSON conforming to the standard envelope:

```json
{
  "success": true,
  "message": "Operation completed successfully.",
  "data": { ... },
  "timestamp": "2026-11-19T16:00:00Z"
}
```

### 1.2 Error Response Envelope
```json
{
  "success": false,
  "message": "Validation failed / Unauthorized / Resource Not Found",
  "errors": [
    "Field 'email' must be a valid email format"
  ],
  "timestamp": "2026-11-19T16:00:00Z"
}
```

---

## 2. API Endpoints Catalog

### 2.1 Authentication & User Session (`/api/v1/auth`)
| Method | Endpoint | Auth Required | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/register` | No | Register a new user account with hashed password |
| `POST` | `/api/v1/auth/login` | No | Authenticate with email/password; returns JWT token |
| `GET` | `/api/v1/auth/me` | Yes | Get the authenticated user's current session & identity |

#### Register Payload Example:
```json
{
  "email": "learner@example.com",
  "password": "StrongPassword123!",
  "fullName": "Jane Doe",
  "bio": "Software developer looking to learn acoustic guitar.",
  "location": "New York, USA",
  "availability": "Evenings & Weekends"
}
```

### 2.2 User Profiles (`/api/v1/users`)
| Method | Endpoint | Auth Required | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/users/{id}` | No | Get public profile, listed skills, and review ratings |
| `PUT` | `/api/v1/users/profile` | Yes | Update authenticated user's profile details & availability |

### 2.3 Master Skills & Categories (`/api/v1/skills`)
| Method | Endpoint | Auth Required | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/skills` | No | Get catalog of all master skills categorized |
| `POST` | `/api/v1/skills` | Yes | Add a new skill category/tag to catalog |

### 2.4 User Skill Inventory (`/api/v1/user-skills`)
| Method | Endpoint | Auth Required | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/user-skills/me` | Yes | List authenticated user's offered & wanted skills |
| `POST` | `/api/v1/user-skills` | Yes | Add a skill as `OFFERED` or `WANTED` with proficiency level |
| `PUT` | `/api/v1/user-skills/{id}`| Yes | Modify proficiency level or notes of a user skill |
| `DELETE` | `/api/v1/user-skills/{id}`| Yes | Remove a skill from user profile |

### 2.5 Discovery & Matching Engine (`/api/v1/matches` & `/api/v1/search`)
| Method | Endpoint | Auth Required | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/skills/search` | No | Query skills by keyword, category, and minimum proficiency |
| `GET` | `/api/v1/matches` | Yes | Find reciprocal matches (User has what you want AND wants what you have) |

### 2.6 Skill Swap Requests & Lifecycle (`/api/v1/swaps`)
| Method | Endpoint | Auth Required | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/swaps` | Yes | Propose a new skill swap request |
| `GET` | `/api/v1/swaps/sent` | Yes | Retrieve all swap requests initiated by user |
| `GET` | `/api/v1/swaps/received` | Yes | Retrieve incoming swap requests for user |
| `GET` | `/api/v1/swaps/{id}` | Yes | View details of a specific swap agreement |
| `PATCH` | `/api/v1/swaps/{id}/accept` | Yes | Accept an incoming swap proposal (`PENDING` -> `ACCEPTED`) |
| `PATCH` | `/api/v1/swaps/{id}/decline`| Yes | Decline an incoming swap proposal (`PENDING` -> `DECLINED`) |
| `PATCH` | `/api/v1/swaps/{id}/complete`| Yes | Mark exchange as finished (`ACCEPTED` -> `COMPLETED`) |
| `PATCH` | `/api/v1/swaps/{id}/cancel` | Yes | Cancel a pending or active swap (`-> CANCELLED`) |

### 2.7 Reviews & Reputation (`/api/v1/reviews`)
| Method | Endpoint | Auth Required | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/reviews` | Yes | Submit 1-5 star review for completed swap |
| `GET` | `/api/v1/users/{userId}/reviews` | No | View public reviews received by a user |

### 2.8 Notifications (`/api/v1/notifications`)
| Method | Endpoint | Auth Required | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/notifications` | Yes | Fetch unread and recent user notifications |
| `PATCH` | `/api/v1/notifications/{id}/read` | Yes | Mark a single notification as read |
| `PATCH` | `/api/v1/notifications/mark-all-read` | Yes | Mark all notifications as read |
