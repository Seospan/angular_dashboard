import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { FilterService } from '../services/filter-service';
import { DataFaudDetectorService } from '../services/data-fraud-detector.service';
import { Advertiser, Brand, Kpi, MetaCampaign, Product, KpiAction, Partner } from '../../models/server-models/index';
import { Subscription }   from 'rxjs/Subscription';
import { crossfilter } from 'crossfilter';

@Component({
  selector: 'app-fraud-detector',
  templateUrl: './fraud-detector.component.html',
  styleUrls: ['./fraud-detector.component.css'],
})
export class FraudDetectorComponent implements OnInit {
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
            advertisersArray => { this.advertisers = advertisersArray; console.log("Advertisers updated in fraud detector component"); console.log(this.advertisers);  }
        );
        this.subscriptionPartners = this.filterService.partners.subscribe(
            partnersArray => { this.partners = partnersArray; console.log("partners updated in fraud detector component"); console.log(this.partners);  }
        );
        this.subscriptionKpis = this.filterService.kpis.subscribe(
            kpisArray => { this.kpis = kpisArray; console.log("Kpis updated in fraud detector component"); console.log(this.kpis);  }
        );
        this.subscriptionMetaCampaigns = this.filterService.metaCampaigns.subscribe(
            metaCampaignsArray => { this.metaCampaigns = metaCampaignsArray; console.log("MetaCampaigns updated in fraud detector component"); console.log(this.metaCampaigns);  }
        );
        this.subscriptionDataFraudDetector = this.dataFraudDetectorService.dataFraudDetector.subscribe(
            dataFraudDetectorRaw => { console.log("!!!!!"); this.dataFraudDetector = crossfilter(dataFraudDetectorRaw); console.log("DataFraudDetector updated in fraud detector component"); console.log(this.dataFraudDetector);  }
        );
        console.log("constructor fraud detector");
    }

    ngOnInit(){
        console.log("getting data1");
        this.filterService.setShowFilters(true);
        console.log("getting data");
        this.dataFraudDetectorService.setDataFraudDetector();

                console.log(this.dataFraudDetector);

    }

  /*disableAdvertiser(advId){
    this.advertisers = this.advertisers.map(function(e,index){ if(e.sizmekId == advId){ e.isSelected=false; } return e; });
    //this.filterService.setAdvertisersTo(this.advertisers);
  }*/

}
