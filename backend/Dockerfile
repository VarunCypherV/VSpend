# Stage 1: Build the JAR using Maven Wrapper
FROM maven:3.9.5-eclipse-temurin-17 AS builder

WORKDIR /app

COPY pom.xml .
COPY mvnw .
COPY .mvn .mvn
COPY src ./src

RUN chmod +x mvnw && ./mvnw clean package -DskipTests

# Stage 2: Run the built JAR
FROM openjdk:17-jdk-slim

WORKDIR /app

COPY --from=builder /app/target/*SNAPSHOT.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
