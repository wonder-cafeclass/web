// import 'rxjs/add/operator/toPromise';

import { Injectable } from '@angular/core';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import { Location }     from '@angular/common';

import { CClass } from './cclass';

@Injectable()
export class CClassService {

    private classesUrl = '/CI/index.php/api/classes/list';

    static nextCClassId = 100;

    // New - XHR
    // promise-based

    constructor(private location:Location,private http: Http) {}
    
    getCClasses (): Promise<CClass[]> {
        return this.http.get(this.location._baseHref + this.classesUrl)
                      .toPromise()
                      .then(this.extractData)
                      .catch(this.handleError);
    }

    private extractData(res: Response) {
        let body = res.json();

        console.log("CClassService / extractData / body ::: ",body);
        // console.log("extractData / body.data ::: ",body.data);

        return body.data || { };
    }

    // New - XHR
    // promise-based
    private handleError (error: any) {
        // In a real world app, we might use a remote logging infrastructure
        // We'd also dig deeper into the error to get a better message
        let errMsg = (error.message) ? error.message :
        error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg); // log to console instead
        return Promise.reject(errMsg);
    }
    
    getCClass(id: number | string) {
        return this.getCClasses().then(cclasses => cclasses.find(cclass => cclass.id === +id));
    }

    addCClass(title: string) {
        title = title.trim();
        if (title) {
            // FIX ME

            // let cclass = new CClass(CClassService.nextCClassId++, title);
            // cclassesPromise.then(cclasses => cclasses.push(cclass));
        }
    }

}


/*
Copyright 2016 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/