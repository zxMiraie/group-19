# Setting Up and Deploying Group 19

## Step 1: Install Prerequisites

Before you begin, make sure to have the following software installed on your local machine:

- Git: Download and install Git from https://git-scm.com/downloads.
- Node.js: Download and install the LTS version of Node.js from https://nodejs.org/en/download/.
- Firebase: https://firebase.google.com/ see [Step 4](https://campus.cs.le.ac.uk/gitlab/co2201-2023/group-19/-/tree/dev#step-4-set-up-firebase) for detailed set up instructions.

## Step 2: Clone the Repository

Open your command prompt or terminal and navigate to the directory where you want to clone the project. Run the following command:

```bash
git clone "https://campus.cs.le.ac.uk/gitlab/co2201-2023/group-19"
```

You may be prompted to login with your credentials to complete the clone. 

## Step 3: Change Directory

Navigate to the newly created project directory using the following command:

```bash
cd "group-19/webapp"
```

## Step 4: Set up Firebase

Follow these step-by-step instructions to set up a Firebase project to enable email and password authentication, set up a Realtime Database, and retrieve your firebaseConfig information:

### Step 4.1: Create a Firebase Account

1. Go to the Firebase website (https://firebase.google.com/).
2. If not signed in, click 'Sign in' in the top right of the screen and sign in with your Google account or create one if necessary.
3. Once logged in, click 'Get started'.

### Step 4.2: Create a Firebase Project

1. Click the "Create project" button.
2. Enter a project name and follow the on-screen instructions. Google Analytic settings can remain as the default, but can be customised if desired.
3. Click "Create project" and wait for the setup to complete. Click continue when the project is ready.

### Step 4.3: Enable Email and Password Authentication

1. You should now be in the Firebase console. Click the "Authentication" card.
2. Click the "Get started" button.
3. Navigate to the "Sign-in method" tab if not already there.
4. Toggle the ""Email/Password" provider on and click "Save". Do not toggle the "Email link (passwordless sign-in)".

### Step 4.4: Create a Realtime Database

1. In the left sidebar, click the "Build" dropdown and then click "Realtime Database" 
2. Click the "Create database" button.
3. In the popup, choose a database location (the default should be fine for most use cases) and click "Next".
5. Select either "Start in locked mode" or "Start in test mode" for the security rules, depending on your preference. Note that starting in test mode is less secure but allows for easier testing during development.
6. Click on "Enable" and wait for the database to be created.

### Step 4.5: Retrieve firebaseConfig Information

1. In the Firebase console, click on the gear icon next to "Project Overview" in the top left corner, and then click on "Project settings".
2. Navigate to the "General" tab.
3. Scroll down to the "Your apps" section and click on the web icon (the icon that looks like </>) to add a web app to your project.
4. Give your app a nickname and, if desired, check the "Also set up Firebase Hosting" box. Then click on "Register app".
5. After registering your app, you will see the firebaseConfig object displayed on the screen. It should look like this:

```javascript 
const firebaseConfig = {
    apiKey: "your-api-key",
    authDomain: "your-app.firebaseapp.com",
    databaseURL: "https://your-app.firebaseio.com",
    projectId: "your-app",
    storageBucket: "your-app.appspot.com",
    messagingSenderId: "your-messaging-sender-id",
    appId: "your-app-id",
    measurementId: "your-measurement-id"
};
```
### Step 4.6: Updating .env file with Firebase Config

To enable the React app to connect to the Firebase project, an .env file must be created in the React project's root directory and updated with the respective values from the firebaseConfig file.

To do this, follow the steps below:

1. Create a file called .env (no filetype) in the webapp directory (on macOS, this will require the use of TextEdit. Ignore the OS warning about dot files being reserved for the system)
2. Paste the following structure in the file:

    ```javascript
    REACT_APP_API_KEY="your-api-key"
    REACT_APP_AUTH_DOMAIN="your-app.firebaseapp.com"
    REACT_APP_DATABASE_URL="https://your-app.firebaseio.com"
    REACT_APP_PROJECT_ID="your-app"
    REACT_APP_STORAGE_BUCKET="your-app.appspot.com"
    REACT_APP_MESSAGING_SENDER_ID="your-messaging-sender-id"
    REACT_APP_APP_ID="your-app-id"
    REACT_APP_MEASUREMENT_ID="your-measurement-id"
    ```

3. Replace the placeholders within the quotation marks with the corresponding values from your firebaseConfig. For example, replace "your-api-key" with your actual API key value from your firebaseConfig, and so on. 
4. Save the .env file.

## Step 5: Install dependencies

Run the following command to install the project's dependencies:
```bash
npm install
```

## Step 6: Start the development server

To start the development server and open the application in your default web browser, run:

```bash
npm start
```

You can now view and test the project in the browser. The development server will automatically reload the application whenever you make changes to the source code.

## Step 7: Create an optimized build

When you're ready to create an optimized build for production, run the following command:

```bash
npm run build
```

This command will generate a "build" folder in the project directory containing the optimized files for deployment.

## Step 8: Test the production build

To test the production build locally, you'll need to serve the "build" folder using a static server. First, install the "serve" package globally (run as admin) by running :
```bash
npm install -g serve
```
Then serve the "build" folder using the following command:
```bash
serve -s build
```

This will start a local server, and you can view your optimized application by navigating to the provided URL in your browser.

## Step 9: Deployment

Now that you have a production-ready build, you can deploy the application to a hosting provider of your choice. Follow the provider's specific instructions to upload the contents of the "build" folder and your .env file and configure your domain.
