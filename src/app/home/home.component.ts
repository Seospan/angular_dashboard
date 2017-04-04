import { Component, HostBinding, OnInit } from '@angular/core';

import { fadeAnimation } from '../app.animations';
import { DashboardComponent } from '../dashboard/dashboard.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [fadeAnimation],
})

export class HomeComponent implements OnInit {


  @HostBinding('@routeAnimation') routeAnimation: boolean = true;
  @HostBinding('class.td-route-animation') classAnimation: boolean = true;

  updates: Object[] = [{
      description: 'File Input component',
      icon: 'space_bar',
      route: 'components/file-input',
      title: 'New component',
    }, {
      description: 'NGX Translate',
      icon: 'language',
      route: 'components/ngx-translate',
      title: 'New supported feature',
    }, {
      description: 'Route on toolbar logos',
      icon: 'dashboard',
      route: 'layouts',
      title: 'Component updated',
    }, {
      description: 'Data Table additional features',
      icon: 'grid_on',
      route: 'components/data-table',
      title: 'Component updated',
    }, {
      description: 'File upload refactored',
      icon: 'attach_file',
      route: 'components/file-upload',
      title: 'Component updated',
    }, {
      description: 'Paging Bar additional features',
      icon: 'swap_horiz',
      route: 'components/paging',
      title: 'Component updated',
    },
  ];

  constructor() {
  }

  ngOnInit(): void {
    
  }

}
