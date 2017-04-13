import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs/Subject';
import { BehaviorSubject }    from 'rxjs/BehaviorSubject';
import { Subscription }   from 'rxjs/Subscription';
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
    private _advertisers : Advertiser[];
    private _partners : Partner[];
    private _kpis : Kpi[];
    private _metaCampaigns : MetaCampaign[];

    get advertisers(){ return this._advertisers; }
    set advertisers(val){ this.debugLog("SETTER ADV"); this._advertisers = val; }

    get partners(){ return this._partners; }
    set partners(val){ this.debugLog("SETTER PARTNER"); this._partners = val; }

    get kpis(){ return this._kpis; }
    set kpis(val){ this.debugLog("SETTER KPI"); this._kpis = val; }

    get metaCampaigns(){ return this._metaCampaigns; }
    set metaCampaigns(val){ this.debugLog("SETTER METAC"); this._metaCampaigns = val; }

    /**
     * Filters subjects :
     * Used to combine with data. If initFilteer did edit the attribute, dataFraudDetectorService
     * wouldn't be able to verify filters are already instanciated before mapping the selectable filters
     * (Depending of spcific dataset)
     * Filter attribute setting is delegated to DataFaudDetectorService with combineLatest
     */
    advertisersSubject = new Subject<Advertiser[]>();
    partnersSubject = new Subject<Partner[]>();
    kpisSubject = new Subject<Kpi[]>();
    metaCampaignsSubject = new Subject<MetaCampaign[]>();

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
         this.advertisers = [];
    }

    // private helper methods

    test(){
        console.log("TEST");
    }

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
                    //Transforms result with all isSelectable set to false by default
                    let advertisers = result.map((e) => {
                        e.isSelectable = false;
                        e.isSelected = true;
                        return e;
                    });
                    //Sends modified value to advertisersSubject to be caught by dataFraudDetectorSubscription
                    this.advertisersSubject.next(advertisers);
                    this.debugLog("ADVERTISERS sent to Subject");
                    this.debugLog(advertisers);
            },
        );
    }

    initPartners():void{
        this.partnersService.getAll().then(
                result => {
                    this.debugLog("RESULT Partners");
                    this.debugLog(result);
                    //Transforms result with all isSelectable set to false by default
                    let partners = result.map((e) => {
                        e.isSelectable = false;
                        e.isSelected = true;
                        return e;
                    });
                    //Sends modified value to advertisersSubject to be caught by dataFraudDetectorSubscription
                    this.partnersSubject.next(partners);
                    this.debugLog("PARTNERS sent to Subject");
                    this.debugLog(partners);
            },
        );
    }

    initKpis():void{
        this.kpisService.getAll().then(
                result => {
                    this.debugLog("RESULT Kpis");
                    this.debugLog(result);
                    //Transforms result with all isSelectable set to false by default
                    let kpis = result.map((e) => {
                        e.isSelectable = false;
                        e.isSelected = true;
                        return e;
                    });
                    //Sends modified value to advertisersSubject to be caught by dataFraudDetectorSubscription
                    this.kpisSubject.next(kpis);
                    this.debugLog("KPIS sent to Subject");
                    this.debugLog(kpis);
            },
        );
    }

    initMetaCampaigns():void{
        this.metaCampaignsService.getAll().then(
                result => {
                    this.debugLog("RESULT MetaCampaigns");
                    this.debugLog(result);
                    //Transforms result with all isSelectable set to false by default
                    let metaCampaigns = result.map((e) => {
                        e.isSelectable = false;
                        e.isSelected = true;
                        return e;
                    });
                    //Sends modified value to advertisersSubject to be caught by dataFraudDetectorSubscription
                    this.metaCampaignsSubject.next(metaCampaigns);
                    this.debugLog("METACAMPAIGNS sent to Subject");
                    this.debugLog(metaCampaigns);
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

    /*dateChange(){
        console.log("DATE CHANGE");
    }*/

   setSelectableFilters(
       selectableAdvertisers:number[],
       selectablePartners:number[],
       selectableKpis:number[],
       selectableMetaCampaigns:number[],
       allAdvertisers:Advertiser[],
       allPartners:Partner[],
       allKpis:Kpi[],
       allMetaCampaigns:MetaCampaign[],
   ):void{
       /*if(this.advertisersSubscription){ this.advertisersSubscription.unsubscribe(); }
       this.advertisersSubscription = this.advertisersSubject.subscribe(
           result => {
               console.log("Intermediate");
               console.log(result);
               console.log(this.advertisers);
               this.advertisers = result.map(function(e){
                   console.log("ADV ID");
                   console.log(advId.indexOf(e.sizmek_id));
                   if(advId.indexOf(e.sizmek_id)!=-1){ e.isSelectable = true; return e; }
                   else{ return e; }
               });
            }
       );*/
       console.log("Intermediate");
       console.log(this.advertisers);
       this.advertisers = allAdvertisers.map(function(e){
           if(selectableAdvertisers.indexOf(e.sizmek_id)!=-1){ e.isSelectable = true; return e; }
           else{ return e; }
       });
       this.partners = allPartners.map(function(e){
           if(selectablePartners.indexOf(e.id)!=-1){ e.isSelectable = true; return e; }
           else{ return e; }
       });
       this.kpis = allKpis.map(function(e){
           if(selectableKpis.indexOf(e.id)!=-1){ e.isSelectable = true; return e; }
           else{ return e; }
       });
       this.metaCampaigns = allMetaCampaigns.map(function(e){
           if(selectableMetaCampaigns.indexOf(e.id)!=-1){ e.isSelectable = true; return e; }
           else{ return e; }
       });
   }

    initAllFilters():void{
      this.initAdvertisers();
      this.initPartners();
      this.initKpis();
      this.initMetaCampaigns();
    }

}
