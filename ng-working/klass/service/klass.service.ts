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
import { MyRequest }              from '../../util/http/my-request';
import { MyResponse }             from '../../util/model/my-response';
import { HelperMyArray }          from '../../util/helper/my-array';

@Injectable()
export class KlassService {

  private klassesUrl = '/CI/index.php/api/klass/list';
  private klassUrl = '/CI/index.php/api/klass/course';
  private klassNewUrl = '/CI/index.php/api/klass/coursenew';
  private klassSelectileUrl = '/CI/index.php/api/klass/selectile';
  private klassSearchUrl = '/CI/index.php/api/klass/search';
  private klassVenueSearchLocalUrl = '/CI/index.php/api/naver/searchlocal';
  private klassVenueSearchMapUrl = '/CI/index.php/api/naver/searchmap';

  private addKlassEmptyUrl = '/CI/index.php/api/klass/addklassempty';

  private updateKlassTitleUrl = '/CI/index.php/api/klass/updatetitle';

  private addKlassPosterUrl = '/CI/index.php/api/klass/addposter';
  private updateKlassBannerUrl = '/CI/index.php/api/klass/updatebanner';
  // private addKlassBannerUrl = '/CI/index.php/api/klass/addbanner';
  // private removeKlassBannerUrl = '/CI/index.php/api/klass/removebanner';
// /assets/images/class/banner
  private baseHref = "";

  private myExtractor:MyExtractor;
  private myRequest:MyRequest;
  private myArray:HelperMyArray;

  private dirPathKlassBanner:string="/assets/images/class/banner";

  constructor(private http: Http, private urlService:UrlService) {
    this.myExtractor = new MyExtractor();
    this.myRequest = new MyRequest();
    this.myArray = new HelperMyArray();
  }

  updateKlassTitle(    
    apiKey:string, 
    userId:number,
    klassId:number,
    klassTitle:string
  ): Promise<MyResponse> {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("klass.service / updateKlassTitle / 시작");
    if(isDebug) console.log("klass.service / updateKlassTitle / apiKey : ",apiKey);
    if(isDebug) console.log("klass.service / updateKlassTitle / userId : ",userId);
    if(isDebug) console.log("klass.service / updateKlassTitle / klassId : ",klassId);
    if(isDebug) console.log("klass.service / updateKlassTitle / klassTitle : ",klassTitle);

    // POST
    let options = this.myRequest.getReqOptionCafeclassAPI(apiKey);
    let req_url = this.urlService.get(this.updateKlassTitleUrl);

    let params = {
      user_id:userId,
      klass_id:klassId,
      klass_title:klassTitle
    }
    return this.http.post(req_url, params, options)
                .toPromise()
                .then(this.myExtractor.extractData)
                .catch(this.myExtractor.handleError);
  }   

  addKlassPoster(    
    apiKey:string, 
    userId:number,
    klassId:number,
    klassPosterUrl:string
  ): Promise<MyResponse> {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("klass.service / addKlassPoster / 시작");
    if(isDebug) console.log("klass.service / addKlassPoster / apiKey : ",apiKey);
    if(isDebug) console.log("klass.service / addKlassPoster / userId : ",userId);
    if(isDebug) console.log("klass.service / addKlassPoster / klassId : ",klassId);
    if(isDebug) console.log("klass.service / addKlassPoster / klassPosterUrl : ",klassPosterUrl);

    // POST
    let options = this.myRequest.getReqOptionCafeclassAPI(apiKey);
    let req_url = this.urlService.get(this.addKlassPosterUrl);

    let params = {
      user_id:userId,
      klass_id:klassId,
      klass_poster_url:klassPosterUrl
    }
    return this.http.post(req_url, params, options)
                .toPromise()
                .then(this.myExtractor.extractData)
                .catch(this.myExtractor.handleError);
  }  

  addKlassEmpty(    
    apiKey:string, 
    userId:number,
    teacherId:number,
    teacherResume:string,
    teacherGreeting:string
  ): Promise<MyResponse> {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("klass.service / addKlassEmpty / 시작");
    if(isDebug) console.log("klass.service / addKlassEmpty / apiKey : ",apiKey);
    if(isDebug) console.log("klass.service / addKlassEmpty / userId : ",userId);
    if(isDebug) console.log("klass.service / addKlassEmpty / teacherId : ",teacherId);
    if(isDebug) console.log("klass.service / addKlassEmpty / teacherResume : ",teacherResume);
    if(isDebug) console.log("klass.service / addKlassEmpty / teacherGreeting : ",teacherGreeting);

    // POST
    let options = this.myRequest.getReqOptionCafeclassAPI(apiKey);
    let req_url = this.urlService.get(this.addKlassEmptyUrl);

    let params = {
      user_id:userId,
      teacher_id:teacherId,
      teacher_resume:teacherResume,
      teacher_greeting:teacherGreeting
    }
    
    return this.http.post(req_url, params, options)
                .toPromise()
                .then(this.myExtractor.extractData)
                .catch(this.myExtractor.handleError);
  }

