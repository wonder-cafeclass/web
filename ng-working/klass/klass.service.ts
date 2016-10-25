import { Injectable }             from '@angular/core';
import { 
    Headers, 
    Http, 
    Response, 
    RequestOptions 
}                                 from '@angular/http';
import { Klass }                  from './model/klass';
import { KlassLevel }             from './model/klass-level';
import { KlassStation }           from './model/klass-station';
import { KlassDay }               from './model/klass-day';
import { KlassTime }              from './model/klass-time';
import { KlassSelectile }         from './model/klass-selectile';

import { UrlService }         from '../util/url.service';

@Injectable()
export class KlassService {

    private klassesUrl = '/CI/index.php/api/klass/list';
    private klassUrl = '/CI/index.php/api/klass/course';
    private klassSelectileUrl = '/CI/index.php/api/klass/selectile';
    private klassSearchUrl = '/CI/index.php/api/klass/search';
    private baseHref = "";

    constructor(private http: Http, private us:UrlService) {
    }

    searchKlassList (level:string, station:string, day:string, time:string, q:string): Promise<Klass[]> {

        let qEncoded = encodeURIComponent(q);

        // let req_url = `${ this.baseHref }${ this.klassSearchUrl }?level=${ level }&station=${ station }&day=${ day }&time=${ time }&q=${ qEncoded }`;
        let req_url = this.us.get(this.klassSearchUrl);

        req_url = `${ req_url }?level=${ level }&station=${ station }&day=${ day }&time=${ time }&q=${ qEncoded }`;

        // console.log("TEST / searchKlassList / req_url : ",req_url);

        return this.http.get(req_url)
                      .toPromise()
                      .then(this.extractData)
                      .catch(this.handleError);

    }

    getKlass (id: number | string): Promise<Klass> {
        
        // let req_url = `${ this.baseHref }${ this.klassUrl }?id=${ id }`;

        let req_url = this.us.get(this.klassUrl);
        req_url = `${ req_url }?id=${ id }`;

        // console.log("TEST / getKlass / req_url : ",req_url);

        return this.http.get(req_url)
                      .toPromise()
                      .then(this.extractData)
                      .catch(this.handleError);
    }
    
    getKlasses (): Promise<Klass[]> {

        let req_url = this.us.get(this.klassesUrl);

        // console.log("TEST / getKlasses / req_url : ",req_url);

        return this.http.get(req_url)
                      .toPromise()
                      .then(this.extractData)
                      .catch(this.handleError);
    }
    
    getKlassSelectile(): Promise<KlassSelectile[]> {

        let req_url = this.us.get(this.klassSelectileUrl);

        // console.log("TEST / getKlassSelectile / req_url : ",req_url);

        return this.http.get(req_url)
                      .toPromise()
                      .then(this.extractData)
                      .catch(this.handleError);

    }

    private extractData(res: Response) {

        let body = res.json();

        // console.log("KlassService / extractData / body ::: ",body);

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
    
    // TODO - selectile의 해당 사항이 없는 항목들은 제외 시켜야 함.
    // TODO - 4가지 주요 선택 항목에 대해서는 DB indexing이 필요함.

}
