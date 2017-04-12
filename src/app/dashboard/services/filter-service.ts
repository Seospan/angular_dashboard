import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs/Subject';
import { BehaviorSubject }    from 'rxjs/BehaviorSubject';
import { Advertiser, Brand, Kpi, MetaCampaign, Product, KpiAction, Partner } from '../../models/server-models/index'
import { AuthenticationService, AdvertiserService, PartnerService, KpiService, MetaCampaignService } from '../../_services/index';

import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { UserService } from '../../_services/user.service';

import 'rxjs/add/operator/toPromise';

import { DateModel } from 'ng2-datepicker';

@Injectable()
export class FilterService {
    DEBUG : boolean = true;
    private debugLog(str){ this.DEBUG && console.log(str); }
    DEFAULT_FILTER_STATE : boolean = true;
    DEFAULT_ATTRIBUTION_MODEL : string = "default";

    private showFiltersSource = new Subject<boolean>();
    showFilters = this.showFiltersSource.asObservable();

    //Elements of filtering
    advertisers : Advertiser[];
    partners : Partner[];
    kpis : Kpi[];
    metaCampaigns : MetaCampaign[];

    private dateRange : {startDate, endDate};

    attributionModelId : string;

    dataFraudDetectorRequest : BehaviorSubject<{startDate, endDate, attributionModelId}>;

    constructor(private http : Http,
        private advertisersService : AdvertiserService,
        private partnersService : PartnerService,
        private kpisService : KpiService,
        private metaCampaignsService : MetaCampaignService,
     ) {
         let days = 86400000;
         let today = Date.now();
         this.dateRange = {
             startDate : new Date(today - (8*days)),
             endDate : new Date(today - (1*days)),
         };
         this.attributionModelId = this.DEFAULT_ATTRIBUTION_MODEL;
         this.dataFraudDetectorRequest = new BehaviorSubject<{startDate, endDate, attributionModelId}>(
             {startDate : this.dateRange.startDate, endDate : this.dateRange.endDate, attributionModelId : this.attributionModelId}
         );
         this.debugLog("Constructor filter service w dates "+this.dateRange.startDate+" "+this.dateRange.endDate);
    }

    // private helper methods

/*
//Set all to by default to default state DEFAULT_FILTER_STATE

this.advertisers = advertisersArray.map((e) => {
    if(e.isSelectable==true){ e.isSelected=this.DEFAULT_FILTER_STATE; }
    else{ e.isSelected=false; }
    return e;
});
 */

    private jwt() {
        // create authorization header with jwt token
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser && currentUser.token) {
            let headers = new Headers({ 'Authorization': 'JWT ' + currentUser.token });
            return new RequestOptions({ headers: headers });
        }
    }

    setShowFilters(val:boolean):boolean{
        this.showFiltersSource.next(val);
        return val;
    }

    initAdvertisers():void{
        this.advertisersService.getAll().then(
                result => {
                    this.debugLog("RESULT Advertisers");
                    this.debugLog(result);
                    //Return result with all isSelectable set to false by default
                    this.advertisers = result.map((e) => {
                        e.isSelectable=true;
                        e.isSelected = false;
                        return e;
                    });
                    this.debugLog("ADVERTISERS");
                    this.debugLog(this.advertisers);
            },
        );
    }

    initPartners():void{
        this.partnersService.getAll().then(
                result => {
                    this.debugLog("RESULT Partners");
                    this.debugLog(result);
                    //Return result with all isSelectable set to false by default
                    this.partners = result.map((e) => {
                        e.isSelectable=false;
                        e.isSelected = false;
                        return e;
                    });
            },
        );
    }

    initKpis():void{
        this.kpisService.getAll().then(
                result => {
                    this.debugLog("RESULT Kpis");
                    this.debugLog(result);
                    //Return result with all isSelectable set to false by default
                    this.kpis = result.map((e) => {
                        e.isSelectable=false;
                        e.isSelected = false;
                        return e;
                    });
            },
        );
    }

    initMetaCampaigns():void{
        this.metaCampaignsService.getAll().then(
                result => {
                    this.debugLog("RESULT MetaCampaigns");
                    this.debugLog(result);
                    //Return result with all isSelectable set to false by default
                    this.metaCampaigns = result.map((e) => {
                        e.isSelectable=true;
                        e.isSelected = false;
                        return e;
                    });
            },
        );
    }

    getDateRange(){
        return this.dateRange;
    }

    setDateRange(dateRange){
        this.dateRange = dateRange;
        this.debugLog("Setter from dateRange attributes triggers data recalculation");
        this.dataFraudDetectorRequest.next(
            {startDate : this.dateRange.startDate, endDate : this.dateRange.endDate, attributionModelId : this.attributionModelId}
        );
    }

    dateChange(){
        console.log("DATE CCHANGE");
    }
//    setSelectableAdvertisers()

    initAllFilters():void{
      this.initAdvertisers();
      this.initPartners();
      this.initKpis();
      this.initMetaCampaigns();
    }

}
