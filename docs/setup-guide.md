# Setup & Development Guide: Skill Swap Network

## 1. System Requirements & Prerequisites
Before running the application, ensure the following software tools are installed:
- **Node.js:** v18.0.0 or higher (`v26.13.1` detected)
- **NPM:** v9.0.0 or higher (`11.20.0` detected)
- **Java Development Kit (JDK):** JDK 17 or higher
- **Maven:** v3.8+ (or Maven Wrapper `mvnw` / `mvnw.cmd` included in `/backend`)
- **Database:** PostgreSQL 14+ instance (or Supabase Free Tier account)
- **Git:** Installed and configured

---

## 2. Environment Variables Configuration

### 2.1 Backend Environment Configuration
In the `/backend` directory, create or copy `.env` from `.env.example`:

```env
# Server
SERVER_PORT=8080

# PostgreSQL / Supabase Connection
DB_URL=jdbc:postgresql://<SUPABASE_HOST>:5432/<DATABASE_NAME>?sslmode=require
DB_USERNAME=postgres
DB_PASSWORD=<SUPABASE_DB_PASSWORD>

# JWT Secret & Expiration
JWT_SECRET=404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970
JWT_EXPIRATION_MS=86400000

# Client Origin (CORS)
CLIENT_ORIGIN=http://localhost:5173
```

### 2.2 Frontend Environment Configuration
In the `/frontend` directory, create or copy `.env` from `.env.example`:

```env
# Backend REST API Base URL
VITE_API_BASE_URL=http://localhost:8080/api/v1
```

---

## 3. Launching the Backend Service
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Build the project using Maven:
   ```bash
   mvn clean install
   # Or using Maven wrapper:
   ./mvnw clean install
   ```
3. Run the Spring Boot application:
   ```bash
   mvn spring-boot:run
   # Or using Maven wrapper:
   ./mvnw spring-boot:run
   ```
4. Verify backend health:
   Navigate to `http://localhost:8080/api/v1/skills` or API documentation at `http://localhost:8080/swagger-ui.html`.

---

## 4. Launching the Frontend Service
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open the application in your browser:
   ```
   http://localhost:5173
   ```

---

## 5. Independent Development Workflow
- **Frontend Independence:** The React application can be developed and styled with mock data services or against the running Spring Boot API. Vite proxy or CORS allows seamless local development.
- **Backend Independence:** The Spring Boot REST API can be tested independently using curl, Postman, or unit/integration tests without running the frontend.

