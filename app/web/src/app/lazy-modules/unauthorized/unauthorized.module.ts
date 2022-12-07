import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnauthorizedRoutingModule } from './unauthorized-routing.module';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { VerifyEmailComponent } from './components/verify-email/verify-email.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { MaterialModule } from 'src/app/shared-modules/material/material.module';
import { GuestRegisterComponent } from './components/guest-register/guest-register.component';
import { UserTestimonialComponent } from './components/user-testimonial/user-testimonial.component';
import { SwiperModule } from 'swiper/angular';


@NgModule({
  declarations: [
    SignUpComponent,
    VerifyEmailComponent,
    SignInComponent,
    GuestRegisterComponent,
    UserTestimonialComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    SwiperModule,
    UnauthorizedRoutingModule
  ]
})
export class UnauthorizedModule { }
