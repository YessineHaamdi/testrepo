pipeline {
    agent any

    environment {
        NVM_DIR = "/var/lib/jenkins/.nvm"
        PATH = "$NVM_DIR/versions/node/v16.20.2/bin:$PATH"
        MAVEN_HOME = "/usr/bin"
        SONAR_TOKEN = credentials('sonartoken')
        NEXUS_URL = "http://192.168.245.153:8081/repository/maven-releases/"
        NEXUS_CREDENTIALS = credentials('nexus-admin')
        DOCKER_HUB_CREDENTIALS = credentials('dockerhub-token')
        // Définition de la version dynamique avec build number en patch
        DYNAMIC_VERSION = "1.0.${env.BUILD_NUMBER}"
    }

    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'main', credentialsId: 'Token Github', url: 'https://github.com/YessineHaamdi/testrepo.git'
            }
        }

        stage('Build & Test Angular') {
            steps {
                dir('Angular_Gestion_Foyer') {
                    sh 'npm install'
                    sh 'rm -f node_modules/.ngcc_lock_file'
                    sh 'npm run build --prod'
                }
            }
        }

        stage('Build & Test Spring Boot') {
            steps {
                dir('myFirstProject') {
                    sh '/usr/bin/mvn clean package -DskipTests'
                }
            }
        }

        stage('SonarQube Analysis') {
            steps {
                dir('myFirstProject') {
                    sh "/usr/bin/mvn sonar:sonar -Dsonar.login=${SONAR_TOKEN}"
                }
            }
        }

        stage('Upload Artifact to Nexus') {
            steps {
                dir('myFirstProject') {
                    withCredentials([usernamePassword(credentialsId: 'nexus-admin', usernameVariable: 'NEXUS_USERNAME', passwordVariable: 'NEXUS_PASSWORD')]) {
                        sh """
                            mvn deploy \
                              -DskipTests \
                              -DaltDeploymentRepository=nexus::default::${NEXUS_URL} \
                              -DrepositoryId=nexus \
                              -Dnexus.username=${NEXUS_USERNAME} \
                              -Dnexus.password=${NEXUS_PASSWORD} \
                              -Drevision=${DYNAMIC_VERSION}
                        """
                    }
                }
            }
        }

        stage('Docker Build Images') {
            steps {
                script {
                    sh 'docker build -t angularpfe-app:latest ./Angular_Gestion_Foyer'
                    sh 'docker build -t springpfe-app:latest ./myFirstProject'
                }
            }
        }

        stage('Trivy Scan Docker Images') {
            steps {
                script {
                    // Scan images but don't block the pipeline
                    sh 'trivy image --severity CRITICAL,HIGH --format json --output trivy-report-angular.json angularpfe-app:latest'
                    sh 'trivy image --severity CRITICAL,HIGH --format json --output trivy-report-spring.json springpfe-app:latest'

                    // Optionally, you can display the reports in the console output
                    sh 'cat trivy-report-angular.json'
                    sh 'cat trivy-report-spring.json'
                }
            }
        }

        stage('Docker Push to Docker Hub') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-token', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    script {
                        sh 'echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin'
                        sh 'docker tag angularpfe-app:latest docker.io/$DOCKER_USER/angularpfe-app:latest'
                        sh 'docker tag springpfe-app:latest docker.io/$DOCKER_USER/springpfe-app:latest'
                        sh 'docker push docker.io/$DOCKER_USER/angularpfe-app:latest'
                        sh 'docker push docker.io/$DOCKER_USER/springpfe-app:latest'
                    }
                }
            }
        }
    }
}
