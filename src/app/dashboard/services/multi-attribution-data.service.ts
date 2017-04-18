import { Injectable } from '@angular/core';

import { Subject } from 'rxjs/Subject';

@Injectable()
export class MultiAttributionDataService {
    attributionModelIdSubject = new Subject<number>();
    truc = "bidule";

    constructor() { }

}
