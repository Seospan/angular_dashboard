import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home.component';
import { DefaultComponent } from './default/default.component'

//import { DashboardComponent } from '../dashboard/dashboard.component';
import { DashboardModule } from '../dashboard/dashboard.module'
import { AuthGuard } from '../auth.guard';

export const homeRoutes : Routes = [
  {
    path: 'home',
    component: HomeComponent,
    children: [
      // This is the default route for somebody who goes to home.
      {
        path: '',
        component: DefaultComponent
      },
      {
        path: 'dashboard',
        //loadChildren: '../dashboard/dashboard.module#DashboardModule'
        loadChildren: () => DashboardModule
      },
    ]
  },
  /*
  the redirect to home on '' must be place here because otherwise,
  the dashboard '' route will take precedence.
  */
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
];
@NgModule({
  imports: [
    RouterModule.forChild(homeRoutes),
  ],
  exports: [
    RouterModule
  ]
})
export class HomeRoutingModule { }
