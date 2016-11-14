import { Injectable }             from '@angular/core';
import { 
    Headers, 
    Http, 
    Response, 
    RequestOptions 
}                                 from '@angular/http';
import { Observable }             from 'rxjs';
import { Klass }                  from './model/klass';
import { KlassLevel }             from './model/klass-level';
import { KlassStation }           from './model/klass-station';
import { KlassDay }               from './model/klass-day';
import { KlassTime }              from './model/klass-time';
import { KlassSelectile }         from './model/klass-selectile';
import { KlassVenue }             from './model/klass-venue';

import { UrlService }             from '../util/url.service';

@Injectable()
export class KlassService {

    private klassesUrl = '/CI/index.php/api/klass/list';
    private klassUrl = '/CI/index.php/api/klass/course';
    private klassSelectileUrl = '/CI/index.php/api/klass/selectile';
    private klassSearchUrl = '/CI/index.php/api/klass/search';
    private klassVenueSearchLocalUrl = '/CI/index.php/api/naver/searchlocal';
    private klassVenueSearchMapUrl = '/CI/index.php/api/naver/searchmap';

    private baseHref = "";

    constructor(private http: Http, private us:UrlService) {
    }

    searchKlassVenue (q:string): Observable<KlassVenue[]> {

        let qEncoded = encodeURIComponent(q);
        let req_url = this.us.get(this.klassVenueSearchLocalUrl);

        req_url = `${ req_url }?q=${ qEncoded }`;
        console.log("klass.service.ts / searchKlassVenue / req_url : ",req_url);

        return this.http.get(req_url).map(this.getKlassVenue);

    }
    private getKlassVenue(r: Response): KlassVenue[] {

      let responseJson = r.json();
      let result = [];
      if( null != responseJson && 
          null != responseJson.data && 
          null != responseJson.data.result ) {

          result = responseJson.data.result;
      }

      // 예외 사항 검사
      if(0 < result.length) {
        let element = result[0];
        if(null == element) {
          console.log("!Error! / klass.service.ts / null == element");
          console.log("r : ",r);
          return [];
        } else if(null == element.title) {
          console.log("!Error! / klass.service.ts / null == element.title");
          console.log("r : ",r);
          return [];
        }
      }

      return result as KlassVenue[];
    }

    searchKlassMap (q:string): Promise<KlassVenue> {

      let qEncoded = encodeURIComponent(q);
      let req_url = this.us.get(this.klassVenueSearchMapUrl);

      req_url = `${ req_url }?q=${ qEncoded }`;
      // console.log("klass.service.ts / searchKlassMap / req_url : ",req_url);

      
      return this.http.get(req_url)
                  .toPromise()
                  .then(this.getLatLon)
                  .catch(this.handleError);
    }
    private getLatLon(r:Response)  :KlassVenue {

      let responseJson = r.json();
      let result:KlassVenue = 
      new KlassVenue(
        // public title:string
        "",
        // public telephone:string
        "",
        // public address:string
        "",
        // public roadAddress:string
        "",
        // public latitude:number
        0,
        // public longitude:number
        0
      );

      if(!responseJson.success) {
        return result;
      }

      // 위도 / latitude / point.y
      // * 위도 값의 범위 : +90.00000(North)북위 90도 ~ -90.000000(South)남위 90도
      let latitude:number = null;
      // 경도 / longitude / point.x
      // * 경도 값의 범위 : +180.000000(East)동경 180도 ~ -180.000000(West)서경 180도 [그리니치 천문대 기준 0도]                          
      let longitude:number = null;
      if( null != responseJson && 
          null != responseJson.data && 
          null != responseJson.data.result && 
          null != responseJson.data.result[0] && 
          null != responseJson.data.result[0].x &&
          null != responseJson.data.result[0].y  ) {

          longitude = parseFloat(responseJson.data.result[0].x);
          latitude = parseFloat(responseJson.data.result[0].y);
      }

      if(null != longitude) {
        result.longitude = longitude;
      }
      if(null != latitude) {
        result.latitude = latitude;
      }

      return result;
    }

    searchKlassList (level:string, station:string, day:string, time:string, q:string): Promise<Klass[]> {

        let qEncoded = encodeURIComponent(q);
        let req_url = this.us.get(this.klassSearchUrl);

        req_url = `${ req_url }?level=${ level }&station=${ station }&day=${ day }&time=${ time }&q=${ qEncoded }`;
        // console.log("TEST / searchKlassList / req_url : ",req_url);

        return this.http.get(req_url)
                      .toPromise()
                      .then(this.extractData)
                      .catch(this.handleError);

    }

    getKlass (id: number | string): Promise<Klass> {
        
        let req_url = this.us.get(this.klassUrl);
        req_url = `${ req_url }?id=${ id }`;

        console.log("TEST / getKlass / req_url : ",req_url);

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
    
    // TODO - selectile의 해당 사항이 없는 항목들은 제외 시켜야 함.
    // TODO - 4가지 주요 선택 항목에 대해서는 DB indexing이 필요함.

}
