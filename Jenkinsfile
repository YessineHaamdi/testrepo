pipeline {
    agent any

    environment {
        NVM_DIR = "/var/lib/jenkins/.nvm"
        PATH = "$NVM_DIR/versions/node/v16.20.2/bin:$PATH"  // Make sure NVM_DIR is defined before usage
        MAVEN_HOME = "/usr/bin"
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
                dir('Angular_Gestion_Foyer') {
                    sh 'npm install'  // Use npm from the specified path
                    sh 'rm -f node_modules/.ngcc_lock_file'
                    sh 'npm run build --prod'
                    
                }
            }
        }

        stage('Build & Test Spring Boot') {
            steps {
                dir('myFirstProject') {
                    // Ensure mvn is installed and in the correct path
                    sh '/usr/bin/mvn clean package -DskipTests'  // Use the full path to mvn
                }
            }
        }

        stage('SonarQube Analysis') {
            steps {
                dir('myFirstProject') {
                    sh '/usr/bin/mvn sonar:sonar -Dsonar.login=${SONAR_TOKEN}'  // Full path to mvn, using credentials securely
                }
            }
        }
        

        stage('Upload Artifact to Nexus') {
    steps {
        dir('myFirstProject') {
            withCredentials([usernamePassword(credentialsId: 'nexus-admin', usernameVariable: 'NEXUS_USERNAME', passwordVariable: 'NEXUS_PASSWORD')]) {
                sh '''
                    mvn deploy \
                      -DskipTests \
                      -DaltDeploymentRepository=nexus::default::${NEXUS_URL} \
                      -DrepositoryId=nexus \
                      --settings ../jenkins/maven-settings.xml
                '''
            }
        }
    }
}


        // Docker Build stage to build images
        stage('Docker Build') {
            steps {
                script {
                    // Build the Docker images without pushing to any registry yet
                    sh '''
                    docker build -t angularpfe-app:latest ./Angular_Gestion_Foyer
                    docker build -t springpfe-app:latest ./myFirstProject
                    '''
                }
            }
        }

        // Push Docker images to Docker Hub
        stage('Push Docker Images to Docker Hub') {
            steps {
                script {
                    // Now push the images to Docker Hub
                    withCredentials([usernamePassword(credentialsId: 'dockerhub-token', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                        sh '''
                        docker tag angularpfe-app:latest YessineHaamdi/angularpfe-app:latest
                        docker tag springpfe-app:latest YessineHaamdi/springpfe-app:latest
                        docker push YessineHaamdi/angularpfe-app:latest
                        docker push YessineHaamdi/springpfe-app:latest
                        '''
                    }
                }
            }
        }
    }
}