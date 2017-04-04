import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './dashboard.component';
import { DefaultComponent } from './default/default.component'
import { FraudDetectorComponent } from './fraud-detector/fraud-detector.component';
import { MultiAttributionComponent } from './multi-attribution/multi-attribution.component'
import { ReportingComponent } from './reporting/reporting.component'

const dashboardRoutes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        component: DefaultComponent,
        path: '',
      },
      {
        component: FraudDetectorComponent,
        path: 'fraud-detector',
      }, {
        component: MultiAttributionComponent,
        path: 'multi-attribution',
      }, {
        component: ReportingComponent,
        path: 'reporting',
      }
    ]
  },
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
