import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

import { Subject }    from 'rxjs/Subject';
import { BehaviorSubject }    from 'rxjs/BehaviorSubject';
import { Subscription }   from 'rxjs/Subscription';
import 'rxjs/add/operator/toPromise';

import {
    AuthenticationService,
    AdvertiserService,
    PartnerService,
    KpiService,
    MetaCampaignService,
    AttributionModelService } from '../../_services/index';
import { UserService } from '../../_services/user.service';


import { Advertiser, Brand, Kpi, MetaCampaign, Product, KpiAction, Partner } from '../../models/server-models/index'
import { AttributionModel } from '../../models/server-models/index';


@Injectable()
export class FilterService {
    /* General options */

    DEBUG : boolean = true;
    private debugLog(str){ this.DEBUG && console.log(str); }

    /*
    This class is define to provide the services needed to keep track of the different filters value.
    As a change in the filters may or may not induce a reload of the data from the server, filters are divided in 2 categories:
        _ Filters that trigger a http request when changed:
            _ dateRange
            _ attributionModels
        _ Filters that don't trigger a http request when changed:
            _ Advertisers list
            _ KPIs list
            _ MetaCampaigns list
            _ Partners list
    */

    /******************************************************************************************************************/
    /*
    First we define the filters that trigger a http request
    */

    // Define the needed attributes
    private dateRange : {startDate, endDate};
    private _attributionModels : AttributionModel[];
    selectedAttributionModelId : string; // TODO switch to private ?

    // Associated subjects
    dataFraudDetectorRequest : BehaviorSubject<{startDate, endDate, selectedAttributionModelId}>;

    // Associated getter and setters
    get attributionModels(){ return this._attributionModels}
    set attributionModels(val){ this.debugLog("SETTER ATTRIBUTION MODEL"); this._attributionModels = val; }
    // TODO check why getDateRange instead of get dateRange
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

    // Associated methods
    initDefaultDateRange():any{
        let days = 86400000;
        let today = Date.now();
        return {
            //TODO : remettre dates par défaut
            //startDate : new Date(today - (8*days)),
            startDate : new Date("2016-01-01"),
            //endDate : new Date(today - (1*days)),
            endDate : new Date("2016-03-01"),
        };
    }


    /******************************************************************************************************************/
    /*
    Then we define the filters that don't trigger a http request.
    */

    // Define the needed attributes
    private _advertisers : Advertiser[];
    private _partners : Partner[];
    private _kpis : Kpi[];
    private _metaCampaigns : MetaCampaign[];
    private showFiltersSource = new Subject<boolean>(); // use to indicate if we should show filters ???

    // Associated subjects and observables
    showFilters = this.showFiltersSource.asObservable();

    advertisersSubject = new Subject<Advertiser[]>();
    partnersSubject = new Subject<Partner[]>();
    kpisSubject = new Subject<Kpi[]>();
    metaCampaignsSubject = new Subject<MetaCampaign[]>();

    // Default values used in the setting:
    // Should be moved to the constructor instead ???
    DEFAULT_FILTER_STATE : boolean = true;

    // Associated getter and setters
    get advertisers(){ return this._advertisers; }
    set advertisers(val){ this.debugLog("SETTER ADV"); this._advertisers = val; }

    get partners(){ return this._partners; }
    set partners(val){ this.debugLog("SETTER PARTNER"); this._partners = val; }

    get kpis(){ return this._kpis; }
    set kpis(val){ this.debugLog("SETTER KPI"); this._kpis = val; }

    get metaCampaigns(){ return this._metaCampaigns; }
    set metaCampaigns(val){ this.debugLog("SETTER METAC"); this._metaCampaigns = val; }

    setShowFilters(val:boolean):boolean{
        this.showFiltersSource.next(val);
        return val;
    }

