import { Component, OnInit } from '@angular/core';

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

    private data : FraudDataElem[];
    private columns : ITdDataTableColumn[];

    filteredData: any[];
    filteredTotal: number;

    searchTerm: string = '';
    fromRow: number = 1;
    currentPage: number = 1;
    pageSize: number = 5;
    sortBy: string = 'conversion_date';
    sortOrder: TdDataTableSortingOrder = TdDataTableSortingOrder.Descending;

    dataFraudDetectorSubscription : Subscription

    constructor(private filterService : FilterService,
        private dataFraudDetectorService : DataFaudDetectorService,
        private _dataTableService: TdDataTableService) {
        this.dataFraudDetectorService.dataFraudDetector.subscribe({
            next : (data) => {
                this.data = data;
                this.filteredData = this.data;
                this.filteredTotal = this.data.length;
                this.filter();
            },
            error: (err) => console.error(err),
        });
        this.columns = [
            { name : 'advertiser_id', label:'Advertiser' },
            { name : 'attribution_model_id', label:'Attribution Model' },
            { name : 'certified_conversions', label:'Cartified Conversions' },
            { name : 'conversion_date', label:'Date' },
            { name : 'conversions', label:'Conversions' },
            { name : 'kpi_id', label:'Kpi' },
            { name : 'metacampaign_id', label:'Meta Campaign' },
            { name : 'partner_id', label:'Partner' },
        ]
    }

    ngOnInit(): void {
        //this.filter();
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
