# ==========================================
# Stage 1: Build the Spring Boot application
# ==========================================
FROM maven:3.9.6-eclipse-temurin-17-alpine AS builder

WORKDIR /build

# Copy Maven Project Object Model
COPY pom.xml .

# Download dependencies in layer for caching
RUN mvn dependency:go-offline -B

# Copy source code and database migrations
COPY src ./src

# Package production executable JAR without running tests during image build
RUN mvn clean package -DskipTests

# ==========================================
# Stage 2: Minimal Production Runtime Image
# ==========================================
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Create non-root system user for security compliance
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy compiled JAR from builder stage
COPY --from=builder /build/target/*.jar app.jar

# Adjust ownership
RUN chown -R appuser:appgroup /app

USER appuser

# Expose standard application port
EXPOSE 8080

# Configure JVM memory limits suited for 512MB free-tier instances
ENV JAVA_OPTS="-Xms256m -Xmx384m -XX:+UseG1GC"

# Launch application
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]

