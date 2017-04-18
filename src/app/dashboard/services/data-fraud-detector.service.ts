import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject }    from 'rxjs/BehaviorSubject';
import { Subject }    from 'rxjs/Subject';
import { Subscription }   from 'rxjs/Subscription';

import {  } from '../../_services/index';

import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { UserService } from '../../_services/user.service';
import { FilterService } from './filter-service';
import { RequestFraudDataService } from './request-fraud-data-services';
import { AppConfig } from '../../app.config';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/combineLatest';

import '../../../../assets/js/universe.min.js';

import { FraudDataElem } from '../../models/server-models/fraud-data-elem';

@Injectable()
export class DataFaudDetectorService {
    /*
    This class uses the rawdata obtained by RequestFraudDataService to provide filtered data to other services and
    components.
    It provides one subject with filtered data
        1) filteredFraudDataSubject which is used as the main source of data in dataviz components

    It uses 2 Subscription to:
        1) Combine all five data sources (rawFraudDataSubject, advertisersSubject, etc) and update the selectable
        attribute in the different advertisers etc Subjects.

    It also provides a methods to compute aggregated data:
        1) aggregateFilteredData which take as input the result of filteredFraudDataSubject, an array of dimension to
        use in the groupby, and arrays for advertisers, partners, kpis, MetaCampaigns, with the id as the key and
        the name as the value, to return filtered and aggregated data.
    */

    rawFraudDataSubscription : Subscription;
    filteredFraudDataSubject = new Subject<FraudDataElem[]>();

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

    aggregateFilteredData(filtered_data, detailedDimensions): any[]{
        // first we get arrays with ids as index and name as value for the 4 filters
        let advertisersNames = [];
        for(var advertiser of this.filterService.advertisers) {
            advertisersNames[advertiser.sizmek_id] = advertiser.common_name;
        }
        let kpisNames = [];
        for(var kpi of this.filterService.kpis) {
            kpisNames[kpi.id] = kpi.name;
        }
        let metaCampaignsNames = [];
        for(var metacampaign of this.filterService.metaCampaigns) {
            metaCampaignsNames[metacampaign.id] = metacampaign.name;
        }
        let partnersNames = [];
        for(var partner of this.filterService.partners) {
            partnersNames[partner.id] = partner.name;
        }
        let allNames = [];
        allNames['advertisersNames'] = advertisersNames;
        allNames['kpisNames'] = kpisNames;
        allNames['metaCampaignsNames'] = metaCampaignsNames;
        allNames['partnersNames'] = partnersNames;
        /*
        First we map-reduce
        However the result is an associative array while with ids instead of names for the dimensions
        We want a real array of objects with names instead of ids...
        */
        /************************************************************************************/
        /**
         * Takes data as given by the api, and maps it, to keep :
         * key : unique key composed of the values of the grouping criterias indicated in th eipnut,
         * separated by a double underscore (__)
         * conversions
         * certified_conversions
         * returns an array
         */
        let mapped_reduced_data = filtered_data.map(
            (dataElem)=>{
                let key = "";
                detailedDimensions.forEach((groupByElem) => { key += dataElem[groupByElem.id]+"__"});
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
        /*
        Now we transform it into a real array
        */
        let aggregated_and_filtered_data = [];
        for(var row in mapped_reduced_data) {
            /*
            Retrieve the id by splitting the key
            */
            let dimensions = row.split("__")
            detailedDimensions.map((dimension, index) => {
                // add the id
                mapped_reduced_data[row][dimension.id] = dimensions[index]
                if(dimension.details!=""){
                    // add the name
                    mapped_reduced_data[row][dimension.name] = allNames[dimension.details][dimensions[index]]
                }
            })
            /*
            Add the corresponding column
            */
            let percentage = (mapped_reduced_data[row].certified_conversions /
                mapped_reduced_data[row].conversions) * 100;
            mapped_reduced_data[row]["percent_certified"] = percentage.toFixed(2);
            aggregated_and_filtered_data.push(mapped_reduced_data[row])
        }
        this.debugLog("Filtered and Aggregated Data:")
        this.debugLog(aggregated_and_filtered_data)
        return aggregated_and_filtered_data;
    }




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
        private requestFraudDataService: RequestFraudDataService,
    ) {
        this.debugLog("Constructor datafrauddetectorservice");
        /*
        Main subscription used to maintain filtered data received by the API
        */
        this.rawFraudDataSubscription = this.requestFraudDataService.rawFraudDataSubject.combineLatest(
            this.filterService.advertisersSubject,
            this.filterService.partnersSubject,
            this.filterService.kpisSubject,
            this.filterService.metaCampaignsSubject,
        ).subscribe({
            next : (latestValues) => {
                // First we decompile the values
                let raw_data = latestValues[0];
                let allAdvertisersFromSubjectValue = latestValues[1];
                let allPartnersFromSubjectValue = latestValues[2];
                let allKpisFromSubjectValue = latestValues[3];
                let allMetaCampaignsFromSubjectValue = latestValues[4];
                // Then we update the list of selectable filters
                this.filterService.setSelectableFilters(
                    this.getUniqueList(raw_data,"advertiser_id"),
                    this.getUniqueList(raw_data,"partner_id"),
                    this.getUniqueList(raw_data,"kpi_id"),
                    this.getUniqueList(raw_data,"metacampaign_id"),
                    allAdvertisersFromSubjectValue,
                    allPartnersFromSubjectValue,
                    allKpisFromSubjectValue,
                    allMetaCampaignsFromSubjectValue,
                );
                // then we filter the data
                let selectAdvertisersId = allAdvertisersFromSubjectValue
                    .filter((advertiser) => { return advertiser.isSelected; })
                    .map((advertiser) => { return advertiser.sizmek_id; });
                let selectKpisId = allKpisFromSubjectValue
                    .filter((kpi) => { return kpi.isSelected; })
                    .map((kpi) => { return kpi.id; });
                let selectMetaCampaingsId = allMetaCampaignsFromSubjectValue
                    .filter((metacampaign) => { return metacampaign.isSelected; })
                    .map((metacampaign) => { return metacampaign.id; });
                let selectPartnersId = allPartnersFromSubjectValue
                    .filter((partner) => { return partner.isSelected; })
                    .map((partner) => { return partner.id; });
                let filtered_data = raw_data
                    .filter((row) => {
                        return (selectAdvertisersId.indexOf(row.advertiser_id) !== -1) &&
                        (selectKpisId.indexOf(row.kpi_id) !== -1) &&
                        (selectMetaCampaingsId.indexOf(row.metacampaign_id) !== -1) &&
                        (selectPartnersId.indexOf(row.partner_id) !== -1)
                    });
                // finally we send it to the filtered data subject.
                this.filteredFraudDataSubject.next(filtered_data);
                /*this.aggregateFilteredData(filtered_data, [
                    {
                        id:'metacampaign_id',
                        name:'metacampaign_name',
                        label:'Meta Campaign',
                        details:'metaCampaignsNames',
                        pk_identifier:"id"
                    }
                ]);*/
            },
            error: (err) => console.error(err),
        });
    }

DEBUG: boolean = true;
private debugLog(str){ this.DEBUG && console.log(str); }

}
