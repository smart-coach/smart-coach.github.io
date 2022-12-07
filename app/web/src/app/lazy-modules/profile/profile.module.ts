import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileRoutingModule } from './profile-routing.module';
import { UserProfileDisplayComponent } from './components/user-profile-display/user-profile-display.component';
import { PreferencesComponent } from './components/preferences/preferences.component';
import { MaterialModule } from 'src/app/shared-modules/material/material.module';
import { PipesModule } from 'src/app/shared-modules/pipes/pipes.module';
import { DirectivesModule } from 'src/app/shared-modules/directives/directives.module';
import { AccountComponent } from './components/account/account.component';
import { CheckoutButtonModule } from 'src/app/shared-modules/checkout-button/checkout-button.module';
import { MobileReminderConfigComponent } from './components/mobile-reminder-config/mobile-reminder-config.component';
import { CreateAccountButtonModule } from 'src/app/shared-modules/create-account-button/create-account-button.module';


@NgModule({
  declarations: [
    UserProfileDisplayComponent,
    PreferencesComponent,
    AccountComponent,
    MobileReminderConfigComponent
  ],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    MaterialModule,
    PipesModule,
    DirectivesModule,
    CheckoutButtonModule,
    CreateAccountButtonModule
  ]
})
export class ProfileModule { }
