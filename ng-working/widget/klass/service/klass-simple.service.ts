import { Injectable }             from '@angular/core';
import { 
    Headers, 
    Http, 
    Response, 
    RequestOptions 
}                                 from '@angular/http';

import { Observable }             from 'rxjs';
import { UrlService }             from '../../../util/url.service';
import { MyExtractor }            from '../../../util/http/my-extractor';
import { MyRequest }              from '../../../util/http/my-request';
import { MyResponse }             from '../../../util/model/my-response';

import { MyEventWatchTowerService }  from '../../../util/service/my-event-watchtower.service';

@Injectable()
export class KlassSimpleService {

  private fetchKlassListUrl = '/CI/index.php/api/klass/fetchklasslist';

  private addKlassEmptyUrl = '/CI/index.php/api/klass/addklassempty';

  private myExtractor:MyExtractor;
  private myRequest:MyRequest;

  private watchTower:MyEventWatchTowerService;

  constructor(private http: Http, private urlService:UrlService) {
    this.myExtractor = new MyExtractor();
    this.myRequest = new MyRequest();
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

  fetchKlassList (  apiKey:string, 
                    loginUserId:number, 
                    pageNum:number, 
                    pageRowCnt:number, 
                    searchQuery:string, 
                    klassStatus:string,
                    klassLevel:string,
                    klassSubwayLine:string,
                    klassSubwayStation:string,
                    klassDays:string,
                    klassTime:string ): Promise<MyResponse> {

    if(this.isDebug()) console.log("ks.service / fetchKlassList / 시작");
    if(this.isDebug()) console.log("ks.service / fetchKlassList / apiKey : ",apiKey);
    if(this.isDebug()) console.log("ks.service / fetchKlassList / loginUserId : ",loginUserId);
    if(this.isDebug()) console.log("ks.service / fetchKlassList / pageNum : ",pageNum);
    if(this.isDebug()) console.log("ks.service / fetchKlassList / pageRowCnt : ",pageRowCnt);
    if(this.isDebug()) console.log("ks.service / fetchKlassList / searchQuery : ",searchQuery);

    if(this.isDebug()) console.log("ks.service / fetchKlassList / klassStatus : ",klassStatus);
    if(this.isDebug()) console.log("ks.service / fetchKlassList / klassLevel : ",klassLevel);
    if(this.isDebug()) console.log("ks.service / fetchKlassList / klassSubwayLine : ",klassSubwayLine);
    if(this.isDebug()) console.log("ks.service / fetchKlassList / klassSubwayStation : ",klassSubwayStation);
    if(this.isDebug()) console.log("ks.service / fetchKlassList / klassDays : ",klassDays);
    if(this.isDebug()) console.log("ks.service / fetchKlassList / klassTime : ",klassTime);

    if("" === klassStatus) {
      klassStatus = "E"; // Open - 개강
    }

    // POST
    let options = this.myRequest.getReqOptionCafeclassAPI(apiKey);
    let req_url = this.urlService.get(this.fetchKlassListUrl);

    let params = {
      login_user_id:loginUserId,
      page_num:pageNum,
      pageRowCnt:pageRowCnt,
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

  addKlassEmpty(    
    apiKey:string, 
    userId:number,
    teacherId:number,
    teacherResume:string,
    teacherGreeting:string
  ): Promise<MyResponse> {

    if(this.isDebug()) console.log("ks.service / addKlassEmpty / 시작");
    if(this.isDebug()) console.log("ks.service / addKlassEmpty / apiKey : ",apiKey);
    if(this.isDebug()) console.log("ks.service / addKlassEmpty / userId : ",userId);
    if(this.isDebug()) console.log("ks.service / addKlassEmpty / teacherId : ",teacherId);
    if(this.isDebug()) console.log("ks.service / addKlassEmpty / teacherResume : ",teacherResume);
    if(this.isDebug()) console.log("ks.service / addKlassEmpty / teacherGreeting : ",teacherGreeting);

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

} // end class
