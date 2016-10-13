import { Injectable }     	from '@angular/core';
import { Http, Response } 	from '@angular/http';
import { Location }         from '@angular/common';
import { Observable }       from 'rxjs';

import { CClass }           from './cclass';
import { KlassKeyword }     from './klass-keyword';

@Injectable()
export class CClassSearchService {

	private searchUrl = '/CI/index.php/api/classes/search';

	constructor(private location:Location,private http: Http) {}

	// Legacy
	search(term: string): Observable<KlassKeyword[]> {

        let req_url = `${this.location._baseHref}/CI/index.php/api/classes/search/?q=${term}`;

		return this.http
		           .get(req_url)
                   .map((r: Response) => {

                       // TODO 필터링 및 후처리 작업을 여기서 수행합니다.

                       // FIXME - 에러 핸들링은 어떻게?

                       return r.json().data as KlassKeyword[];
                   });
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