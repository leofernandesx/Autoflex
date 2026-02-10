####
# This Dockerfile is used to build a Quarkus application in JVM mode
####

FROM maven:3.8-eclipse-temurin-21 AS build
WORKDIR /app

# Copy Maven files for dependency caching
COPY pom.xml .
RUN mvn dependency:go-offline

# Copy source code
COPY src ./src

# Build application com PostgreSQL (db-kind é fixado em build time no Quarkus)
RUN mvn package -DskipTests \
  -Dquarkus.datasource.db-kind=postgresql \
  -Dquarkus.datasource.username=postgres \
  -Dquarkus.datasource.password=postgres \
  -Dquarkus.datasource.jdbc.url=jdbc:postgresql://postgres:5432/autoflex

####
# Runtime stage
####
FROM eclipse-temurin:21-jre-alpine
RUN apk add --no-cache netcat-openbsd
WORKDIR /app

# Copy JAR from build stage
COPY --from=build /app/target/quarkus-app/lib/ ./lib/
COPY --from=build /app/target/quarkus-app/*.jar ./
COPY --from=build /app/target/quarkus-app/app/ ./app/
COPY --from=build /app/target/quarkus-app/quarkus/ ./quarkus/

# Entrypoint aguarda postgres antes de iniciar
COPY docker-entrypoint.sh .
RUN chmod +x docker-entrypoint.sh

EXPOSE 8080
ENTRYPOINT ["./docker-entrypoint.sh"]
