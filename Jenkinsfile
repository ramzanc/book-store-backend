pipeline {
  agent any

  tools {
    nodejs 'node-24'
  }

  environment {
    SONAR_TOKEN = credentials('sonar-token-id')
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Install') {
      steps {
        bat 'npm install'
      }
    }

    stage('Test') {
      steps {
        bat 'npm test'
      }
    }

    stage('SonarQube Analysis') {
      steps {
        withSonarQubeEnv('SonarQube') {
          bat 'npx sonar-scanner -Dsonar.login=%SONAR_TOKEN%'
        }
      }
    }
  }
}
