import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';


import { CovalentCoreModule } from '@covalent/core';
import { CovalentHighlightModule } from '@covalent/highlight';

import { DashboardComponent } from './dashboard.component';

import { CovalentDataTableModule } from '@covalent/core';
import { FraudDetectorComponent } from './fraud-detector/fraud-detector.component';
import { MultiAttributionComponent } from './multi-attribution/multi-attribution.component';

@NgModule({
  imports: [
    CommonModule,
    CovalentCoreModule,
    CovalentHighlightModule,
    DashboardRoutingModule,
    CovalentDataTableModule.forRoot(),
  ],
  declarations: [
    DashboardComponent,
    FraudDetectorComponent,
    MultiAttributionComponent,
  ]
})
export class DashboardModule {
 }
