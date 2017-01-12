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
import { HelperMyTime }           from '../../util/helper/my-time';

import { MyEventWatchTowerService }  from '../../util/service/my-event-watchtower.service';

@Injectable()
export class KlassService {

  private addKlassNStudent = '/CI/index.php/api/klass/addstudent';

  private fetchKlassListUrl = '/CI/index.php/api/klass/fetchklasslist';
  private fetchKlassUrl = '/CI/index.php/api/klass/fetchklass';
  private klassUrl = '/CI/index.php/api/klass/course';
  
  private klassUpdateUrl = '/CI/index.php/api/klass/update';
  private klassNewUrl = '/CI/index.php/api/klass/coursenew';
  private klassSelectileUrl = '/CI/index.php/api/klass/selectile';

  private klassVenueSearchLocalUrl = '/CI/index.php/api/naver/searchlocal';
  private klassVenueSearchMapUrl = '/CI/index.php/api/naver/searchmap';

  private addKlassEmptyUrl = '/CI/index.php/api/klass/addklassempty';

  private updateKlassTitleUrl = '/CI/index.php/api/klass/updatetitle';

  private addKlassPosterUrl = '/CI/index.php/api/klass/addposter';
  private updateKlassBannerUrl = '/CI/index.php/api/klass/updatebanner';

  private addKlassQuestionUrl = '/CI/index.php/api/klass/addquestion';
  private addKlassQuestionReplyUrl = '/CI/index.php/api/klass/addquestionreply';
  private removeKlassQuestionUrl = '/CI/index.php/api/klass/removequestion';

  private addKlassReviewUrl = '/CI/index.php/api/klass/addreview';
  private addKlassReviewReplyUrl = '/CI/index.php/api/klass/addreviewreply';
  private removeKlassReviewUrl = '/CI/index.php/api/klass/removereview';

  private baseHref = "";

  private myExtractor:MyExtractor;
  private myRequest:MyRequest;
  private myArray:HelperMyArray;
  private myTime:HelperMyTime;

  private watchTower:MyEventWatchTowerService;

  private dirPathKlassBanner:string="/assets/images/class/banner";

  constructor(private http: Http, private urlService:UrlService) {
    this.myExtractor = new MyExtractor();
    this.myRequest = new MyRequest();
    this.myArray = new HelperMyArray();
    this.myTime = new HelperMyTime();
  }

  setWatchTower(watchTower:MyEventWatchTowerService):void {
    this.watchTower = watchTower;
  }

  private isDebug():boolean {
    if(null == this.watchTower) {
      return false;
    }

    return this.watchTower.isDebug();
  }

  addKlassStudent(    
    apiKey:string, 
    loginUserId:number,
    klassId:number,
    userId:number
  ): Promise<MyResponse> {

    if(this.isDebug()) console.log("klass.service / addKlassStudent / 시작");
    if(this.isDebug()) console.log("klass.service / addKlassStudent / apiKey : ",apiKey);
    if(this.isDebug()) console.log("klass.service / addKlassStudent / loginUserId : ",loginUserId);
    if(this.isDebug()) console.log("klass.service / addKlassStudent / klassId : ",klassId);
    if(this.isDebug()) console.log("klass.service / addKlassStudent / userId : ",userId);

    // POST
    let options = this.myRequest.getReqOptionCafeclassAPI(apiKey);
    let req_url = this.urlService.get(this.addKlassNStudent);

    let params = {
      login_user_id:loginUserId,
      klass_id:klassId,
      user_id:userId
    }
    return this.http.post(req_url, params, options)
                .toPromise()
                .then(this.myExtractor.extractData)
                .catch(this.myExtractor.handleError);
  }   

