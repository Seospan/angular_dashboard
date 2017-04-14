import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs/Subject';
import { BehaviorSubject }    from 'rxjs/BehaviorSubject';
import { Subscription }   from 'rxjs/Subscription';
import { Advertiser, Brand, Kpi, MetaCampaign, Product, KpiAction, Partner } from '../../models/server-models/index'
import { AttributionModel } from '../../models/server-models/index';
import { AuthenticationService, AdvertiserService, PartnerService, KpiService, MetaCampaignService, AttributionModelService } from '../../_services/index';

import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { UserService } from '../../_services/user.service';

import 'rxjs/add/operator/toPromise';

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

    private _attributionModels : AttributionModel[];

    get attributionModels(){ return this._attributionModels}
    set attributionModels(val){ this.debugLog("SETTER ATTRIBUTION MODEL"); this._attributionModels = val; }

    dateValues = new Subject<any>();
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

    selectedAttributionModelId : string;

    dataFraudDetectorRequest : BehaviorSubject<{startDate, endDate, selectedAttributionModelId}>;

    /**
     * [constructor description]
     * @method constructor
     * @param  {Http}                privatehttp                 http service provided for whole app
     * @param  {AdvertiserService}   privateadvertisersService   AdvertiserService - for getting filters form API
     * @param  {PartnerService}      privatepartnersService      PartnerService - for getting filters form API
     * @param  {KpiService}          privatekpisService          KpiService - for getting filters form API
     * @param  {MetaCampaignService} privatemetaCampaignsService MetaCampaignService - for getting filters form API
     */
    constructor(
        private http : Http,
        private advertisersService : AdvertiserService,
        private partnersService : PartnerService,
        private kpisService : KpiService,
        private metaCampaignsService : MetaCampaignService,
        private attributionModelsService : AttributionModelService,
     ) {
         let days = 86400000;
         let today = Date.now();
         this.dateRange = {
             //TODO : remettre dates par défaut
             //startDate : new Date(today - (8*days)),
             startDate : new Date("2016-01-01"),
             //endDate : new Date(today - (1*days)),
             endDate : new Date("2016-03-01"),
         };
         this.selectedAttributionModelId = this.DEFAULT_ATTRIBUTION_MODEL;
         this.dataFraudDetectorRequest = new BehaviorSubject<{startDate, endDate, selectedAttributionModelId}>(
             {startDate : this.dateRange.startDate, endDate : this.dateRange.endDate, selectedAttributionModelId : this.selectedAttributionModelId}
         );
         this.debugLog("Constructor filter service w dates "+this.dateRange.startDate+" "+this.dateRange.endDate);
         this.advertisers = [];
         this.partners = [];
         this.kpis = [];
         this.metaCampaigns = [];
         this.attributionModels = [];
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
        ).catch(function(rejected){
            console.error("PROMISE REJECTED : ");
            console.error(rejected);
        });
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
        ).catch(function(rejected){
            console.error("PROMISE REJECTED : ");
            console.error(rejected);
        });
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
        ).catch(function(rejected){
            console.error("PROMISE REJECTED : ");
            console.error(rejected);
        });
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
        ).catch(function(rejected){
            console.error("PROMISE REJECTED : ");
            console.error(rejected);
        });
    }

    initAttributionModels():void{
        this.attributionModelsService.getAll().then(
                attributionModels => {
                    this.debugLog("RESULT AttributionModels");
                    this.debugLog(attributionModels);
                    //Puts modified value in to attributionModels
                    this.attributionModels = attributionModels;
                    this.selectedAttributionModelId = attributionModels.filter(function(e){ return e.is_default_model==true })[0].id.toString();
            },
        ).catch(function(rejected){
            console.error("PROMISE REJECTED : ");
            console.error(rejected);
        });
    }

    getDateRange(){
        return this.dateRange;
    }

    setDateRange(dateRange){
        this.dateRange = dateRange;
        this.debugLog("Setter from dateRange attributes triggers data recalculation");
        this.dataFraudDetectorRequest.next(
            {startDate : this.dateRange.startDate, endDate : this.dateRange.endDate, selectedAttributionModelId : this.selectedAttributionModelId}
        );
    }

    setAttributionModelId(selectedAttributionModelId){
        this.selectedAttributionModelId = selectedAttributionModelId;
        this.debugLog("Setter from attribution model triggers data recalculation");
        this.dataFraudDetectorRequest.next(
            {startDate : this.dateRange.startDate, endDate : this.dateRange.endDate, selectedAttributionModelId : this.selectedAttributionModelId}
        );
    }

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
       console.log("Intermediate");
       console.log(allAdvertisers);
       console.log(selectableAdvertisers);
       this.advertisers = allAdvertisers.map(function(e){
           console.log("Edit Advertisers");
           if(selectableAdvertisers.indexOf(e.sizmek_id)!=-1){
               console.log("Comparing "+e.sizmek_id);
                e.isSelectable = true;
                console.log(e);
                return e;
             }
           else{
               e.isSelectable = false;
               return e;
           }
       });
       this.partners = allPartners.map(function(e){
           if(selectablePartners.indexOf(e.id)!=-1){ e.isSelectable = true; return e; }
           else{ return e; }
       });
       this.kpis = allKpis.map(function(e){
           if(selectableKpis.indexOf(e.id)!=-1){ e.isSelectable = true; return e; }
           else{
               e.isSelectable = false;
               return e;
           }
       });
       this.metaCampaigns = allMetaCampaigns.map(function(e){
           if(selectableMetaCampaigns.indexOf(e.id)!=-1){ e.isSelectable = true; return e; }
           else{
               e.isSelectable = false;
               return e;
           }
       });
       console.log("Advertisers afterupdate");
       console.log(this.advertisers);
       console.log(this);
    }

    initAllFilters():void{
      this.initAdvertisers();
      this.initPartners();
      this.initKpis();
      this.initMetaCampaigns();
    }

}
