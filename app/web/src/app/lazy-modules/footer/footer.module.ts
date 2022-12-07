import { NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterRoutingModule } from './footer-routing.module';
import { TermsComponent } from './components/terms/terms.component';
import { PrivacyComponent } from './components/privacy/privacy.component';
import { MaterialModule } from 'src/app/shared-modules/material/material.module';
import { TextModule } from 'src/app/shared-modules/text/text.module';
import { CheckoutButtonModule } from 'src/app/shared-modules/checkout-button/checkout-button.module';
import { CreateAccountButtonModule } from 'src/app/shared-modules/create-account-button/create-account-button.module';


@NgModule({
  declarations: [
    TermsComponent,
    PrivacyComponent], 
  imports: [
    CommonModule,
    FooterRoutingModule,
    MaterialModule,
    TextModule,
    CheckoutButtonModule,
    CreateAccountButtonModule
  ],
})
export class FooterModule { }
