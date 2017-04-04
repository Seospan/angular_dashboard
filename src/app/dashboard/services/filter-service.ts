import { Injectable } from '@angular/core';

@Injectable()
export class FilterService {
    constructor() { }

    showFilters:boolean;

    getShowFilters():boolean{
      return this.showFilters;
    }

    setShowFilters(val:boolean):boolean{
      this.showFilters=val;
      return val;
    }
}
