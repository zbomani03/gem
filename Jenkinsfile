pipeline {
    options {
        timestamps()
        ansiColor('xterm')
    }
    agent { label 'encsharedprod-debian' }
    environment {
        REPO = "artifactory.internal.granular.ag/agstudio"
    }

    stages {

        // Docker
        stage ('Print environment info') {
            steps {
                script {
                    echo "GitLab Action Type: ${gitlabActionType}"
                    echo "GitLab Branch: ${gitlabBranch}"
                }
            }
            
        }
        
        stage('Compile, Test & Push Build') {
            when {
                environment name: 'gitlabActionType', value: 'PUSH'
                environment name: 'gitlabBranch', value: 'master'
            }
            agent { label 'encsharedprod-debian' }
                environment {
                    ACTION = 'build_container'
                    DOCKERFILE_FOLDER = "monorepo"
                    DOCKER_IMAGE = "${env.REPO}" + "-build"
                }
            steps {
                script {
                    def basever = sh script:'cat deploy/BASEVERSION', returnStdout: true
                    def VERSION = basever.trim() + '.' + env.BUILD_NUMBER
                    env.VERSION = VERSION
                }
                sh 'do/all'
                deleteDir()
            }
        }
        
        stage('Build & Push PDF API') {
            when {
                environment name: 'gitlabActionType', value: 'PUSH'
                environment name: 'gitlabBranch', value: 'master'
            }
            agent { label 'encsharedprod-debian' }
                environment {
                    ACTION = 'build_container'
                    DOCKERFILE_FOLDER = "api-pdf"
                    DOCKER_IMAGE = "${env.REPO}" + "-api-pdf"
                }
            steps {
                script {
                    def basever = sh script:'cat deploy/BASEVERSION', returnStdout: true
                    def VERSION = basever.trim() + '.' + env.BUILD_NUMBER
                    env.VERSION = VERSION
                }
                sh 'do/all'
                deleteDir()
            }
        }

        stage('Build & Push AgStudio') {
            when {
                environment name: 'gitlabActionType', value: 'PUSH'
                environment name: 'gitlabBranch', value: 'master'
            }
            agent { label 'encsharedprod-debian' }
                environment {
                    ACTION = 'build_container'
                    DOCKERFILE_FOLDER = "app-agstudio"
                    DOCKER_IMAGE = "${env.REPO}" + "-app-agstudio"
                }
            steps {
                script {
                    def basever = sh script:'cat deploy/BASEVERSION', returnStdout: true
                    def VERSION = basever.trim() + '.' + env.BUILD_NUMBER
                    env.VERSION = VERSION
                }
                sh 'do/all'
                deleteDir()
            }
        }

        // Deploy

        stage('Deploy to Dev...') {
            when {
                environment name: 'gitlabActionType', value: 'PUSH'
                environment name: 'gitlabBranch', value: 'master'
            }
            environment {
                ACTION = 'deploy'
                ENVIRONMENT = 'granappdevelopment'
                AWS_ACCOUNT = '493050087935'
            }
            parallel {
                stage('Deploy to PDF API us-east-1') {
                    agent { label 'granappdevelopment-debian' }
                    environment {
                        CLUSTERNAME = 'cluster.us.dev.lite.granular.ag'
                        PRODUCTNAME = 'api-pdf'
                        IMAGENAME = 'api-pdf'
                        REGION = 'us-east-1'
                        MEMORY = '256Mi'
                    }
                    steps {
                        script {
                            def basever = sh script:'cat deploy/BASEVERSION', returnStdout: true
                            def VERSION = basever.trim() + '.' + env.BUILD_NUMBER
                            env.CONTAINERVERSION = VERSION
                            env.REPLICA_COUNT = 2
                            def kubectlHome = tool "kubectl-linux"
                        }
                        withCredentials([file(credentialsId: 'jenkins-cluster.us.dev.lite.granular.ag', variable: 'KUBECONFIG')]) {
                            sh 'do/all'
                        }
                        deleteDir()
                    }
                }
                stage('Deploy AgStudio to us-east-1') {
                    agent { label 'granappdevelopment-debian' }
                    environment {
                        CLUSTERNAME = 'cluster.us.dev.lite.granular.ag'
                        PRODUCTNAME = 'app-agstudio'
                        IMAGENAME = 'app-agstudio'
                        REGION = 'us-east-1'
                        MEMORY = '256Mi'
                    }
                    steps {
                        script {
                            def basever = sh script:'cat deploy/BASEVERSION', returnStdout: true
                            def VERSION = basever.trim() + '.' + env.BUILD_NUMBER
                            env.CONTAINERVERSION = VERSION
                            env.REPLICA_COUNT = 2
                            def kubectlHome = tool "kubectl-linux"
                        }
                        withCredentials([file(credentialsId: 'jenkins-cluster.us.dev.lite.granular.ag', variable: 'KUBECONFIG')]) {
                            sh 'do/all'
                        }
                        deleteDir()
                    }
                }
            }
            post {
                failure {
                    slackSend (color: '#a30200', channel: '#agstudio_notify', message: "${env.JOB_NAME} - #${env.BUILD_NUMBER} Failure after ${currentBuild.durationString} (<${env.BUILD_URL}|Open>)")
                 }
            }
        }

        stage('Run Regression in Dev') {
           agent {
                label 'granappdevelopment-qa-debian'
           }
           environment {
                ACTION = 'test'
                ENVIRONMENTSHORTNAME = 'dev'
           }
           options {
                timeout(time: 150, unit: 'MINUTES')
           }
           steps {
                sh '''#!/bin/bash
                do/all'''
           }
           post {
               always {
                   archiveArtifacts 'Results/**/*'
                   junit 'Results/**/*.xml'
                   deleteDir()
               }
           }
        }

        stage('Deploy to Test...') {
            when {
                environment name: 'gitlabActionType', value: 'PUSH'
                environment name: 'gitlabBranch', value: 'master'
            }
            environment {
                ACTION = 'deploy'
                ENVIRONMENT = 'granapptest'
                AWS_ACCOUNT = '354070167159'
            }
            parallel {
                stage('Deploy PDF API to us-east-1') {
                    agent { label 'granapptest-debian' }
                    environment {
                        CLUSTERNAME = 'cluster.us.test.lite.granular.ag'
                        PRODUCTNAME = 'api-pdf'
                        IMAGENAME = 'api-pdf-staging'
                        REGION = 'us-east-1'
                        MEMORY = '1Gi'
                    }
                    steps {
                        script {
                            def basever = sh script:'cat deploy/BASEVERSION', returnStdout: true
                            def VERSION = basever.trim() + '.' + env.BUILD_NUMBER
                            env.CONTAINERVERSION = VERSION
                            env.REPLICA_COUNT = 2
                            def kubectlHome = tool "kubectl-linux"
                        }
                        withCredentials([file(credentialsId: 'jenkins-cluster.us.test.lite.granular.ag', variable: 'KUBECONFIG')]) {
                            sh 'do/all'
                        }
                        deleteDir()
                    }
                }
                stage('Deploy AgStudio to us-east-1') {
                    agent { label 'granapptest-debian' }
                    environment {
                        CLUSTERNAME = 'cluster.us.test.lite.granular.ag'
                        PRODUCTNAME = 'app-agstudio'
                        IMAGENAME = 'app-agstudio-staging'
                        REGION = 'us-east-1'
                        MEMORY = '256Mi'
                    }
                    steps {
                        script {
                            def basever = sh script:'cat deploy/BASEVERSION', returnStdout: true
                            def VERSION = basever.trim() + '.' + env.BUILD_NUMBER
                            env.CONTAINERVERSION = VERSION
                            env.REPLICA_COUNT = 2
                            def kubectlHome = tool "kubectl-linux"
                        }
                        withCredentials([file(credentialsId: 'jenkins-cluster.us.test.lite.granular.ag', variable: 'KUBECONFIG')]) {
                            sh 'do/all'
                        }
                        deleteDir()
                    }
                }
            }
            post {
                failure {
                    slackSend (color: '#a30200', channel: '#agstudio_notify', message: "${env.JOB_NAME} - #${env.BUILD_NUMBER} Failure after ${currentBuild.durationString} (<${env.BUILD_URL}|Open>)")
                }
            }
        }


        stage('Run Regression in Test') {
           agent {
                label 'granapptest-qa-debian'
           }
           environment {
                ACTION = 'test'
                ENVIRONMENTSHORTNAME = 'test'
           }
           options {
                timeout(time: 150, unit: 'MINUTES')
           }
           steps {
               sh '''#!/bin/bash
               do/all'''
           }
           post {
               always {
                   archiveArtifacts 'Results/**/*'
                   junit 'Results/**/*.xml'
                   deleteDir()
               }
           }
        }

        stage('Deploy to Prod...') {
            when {
                environment name: 'gitlabActionType', value: 'PUSH'
                environment name: 'gitlabBranch', value: 'master'
            }
            environment {
                ACTION = 'deploy'
                ENVIRONMENT = 'granappproduction'
                AWS_ACCOUNT = '720993478729'
            }
            parallel {
                stage('Deploy PDF API to us-east-1') {
                    agent { label 'granappproduction-debian' }
                    environment {
                        CLUSTERNAME = 'cluster.us.lite.granular.ag'
                        PRODUCTNAME = 'api-pdf'
                        IMAGENAME = 'api-pdf-production'
                        REGION = 'us-east-1'
                        MEMORY = '1Gi'
                    }
                    steps {
                        script {
                            def basever = sh script:'cat deploy/BASEVERSION', returnStdout: true
                            def VERSION = basever.trim() + '.' + env.BUILD_NUMBER
                            env.CONTAINERVERSION = VERSION
                            env.REPLICA_COUNT = 12
                            def kubectlHome = tool "kubectl-linux"
                        }
                        withCredentials([file(credentialsId: 'jenkins-cluster.us.lite.granular.ag', variable: 'KUBECONFIG')]) {
                            sh 'do/all'
                        }
                        deleteDir()
                    }
                }
                stage('Deploy AgStudio to us-east-1') {
                    agent { label 'granappproduction-debian' }
                    environment {
                        CLUSTERNAME = 'cluster.us.lite.granular.ag'
                        PRODUCTNAME = 'app-agstudio'
                        IMAGENAME = 'app-agstudio-production'
                        REGION = 'us-east-1'
                        MEMORY = '256Mi'
                    }
                    steps {
                        script {
                            def basever = sh script:'cat deploy/BASEVERSION', returnStdout: true
                            def VERSION = basever.trim() + '.' + env.BUILD_NUMBER
                            env.CONTAINERVERSION = VERSION
                            env.REPLICA_COUNT = 12
                            def kubectlHome = tool "kubectl-linux"
                        }
                        withCredentials([file(credentialsId: 'jenkins-cluster.us.lite.granular.ag', variable: 'KUBECONFIG')]) {
                            sh 'do/all'
                        }
                        deleteDir()
                    }
                }
            }
            post {
                success {
                    slackSend (color: '#2eb886', channel: '#agstudio_notify', message: "${env.JOB_NAME} - #${env.BUILD_NUMBER} Success after ${currentBuild.durationString} (<${env.BUILD_URL}|Open>)")
                }
                failure {
                    slackSend (color: '#a30200', channel: '#agstudio_notify', message: "${env.JOB_NAME} - #${env.BUILD_NUMBER} Failure after ${currentBuild.durationString} (<${env.BUILD_URL}|Open>)")
                }
            }
        }

    }
}
