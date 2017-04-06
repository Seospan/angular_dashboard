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
    //Elements of filtering
    advertisers : Advertiser[];
    subscriptionAdvertisers : Subscription;
    partners : Partner[];
    subscriptionPartners : Subscription;
    kpis : Kpi[];
    subscriptionKpis : Subscription;
    metaCampaigns : MetaCampaign[];
    subscriptionMetaCampaigns : Subscription;

    DEFAULT_FILTER_STATE: boolean = true;

    //Used on click to select / unselect all filters of a type (TODO : is "in place" use of map legit ?)
    changeAllFilter(array,state):void{
        array.map((e) => {e.isSelected = state; return e;});
    }

    constructor(private filterService : FilterService) {
        this.subscriptionAdvertisers = this.filterService.advertisers.subscribe(
            advertisersArray => {
                //Set all to by default to default state DEFAULT_FILTER_STATE
                this.advertisers = advertisersArray.map((e) => {e.isSelected=this.DEFAULT_FILTER_STATE; return e;});
            }
        );
        this.subscriptionPartners = this.filterService.partners.subscribe(
            partnersArray => {
                //Set all to by default to default state DEFAULT_FILTER_STATE
                this.partners = partnersArray.map((e) => {e.isSelected=this.DEFAULT_FILTER_STATE; return e;});
            }
        );
        this.subscriptionKpis= this.filterService.kpis.subscribe(
            kpisArray => {
                //Set all to by default to default state DEFAULT_FILTER_STATE
                this.kpis = kpisArray.map((e) => {e.isSelected=this.DEFAULT_FILTER_STATE; return e;});
            }
        );
        this.subscriptionMetaCampaigns = this.filterService.metaCampaigns.subscribe(
            metaCampaignsArray => {
                //Set all to by default to default state DEFAULT_FILTER_STATE
                this.metaCampaigns = metaCampaignsArray.map((e) => {e.isSelected=this.DEFAULT_FILTER_STATE; return e;});
            }
        );
    }

    ngOnInit():void{
        this.filterService.setAllFilters();
    }

}
