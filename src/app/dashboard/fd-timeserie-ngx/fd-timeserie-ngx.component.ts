import { Component, OnInit, Input } from '@angular/core';

import { NumberCardComponent } from '@swimlane/ngx-charts';

import { TdDigitsPipe } from '@covalent/core';

import { Subscription }   from 'rxjs/Subscription';

import { DataFaudDetectorService } from '../services/data-fraud-detector.service';
import { RLikeDataTable } from '../../models/app-models/r-like-datatable';
import { FraudDataElem } from '../../models/server-models/fraud-data-elem';

@Component({
  selector: 'app-fd-timeserie-ngx',
  templateUrl: './fd-timeserie-ngx.component.html',
  styleUrls: ['./fd-timeserie-ngx.component.scss']
})
export class FdTimeserieNgxComponent implements OnInit {

    filteredFraudDataSubscription : Subscription;

    data: any[];

    single: any[] = [];

    multi: any[] = [];

    view: any[] = [700, 400]

    //option
    showXAxis: boolean = true;
    showYAxis: boolean = true;
    gradient: boolean = true;
    showLegend: boolean = true;
    showXAxisLabel: boolean = true;
    xAxisLabel: string = '';
    showYAxisLabel: boolean = true;
    yAxisLabel: string = 'Sales';

    colorScheme: any = {
      domain: ['#1565C0', '#03A9F4', '#1976D2', '#039BE5', '#00BCD4', '#FB8C00', '#FFA726', '#FFCC80', '#FFECB3'],
    };

    // line, area
    autoScale: boolean = false;

    // Which graph should be drawn
    timeSerieGraph: boolean = false;
    numberCardGraph: boolean = false;
    histogramGraph: boolean = false;

    detailsAvailableGroupByFields : [{id:string,name:string,label:string,details:string,pk_identifier:string}] = [
            {id:'metacampaign_id',name:'metacampaign_name',label:'Meta Campaign',details:'metaCampaignsNames',pk_identifier:"id"},
            {id:'partner_id',name:'partner_name',label:'Partners',details:'partnersNames',pk_identifier:"id"},
            {id:'advertiser_id',name:'common_name_name',label:'Advertiser',details:'advertisersNames',pk_identifier:"sizmek_id"},
            {id:'kpi_id',name:'kpi_name',label:'Kpi',details:'kpisNames',pk_identifier:"id"},
            {id:'conversion_date',name:'',label:'Conversion Date',details:"", pk_identifier:""},
        ];
    groupByFieldsWithDetails: {id:string,name:string,label:string,details:string,pk_identifier:string}[];

    detailsAvailableMeasures: [{col_name:string, label:string}] = [
        {col_name:'conversions', label:'Conversions'},
        {col_name:'certified_conversions', label:'Certified Conversions'},
        {col_name:'percent_certified', label:'% Certified Conversions'}
    ];

    usedMeasures: {col_name:string, label:string}[];

    // Input
    @Input() graphTitle: string;
    @Input() measuresTable : string[];
    @Input() defaultGroupByFields : string[];
    @Input() graphType:string;

    constructor(
        private dataFraudDetectorService : DataFaudDetectorService
        ,) {

    }
    axisDigits(val: any): any {
        return new TdDigitsPipe().transform(val);
    }

    ngOnInit() {
        // Get the detailed columns
        this.groupByFieldsWithDetails = this.detailsAvailableGroupByFields.filter((e)=>{ return this.defaultGroupByFields.indexOf(e.id) != -1 })
        this.usedMeasures = this.detailsAvailableMeasures.filter((e) => { return this.measuresTable.indexOf(e.col_name) != -1 })
        console.log(this.usedMeasures)
        // Define which graph should be drawn in function of the Input


      // get the data
      this.filteredFraudDataSubscription = this.dataFraudDetectorService.filteredFraudDataSubject.subscribe({
          next: (filtered_data)=>{
              //
              //console.log("filtered_data")
              //console.log(filtered_data)
            let aggregated_and_filtered_data = this.dataFraudDetectorService
                .aggregateFilteredData(filtered_data,this.groupByFieldsWithDetails)


            switch(this.graphType) {
                case 'timeserie':
                    this.timeSerieGraph = true;
                    let aggregated_and_filtered_data_DT = new RLikeDataTable;
                    aggregated_and_filtered_data_DT.createFromObjectArray(aggregated_and_filtered_data);
                    let conversion_date = aggregated_and_filtered_data_DT.getColumn('conversion_date');
                    let certified_conversions = aggregated_and_filtered_data_DT.getColumn('certified_conversions');
                    let conversions = aggregated_and_filtered_data_DT.getColumn('conversions');
                    let certified_conversions_series = [];
                    for (var i=0; i<conversion_date.length; i++) {
                        let object = {
                            'value': certified_conversions[i],
                            'name': new Date(conversion_date[i])
                        }
                        certified_conversions_series.push(object);
                    }
                    let conversions_series = [];
                    for (var i=0; i<conversion_date.length; i++) {
                        let object = {
                            'value': conversions[i],
                            'name': new Date(conversion_date[i])
                        }
                        conversions_series.push(object);
                    }
                    this.multi = [{
                        'name': 'Conversions',
                        'series': conversions_series
                    }, {
                        'name': 'Certified Conversions',
                        'series': certified_conversions_series
                    },
                    ]
                    break;
                case 'number-card':
                    this.numberCardGraph = true;
                    let simpleSerie = aggregated_and_filtered_data.map((obj) => {
                        return {
                            'name': obj['partner_name'],
                            'value': obj['percent_certified'],
                        }
                    })
                    this.single = simpleSerie
                    break;
                case 'histogram':
                    this.histogramGraph = true;
                    this.transformDataForMultiGraph(
                        aggregated_and_filtered_data,
                        this.defaultGroupByFields[0],
                        this.groupByFieldsWithDetails,
                        this.usedMeasures,
                    )
                    break;
            }
        },
        error: (err) => console.error(err),
        });
    }

    transformDataForMultiGraph(aggregated_and_filtered_data:any[], dimension:string, detailed_dimension:any[], measures:any[]):void {
        let aggregated_and_filtered_data_DT = new RLikeDataTable;
        aggregated_and_filtered_data_DT.createFromObjectArray(aggregated_and_filtered_data);
        let dimension_value = aggregated_and_filtered_data_DT.getColumn(dimension);
        let result = [];
        measures.map((measure) => {
            let series = [];
            let measure_data = aggregated_and_filtered_data_DT.getColumn(measure.col_name);
            for (var i=0; i<dimension_value.length; i++) {
                let object = {
                    'value': measure_data[i],
                    'name': dimension_value[i],
                }
                series.push(object);
            }
            result.push({
                'name': measure.label,
                'series': series,
            })
        })
        this.multi = result;
        let result2 = [];
        aggregated_and_filtered_data.map((row) => {
            let series= []
            measures.map((measure) => {
                let object = {
                    'value': row[measure.col_name],
                    'name': measure.label,
                }
                series.push(object);
            })
            console.log(series)
            result2.push({
                'name': row[detailed_dimension[0].name],
                'series': series,
            })
        })
        console.log(result);
        console.log(result2);
        this.multi = result2;
    }
}
