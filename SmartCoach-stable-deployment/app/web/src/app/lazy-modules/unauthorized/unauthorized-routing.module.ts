import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { VerifyEmailComponent } from './components/verify-email/verify-email.component';
import { OnlyNotLoggedInUsersGuard } from 'src/app/services/route-guards/only-not-logged-in-users-guard.service';
import { GuestRegisterComponent } from './components/guest-register/guest-register.component';
import { UserTestimonialComponent } from './components/user-testimonial/user-testimonial.component';

const routes: Routes = [
  { path: 'login', component: SignInComponent, canActivate: [OnlyNotLoggedInUsersGuard] },
  { path: 'register', component: SignUpComponent, canActivate: [OnlyNotLoggedInUsersGuard] },
  { path: 'guestRegister', component: GuestRegisterComponent, canActivate: [OnlyNotLoggedInUsersGuard] },
  { path: 'verify', component: VerifyEmailComponent },
  { path: 'testimonials', component: UserTestimonialComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UnauthorizedRoutingModule { }
