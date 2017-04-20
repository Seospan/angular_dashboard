import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { FilterService } from '../services/filter-service';
import { DataFaudDetectorService } from '../services/data-fraud-detector.service';
import { Advertiser, Brand, Kpi, MetaCampaign, Product, KpiAction, Partner } from '../../models/server-models/index';
import { Subscription }   from 'rxjs/Subscription';


@Component({
  selector: 'app-fraud-detector',
  templateUrl: './fraud-detector.component.html',
  styleUrls: ['./fraud-detector.component.css'],
})
export class FraudDetectorComponent implements OnInit {
    DEBUG: boolean = true;
    private debugLog(str){ this.DEBUG && console.log(str); }

    subscriptionDataFraudDetector : Subscription;

    constructor(private filterService : FilterService, private dataFraudDetectorService : DataFaudDetectorService){
        this.debugLog("constructor fraud detector");
    }

    ngOnInit(){
        this.debugLog("getting data1");
        this.filterService.setShowFilters(true);
        this.debugLog("getting data");
    }

}
