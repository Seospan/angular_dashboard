import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs/Subject';

@Injectable()
export class FilterService {
    constructor() { }

    private showFiltersSource = new Subject<boolean>();

    showFilters = this.showFiltersSource.asObservable();

    /*getShowFilters():boolean{
      return this.showFilters;
    }*/

    setShowFilters(val:boolean):boolean{
      this.showFiltersSource.next(val);
      return val;
    }
}
