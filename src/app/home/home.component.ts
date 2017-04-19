import { Component, HostBinding, OnInit } from '@angular/core';

import { fadeAnimation } from '../app.animations';
import { DashboardComponent } from '../dashboard/dashboard.component';

import { RLikeDataTable } from '../models/app-models/r-like-datatable';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [fadeAnimation],
})
export class HomeComponent implements OnInit {

  currentUser : any;

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

  //a = new RLikeDataTable();

  constructor() {
      /*this.a.createFromObjectArray(this.updates)
      this.a.createFromObjectArray(this.updates)
      console.log(this.a.data)
      this.a.addColumn('truc', [1,2,3,4,5,6])
      this.a.addColumn('truc2', [1,2,3,4,5,6])
      this.a.computeNewColumn("res", (foo, bar) => { return foo+bar }, "truc", "truc2")
      console.log(this.a.getColumn("truc"))
      console.log(this.a.singleTest("truc", e => { return e%2==0 }))
      this.a.simpleFilter(this.a.singleTest("truc", e => { return e%2==0 }))
      console.log(this.a.getColumn("truc"))
      console.log(this.a.getObjectArray())
      console.log("prout")
      console.log(this.a.data)*/
  }

  ngOnInit(): void {
      console.log("Gettinf user from localstorage");
      //this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if(JSON.parse(localStorage.getItem('currentUser'))){
          this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
      }else{
          this.currentUser = {};
      }
      console.log(this.currentUser);
  }

}
