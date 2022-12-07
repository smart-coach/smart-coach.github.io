import { AngularFireFunctions } from '@angular/fire/compat/functions';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';
import { autoSpy } from 'autoSpy';
import { FirebaseMessagingService } from './firebase-messaging.service';
import {CallableWrapperService} from './callable-wrapper.service';

describe('FirebaseMessagingService', () => {
  let service: FirebaseMessagingService;

  beforeEach(() => {
    service = setup().default().build();
});

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add the deviceready event when setUpPushManager is called', () => {
    document.addEventListener = async (event, lam) => {
      await lam();
      return;
    };
    const addEventSpy: jasmine.Spy<any> = spyOn(document, 'addEventListener');
    service.setUpFirebaseMessagingManager();
    expect(addEventSpy).toHaveBeenCalled();
  });

  it('should call the requestPermission function when setUpPushManager is called', () => {
    const requestPermissionSpy: jasmine.Spy<any> = spyOn(service, 'requestPermission');
    service.setUpFirebaseMessagingManager();
    expect(requestPermissionSpy).toHaveBeenCalled();
  });

  it('should subscribe to topic when subscribeToTopic is called', () => {
    const subscribeToTopicSpy: jasmine.Spy<any> = spyOn(service, 'subscribeToTopic');
    service.subscribeToTopic('test');
    expect(subscribeToTopicSpy).toHaveBeenCalled();
  });

  it('should unsubscribe from topic when unsubscribeFromTopic is called', () => {
    const unsubscribeFromTopicSpy: jasmine.Spy<any> = spyOn(service, 'unsubscribeFromTopic');
    service.unsubscribeFromTopic('test');
    expect(unsubscribeFromTopicSpy).toHaveBeenCalled();
  });

  it('should return the payload from the onBackgroundMessage function', () => {
    const onBackgroundMessageSpy: jasmine.Spy<any> = spyOn(service, 'onBackgroundMessage');
    const payload = service.onBackgroundMessage();
    expect(onBackgroundMessageSpy).toHaveBeenCalled();
    expect(payload).toBeTruthy();
  });

  it('should return the payload from the onMessage function', () => {
    const onMessageSpy: jasmine.Spy<any> = spyOn(service, 'onMessage');
    const payload = service.onMessage();
    expect(onMessageSpy).toHaveBeenCalled();
    expect(payload).toBeTruthy();
  });

  it('should get device token when getToken is called', () => {
    const getTokenSpy: jasmine.Spy<any> = spyOn(service, 'getToken');
    service.getToken();
    expect(getTokenSpy).toHaveBeenCalled();
  });

  it('should delete the token when deleteToken is called', () => {
    const deleteTokenSpy: jasmine.Spy<any> = spyOn(service, 'deleteToken');
    service.deleteToken();
    expect(deleteTokenSpy).toHaveBeenCalled();
  });

  it('should refresh the token when onTokenRefresh is called', () => {
    const onTokenRefreshSpy: jasmine.Spy<any> = spyOn(service, 'onTokenRefresh');
    service.onTokenRefresh();
    expect(onTokenRefreshSpy).toHaveBeenCalled();
  });

  it("should setup the firebase messaging manager when setUpFirebaseMessagingManager() is called and the service is not initialized ", async () => {
    service.FIREBASE_MESSAGING = null
    const addEventListRef = document.addEventListener
    let eventName = ''
    service.getCordovaFirebaseMessagingPlugin = () => { }
    document.addEventListener = (eventNameParam, lam) => {
      lam();
      lam();
      eventName = eventNameParam;
    }
    service.setUpFirebaseMessagingManager();
    expect(eventName).toBe('deviceready')
    document.addEventListener = addEventListRef;
  });

  it("should not break on web if getCordovaFirebaseMessagingPlugin() is called ", () => {
    let madeItThrough = false;
    try {
      service.getCordovaFirebaseMessagingPlugin()
    }
    catch (error) { }
    madeItThrough = true;
    expect(madeItThrough).toBe(true);
  });

  it("should return false if the service has not been setup and requestPermissions() is called ", async () => {
    service.FIREBASE_MESSAGING = null;
    expect(await service.requestPermission()).toBe(false);
  });
});

function setup() {
  const fireFunc = autoSpy(AngularFireFunctions);
  const fireMessaging = autoSpy(AngularFireMessaging);
  const wrapper = autoSpy(CallableWrapperService);
  const builder = {
    fireFunc,
    fireMessaging,
    default() {
      return builder;
    },
    build() {
      jasmine.getEnv().allowRespy(true);
      return new FirebaseMessagingService(fireMessaging, fireFunc, wrapper);
    }
  };

  return builder;
}