  updateKlass(    
    apiKey:string, 
    userId:number,
    teacherId:number,
    klass:Klass
  ): Promise<MyResponse> {

    if(this.isDebug()) console.log("klass.service / updateKlass / 시작");
    if(this.isDebug()) console.log("klass.service / updateKlass / apiKey : ",apiKey);
    if(this.isDebug()) console.log("klass.service / updateKlass / userId : ",userId);
    if(this.isDebug()) console.log("klass.service / updateKlass / klass : ",klass);

    // POST
    let options = this.myRequest.getReqOptionCafeclassAPI(apiKey);
    let req_url = this.urlService.get(this.klassUpdateUrl);

    let params = {
      user_id:userId,
      teacher_id:teacherId,
      klass_id:klass.id,
      teacher_resume:klass.teacher_resume,
      teacher_greeting:klass.teacher_greeting,
      klass_title:klass.title,
      klass_desc:klass.desc,
      klass_feature:klass.feature,
      klass_target:klass.target,
      klass_schedule:klass.schedule,
      klass_date_begin:klass.date_begin,
      klass_time_begin:klass.time_begin,
      klass_time_end:klass.time_end,
      klass_time_duration_minutes:klass.time_duration_minutes,
      klass_level:klass.level,
      klass_week:klass.week,
      klass_days:klass.days,
      klass_venue_title:klass.venue_title,
      klass_venue_telephone:klass.venue_telephone,
      klass_venue_address:klass.venue_address,
      klass_venue_road_address:klass.venue_road_address,
      klass_venue_latitude:klass.venue_latitude,
      klass_venue_longitude:klass.venue_longitude,
      klass_subway_line:klass.subway_line,
      klass_subway_station:klass.subway_station,
      klass_student_cnt:klass.student_cnt,
      klass_price:klass.price,
      klass_banner_url:klass.class_banner_url,
      klass_poster_url:klass.class_poster_url
    }

    return this.http.post(req_url, params, options)
                .toPromise()
                .then(this.myExtractor.extractData)
                .catch(this.myExtractor.handleError);
  }  

  removeKlassReview(    
    apiKey:string, 
    userId:number,
    klassId:number,
    reviewId:number
  ): Promise<MyResponse> {

    if(this.isDebug()) console.log("klass.service / removeKlassReview / 시작");
    if(this.isDebug()) console.log("klass.service / removeKlassReview / apiKey : ",apiKey);
    if(this.isDebug()) console.log("klass.service / removeKlassReview / userId : ",userId);
    if(this.isDebug()) console.log("klass.service / removeKlassReview / klassId : ",klassId);
    if(this.isDebug()) console.log("klass.service / removeKlassReview / reviewId : ",reviewId);

    // POST
    let options = this.myRequest.getReqOptionCafeclassAPI(apiKey);
    let req_url = this.urlService.get(this.removeKlassReviewUrl);

    let params = {
      user_id:userId,
      klass_id:klassId,
      klass_review_id:reviewId
    }
    return this.http.post(req_url, params, options)
                .toPromise()
                .then(this.myExtractor.extractData)
                .catch(this.myExtractor.handleError);
  }  

  addKlassReview(    
    apiKey:string, 
    userId:number,
    klassId:number,
    review:string,
    star:number
  ): Promise<MyResponse> {

    if(this.isDebug()) console.log("klass.service / addKlassQuestion / 시작");
    if(this.isDebug()) console.log("klass.service / addKlassQuestion / apiKey : ",apiKey);
    if(this.isDebug()) console.log("klass.service / addKlassQuestion / userId : ",userId);
    if(this.isDebug()) console.log("klass.service / addKlassQuestion / klassId : ",klassId);
    if(this.isDebug()) console.log("klass.service / addKlassQuestion / review : ",review);
    if(this.isDebug()) console.log("klass.service / addKlassQuestion / star : ",star);

    // POST
    let options = this.myRequest.getReqOptionCafeclassAPI(apiKey);
    let req_url = this.urlService.get(this.addKlassReviewUrl);

    let params = {
      user_id:userId,
      klass_id:klassId,
      klass_review:review,
      klass_review_star:star
    }
    return this.http.post(req_url, params, options)
                .toPromise()
                .then(this.myExtractor.extractData)
                .catch(this.myExtractor.handleError);
  } 

