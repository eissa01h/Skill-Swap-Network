# Skill Swap Network

A modern, full-stack peer-to-peer skill-sharing web application developed for the Software Engineering project.

## Overview
Skill Swap Network allows users to exchange skills with one another in a direct, credit-less, payment-free peer-to-peer ecosystem. Whether learning a musical instrument, a programming language, graphic design, or cooking, members discover partners with complementary skill sets, negotiate swap proposals, coordinate sessions, and build reputational trust.

## Tech Stack
- **Frontend:** React, Vite, JavaScript (ES6+), HTML5, CSS3
- **Backend:** Java 17+, Spring Boot 3.x (Spring Web, Spring Data JPA, Spring Security)
- **Database:** PostgreSQL (Supabase cloud PostgreSQL free-tier)
- **Authentication:** Stateless JWT & BCrypt password hashing
- **Version Control & Collaboration:** Git, GitHub, Antigravity

## Architecture
The application adheres strictly to a decoupled **Three-Layer Architecture**:
1. **Presentation Layer (Frontend):** React Single-Page Application (SPA) communicating exclusively via REST API calls with JSON payloads.
2. **Application / Business Logic Layer (Backend):** Spring Boot REST API handling authentication, authorization, domain logic, validation, and transaction boundaries.
3. **Persistence Layer (Database):** PostgreSQL relational database hosted on Supabase.

## Project Structure
```
SE PRO/
├── docs/                 # System architecture, DB design, API docs, setup guides, and progress
├── frontend/             # React + Vite client application
└── backend/              # Spring Boot REST API service
```

## Documentation
- [Architecture Guide](file:///c:/Users/AIRIN/OneDrive/Desktop/SE%20PRO/docs/architecture.md)
- [Database Design](file:///c:/Users/AIRIN/OneDrive/Desktop/SE%20PRO/docs/database-design.md)
- [API Documentation](file:///c:/Users/AIRIN/OneDrive/Desktop/SE%20PRO/docs/api-documentation.md)
- [Setup & Run Guide](file:///c:/Users/AIRIN/OneDrive/Desktop/SE%20PRO/docs/setup-guide.md)
- [Development Progress](file:///c:/Users/AIRIN/OneDrive/Desktop/SE%20PRO/docs/progress.md)

