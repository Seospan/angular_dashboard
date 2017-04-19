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
    multiAttributionRawDataSubject = new Subject<FraudDataElem[]>();


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

    }
}
