import { Component, HostBinding, OnInit } from '@angular/core';

import { FilterService } from './services/filter-service';

import { Subscription }   from 'rxjs/Subscription';

@Component({
  selector: 'app-dashboard',
  styleUrls: ['./dashboard.component.scss'],
  templateUrl: './dashboard.component.html',
  providers:[FilterService],
})
export class DashboardComponent implements OnInit {

  showFilters: boolean;
  subscription : Subscription;

  constructor(private filterService:FilterService){
    this.subscription = this.filterService.showFilters.subscribe(
       showFiltersVal => { this.showFilters = showFiltersVal }
     );
  }

  ngOnInit(){
    this.filterService.setShowFilters(false);

  }

}
