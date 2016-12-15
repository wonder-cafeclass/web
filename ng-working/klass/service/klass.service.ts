import { Injectable }             from '@angular/core';
import { 
    Headers, 
    Http, 
    Response, 
    RequestOptions 
}                                 from '@angular/http';

import { Observable }             from 'rxjs';
import { Klass }                  from '../model/klass';
import { KlassLevel }             from '../model/klass-level';
import { KlassStation }           from '../model/klass-station';
import { KlassDay }               from '../model/klass-day';
import { KlassTime }              from '../model/klass-time';
import { KlassSelectile }         from '../model/klass-selectile';
import { KlassVenue }             from '../model/klass-venue';

import { UrlService }             from '../../util/url.service';
import { MyExtractor }            from '../../util/http/my-extractor';
import { MyResponse }             from '../../util/model/my-response';

@Injectable()
export class KlassService {

  private klassesUrl = '/CI/index.php/api/klass/list';
  private klassUrl = '/CI/index.php/api/klass/course';
  private klassNewUrl = '/CI/index.php/api/klass/coursenew';
  private klassSelectileUrl = '/CI/index.php/api/klass/selectile';
  private klassSearchUrl = '/CI/index.php/api/klass/search';
  private klassVenueSearchLocalUrl = '/CI/index.php/api/naver/searchlocal';
  private klassVenueSearchMapUrl = '/CI/index.php/api/naver/searchmap';

  private baseHref = "";

  private myExtractor:MyExtractor;

  constructor(private http: Http, private us:UrlService) {
    this.myExtractor = new MyExtractor();
  }

