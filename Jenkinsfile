def COLOR_MAP = [
    'SUCCESS': 'good', 
    'FAILURE': 'danger',
]
pipeline {
  agent none
  environment {
  Container_Registry = 'laukik2002/kops-cicd'
  Registry_URL = 'https://registry.hub.docker.com'
}
  stages {

    stage('checkOut'){
      agent {
        label 'main'
      }
      steps { 
        checkout scm
      }
    }

    stage('Test') {
      agent{
        label 'main'
      }
      steps {
        sh 'npm install'
        sh 'npm test'
      }
    }

    stage('build') {
      agent{
        label 'docker'
      }
      steps {
        sh 'npm install'
        sh 'npm run build'
      }
    }

    stage('Sonar Analysis'){
      agent {
        label 'main'
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
        label 'docker'
      }
      steps{
        script{
          dockerImage = docker.build( Container_Registry + ":$BUILD_NUMBER")
        }
      }
    }

    stage('push image'){
      agent{
        label 'docker'
      }
      steps{
        script {
          docker.withRegistry( Registry_URL, 'dockerhub') {
            dockerImage.push( env.BUILD_NUMBER )
          }
        }
      }
    }

    stage('Remove image'){
      agent{
        label 'docker'
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
                sh "helm upgrade shoppix-release ~/Kops_cicd/deployments/kubernetes/myapp --set image.tag=${BUILD_NUMBER} --namespace shoppin-ns"
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
