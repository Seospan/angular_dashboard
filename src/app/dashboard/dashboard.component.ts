import { Component, HostBinding, OnInit } from '@angular/core';
import { FilterService } from './services/filter-service';
import { Subscription }   from 'rxjs/Subscription';

@Component({
  selector: 'app-dashboard',
  styleUrls: ['./dashboard.component.scss'],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {

  showFilters: boolean;
  subscription : Subscription;

  constructor(private filterService:FilterService){
    this.subscription = this.filterService.showFilters.subscribe({
       next : showFiltersVal => { this.showFilters = showFiltersVal },
       error: (err) => console.error(err),
   });
  }

  ngOnInit(){
    this.filterService.setShowFilters(false);
    console.log("dashboard init");
  }

}
