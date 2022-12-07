import { Injectable } from '@angular/core';

/**
 * This service is used for all functionality related to mobile app review. 
 * It is a wrapper around the following cordova plugin:
 *    https://github.com/chemerisuk/cordova-plugin-app-review
 * 
 * This service will break on web and none of the app review logic should
 * be exposed to web users. If a user has already provided a review
 * they will not be prompted again. A viable candidate for review
 * is someone who has purchased the premium subscription or someone who has
 * used the app for (19-21), (39-41) or (59-61) days/entries.
 * 
 * Last edited by: Faizan Khan 04/08/2022
 */
@Injectable({
  providedIn: 'root'
})
export class MobileAppReviewService {

  /**
   * Wrapper around the app review object
   * to avoid lots of typescript errors in this service.
   */
  APP_REVIEW_PLUGIN: any = null;

  /**
   * @ignore
   */
  constructor() { }

  /**
   * This function is called by the onInit function of InDepthNutritionLogDisplayComponent
   * and AccountUpgradeComponent if the user is on a mobile device and waits 
   * for the device ready event to fire. Once that event fires, cordova
   * plugins will be available and the APP_REVIEW_PLUGIN global object
   * is assigned to the cordova plugin for managing the app reviews.
   */
  setUpAppReviewManager() {
    const context: MobileAppReviewService = this;
    document.addEventListener('deviceready', () => {
      context.APP_REVIEW_PLUGIN = context.getCordovaAppReviewPlugin();
    });
  }

  /**
   * Returns the app review plugin in a format that is
   * easier to mock when unit testing and to ignore the fact
   * that the cordova object will not exist on web
   */
  getCordovaAppReviewPlugin(): any {
    // @ts-ignore 
    return cordova.plugins.AppReview;
  }

  /**
   * This function is from the cordova app review plugin which allows us to
   * ask the user for a review. It shows a non-intrusive dialog asking
   * the user for a review, fall back is a redirection to the stores, which is
   * intrusive but necessary for asking for a review.
   */
  requestUserForReview() {
    this.APP_REVIEW_PLUGIN.requestReview().catch(function () {
      return this.APP_REVIEW_PLUGIN.openStoreScreen();
    });
  }
}
