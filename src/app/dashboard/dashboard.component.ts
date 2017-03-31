import { Component, HostBinding, OnInit } from '@angular/core';

declare var crossfilter: any;
import '../../../assets/js/crossfilter.min.js';

@Component({
  selector: 'app-dashboard',
  styleUrls: ['./dashboard.component.scss'],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {

  items: Object[] = [{
      color: 'purple-700',
      description: 'Your guide to start using the UI platform in your app!',
      icon: 'library_books',
      route: 'docs',
      title: 'Documentation',
    }, {
      color: 'blue-700',
      description: 'Teradata brand logo usage, color palettes and more',
      icon: 'color_lens',
      route: 'style-guide',
      title: 'Style Guide',
    }, {
      color: 'teal-700',
      description: 'Several different material design layout options for your apps',
      icon: 'view_quilt',
      route: 'layouts',
      title: 'Layouts',
    }, {
      color: 'green-700',
      description: 'Covalent Components, Directives, Pipes & Services',
      icon: 'picture_in_picture',
      route: 'components',
      title: 'Components & Addons',
    }, {
      color: 'green-700',
      description: 'FraudDetector Deshboard',
      icon: 'picture_in_picture',
      route: 'dashboard',
      title: 'FraudDetector',
    },
  ];
    crossfilterTest : any;
    mock_data = [
    {
      "album": "The White Stripes",
      "year": 1999,
      "US_peak_chart_post": "-"
    },
    {
      "album": "De Stijl",
      "year": 2000,
      "US_peak_chart_post": "-"
    },
    {
      "album": "White Blood Cells",
      "year": 2001,
      "US_peak_chart_post": 61
    },
    {
      "album": "Elephant",
      "year": 2003,
      "US_peak_chart_post": 6
    },
    {
      "album": "Get Behind Me Satan",
      "year": 2005,
      "US_peak_chart_post": 3
    },
    {
      "album": "Icky Thump",
      "year": 2007,
      "US_peak_chart_post": 2
    },
    {
      "album": "Under Great White Northern Lights",
      "year": 2010,
      "US_peak_chart_post": 11
    },
    {
      "album": "Live in Mississippi",
      "year": 2011,
      "US_peak_chart_post": "-"
    },
    {
      "album": "Live at the Gold Dollar",
      "year": 2012,
      "US_peak_chart_post": "-"
    },
    {
      "album": "Nine Miles from the White City",
      "year": 2013,
      "US_peak_chart_post": "-"
    },
    {
      "album": "Nine Miles from the White City",
      "year": 2013,
      "US_peak_chart_post": "-"
    }
  ];

  size = 3;

  year : any;
  filteredByYear : any;
  a :any;
  b : any;
  cross2 : any;
  ngOnInit(){
    this.crossfilterTest = new crossfilter(this.mock_data);
    /*this.year = this.crossfilterTest.dimension(function(d){ return d.year }, true);
    this.filteredByYear = this.year.filter([2000,2005]);
    this.a = this.crossfilterTest.size();*/
    this.b = this.crossfilterTest.size();
    this.cross2 = this.crossfilterTest.add([{
      "album": "Nine Miles from the White City22",
      "year": 201322,
      "US_peak_chart_post": "22-"
    }]);
    this.a = this.cross2.size();
  }

}