  updateKlassBanner(    
    apiKey:string, 
    userId:number,
    klassId:number,
    klassBanners:string
  ): Promise<MyResponse> {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("klass.service / addKlassBanner / 시작");
    if(isDebug) console.log("klass.service / addKlassBanner / apiKey : ",apiKey);
    if(isDebug) console.log("klass.service / addKlassBanner / userId : ",userId);
    if(isDebug) console.log("klass.service / addKlassBanner / klassId : ",klassId);
    if(isDebug) console.log("klass.service / addKlassBanner / klassBanners : ",klassBanners);

    // POST
    let options = this.myRequest.getReqOptionCafeclassAPI(apiKey);
    let req_url = this.urlService.get(this.updateKlassBannerUrl);

    let params = {
      user_id:userId,
      klass_id:klassId,
      klass_banner_url:klassBanners
    }
    return this.http.post(req_url, params, options)
                .toPromise()
                .then(this.myExtractor.extractData)
                .catch(this.myExtractor.handleError);
  }    

  // REMOVE ME
  /*
  addKlassBanner(    
    apiKey:string, 
    userId:number,
    klassId:number,
    klassBanner:string
  ): Promise<MyResponse> {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("klass.service / addKlassBanner / 시작");
    if(isDebug) console.log("klass.service / addKlassBanner / apiKey : ",apiKey);
    if(isDebug) console.log("klass.service / addKlassBanner / userId : ",userId);
    if(isDebug) console.log("klass.service / addKlassBanner / klassId : ",klassId);
    if(isDebug) console.log("klass.service / addKlassBanner / klassBanner : ",klassBanner);

    // POST
    let options = this.myRequest.getReqOptionCafeclassAPI(apiKey);
    let req_url = this.urlService.get(this.addKlassBannerUrl);

    let params = {
      user_id:userId,
      klass_id:klassId,
      klass_banner_url:klassBanner
    }
    return this.http.post(req_url, params, options)
                .toPromise()
                .then(this.myExtractor.extractData)
                .catch(this.myExtractor.handleError);
  }

  removeKlassBanner(    
    apiKey:string, 
    userId:number,
    klassId:number,
    klassBanner:string
  ): Promise<MyResponse> {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("klass.service / removeKlassBanner / 시작");
    if(isDebug) console.log("klass.service / removeKlassBanner / apiKey : ",apiKey);
    if(isDebug) console.log("klass.service / removeKlassBanner / userId : ",userId);
    if(isDebug) console.log("klass.service / removeKlassBanner / klassId : ",klassId);
    if(isDebug) console.log("klass.service / removeKlassBanner / klassBanner : ",klassBanner);

    // POST
    let options = this.myRequest.getReqOptionCafeclassAPI(apiKey);
    let req_url = this.urlService.get(this.removeKlassBannerUrl);

    let params = {
      user_id:userId,
      klass_id:klassId,
      klass_banner_url:klassBanner
    }
    return this.http.post(req_url, params, options)
                .toPromise()
                .then(this.myExtractor.extractData)
                .catch(this.myExtractor.handleError);
  }  
  */

  searchKlassVenue (q:string): Observable<KlassVenue[]> {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("klass.service / searchKlassVenue / 시작");
    if(isDebug) console.log("klass.service / searchKlassVenue / q : ",q);

    let qEncoded = encodeURIComponent(q);
    let req_url = this.urlService.get(this.klassVenueSearchLocalUrl);

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
    let req_url = this.urlService.get(this.klassVenueSearchMapUrl);

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
    let req_url = this.urlService.get(this.klassSearchUrl);

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

      
    let req_url = this.urlService.get(this.klassUrl);
    req_url = `${ req_url }?id=${ id }`;
    if(isDebug) console.log("klass.service / getKlass / req_url : ",req_url);

    return this.http.get(req_url)
                  .toPromise()
                  .then(this.myExtractor.extractData)
                  .catch(this.myExtractor.handleError);
  }

