import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CovalentCoreModule } from '@covalent/core';

import { HomeComponent } from './home.component';

import { HomeRoutingModule } from './home-routing.module';

import { DashboardModule } from '../dashboard/dashboard.module';
import { DefaultComponent } from './default/default.component';

@NgModule({
  imports: [
    CommonModule,
    HomeRoutingModule,
    //DashboardModule,
    CovalentCoreModule,
  ],
  declarations: [HomeComponent, DefaultComponent]
})
export class HomeModule { }