    /**
     * Filters subjects :
     * Used to combine with data. If initFilteer did edit the attribute, dataFraudDetectorService
     * wouldn't be able to verify filters are already instanciated before mapping the selectable filters
     * (Depending of spcific dataset)
     * Filter attribute setting is delegated to DataFaudDetectorService with combineLatest
     */

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
        this.debugLog("Initiating FilterService Constructor.")
        /*
        First we need to set the filters needed to send a data request to the server to default values:
            _ dateRange using the initDefaultDateRange() method
            _ attributionModelId to "default", the server will define the proper value by itself.
        Then we need to load these values into the dataFraudDetectorRequest subject as its first values.
        */
        this.dateRange = this.initDefaultDateRange()
        this.selectedAttributionModelId = "default";
        this.dataFraudDetectorRequest = new BehaviorSubject<{startDate, endDate, selectedAttributionModelId}>({
            startDate : this.dateRange.startDate,
            endDate : this.dateRange.endDate,
            selectedAttributionModelId : this.selectedAttributionModelId
          });
        console.log(this.dataFraudDetectorRequest);

        /*
        Second we initialize the advertisers, partners, kpis, metaCampaigns and attributionModel to their initial values.
        Note that this values are getAll() from the server, so they don't need to be updated then and can be initialized
        in the constructor.
        */
        this.advertisersService.getAll().then(
            result => {
                this.debugLog("RESULT Advertisers");
                //this.debugLog(result);
                //this.debugLog(this.selectableAdvertisers);
                 //Transforms result with all isSelectable set to false by default
                 let advertisers = result.map((e) => {
                     e.isSelectable = false;
                     e.isSelected = true;
                     return e;
                 });
                 //Sends modified value to advertisersSubject to be caught by dataFraudDetectorSubscription
                this.advertisersSubject.next(advertisers);
            },)
            .catch(function(rejected){
                 console.error("PROMISE REJECTED : ");
                 console.error(rejected);
             });
        this.kpisService.getAll().then(
            result => {
                //Transforms result with all isSelectable set to false by default
                let kpis = result.map((e) => {
                    e.isSelectable = false;
                    e.isSelected = true;
                    return e;
                });
                //Sends modified value to advertisersSubject to be caught by dataFraudDetectorSubscription
                this.kpisSubject.next(kpis);
            },)
            .catch(function(rejected){
            console.error("PROMISE REJECTED : ");
            console.error(rejected);
            });
        this.metaCampaignsService.getAll().then(
            result => {
                let metaCampaigns = result.map((e) => {
                e.isSelectable = false;
                e.isSelected = true;
                return e;
            });
                     //Sends modified value to advertisersSubject to be caught by dataFraudDetectorSubscription
            this.metaCampaignsSubject.next(metaCampaigns);
            },)
            .catch(function(rejected){
                console.error("PROMISE REJECTED : ");
                console.error(rejected);
            });
        this.partnersService.getAll().then(
                result => {
                    //Transforms result with all isSelectable set to false by default
                    let partners = result.map((e) => {
                        e.isSelectable = false;
                        e.isSelected = true;
                        return e;
                    });
                    //Sends modified value to advertisersSubject to be caught by dataFraudDetectorSubscription
                    this.partnersSubject.next(partners);
            },
            ).catch(function(rejected){
                console.error("PROMISE REJECTED : ");
                console.error(rejected);
            });
        this.attributionModelsService.getAll().then(
                    attributionModels => {
                        //this.debugLog("RESULT AttributionModels");
                        //this.debugLog(attributionModels);
                        //Puts modified value in to attributionModels
                        this.attributionModels = attributionModels;
                        this.selectedAttributionModelId = attributionModels.filter(function(e){ return e.is_default_model==true })[0].id.toString();
                },
            ).catch(function(rejected){
                console.error("PROMISE REJECTED : ");
                console.error(rejected);
            });
    }



    initAttributionModels():void{

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
       //console.log("Intermediate");
       //console.log(allAdvertisers);
       //console.log(selectableAdvertisers);
       this.advertisers = allAdvertisers.map(function(e){
           //console.log("Edit Advertisers");
           if(selectableAdvertisers.indexOf(e.sizmek_id)!=-1){
               //console.log("Comparing "+e.sizmek_id);
                e.isSelectable = true;
                //console.log(e);
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
       this.debugLog("Advertisers afterupdate");
       this.debugLog(this.advertisers);
       this.debugLog(this);
    }

    initAllFilters():void{
      //this.initAdvertisers();
      //this.initPartners();
      //this.initKpis();
      //this.initMetaCampaigns();
    }

}
