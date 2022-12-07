import { TestBed } from '@angular/core/testing';
import { MobileAppReviewService } from './mobile-app-review.service';

describe('MobileAppReviewService', () => {
  let service: MobileAppReviewService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = new MobileAppReviewService();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add the deviceready event when setUpAppReviewManager is called', () => {
    document.addEventListener = async (event, lam) => {
      await lam();
      return;
    };
    const addEventSpy: jasmine.Spy<any> = spyOn(document, 'addEventListener');
    service.setUpAppReviewManager();
    expect(addEventSpy).toHaveBeenCalled();
  });

  it('should ask the user for a review when requestUserForReview is called', () => {
    service.APP_REVIEW_PLUGIN = {
      requestReview: (obj, lam) => { }
    };
    const scheduleSpy = spyOn(service.APP_REVIEW_PLUGIN, 'requestReview');
    service.requestUserForReview();
    expect(scheduleSpy).toHaveBeenCalled();
  });

  it('should fallback to openStoreScreen and ask the user for a review when requestUserForReview is called', () => {
    service.APP_REVIEW_PLUGIN = {
      requestReview: (obj, lam) => { throw new Error("") },
      openStoreScreen: (obj, lam) => { }
    };
    const scheduleSpy = spyOn(service.APP_REVIEW_PLUGIN, 'openStoreScreen');
    service.requestUserForReview();
    expect(scheduleSpy).toHaveBeenCalled();
  });

});