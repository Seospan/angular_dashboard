import { Injectable } from '@angular/core';
import { Router} from '@angular/router';
import { BehaviorSubject }    from 'rxjs/BehaviorSubject';
import { Subject }    from 'rxjs/Subject';
import { Subscription }   from 'rxjs/Subscription';

import {  } from '../../_services/index';

import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { UserService } from '../../_services/user.service';
import { FilterService } from '../services/filter-service';
import { AppConfig } from '../../app.config';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/combineLatest';

@Injectable()
export class DataFaudDetectorService {
    DEBUG: boolean = true;
    private debugLog(str){ this.DEBUG && console.log(str); }

    ENDPOINT_URL : string = "/aggregated_suspicious_data/";

    dataFraudDetector = new Subject<JSON>();

    /**
     * Subscribes to dataFraudDetectorRequest (elements of filtering) and pushes it to dataFraudDetector (data)
     */
    dataFiltersSubscription : Subscription;
    /**
     */
    dataFraudDetectorSubscription : Subscription;

    constructor(private http : Http,
        private config: AppConfig,
        private router: Router,
        private filterService : FilterService) {
            this.debugLog("Constructor datafrauddetectorservice");
            this.dataFiltersSubscription = this.filterService.dataFraudDetectorRequest.subscribe({
                next : (elems) => {
                        console.log("Getting data from subscription");
                        this.getDataFraudDetector(elems).then(
                            result => {
                                this.debugLog("Data from getDataFraudDetector to dataFraudDetector :");
                                this.debugLog(result);
                                this.dataFraudDetector.next(result);
                            },
                        );

                },
                error: (err) => console.error(err),
            });
            this.dataFraudDetectorSubscription = this.dataFraudDetector
                .combineLatest(
                    this.filterService.advertisersSubject,
                    this.filterService.partnersSubject,
                    this.filterService.kpisSubject,
                    this.filterService.metaCampaignsSubject,
                ).subscribe(
                    {
                        next : (latestValues) => {
                                let dataFraudDetectorValue = latestValues[0];
                                let allAdvertisersFromSubjectValue = latestValues[1];
                                let allPartnersFromSubjectValue = latestValues[2];
                                let allKpisFromSubjectValue = latestValues[3];
                                let allMetaCampaignsFromSubjectValue = latestValues[4];
                                //Execute universe and update filters
                                this.filterService.setSelectableFilters(
                                    [145464,145063],
                                    [102,104,105],
                                    [4,5,6,7],
                                    [1,3,5,7],
                                    allAdvertisersFromSubjectValue,
                                    allPartnersFromSubjectValue,
                                    allKpisFromSubjectValue,
                                    allMetaCampaignsFromSubjectValue,
                                );

                        },
                        error: (err) => console.error(err),
                    }
                );

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
    getDataFraudDetector({startDate, endDate, attributionModelId}):Promise<JSON> {
        return this.http.post(this.config.apiRequestUrl + this.ENDPOINT_URL, [{
                                                                                    "start_date": startDate,
                                                                                    "end_date": endDate,
                                                                                    "attribution_model": attributionModelId
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
    /*private setDataFraudDetector():JSON{
        this.getDataFraudDetector().then(
            result => {
                this.debugLog("DATA");
                this.debugLog(this.dataFraudDetector);
                return result;
            },
        );
    }*/

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
