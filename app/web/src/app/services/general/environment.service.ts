import { Injectable } from '@angular/core';

/**
 * This service controls any variables that change based on whether or not the 
 * environment being built for is production or development. IT SHOULD NEVER 
 * BE MODIFIED unless you are building for production.
 * 
 * Last edited by: Faizan Khan 8/13/2020
 */
@Injectable({
  providedIn: 'root'
})
export class EnvironmentService {

  /**
   * BE EXTREMELY CAREFUL. IF THIS VARIABLE IS FLIPPED TO TRUE THEN 
   * THE APPLICATION WILL BE BUILT SUCH THAT IT IS HOOKED UP TO ALL 
   * OF OUR PROD THIRD PARTY RESOURCES.
   * 
   * This variable should be false all the time unless we are creating
   * a production build. If the variable is false then we know that 
   * we are building for the development environment. If it is true
   * than we are building for the production environment.
   */
  isProduction: boolean = true;

  /**
  * True if building the application in cordova(for Mobile), false otherwise. 
  * This variable needs to be flipped manually before building, otherwise 
  * certain features may or may not be broken and there will be unexpected behavior.
  */
  isMobile: boolean = false;

  /**
   * True if the environment is ios. False otherwise.
   */
  isiOS: boolean = false;

  /**
   * True if the environment is android. False otherwise.
   */
  isAndroid: boolean = false;

  /**
   * True if the environment is web. False otherwise.
   */
  isWeb: boolean = true;

  /**
   * True if the environment is mobile web for PWA. False otherwise.
   */
  isMobileWeb: boolean = false;

  /**
   * Development publishable Stripe key used to create checkout sessions.
   */
  STRIPE_API_KEY_DEV: string = "pk_test_51Kh6ZxSB5CzJfLCJJjB5tTl72D01LwOZ6kTkebGLWIEv2M5PuYLomSqOdsE89eSqf81uuVVSU6UaaoyVGTiS6cZP00vmBhMll1";

  /**
   * Production publishable Stripe key used to create checkout sessions.
   */
  STRIPE_API_KEY_PROD: string = "pk_live_51Kh6ZxSB5CzJfLCJGIG3nHIl2tUVfgpsm6wvd9aC3GeCaz3xP6aykRUQGdkYWeJ6BJD2K3EmZ2at0ocDpIt3SuWj005ypzW2sM";

  /**
   * URL used for iOS IAP mobile receipt validation.
   * Found on https://www.iaptic.com/
   */
  VALIDATOR_URL: string = "https://validator.iaptic.com/v3/validate?appName=com.smartcoach.app&apiKey=8dcb3e9c-32e2-41f9-b6e9-1c27a87aefb0";

  /**
   * Individual product ID for iOS IAP mobile product.
   */
  INDIVIDUAL_ID_IAP: string = "smartcoach_premium";

  /**
   * Coach product ID for iOS IAP mobile product.
   */
  COACH_ID_IAP: string = "COACH_PREMIUM";

  /**
   * Individual product ID for Android IAB mobile product
   */
  INDIVIDUAL_ID_IAB: string = "smartcoach_premium";

  /**
   * @ignore
   */
  constructor() {
    this.getUserAgent();
  }

  /**
   * Returns the value of the fovea validator URL
   */
  getFoveaValidatorURL(): string {
    return this.VALIDATOR_URL;
  }

  /**
   * Returns the value of the coach subscription id for IAP.
   */
  getCoachIdIAP(): string {
    return this.COACH_ID_IAP;
  }

  /**
   * Returns the value of the individual subscription id for IAP if the 
   * environment is anything but Android. If the environmnet is Android,
   * then the individual subscription id for IAB is returned.
   */
  getIndividualId(): string {
    const wantToReturnAndroidID: boolean = (this.isAndroid == true);
    if (wantToReturnAndroidID) {
      return this.INDIVIDUAL_ID_IAB;
    }
    return this.INDIVIDUAL_ID_IAP;
  }

  /**
   * Returns the correct variable to be used to create checkout sessions with.
   */
  getStripePublicKey(): string {
    return this.getCorrectEnvironmentVariable(this.STRIPE_API_KEY_DEV, this.STRIPE_API_KEY_PROD);
  }

  /**
   * Reduces repeated logic for getting correct variable based upon environment. 
   * If the environment is production, then the procution variable is returned.
   * If the environment is development then the development variable is returned.
   * 
   * @param developmentVariable Variable used in the development environment.
   * @param productionVariable  Variable used in the production environment.
   */
  getCorrectEnvironmentVariable(developmentVariable: any, productionVariable: any): any {
    if (this.isProduction) {
      return productionVariable;
    } else {
      return developmentVariable;
    }
  }

  /**
   * Returns true if the User Agent is a mobile device accessing the web app. False otherwise.
   * Mobile web app functions very similar to a mobile app except without the mobile specific functionalities.
   */ 
  getUserAgent() {
    var ua = navigator.userAgent;

    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(ua)) {
      this.isMobileWeb = true;
      this.isWeb = false;
    }
    else {
      this.isMobileWeb = false;
      this.isWeb = true;
    }
  }
}
