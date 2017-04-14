import { Component, OnInit } from '@angular/core';

import { AlertService } from '../_services/index';

@Component({
  moduleId: module.id,
  selector: 'alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit {

    message: any;

    constructor(private alertService: AlertService) { }

    ngOnInit() {
        this.alertService.getMessage().subscribe({
            next : message => { this.message = message; },
            error: (err) => console.error(err),
        });
    }

}
