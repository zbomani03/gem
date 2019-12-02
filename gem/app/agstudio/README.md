## AgStudio UI
This project is the web application version of AgStudio Suite.


## Getting Started
- Clone the repository
- Ensure that NPM is configured to use Artifactorynpm config set registry https://artifactory.internal.granular.ag/artifactory/api/npm/npm-virtual
  - Run `npm config set registry https://artifactory.internal.granular.ag/artifactory/api/npm/npm-virtual` 
- You will need access to VPN (Pritunl) in order to access artifactory, and to do the following steps.
- Run `npm install` to resolve dependencies
- Run `npm run build` to create create the distribution


## Additional Documentation
This app was bootstrapped with Create React App. [Documentation can be found here!](https://facebook.github.io/create-react-app/docs/getting-started).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](#running-tests) for more information.

### `npm test:ci`

Launches the test runner in the interactive watch mode.<br>
It also shows test coverage in the console.

### `npm run build:development`

Builds the app using APIs found in .env.development

### `npm run build:staging`

Builds the app using APIs found in .env.staging

### `npm run build:production`

Builds the app using APIs found in .env.production

### Generate A Test Coverage Report

- Run `make cov`
- Navigate to web > coverage > report > Icov-report and open *index.html*  in the browser.