import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs/Subject';
import { Advertiser, Brand, Kpi, MetaCampaign, Product, KpiAction, Partner } from '../../models/server-models/index'

@Injectable()
export class FilterService {
    constructor() { }

    private showFiltersSource = new Subject<boolean>();
    private advertisersSource = new Subject<Advertiser[]>();
    private partnersSource = new Subject<Partner[]>();
    private kpisSource = new Subject<Kpi[]>();
    private metaCampaignsSource = new Subject<MetaCampaign[]>();

    showFilters = this.showFiltersSource.asObservable();
    advertisers = this.advertisersSource.asObservable();
    partners = this.partnersSource.asObservable();
    kpis = this.kpisSource.asObservable();
    metaCampaigns = this.metaCampaignsSource.asObservable();

    setShowFilters(val:boolean):boolean{
      this.showFiltersSource.next(val);
      return val;
    }

    setAdvertisers():void{
      this.advertisersSource.next([
        {
          sizmekId : 123,
          sizmekName : "Adv1",
          name : "Adv 1",
          countryCode : "FR",
          isSelected:false,
        },
        {
          sizmekId : 456,
          sizmekName : "Adv2",
          name : "Adv 2",
          countryCode : "FR",
          isSelected:false,
        },
        {
          sizmekId : 789,
          sizmekName : "Adv3",
          name : "Adv 3",
          countryCode : "UK",
          isSelected:false,
        }
      ]);
    }

    setPartners():void{
      this.partnersSource.next([
        {
          id : 123,
          name : "partner 123",
          isSelected:false,
        },
        {
          id : 2,
          name : "partner 2",
          isSelected:false,
        },
        {
          id : 3,
          name : "partner 3",
          isSelected:false,
        },
        {
          id : 4,
          name : "partner 4",
          isSelected:false,
        },
        {
          id : 5,
          name : "partner 5",
          isSelected:false,
        },

      ]);
    }

    setKpis():void{
      this.kpisSource.next([
        {
          id : 123,
          name : "KPI 123",
          symbol : "A",
          product : new Product(),
          kpiAction : new KpiAction(),
          isSelected:false,
        },
        {
          id : 2,
          name : "KPI 2",
          symbol : "B",
          product : new Product(),
          kpiAction : new KpiAction(),
          isSelected:false,
        },
        {
          id : 3,
          name : "KPI 3",
          symbol : "C",
          product : new Product(),
          kpiAction : new KpiAction(),
          isSelected:false,
        },

      ]);
    }

    setMetacampaigns():void{
      this.metaCampaignsSource.next([
        {
          id : 3,
          name : "Metacampaign 3",
          isSelected : false,
        },
        {
          id : 123,
          name : "Metacampaign 123",
          isSelected : false,
        },
        {
          id : 4,
          name : "Metacampaign 4",
          isSelected : false,
        },
      ]);
    }

    setAllFilters():void{
      this.setAdvertisers();
      this.setPartners();
      this.setKpis();
      this.setMetacampaigns();
    }
    /*setAdvertisersTo(advList:Advertiser[]):void{
      this.advertisersSource.next(advList);
    }*/


}
