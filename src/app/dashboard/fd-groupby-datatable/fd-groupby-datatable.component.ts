import { Component, OnInit, Input } from '@angular/core';

import {
    TdDataTableService,
    TdDataTableSortingOrder,
    ITdDataTableSortChangeEvent,
    ITdDataTableColumn,
    IPageChangeEvent } from '@covalent/core';

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
    pageSize: number = 50;
    sortBy: string = 'conversions';
    sortOrder: TdDataTableSortingOrder = TdDataTableSortingOrder.Descending;

    dataFraudDetectorSubscription : Subscription

    detailsAvailableGroupByFields : [{id:string,name:string,label:string,details:string,pk_identifier:string}] = [
            {id:'metacampaign_id',name:'metacampaign_name',label:'Meta Campaign',details:'metaCampaignsNames',pk_identifier:"id"},
            {id:'partner_id',name:'partner_name',label:'Partners',details:'partnersNames',pk_identifier:"id"},
            {id:'advertiser_id',name:'common_name_name',label:'Advertiser',details:'advertisersNames',pk_identifier:"sizmek_id"},
            {id:'kpi_id',name:'kpi_name',label:'Kpi',details:'kpisNames',pk_identifier:"id"},
            {id:'conversion_date',name:'',label:'Conversion Date',details:"", pk_identifier:""},
        ];
    groupByFieldsWithDetails : {id:string,name:string,label:string,details:string,pk_identifier:string}[];

    @Input() groupByFields : string[];
    @Input() availableGroupByFields : string[];

    constructor(private filterService : FilterService,
        private dataFraudDetectorService : DataFaudDetectorService,
        private _dataTableService: TdDataTableService) {
            /* To work this component need the following data:
            - a filtered data feed (Subject) on the fraud detector data
            -
            */

            this.dataFraudDetectorService.dataFraudDetector.combineLatest(
                this.filterService.advertisersSubject,
                this.filterService.partnersSubject,
                this.filterService.kpisSubject,
                this.filterService.metaCampaignsSubject,
            ).subscribe({
            next : (latestValues) => {
                let data = latestValues[0];
                //console.log("jxtruc")
                //console.log(data)
                /**TODO : retirer**/
                //data = data.splice(1,10)


                /*
Factorized function

En fait elle ne marche pas:
* le service n'est pas connu par la fonction dès qu'on le sort de cet observer
* Du coup le problème c'est que la propriété details de groupByFieldsWithDetails n'existe pas
* De fait il n'arrive pas à faire le mapping
* Donc il faut :
*       1) virer le details de ce detailsAvailableGroupByFields, il ne sert à rien
*       2) créer un objet dataTableColumns avec juste les colonnes de base
*       3) transformer la fonction en observable de ce subject dans dataFraudDetectorService
*       4) S'abonner aux observables comme ici
*       5) Mettre en place les filtres
*       6) Faire le groupby, mettre en place les bonnes colonnes
*       7) renvoyer un object composé de:
*           a) la data
*           b) la liste de colonnes à rajouter
*       8) ici on fait un observer sur l'observable en question, on récupére l'object, on le casse en deux,
                 */
                //let data2 = this.dataFraudDetectorService.dataGroupBy(this.groupByFieldsWithDetails, data)

                    /**
                     * Data for the dataTable
                     */
                //this.data = data2;
                //this.filteredData = this.data;
                //this.filteredTotal = this.data.length;
                //this.filter();
            },
            error: (err) => console.error(err),
        });
    }

    ngOnInit(): void {

        this.dataFraudDetectorService.filteredFraudDataSubject.subscribe((filtered_data)=>{
                //Map details data to requested dimensions
                let detailedDimensions = this.detailsAvailableGroupByFields.filter((e)=>{ return this.groupByFields.indexOf(e.id) != -1 });
                //Get data and inject it into this.data for the datatable
                this.data = this.dataFraudDetectorService.aggregateFilteredData(filtered_data, detailedDimensions);
                this.filter();
            }
        );

        /**
         * Add one column per grouping parameter
         */
        this.groupByFieldsWithDetails = this.detailsAvailableGroupByFields.filter((elem)=>{
                 return this.groupByFields.indexOf(elem.id) != -1
             });
        this.columns = [
                 { name : 'conversions', label:'Conversions', numeric: true },
                 { name : 'certified_conversions', label:'Certified Conversions', numeric: true },
                 { name : 'percent_certified', label:'% Certified', numeric: true },
             ];
        this.groupByFieldsWithDetails.map((elem) => {
            console.log("trucjx2");
            console.log(elem);
            if(elem.name){
                this.columns.unshift({name: elem.id, label: elem.label+" ID"})
                this.columns.unshift({name: elem.name, label: elem.label})
            }else{
                //Covers for date (no name)
                this.columns.unshift({name: elem.id, label: elem.label})
            }
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
