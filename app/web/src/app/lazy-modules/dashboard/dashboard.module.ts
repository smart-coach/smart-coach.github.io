import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { MaterialModule } from 'src/app/shared-modules/material/material.module';
import { NutritionLogSummaryComponent } from './components/nutrition-log-summary/log-summary.component';
import { PipesModule } from 'src/app/shared-modules/pipes/pipes.module';
import { SocialModule } from 'src/app/shared-modules/social-dashboard/social-module';
import { IndividualDashboardComponent } from './components/individual-dashboard/dashboard.component';
import { DashboardParentComponent } from './components/dashboard-parent/dashboard-parent.component';
import { NgChartsModule } from 'ng2-charts';
import { NgParticlesModule } from 'ng-particles';

@NgModule({
  declarations: [IndividualDashboardComponent, NutritionLogSummaryComponent, DashboardParentComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    MaterialModule,
    PipesModule,
    SocialModule,
    NgChartsModule,
    NgParticlesModule
  ]
})
export class DashboardModule { }
