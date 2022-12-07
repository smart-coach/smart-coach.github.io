import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { UserProfile } from 'functions/src/classes/user-profile';
import { Subscription } from 'rxjs';
import { AuthenticationService } from 'src/app/services/firebase/authentication.service';
import { Router } from '@angular/router';
import { StateManagerService } from 'src/app/services/general/state-manager.service';
import { TierPermissionsService } from 'src/app/services/general/tier-permissions.service';
import { ValidateEmail } from 'src/app/shared-validators/email-validator';
import { ValidatePassword } from 'src/app/shared-validators/password-validator';

/**
 * Displays a warning to the user about their guest account. In place of the dialog title
 * is the number of days that the user has left in their guest trial. Below that 
 * is two buttons, one of which is the register button which is used to convert the guest
 * user to a permanent account, the other is a close button .
 * 
 * Last edited by: Faizan Khan 7/28/2020
 */

@Component({
  selector: 'app-convert-anonymous-to-permanent',
  templateUrl: './convert-anonymous-to-permanent-dialog.component.html',
  styleUrls: ['./convert-anonymous-to-permanent-dialog.component.css']
})
export class ConvertAnonymousToPermanentComponent implements OnInit {

  /**
  * Displays an error message from firebase if a register operation is denied.
  */
  errorMessage: string = "";

  /**
   * Reference to observable that emits any errors that occur during firebase register process.
   */
  myErrorSubscription: Subscription = null;

  /**
   * Key for email form control.
   */
  FORM_CONTROL_EMAIL: string = "email";

  /**
   * Key for password form control.
   */
  FORM_CONTROL_PASSWORD: string = "password";

  /**
   * Key for password form control.
   */
  FORM_CONTROL_PASSWORD_CONFIRMATION: string = "passwordConfirmation";

  /**
   * Key for terms agreement form control.
   */
  FORM_CONTROL_AGREE_TO_TERMS: string = "agreeToTerms";

  /**
   * Constant that indicates the user has not yet agreed to the terms and conditions.
   */
  DOES_NOT_AGREE_YET: string = null;

  /**
   * Group of formcontrols that are necessary to populate user's profile 
   * and create a unique UID that is linked to their email to reference 
   * on authentication.
   */
  guestRegisterForm: UntypedFormGroup = this.fb.group({
    [this.FORM_CONTROL_EMAIL]: [null, [Validators.required, ValidateEmail]],
    [this.FORM_CONTROL_PASSWORD]: [null, [Validators.required, ValidatePassword]],
    [this.FORM_CONTROL_PASSWORD_CONFIRMATION]: [null, [Validators.required, ValidatePassword]],
    [this.FORM_CONTROL_AGREE_TO_TERMS]: [this.DOES_NOT_AGREE_YET, [Validators.required]]
  });

  /**
   * true if the spinner should be shown. Indicating an ongoing register operation.
   */
  showSpinner: boolean = false;

  /**
   * Message displayed underneath the mat-spinner in the smart-coach-spinner-wheel component.
   */
  spinnerMessage: string = "Creating SmartCoach™ account. Don't leave this page!";

  /**
   * Reference to the subscription to the activated route that controls query params
   */
  myRouteSub: Subscription = null;

  /**
   * Selling points to convince guest to upgrade to free user.
   */
  GUEST_SELLING_POINTS: string = "Enjoy a [longer trial,] your [own personal account] on SmartCoach™, and [more data storage] with this [upgrade.] With the increase in storage, [1 log can contain up to 21 entries.]";

  /**
   * @ignore 
   */
  constructor(
    private fb: UntypedFormBuilder,
    public permissions: TierPermissionsService,
    public stateManager: StateManagerService,
    public authManager: AuthenticationService,
    public dialogRef: MatDialogRef<ConvertAnonymousToPermanentComponent>,
    public router: Router) {
    this.errorSubscription();
  }

  /**
  * @ignore 
  */
  ngOnInit() { }

  /**
   * @ignore kill subscriptions
   */
  ngOnDestroy(): void {
    if (this.myErrorSubscription) {
      this.myErrorSubscription.unsubscribe();
    }
  }

