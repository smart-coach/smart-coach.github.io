import { Injectable } from '@angular/core';
import { ShepherdService } from 'angular-shepherd';
import { ConfettiService } from './confetti.service';
import { EnvironmentService } from './environment.service';

/**
 * This service is used for onboarding to give the user a tour of the application.
 * It's invoked in app.component.ts when the user first opens the application.
 * It can be skipped by the user if they want. It can also be completed by the user.
 * If completed, the user will not be shown the tour again unless they invoke
 * the tour again, similar to earlier setup where the user was shown tips
 * and user can invoke the tips again if they want.
 */

@Injectable({
    providedIn: 'root'
})
export class AppTourService {

    /**
     * The default options used for each step of the tour.
     */
    defaultStepOptions: any =
        {
            scrollTo: { behavior: 'smooth', block: 'center' },
            cancelIcon: {
                enabled: true
            },
            canClickTarget: true,
            keyboardNavigation: false,
            popperOptions: {
                modifiers: [
                    {
                        name: "offset",
                        options: {
                            offset: [0, 25]
                        }
                    }
                ]
            },
            modalOverlayOpeningPadding: 10,
            modalOverlayOpeningRadius: 10,
            when: {
                cancel: () => this.onStepCancel,
                complete: () => this.onStepComplete,
                // We need to pass document here
                show: (document) => this.onStepShow()
            }
        };

    constructor(public shepherdService: ShepherdService, public confettiService: ConfettiService, public environmentService: EnvironmentService) { }

    /**
     * Check if the tour is active
     */
    activeTourInProgress(): boolean {
        return this.shepherdService.isActive;
    }

    // Helper function to replace [ and ] with span with class thick in all the steps of the tour.
    emphasizeImportantWordsInTourSteps(): void {
        this.shepherdService.tourObject.steps.forEach(step => {
            step.options.text = step.options.text.toString().replace(/\[/g, "<span class='thick'>");
            step.options.text = step.options.text.toString().replace(/\]/g, "</span>");
        }
        );
    }

    // This is the function that is called when the user clicks the cancel button or exits the tour.
    onStepCancel(): void {
        this.shepherdService.cancel();
        this.shepherdService.onTourFinish('cancel');
    }

    // This is the function that is called when the user successfully completes the tour.
    onStepComplete(): void {
        this.shepherdService.complete();
        this.shepherdService.onTourFinish('complete');
    }

    // This step is used to divide the step with 3 images into 2 parts as it wasn't possible to do it with the step on a mobile because of scroll issue.
    getMessageAccordingToUserAgent(): string {
        {
            if (this.environmentService.isMobile) {
                return `Each log serves a [particular purpose] and should be [discarded] at the end of [each Nutrition Cycle (e.g. one log for cutting, one log for bulking, etc.),] more information about this is available in the ['Periodization for nutrition'] resource. </br></br> (Awwh yiss!, we've got a [lot] of great [Evidence-Based resources] for you to visit and read in the [Resources Section!]) </br></br> Using SmartCoach™ you can </br></br> [◈&nbsp; Lose Fat] <img src="../../assets/onboardingResources/fat-loss.png" alt="A picture of a woman who lost weight"> Click ['Next'] to continue.`
            }
            else {
                return `Each log serves a [particular purpose] and should be [discarded] at the end of [each Nutrition Cycle (e.g. one log for cutting, one log for bulking, etc.),] more information about this is available in the ['Periodization for nutrition'] resource. </br></br> (Awwh yiss!, we've got a [lot] of great [Evidence-Based resources] for you to visit and read in the [Resources Section!]) </br></br> Using SmartCoach™ you can </br></br> [◈&nbsp; Lose Fat <img src="../../assets/onboardingResources/fat-loss.png" alt="A picture of a woman who lost weight"> ◈&nbsp; Gain Muscle, or <img src="../../assets/onboardingResources/muscle-gain.png" alt="A picture of two people working out"> </br></br> ◈&nbsp; Maintain Your Weight] <img src="../../assets/onboardingResources/maintain-weight.png" alt="A picture of a woman"> </br></br> Click ['Next'] to select [your] goal.`
            }
        }
    }

