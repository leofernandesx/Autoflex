####
# This Dockerfile is used to build a Quarkus application in JVM mode
####

FROM maven:3.8.6-eclipse-temurin-17 AS build
WORKDIR /app

# Copy Maven files for dependency caching
COPY pom.xml .
RUN mvn dependency:go-offline

# Copy source code
COPY src ./src

# Build application
RUN mvn package -DskipTests

####
# Runtime stage
####
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copy JAR from build stage
COPY --from=build /app/target/quarkus-app/lib/ ./lib/
COPY --from=build /app/target/quarkus-app/*.jar ./
COPY --from=build /app/target/quarkus-app/app/ ./app/
COPY --from=build /app/target/quarkus-app/quarkus/ ./quarkus/

# Expose port
EXPOSE 8080

# Run application
ENTRYPOINT ["java", "-jar", "quarkus-run.jar"]
