import { Injectable } from '@angular/core';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import { Location }     from '@angular/common';

import { CClass } from './cclass';
import { KlassLevel } from './klass-level';
import { KlassStation } from './klass-station';
import { KlassDay } from './klass-day';
import { KlassTime } from './klass-time';
import { KlassSelectile } from './klass-selectile';

@Injectable()
export class KlassService {

    private classesUrl = '/CI/index.php/api/klass/list';
    private klassSelectileUrl = '/CI/index.php/api/klass/selectile';
    private klassSearchUrl = '/CI/index.php/api/klass/search';
    private baseHref = "";

    // REMOVE ME
    // static nextCClassId = 100;

    // New - XHR
    // promise-based

    constructor(private location:Location,private http: Http) {
        this.baseHref = this.location._baseHref;
    }

    searchKlassList (level:string, station:string, day:string, time:string, q:string): Promise<CClass[]> {

        let qEncoded = encodeURIComponent(q);
        let req_url = `${ this.baseHref }${ this.klassSearchUrl }?level=${ level }&station=${ station }&day=${ day }&time=${ time }&q=${ qEncoded }`;

        console.log("TEST / req_url ::: ",req_url);

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
    getKlassSelectile(): Promise<KlassSelectile[]> {
        return this.http.get(this.baseHref + this.klassSelectileUrl)
                      .toPromise()
                      .then(this.extractData)
                      .catch(this.handleError);

    }

    private extractData(res: Response) {

        let body = res.json();

        console.log("KlassService / extractData / body ::: ",body);

        // TODO - 데이터 검증 프로세스.
        if(null == body.data || !body.success) {
            return null;
        }

        return body.data;
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
    

    /*
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
    */

    // TODO - selectile의 해당 사항이 없는 항목들은 제외 시켜야 함.
    // TODO - 4가지 주요 선택 항목에 대해서는 DB indexing이 필요함.

}
