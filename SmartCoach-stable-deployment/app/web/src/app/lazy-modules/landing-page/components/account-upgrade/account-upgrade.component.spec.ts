import { NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { autoSpy } from 'autoSpy';
import { FirebaseMessagingService } from 'src/app/services/firebase/firebase-messaging.service';
import { ConfettiService } from 'src/app/services/general/confetti.service';
import { EnvironmentService } from 'src/app/services/general/environment.service';
import { MobileAppReviewService } from 'src/app/services/general/mobile-app-review.service';
import { TestHelpers } from './../../../../services/general/testHelpers';
import { AccountUpgradeComponent } from './account-upgrade.component';

describe('AccountUpgradeComponent', () => {
  const testHelpers: TestHelpers = new TestHelpers();
  let component: AccountUpgradeComponent;

  beforeEach(() => {
    component = setup().build();
  });

  it('should not crash when ngOnInit is called', () => {
    const crashed = testHelpers.testOnInit(component);
    expect(crashed).toBe(false);
  });

  it("should go to the dashboard when goToDash() is called ", () => {
    component.ngz.run = (someLambda => someLambda());
    const expectedParam = 'dashboard';
    (component.router as any).navigate = ((someRoute) => { expect(expectedParam == someRoute).toBe(true) })
    component.goToDash();
  });

  it("should ask the user for a review if they're on mobile and have successfully completed a purchase", () => {
    const setUpAppReviewManager = spyOn(component.appReviewService, 'setUpAppReviewManager');
    const requestUserForReview = spyOn(component.appReviewService, 'requestUserForReview');
    component.environmentService.isMobile = true;
    component.ngOnInit();
    expect(setUpAppReviewManager).toHaveBeenCalled();
    expect(requestUserForReview).toHaveBeenCalled();    
  });

});

function setup() {
  const router = autoSpy(Router);
  const ngz = autoSpy(NgZone);
  const environment = autoSpy(EnvironmentService);
  const appReviewService = autoSpy(MobileAppReviewService);
  const firebaseMessagingService = autoSpy(FirebaseMessagingService);
  const confettiService = autoSpy(ConfettiService);
  const builder = {
    router, ngz,
    default() {
      return builder;
    },
    build() {
      return new AccountUpgradeComponent(router, ngz, environment, appReviewService, firebaseMessagingService, confettiService);
    }
  };

  return builder;
}
