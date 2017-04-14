import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
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

declare var universe: any;
import '../../../../assets/js/universe.min.js';

import { FraudDataElem } from '../../models/server-models/fraud-data-elem';

@Injectable()
export class DataFaudDetectorService {
    DEBUG: boolean = true;
    private debugLog(str){ this.DEBUG && console.log(str); }

    ENDPOINT_URL : string = "/aggregated_suspicious_data/";

    /**
     * Subscribes to dataFraudDetectorRequest (elements of filtering) and pushes it to dataFraudDetector (data)
     */
    dataFiltersSubscription : Subscription;

    dataFraudDetector = new Subject<FraudDataElem[]>();
    dataFraudDetectorSubscription : Subscription;

    constructor(private http : Http,
        private config: AppConfig,
        private router: Router,
        private filterService : FilterService,
    ) {
            this.debugLog("Constructor datafrauddetectorservice");
            /**
             * Gets data when filter changes and sends data to dataFraudDetector (see dataFraudDetectorSubscription)
             * @method subscribe
             * @param  {(elems}  {next [description]
             * @return {[type]}        [description]
             */
            this.dataFiltersSubscription = this.filterService.dataFraudDetectorRequest.subscribe({
                next : (elems) => {
                        console.log("Getting data from subscription");
                        this.getDataFraudDetector(elems).then(
                            result => {
                                this.debugLog("Data from getDataFraudDetector to dataFraudDetector :");
                                this.debugLog(result);
                                this.dataFraudDetector.next(result);
                            },
                        ).catch(function(rejected){
                            console.error("PROMISE REJECTED : ");
                            console.error(rejected);
                        });
                },
                error: (err) => console.error(err),
            });

            //Updates list of filters when data is received to match available items
            this.dataFraudDetectorSubscription = this.dataFraudDetector.combineLatest(
                    this.filterService.advertisersSubject,
                    this.filterService.partnersSubject,
                    this.filterService.kpisSubject,
                    this.filterService.metaCampaignsSubject,
                ).subscribe(
                    {
                        next : (latestValues) => {

                            let data = latestValues[0];
                            let allAdvertisersFromSubjectValue = latestValues[1];
                            let allPartnersFromSubjectValue = latestValues[2];
                            let allKpisFromSubjectValue = latestValues[3];
                            let allMetaCampaignsFromSubjectValue = latestValues[4];

                            this.filterService.setSelectableFilters(
                                this.getUniqueList(data,"advertiser_id"),
                                this.getUniqueList(data,"partner_id"),
                                this.getUniqueList(data,"kpi_id"),
                                this.getUniqueList(data,"metacampaign_id"),
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

    /**
     * Gets list of unique values from an array of objects and the name of the propertty
     * @method getUniqueList
     * @param  {[type]}      objectsArray    [description]
     * @param  {[type]}      property [description]
     */
    getUniqueList(objectsArray, property){
        return objectsArray.map(function(e){ return e[property]; })
        .filter(function(elem, index, array){
            return array.indexOf(elem) === index
        });
    }
    dataGroupBy(groupByFieldsWithDetails, data): any[] {

        /************************************************************************************/
        /**
         * Takes data as given by the api, and maps it, to keep :
         * key : unique key composed of the values of the grouping criterias indicated in th eipnut,
         * separated by a double underscore (__)
         * conversions
         * certified_conversions
         * returns an array
         */


        let groupedByData = data.map((dataElem)=>{
            let key = "";
            groupByFieldsWithDetails.forEach((groupByElem) => { key += dataElem[groupByElem.id]+"__"; });
            let object = {
                key : key,
                conversions : dataElem.conversions,
                certified_conversions : dataElem.certified_conversions,
            }
            return object;
        }).reduce((acc,elem,index,array)=>{
            /**
             * Reduce data : from a array of {key, conversions, certified_conversions}, makes an associative array
             * which renders a unique object per set of grouping criteria (unique key generated above), containing
             * aggregated conversions and aggregated certified_conversions.
             * The key is not anymore in the object but present as key of the associative array.
             */
            if(!acc[elem.key]){
                acc[elem.key] = {
                    certified_conversions : elem.certified_conversions,
                    conversions : elem.conversions,
                };
            }else{
                 acc[elem.key].certified_conversions += elem.certified_conversions;
                 acc[elem.key].conversions += elem.conversions;
            }
            return acc;
        }, []);

        /**
         * Iterate on groupedByData
         * Splits key (unique key composed of grouping items) into an array.
         * Uses this.groupByFieldsWithDetails, which contains the key names in the same order, to map and inject
         * each grouping item's id at the right key.
         * At the end of the loop, data2 contains the conversions and certified_conversions, and an attribute for
         * each grouping criteria ( criteria_name : criteria_value )
         */
        let data2 = []
        for (var key in groupedByData) {
            let keys = key.split("__")
            groupByFieldsWithDetails.map((groupByElem, index) => {
                if(groupByElem.details != []){


                        //groupByElem.details.filter((elem)=>{ return elem[groupByElem.pk_identifier] == groupedByData[key][groupByElem.pk_identifier] })

                }
                /*
                console.log("type d'id :");
                console.log(groupByElem.pk_identifier );
                console.log("valeur id:")
                console.log(keys[index]);
                console.log("Push into :");
                console.log(groupedByData[key]);
                console.log("A trouver dans:");
                */

                let detailedArray = []
                console.log(groupByElem)
                for (var possibleValuesList of groupByElem.details) {
                    console.log("ca marhce pas!")
                    console.log(detailedArray[possibleValuesList[groupByElem.pk_identifier]]);
                    console.log(possibleValuesList.name);
                    detailedArray[possibleValuesList[groupByElem.pk_identifier]] = possibleValuesList.name
                }
                //console.log(detailedArray)
            //console.log(groupByElem.details.filter(function(e){return true}));
                groupedByData[key][groupByElem.id] = detailedArray[keys[index]]
            })
            let percentage = (groupedByData[key].certified_conversions / groupedByData[key].conversions) * 100;
            groupedByData[key]["percent_certified"] = percentage.toFixed(2);
            data2.push(groupedByData[key])
        }
        console.log(data2)

        this.debugLog("");
        this.debugLog(data2);
        /**********************************************************************************************************/
        return data2;
    }


}
