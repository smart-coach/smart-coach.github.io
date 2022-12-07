import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckoutButtonComponent } from './components/checkout-button/checkout-button.component';
import { MaterialModule } from '../material/material.module';

@NgModule({
  declarations: [
    CheckoutButtonComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
  ],
  exports: [
    CheckoutButtonComponent
  ]
})
export class CheckoutButtonModule { }
