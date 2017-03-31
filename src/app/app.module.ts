import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule }   from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

import { CovalentCoreModule } from '@covalent/core';

import { AppComponent } from './app.component';
import { routing, appRoutingProviders } from './app.routing';
import { LoginComponent } from './login/login.component';
import { AlertService, AuthenticationService, UserService } from './_services/index';

import { AuthGuard } from './auth.guard';
import { AppConfig } from './app.config';
import { AlertComponent } from './alert/alert.component';
import { HomeComponent } from './home/home.component';

import { DashboardModule } from './dashboard/dashboard.module';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AlertComponent,
    HomeComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    CovalentCoreModule.forRoot(),
    routing,
    DashboardModule
  ],
  providers: [
    AppConfig,
    AuthGuard,
    AlertService,
    AuthenticationService,
    UserService,
    appRoutingProviders,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
