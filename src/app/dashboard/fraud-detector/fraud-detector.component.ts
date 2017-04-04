import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { FilterService } from '../services/filter-service';

@Component({
  selector: 'app-fraud-detector',
  templateUrl: './fraud-detector.component.html',
  styleUrls: ['./fraud-detector.component.css'],
})
export class FraudDetectorComponent implements OnInit {

  constructor(private filterService : FilterService){
    console.log("constructor fraud detector");
  }

  ngOnInit(){
    this.filterService.setShowFilters(true);
  }


}
