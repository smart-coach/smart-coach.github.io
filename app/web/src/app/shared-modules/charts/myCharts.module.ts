import { NgModule } from '@angular/core';
//for chart.js
import { NgChartsModule } from 'ng2-charts';

@NgModule({
  exports: [
    NgChartsModule
  ]
})
export class MyChartsModule { }
