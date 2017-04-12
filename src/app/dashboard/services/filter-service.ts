import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs/Subject';
import { Advertiser, Brand, Kpi, MetaCampaign, Product, KpiAction, Partner } from '../../models/server-models/index'
import { AuthenticationService, AdvertiserService, PartnerService, KpiService, MetaCampaignService } from '../../_services/index';

import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { UserService } from '../../_services/user.service';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class FilterService {
    DEBUG:boolean = false;
    private debugLog(str){ this.DEBUG && console.log(str); }

    constructor(private http : Http,
        private advertisersService : AdvertiserService,
        private partnersService : PartnerService,
        private kpisService : KpiService,
        private metaCampaignsService : MetaCampaignService,
     ) {
    }

    private showFiltersSource = new Subject<boolean>();
    private advertisersSource = new Subject<Advertiser[]>();
    private partnersSource = new Subject<Partner[]>();
    private kpisSource = new Subject<Kpi[]>();
    private metaCampaignsSource = new Subject<MetaCampaign[]>();

    showFilters = this.showFiltersSource.asObservable();
    advertisers = this.advertisersSource.asObservable();
    partners = this.partnersSource.asObservable();
    kpis = this.kpisSource.asObservable();
    metaCampaigns = this.metaCampaignsSource.asObservable();

    // private helper methods

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
                    this.advertisersSource.next( result.map((e) => {
                        e.isSelectable=false;
                        return e;
                    })
                );
            },
        );
    }

    initPartners():void{
        this.partnersService.getAll().then(
                result => {
                    this.debugLog("RESULT Partners");
                    this.debugLog(result);
                    //Return result with all isSelectable set to false by default
                    this.partnersSource.next( result.map((e) => {
                        e.isSelectable=false;
                        return e;
                    })
                );
            },
        );
    }

    initKpis():void{
        this.kpisService.getAll().then(
                result => {
                    this.debugLog("RESULT Kpis");
                    this.debugLog(result);
                    //Return result with all isSelectable set to false by default
                    this.kpisSource.next( result.map((e) => {
                        e.isSelectable=false;
                        return e;
                    })
                );
            },
        );
    }

    initMetaCampaigns():void{
        this.metaCampaignsService.getAll().then(
                result => {
                    this.debugLog("RESULT MetaCampaigns");
                    this.debugLog(result);
                    //Return result with all isSelectable set to false by default
                    this.metaCampaignsSource.next( result.map((e) => {
                        e.isSelectable=false;
                        return e;
                    })
                );
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
