FROM node:10.15.3

WORKDIR /usr/src/app

COPY . .

RUN yarn config set registry https://artifactory.internal.granular.ag/artifactory/api/npm/npm-virtual/
RUN yarn && yarn test

ARG SONAR_TOKEN

RUN curl -s -L https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/sonar-scanner-cli-3.3.0.1492-linux.zip -o sonarscanner.zip \
  && unzip -qq sonarscanner.zip \
  && rm -rf sonarscanner.zip \
  && mv sonar-scanner-3.3.0.1492-linux sonar-scanner

COPY sonar-scanner.properties /usr/src/app/sonar-scanner/conf/sonar-scanner.properties
ENV SONAR_RUNNER_HOME=/usr/src/app/sonar-scanner
ENV PATH $PATH:/usr/src/app/sonar-scanner/bin

RUN sonar-scanner -Dsonar.login=${SONAR_TOKEN}