  addKlassReviewReply(    
    apiKey:string, 
    userId:number,
    klassId:number,
    parentId:number,
    reply:string
  ): Promise<MyResponse> {

    if(this.isDebug()) console.log("klass.service / addKlassReviewReply / 시작");
    if(this.isDebug()) console.log("klass.service / addKlassReviewReply / apiKey : ",apiKey);
    if(this.isDebug()) console.log("klass.service / addKlassReviewReply / userId : ",userId);
    if(this.isDebug()) console.log("klass.service / addKlassReviewReply / klassId : ",klassId);
    if(this.isDebug()) console.log("klass.service / addKlassReviewReply / parentId : ",parentId);
    if(this.isDebug()) console.log("klass.service / addKlassReviewReply / reply : ",reply);

    // POST
    let options = this.myRequest.getReqOptionCafeclassAPI(apiKey);
    let req_url = this.urlService.get(this.addKlassReviewReplyUrl);

    let params = {
      user_id:userId,
      klass_id:klassId,
      klass_review_parent_id:parentId,
      klass_review:reply
    }
    return this.http.post(req_url, params, options)
                .toPromise()
                .then(this.myExtractor.extractData)
                .catch(this.myExtractor.handleError);
  } 

  removeKlassQuestion(
    apiKey:string, 
    userId:number,
    klassId:number,
    questionId:number
  ): Promise<MyResponse> {

    if(this.isDebug()) console.log("klass.service / removeKlassQuestion / 시작");
    if(this.isDebug()) console.log("klass.service / removeKlassQuestion / apiKey : ",apiKey);
    if(this.isDebug()) console.log("klass.service / removeKlassQuestion / userId : ",userId);
    if(this.isDebug()) console.log("klass.service / removeKlassQuestion / klassId : ",klassId);
    if(this.isDebug()) console.log("klass.service / removeKlassQuestion / questionId : ",questionId);

    // POST
    let options = this.myRequest.getReqOptionCafeclassAPI(apiKey);
    let req_url = this.urlService.get(this.removeKlassQuestionUrl);

    let params = {
      user_id:userId,
      klass_id:klassId,
      klass_question_id:questionId
    }
    return this.http.post(req_url, params, options)
                .toPromise()
                .then(this.myExtractor.extractData)
                .catch(this.myExtractor.handleError);
  }     

  addKlassQuestion(    
    apiKey:string, 
    userId:number,
    klassId:number,
    question:string
  ): Promise<MyResponse> {

    if(this.isDebug()) console.log("klass.service / addKlassQuestion / 시작");
    if(this.isDebug()) console.log("klass.service / addKlassQuestion / apiKey : ",apiKey);
    if(this.isDebug()) console.log("klass.service / addKlassQuestion / userId : ",userId);
    if(this.isDebug()) console.log("klass.service / addKlassQuestion / klassId : ",klassId);
    if(this.isDebug()) console.log("klass.service / addKlassQuestion / question : ",question);

    // POST
    let options = this.myRequest.getReqOptionCafeclassAPI(apiKey);
    let req_url = this.urlService.get(this.addKlassQuestionUrl);

    let params = {
      user_id:userId,
      klass_id:klassId,
      klass_question:question
    }
    return this.http.post(req_url, params, options)
                .toPromise()
                .then(this.myExtractor.extractData)
                .catch(this.myExtractor.handleError);
  }

  addKlassQuestionReply(    
    apiKey:string, 
    userId:number,
    klassId:number,
    parentId:number,
    question:string
  ): Promise<MyResponse> {

    if(this.isDebug()) console.log("klass.service / addKlassQuestionReply / 시작");
    if(this.isDebug()) console.log("klass.service / addKlassQuestionReply / apiKey : ",apiKey);
    if(this.isDebug()) console.log("klass.service / addKlassQuestionReply / userId : ",userId);
    if(this.isDebug()) console.log("klass.service / addKlassQuestionReply / klassId : ",klassId);
    if(this.isDebug()) console.log("klass.service / addKlassQuestionReply / parentId : ",parentId);
    if(this.isDebug()) console.log("klass.service / addKlassQuestionReply / question : ",question);

    // POST
    let options = this.myRequest.getReqOptionCafeclassAPI(apiKey);
    let req_url = this.urlService.get(this.addKlassQuestionReplyUrl);

    let params = {
      user_id:userId,
      klass_id:klassId,
      klass_question_parent_id:parentId,
      klass_question:question
    }
    return this.http.post(req_url, params, options)
                .toPromise()
                .then(this.myExtractor.extractData)
                .catch(this.myExtractor.handleError);
  }     

