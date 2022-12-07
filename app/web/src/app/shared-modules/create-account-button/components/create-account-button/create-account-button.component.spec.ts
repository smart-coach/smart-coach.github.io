import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CreateAccountButtonComponent } from './create-account-button.component';

describe('CreateAccountButtonComponent', () => {
  let component: CreateAccountButtonComponent;
  let fixture: ComponentFixture<CreateAccountButtonComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateAccountButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateAccountButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