  /*
  getKlassNew (teacherId:number): Promise<MyResponse> {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("klass.service / getKlassNew / 시작");
      
    let req_url = this.urlService.get(this.klassNewUrl);
    req_url = `${ req_url }?teacher_id=${ teacherId }`;
    if(isDebug) console.log("klass.service / getKlassNew / req_url : ",req_url);

    return this.http.get(req_url)
                  .toPromise()
                  .then(this.myExtractor.extractData)
                  .catch(this.myExtractor.handleError);
  }  
  */

  getKlasses (): Promise<MyResponse> {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("klass.service / getKlasses / 시작");

    let req_url = this.urlService.get(this.klassesUrl);

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

    let req_url = this.urlService.get(this.klassSelectileUrl);

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

  getKlassBannerUrlLoadable(imgUrl:string):string {
    
    if(null == imgUrl || "" ===  imgUrl) {
      return "";
    }

    return `${this.dirPathKlassBanner}/${imgUrl}`;

  }

  extractKlassBannerFromImgUrl(imgUrl:string) :string {
    if(null == imgUrl || "" ===  imgUrl) {
      return "";
    }

    return imgUrl.replace(/[\/]?assets\/images\/class\/banner/gi,"").replace(/[\/]+/gi,"");
  }

  getKlassFromJSON(klassJSON): Klass {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("klass.service / getKlassFromJSON / 시작");

    let klass:Klass = new Klass();

    if(isDebug) console.log("klass.service / getKlassFromJSON / klassJSON : ",klassJSON);

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
    // staturlService,
    klass.class_status = klassJSON.status;
    // enrollment_interval_week,
    klass.enrollment_interval_week = klassJSON.enrollment_interval_week;
    // tags,
    klass.search_tag = klassJSON.tags;
    // price,
    klass.price = klassJSON.price;
    // discount,
    klass.discount = klassJSON.discount;
    // class_poster_url,
    klass.class_poster_url = klassJSON.class_poster_url;
    // class_poster_url_loadable,
    klass.class_poster_url_loadable = klassJSON.class_poster_url_loadable;
    // class_banner_url,
    klass.class_banner_url = klassJSON.class_banner_url;
    // class_banner_url_arr,
    if(null != klassJSON.class_banner_url && "" != klassJSON.class_banner_url) {
      klass.class_banner_url_arr = klassJSON.class_banner_url.split("|||");

      // REMOVE ME
      /*
      // 바로 로딩할 수 있는 주소로 변경!
      for (var i = 0; i < klass.class_banner_url_arr.length; ++i) {
        let class_banner_url:string = klass.class_banner_url_arr[i];
        if(null == class_banner_url || "" == class_banner_url) {
          continue;
        }
        klass.class_banner_url_arr[i] = `${this.dirPathKlassBanner}/${class_banner_url}`;
      }
      */

    } else {
      klass.class_banner_url_arr = [];
    }
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

  getKlassLevel(constMap:any, key:string):KlassLevel {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("klass.service / getKlassLevel / 시작");

    if(isDebug) console.log("klass.service / getKlassLevel / constMap : ",constMap);
    if(isDebug) console.log("klass.service / getKlassLevel / key : ",key);

    if(null == constMap) {
      if(isDebug) console.log("klass.service / getKlassLevel / 중단 / null == constMap");
      return null;
    }
    if(null == key || "" === key) {
      // 지정된 값이 없다면 첫번째 값을 돌려줍니다.
      key = constMap.class_level_list[0];
    }

    let class_level_img_url:string = 
    this.myArray.getValueFromLists(
      // key:string, 
      key, 
      // srcList:string[], 
      constMap.class_level_list,
      // targetList:string[]
      constMap.class_level_img_url_list
    );
    if(null == class_level_img_url || "" === class_level_img_url) {
      if(isDebug) console.log("klass.service / getKlassLevel / 중단 / class_level_img_url is not valid!");
      return null;
    } // end if

    let class_level_eng:string = 
    this.myArray.getValueFromLists(
      // key:string, 
      key, 
      // srcList:string[], 
      constMap.class_level_list,
      // targetList:string[]
      constMap.class_level_eng_list
    );
    if(null == class_level_eng || "" === class_level_eng) {
      if(isDebug) console.log("klass.service / getKlassLevel / 중단 / class_level_eng is not valid!");
      return null;
    } // end if

    let class_level_kor:string = 
    this.myArray.getValueFromLists(
      // key:string, 
      key, 
      // srcList:string[], 
      constMap.class_level_list,
      // targetList:string[]
      constMap.class_level_kor_list
    );
    if(null == class_level_kor || "" === class_level_kor) {
      if(isDebug) console.log("klass.service / getKlassLevel / 중단 / class_level_kor is not valid!");
      return null;
    } // end if


    let klassLevel:KlassLevel = 
    new KlassLevel(
      // public key: string,
      key, 
      // public name_eng: string,
      class_level_eng,
      // public name_kor: string,
      class_level_kor,
      // public img_url: string  
      class_level_img_url    
    );
    if(null == klassLevel) {
      if(isDebug) console.log("klass.service / getKlassLevel / 중단 / klassLevel is not valid!");
      return null;
    } // end if

    return klassLevel;
  }
  getKlassStation(constMap:any, key:string):KlassStation {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("klass.service / getKlassStation / 시작");

    if(isDebug) console.log("klass.service / getKlassStation / constMap : ",constMap);
    if(isDebug) console.log("klass.service / getKlassStation / key : ",key);

    if(null == constMap) {
      if(isDebug) console.log("klass.service / getKlassStation / 중단 / null == constMap");
      return null;
    }
    if(null == key || "" === key) {
      // 지정된 값이 없다면 첫번째 값을 돌려줍니다.
      key = constMap.class_venue_subway_station_list[0];
    }


    let class_venue_subway_station_img_url:string = 
    this.myArray.getValueFromLists(
      // key:string, 
      key, 
      // srcList:string[], 
      constMap.class_venue_subway_station_list,
      // targetList:string[]
      constMap.class_venue_subway_station_img_url_list
    );
    if(null == class_venue_subway_station_img_url || "" === class_venue_subway_station_img_url) {
      if(isDebug) console.log("klass.service / getKlassStation / 중단 / class_venue_subway_station_img_url is not valid!");
      return null;
    } // end if

    let class_venue_subway_station_eng:string = 
    this.myArray.getValueFromLists(
      // key:string, 
      key, 
      // srcList:string[], 
      constMap.class_venue_subway_station_list,
      // targetList:string[]
      constMap.class_venue_subway_station_eng_list
    );
    if(null == class_venue_subway_station_eng || "" === class_venue_subway_station_eng) {
      if(isDebug) console.log("klass.service / getKlassStation / 중단 / class_venue_subway_station_eng is not valid!");
      return null;
    } // end if

    let class_venue_subway_station_kor:string = 
    this.myArray.getValueFromLists(
      // key:string, 
      key, 
      // srcList:string[], 
      constMap.class_venue_subway_station_list,
      // targetList:string[]
      constMap.class_venue_subway_station_kor_list
    );
    if(null == class_venue_subway_station_kor || "" === class_venue_subway_station_kor) {
      if(isDebug) console.log("klass.service / getKlassStation / 중단 / class_venue_subway_station_kor is not valid!");
      return null;
    } // end if


    let klassStation:KlassStation = 
    new KlassStation(
      // public key: string,
      key, 
      // public name_eng: string,
      class_venue_subway_station_eng,
      // public name_kor: string,
      class_venue_subway_station_kor,
      // public img_url: string  
      class_venue_subway_station_img_url    
    );
    if(null == klassStation) {
      if(isDebug) console.log("klass.service / getKlassStation / 중단 / klassStation is not valid!");
      return null;
    } // end if

    return klassStation;
  }
  getKlassDay(constMap:any, key:string):KlassDay {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("klass.service / getKlassDay / 시작");

    if(isDebug) console.log("klass.service / getKlassDay / constMap : ",constMap);
    if(isDebug) console.log("klass.service / getKlassDay / key : ",key);

    if(null == constMap) {
      if(isDebug) console.log("klass.service / getKlassDay / 중단 / null == constMap");
      return null;
    }
    if(null == key || "" === key) {
      // 지정된 값이 없다면 첫번째 값을 돌려줍니다.
      key = constMap.class_days_list[0];
    }

    let class_days_img_url:string = 
    this.myArray.getValueFromLists(
      // key:string, 
      key, 
      // srcList:string[], 
      constMap.class_days_list,
      // targetList:string[]
      constMap.class_days_img_url_list
    );
    if(null == class_days_img_url || "" === class_days_img_url) {
      if(isDebug) console.log("klass.service / getKlassDay / 중단 / class_days_img_url is not valid!");
      return null;
    } // end if

    let class_days_eng:string = 
    this.myArray.getValueFromLists(
      // key:string, 
      key, 
      // srcList:string[], 
      constMap.class_days_list,
      // targetList:string[]
      constMap.class_days_eng_list
    );
    if(null == class_days_eng || "" === class_days_eng) {
      if(isDebug) console.log("klass.service / getKlassDay / 중단 / class_days_eng is not valid!");
      return null;
    } // end if

    let class_days_kor:string = 
    this.myArray.getValueFromLists(
      // key:string, 
      key, 
      // srcList:string[], 
      constMap.class_days_list,
      // targetList:string[]
      constMap.class_days_kor_list
    );
    if(null == class_days_kor || "" === class_days_kor) {
      if(isDebug) console.log("klass.service / getKlassDay / 중단 / class_days_kor is not valid!");
      return null;
    } // end if


    let klassday:KlassDay = 
    new KlassDay(
      // public key: string,
      key, 
      // public name_eng: string,
      class_days_eng,
      // public name_kor: string,
      class_days_kor,
      // public img_url: string  
      class_days_img_url    
    );
    if(null == klassday) {
      if(isDebug) console.log("klass.service / getKlassDay / 중단 / klassday is not valid!");
      return null;
    } // end if

    return klassday;    

  }
  getKlassTime(constMap:any, key:string):KlassTime {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("klass.service / getKlassTime / 시작");

    if(isDebug) console.log("klass.service / getKlassTime / constMap : ",constMap);
    if(isDebug) console.log("klass.service / getKlassTime / key : ",key);

    if(null == constMap) {
      if(isDebug) console.log("klass.service / getKlassTime / 중단 / null == constMap");
      return null;
    }
    if(null == key || "" === key) {
      // 지정된 값이 없다면 첫번째 값을 돌려줍니다.
      key = constMap.class_times_hh_mm_list[0];
    }

    let class_times:string = 
    this.myArray.getValueFromLists(
      // key:string, 
      key, 
      // srcList:string[], 
      constMap.class_times_hh_mm_list,
      // targetList:string[]
      constMap.class_times_list
    );
    if(null == class_times || "" === class_times) {
      if(isDebug) console.log("klass.service / getKlassTime / 중단 / class_times is not valid!");
      return null;
    } // end if    

    let class_times_img_url:string = 
    this.myArray.getValueFromLists(
      // key:string, 
      key, 
      // srcList:string[], 
      constMap.class_times_hh_mm_list,
      // targetList:string[]
      constMap.class_times_img_url_list
    );
    if(null == class_times_img_url || "" === class_times_img_url) {
      if(isDebug) console.log("klass.service / getKlassTime / 중단 / class_times_img_url is not valid!");
      return null;
    } // end if

    let class_times_eng:string = 
    this.myArray.getValueFromLists(
      // key:string, 
      key, 
      // srcList:string[], 
      constMap.class_times_hh_mm_list,
      // targetList:string[]
      constMap.class_times_eng_list
    );
    if(null == class_times_eng || "" === class_times_eng) {
      if(isDebug) console.log("klass.service / getKlassTime / 중단 / class_times_eng is not valid!");
      return null;
    } // end if

    let class_times_kor:string = 
    this.myArray.getValueFromLists(
      // key:string, 
      key, 
      // srcList:string[], 
      constMap.class_times_hh_mm_list,
      // targetList:string[]
      constMap.class_times_kor_list
    );
    if(null == class_times_kor || "" === class_times_kor) {
      if(isDebug) console.log("klass.service / getKlassTime / 중단 / class_times_kor is not valid!");
      return null;
    } // end if

    let class_hh_mm:string = 
    this.myArray.getValueFromLists(
      // key:string, 
      key, 
      // srcList:string[], 
      constMap.class_times_hh_mm_list,
      // targetList:string[]
      constMap.class_times_hh_mm_list
    );
    if(null == class_hh_mm || "" === class_hh_mm) {
      if(isDebug) console.log("klass.service / getKlassTime / 중단 / class_hh_mm is not valid!");
      return null;
    } // end if    

    let klassTime:KlassTime = 
    new KlassTime(
      // public key: string,
      class_times, 
      // public name_eng: string,
      class_times_eng,
      // public name_kor: string,
      class_times_kor,
      // public hh_mm: string,
      class_hh_mm,
      // public img_url: string  
      class_times_img_url    
    );
    if(null == klassTime) {
      if(isDebug) console.log("klass.service / getKlassTime / 중단 / klassTime is not valid!");
      return null;
    } // end if

    return klassTime;
  } // end method

} // end class
