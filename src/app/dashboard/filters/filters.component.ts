import { Component, OnInit, ViewChild } from '@angular/core';
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
    DEBUG: boolean = false;
    private debugLog(str){ this.DEBUG && console.log(str); }

    //Options for daterange picker
    public options: any ;

    constructor(private filterService : FilterService) {
        this.debugLog("Constructor filters component");
    }

    expanded=false;

    ngOnInit():void{
        //this.filterService.initAllFilters();
        //this.filterService.initAttributionModels();
        let today = new Date();
        this.options = {
            locale: { format: 'DD-MM-YYYY' },
            alwaysShowCalendars: true,
            startDate : this.filterService.getDateRange().startDate,
            endDate : this.filterService.getDateRange().endDate,
            ranges: {
                    "Today": [
                        today,
                        today,
                    ],
                    "Yesterday": [
                        new Date().setDate(today.getDate()-1),
                        new Date().setDate(today.getDate()-1),
                    ],
                    "Last 7 Days": [
                        new Date().setDate(today.getDate()-7),
                        today
                    ],
                    "Last 30 Days": [
                        new Date().setDate(today.getDate()-30),
                        today
                    ],
                    "Last 90 days": [
                        new Date().setDate(today.getDate()-90),
                        today
                    ],
                },
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

    public changeAllAdvertisers(state){
        this.filterService.advertisers.map((e) => {e.isSelected = state; return e;});
        this.updateAdvertisers();
    }

    public changeAllPartners(state){
        this.filterService.partners.map((e) => {e.isSelected = state; return e;});
        this.updatePartners();
    }

    public changeAllKpis(state){
        this.filterService.kpis.map((e) => {e.isSelected = state; return e;});
        this.updateKpis();
    }

    public changeAllMetaCampaigns(state){
        this.filterService.metaCampaigns.map((e) => {e.isSelected = state; return e;});
        this.updateMetaCampaigns();
    }

    public updateAdvertisers():void{
        this.filterService.advertisersSubject.next(this.filterService.advertisers);
    }
    public updatePartners():void{
        this.filterService.partnersSubject.next(this.filterService.partners);
    }
    public updateKpis():void{
        this.filterService.kpisSubject.next(this.filterService.kpis);
    }
    public updateMetaCampaigns():void{
        this.filterService.metaCampaignsSubject.next(this.filterService.metaCampaigns);
    }
}
