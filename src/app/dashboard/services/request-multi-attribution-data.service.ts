import { Injectable } from '@angular/core';

import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';

import { RequestFraudDataService } from './request-fraud-data-services';
import { DataFaudDetectorService } from './data-fraud-detector.service';
import { FilterService } from './filter-service';

import { FraudDataElem } from '../../models/server-models/fraud-data-elem';

@Injectable()
export class RequestMultiAttributionDataService {
    /*
    This class is reponsible for getting the data used by the multi attribution reporting tools
    It uses the same promise than the one used by RequestFraudDataService but different subjects.
    */
    DEBUG: boolean = true;
    private debugLog(str){ this.DEBUG && console.log(str); }

    attributionModelIdSubject = new Subject<number>();
    multiAttributionRawDataSubject = new Subject<any[]>();
    multiAttributionFilteredDataSubject = new Subject<any[]>();

    requestParamsMultiAttributionDataSubscription : Subscription;

    constructor(
        private filterService : FilterService,
        private requestFraudDataService: RequestFraudDataService,
        private dataFaudDetectorService: DataFaudDetectorService,
    ) {
        this.debugLog("Constructor RequestMultiAttributionDataService started !")
        this.requestParamsMultiAttributionDataSubscription = this.attributionModelIdSubject.combineLatest(
            this.filterService.dataFraudDetectorRequest,
        )
            .subscribe({
                next : (latest_values) => {
                    let attributionModelId = latest_values[0];
                    this.debugLog("attributionModelId: "+attributionModelId);
                    let startDate = latest_values[1].startDate;
                    let endDate = latest_values[1].endDate;
                    this.requestFraudDataService.getDataFraudDetector({
                        startDate: startDate,
                        endDate: endDate,
                        selectedAttributionModelId: attributionModelId,
                    }).then(
                        raw_data => {
                            this.multiAttributionRawDataSubject.next(raw_data);
                        }
                    );
                },
                error: (err) => console.error(err),
            });
        this.multiAttributionRawDataSubject
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
                Filter then concatenate the data
                */
                ma_filtered_data = ma_filtered_data.map(row => {
                    (<any>row).pivot = 1;
                    return(row)
                })
                fd_filtered_data = fd_filtered_data.map(row => {
                    (<any>row).pivot = 0;
                    return(row)
                })
                let filtered_data = fd_filtered_data.concat(ma_filtered_data)

                console.log(filtered_data);
            }
        });
    }
}
