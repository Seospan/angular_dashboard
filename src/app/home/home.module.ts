import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CovalentCoreModule } from '@covalent/core';

import { HomeComponent } from './home.component';

import { HomeRoutingModule } from './home-routing.module';

import { DashboardModule } from '../dashboard/dashboard.module';

@NgModule({
  imports: [
    CommonModule,
    DashboardModule,
    HomeRoutingModule,
    CovalentCoreModule,
  ],
  declarations: [HomeComponent]
})
export class HomeModule { }
