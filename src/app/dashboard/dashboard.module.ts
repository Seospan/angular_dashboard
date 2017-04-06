import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';

import { CovalentCoreModule } from '@covalent/core';
import { CovalentHighlightModule } from '@covalent/highlight';

import { DashboardComponent } from './dashboard.component';

import { CovalentDataTableModule } from '@covalent/core';
import { FraudDetectorComponent } from './fraud-detector/fraud-detector.component';
import { MultiAttributionComponent } from './multi-attribution/multi-attribution.component';
import { DefaultComponent } from './default/default.component';
import { ReportingComponent } from './reporting/reporting.component';

import { FilterService } from './services/filter-service';
import { DataFaudDetectorService } from './services/data-fraud-detector.service';
import { AdvertiserService,
        PartnerService,
        KpiService,
        MetaCampaignService,
    } from '../_services/index';

import { FiltersComponent } from './filters/filters.component';

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
    DefaultComponent,
    ReportingComponent,
    FiltersComponent,
  ],
  providers: [
    FilterService,
    AdvertiserService,
    PartnerService,
    KpiService,
    MetaCampaignService,
    DataFaudDetectorService,
  ]
})
export class DashboardModule {
 }
