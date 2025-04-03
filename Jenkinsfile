pipeline {
    agent any

    environment {
        SONAR_TOKEN = credentials('sonartoken')
        NEXUS_URL = "http://192.168.245.153:8081/repository/maven-releases/"
        NEXUS_CREDENTIALS = credentials('nexus-admin')
        DOCKER_HUB_CREDENTIALS = credentials('dockerhub-token')
    }

    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'main', credentialsId: 'Token Github', url: 'https://github.com/YessineHaamdi/testrepo.git'
            }
        }

        stage('Build & Test Angular') {
            steps {
                dir('angular-frontend') {
                    sh 'npm install'
                    sh 'npm run build --prod'
                }
            }
        }

        stage('Build & Test Spring Boot') {
            steps {
                dir('springboot-backend') {
                    sh 'mvn clean package -DskipTests'
                }
            }
        }

        stage('SonarQube Analysis') {
            steps {
                dir('springboot-backend') {
                    sh 'mvn sonar:sonar -Dsonar.login=${SONAR_TOKEN}'
                }
            }
        }

        stage('Upload Artifact to Nexus') {
            steps {
                dir('springboot-backend') {
                    sh "mvn deploy -DaltDeploymentRepository=nexus::default::${NEXUS_URL} -DrepositoryId=nexus"
                }
            }
        }

        stage('Docker Build & Push') {
            steps {
                script {
                    withDockerRegistry([credentialsId: 'dockerhub-token', url: 'https://index.docker.io/v1/']) {
                        sh '''
                        docker build -t YessineHaamdi/angular-app:latest ./angular-frontend
                        docker build -t YessineHaamdi/spring-app:latest ./springboot-backend
                        docker push YessineHaamdi/angular-app:latest
                        docker push YessineHaamdi/spring-app:latest
                        '''
                    }
                }
            }
        }
    }
}
