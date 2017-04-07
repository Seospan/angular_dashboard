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

    setAdvertisers():void{
        this.advertisersService.getAll().then(
                result => {
                    this.debugLog("RESULT Advertisers");
                    this.debugLog(result);
                    this.advertisersSource.next( result );
            },
        );
    }

    setPartners():void{
        this.partnersService.getAll().then(
                result => {
                    this.debugLog("RESULT Partners");
                    this.debugLog(result);
                    this.partnersSource.next( result );
            },
        );
    }

    setKpis():void{
        this.kpisService.getAll().then(
                result => {
                    this.debugLog("RESULT Kpis");
                    this.debugLog(result);
                    this.kpisSource.next( result );
            },
        );
    }

    setMetaCampaigns():void{
        this.metaCampaignsService.getAll().then(
                result => {
                    this.debugLog("RESULT MetaCampaigns");
                    this.debugLog(result);
                    this.metaCampaignsSource.next( result );
            },
        );
    }

    setAllFilters():void{
      this.setAdvertisers();
      this.setPartners();
      this.setKpis();
      this.setMetaCampaigns();
    }

}
