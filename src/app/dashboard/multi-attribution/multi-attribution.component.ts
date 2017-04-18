import { Component, OnInit } from '@angular/core';
import { FilterService } from '../services/filter-service';
import { DataFaudDetectorService } from '../services/data-fraud-detector.service';
import { Advertiser, Brand, Kpi, MetaCampaign, Product, KpiAction, Partner } from '../../models/server-models/index';
import { Subscription }   from 'rxjs/Subscription';

@Component({
  selector: 'app-multi-attribution',
  templateUrl: './multi-attribution.component.html',
  styleUrls: ['./multi-attribution.component.css']
})
export class MultiAttributionComponent implements OnInit {
    DEBUG: boolean = true;
    private debugLog(str){ this.DEBUG && console.log(str); }

    constructor(
        private filterService : FilterService,
        private dataFraudDetectorService : DataFaudDetectorService) {
            this.debugLog('constructor MultiAttributionComponent started !');
        }

    ngOnInit() {
        this.filterService.setShowFilters(true);
    }
}
