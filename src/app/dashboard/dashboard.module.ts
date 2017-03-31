import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { dashboardRoutes } from './dashboard.routes';

import { DashboardComponent } from './dashboard.component';
//import { DashoverviewComponent } from './dashoverview/dashoverview.component';

import { CovalentCoreModule } from '@covalent/core';
import { CovalentHighlightModule } from '@covalent/highlight';

import { CovalentDataTableModule } from '@covalent/core';
import { FraudDetectorComponent } from './fraud-detector/fraud-detector.component';

@NgModule({
  imports: [
    CommonModule,
    CovalentCoreModule,
    CovalentHighlightModule,
    dashboardRoutes,
    CovalentDataTableModule.forRoot(),
  ],
  declarations: [
    DashboardComponent,
    FraudDetectorComponent,
    //DashoverviewComponent,
  ]
})
export class DashboardModule { }
