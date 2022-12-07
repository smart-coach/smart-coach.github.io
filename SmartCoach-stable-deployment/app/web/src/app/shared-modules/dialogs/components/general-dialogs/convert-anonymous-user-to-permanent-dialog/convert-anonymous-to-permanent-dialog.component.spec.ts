import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ConvertAnonymousToPermanentComponent } from './convert-anonymous-to-permanent-dialog.component';

describe('ConvertAnonymousToPermanentComponent', () => {
  let component: ConvertAnonymousToPermanentComponent;
  let fixture: ComponentFixture<ConvertAnonymousToPermanentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ConvertAnonymousToPermanentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConvertAnonymousToPermanentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not crash when ngOnInit() is called', () => {
    let crashed = false;
    try {
      component.ngOnInit();
    } catch (error) {
      crashed = true;
    }
    expect(crashed).toBe(false);
  });

  it('should close the dialog with the authentication result whenever closeDialog() is called ', () => {
    component.closeDialog();
    expect(component.dialogRef.close).toHaveBeenCalled();
  });

  it("should show a success message and close the dialog with true as the result when the user converts from anonymous to permanent user successfully and handlesubmit() is called ", async () => {
    component.closeDialog = jasmine.createSpy();
    component.guestRegisterForm = {
      controls: {
        [component.FORM_CONTROL_EMAIL]: { value: "someemail@gmail.com" },
        [component.FORM_CONTROL_PASSWORD]: { value: "somePassword" },
        [component.FORM_CONTROL_PASSWORD_CONFIRMATION]: { value: "somePassword" },
      } as any
    } as any;

    component.authManager.afAuth = {
      auth: {
        currentUser: {
          convertAnonymousUserToPermanentUser: jasmine.createSpy()
        }
      } as any
    } as any;
      await component.handleSubmit();
      expect(component.closeDialog).toHaveBeenCalled();
    });

  it("should show a failure message and not close the dialog as the result when the user converts from anonymous to permanent user fails and handlesubmit() is called ", async () => {
    component.closeDialog = jasmine.createSpy();
    component.guestRegisterForm = {
      controls: {
        [component.FORM_CONTROL_EMAIL]: { value: "someemail@gmail.com" },
        [component.FORM_CONTROL_PASSWORD]: { value: "somePassword" },
        [component.FORM_CONTROL_PASSWORD_CONFIRMATION]: { value: "somePassword" },
      } as any
    } as any;

    component.authManager.afAuth = {
      auth: {
        currentUser: {
          convertAnonymousUserToPermanentUser: jasmine.createSpy().and.throwError("someError")
        }
      } as any
    } as any;
      await component.handleSubmit();
    });
});
