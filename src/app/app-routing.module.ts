import { NgModule }              from '@angular/core';
import { RouterModule, Routes }  from '@angular/router';

import { LoginComponent } from './login/index';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';

import { AuthGuard } from './auth.guard';

const appRoutes: Routes =  [
  { path: '', component: AppComponent,
    children:[
      {
        path: 'home',
        component: HomeComponent,
      }
    ]
 },
  {
    path: 'login',
    component: LoginComponent
  },
  { path: '**', redirectTo:'/home', canActivate: [AuthGuard], pathMatch:"full" },
 /*{
    path: '**',
    redirectTo: '/home'
  }*/
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {}
