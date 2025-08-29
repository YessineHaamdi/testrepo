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
        DYNAMIC_VERSION = "1.0.${env.BUILD_NUMBER}"
    }

    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'main', credentialsId: 'Token Github', url: 'https://github.com/YessineHaamdi/testrepo.git'
            }
        }

        stage('Prettier Check') {
            steps {
                dir('Angular_Gestion_Foyer') {
                    sh 'npm install'
                    sh 'npm run prettier:check'
                }
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
                    sh "${MAVEN_HOME}/mvn clean test"
                    sh "${MAVEN_HOME}/mvn clean package"
                }
            }
        }

        stage('SonarQube Analysis') {
            steps {
                dir('myFirstProject') {
                    sh "${MAVEN_HOME}/mvn sonar:sonar -Dsonar.login=${SONAR_TOKEN}"
                }
            }
        }

        stage('Upload Artifact to Nexus') {
            steps {
                dir('myFirstProject') {
                    withCredentials([usernamePassword(credentialsId: 'nexus-admin', usernameVariable: 'NEXUS_USERNAME', passwordVariable: 'NEXUS_PASSWORD')]) {
                        sh """
                            mvn deploy \
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
                    // Set timeout 15 minutes per image scan, only scan vulnerabilities
                    sh 'trivy image --timeout 15m --scanners vuln --severity CRITICAL,HIGH --format json --exit-code 0 --output trivy-report-angular.json angularpfe-app:latest'
                    sh 'trivy image --timeout 15m --scanners vuln --severity CRITICAL,HIGH --format json --exit-code 0 --output trivy-report-spring.json springpfe-app:latest'
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

    post {
        success {
            emailext(
                subject: "✅ SUCCESS: Build #${BUILD_NUMBER}",
                body: "Good news! The pipeline for ${env.JOB_NAME} build #${BUILD_NUMBER} succeeded.\nCheck console output: ${env.BUILD_URL}",
                to: 'haamdiyessine@gmail.com'
            )
        }
        failure {
            emailext(
                subject: "❌ FAILURE: Build #${BUILD_NUMBER}",
                body: "Oops! The pipeline for ${env.JOB_NAME} build #${BUILD_NUMBER} failed.\nCheck details: ${env.BUILD_URL}",
                to: 'haamdiyessine@gmail.com'
            )
        }
    }
}
