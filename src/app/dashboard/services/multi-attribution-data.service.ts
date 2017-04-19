import { Injectable } from '@angular/core';

import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';

import { FilterService } from './filter-service';
import { RequestFraudDataService } from './request-fraud-data-services';
import { DataFaudDetectorService } from './data-fraud-detector.service';
import { RequestMultiAttributionDataService } from './request-multi-attribution-data.service';

@Injectable()
export class MultiAttributionDataService {
    /*
    This class is created to allow the DL and proper formating of data for the multi attribution tools.
    It uses:
        Subjects:
        1) attributionModelIdSubject which is the id of the secondary attribution model, knowing that the first
        attribution model id is the one defined in the filter service.
        2) multiAttributionFilteredDataSubject which is the data obtained by the http request, plus the data for the main
        model, all filtered with the filters defined in the filterService

    */

    attributionModelIdSubject = new Subject<number>();

    multiAttributionFilteredDataSubject = new Subject<any[]>();
    multiAttributionFilteredDataSubscription : Subscription

    constructor(
        private filterService : FilterService,
        private requestFraudDataService: RequestFraudDataService,
        private requestMultiAttributionDataService : RequestMultiAttributionDataService,
    ) {

        this.multiAttributionFilteredDataSubscription =
            this.multiAttributionFilteredDataSubject.subscribe({
                next:(filtered_data => {
                    this.debugLog("Filtered data received by the multiAttributionDataService");
                    this.debugLog(filtered_data);

                }),
                error: (err) => console.error(err),
            });
        this.requestMultiAttributionDataService.multiAttributionRawDataSubject
            .combineLatest(
                this.requestFraudDataService.rawFraudDataSubject,
                this.filterService.advertisersSubject,
                this.filterService.partnersSubject,
                this.filterService.kpisSubject,
                this.filterService.metaCampaignsSubject,
            )
            .subscribe({
                next: (latest_values) => {
                    let ma_raw_data = latest_values[0];
                    let fd_raw_data = latest_values[1];
                    /*
                    Needed for the filters
                    TODO factorize in one service.
                    */
                    let allAdvertisersFromSubjectValue = latest_values[2];
                    let allPartnersFromSubjectValue = latest_values[3];
                    let allKpisFromSubjectValue = latest_values[4];
                    let allMetaCampaignsFromSubjectValue = latest_values[5];
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
                    let ma_filtered_data = ma_raw_data
                        .filter((row) => {
                            return (selectAdvertisersId.indexOf(row.advertiser_id) !== -1) &&
                            (selectKpisId.indexOf(row.kpi_id) !== -1) &&
                            (selectMetaCampaingsId.indexOf(row.metacampaign_id) !== -1) &&
                            (selectPartnersId.indexOf(row.partner_id) !== -1)
                        });
                    let fd_filtered_data = fd_raw_data
                        .filter((row) => {
                            return (selectAdvertisersId.indexOf(row.advertiser_id) !== -1) &&
                            (selectKpisId.indexOf(row.kpi_id) !== -1) &&
                            (selectMetaCampaingsId.indexOf(row.metacampaign_id) !== -1) &&
                            (selectPartnersId.indexOf(row.partner_id) !== -1)
                        });
                    /*
                    Filter the data.
                    */
                    ma_filtered_data = ma_filtered_data.map(row => {
                        (<any>row).pivot = 1;
                        return(row)
                    })
                    fd_filtered_data = fd_filtered_data.map(row => {
                        (<any>row).pivot = 0;
                        return(row)
                    })

                    /*
                    We need to do a full outer join using concatenate-map-reduce-map logic.
                    It's a 4 steps logic:
                        1) First we concatenate the two tables,
                        2) Then we map to create a (key, pair) value based on the dimension (the join on logic).
                        3) Then we reduce to get one line per dimension with two metrics.
                        4) Map again to reintroduce ids and make it a normal array instead of an associative array.

                    */
                    let dimensions = ['conversion_date', 'advertiser_id', 'metacampaign_id', 'partner_id', 'kpi_id'];
                    // 1) concatenate, this one is easy.
                    let filtered_data = fd_filtered_data.concat(ma_filtered_data);

                    // 2) map,
                    let mapped_data = filtered_data.map(row => {
                        let key="";
                        dimensions.forEach((groupByElem) => {
                            if(row[groupByElem]!="") {
                                key += row[groupByElem]+"__";
                            } else {
                                key += "NULL" + "__";
                            }
                        });
                        let object = {
                            key : key,
                            conversions : row.conversions,
                            certified_conversions : row.certified_conversions,
                            pivot: (<any>row).pivot
                        } //as any;
                        return object;
                    });

                    // 3) reduce
                    let reduced_data = mapped_data.reduce((acc,elem,index,array)=>{
                        if(!acc[elem.key]) {
                            if(elem.pivot == 0) {
                                acc[elem.key] = {
                                   main_model_certified: elem.certified_conversions,
                                   second_model_certified: 0,
                               };
                           } else {
                               acc[elem.key] = {
                                   main_model_certified: 0,
                                   second_model_certified: elem.certified_conversions,
                               };
                           }
                       } else {
                           if(elem.pivot == 0) {
                               acc[elem.key].main_model_certified += elem.certified_conversions;
                           } else {
                               acc[elem.key].second_model_certified += elem.certified_conversions;
                           }
                       }
                       return acc;
                    }, []);

                    // 4) map again,
                    let data = []
                    for(var reduced_data_row in reduced_data) {
                        let splittedKey = reduced_data_row.split("__")
                        dimensions.map((dimension, index)=>{
                            reduced_data[reduced_data_row][dimension] = splittedKey[index];
                        })
                        data.push(reduced_data[reduced_data_row]);
                    }
                    this.multiAttributionFilteredDataSubject.next(data);
                },
                error: (err) => console.error(err),
            });
    }
    DEBUG: boolean = false;
    private debugLog(str){ this.DEBUG && console.log(str); }
}
