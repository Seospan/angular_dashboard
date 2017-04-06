import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Router} from '@angular/router';
import { DOCUMENT } from '@angular/platform-browser';

import { AppConfig } from '../app.config';
import { Advertiser } from '../models/server-models/index';

/**
* @class AdvertiserService
* @classdesc Service for getting the Advertisers from the API
* @property {String} this.ENDPOINT_URL - The endpoint where to fetch objects on the Django API.
* @this Person
*/
@Injectable()
export class AdvertiserService {

    ENDPOINT_URL : string = '/advertisers/';

    constructor(private http: Http, private config: AppConfig, private router: Router) { }

    /**
     * Make a reqest to the API and return a Promise for the set of all Advertisers
     * @method getAll
     * @return {Promise} Promise for the list of all the Advertisers from the API
     */
    getAll():Promise<any[] | Advertiser[]> {
        return this.http.get(this.config.apiRequestUrl + this.ENDPOINT_URL, this.jwt())
            .toPromise()
            .then(response => {
                return response.json() as Advertiser[];
            })
            .catch(error => {
                console.log("error : "+error.json().detail);
                console.log(error.json());
                this.router.navigate(['/login'], { queryParams: { returnUrl : window.location.pathname }});
                return [];
            });
    }


    /**
     * Retrieves JWT token from localStorage and returns it if available. For use in HTTP requests
     * @method jwt
     * @return {[type]} [description]
     */
    private jwt() {
        // create authorization header with jwt token
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser && currentUser.token) {
            let headers = new Headers({ 'Authorization': 'JWT ' + currentUser.token });
            return new RequestOptions({ headers: headers });
        }
    }
}
