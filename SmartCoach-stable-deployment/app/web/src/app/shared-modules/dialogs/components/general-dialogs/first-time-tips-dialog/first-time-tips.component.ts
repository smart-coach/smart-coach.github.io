import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

/**
 * This dialog is opened the first time that an individual user opens the 
 * appliation. It is used to instuct them on the basics of using SmartCoach
 * as a way to eliminate confusion and answer common questions that we get.
 * 
 * Last edited by: Faizan Khan 12/23/2020
 */
@Component({
  selector: 'app-first-time-tips',
  templateUrl: './first-time-tips.component.html',
  styleUrls: ['./first-time-tips.component.css']
})
export class FirstTimeTipsComponent implements OnInit {

  /**
   * Holds the value of the current instruction stage.
   */
  currentInstructionStage: number = 0;

  /**
   * Contains the content of the individual instruction stages.
   */
  instructionStages: any[] = [
    {
      title: "SmartCoach™",
      subtitle: "Things you NEED to know before getting started",
      message: "Do you need help getting started with SmartCoach™ ?Helping you achieve your goals is our goal.Let us walk you through how it works."
    },
    {
      title: "TDEE",
      subtitle: "What is TDEE?",
      message: "You probably entered your [demographic information] when you registered.If not, you can do so [anytime] on the Profile page [(we recommend you do it before creating a log)].Otherwise, our algorithm will take [14-days] to calculate a goal intake.The TDEE, or the [number of calories you need to maintain your weight], is predicted using Machine Learning.If you know your TDEE, you can enter it manually on the Profile page."
    },
    {
      title: "Main Log",
      subtitle: "How do I log my data?",
      message: "The dashboard is displayed whenever you log in.You'll find your main log here.In your main log, you will keep track of your [daily calorie intake and weight].On the dashboard, click ['Set Main Log' to create a main log] if not already done."
    },
    {
      title: "Log Goal",
      subtitle: "Choosing your fitness journey",
      message: "Each log has a [goal].You can gain muscle, lose fat, or maintain your weight.When a log is created, it has a goal that [cannot be changed later].For more information on your first log's goal, check out the Resources section and read ['Should I Bulk or Cut'].Using your [log goal] and [estimated TDEE,] the algorithm will calculate your [personalized goal calorie intake range]."
    },
    {
      title: "Weighing Yourself",
      subtitle: "Best practices",
      message: "Weigh yourself every day at a [consistent time].Our recommendation is [after you wake up, on an empty stomach].You should also note that [log statistics] display [rolling averages for start and current weight].Based on the [first 7] and [latest 7 entries], respectively. Because, a [few entries are more accurate than one] and this practice [minimizes the impact of outliers]."
    },
    {
      title: "Tracking Calories",
      subtitle: "How to do it right?",
      message: "Tracking calories correctly [requires a food scale].Most people will also be using a [calorie tracking app,] then [log their calories] next morning [along with their body weight]."
    },
    {
      title: "Algorithm Feedback",
      subtitle: "How long does it take for the algorithm to learn?",
      message: "The algorithm provides [feedback] on calorie intake and body weight, as well as [updates] your [goal calorie intake range] whenever you log a [complete entry].[After 14-days of complete data] are logged, the algorithm [provides feedback] or [makes adjustments].A [complete entry] includes both [calories consumed] and [body weight].A [14-day] wait allows the algorithm to learn before providing feedback, and [14-days is considered a gold standard for finding maintenance calories]."
    },
    {
      title: "Changing Main Log",
      subtitle: "How do I change my main log?",
      message: "The main logs should be [switched each time] you enter a [new nutritional phase,] so if you bulk for a few months, cut for a month, then bulk again, you would have a [log for the first bulk,] a [log for your cutting phase, and [another log for the new bulk].You can [change] your main log by [removing it and setting a new one using the Options button]."
    },
    {
      title: "Track Smarter, Progress Faster",
      message: "Looks like you've got it down!These tips [won't] appear again automatically.On your main log, you can open them by clicking on [Options button > Tips]."
    }
  ];


  /**
   * @ignore
   */
  constructor(
    public dialogRef: MatDialogRef<FirstTimeTipsComponent>,
    @Inject(MAT_DIALOG_DATA) public data) { }

  /**
   * @ignore
   */
  ngOnInit() {
    this.dialogRef.disableClose = true;
  }

  /**
   * Returns the content that should be displayed in the dialog based on what 
   * the current instruction stage is.
   */
  getCurrentStage(): any {
    var textToModify = this.instructionStages[this.currentInstructionStage].message;
    if (!textToModify.includes("<p>")) {
      var separatedLines = textToModify.match(/.*?[?!.]/g);
      var modifiedLines = [];
      separatedLines.forEach((line: string) => {
        modifiedLines.push("<p>◈&nbsp; " + line + "</p>");
      });
      var modifiedString = modifiedLines.join("");
      modifiedString = modifiedString.replace(/\[/g, "<span class='thick'>");
      modifiedString = modifiedString.replace(/\]/g, "</span>");
      this.instructionStages[this.currentInstructionStage].message = modifiedString;
    }
    return this.instructionStages[this.currentInstructionStage];
  }

  /**
   * Returns true if the user is on the first instruction. False otherwise.
   */
  onFirstInstruction(): boolean {
    return (this.currentInstructionStage == 0);
  }

  /**
   * Returns true if the user is not on the first or the last instruction. False otherwise.
   */
  onIntermediateInstruction(): boolean {
    return (!this.onFirstInstruction() && !this.onLastInstruction());
  }

  /**
   * Returns true if the user is on the last instruction. alse otherwise.
   */
  onLastInstruction(): boolean {
    return (this.currentInstructionStage == this.instructionStages.length - 1);
  }

  /**
   * Moves the current instruction stage forward. 
   */
  nextStage(): void {
    this.currentInstructionStage++;
    if (this.onLastInstruction()) {
      this.closeDialog();
    }
    this.scrollToTop();

  }

  /**
  * Moves the current instruction stage backwards.
  */
  previousStage(): void {
    this.currentInstructionStage--;
    this.scrollToTop();
  }

  /**
   * Force scrolls the dialogs div to the top to prevent weird transitions.
   */
  scrollToTop(): void {
    const messageDiv: HTMLElement = document.getElementById('scrollToTop');
    if (messageDiv) {
      messageDiv.scrollTop = 0;
    }
  }

  /**
   * This function does not actually close the dialog, because we want to make sure 
   * the user knows how to open this dialog again before it closes. Instead it navigates
   * the user to the instruction about how to open this dialog again if they want to do 
   * that.
   */
  closeDialog(): void {
    this.currentInstructionStage = this.instructionStages.length - 1;
  }

}
