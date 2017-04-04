import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.css']
})
export class DefaultComponent implements OnInit {

  items: Object[] = [{
      color: 'purple-700',
      description: 'Your tool to monitor suspicious conversions activity!',
      icon: 'view_quilt',
      route: 'fraud-detector',
      title: 'Fraud Detector',
    }, {
      color: 'blue-700',
      description: 'Compare campaigns results using multiple attribution models!',
      icon: 'color_lens',
      route: 'multi-attribution',
      title: 'Multi Attribution Models',
    }, {
      color: 'teal-700',
      description: 'Program your reports here!',
      icon: 'view_quilt',
      route: 'reporting',
      title: 'Repporting',
    },
  ];

  constructor() { }

  ngOnInit() {
    
  }

}
