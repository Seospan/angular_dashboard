import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
//import { FilterService } from '../services/filter-service';

@Component({
  selector: 'app-fraud-detector',
  templateUrl: './fraud-detector.component.html',
  styleUrls: ['./fraud-detector.component.css'],
})
export class FraudDetectorComponent implements OnInit {
  //@Output() showFilterEvent = new EventEmitter<boolean>();

//  showFilters : boolean;

  //constructor(private filterService : FilterService){}
  constructor(){}
  ngOnInit(){
    //setShowFilters(false);
    //this.filterService.showFilters = true;
  //  this.showFilters = true;
    //this.showFilters = this.FilterService.getShowFilters();
  }

}
