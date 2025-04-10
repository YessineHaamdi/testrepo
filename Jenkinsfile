pipeline {
    agent any

    environment {
        NPM_PATH = '/home/pipeline/.nvm/versions/node/v16.20.2/bin/npm'
        SONAR_TOKEN = credentials('sonartoken')
        NEXUS_URL = "http://192.168.245.153:8081/repository/maven-releases/"
        NEXUS_CREDENTIALS = credentials('nexus-admin')
        DOCKER_HUB_CREDENTIALS = credentials('dockerhub-token')
    }
    stages {
        stage('Who Am I') {
            steps {
                sh 'whoami'
                sh 'echo $HOME'
                sh 'ls -la /home/pipeline/.nvm/versions/node/v16.20.2/bin/npm'
            }
        }
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
                    sh '${NPM_PATH} install'  // Use npm from the specified path
                    sh 'rm -f node_modules/.ngcc_lock_file'
                    timeout(time: 10, unit: 'MINUTES') {
                        sh '${NPM_PATH} run build --prod'  // Again, specify the npm path
                    }
                }
            }
        }


        stage('Build & Test Spring Boot') {
            steps {
                dir('myFirstProject') {
                    sh 'mvn clean package -DskipTests'
                }
            }
        }

        stage('SonarQube Analysis') {
            steps {
                dir('myFirstProject') {
                    sh 'mvn sonar:sonar -Dsonar.login=${SONAR_TOKEN}'
                }
            }
        }

        stage('Upload Artifact to Nexus') {
            steps {
                dir('myFirstProject') {
                    sh "mvn deploy -DaltDeploymentRepository=nexus::default::${NEXUS_URL} -DrepositoryId=nexus"
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
