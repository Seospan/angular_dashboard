import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs/Subject';
import { Advertiser, Brand, Kpi, MetaCampaign, Product, KpiAction, Partner } from '../../models/server-models/index'
import { AuthenticationService, AdvertiserService, PartnerService, KpiService, MetaCampaignService } from '../../_services/index';

import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { UserService } from '../../_services/user.service';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class FilterService {
    DEBUG:boolean = true;
    private debugLog(str){ this.DEBUG && console.log(str); }
    DEFAULT_FILTER_STATE: boolean = true;

    constructor(private http : Http,
        private advertisersService : AdvertiserService,
        private partnersService : PartnerService,
        private kpisService : KpiService,
        private metaCampaignsService : MetaCampaignService,
     ) {
    }

    private showFiltersSource = new Subject<boolean>();
    showFilters = this.showFiltersSource.asObservable();

    //Elements of filtering
    advertisers : Advertiser[];
    partners : Partner[];
    kpis : Kpi[];
    metaCampaigns : MetaCampaign[];

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
                        e.isSelectable=false;
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

//    setSelectableAdvertisers()

    initAllFilters():void{
      this.initAdvertisers();
      this.initPartners();
      this.initKpis();
      this.initMetaCampaigns();
    }

}
