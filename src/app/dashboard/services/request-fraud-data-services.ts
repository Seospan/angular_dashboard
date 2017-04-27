import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Router } from '@angular/router';

import 'rxjs/add/operator/toPromise';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';

import { FraudDataElem } from '../../models/server-models/fraud-data-elem';
import { FilterService } from '../services/filter-service';
import { AppConfig } from '../../app.config';

@Injectable()
export class RequestFraudDataService {
    /*
    This service is responsible for getting the raw data from the server.
    It uses the start date, end date and selected attribution model id set in the Filter service using Subscription to
    the FilterService.dataFraudDetectorRequest behavior subject to do it.
    It exports a subject rawFraudDataSubject which is a table for FraudDataElem.
    */
    DEBUG: boolean = false;
    private debugLog(str){ this.DEBUG && console.log(str); }

    // Define the needed attributes
    rawFraudDataSubject = new Subject<FraudDataElem[]>();
    ENDPOINT_URL : string = "/aggregated_suspicious_data/";

    // Subscription
    fraudDataRequestParams : Subscription;

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
    getDataFraudDetector({startDate, endDate, selectedAttributionModelId}):Promise<FraudDataElem[]> {
        return this.http.post(this.config.apiRequestUrl + this.ENDPOINT_URL, [{
                                                                                    "start_date": startDate,
                                                                                    "end_date": endDate,
                                                                                    "attribution_model": selectedAttributionModelId
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

    private jwt() {
        // create authorization header with jwt token
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser && currentUser.token) {
            let headers = new Headers({ 'Authorization': 'JWT ' + currentUser.token });
            return new RequestOptions({ headers: headers });
        }
    }

    constructor(
        private http : Http,
        private config: AppConfig,
        private router: Router,
        private filterService : FilterService,
    ) {
        this.debugLog("Constructor request fraud data service initiated!")
        this.fraudDataRequestParams = this.filterService.dataFraudDetectorRequest.subscribe({
            next : (elems) => {
                    this.debugLog("Getting data from subscription");
                    this.debugLog(elems);
                    this.getDataFraudDetector(elems).then(
                        result => {
                            this.debugLog("Data from getDataFraudDetector to dataFraudDetector :");
                            this.debugLog(result);
                            this.rawFraudDataSubject.next(result);
                        },
                    ).catch(function(rejected){
                        console.error("PROMISE REJECTED : ");
                        console.error(rejected);
                    });
            },
            error: (err) => console.error(err),
        });
    }
    //FilterService.dataFraudDetectorRequest
}
