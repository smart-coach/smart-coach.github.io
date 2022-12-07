import { Injectable } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/compat/functions';
import { BehaviorSubject } from 'rxjs';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';
import { CallableWrapperService } from './callable-wrapper.service';

/**
 * This service is used for all functionality related to firebase messaging. 
 * It is a wrapper around the following cordova plugin:
 *    https://github.com/chemerisuk/cordova-plugin-firebase-messaging
 * 
 * This service will break on web and none of the push function logic should
 * be exposed to web users. It's used to reengage the user with the app when
 * they meet certain criteria.
 * 
 * Last edited by: Faizan Khan 1/23/2021
 */
@Injectable({
  providedIn: 'root'
})
export class FirebaseMessagingService {

  /**
   * Wrapper around the firebase messaging object
   * to avoid lots of typescript errors in this service.
   */
  FIREBASE_MESSAGING: any = null;

  /**
   * Topic to subscribe guest user to when their guest trial is ending.
   */
  TOPIC_GUEST_USER_TRIAL_ENDING: string = 'guest_user_trial_ending';

  /**
   * Topic to subscribe free user to when their free trial is ending.
   */
  TOPIC_FREE_USER_TRIAL_ENDING: string = 'free_user_trial_ending';

  /**
   * Topic to subscribe unpaid user to when they missed the payment and are no longer a premium user.
   */
  TOPIC_PREMIUM_USER_MISSED_PAYMENT: string = 'premium_user_missed_payment';

  /**
   * Returns the name of the cloud function that is used to subscribe a token to a topic.
   */
  SUBSCRIBE_TOKEN_TO_TOPIC_WEB_FUNCTION_NAME: string = 'subscribeTokenToTopic';

  /**
   * Returns the name of the cloud function that is used to unsubscribe a token to a topic.
   */
  UNSUBSCRIBE_TOKEN_FROM_TOPIC_WEB_FUNCTION_NAME: string = 'unsubscribeTokenFromTopic';

  /**
   * Gets the message from cloud messaging.
   */
  currentMessage = new BehaviorSubject<any>(null);

  /**
   * The token of the current user on web.
   */
  currentUserToken: string = null;

  /**
   * @ignore
   */
  constructor(public angularFireMessaging: AngularFireMessaging, public fireFunc: AngularFireFunctions, public wrapper: CallableWrapperService) { }

  /**
   * This function is called by the setUpForMobile function and waits 
   * for the device ready event to fire. Once that event fires, cordova
   * plugins will be available and the FIREBASE_MESSAGING global object
   * is assigned to the cordova plugin for managing the messaging.
   */
  setUpFirebaseMessagingManager() {
    const context: FirebaseMessagingService = this;
    document.addEventListener('deviceready', () => {
      context.FIREBASE_MESSAGING = context.getCordovaFirebaseMessagingPlugin();
    });
  }

  /**
   * Returns the push store plugin in a format that is
   * easier to mock when unit testing and to ignore the fact
   * that the cordova object will not exist on web
   * @returns {any}
   * @memberof FirebaseMessagingService
   */
  getCordovaFirebaseMessagingPlugin(): any {
    // @ts-ignore 
    return cordova.plugins.firebase.messaging;
  }

  /**
   * Makes a request using the native ios dialog for allowing messaging in our app.
   * If the dialog has already been shown once, then it will not be shown again.
   * @returns {Promise<boolean>}
   * @memberof FirebaseMessagingService
   */
  async requestPermission(): Promise<void> {
    const thisServiceWasSetupCorrectly: boolean = (this.FIREBASE_MESSAGING != null);
    if (thisServiceWasSetupCorrectly) {
      await this.FIREBASE_MESSAGING.requestPermission({ forceShow: false });
    }
  }

  /**
   * Makes a request using native web dialog for allowing messaging in our app.
   * If the dialog has already been shown once, then it will not be shown again.
   * @returns {void}
   * @memberof FirebaseMessagingService
   */
  requestPermissionForWebPushNotification(): void {
    this.angularFireMessaging.requestToken.subscribe({
      next: (token) => { this.currentUserToken = token; },
      error: (err) => { console.log(`Unable to get permission because of ${err}`); },
      complete: () => { console.log('Successfully requested token!'); }
    });
  }

