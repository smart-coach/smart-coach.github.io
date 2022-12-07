import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { UntypedFormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { autoSpy } from 'autoSpy';
import { UserProfile } from 'functions/src/classes/user-profile';
import { Subject, Subscription } from 'rxjs';
import { AuthenticationService } from 'src/app/services/firebase/authentication.service';
import { FirebaseGeneralService } from 'src/app/services/firebase/firebase-general.service';
import { ConversionService } from 'src/app/services/general/conversion.service';
import { EnvironmentService } from 'src/app/services/general/environment.service';
import { PreferenceService } from 'src/app/services/general/preference.service';
import { ProfileService } from 'src/app/services/general/profile.service';
import { StateManagerService } from 'src/app/services/general/state-manager.service';
import { TestHelpers } from 'src/app/services/general/testHelpers';
import { DialogCreatorService } from 'src/app/shared-modules/dialogs/dialog-creator.service';
import { SnackBarService } from 'src/app/shared-modules/material/snack-bar-manager.service';

import { GuestRegisterComponent } from './guest-register.component';

describe('GuestRegisterComponent', () => {
  let component: GuestRegisterComponent;
  const testHelper: TestHelpers = new TestHelpers();

  beforeEach((() => {
    component = setup().default().build();

    component.cdr = {
      markForCheck() {
        return {};
      },
    } as any;

    document.getElementsByClassName = jasmine.createSpy().and.returnValue([
      {
        classList: {
          add: function() {},
          remove: function() {}
        }
      }
    ]);
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not crash when ngOnInit is called', () => {
    const crashed: boolean = testHelper.testOnInit(component);
    expect(crashed).toBe(false);
  });

  it('should not crash when ngOnInit is called (mobile)', () => {
    component.environmentService.isMobile = true;
    const crashed: boolean = testHelper.testOnInit(component);
    expect(crashed).toBe(false);
  });

  it('should not crash when ngOnDestroy is called', () => {
    component.ngOnInit();
    const crashed: boolean = testHelper.testOnDestroy(component);
    expect(crashed).toBe(false);
  });

  it('should not crash when ngOnDestroy is called (mobile)', () => {
    component.environmentService.isMobile = true;
    component.ngOnInit();
    const crashed: boolean = testHelper.testOnDestroy(component);
    expect(crashed).toBe(false);
  });

  it('should kill the myErrorSubscription when ngOnDestroy is called', () => {
    component.myErrorSubscription = new Subscription();
    const unsubSpy: jasmine.Spy<() => void> = spyOn(component.myErrorSubscription, "unsubscribe");
    component.ngOnDestroy();
    expect(unsubSpy).toHaveBeenCalled();
  });

  it('should not unsubscribe from myErrorSubscription if myErrorSubscription is null when ngOnDestroy is called', () => {
    component.myErrorSubscription = new Subscription();
    const unsubSpy: jasmine.Spy<() => void> = spyOn(component.myErrorSubscription, "unsubscribe");
    component.myErrorSubscription = null;
    const crashed = testHelper.testOnDestroy(component);
    expect(crashed).not.toBe(true);
    expect(unsubSpy).not.toHaveBeenCalled();
  });

  it('should subscribe to errors from firebase when errorSubscription is called', () => {
    let lambdaRef;
    component.authManager.eventAuthError = {
      subscribe: (errorMSG) => {
        lambdaRef = errorMSG;
      },
    } as any;

    component.errorSubscription();

    lambdaRef('error');
    expect(component.showSpinner).toBe(false);
    expect(component.errorMessage).toEqual('error');
    expect(component.hasErrorMessage).toBe(true);
  });

  it('should return true if the number system is Imperial when isImperial is called', () => {
    component.registerForm.patchValue({
      numberSystem: true
    });
    expect(component.isImperial()).toBe(true);
  });

  it('should return false if the number system is Metric when isImperial is called', () => {
    component.registerForm.patchValue({
      numberSystem: false
    });
    expect(component.isImperial()).toBe(false);
  });

  it('should successfully create a new anonymous user when user submits guest form', async () => {
    const createGuestUserAndloginSpy: jasmine.Spy<(user: any) => void> = spyOn(component.authManager, "createGuestUserAndlogin");
    const someUser = new UserProfile();
    someUser.height_inches = 69;
    someUser.weight_lbs = 420;
    someUser.activityLevel = "someActivityLevel";
    someUser.age = 21;
    someUser.isMale = true;
    spyOn(component, "convertResultsToModel").and.returnValue(someUser);

    component.showSpinner = false;
    let logicRef;
    component.dialogService.openWaitForOperationDialog = async (someLamda) => {
      logicRef = someLamda;
      return true;
    }
    await component.handleSubmit()
    await logicRef();
    expect(component.showSpinner).toBe(true);
    expect(createGuestUserAndloginSpy).toHaveBeenCalledWith(jasmine.any(UserProfile));
  });

  it('should call markForCheck if an error is caught when handleSubmit is called ', fakeAsync(() => {
    const errMsg = 'I ain‘t got no type';
    component.showSpinner = true;

    spyOn(component, 'convertResultsToModel').and.throwError(new TypeError(errMsg));
    const markForCheckSpy: jasmine.Spy<() => void> = spyOn(component.cdr, 'markForCheck');

    component.handleSubmit();

    tick();

    expect(component.errorMessage).toEqual(errMsg);
    expect(component.showSpinner).toBe(false);
    expect(markForCheckSpy).toHaveBeenCalled();
  }));

  it('should create and return a UserProfile with the information from the form and correctly convert height when number system is Imperial when convertResultsToModel is called', () => {
    const heardAboutUs: string = "someWayTheyHeardAboutUs";
    const referredBy: string = "       bigSpicy44";
    component.registerForm.patchValue({
      username: 'username',
      numberSystem: true,
      weight_lbs: 160,
      isMale: true,
      age_years: 21,
      activityLevel: null,
      [component.FORM_CONTROL_HEARD_ABOUT]: heardAboutUs,
    });


    spyOn(component.conversionManager, 'convertFeetAndInchesToInches').and.returnValue(69);
    const newUser = component.convertResultsToModel();
    expect(newUser.username).toBe('username');
    expect(newUser.userPreferences.general.isImperial).toBe(true);
    expect(newUser.height_inches).toBe(69);
    expect(newUser.weight_lbs).toBe(160);
    expect(newUser.isMale).toBe(true);
    expect(newUser.age).toBe(21);
    expect(newUser.activityLevel).toBe(null);
    expect(newUser.heardAboutUs).toBe(heardAboutUs);
    expect(newUser.referredBy).toBe(referredBy.trim().toUpperCase());
  });

  it('should create and return a UserProfile with the information from the form and correctly convert height when number system is Metric when convertResultsToModel is called', () => {
    component.registerForm.patchValue({
      username: 'username',
      numberSystem: false,
      isMale: true,
      age_years: null,
      activityLevel: null
    });
    const cmSpy: jasmine.Spy<(value) => number> = spyOn(component.conversionManager, 'convertCentimetersToInches').and.returnValue(69);
    const kgSpy: jasmine.Spy<(value) => number> = spyOn(component.conversionManager, 'convertKgToLbs').and.returnValue(160);
    const newUser = component.convertResultsToModel();
    expect(cmSpy).toHaveBeenCalled();
    expect(kgSpy).toHaveBeenCalled();
    expect(newUser.username).toBe('username');
    expect(newUser.userPreferences.general.isImperial).toBe(false);
    expect(newUser.height_inches).toBe(69);
    expect(newUser.weight_lbs).toBe(160);
    expect(newUser.isMale).toBe(true);
    expect(newUser.age).not.toBe(21);
    expect(newUser.activityLevel).toBe(null);
  });

  it('should not convert heigh and weight if isImperial is undefined when convertResults to model', () => {
    component.registerForm.patchValue({
      username: null,
      numberSystem: null,
      isMale: true,
      age_years: 21,
      activityLevel: null
    });
    spyOn(component.prefs, 'getDefaultPreferences').and.returnValue({ general: { isImperial: undefined } } as any);
    const cmSpy: jasmine.Spy<(value) => number> = spyOn(component.conversionManager, 'convertCentimetersToInches');
    const kgSpy: jasmine.Spy<(value) => number> = spyOn(component.conversionManager, 'convertKgToLbs');
    const ftSpy: jasmine.Spy<(value) => number> = spyOn(component.conversionManager, 'convertFeetAndInchesToInches');
    const newUser = component.convertResultsToModel();

    expect(cmSpy).not.toHaveBeenCalled();
    expect(kgSpy).not.toHaveBeenCalled();
    expect(ftSpy).not.toHaveBeenCalled();

    expect(newUser.username).not.toBe('username');
    expect(newUser.isMale).toBe(true);
    expect(newUser.age).toBe(21);
    expect(newUser.activityLevel).toBe(null);
  });

  it('should return true when userAgreesToTerms is called and the user agreed to the terms', () => {
    component.registerForm.patchValue({
      agreeToTerms: true
    });
    expect(component.userAgreesToTerms()).toBe(true);
  });

  it('should return false when userAgreesToTerms is called and the user did not agree to the terms', () => {
    component.registerForm.patchValue({
      agreeToTerms: false
    });
    expect(component.userAgreesToTerms()).toBe(false);
  });

  it("should return true when hasErrorMessage is called if the errorMessage is not an empty string or null, false otherwise", () => {
    component.errorMessage = "someValidMessage"
    expect(component.hasErrorMessage()).toBe(true);
    component.errorMessage = ""
    expect(component.hasErrorMessage()).toBe(false);
    component.errorMessage = null;
    expect(component.hasErrorMessage()).toBe(false);
  })
});

function setup() {
  const conversionManager = autoSpy(ConversionService);
  const dialogService = autoSpy(DialogCreatorService);
  const fb = autoSpy(UntypedFormBuilder);
  const router = autoSpy(Router);
  const stateManager = autoSpy(StateManagerService);
  const authManager = autoSpy(AuthenticationService);
  const prefs = autoSpy(PreferenceService);
  const prof = autoSpy(ProfileService);
  const snackBarManager = autoSpy(SnackBarService);
  const route = autoSpy(ActivatedRoute);
  const fbGeneral = autoSpy(FirebaseGeneralService);
  const environment = autoSpy(EnvironmentService);
  const builder = {
    conversionManager,
    dialogService,
    fb,
    router,
    stateManager,
    authManager,
    prefs,
    prof,
    snackBarManager,
    route,
    fbGeneral,
    environment,
    default() {
      return builder;
    },
    build() {
      authManager.eventAuthError = new Subject<string>();
      return new GuestRegisterComponent(conversionManager, dialogService, new UntypedFormBuilder(), router, stateManager, authManager, new PreferenceService({} as any), prof, snackBarManager, null, route, fbGeneral, environment);
    }
  };

  jasmine.getEnv().allowRespy(true);

  return builder;
}
