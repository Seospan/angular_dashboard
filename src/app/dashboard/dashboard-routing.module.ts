import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './dashboard.component';
import { FraudDetectorComponent } from './fraud-detector/fraud-detector.component';

const dashboardRoutes: Routes = [
  {
    children: [{
        component: FraudDetectorComponent,
        path: 'fraud',
      },/* {
        component: NavViewComponent,
        path: 'nav-view',
      }, {
        component: NavListComponent,
        path: 'nav-list',
      }, {
        component: CardOverComponent,
        path: 'card-over',
      }, {
        component: ManageListComponent,
        path: 'manage-list',
      },*/
    ],
  path: '',  component: DashboardComponent },
];
@NgModule({
  imports: [
    RouterModule.forChild(dashboardRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class DashboardRoutingModule { }
