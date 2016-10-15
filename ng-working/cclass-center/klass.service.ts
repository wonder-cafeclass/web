// import 'rxjs/add/operator/toPromise';

import { Injectable } from '@angular/core';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import { Location }     from '@angular/common';

import { CClass } from './cclass';
import { KlassLevel } from './klass-level';
import { KlassStation } from './klass-station';
import { KlassDay } from './klass-day';
import { KlassTime } from './klass-time';

@Injectable()
export class KlassService {

    private classesUrl = '/CI/index.php/api/klass/list';
    private klassLevelUrl = '/CI/index.php/api/klass/level';
    private klassStationUrl = '/CI/index.php/api/klass/station';
    private klassDayUrl = '/CI/index.php/api/klass/day';
    private klassTimeUrl = '/CI/index.php/api/klass/time';
    private baseHref = "";

    static nextCClassId = 100;

    // New - XHR
    // promise-based

    constructor(private location:Location,private http: Http) {
        this.baseHref = this.location._baseHref;
    }

    getKlassList (klassLevel:string, subwayStation:string, klassDay:string, klassTime:string): Promise<CClass[]> {

        var req_url = `${this.baseHref}${this.classesUrl}?level=${klassLevel}&station=${subwayStation}&day=${klassDay}&time=${klassTime}`;

        console.log("TEST / req_url ::: ", req_url);

        return this.http.get(req_url)
                      .toPromise()
                      .then(this.extractData)
                      .catch(this.handleError);

    }
    
    getCClasses (): Promise<CClass[]> {
        return this.http.get(this.baseHref + this.classesUrl)
                      .toPromise()
                      .then(this.extractData)
                      .catch(this.handleError);
    }

    getKlassLevel(): Promise<KlassLevel[]> {
        return this.http.get(this.baseHref + this.klassLevelUrl)
                      .toPromise()
                      .then(this.extractData)
                      .catch(this.handleError);

    }

    getKlassStation(): Promise<KlassStation[]> {
        return this.http.get(this.baseHref + this.klassStationUrl)
                      .toPromise()
                      .then(this.extractData)
                      .catch(this.handleError);

    }

    getKlassDay(): Promise<KlassDay[]> {
        return this.http.get(this.baseHref + this.klassDayUrl)
                      .toPromise()
                      .then(this.extractData)
                      .catch(this.handleError);

    }

    getKlassTime(): Promise<KlassTime[]> {
        return this.http.get(this.baseHref + this.klassTimeUrl)
                      .toPromise()
                      .then(this.extractData)
                      .catch(this.handleError);

    }

    private extractData(res: Response) {
        let body = res.json();

        // TODO - 데이터 검증 프로세스.

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

            // TODO - Activate error logger

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