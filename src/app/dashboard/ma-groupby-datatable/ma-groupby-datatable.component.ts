import { Component, OnInit, Input } from '@angular/core';

import {
    TdDataTableService,
    TdDataTableSortingOrder,
    ITdDataTableSortChangeEvent,
    ITdDataTableColumn,
    IPageChangeEvent } from '@covalent/core';

import { Subscription }   from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { MultiAttributionDataService } from '../services/multi-attribution-data.service';

@Component({
  selector: 'app-ma-groupby-datatable',
  templateUrl: './ma-groupby-datatable.component.html',
  styleUrls: ['./ma-groupby-datatable.component.css'],
  providers: [ MultiAttributionDataService ],
})
export class MaGroupbyDatatableComponent implements OnInit {
    DEBUG: boolean = true;
    private debugLog(str){ this.DEBUG && console.log(str); }

    @Input() multiAttributionModelId : number;

    affiche : any;

    constructor(
        private multiAttributionDataService: MultiAttributionDataService,
    ) {
        this.debugLog("ma-groupby-datatable constructor started !")
    }

    ngOnInit() {

        this.debugLog("ma-groupby-datatable ngOnInit started !")

        this.multiAttributionDataService.attributionModelIdSubject.subscribe({
            next: res => {
                this.affiche = res;
                console.log(res)
            }
        });
        this.multiAttributionDataService.attributionModelIdSubject.next(this.multiAttributionModelId);
        this.debugLog("ma-groupby-datatable ngOnInit ended !")

    }

}
