def COLOR_MAP = [
    'SUCCESS': 'good', 
    'FAILURE': 'danger',
]
pipeline {
  agent none
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
        label 'agent0'
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

    // stage('push to ECR'){
    //   agent{
    //     label 'agent1'
    //   }
    //   steps{
    //     script {
    //       docker.withRegistry( Regisry_URL, 'ecr:us-east-1:awscreds') {
    //         dockerImage.push('latest')
    //       }
    //     }
    //   }
    // }

    // stage('deploy to ECS'){
    //   agent{
    //     label 'agent1'
    //   }
    //   steps {
    //       withAWS(credentials: 'awscreds', region: 'us-east-1') {
    //           sh "aws ecs update-service --cluster ${cluster} --service ${service} --force-new-deployment"
    //       }
    //   }
    // }
  }

  post {
      always {
          echo "PIPELINE EXECUTED SUCCESSFULLY"
          // echo 'Sending Slack Notifications.'
          // slackSend channel: '#devops',
          //     color: COLOR_MAP[currentBuild.currentResult],
          //     message: "*${currentBuild.currentResult}:* Job ${env.JOB_NAME} build ${env.BUILD_NUMBER} \n More info at: ${env.BUILD_URL}"
      }
  }

}