  updateKlassTitle(    
    apiKey:string, 
    userId:number,
    klassId:number,
    klassTitle:string
  ): Promise<MyResponse> {

    if(this.isDebug()) console.log("klass.service / updateKlassTitle / 시작");
    if(this.isDebug()) console.log("klass.service / updateKlassTitle / apiKey : ",apiKey);
    if(this.isDebug()) console.log("klass.service / updateKlassTitle / userId : ",userId);
    if(this.isDebug()) console.log("klass.service / updateKlassTitle / klassId : ",klassId);
    if(this.isDebug()) console.log("klass.service / updateKlassTitle / klassTitle : ",klassTitle);

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

    if(this.isDebug()) console.log("klass.service / addKlassPoster / 시작");
    if(this.isDebug()) console.log("klass.service / addKlassPoster / apiKey : ",apiKey);
    if(this.isDebug()) console.log("klass.service / addKlassPoster / userId : ",userId);
    if(this.isDebug()) console.log("klass.service / addKlassPoster / klassId : ",klassId);
    if(this.isDebug()) console.log("klass.service / addKlassPoster / klassPosterUrl : ",klassPosterUrl);

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

    if(this.isDebug()) console.log("klass.service / addKlassEmpty / 시작");
    if(this.isDebug()) console.log("klass.service / addKlassEmpty / apiKey : ",apiKey);
    if(this.isDebug()) console.log("klass.service / addKlassEmpty / userId : ",userId);
    if(this.isDebug()) console.log("klass.service / addKlassEmpty / teacherId : ",teacherId);
    if(this.isDebug()) console.log("klass.service / addKlassEmpty / teacherResume : ",teacherResume);
    if(this.isDebug()) console.log("klass.service / addKlassEmpty / teacherGreeting : ",teacherGreeting);

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

    if(this.isDebug()) console.log("klass.service / addKlassBanner / 시작");
    if(this.isDebug()) console.log("klass.service / addKlassBanner / apiKey : ",apiKey);
    if(this.isDebug()) console.log("klass.service / addKlassBanner / userId : ",userId);
    if(this.isDebug()) console.log("klass.service / addKlassBanner / klassId : ",klassId);
    if(this.isDebug()) console.log("klass.service / addKlassBanner / klassBanners : ",klassBanners);

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

  searchKlassVenue (q:string): Observable<KlassVenue[]> {

    if(this.isDebug()) console.log("klass.service / searchKlassVenue / 시작");
    if(this.isDebug()) console.log("klass.service / searchKlassVenue / q : ",q);

    let qEncoded = encodeURIComponent(q);
    let req_url = this.urlService.get(this.klassVenueSearchLocalUrl);

    req_url = `${ req_url }?q=${ qEncoded }`;

    if(this.isDebug()) console.log("klass.service / searchKlassVenue / req_url : ",req_url);

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

    // console.log("klass.service / getKlassVenue / 시작");
    // console.log("klass.service / getKlassVenue / result : ",result);

    // json 정보를 KlassVenue 정보로 바꿉니다.
    let klassVenueList:KlassVenue[] = [];
    if(null != result && 0 < result.length) {
      for (var i = 0; i < result.length; ++i) {
        let klassVenueJSON = result[i];
        if(null == klassVenueJSON || "" === klassVenueJSON["address"]) {
          continue;
        } // end if

        let klassVenue:KlassVenue = new KlassVenue().setJSON(klassVenueJSON);
        klassVenueList.push(klassVenue);
      } // end for
    } // end if

    // console.log("klass.service / getKlassVenue / klassVenueList : ",klassVenueList);

    return klassVenueList;
  }

  searchKlassMap (q:string): Promise<MyResponse> {

    if(this.isDebug()) console.log("klass.service / searchKlassMap / 시작");
    if(this.isDebug()) console.log("klass.service / searchKlassMap / q : ",q);

    let qEncoded = encodeURIComponent(q);
    let req_url = this.urlService.get(this.klassVenueSearchMapUrl);

    req_url = `${ req_url }?q=${ qEncoded }`;
    if(this.isDebug()) console.log("klass.service / searchKlassMap / req_url : ",req_url);
    
    return this.http.get(req_url)
              .toPromise()
              .then(this.myExtractor.extractData)
              .catch(this.myExtractor.handleError);
  }

  public setLatLon(json, klassVenue:KlassVenue)  :KlassVenue {

    if(null == json) {
      return klassVenue;
    }
    if(null == klassVenue) {
      return klassVenue;
    }

    // 위도 / latitude / point.y
    // * 위도 값의 범위 : +90.00000(North)북위 90도 ~ -90.000000(South)남위 90도
    let latitude:number = null;
    // 경도 / longitude / point.x
    // * 경도 값의 범위 : +180.000000(East)동경 180도 ~ -180.000000(West)서경 180도 [그리니치 천문대 기준 0도]                          
    let longitude:number = null;
    if( null != json && 
        null != json.result && 
        null != json.result[0] && 
        null != json.result[0].x &&
        null != json.result[0].y  ) {

        longitude = parseFloat(json.result[0].x);
        latitude = parseFloat(json.result[0].y);
    }

    if(null != longitude) {
      klassVenue.longitude = longitude;
    }
    if(null != latitude) {
      klassVenue.latitude = latitude;
    }

    return klassVenue;
  }

  fetchKlassList (  apiKey:string, 
                    loginUserId:number, 
                    pageNum:number, 
                    pageSize:number, 
                    searchQuery:string, 
                    klassStatus:string,
                    klassLevel:string,
                    klassSubwayLine:string,
                    klassSubwayStation:string,
                    klassDays:string,
                    klassTime:string ): Promise<MyResponse> {

    if(this.isDebug()) console.log("klass.service / fetchKlassList / 시작");
    if(this.isDebug()) console.log("klass.service / fetchKlassList / apiKey : ",apiKey);
    if(this.isDebug()) console.log("klass.service / fetchKlassList / loginUserId : ",loginUserId);
    if(this.isDebug()) console.log("klass.service / fetchKlassList / pageNum : ",pageNum);
    if(this.isDebug()) console.log("klass.service / fetchKlassList / pageSize : ",pageSize);
    if(this.isDebug()) console.log("klass.service / fetchKlassList / searchQuery : ",searchQuery);

    if(this.isDebug()) console.log("klass.service / fetchKlassList / klassStatus : ",klassStatus);
    if(this.isDebug()) console.log("klass.service / fetchKlassList / klassLevel : ",klassLevel);
    if(this.isDebug()) console.log("klass.service / fetchKlassList / klassSubwayLine : ",klassSubwayLine);
    if(this.isDebug()) console.log("klass.service / fetchKlassList / klassSubwayStation : ",klassSubwayStation);
    if(this.isDebug()) console.log("klass.service / fetchKlassList / klassDays : ",klassDays);
    if(this.isDebug()) console.log("klass.service / fetchKlassList / klassTime : ",klassTime);

    if("" === klassStatus) {
      klassStatus = "E"; // Open - 개강
    }

    // POST
    let options = this.myRequest.getReqOptionCafeclassAPI(apiKey);
    let req_url = this.urlService.get(this.fetchKlassListUrl);

    let params = {
      login_user_id:loginUserId,
      page_num:pageNum,
      page_size:pageSize,
      search_query:searchQuery,
      klass_status:klassStatus,
      klass_level:klassLevel,
      klass_subway_line:klassSubwayLine,
      klass_subway_station:klassSubwayStation,
      klass_days:klassDays,
      klass_time:klassTime
    };
    
    return this.http.post(req_url, params, options)
                .toPromise()
                .then(this.myExtractor.extractData)
                .catch(this.myExtractor.handleError);

  }   

  // @ Desc : 클래스 정보만 가져옵니다.
  getKlass (id: number | string): Promise<MyResponse> {

    if(this.isDebug()) console.log("klass.service / getKlass / 시작");
    if(this.isDebug()) console.log("klass.service / getKlass / id : ",id);
      
    let req_url = this.urlService.get(this.klassUrl);
    req_url = `${ req_url }?id=${ id }`;
    if(this.isDebug()) console.log("klass.service / getKlass / req_url : ",req_url);

    return this.http.get(req_url)
                  .toPromise()
                  .then(this.myExtractor.extractData)
                  .catch(this.myExtractor.handleError);
  }

  // @ Desc : 클래스 정보 및 로그인한 유저의 수강 기록을 함께 가져옵니다.
  fetchKlass (  apiKey:string,
                klassId:number, 
                loginUserId:number): Promise<MyResponse> {

    if(this.isDebug()) console.log("klass.service / fetchKlass / 시작");
    if(this.isDebug()) console.log("klass.service / fetchKlass / klassId : ",klassId);
    if(this.isDebug()) console.log("klass.service / fetchKlass / loginUserId : ",loginUserId);

    // POST
    let options = this.myRequest.getReqOptionCafeclassAPI(apiKey);
    let req_url = this.urlService.get(this.fetchKlassUrl);

    let params = {
      klass_id:klassId,
      login_user_id:loginUserId
    };

    return this.http.post(req_url, params, options)
                    .toPromise()
                    .then(this.myExtractor.extractData)
                    .catch(this.myExtractor.handleError);
  }
  
  getKlassSelectile(): Promise<MyResponse> {

    if(this.isDebug()) console.log("klass.service / getKlassSelectile / 시작");

    let req_url = this.urlService.get(this.klassSelectileUrl);

    if(this.isDebug()) console.log("klass.service / getKlassSelectile / req_url : ",req_url);

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

      let klass:Klass = new Klass();
      klass.setJSON(klassJSON);

      // REMOVE ME
      // let klass:Klass = this.getKlassFromJSON(klassJSON);

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

// REMOVE ME
/*
  getKlasses (): Promise<MyResponse> {

    if(this.isDebug()) console.log("klass.service / getKlasses / 시작");

    let req_url = this.urlService.get(this.klassesUrl);

    if(this.isDebug()) console.log("klass.service / getKlasses / req_url : ",req_url);

    return this.http.get(req_url)
                  .toPromise()
                  .then(this.myExtractor.extractData)
                  .catch(this.myExtractor.handleError);

  } // end getKlasses
*/  
  /*
  searchKlassList ( apiKey:string, 
                    klassLevel:string, 
                    klassSubwayStation:string, 
                    klassDay:string, 
                    klassTime:string, 
                    searchQuery:string): Promise<MyResponse> {

    if(this.isDebug()) console.log("klass.service / searchKlassList / 시작");

    if(this.isDebug()) console.log("klass.service / searchKlassList / klassLevel : ",klassLevel);
    if(this.isDebug()) console.log("klass.service / searchKlassList / klassSubwayStation : ",klassSubwayStation);
    if(this.isDebug()) console.log("klass.service / searchKlassList / klassDay : ",klassDay);
    if(this.isDebug()) console.log("klass.service / searchKlassList / klassTime : ",klassTime);
    if(this.isDebug()) console.log("klass.service / searchKlassList / searchQuery : ",searchQuery);

    // POST
    let options = this.myRequest.getReqOptionCafeclassAPI(apiKey);
    let req_url = this.urlService.get(this.klassSearchUrl);

    // wonder.jung - 페이징 처리는 어떻게 할 것인지?
    // 하단 스크롤이 발생할때마다 수업이 추가되는 구조. - UI 구조상, 덧붙이는 형식으로 표현. 
    // pagination은 가지고 있어야 함. page를 넘기는 구조로 다음 리스트를 가져옴.

    let params = {
      klass_level:klassLevel,
      klass_subway_station:klassSubwayStation,
      klass_day:klassDay,
      klass_time:klassTime,
      search_query:searchQuery,
    };

    return this.http.post(req_url, params, options)
                .toPromise()
                .then(this.myExtractor.extractData)
                .catch(this.myExtractor.handleError);    

  }
  */

} // end class
