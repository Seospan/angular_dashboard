import { NgModule }              from '@angular/core';
import { RouterModule, Routes }  from '@angular/router';

import { LoginComponent } from './login/index';
import { NotFoundComponent } from './not-found/not-found.component'
import { AppComponent } from './app.component';
//import { HomeComponent } from './home/home.component';

import { AuthGuard } from './auth.guard';

const appRoutes: Routes =  [

  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '**',
    component: NotFoundComponent
  }
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