  searchKlassVenue (q:string): Observable<KlassVenue[]> {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("klass.service / searchKlassVenue / 시작");
    if(isDebug) console.log("klass.service / searchKlassVenue / q : ",q);

    let qEncoded = encodeURIComponent(q);
    let req_url = this.us.get(this.klassVenueSearchLocalUrl);

    req_url = `${ req_url }?q=${ qEncoded }`;

    if(isDebug) console.log("klass.service / searchKlassVenue / req_url : ",req_url);

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

  searchKlassMap (q:string): Promise<MyResponse> {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("klass.service / searchKlassMap / 시작");
    if(isDebug) console.log("klass.service / searchKlassMap / q : ",q);

    let qEncoded = encodeURIComponent(q);
    let req_url = this.us.get(this.klassVenueSearchMapUrl);

    req_url = `${ req_url }?q=${ qEncoded }`;
    if(isDebug) console.log("klass.service / searchKlassMap / req_url : ",req_url);
    
    return this.http.get(req_url)
              .toPromise()
              .then(this.myExtractor.extractData)
              .catch(this.myExtractor.handleError);
  }
  public getKlassVenueEmpty() :KlassVenue {
    let klassVenue:KlassVenue = 
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

    return klassVenue;     
  }
  private getLatLon(r:Response)  :KlassVenue {

    let responseJson = r.json();
    let klassVenue:KlassVenue = this.getKlassVenueEmpty();

    if(!responseJson.success) {
      return klassVenue;
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
      klassVenue.longitude = longitude;
    }
    if(null != latitude) {
      klassVenue.latitude = latitude;
    }

    return klassVenue;
  }

  searchKlassList ( level:string, 
                    station:string, 
                    day:string, 
                    time:string, 
                    q:string): Promise<MyResponse> {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("klass.service / searchKlassList / 시작");

    if(isDebug) console.log("klass.service / searchKlassList / level : ",level);
    if(isDebug) console.log("klass.service / searchKlassList / station : ",station);
    if(isDebug) console.log("klass.service / searchKlassList / day : ",day);
    if(isDebug) console.log("klass.service / searchKlassList / time : ",time);
    if(isDebug) console.log("klass.service / searchKlassList / q : ",q);

    let qEncoded = encodeURIComponent(q);
    let req_url = this.us.get(this.klassSearchUrl);

    req_url = `${ req_url }?level=${ level }&station=${ station }&day=${ day }&time=${ time }&q=${ qEncoded }`;
    if(isDebug) console.log("klass.service / searchKlassList / req_url : ",req_url);

    return this.http.get(req_url)
                  .toPromise()
                  .then(this.myExtractor.extractData)
                  .catch(this.myExtractor.handleError);

  }

  getKlass (id: number | string): Promise<MyResponse> {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("klass.service / getKlass / 시작");

    if(isDebug) console.log("klass.service / getKlass / id : ",id);

      
    let req_url = this.us.get(this.klassUrl);
    req_url = `${ req_url }?id=${ id }`;
    if(isDebug) console.log("klass.service / getKlass / req_url : ",req_url);

    return this.http.get(req_url)
                  .toPromise()
                  .then(this.myExtractor.extractData)
                  .catch(this.myExtractor.handleError);
  }

  getKlassNew (teacherId:number): Promise<MyResponse> {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("klass.service / getKlassNew / 시작");
      
    let req_url = this.us.get(this.klassNewUrl);
    req_url = `${ req_url }?teacher_id=${ teacherId }`;
    if(isDebug) console.log("klass.service / getKlassNew / req_url : ",req_url);

    return this.http.get(req_url)
                  .toPromise()
                  .then(this.myExtractor.extractData)
                  .catch(this.myExtractor.handleError);
  }  

  getKlasses (): Promise<MyResponse> {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("klass.service / getKlasses / 시작");

    let req_url = this.us.get(this.klassesUrl);

    if(isDebug) console.log("klass.service / getKlasses / req_url : ",req_url);

    return this.http.get(req_url)
                  .toPromise()
                  .then(this.myExtractor.extractData)
                  .catch(this.myExtractor.handleError);
  } // end getKlasses
  
  getKlassSelectile(): Promise<MyResponse> {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("klass.service / getKlassSelectile / 시작");

    let req_url = this.us.get(this.klassSelectileUrl);

    if(isDebug) console.log("klass.service / getKlassSelectile / req_url : ",req_url);

    return this.http.get(req_url)
                    .toPromise()
                    .then(this.myExtractor.extractData)
                    .catch(this.myExtractor.handleError);
  } // end getKlassSelectile

  getKlassListFromJSON(klassJSONList): Klass[] {  

    if(null == klassJSONList && 0 == klassJSONList.length) {
      return [];
    }

    let klassList:Klass[]=[];
    for (var i = 0; i < klassJSONList.length; ++i) {
      let klassJSON = klassJSONList[i];
      let klass:Klass = this.getKlassFromJSON(klassJSON);

      klassList.push(klass);
    }

    return klassList;
  }

  getKlassFromJSON(klassJSON): Klass {

    let klass:Klass = new Klass();

    // id,
    klass.id = -1;
    if(null != klassJSON.id) {
      klass.id = +klassJSON.id;
    }
    // teacher_id,
    klass.teacher_id = -1;
    if(null != klassJSON.teacher_id) {
      klass.teacher_id = +klassJSON.teacher_id;
    }
    // teacher_resume,
    klass.teacher_resume = klassJSON.teacher_resume;
    // teacher_greeting,
    klass.teacher_greeting = klassJSON.teacher_greeting;
    // title,
    klass.title = klassJSON.title;
    // desc,
    klass.desc = klassJSON.desc;
    // feature,
    klass.feature = klassJSON.feature;
    // target,
    klass.target = klassJSON.target;
    // schedule,
    klass.schedule = klassJSON.schedule;
    // date_begin,
    klass.date_begin = klassJSON.date_begin;
    // time_begin,
    klass.time_begin = klassJSON.time_begin;
    // time_duration_minutes,
    klass.time_duration_minutes = klassJSON.time_duration_minutes;
    // time_end,
    klass.time_end = klassJSON.time_end;
    // level,
    klass.level = klassJSON.level;
    // week_min,
    klass.week_min = klassJSON.week_min;
    // week_max,
    klass.week_max = klassJSON.week_max;
    // days,
    klass.days = klassJSON.days;
    // class_per_week, / Warning! 이름다름
    klass.class_day_per_week = klassJSON.class_per_week;
    // venue,
    klass.venue = klassJSON.venue;
    // venue_subway_station,
    klass.venue_subway_station = klassJSON.venue_subway_station;
    // venue_cafe,
    klass.venue_cafe = klassJSON.venue_cafe;
    // venue_map_link,
    klass.venue_map_link = klassJSON.venue_map_link;
    // venue_title,
    klass.venue_title = klassJSON.venue_title;
    // venue_telephone,
    klass.venue_telephone = klassJSON.venue_telephone;
    // venue_address,
    klass.venue_address = klassJSON.venue_address;
    // venue_road_address,
    klass.venue_road_address = klassJSON.venue_road_address;
    // venue_latitude,
    klass.venue_latitude = klassJSON.venue_latitude;
    // venue_longitude,
    klass.venue_longitude = klassJSON.venue_longitude;
    // status,
    klass.class_status = klassJSON.status;
    // enrollment_interval_week,
    klass.enrollment_interval_week = klassJSON.enrollment_interval_week;
    // tags,
    klass.search_tag = klassJSON.tags;
    // price,
    klass.price = klassJSON.price;
    // discount,
    klass.discount = klassJSON.discount;
    // class_img_url,
    klass.class_img_url = klassJSON.class_img_url;
    // level_img_url,
    klass.level_img_url = klassJSON.level_img_url;
    // days_img_url,
    klass.days_img_url = klassJSON.days_img_url;
    // time_begin_img_url,
    klass.time_begin_img_url = klassJSON.time_begin_img_url;
    // venue_subway_station_img_url,
    klass.venue_subway_station_img_url = klassJSON.venue_subway_station_img_url;
    // date_created,
    klass.date_created = klassJSON.date_created;
    // date_updated
    klass.date_updated = klassJSON.date_updated;

    return klass;

  } // end method

}
