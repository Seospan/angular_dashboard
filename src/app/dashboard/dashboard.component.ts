import { Component, HostBinding, OnInit } from '@angular/core';



@Component({
  selector: 'app-dashboard',
  styleUrls: ['./dashboard.component.scss'],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {

  showFilters: boolean;

  constructor(){}

  ngOnInit(){
    //setShowFilters(false);
    //this.filterService.showFilters = false;
    this.showFilters = true;
    //this.showFilters = this.FilterService.getShowFilters();
  }

}
