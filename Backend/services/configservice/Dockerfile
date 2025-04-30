FROM maven:3.8.4-openjdk-17-slim AS build
WORKDIR /app

# Copy and install parent POM
COPY buildini-parent/pom.xml /app/pom.xml
RUN mvn install -f /app/pom.xml

# Copy and build service
COPY . /app
WORKDIR /app/Backend/services/configservice
RUN mvn clean package -DskipTests

FROM openjdk:17-jdk-slim
WORKDIR /app
COPY --from=build /app/Backend/services/configservice/target/*.jar app.jar
EXPOSE 8888
ENTRYPOINT ["java", "-jar", "app.jar"] 