import { Component, OnInit, Inject } from '@angular/core';
import { Validators, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuthenticationService } from 'src/app/services/firebase/authentication.service';
import { StateManagerService } from 'src/app/services/general/state-manager.service';
import { SnackBarService } from 'src/app/shared-modules/material/snack-bar-manager.service';
import { ConstantsService } from 'src/app/services/general/constants.service';
import { getAuth, User, reauthenticateWithCredential, AuthCredential, EmailAuthProvider } from "firebase/auth";
import { ValidateEmail } from 'src/app/shared-validators/email-validator';

/**
 * This dialog is essentially the same as the sign in form except it is used in situations
 * when the user needs to reauthenticate before a sensitive operation. For example a user 
 * may need to sign in again before changing their email address or password. This component
 * has a form with two fields for email and password. Above the form is a message to the 
 * user about why they have to authenticate again. Below the form are two buttons a
 * authenticate button and a close button. The close button will close the dialog if
 * pressed and the authenticate button will make a sign in request to firebase when the user
 * enters their authentication credentials. If the request fails then the error message 
 * for the failure is displayed, otherwise the component is closed. While the authentication
 * request is being waited upon a spinner should be shown with a message indicating that the 
 * request is being made and the dialog should not be able to be closed by clicking outside 
 * of it.
 * 
 * Last edited by: Faizan Khan 7/28/2020
 */
@Component({
  selector: 'app-re-authenticate-dialog',
  templateUrl: './re-authenticate-dialog.component.html',
  styleUrls: ['./re-authenticate-dialog.component.css']
})
export class ReAuthenticateDialogComponent implements OnInit {

  /**
   * True if the spinner should be shown. False otherwise.
   */
  showSpinner: boolean = false;

  /**
   * True if the error message should be shown. False otherwise.
   */
  showErrorMessage: boolean = false;

  /**
   * Default value for an authentication error message.
   */
  DEFAULT_ERROR_MESSAGE: string = "An error occured";

  /**
   * Value of the error message to be displayed. 
   */
  errorMessage: string = this.DEFAULT_ERROR_MESSAGE;

  /**
   * Key used for authentication form email control.
   */
  FORM_CONTROL_EMAIL: string = "username";

  /**
   * Key used for authentication form password control.
   */
  FORM_CONTROL_PASSWORD: string = "password";

  /**
   * Value used for return value for a successful authentication.
   */
  AUTH_SUCCESS: boolean = true;

  /**
   * Value used for a return value for an unsuccessful authentication.
   */
  AUTH_FAILURE: boolean = false;

  /**
   * Message displayed by the snackbar service for a successful authentication.
   */
  AUTH_SUCCESS_MSG: string = "Authentication success";

  /**
  * Message displayed by the snackbar service for a faile authentication.
  */
  AUTH_FAILURE_MSG: string = "Authentication failed";

  /**
  * Error code for an email in use being sent to firebase when trying to change a user's email.
  */
  INVALID_PASSWORD_OR_EMAIL_ERROR: string = "auth/wrong-password";

  /**
  * Message displayed when an email in use error is thrown.
  */
  INVALID_PASSWORD_OR_EMAIL_MESSAGE: string = "Password or E-mail provided was incorrect. ";

  /**
  * Error code for an email in use being sent to firebase when trying to change a user's email.
  */
  TOO_MANY_ATTEMPTS_ERROR: string = "auth/too-many-requests";

  /**
  * Message displayed when an email in use error is thrown.
  */
  TOO_MANY_ATTEMPTS_MESSAGE: string = "Password or E-mail provided was incorrect. ";

  /**
   * Form that contains controls for handling user input of password and email.
   */
  authenticateForm: UntypedFormGroup = this.fb.group({
    [this.FORM_CONTROL_EMAIL]: [null, [Validators.required, ValidateEmail]],
    [this.FORM_CONTROL_PASSWORD]: ['', Validators.required],
  });

  /**
   * Message displayed underneath the mat-spinner in the smart-coach-spinner-wheel component.
   */
  spinnerMessage: string = "Authenticating";

  /**
   * @ignore
   */
  constructor(
    public authService: AuthenticationService,
    public fb: UntypedFormBuilder,
    public stateManager: StateManagerService,
    public snackbar: SnackBarService,
    public constants: ConstantsService,
    @Inject(MAT_DIALOG_DATA) public data,
    public dialogRef: MatDialogRef<ReAuthenticateDialogComponent>) { }

  /**
   * @ignore
   */
  ngOnInit() { }

  /**
  * Handles submission of the reauthentication form. Displays a spinner and locks 
  * down the dialog from being closed. If the authentication request is successful,
  * then the dialog is closed. If it fails then an error message is displayed and the
  * spinner is hidden and the dialog can be closed again.
  */
  async handleSubmit() {
    this.showErrorMessage = false;
    this.dialogRef.disableClose = true;
    this.showSpinner = true;
    const email: string = this.authenticateForm.controls[this.FORM_CONTROL_EMAIL].value;
    const password: string = this.authenticateForm.controls[this.FORM_CONTROL_PASSWORD].value;
    const currentUser: User = this.getCurrentUser();
    const credentials: AuthCredential = EmailAuthProvider.credential(email, password);
    try {
      await reauthenticateWithCredential(currentUser, credentials);
      this.snackbar.showSuccessMessage(this.AUTH_SUCCESS_MSG);
      this.closeDialog(true);
    }
    catch (error) {
      const context = this;
      const errorHasCode: boolean = (error && error.code);
      setTimeout(() => {
        if (errorHasCode && error.code === this.INVALID_PASSWORD_OR_EMAIL_ERROR) {
          context.errorMessage = this.INVALID_PASSWORD_OR_EMAIL_MESSAGE;
          context.showErrorMessage = true;
        }
        else if (errorHasCode && error.code === this.TOO_MANY_ATTEMPTS_ERROR) {
          context.errorMessage = this.TOO_MANY_ATTEMPTS_MESSAGE;
          context.showErrorMessage = true;
        }
        else {
          context.showErrorMessage = true;
        }
        context.showSpinner = false;
        context.dialogRef.disableClose = false;
        context.snackbar.showFailureMessage(this.AUTH_FAILURE_MSG);
      }, this.constants.SPINNER_TIMEOUT);
    }
  }

  /**
   * Closes the dialog and passes the result of the authentication request to the dialogs creators
   * on close callback which will return it to the calling component or service.
   * 
   * @param userSuccessfullyReauthenticated True if the authentication was successful. False otherwise.
   */
  closeDialog(userSuccessfullyReauthenticated: boolean): void {
    this.dialogRef.close(userSuccessfullyReauthenticated);
  }

  /**
   * Helper function to get current user to avoid reusing same code in multiple places.
   */
  getCurrentUser(): User {
    const auth = getAuth().currentUser;
    return auth;
  }

}
