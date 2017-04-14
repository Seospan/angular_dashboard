import { Component, OnInit } from '@angular/core';
import { FilterService } from '../services/filter-service';
import { Advertiser, Brand, Kpi, MetaCampaign, Product, KpiAction, Partner } from '../../models/server-models/index';
import { Subscription }   from 'rxjs/Subscription';
import { DatePickerOptions, DateModel } from 'ng2-datepicker';
import { NgDateRangePickerOptions } from 'ng-daterangepicker';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css']
})
export class FiltersComponent implements OnInit {
    DEBUG: boolean = true;
    private debugLog(str){ this.DEBUG && console.log(str); }

    public options: any ;

    constructor(private filterService : FilterService) {
        this.debugLog("Constructor filters component");
    }

    ngOnInit():void{
        this.filterService.initAllFilters();
        this.filterService.initAttributionModels();
        this.options = {
            locale: { format: 'DD-MM-YYYY' },
            alwaysShowCalendars: false,
            startDate : this.filterService.getDateRange().startDate,
            endDate : this.filterService.getDateRange().endDate,
        };
    }

    //Used on click to select / unselect all filters of a type (TODO : is "in place" use of map legit ?)
    changeAllFilter(array,state):void{
        array.map((e) => {e.isSelected = state; return e;});
    }

    public selectedDate(value: any):void {
        this.filterService.setDateRange({
            startDate : new Date(value.start),
            endDate : new Date(value.end),
        });
        this.debugLog("New daterange : "+this.filterService.getDateRange().startDate+" - "+this.filterService.getDateRange().endDate);
    }

    public changeModel(value):void {
        this.filterService.setAttributionModelId(value);
        this.debugLog("New model : "+value);
    }

}
