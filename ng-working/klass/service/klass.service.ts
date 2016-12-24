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

  private dirPathKlassBanner:string="/assets/images/class/banner";

  constructor(private http: Http, private urlService:UrlService) {
    this.myExtractor = new MyExtractor();
    this.myRequest = new MyRequest();
    this.myArray = new HelperMyArray();
    this.myTime = new HelperMyTime();
  }

  removeKlassReview(    
    apiKey:string, 
    userId:number,
    klassId:number,
    reviewId:number
  ): Promise<MyResponse> {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("klass.service / removeKlassReview / 시작");
    if(isDebug) console.log("klass.service / removeKlassReview / apiKey : ",apiKey);
    if(isDebug) console.log("klass.service / removeKlassReview / userId : ",userId);
    if(isDebug) console.log("klass.service / removeKlassReview / klassId : ",klassId);
    if(isDebug) console.log("klass.service / removeKlassReview / reviewId : ",reviewId);

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

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("klass.service / addKlassQuestion / 시작");
    if(isDebug) console.log("klass.service / addKlassQuestion / apiKey : ",apiKey);
    if(isDebug) console.log("klass.service / addKlassQuestion / userId : ",userId);
    if(isDebug) console.log("klass.service / addKlassQuestion / klassId : ",klassId);
    if(isDebug) console.log("klass.service / addKlassQuestion / review : ",review);
    if(isDebug) console.log("klass.service / addKlassQuestion / star : ",star);

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

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("klass.service / addKlassReviewReply / 시작");
    if(isDebug) console.log("klass.service / addKlassReviewReply / apiKey : ",apiKey);
    if(isDebug) console.log("klass.service / addKlassReviewReply / userId : ",userId);
    if(isDebug) console.log("klass.service / addKlassReviewReply / klassId : ",klassId);
    if(isDebug) console.log("klass.service / addKlassReviewReply / parentId : ",parentId);
    if(isDebug) console.log("klass.service / addKlassReviewReply / reply : ",reply);

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

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("klass.service / removeKlassQuestion / 시작");
    if(isDebug) console.log("klass.service / removeKlassQuestion / apiKey : ",apiKey);
    if(isDebug) console.log("klass.service / removeKlassQuestion / userId : ",userId);
    if(isDebug) console.log("klass.service / removeKlassQuestion / klassId : ",klassId);
    if(isDebug) console.log("klass.service / removeKlassQuestion / questionId : ",questionId);

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

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("klass.service / addKlassQuestion / 시작");
    if(isDebug) console.log("klass.service / addKlassQuestion / apiKey : ",apiKey);
    if(isDebug) console.log("klass.service / addKlassQuestion / userId : ",userId);
    if(isDebug) console.log("klass.service / addKlassQuestion / klassId : ",klassId);
    if(isDebug) console.log("klass.service / addKlassQuestion / question : ",question);

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

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("klass.service / addKlassQuestionReply / 시작");
    if(isDebug) console.log("klass.service / addKlassQuestionReply / apiKey : ",apiKey);
    if(isDebug) console.log("klass.service / addKlassQuestionReply / userId : ",userId);
    if(isDebug) console.log("klass.service / addKlassQuestionReply / klassId : ",klassId);
    if(isDebug) console.log("klass.service / addKlassQuestionReply / parentId : ",parentId);
    if(isDebug) console.log("klass.service / addKlassQuestionReply / question : ",question);

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

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
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

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
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

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
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

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
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

} // end class
