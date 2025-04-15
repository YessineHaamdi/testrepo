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
        stage('Maven Deploy') {
    steps {
        withCredentials([usernamePassword(credentialsId: 'nexus-admin', usernameVariable: 'NEXUS_USERNAME', passwordVariable: 'NEXUS_PASSWORD')]) {
            sh 'mvn deploy --settings jenkins/maven-settings.xml'
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


        stage('Docker Build & Push') {
            steps {
                script {
                    withDockerRegistry([credentialsId: 'dockerhub-token', url: 'https://index.docker.io/v1/']) {
                        sh '''
                        docker build -t YessineHaamdi/angularpfe-app:latest ./Angular_Gestion_Foyer
                        docker build -t YessineHaamdi/springpfe-app:latest ./myFirstProject
                        docker push YessineHaamdi/angularpfe-app:latest
                        docker push YessineHaamdi/springpfe-app:latest
                        '''
                    }
                }
            }
        }
    }
}