  /**
 * Handles submission of the register form. Validation has already been performed on most controls.
 * The last thing that needs to be checked is that the password matches the password confirmation.
 * If this check passes, then the results of the register form are converted into a user profile.
 * This function then waits for the results of an attempted register. If the user is registered,
 * successfully, they will be re-routed from the page. If they fail, an error mesage is displayed.
 * Since they're now a free user they will be unsubscribed from TOPIC_GUEST_USER_TRIAL_ENDING topic
 * in convertAnonymousUserToPermanentUser function after a successful registration.
 */
  async handleSubmit(): Promise<void> {
    const theyMatch: boolean = this.checkThatPassWordsMatch();
    let context = this;
    if (theyMatch) {
      try {
        context.showSpinner = true;
        let email: string = this.guestRegisterForm.controls[this.FORM_CONTROL_EMAIL].value;
        if (email) {
          email = email.trim();
        }
        let password: string = this.guestRegisterForm.controls[this.FORM_CONTROL_PASSWORD].value;
        if (password) {
          password = password.trim()
        }
        // This is called deep copy more info on, https://www.javascripttutorial.net/object/3-ways-to-copy-objects-in-javascript/
        let user: UserProfile = JSON.parse(JSON.stringify(this.stateManager.getCurrentUser()));
        user.emailAddr = email;
        user.subscriptionTier = this.permissions.DEFAULT_TIER_NAME;
        user.tierPermissions = JSON.parse(JSON.stringify(this.permissions.getDefaultTier()));
        await this.authManager.convertAnonymousUserToPermanentUser(email, password, user);
      } catch (err) {
        this.updateUiForRegisterError(err.message);
      }
    }
  }

  /**
   * Creates a subscription to an observabe that emits any error messages 
   * returned from firebase on an unsuccessful register operation. This message 
   * will then be displayed to the user.
   */
  errorSubscription(): void {
    this.myErrorSubscription = this.authManager.eventAuthError.subscribe((errorMessage: string) => {
      this.updateUiForRegisterError(errorMessage);
    });
  }

  /**
   * Updates the user interface to display an error message if an error 
   * occured during the register process.
   * 
   * @param errorMessage 
   */
  updateUiForRegisterError(errorMessage: string): void {
    this.errorMessage = errorMessage;
    this.showSpinner = false;
  }

  /**
   * Returns true if the value of the password and password confirmation 
   * form controls match. If they do not then an error message is displayed 
   * and false is returned.
   */
  checkThatPassWordsMatch(): boolean {
    const password: string = this.guestRegisterForm.controls[this.FORM_CONTROL_PASSWORD].value;
    const passwordConfirmation = this.guestRegisterForm.controls[this.FORM_CONTROL_PASSWORD_CONFIRMATION].value;
    const allowSubmit: boolean = (password == passwordConfirmation);
    if (!allowSubmit) {
      this.errorMessage = "Passwords don't match, please check again.";
    }
    return allowSubmit;
  }

  /**
   * True if there is an error message to display, false otherwise.
   */
  hasErrorMessage(): boolean {
    return (this.errorMessage != "" && this.errorMessage != null);
  }

  /**
   * Returns true if the user agrees to the terms of service. False otherwise.
   */
  userAgreesToTerms(): boolean {
    return (this.guestRegisterForm.controls[this.FORM_CONTROL_AGREE_TO_TERMS].value == true);
  }

  /**
   * Returns a one sentence description about the upgrade to free account. 
   */
  getUpgradeSellingPoints(): string {
    var sellingPoints = this.GUEST_SELLING_POINTS;
    sellingPoints = sellingPoints.replace(/\[/g, "<span class='thick'>");
    sellingPoints = sellingPoints.replace(/\]/g, "</span>");
    return sellingPoints;
  }

  /**
   * Closes the dialog with a lambda called by the after close function that will
   * take the user to the terms of service page.
   */
  goToTerms(): void {
    this.dialogRef.close(() => this.router.navigate(['/info/terms']));
  }

  /**
   * Closes the dialog with a lambda called by the after close function that will
   * take the user to the privacy policy page.
   */
  goToPrivacy(): void {
    this.dialogRef.close(() => this.router.navigate(['/info/privacy']));
  }

  /**
   * Returns true if the current user's account is guest. False otherwise
   */
  userIsGuest(): boolean {
    return this.permissions.userHasGuestAccount();
  }

  /**
   * Returns true if the current user's account is past the 1 week guest 
   * trial limit. False otherwise
   */
  guestHasNotUpgraded(): boolean {
    return this.permissions.guestTrialOverAndUserHasNotUpgraded();
  }

  /**
   * A helper function to close the guest register dialog.
  */
  closeDialog(): void {
    this.dialogRef.close();
  }
}