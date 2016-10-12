// import 'rxjs/add/operator/toPromise';

import { Injectable }     	from '@angular/core';
import { Http, Response } 	from '@angular/http';
import { Observable }		from 'rxjs';
import { CClass } 			from './cclass';

import { Location }     from '@angular/common';


@Injectable()
export class CClassSearchService {

	private searchUrl = '/CI/index.php/api/classes/search';

	constructor(private location:Location,private http: Http) {}

	// Legacy
	search(term: string): Observable<CClass[]> {

		console.log("CClassSearchService / search2 / term ::: ",term);

        let req_url = this.location._baseHref + this.searchUrl + `?q=${term}`;

        console.log("CClassSearchService / search2 / req_url ::: ",req_url);

		return this.http
		           .get(req_url)
		           .map(this.extractClasses);
	}

    /*
    search (term: string): Promise<CClass[]> {

        let req_url = this.location._baseHref + this.searchUrl + `?q=${term}`;

        console.log("CClassSearchService / search2 / req_url ::: ",req_url);

        return this.http.get(req_url)
                      .toPromise()
                      .then(this.extractClasses)
                      .catch(this.handleError);
    }
    */

    
    private extractClasses(res: Response) : CClass[] {

        console.log("extractClasses / res :: ",res);

        return res.json().data as CClass[];

        // res.json().data as CClass[]

        // let cclasses = res.json().data as CClass[];
        // return Observable.of<CClass[]>(cclasses);
    } 


    private extractData(res: Response) {
        let body = res.json();

        console.log("CClassSearchService / extractData / body ::: ",body);
        // console.log("extractData / body.data ::: ",body.data);

        return body.data || { };
    }

    private handleError (error: any) {
        // In a real world app, we might use a remote logging infrastructure
        // We'd also dig deeper into the error to get a better message
        let errMsg = (error.message) ? error.message :
        error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg); // log to console instead
        return Promise.reject(errMsg);
    }



}