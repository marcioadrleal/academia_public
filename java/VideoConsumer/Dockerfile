# ==========================================================
# STAGE 1 - BUILD
# ==========================================================
FROM maven:3.9.11-eclipse-temurin-21 AS build

WORKDIR /app

# Copia primeiro o pom para aproveitar cache das dependências
COPY pom.xml .

RUN mvn dependency:go-offline -B

# Copia o código
COPY src ./src

# Compila a aplicação
RUN mvn clean package -DskipTests


# ==========================================================
# STAGE 2 - RUNTIME
# ==========================================================
FROM eclipse-temurin:21-jre

WORKDIR /app

# Usuário não-root
RUN useradd -r -u 1001 spring

COPY --from=build /app/target/*.jar app.jar

RUN chown spring:spring /app/app.jar

USER spring

EXPOSE 8095

ENTRYPOINT ["java", "-jar", "/app/app.jar"]