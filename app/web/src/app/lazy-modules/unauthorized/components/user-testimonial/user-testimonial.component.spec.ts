import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { UserTestimonialComponent } from './user-testimonial.component';

describe('UserTestimonialComponent', () => {
  let component: UserTestimonialComponent;
  let fixture: ComponentFixture<UserTestimonialComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UserTestimonialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserTestimonialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch the testimonials and transformations from the db', () => {
    expect(component.userTestimonials).toBeDefined();
    firstValueFrom(component.firebaseGeneral.getTestimonials()).then(response => {
      const isFromCache: boolean = (<any>response)._fromCache;
      expect(isFromCache).toBeFalsy();
      component.formatUserTestimonials(JSON.parse(response.data().testimonials));
      expect(component.userTestimonials.length).toBeGreaterThan(0);
      component.userTransformations = JSON.parse(response.data().transformations);
      expect(component.userTransformations.length).toBeGreaterThan(0);
    });
  });

  it('should hide the spinner when the testimonial page is loaded', () => {
    expect(component.showSpinner).toBeTruthy();
    component.hideSpinner();
    expect(component.showSpinner).toBeFalsy();
  });

  it('should convert the response from firebase into a Testimonial[]', () => {
    firstValueFrom(component.firebaseGeneral.getTestimonials()).then(response => {
      const isFromCache: boolean = (<any>response)._fromCache;
      expect(isFromCache).toBeFalsy();
      const testimonials = component.getTestimonialsFromJSONList(JSON.parse(response.data().testimonials));
      expect(testimonials.length).toBeGreaterThan(0);
    });
  });

  it('should convert the response from firebase into a Transformation[]', () => {
    firstValueFrom(component.firebaseGeneral.getTestimonials()).then(response => {
      const isFromCache: boolean = (<any>response)._fromCache;
      expect(isFromCache).toBeFalsy();
      const transformations = component.getTransformationsFromJSONList(JSON.parse(response.data().transformations));
      expect(transformations.length).toBeGreaterThan(0);
    });
  });

  it('should format the testimonials', () => {
    firstValueFrom(component.firebaseGeneral.getTestimonials()).then(response => {
      const isFromCache: boolean = (<any>response)._fromCache;
      expect(isFromCache).toBeFalsy();
      component.formatUserTestimonials(JSON.parse(response.data().testimonials));
      expect(component.userTestimonials.length).toBeGreaterThan(0);
    });
  });
});
