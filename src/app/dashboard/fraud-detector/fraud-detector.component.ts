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

    //Elements of filtering
    advertisers : Advertiser[];
    subscriptionAdvertisers : Subscription;
    partners : Partner[];
    subscriptionPartners : Subscription;
    kpis : Kpi[];
    subscriptionKpis : Subscription;
    metaCampaigns : MetaCampaign[];
    subscriptionMetaCampaigns : Subscription;

    dataFraudDetector : any;
    subscriptionDataFraudDetector : Subscription;

    constructor(private filterService : FilterService, private dataFraudDetectorService : DataFaudDetectorService){
        this.subscriptionAdvertisers = this.filterService.advertisers.subscribe(
            advertisersArray => { this.advertisers = advertisersArray; this.debugLog("Advertisers updated in fraud detector component"); this.debugLog(this.advertisers);  }
        );
        this.subscriptionPartners = this.filterService.partners.subscribe(
            partnersArray => { this.partners = partnersArray; this.debugLog("partners updated in fraud detector component"); this.debugLog(this.partners);  }
        );
        this.subscriptionKpis = this.filterService.kpis.subscribe(
            kpisArray => { this.kpis = kpisArray; this.debugLog("Kpis updated in fraud detector component"); this.debugLog(this.kpis);  }
        );
        this.subscriptionMetaCampaigns = this.filterService.metaCampaigns.subscribe(
            metaCampaignsArray => { this.metaCampaigns = metaCampaignsArray; this.debugLog("MetaCampaigns updated in fraud detector component"); this.debugLog(this.metaCampaigns);  }
        );
        this.subscriptionDataFraudDetector = this.dataFraudDetectorService.dataFraudDetector.subscribe(
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


                //
                /*this.debugLog("!!!!!");
                /*this.debugLog("!!!!!");
                this.dataFraudDetector = crossfilter(dataFraudDetectorRaw);
                var dataFilterByAdvertiserDimension;

                this.debugLog("SIZE1");
                this.debugLog(this.dataFraudDetector.size());

                let advertiserFilter = [50631, 50635];
                if(advertiserFilter.length > 0) {
                    this.debugLog("entering crossfilter advertiser filter");
                    dataFilterByAdvertiserDimension = this.dataFraudDetector.dimension(function(d) { return d.advertiser_id });
                    var dataSet = dataFilterByAdvertiserDimension.filterFunction(function(d) { return (advertiserFilter.indexOf(d)  !== -1) }).top(Infinity);

                    var dataDateDimension = this.dataFraudDetector.dimension(function(d) { return d.conversion_date });
                    var conversionsByDate = dataDateDimension.group().reduceSum(function(d) { return d.conversions}).all();

                    this.debugLog("SIZE");
                    this.debugLog(this.dataFraudDetector.size());
                    this.debugLog(dataSet);
                    this.debugLog("Dataset by date");
                    this.debugLog(conversionsByDate);
                }*/

                this.debugLog("DataFraudDetector updated in fraud detector component");
                this.debugLog(this.dataFraudDetector);

            }
        );
        this.debugLog("constructor fraud detector");
    }

    ngOnInit(){
        this.debugLog("getting data1");
        this.filterService.setShowFilters(true);
        this.debugLog("getting data");
        this.dataFraudDetectorService.setDataFraudDetector();
    }

}
