import { Component, OnInit } from '@angular/core';
import { FilterService } from '../services/filter-service';
import { Advertiser, Brand, Kpi, MetaCampaign, Product, KpiAction, Partner } from '../../models/server-models/index';
import { Subscription }   from 'rxjs/Subscription';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css']
})
export class FiltersComponent implements OnInit {

    //Used on click to select / unselect all filters of a type (TODO : is "in place" use of map legit ?)
    changeAllFilter(array,state):void{
        array.map((e) => {e.isSelected = state; return e;});
    }

    constructor(private filterService : FilterService) {}

    ngOnInit():void{
        this.filterService.initAllFilters();
    }

}
