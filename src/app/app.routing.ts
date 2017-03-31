import { Routes, RouterModule }   from '@angular/router';

import { LoginComponent } from './login/index';
import { HomeComponent } from './home/home.component';

import { AuthGuard } from './auth.guard';

const appRoutes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '**',
    redirectTo: '/'
  }
];

export const appRoutingProviders: any[] = [

];

export const routing = RouterModule.forRoot(appRoutes, { useHash: true });
