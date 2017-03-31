import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './dashboard.component';
//import { DashoverviewComponent } from './dashoverview/dashoverview.component';
import { FraudDetectorComponent } from './fraud-detector/fraud-detector.component';

const routes: Routes = [{
  children: [{
      component: FraudDetectorComponent,
      path: '',
    },/* {
      component: NavViewComponent,
      path: 'nav-view',
    }, {
      component: NavListComponent,
      path: 'nav-list',
    }, {
      component: CardOverComponent,
      path: 'card-over',
    }, {
      component: ManageListComponent,
      path: 'manage-list',
    },*/
  ],
  component: DashboardComponent,
  path: 'dashboard',
}];

export const dashboardRoutes: any = RouterModule.forChild(routes);
