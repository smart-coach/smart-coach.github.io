import { Component, OnInit, ChangeDetectorRef, OnDestroy, Input, ChangeDetectionStrategy } from '@angular/core';
import { StateManagerService } from 'src/app/services/general/state-manager.service';
import { TierPermissionsService } from 'src/app/services/general/tier-permissions.service';
import { ProfileControlService } from 'src/app/services/general/profile-control.service';
import { PaymentService } from 'src/app/services/firebase/payments.service';
import { Router } from '@angular/router';
import { SnackBarService } from 'src/app/shared-modules/material/snack-bar-manager.service';
import { EnvironmentService } from 'src/app/services/general/environment.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogCreatorService } from 'src/app/shared-modules/dialogs/dialog-creator.service';
import { InAppPurchaseService } from 'src/app/services/general/in-app-purchase.service';
import { loadStripe } from '@stripe/stripe-js';

/**
 * This component is just a button that contains the logic for routing a user to the 
 * Stripe Session payment portal. It is expected that this component is not 
 * displayed if the user is not authenticated because an unauthenticated user would 
 * not be able to do anything useful with a checkout session. If the user has a free 
 * account the button will take them to a checkout session that will let them create 
 * a subscription. If the user has a paid account then the button will take them 
 * to a portal where they can update their payment information. When the button 
 * is pressed a spinner is shown and the button is hidden until the user is re-routed
 * to the checkout session, if any errors occur, then the spinner is hidden and an error 
 * message is displayed to the user. 
 * 
 * Last edited by: Faizan Khan 7/26/2020
 */
@Component({
  selector: 'app-checkout-button',
  templateUrl: './checkout-button.component.html',
  styleUrls: ['./checkout-button.component.css']
})
export class CheckoutButtonComponent implements OnInit, OnDestroy {

  /**
   * This key is used to communicate with our backend and authorize 
   * access to a stripe checkout session coming from SmartCoach.
   */
  STRIPE_PUBLIC_KEY: string = this.environmentService.getStripePublicKey();

  /**
   * True if an Octobat checkout session portal is loading, false otherwise.
   * If this variable is true, then a spinner will be shown in the place of the 
   * button.
   */
  loadingPortal: boolean = false;

  /**
   * CSS class that is applied to the checkout button to identify it in the HTML.
   */
  CHECKOUT_BUTTON_CLASS: string = "checkout-button";

  /**
   * Message displayed underneath the mat-spinner in the smart-coach-spinner-wheel component.
   */
  spinnerMessage: string = "Loading subscription portal. This may take a moment.";

  /**
   * True if the button should be disabled false/null otherwise.
   */
  @Input()
  disabled: boolean;

  /**
   * True if everything should be hidden for an error when the octo script loads. False otherwise.
   */
  hideEverythingForError: boolean = false;

  /**
   * True if the portal func has been set. False otherwise.
   */
  portalFuncSetOnMobile: boolean = false;

  /**
   * True if the portal func has been set. False otherwise.
   */
  portalFuncSetOnWeb: boolean = false;

  /**
   *@ignore
   */
  constructor(
    public stateManager: StateManagerService,
    public tierPermissionsManager: TierPermissionsService,
    public profileControl: ProfileControlService,
    public paymentManager: PaymentService,
    public snackBar: SnackBarService,
    public router: Router,
    public environmentService: EnvironmentService,
    public dialog: MatDialog,
    public iap: InAppPurchaseService,
    public dialogCreator: DialogCreatorService,
    public cdr: ChangeDetectorRef) { }

  /**
   * @ignore
   */
  ngOnInit() {
    if (this.environmentService.isWeb) {
      this.setPortalFunction();
    }
    else {
      if (this.environmentService.isMobile && !this.portalFuncSetOnMobile) {
        this.loadingPortal = false;
        setTimeout(() => {
          this.setPortalFunction();
          this.portalFuncSetOnMobile = true;
          this.cdr.detectChanges();
        }, 100);
      }
    }
  }

  /**
  * @ignore 
  */
  ngOnDestroy() {
  }

  /**
  * Iterates through elements with the class checkout-button and attaches 
  * the prortalFunction as the click handler of the function. There should
  * only be one button with the checkout-button class but if there are more, 
  * of the buttons with the class will have the portal function attached as a
  * click handler. If the click handler is not defined as a lambda, then 
  * errors are thrown caused from a change in the context of the 'this' 
  * keyword. To avoid this a simple lambda is defined that returns the result
  * of the portal function.
  */
  setPortalFunction(): void {
    let checkoutButtons = document.getElementsByClassName(this.CHECKOUT_BUTTON_CLASS);
    const context = this;
    const currentEnvIsMobile: boolean = (context.environmentService.isMobile == true);
    let PORTAL_FUNC: (() => any) = null;
    if (currentEnvIsMobile) {
      PORTAL_FUNC = () => { context.dialogCreator.openFreeAccountWarningDialog(context.iap) };
    } else {
      if (context.portalFuncSetOnWeb) {
        context.goToCheckoutSession();
      }
      else {
        context.portalFuncSetOnWeb = true;
        PORTAL_FUNC = async () => { return context.goToCheckoutSession() }
      }
    }
    for (let button = 0; button < checkoutButtons.length; button++) {
      checkoutButtons[button].addEventListener('click', PORTAL_FUNC);
    }
  }

  /**
   * Click handler for checkout button. Redirects user to checkout session,
   * if an error occurs, then an error message saying failed to load portal 
   * is displayed. An ignore comment is necessary because Octobat does not 
   * have a package to install to get their object types and the script for 
   * octobat is dynamically loaded at runtime and injected into the apllication.
   */
  async goToCheckoutSession(): Promise<void> {
    const FAILED_TO_LOAD: string = "Failed to load portal";
    const context = this;
    try {
      var stripe = await loadStripe(this.STRIPE_PUBLIC_KEY);
      context.profileControl.beginEditing(context.profileControl.EDITING_PORTAL);
      context.loadingPortal = true;
      const checkoutSesh: any = await context.paymentManager.getCheckoutSessionForUser();
      const checkoutSessionId = checkoutSesh.id;
      const result = await stripe.redirectToCheckout({ sessionId: checkoutSessionId });
      if (result.error) {
        context.snackBar.showFailureMessage(FAILED_TO_LOAD);
        context.profileControl.doneEditing();
      }
    }
    catch (error) {
      context.snackBar.showFailureMessage(FAILED_TO_LOAD);
      context.loadingPortal = false;
      context.profileControl.doneEditing();
    }
  }

  /**
   * The Checkout button should be disabled if there is a form on the profile
   * page being edited and the user is on the profile page or if the user has
   * an active subscription.
   * 
   * The button should also be disabled if it is specified as an input param.
   */
  disableCheckoutButton(): boolean {
    if (this.disabled) {
      return true;
    }
    else {
      const onProfilePage: boolean = this.router.url.includes("profile");
      const profilePageBeingEdited: boolean = (this.profileControl.currentEditValue() != this.profileControl.NOT_EDITING);
      const onProfPageAndEditing: boolean = (onProfilePage && profilePageBeingEdited);
      const userHasActiveSub: boolean = this.tierPermissionsManager.userHasActiveSubscription();
      const disableCheckoutButton: boolean = (onProfPageAndEditing || userHasActiveSub);
      return disableCheckoutButton;
    }
  }

}
