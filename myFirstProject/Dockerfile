# Use the official OpenJDK base image (Alpine version for a smaller image)
FROM openjdk:17-alpine

# Set the working directory
WORKDIR /

# Install curl to download the app.jar from Nexus
RUN apk --no-cache add curl

# Use the environment variables for Nexus credentials and URL
# These can be defined at runtime, and are often set in CI/CD pipelines.
# You can skip this if the pipeline already handles the Nexus credentials securely.
ENV NEXUS_USERNAME=admin
ENV NEXUS_PASSWORD=1234
ENV NEXUS_URL=http://192.168.245.153:8081/repository/maven-releases/tn/esprit/myFirstProject/1.0/myFirstProject-1.0.jar

# Download the .jar file from Nexus (correct the URL if necessary)
RUN curl -u $NEXUS_USERNAME:$NEXUS_PASSWORD -o app.jar $NEXUS_URL

# Expose the port your application will run on
EXPOSE 8089

# Define the entrypoint to run the .jar file
ENTRYPOINT ["java", "-jar", "app.jar"]
