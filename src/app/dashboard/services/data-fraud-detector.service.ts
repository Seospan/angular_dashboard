import { Injectable } from '@angular/core';
import { Router} from '@angular/router';
import { Subject }    from 'rxjs/Subject';

import {  } from '../../_services/index';

import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { UserService } from '../../_services/user.service';
import { FilterService } from '../services/filter-service';
import { AppConfig } from '../../app.config';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class DataFaudDetectorService {
    DEBUG: boolean = false;
    private debugLog(str){ this.DEBUG && console.log(str); }

    ENDPOINT_URL : string = "/aggregated_suspicious_data/";

    private dataFraudDetectorSource = new Subject<JSON>();
    dataFraudDetector = this.dataFraudDetectorSource.asObservable();

    constructor(private http : Http,
        private config: AppConfig,
        private router: Router,
        private filterService : FilterService) {
    }

    /**
     * Get data from API
     * @method getDataFraudDetector
     * @return {Promise<JSON>}  Pomise of JSON containing all data, in one JSON, one object per line, composed of :
     *                                 advertiser_id
     *                                 attribution_model_id
     *                                 certified_conversions
     *                                 conversion_date
     *                                 conversions
     *                                 kpi_id
     *                                 metacampaign_id
     *                                 partner_id
     */
    getDataFraudDetector():Promise<JSON> {
        return this.http.post(this.config.apiRequestUrl + this.ENDPOINT_URL, [{
                                                                                    "start_date": "2016-01-01",
                                                                                    "end_date": "2016-02-01",
                                                                                    "attribution_model": "default"
                                                                                }]
    , this.jwt())
            .toPromise()
            .then(response => {
                this.debugLog("RESULT Data response : ");
                this.debugLog(  response.json());
                return response.json();
            })
            .catch(error => {
                this.debugLog("error : "+error.json().detail);
                this.debugLog(error.json());
                //this.router.navigate(['/login'], { queryParams: { returnUrl : window.location.pathname }});
                return "";
            });
    }

    /**
     * Get data from API with @getDataFraudDetector and injects it in the observable dataFraudDetector
     *
     * @method setDataFraudDetector
     */
    setDataFraudDetector():void{
        this.getDataFraudDetector().then(
            
            result => {
                this.dataFraudDetectorSource.next( result );
            },
        );
    }

    // private helper methods

    private jwt() {
        // create authorization header with jwt token
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser && currentUser.token) {
            let headers = new Headers({ 'Authorization': 'JWT ' + currentUser.token });
            return new RequestOptions({ headers: headers });
        }
    }


}
