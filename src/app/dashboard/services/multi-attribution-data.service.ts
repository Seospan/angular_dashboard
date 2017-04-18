import { Injectable } from '@angular/core';

import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';

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

    multiAttributionFilteredDataSubscription : Subscription

    constructor( private requestMultiAttributionDataService : RequestMultiAttributionDataService) {
        this.multiAttributionFilteredDataSubscription =
            this.requestMultiAttributionDataService.multiAttributionFilteredDataSubject.subscribe({
                next:(filtered_data => {
                    this.debugLog("Filtered data received by the multiAttributionDataService");
                    this.debugLog(filtered_data);

                })
            })
    }
    DEBUG: boolean = false;
    private debugLog(str){ this.DEBUG && console.log(str); }
}
