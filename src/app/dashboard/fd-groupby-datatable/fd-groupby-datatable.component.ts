import { Component, OnInit, Input } from '@angular/core';

import { TdDataTableService, TdDataTableSortingOrder, ITdDataTableSortChangeEvent, ITdDataTableColumn } from '@covalent/core';
import { IPageChangeEvent } from '@covalent/core';
import { Subscription }   from 'rxjs/Subscription';

import { FilterService } from '../services/filter-service';
import { DataFaudDetectorService } from '../services/data-fraud-detector.service';
import { FraudDataElem } from '../../models/server-models/fraud-data-elem';

@Component({
  selector: 'app-fd-groupby-datatable',
  templateUrl: './fd-groupby-datatable.component.html',
  styleUrls: ['./fd-groupby-datatable.component.css']
})
export class FdGroupbyDatatableComponent implements OnInit {
    DEBUG: boolean = false;
    private debugLog(str){ this.DEBUG && console.log(str); }

    private data : FraudDataElem[];
    private columns : ITdDataTableColumn[];

    filteredData: any[];
    filteredTotal: number;

    searchTerm: string = '';
    fromRow: number = 1;
    currentPage: number = 1;
    pageSize: number = 5;
    sortBy: string = 'conversions';
    sortOrder: TdDataTableSortingOrder = TdDataTableSortingOrder.Descending;

    dataFraudDetectorSubscription : Subscription

    detailsAvailableGroupByFields : [{id:string,label:string,details:any,pk_identifier:string}] = [
            {id:'metacampaign_id',label:'Meta Campaign',details:this.filterService.metaCampaigns,pk_identifier:"id"},
            {id:'partner_id',label:'Partners',details:this.filterService.partners,pk_identifier:"id"},
            {id:'advertiser_id',label:'Advertiser',details:this.filterService.advertisers,pk_identifier:"sizmek_id"},
            {id:'kpi_id',label:'Kpi',details:this.filterService.kpis,pk_identifier:"id"},
            {id:'conversion_date',label:'Covnersion Date',details:[], pk_identifier:""},
        ];
    @Input() groupByFields : string[];
    @Input() availableGroupByFields : string[];

    constructor(private filterService : FilterService,
        private dataFraudDetectorService : DataFaudDetectorService,
        private _dataTableService: TdDataTableService) {
            this.dataFraudDetectorService.dataFraudDetector.combineLatest(
                this.filterService.advertisersSubject,
                this.filterService.partnersSubject,
                this.filterService.kpisSubject,
                this.filterService.metaCampaignsSubject,
            ).subscribe({
            next : (latestValues) => {
                let data = latestValues[0];
                console.log("jxtruc")
                console.log(data)
                /**TODO : retirer**/
                //data = data.splice(1,10)
/************************************************************************************/
                    /**
                     * Takes data as given by the api, and maps it, to keep :
                     * key : unique key composed of the values of the grouping criterias indicated in th eipnut,
                     * separated by a double underscore (__)
                     * conversions
                     * certified_conversions
                     * returns an array
                     */
                let groupByFieldsWithDetails = this.detailsAvailableGroupByFields.filter((elem)=>{
                         return this.groupByFields.indexOf(elem.id) != -1
                     });

                    let groupedByData = data.map((dataElem)=>{
                        let key = "";
                        groupByFieldsWithDetails.forEach((groupByElem) => { key += dataElem[groupByElem.id]+"__"; });
                        let object = {
                            key : key,
                            conversions : dataElem.conversions,
                            certified_conversions : dataElem.certified_conversions,
                        }
                        return object;
                    }).reduce((acc,elem,index,array)=>{
                        /**
                         * Reduce data : from a array of {key, conversions, certified_conversions}, makes an associative array
                         * which renders a unique object per set of grouping criteria (unique key generated above), containing
                         * aggregated conversions and aggregated certified_conversions.
                         * The key is not anymore in the object but present as key of the associative array.
                         */
                        if(!acc[elem.key]){
                            acc[elem.key] = {
                                certified_conversions : elem.certified_conversions,
                                conversions : elem.conversions,
                            };
                        }else{
                             acc[elem.key].certified_conversions += elem.certified_conversions;
                             acc[elem.key].conversions += elem.conversions;
                        }
                        return acc;
                    }, []);

                    /**
                     * Iterate on groupedByData
                     * Splits key (unique key composed of grouping items) into an array.
                     * Uses this.groupByFieldsWithDetails, which contains the key names in the same order, to map and inject
                     * each grouping item's id at the right key.
                     * At the end of the loop, data2 contains the conversions and certified_conversions, and an attribute for
                     * each grouping criteria ( criteria_name : criteria_value )
                     */
                    let data2 = []
                    for (var key in groupedByData) {
                        let keys = key.split("__")
                        groupByFieldsWithDetails.map((groupByElem, index) => {
                            if(groupByElem.details != []){


                                    //groupByElem.details.filter((elem)=>{ return elem[groupByElem.pk_identifier] == groupedByData[key][groupByElem.pk_identifier] })

                            }
                            /*
                            console.log("type d'id :");
                            console.log(groupByElem.pk_identifier );
                            console.log("valeur id:")
                            console.log(keys[index]);
                            console.log("Push into :");
                            console.log(groupedByData[key]);
                            console.log("A trouver dans:");
                            */
                            let detailedArray = []
                            for (var truc of groupByElem.details) {
                                detailedArray[truc[groupByElem.pk_identifier]] = truc.name
                            }
                            //console.log(detailedArray)
                        //console.log(groupByElem.details.filter(function(e){return true}));
                            groupedByData[key][groupByElem.id] = detailedArray[keys[index]]
                        })
                        let percentage = (groupedByData[key].certified_conversions / groupedByData[key].conversions) * 100;
                        groupedByData[key]["percent_certified"] = percentage.toFixed(2);
                        data2.push(groupedByData[key])
                    }
                    console.log(data2)

                    this.debugLog("");
                    this.debugLog(data2);
/**********************************************************************************************************/

                    /**
                     * Data for the dataTable
                     */
                    this.data = data2;
                    this.filteredData = this.data;
                    this.filteredTotal = this.data.length;
                    this.filter();
            },
            error: (err) => console.error(err),
        });
    }

    ngOnInit(): void {
        this.columns = [
            { name : 'conversions', label:'Conversions' },
            { name : 'certified_conversions', label:'Certified Conversions', numeric: true },
            { name : 'percent_certified', label:'Percentage of Certified Conversions', numeric: true },
        ];
        /**
         * Add one column per grouping parameter
         */
        this.groupByFields.forEach((field)=>{
            console.log(field)
            //this.columns.unshift({name : field.id, label : field.label });
        });
    }

    sort(sortEvent: ITdDataTableSortChangeEvent): void {
        this.sortBy = sortEvent.name;
        this.sortOrder = sortEvent.order;
        this.filter();
    }

    search(searchTerm: string): void {
        this.searchTerm = searchTerm;
        this.filter();
    }

    page(pagingEvent: IPageChangeEvent): void {
        this.fromRow = pagingEvent.fromRow;
        this.currentPage = pagingEvent.page;
        this.pageSize = pagingEvent.pageSize;
        this.filter();
    }

    filter(): void {
        let newData: any[] = this.data;
        newData = this._dataTableService.filterData(newData, this.searchTerm, true);
        this.filteredTotal = newData.length;
        newData = this._dataTableService.sortData(newData, this.sortBy, this.sortOrder);
        newData = this._dataTableService.pageData(newData, this.fromRow, this.currentPage * this.pageSize);
        this.filteredData = newData;
    }

}
