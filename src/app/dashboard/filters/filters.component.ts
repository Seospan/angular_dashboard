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
  advertisers : Advertiser[];
  subscriptionAdvertisers : Subscription;
  partners : Partner[];
  subscriptionPartners : Subscription;
  kpis : Kpi[];
  subscriptionKpis : Subscription;
  metaCampaigns : MetaCampaign[];
  subscriptionMetaCampaigns : Subscription;

  constructor(private filterService : FilterService) {
    this.subscriptionAdvertisers = this.filterService.advertisers.subscribe(
       advertisersArray => { this.advertisers = advertisersArray }
    );
    this.subscriptionPartners = this.filterService.partners.subscribe(
      partnersArray => { this.partners = partnersArray }
    );
    this.subscriptionKpis= this.filterService.kpis.subscribe(
       kpisArray => { this.kpis = kpisArray }
    );
   this.subscriptionMetaCampaigns = this.filterService.metaCampaigns.subscribe(
      metaCampaignsArray => { this.metaCampaigns = metaCampaignsArray }
    );
  }

  ngOnInit() {
    this.filterService.setAllFilters();
  }


/*  toggleAdvertiser(advId){
    //this.advertisers = this.advertisers.map(function(e,index){ if(e.sizmekId == advId){ e.isSelected = !e.isSelected; } return e; });
    //this.filterService.setAdvertisersTo(this.advertisers);
    advId.isSelected = true;
  }*/

}
