import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { FilterService } from '../services/filter-service';
import { DataFaudDetectorService } from '../services/data-fraud-detector.service';
import { Advertiser, Brand, Kpi, MetaCampaign, Product, KpiAction, Partner } from '../../models/server-models/index';
import { Subscription }   from 'rxjs/Subscription';

declare var universe: any;
import '../../../../assets/js/universe.min.js';
//declare var crossfilter: any;
//import '../../../../assets/js/crossfilter.min.js';

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
        /*this.subscriptionDataFraudDetector = this.dataFraudDetectorService.dataFraudDetector.subscribe(
            dataFraudDetectorRaw => {
                //this.dataFraudDetector = dataFraudDetectorRaw;
                this.debugLog("Raw Data");
                this.debugLog(dataFraudDetectorRaw);

                universe(dataFraudDetectorRaw)
                    .then(myUniverse => {
                        this.debugLog("THIS");
                        return myUniverse.filter('advertiser_id',50629);
                    })
                    .then(myUniverse => {
                        return myUniverse.query({
                            groupBy: 'conversion_date',
                            select: {$sum : 'conversions'}
                        });
                    }).then(res => {
                        this.debugLog("Universe");
                        this.debugLog(res.data);
                        this.dataFraudDetector = res;
                    })
                    .catch(function(rejected){
                        console.error("PROMISE REJECTED : ");
                        console.error(rejected);
                    });

                this.debugLog("DataFraudDetector updated in fraud detector component");
                this.debugLog(this.dataFraudDetector);

            }
        );*/
        this.debugLog("constructor fraud detector");
    }

    ngOnInit(){
        this.debugLog("getting data1");
        this.filterService.setShowFilters(true);
        this.debugLog("getting data");
    }

}
