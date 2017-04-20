import { Component, OnInit } from '@angular/core';

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
      domain: ['#1565C0', '#03A9F4', '#FFA726', '#FFCC80'],
    };

    // line, area
    autoScale: boolean = false;


  constructor(
      private dataFraudDetectorService : DataFaudDetectorService
      ,) {

      this.multi = this.multi.map((group: any) => {
          group.series = group.series.map((dataItem: any) => {
            dataItem.name = new Date(dataItem.name);
            return dataItem;
          });
          return group;
        });
    console.log("this.multi");
    console.log(this.multi);
  }
    axisDigits(val: any): any {
        return new TdDigitsPipe().transform(val);
    }

  ngOnInit() {
      this.filteredFraudDataSubscription = this.dataFraudDetectorService.filteredFraudDataSubject.subscribe({
          next: (filtered_data)=>{
              //
              console.log("filtered_data")
              console.log(filtered_data)
              let aggregated_and_filtered_data = this.dataFraudDetectorService
              .aggregateFilteredData(filtered_data,
                  [{id:'conversion_date',name:'',label:'Conversion Date',details:"", pk_identifier:""}])
              let aggregated_and_filtered_data_DT = new RLikeDataTable;
              aggregated_and_filtered_data_DT.createFromObjectArray(aggregated_and_filtered_data);
              let conversion_date = aggregated_and_filtered_data_DT.getColumn('conversion_date');
              let certified_conversions = aggregated_and_filtered_data_DT.getColumn('certified_conversions');
              let conversions = aggregated_and_filtered_data_DT.getColumn('conversions');
              let certified_conversions_series = [];
              console.log('certified_conversions.length')
              console.log(certified_conversions.length)
              for (var i=0; i<conversion_date.length; i++) {
                  let object = {
                      'value': certified_conversions[i],
                      'name': new Date(conversion_date[i])
                  }
                  certified_conversions_series.push(object);
              }
              console.log(certified_conversions_series);
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
              console.log(this.multi)

              //this.filteredData = filtered_data;
              //this.findDetailedDimensionsAndAggregate(this.filteredData);
              },
          error: (err) => console.error(err),
      });
  }

}
