def COLOR_MAP = [
    'SUCCESS': 'good', 
    'FAILURE': 'danger',
]
pipeline {
  agent none
  environment {
  Container_Registry = 'laukik2002/kops-cicd'
  Regisry_URL = 'https://registry.hub.docker.com'
}
  stages {

    stage('checkOut'){
      agent {
        label 'agent0'
      }
      steps { 
        checkout scm
      }
    }

    stage('Test') {
      agent{
        label 'agent0'
      }
      steps {
        sh 'npm install'
        sh 'npm test'
      }
    }

    stage('Build') {
      agent{
        label 'docker-sonar'
      }
      steps {
        sh 'npm install'
        sh 'npm run build'
      }
    }

    stage('Sonar Analysis'){
      agent {
        label 'agent0'
      }
      environment {
          scannerHome = tool "sonarscanner"
      }
      steps{
        withSonarQubeEnv('sonarserver') {
          sh "${scannerHome}/sonar-scanner \
            -Dsonar.organization=laukik \
            -Dsonar.projectKey=laukik_cicd \
            -Dsonar.sources=. \
            -Dsonar.host.url=https://sonarcloud.io"
        }
      }
    }


    stage('Build docker image') {
      agent{
        label 'docker-sonar'
      }
      steps{
        script{
          dockerImage = docker.build( Container_Registry + ":$BUILD_NUMBER")
        }
      }
    }

    stage('push image'){
      agent{
        label 'docker-sonar'
      }
      steps{
        script {
          docker.withRegistry( Regisry_URL, 'dockerhub') {
            dockerImage.push( env.BUILD_NUMBER )
          }
        }
      }
    }

    stage('Remove image'){
      agent{
        label 'docker-sonar'
      }
      steps{
        script {
          sh "docker rmi ${Container_Registry}:$BUILD_NUMBER"
        }
      }
    }

    stage('Deploy to k8s') {
        agent {
            label 'kops' 
        }
        steps {
            script {
                sh "helm upgrade my-release myapp --set image.tag=env.BUILD_NUMBER"
            }
        }
    }

  }

  post {
      always {
          echo 'Sending Slack Notifications.'
          slackSend channel: '#devops',
              color: COLOR_MAP[currentBuild.currentResult],
              message: "*${currentBuild.currentResult}:* Job ${env.JOB_NAME} build ${env.BUILD_NUMBER} \n More info at: ${env.BUILD_URL}"
      }
  }

}
