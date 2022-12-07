import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardParentComponent } from './components/dashboard-parent/dashboard-parent.component';

const routes: Routes = [
  { path: '', component: DashboardParentComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
