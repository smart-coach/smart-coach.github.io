import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateAccountButtonComponent } from './components/create-account-button/create-account-button.component';
import { MaterialModule } from '../material/material.module';

@NgModule({
  declarations: [
    CreateAccountButtonComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
  ],
  exports: [
    CreateAccountButtonComponent
  ]
})
export class CreateAccountButtonModule { }