  /**
   * This function is used ot receve messages while the web app is in the foreground.
   * Currently NOT using that functionality to display something to the user. But
   * can be used to display something to the user while the web app is in the foreground.
   * For now we're only using background notifications to display something to the user.
   * For web as well as mobile, but in the future if need be both the API's are available
   * for us to work with, mobile as well as web.
   * Web: receiveMessaging()
   * Mobile: onMessage()
   * An example object for future use that's received by receiveMessaging():
     {
      "from": "141452031913",
      "collapseKey": "campaign_collapse_key_3690202669533048336",
      "messageId": "fee7a3dc-6521-4881-aeff-4f017a16347f",
      "notification": {
          "title": "Liking SmartCoach™ so far?",
          "body": "We'd really appreciate hearing your thoughts on the app. Would you mind leaving a review?",
          "image": "https://firebasestorage.googleapis.com/v0/b/smart-coach-prod.appspot.com/o/FCMImages%2FAsk%20User%20Review.png?alt=media&token=9366ebba-6f8f-4d91-87f7-f445c5849b80"
      },
      "data": {
          "gcm.n.e": "1",
          "google.c.a.ts": "1660974024",
          "google.c.a.udt": "0",
          "google.c.a.c_id": "3690202669533048336",
          "gcm.notification.sound2": "default",
          "google.c.a.m_l": "user_review",
          "google.c.a.tc": "1",
          "google.c.a.e": "1",
          "google.c.a.c_l": "Ask User Review - Premium Seasoned"
      },
      "fcmOptions": {}
  }
     */
  receiveMessaging(): void {
    this.angularFireMessaging.messages.subscribe((payload) => {
      this.currentMessage.next(payload);
    });
  }

  /**
  * Registers background push notification callback.
  * @returns {any}
  * @memberof FirebaseMessagingService
  */
  onBackgroundMessage(): any {
    var payloadFromNotifications = null;
    this.FIREBASE_MESSAGING.onBackgroundMessage((payload: any) => {
      payloadFromNotifications = payload;
    });
    return payloadFromNotifications;
  }

  /**
   * Registers foreground push notification callback.
   * Currently NOT using this functionality to display something to the user. But
   * can be used to display something to the user while the mobile app is in the foreground.
   * For now we're only using background notifications to display something to the user.
   * For web as well as mobile, but in the future if need be both the API's are available
   * for us to work with, mobile as well as web.
   * Web: receiveMessaging()
   * Mobile: onMessage()
   * @returns {any}
   * @memberof FirebaseMessagingService
   */
  onMessage(): any {
    var payloadFromNotifications = null;
    this.FIREBASE_MESSAGING.onMessage((payload: any) => {
      payloadFromNotifications = payload;
    });
    return payloadFromNotifications;
  }

  /**
   * Subscribe to a FCM topic.
   * @returns {Promise<void>}
   * @memberof FirebaseMessagingService
   * @param {string} topic - The topic to unsubscribe to.
   */
  async subscribeToTopic(topic: string): Promise<void> {
    await this.FIREBASE_MESSAGING.subscribe(topic);
  }

  /**
   * Unsubcscribe from a FCM topic.
   * @returns {Promise<void>}
   * @memberof FirebaseMessagingService
   * @param {string} topic - The topic to unsubscribe from.
   */
  async unsubscribeFromTopic(topic: string): Promise<void> {
    await this.FIREBASE_MESSAGING.unsubscribe(topic);
  }

  /**
   * Get device token.
   * @returns {Promise<string>}
   * @memberof FirebaseMessagingService
   */
  async getToken(): Promise<string> {
    var deviceToken: Promise<string> = this.FIREBASE_MESSAGING.getToken();
    return deviceToken;
  }

  /**
   * Delete device token.
   * @returns {Promise<void>}
   * @memberof FirebaseMessagingService
   */
  async deleteToken(): Promise<void> {
    await this.FIREBASE_MESSAGING.deleteToken();
  }

  /**
   * Refresh device token.
   * @returns {Promise<void>}
   * @memberof FirebaseMessagingService
   */
  onTokenRefresh(): void {
    this.FIREBASE_MESSAGING.onTokenRefresh();
  }

  /**
   * Subscribe to a FCM topic using cloud function (web client).
   * Calls a cloud function from cloudMessaging that subscribes a token to a topic.
   * @returns {Promise<void>}
   * @memberof FirebaseMessagingService
   * @param {string} token 
   * @param {string} topic 
   */
  async subscribeTokenToTopicWeb(token: string, topic: string): Promise<void> {
    const subscribeRequestBody = {
      token: token,
      topic: topic
    };
    await this.wrapper.firebaseCloudFunction(this.SUBSCRIBE_TOKEN_TO_TOPIC_WEB_FUNCTION_NAME, subscribeRequestBody);
  }

  /**
   * Unsubcribe from a FCM topic using cloud function (web client).
   * Calls a cloud function from cloudMessaging that unsubscribes the token from the topic.
   * @returns {Promise<void>}
   * @memberof FirebaseMessagingService
   * @param {string} token 
   * @param {string} topic 
   */
  async unsubscribeTokenFromTopicWeb(token: string, topic: string): Promise<void> {
    const unsubscribeRequestBody = {
      token: token,
      topic: topic
    };
    await this.wrapper.firebaseCloudFunction(this.UNSUBSCRIBE_TOKEN_FROM_TOPIC_WEB_FUNCTION_NAME, unsubscribeRequestBody);
  }
}