    // This is the function that's called each time a step in the tour shows
    onStepShow(): void {
        const tourObject = this.shepherdService.tourObject;
        const currentStepElement = tourObject.getCurrentStep().getElement();
        const header = currentStepElement.querySelector('.shepherd-footer');
        //create progress holder
        const progress = document.createElement('div');
        //create the progress bar
        const innerBar = document.createElement('span');
        //calculate the progress in percentages
        const progressPercentage = ((tourObject.steps.indexOf(tourObject.getCurrentStep()) + 1) / tourObject.steps.length) * 100 + '%';
        //add class to the progress holder
        progress.className = 'shepherd-progress-bar';
        //add the width dynamically
        innerBar.style.width = progressPercentage;
        //If is one button, expand progress holder, if there are no buttons don't attach
        if (tourObject.getCurrentStep().options.buttons != null && tourObject.getCurrentStep().options.buttons.length == 1) {
            progress.style.minWidth = '285px';
        }
        if (tourObject.getCurrentStep().options.buttons != null) {
            progress.appendChild(innerBar);
            header.insertBefore(progress, currentStepElement.querySelector('.shepherd-button'));
        }
    }

    // We use startTour to start the tour from app.component.ts. It contains all the steps of the application.
    startTour() {
        const context = this;
        if (!this.activeTourInProgress()) {
            this.shepherdService.modal = true;
            this.shepherdService.confirmCancel = true;
            this.shepherdService.confirmCancelMessage = `Are you SURE you want to SKIP the tour? It'll be fun, I PROMISE! I put a LOT of effort into making it, and this'll be the FIRST and LAST TIME it's shown!`;
            this.shepherdService.defaultStepOptions = this.defaultStepOptions;
            this.shepherdService.addSteps([
                /**
                 * Step Zero - Introduction to SmartCoach™
                 * This is the first step of the tour. It introduces the user to the application.
                 * The user can skip the tour if they want or continue.
                 */
                {
                    id: 'stepZero',
                    title: 'Welcome to SmartCoach™',
                    text: `Helping [YOU] achieve [YOUR goals] is [OUR goal.] </br></br> Let us walk you through how SmartCoach™ works and answer these questions. </br></br> ◈&nbsp; [What is the purpose of this app?] </br></br> ◈&nbsp; [What makes SmartCoach™ unique?] </br></br> ◈&nbsp; [What am I supposed to do next?] </br></br> Follow this tutorial to discover all the answers! </br></br> [PS. A surprise awaits you at every milestone.]`,
                    buttons: [
                        {
                            action() {
                                return context.onStepCancel();
                            },
                            classes: 'shepherd-button-secondary',
                            text: 'Skip'
                        },
                        {
                            action() {
                                return this.next();
                            },
                            text: 'Next'
                        }
                    ]
                },
                /**
                 * Step One - Relating to someone
                 * This step gives the example of Rose from Titanic, talking about how she'd use SmartCoach™.
                 * So that users find it engaging and interesting.
                 * The user can go back to the previous step or go next.
                 */
                {
                    id: 'stepOne',
                    title: 'Let\'s relate to someone!',
                    text: `<img src="../../assets/onboardingResources/confused-woman.png" alt="A picture of a confused woman"> It has been a [struggle] for Rose to lose fat. She has tried [Intermittent Fasting, Keto, Low Carb, and everything in between, but she still struggles with weight loss.]</br></br> There are just [3 months] left until she boards the Titanic, so she wants to look her best before she catches the ship. </br></br> <img src="../../assets/onboardingResources/rose-fat-to-fit.png" alt="Woman physique transformation"> Let's see [how] SmartCoach™ can [help] her.`,
                    buttons: [
                        {
                            action() {
                                return this.back();
                            },
                            classes: 'shepherd-button-secondary',
                            text: 'Back'
                        },
                        {
                            action() {
                                return this.next();
                            },
                            text: 'Next'
                        }
                    ],
                },
                /**
                 * Step Two - Clicking on 'Set Main Nutrition Log' button and waiting for the modal to open.
                 * Introducing the user to the 'Set Main Nutrition Log' button and what is a main log.
                 * The user can go back to the previous step or go next if they click 'Set Main Nutrition Log' button.
                 */
                {
                    id: 'stepTwo',
                    title: `Step One: Create a log`,
                    text: `In your main log, you will keep track of your ['daily calorie intake'] and ['weight'.] Click ['Set Main Nutrition Log'] to create a main log.`,
                    attachTo: {
                        element: '#shepherdStepTwo',
                        on: 'bottom'
                    },
                    advanceOn: { selector: '#shepherdStepTwo', event: 'click' },
                    buttons: [
                        {
                            action() {
                                return this.back();
                            },
                            classes: 'shepherd-button-secondary',
                            text: 'Back'
                        }
                    ],
                },
                /**
                 * Step Three - Waiting for the modal to open which has 'Create New', 'Use Existing' (if they've relaunhed the 
                 * tutorial) and close button. We highlight the Create New button and the user can click on it to create a new log.
                 * The user can't go back to the previous step, but they can go next if they click 'Create New' button. 
                 */
                {
                    id: 'stepThree',
                    title: `Let's create YOUR FIRST log!`,
                    text: `The first thing that you will see on the dashboard whenever you log-in is your main log. Cick ['CREATE NEW'] to create a new log.`,
                    attachTo: {
                        element: '#shepherdStepThree',
                        on: 'auto'
                    },
                    advanceOn: { selector: '#shepherdStepThree', event: 'click' },
                    beforeShowPromise: () => {
                        return new Promise(function (resolve) {
                            setInterval(function () {
                                if (document.getElementById('shepherdStepThree') != null) {
                                    resolve(true);
                                }
                            }, 500);
                        });
                    },
                },
                /**
                 * Step Four - Directing user to title input field.
                 * The user can't go back to the previous step, but they can go next.
                 */
                {
                    id: 'stepFour',
                    title: `Enter a TITLE for your log!`,
                    text: `Don't be afraid to make it [fun, meaningful, and personal!] It can always be edited later.`,
                    attachTo: {
                        element: '#shepherdStepFour',
                        on: 'top'
                    },
                    buttons: [
                        {
                            action() {
                                return this.next();
                            },
                            text: 'Next'
                        }
                    ],
                    beforeShowPromise: () => {
                        return new Promise(function (resolve) {
                            setInterval(function () {
                                if (document.getElementById('shepherdStepFour') != null) {
                                    resolve(true);
                                }
                            }, 500);
                        });
                    },
                },
                /**
                 * Step Four And Half - This is an intermediary step between step four and five, to inform the
                 * user about the different kinds of goals.
                 * The user can go back to the previous step, but they can go next. 
                 */
                {
                    id: 'shepherdStepFourAndHalf',
                    title: `Let's talk about goals!`,
                    text: (this.getMessageAccordingToUserAgent()),
                    buttons: [
                        {
                            action() {
                                return this.back();
                            },
                            classes: 'shepherd-button-secondary',
                            text: 'Back'
                        },
                        {
                            action() {
                                if (context.environmentService.isMobile) {
                                    return this.next();
                                }
                                else {
                                    return this.show('stepFive');
                                }
                            },
                            text: 'Next'
                        }]
                },
                /**
                 * Step Four And Three Quarter - This is an intermediary step between step four and five, to inform the
                 * user about the different kinds of goals. Having one huge step wasn't a good idea for mobile, so we split it into two
                 * steps as it was causing scroll issues on android
                 * The user can go back to the previous step, but they can go next. 
                 */
                {
                    id: 'shepherdStepFourAndThreeQuarter',
                    title: `...and more about goals!`,
                    text: `[◈&nbsp; Gain Muscle, or <img src="../../assets/onboardingResources/muscle-gain.png" alt="A picture of two people working out"> </br></br> ◈&nbsp; Maintain Your Weight] <img src="../../assets/onboardingResources/maintain-weight.png" alt="A picture of a woman"> </br></br> Click ['Next'] to select [your] goal.`,
                    buttons: [
                        {
                            action() {
                                return this.back();
                            },
                            classes: 'shepherd-button-secondary',
                            text: 'Back'
                        },
                        {
                            action() {
                                return this.next();
                            },
                            text: 'Next'
                        }]
                },
                /**
                 * Step Five - Directing user to Goal Dropdown.
                 * The user can go back to the previous step and they can go next if they open doropdown to select goal.
                 */
                {
                    id: 'stepFive',
                    title: `Select a GOAL for your log!`,
                    text: `Each log has a [goal.] </br></br> When a log is created, it has a goal that [cannot be changed later.] </br></br> Pick something that's [right for you.]`,
                    attachTo: {
                        element: '#shepherdStepFive',
                        on: 'auto'
                    },
                    advanceOn: { selector: '#shepherdStepFive', event: 'click' },
                    buttons: [
                        {
                            action() {
                                if (context.environmentService.isMobile) {
                                    return this.back();
                                }
                                else {
                                    return this.show('shepherdStepFourAndHalf');
                                }
                            },
                            classes: 'shepherd-button-secondary',
                            text: 'Back'
                        }
                    ]
                },
                /**
                 * Step Six - User can pick one of the three goals from the dropdown.
                 * The user can go back to the previous step and they can go next if they select a goal.
                 */
                {
                    id: 'stepSix',
                    title: `What's your CURRENT goal?`,
                    text: `If you're looking for; </br></br> [◈&nbsp; Fat Loss </br></br> ◈&nbsp; Muscle Gain, or </br></br> ◈&nbsp; Maintain Weight] </br></br> We've got you covered! </br></br> Pssstt, Rose is picking [Fat Loss.] </br></br> You should pick something that's [relevant to you!]`,
                    attachTo: {
                        element: '#shepherdStepSix',
                        on: 'auto'
                    },
                    advanceOn: { selector: '#shepherdStepSix', event: 'click' },
                    buttons: [
                        {
                            action() {
                                return this.back();
                            },
                            classes: 'shepherd-button-secondary',
                            text: 'Back'
                        }
                    ],
                    beforeShowPromise: () => {
                        return new Promise(function (resolve) {
                            setInterval(function () {
                                if (document.getElementById('shepherdStepSix') != null) {
                                    resolve(true);
                                }
                            }, 500);
                        });
                    },
                },
                /**
                 * Step Seven - User can press confirm button only if they've selected a goal and filled the title field.
                 * If they try to go back we lead them to the the step before the dropdown, otherwise we lead them to the next step
                 * if they press confirm. Next step is to show them confetti before proceeding ahead.
                 */
                {
                    id: 'stepSeven',
                    title: `All set?`,
                    text: `Press ['CONFIRM'] to finish creating your log.`,
                    attachTo: {
                        element: '#shepherdStepSeven',
                        on: 'auto'
                    },
                    advanceOn: { selector: '#shepherdStepSeven', event: 'click' },
                    buttons: [
                        {
                            action() {
                                return this.show('stepFive');
                            },
                            classes: 'shepherd-button-secondary',
                            text: 'Back'
                        }
                    ],
                },
                /**
                 * Step Eight - We show the user a confetti animation before proceeding to the next step and 
                 * joke abour Rose completing creating a log too.
                 */
                {
                    id: 'stepEight',
                    title: `Congratulations on creating a log!`,
                    text: `As you were creating your log, Rose also created one called [Paint Me Like One Of The French Girls.] </br></br> No wonder Jack fell for her! </br></br> [She was using SmartCoach™ to work on her bomb physique.] <img src="../../assets/onboardingResources/rose-created-log.png" alt="A picture of a woman holding her phone"> </br></br> Alright now, where do we head next? </br></br> Press ['Next'] to find out.`,
                    buttons: [
                        {
                            action() {
                                context.confettiService.shouldThrowParty = false;
                                return this.next();
                            },
                            text: 'Next'
                        }
                    ],
                    beforeShowPromise: () => {
                        return new Promise(function (resolve) {
                            setTimeout(() => {
                                context.confettiService.shouldThrowParty = true;
                                resolve(true);
                            }, 1500);
                        });
                    },
                },
                /**
                 * Step Nine - We welcome the user to the dashboard and navigate them to In Depth Logs
                 * to explain about various columns and rows. The user can go back and clicking 'Open' leads them to In Depth Logs
                 */
                {
                    id: 'stepNine',
                    title: `Welcome to your Dashboard!`,
                    text: `Phew! I really enjoyed teaching you the [importance of a log!] </br></br> However, my journey [does not] end here! </br></br> Let's embark on a [new adventure!] <img src="../../assets/onboardingResources/let-me-be-your-guide.png" alt="A picture of a man helping another man"> Click ['Open'] to learn more about your current [log.]`,
                    attachTo: {
                        element: '#shepherdStepNine',
                        on: 'auto'
                    },
                    advanceOn: { selector: '#shepherdStepNine', event: 'click' },
                    buttons: [
                        {
                            action() {
                                return this.back();
                            },
                            classes: 'shepherd-button-secondary',
                            text: 'Back'
                        }
                    ],
                    beforeShowPromise: () => {
                        return new Promise(function (resolve) {
                            setInterval(function () {
                                if (document.getElementById('shepherdStepNine') != null) {
                                    resolve(true);
                                }
                            }, 500);
                        });
                    },
                },
                /**
                 * Step Ten - Explains eveyrhing about in-depth logs and how to interpret them.
                 * The user can't go back and next step leads them to different columns and rows.
                 */
                {
                    id: 'stepTen',
                    title: `Step Two: View In-Depth Logs`,
                    text: `It may seem complicated at first, but it's [actually quite simple.] </br></br> Here is an [in-depth look] at your log. </br></br> It provides [valuable information] about [how you are progressing,] and shows you what [steps you need to take next.] </br></br> So that you can [keep progressing without stalling or falling behind.]`,
                    attachTo: {
                        element: '#shepherdStepTen',
                        on: 'auto'
                    },
                    buttons: [
                        {
                            action() {
                                return this.next();
                            },
                            text: 'Next'
                        }
                    ],
                    beforeShowPromise: () => {
                        return new Promise(function (resolve) {
                            setInterval(function () {
                                if (document.getElementById('shepherdStepTen') != null) {
                                    resolve(true);
                                }
                            }, 1500);
                        });
                    },
                },
                /**
                 * Step Eleven - Isolates the columns and explains each one to the user.
                 * The user can go back and next step leads them to different columns and rows.
                 */
                {
                    id: 'stepEleven',
                    title: `Let's see all the different variables!`,
                    text: `These are all of the variables that are [important] to you in your journey. <img src="../../assets/onboardingResources/variables.png" alt="A picture showing different variables">`,
                    attachTo: {
                        element: '#shepherdStepEleven',
                        on: 'auto'
                    },
                    buttons: [
                        {
                            action() {
                                return this.back();
                            },
                            classes: 'shepherd-button-secondary',
                            text: 'Back'
                        },
                        {
                            action() {
                                return this.next();
                            },
                            text: 'Next'
                        }
                    ]
                },
                /**
                 * Step Twelve - Takls about the starting weight and current weight.
                 * The user can go back and next step leads them to different columns and rows.
                 */
                {
                    id: 'stepTwelve',
                    title: `Starting Weight and Current Weight`,
                    text: `You should note that [log statistics] display [rolling averages for start and current weight.] </br></br> Based on the [first 7] and [latest 7 entries,] respectively. </br></br> Because, a [few entries are more accurate than one] and this practice [minimizes the impact of outliers.] <img src="../../assets/onboardingResources/rolling-average.png" alt="A bar chart">`,
                    attachTo: {
                        element: '#shepherdStepTwelve',
                        on: 'auto'
                    },
                    buttons: [
                        {
                            action() {
                                return this.back();
                            },
                            classes: 'shepherd-button-secondary',
                            text: 'Back'
                        },
                        {
                            action() {
                                return this.next();
                            },
                            text: 'Next'
                        }
                    ]
                },
                /**
                 * Step Thirteen - Talks about first and last entry.
                 * The user can go back and next step leads them to different columns and rows.
                 */
                {
                    id: 'stepThirteen',
                    title: `When did I begin and where am I now?`,
                    text: `The [First] and [Last Entries] are simply [dates] that [indicate] when you began and where you are currently in your journey. <img src="../../assets/onboardingResources/start-date-current-date.png" alt="Two map markers showing dates apart">`,
                    attachTo: {
                        element: '#shepherdStepThirteen',
                        on: 'auto'
                    },
                    buttons: [
                        {
                            action() {
                                return this.back();
                            },
                            classes: 'shepherd-button-secondary',
                            text: 'Back'
                        },
                        {
                            action() {
                                return this.next();
                            },
                            text: 'Next'
                        }
                    ]
                },
                /**
                 * Step Fourteen - Talks about TDEE and log length
                 * The user can go back and next step leads them to different columns and rows.
                 */
                {
                    id: 'stepFourteen',
                    title: `TDEE and Log Length`,
                    text: `You probably entered your [demographic information] when you registered. </br></br> If not, you can do so [anytime] in the [Profile Section] (we [recommend] you do it [before] creating a log). </br></br> Otherwise, our algorithm will take [14-days] to calculate your TDEE and Goal Intake. </br></br> TDEE is the [number of calories you need to eat in a day to maintain your weight.] It's something that [changes] on a [daily basis.] <img src="../../assets/onboardingResources/tdee.png" alt="A man burning calories">`,
                    attachTo: {
                        element: '#shepherdStepFourteen',
                        on: 'auto'
                    },
                    buttons: [
                        {
                            action() {
                                return this.back();
                            },
                            classes: 'shepherd-button-secondary',
                            text: 'Back'
                        },
                        {
                            action() {
                                return this.next();
                            },
                            text: 'Next'
                        }
                    ]
                },
                /**
                 * Step Fifteen - Talks about log goal
                 * The user can go back and next step leads them to different columns and rows.
                 */
                {
                    id: 'stepFifteen',
                    title: `Log Goal`,
                    text: `This is the [goal] of the log you created! <img src="../../assets/onboardingResources/goal.png" alt="A goal">`,
                    attachTo: {
                        element: '#shepherdStepFifteen',
                        on: 'auto'
                    },
                    buttons: [
                        {
                            action() {
                                return this.back();
                            },
                            classes: 'shepherd-button-secondary',
                            text: 'Back'
                        },
                        {
                            action() {
                                return this.next();
                            },
                            text: 'Next'
                        }
                    ]
                },
                /**
                 * Step Sixteen - Talks about rate of gain and loss
                 * The user can go back and next step leads them to different columns and rows.
                 */
                {
                    id: 'stepSixteen',
                    title: `Rate of Gain/Loss`,
                    text: `As you're using SmartCoach's suggestions, the data in this row lets you know [how fast or slow you're progressing] and [whether it's optimal for you]. <img src="../../assets/onboardingResources/rate-of-gain.png" alt="A bar chart showing gain"> <img src="../../assets/onboardingResources/rate-of-loss.png" alt="A bar chart showing loss">`,
                    attachTo: {
                        element: '#shepherdStepSixteen',
                        on: 'auto'
                    },
                    buttons: [
                        {
                            action() {
                                return this.back();
                            },
                            classes: 'shepherd-button-secondary',
                            text: 'Back'
                        },
                        {
                            action() {
                                return this.next();
                            },
                            text: 'Next'
                        }
                    ]
                },
                /**
                 * Step Seventeen - Talks about goal intake
                 * The user can go back and next step leads them to different columns and rows.
                 */
                {
                    id: 'stepSeventeen',
                    title: `Alright! Tell me what to do now!`,
                    text: `Perfect! Your data in this row [fluctuates as you progress,] showing you the [optimal range of calories you should be consuming to reach your goal.] <img src="../../assets/onboardingResources/goal-intake.png" alt="A plate with food">`,
                    attachTo: {
                        element: '#shepherdStepSeventeen',
                        on: 'auto'
                    },
                    buttons: [
                        {
                            action() {
                                return this.back();
                            },
                            classes: 'shepherd-button-secondary',
                            text: 'Back'
                        },
                        {
                            action() {
                                return this.next();
                            },
                            text: 'Next'
                        }
                    ]
                },
                /**
                 * Step Eighteen - Talks about the graph to the user and how to interpret it
                 * The user can go back and next step leads them to making an entry.
                 */
                {
                    id: 'stepEighteen',
                    title: `Visualize Your Progress`,
                    text: `With SmartCoach™, you can [visualize your progress using a unique graph.</br></br> Explore] your data and see [how you're progressing over time] by [zooming in, zooming out, clicking, and panning.] </br></br> Isn't that awesome?`,
                    attachTo: {
                        element: '#shepherdStepEighteen',
                        on: 'auto'
                    },
                    buttons: [
                        {
                            action() {
                                return this.back();
                            },
                            classes: 'shepherd-button-secondary',
                            text: 'Back'
                        },
                        {
                            action() {
                                return this.next();
                            },
                            text: 'Next'
                        }
                    ]
                },
                /**
                 * Step Nineteen - Talks about the add button to log weight and calories
                 * The user can go back and next step leads them to inputting data.
                 */
                {
                    id: 'stepNineteen',
                    title: `Now let's make an entry!`,
                    text: `There are only [TWO things] that SmartCoach™ requires from you [regularly]. </br></br> [◈&nbsp; Weighing yourself and </br></br> ◈&nbsp; Counting how many calories you've consumed.] </br></br> [You can add] these to your log by clicking the ['ADD'] button.`,
                    attachTo: {
                        element: '#shepherdStepNineteen',
                        on: 'auto'
                    },
                    advanceOn: { selector: '#shepherdStepNineteen', event: 'click' },
                    buttons: [
                        {
                            action() {
                                return this.back();
                            },
                            classes: 'shepherd-button-secondary',
                            text: 'Back'
                        }
                    ],
                },
                /**
                 * Step Twenty - Helps the user make an entry by adding weight and calories.
                 * The user can go back and next step leads them to confirm button.
                 */
                {
                    id: 'stepTwenty',
                    title: `Add weight and calories`,
                    text: `For now, let's [add some data.] You can always [edit or delete it later.]`,
                    attachTo: {
                        element: '#shepherdStepTwenty',
                        on: 'top'
                    },
                    buttons: [
                        {
                            action() {
                                return this.next();
                            },
                            text: 'Next'
                        }
                    ],
                    beforeShowPromise: () => {
                        return new Promise(function (resolve) {
                            setInterval(function () {
                                if (document.getElementById('shepherdStepTwenty') != null) {
                                    resolve(true);
                                }
                            }, 500);
                        });
                    },
                },
                /**
                 * Step Twenty One - Helps the user make an entry by adding weight and calories.
                 * The user can go back and next step them congratulates them!
                 */
                {
                    id: 'stepTwentyOne',
                    title: `Let's finish this tutorial!`,
                    text: `Click the ['CONFIRM'] to [save your entry.]`,
                    attachTo: {
                        element: '#shepherdStepTwentyOne',
                        on: 'auto'
                    },
                    advanceOn: { selector: '#shepherdStepTwentyOne', event: 'click' },
                    buttons: [
                        {
                            action() {
                                return this.back();
                            },
                            classes: 'shepherd-button-secondary',
                            text: 'Back'
                        }
                    ]
                },
                /**
                 * Step Twenty Two - We show the user a confetti animation before proceeding to the next step.
                 */
                {
                    id: 'stepTwentyTwo',
                    title: `Congratulations! You're a Pro now!`,
                    text: `So far, you have done a [fantastic job!] </br></br> Take a moment to [congratulate yourself!] </br></br> You're [nearly finished] with this tutorial! </br></br> As you were learning about the [various features] SmartCoach™ has to offer, Rose had already [begun] her journey because she was [motivated by her favorite quote,] which went like; </br></br> [“Consistency is the key! If you can’t be consistent, then you can’t be anything.” - Tony Gaskins] <img src="../../assets/onboardingResources/man-happy.png" alt="A  happy man">`,
                    buttons: [
                        {
                            action() {
                                context.confettiService.shouldThrowParty = false;
                                return this.next();
                            },
                            text: 'Next'
                        }
                    ],
                    beforeShowPromise: () => {
                        return new Promise(function (resolve) {
                            setTimeout(() => {
                                context.confettiService.shouldThrowParty = true;
                                resolve(true);
                            }, 2000);
                        });
                    },
                },
                /**
                 * Step Twenty Three - Invite the user to go premium
                 */
                {
                    id: 'stepTwentyThree',
                    title: `Why should I upgrade?`,
                    text: `◈&nbsp; Currently, you can only have [one log with limited entries], which allows you to [see how the application works.] </br></br> ◈&nbsp; You'll need a [Premium Account] in order to [take advantage] of Smartcoach's [full potential.] </br></br> ◈&nbsp; Premium users are allowed to create [upto 75 logs with 365 entries per log] (Phew! You'll never run out of space!). </br></br> ◈&nbsp; [Additionally], you will have [access to Exclusive Evidence-Based Resources.] </br></br> ◈&nbsp; On the Profile Section, click ['GO PREMIUM'] to [upgrade]. <img style="border-radius: 70px" class="dreamyShadows" src="../../assets/icon.png" alt="SmartCoach Logo">`,
                    buttons: [
                        {
                            action() {
                                return context.onStepComplete();
                            },
                            text: 'Done!'
                        }
                    ],
                },
            ]);
            this.emphasizeImportantWordsInTourSteps();
            this.shepherdService.start();
        }
    }
}