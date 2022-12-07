<p align="center"><img style="border-radius: 50%;" height="200" src="/Logo/Smart Coach Logo (Transparent bg) 1500x1500.png"></p>
<h1 align="center">SmartCoach</h1>

Cross platform nutrition tracking software that uses machine learning to help you reach your body composition goals.

## Table Of Contents

  1. [Features Wishlist](#features-wishlist)
  2. [Design Specs](#design-specs)
  3. [Requirements for Development](#requirements-for-development)
  4. [Technology Stack](#technology-stack)

## Features Wishlist

- [x] Finalize & implement technologies.
- [x] Revamp codebase.
- [x] Revamp UI.
- [x] Integrate paywall.
- [x] Understand if everything can be shifted to AWS instead of GCP. (Not needed)
- [x] Deploy initial build with Stripe integration.
- [x] Design logo & branding.
- [x] Collect all the documentation.
- [x] Create YouTube videos for new users/newbies to watch and understand the app better and to show in dashbaord.
- [x] Setup Promo Codes.
- [x] Turn on referrals.
- [ ] Optimize codebase.
- [ ] Fix SendWeeklyReports.
- [x] Migrate from Angular 8 to Angular 13. - Think about this, complete migration of other libraries too.
- [x] Migrate from Angular 8 to Angular 14. - Think about this, complete migration of other libraries too.
- [x] Look into resources for Premium users.
- [x] Display customer testimonials.
- [ ] Display team information.
- [ ] Setup FAQ's for users.
- [ ] Create cross platform applications / Launch apps.
- [ ] Replace dropdowon for surplus/deficit selection with slider.
- [x] Fix Promo Code edited and cancelled doesn't revert back.
- [x] Add Guest User.
- [x] Add Firebase Messaging for push notifications.
- [x] Fix local notifications not working on Android 12.
- [ ] Work on iOS app.
- [ ] Use Google Ads to promote application.
- [ ] Check how Firebase Messaging works on iOS.
- [ ] Check how Firebase Messaging is working via analytics.
- [ ] Once things have stabilized & development/maintenance isn't primary focus, look into migrating to Capacitor again.
- [ ] Look into various performance optimizations and enhancements to make app faster, either programmatically or manually.
- [ ] Fix test cases as development continues.
- [ ] Get in touch with fitness influencers to promote app to their crowds in exchange for Gold Account.
- [x] Add a new method of onboarding for new users.

## Design Specs

  * Font: 
  ```
  Raleway
  Roboto
  ```
  * Colors: 
  - ![#1D2671](https://via.placeholder.com/15/1D2671/1D2671.png) `#1D2671` - Gradient color
  - ![#C33764](https://via.placeholder.com/15/C33764/C33764.png) `#C33764` - Gradient color
  - ![#39bc9b](https://via.placeholder.com/15/39bc9b/39bc9b.png) `#39bc9b` - Mint theme
  - ![#35a186](https://via.placeholder.com/15/35a186/35a186.png) `#35a186` - Dark Mint theme
  - ![#d94555](https://via.placeholder.com/15/d94555/d94555.png) `#d94555` - Grapefruit theme
  - ![#b63c49](https://via.placeholder.com/15/b63c49/b63c49.png) `#b63c49` - Dark Grapefruit theme
  - ![#d96fad](https://via.placeholder.com/15/d96fad/d96fad.png) `#d96fad` - Pink Rose theme
  - ![#c05f98](https://via.placeholder.com/15/c05f98/c05f98.png) `#c05f98` - Dark Pink Rose theme
  - ![#ebc700](https://via.placeholder.com/15/ebc700/ebc700.png) `#ebc700` - Gold theme
  - ![#ab9b49](https://via.placeholder.com/15/ab9b49/ab9b49.png) `#ab9b49` - Dark Gold theme
  - ![#967bdc](https://via.placeholder.com/15/967bdc/967bdc.png) `#967bdc` - Lavender theme
  - ![#826ac0](https://via.placeholder.com/15/826ac0/826ac0.png) `#826ac0` - Dark Lavender theme
  - ![#4b89dc](https://via.placeholder.com/15/4b89dc/4b89dc.png) `#4b89dc` - Blue Jeans theme
  - ![#4178be](https://via.placeholder.com/15/4178be/4178be.png) `#4178be` - Dark Blue Jeans theme
  - ![#8ec148](https://via.placeholder.com/15/8ec148/8ec148.png) `#8ec148` - Grass theme
  - ![#79a33e](https://via.placeholder.com/15/79a33e/79a33e.png) `#79a33e` - Dark Grass theme
  
## Requirements for Development

 - [npm](https://www.npmjs.com/get-npm)
 - [Node.js](https://nodejs.org/en/download/)
 - [Git](https://git-scm.com/)

## Technology Stack

- [Angular](https://angular.io/)

## Getting Started

The following guide walks you through setup for the web application. Getting the project set up is simple and will only take a few minutes. The mobile setup is more complex and I have not included it here, but if I get enough requests then I will. Reach out to me if you would be interested in that. Last thing before we start is that this guide assumes you have an understanding of git. Check out the [git documentation](https://git-scm.com/doc) if you don't.

1. The first thing to do is clone the project.

```
    git clone https://github.com/LoneWolf36/SmartCoach.git
```

2. Next you'll need to [download and install node](https://nodejs.org/en/download/). Try to match the version the project is currently using (Node.js 12.22.5) (Updated to 16.16.0). To verify that you have successfully installed node, you can check the version from the command line. 

```
    node --version
```

3. The next step is to create a Firebase Project. Go to the [Firebase console](https://console.firebase.google.com/) and click on the `Add project` button.

4. Once your project is created, you will be redirected to that project's management console. You have some set up that needs to be taken care of. First, go to the `authentication` tab underneath build. You can see it on the sidenav on the left side of the window. Then click on the `Set up sign-in method` button. At a minimum, select the option called `Email/Password` and enable it.

5. Next is your database, go to the `Firestore Database` tab underneath build. You can see it on the sidenav on the left side of the window. Click on the `Create Database` button. 

6. Now that the database is created, we need to add the Users table. Click on start collection and create collections with the following names `Users`, `AutoGold`, `EmailFeedback`, `IAB`, `IAP`, `NutritionLogs`,`PromoCodes`, `Social`. It will force you to create a document within the collection but its okay to just use the auto-id button and delete the document after if you don't want the one junk document in your database. Depending on which parts of the codebase you choose to explore beyond this getting started guide, you may never touch some of these tables.

![db](readme-images/db-setup.png)

To set up the `Social` table, you will need to add a document called `social-dashboard` and add the following properties

```
    owners:[
                {
                    "id": "0000",
                    "displayName": "SmartCoach",
                    "themeColor": ""
                }
           ]
```

and

```
    socials:[
            {
                "type": "YOUTUBE",
                "title": "Choosing Your Activity Level",
                "data": "c5oCZGLU1cI",
                "ownerId": "0000"
            },
            {
                "type": "YOUTUBE",
                "title": "Tracking Weight",
                "data": "BfuEdTz2vPU",
                "ownerId": "0000"
            },
            {
                "type": "YOUTUBE",
                "title": "Tracking Calories",
                "data": "frdPVbVFE8M",
                "ownerId": "0000"
            },
            {
                "type": "YOUTUBE",
                "title": "What Are Macros?",
                "data": "E3lis9G8zoU",
                "ownerId": "0000"
            },
            {
                "type": "YOUTUBE",
                "title": "How To Split Macros?",
                "data": "OYg2m4X25Eg",
                "ownerId": "0000"
            },
            {
                "type": "YOUTUBE",
                "title": "What Is TDEE?",
                "data": "Um6wKFfHC-0",
                "ownerId": "0000"
            },
            {
                "type": "YOUTUBE",
                "title": "How To Use SmartCoach™?",
                "data": "8zPQYweWwYA",
                "ownerId": "0000"
            },
            {
                "type": "YOUTUBE",
                "title": "What is SmartCoach™?",
                "data": "8zPQYweWwYA",
                "ownerId": "0000"
            }
]
```

7. Go back to the Project Overview by clicking on the house icon above the Build section on the sidenav. You have to add an app to the project to generate client secrets. Choose the web option. During this process you'll be given a Firebase Config object in JSON format. Save this as we will need it again later. It should look something like below.

```
    const firebaseConfig = {
        apiKey: "AIzaSyDBbnHVqVN2in-MijyPlLFRysTEtRfzxUY",
        authDomain: "ai-tdee-calculator.firebaseapp.com",
        projectId: "ai-tdee-calculator",
        storageBucket: "ai-tdee-calculator.appspot.com",
        messagingSenderId: "127517490464",
        appId: "1:127517490464:web:5a01937dee30af5b666b45",
        measurementId: "G-SDEJDS5VH3",
    };
```

8. Go back to the project you cloned in Step 1. Navigate to the app/web/src directory and create a subdirectroy called environments. In the environments subdirectory create a file called environment.ts. In this file create an object named environment that is exported. The object should have a key called `production` which is either true or false and one called `firebase`. The value of the firebase key in the environment object should be the contents of the firebase config object from step 7.

```
    cd SmartCoach/app/web/src
    mkdir environments
    cd environments
    touch environment.ts
```

So inside environment.ts you would have
    
```
    export const environment = {
    production: false,
    firebase: {
        apiKey: "AIzaSyDBbnHVqVN2in-MijyPlLFRysTEtRfzxUY",
        authDomain: "ai-tdee-calculator.firebaseapp.com",
        projectId: "ai-tdee-calculator",
        storageBucket: "ai-tdee-calculator.appspot.com",
        messagingSenderId: "127517490464",
        appId: "1:127517490464:web:5a01937dee30af5b666b45",
        measurementId: "G-SDEJDS5VH3",
        },
    };
```


9. Now install the projects frontend dependencies using NPM

```
    npm ci
```

10. Verify that the frontend unit tests work and show 100% testing coverage using the command below. The output from karma will show you the coverage in your terminal. You should also see a coverage directory that was generated inside the app directory. It contains an istanbul report with more information. If you open the index.html file inside the coverage directory in a browser you can see exactly which files are covered.

```
    npm run testWithCoverage
```

11. Verify that the frontend documentation works and show 100% coverage using the command below. You should see a documentation directory that was generated inside the app directory. If you open the index.html file inside the documentation directory in a browser you can access the projects documentation.

```
    npm run doc
```

12. Now that the frontend is good to go, you need to set up the firebase cloud functions for the project. This is most easily done using the firebase-cli. If you haven't already, install the cli which is part of the [firebase-tools package](https://www.npmjs.com/package/firebase-tools). Using the CLI, you will have to login, choose to use the project, then initialize cloud functions. When prompted, be sure to choose TypeScript as the functions language and be absolutely sure not to overwrite any existing files when it asks you. That will definitely break things if you start overwriting those files. If you aren't sure what your Project ID is, you can run the command `firebase projects:list` to see all your projects and find the one with the correct ID.

```
    cd SmartCoach/app/web/functions
    npm install -g firebase-tools
    firebase login
    firebase projects:list
    firebase use YOUR_PROJECT_ID
    firebase init functions
```

13.  Now install the projects cloud function dependencies using NPM

```
    npm ci
```

14.  For the cloud functions to work, they need to be deployed. Run the following command in the functions directory. It might take a minute, but your cloud functions will be ready to go.

```
    firebase deploy --only functions
```

15. Verify that the backend unit tests work and show 100% testing coverage using the command below. We had to use a different testing framework than the frontend because cloud functions don't like karma/jasmine :(

```
    npm run test
```

16. At this point the project should be all set up for local development. Navigate to the frontend portion of the project (i.e. the app directory) and use the npm start command to run the project locally. Once the build finishes you can access the project on [localhost:4200](http://localhost:4200/)

![Great Success](readme-images/setup.png)

17. DISCLAIMER - This isn't a step thats necessary, but it is worth mentioning. For some reason, cloud functions won't always work the first time they are deployed and will make it look like there are cors errors. If you run into that issue, then you will need to go into the GCP project for your firebase project and assign the allUsers service account a role of Cloud Functions Invoker. A better explanation can be found [here](https://github.com/firebase/functions-samples/issues/395#issuecomment-605025572).

## License

[GNU General Public License v3.0](LICENSE)
