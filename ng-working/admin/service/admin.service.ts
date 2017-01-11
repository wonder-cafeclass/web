import { Injectable }                      from '@angular/core';
import { Headers, 
         Http, 
         Response, 
         RequestOptions }                  from '@angular/http';

import { User }                            from "../../users/model/user";

import { UrlService }                      from "../../util/url.service";
import { MyExtractor }                     from '../../util/http/my-extractor';
import { MyRequest }                       from '../../util/http/my-request';
import { MyResponse }                      from '../../util/model/my-response';
import { MyEventWatchTowerService }        from '../../util/service/my-event-watchtower.service';

@Injectable()
export class AdminService {

  private fetchBuyKlassUrl = '/CI/index.php/api/admin/fetchbuyklass';

  private updateKlassUrl = '/CI/index.php/api/admin/updateklass';
  private fetchKlassListUrl = '/CI/index.php/api/admin/fetchklasslist';

  private updateTeacherUrl = '/CI/index.php/api/admin/updateteacher';
  private fetchTeacherListV2Url = '/CI/index.php/api/admin/fetchteacherlist';

  private updateUserUrl = '/CI/index.php/api/admin/updateuser';
  private fetchUserListV2Url = '/CI/index.php/api/admin/fetchuserlist';

  private myExtractor:MyExtractor;
  private myRequest:MyRequest;

  private watchTower:MyEventWatchTowerService;

  constructor(  private us:UrlService, 
                private http: Http) {

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
  } // end method

  fetchBuyKlass (  
    apiKey:string, 
    pageNum:number, 
    pageSize:number, 
    klassId:number, 
    userId:number ): Promise<MyResponse> {

    if(this.isDebug()) console.log("admin.service / fetchBuyKlass / 시작");
    if(this.isDebug()) console.log("admin.service / fetchBuyKlass / apiKey : ",apiKey);
    if(this.isDebug()) console.log("admin.service / fetchBuyKlass / pageNum : ",pageNum);
    if(this.isDebug()) console.log("admin.service / fetchBuyKlass / pageSize : ",pageSize);
    if(this.isDebug()) console.log("admin.service / fetchBuyKlass / klassId : ",klassId);
    if(this.isDebug()) console.log("admin.service / fetchBuyKlass / userId : ",userId);

    // POST
    let options = this.myRequest.getReqOptionCafeclassAPI(apiKey);
    let req_url = this.us.get(this.fetchBuyKlassUrl);

    let params = {
      page_num:pageNum,
      page_size:pageSize,
      klass_id:klassId,
      user_id:userId
    };
    
    return this.http.post(req_url, params, options)
                .toPromise()
                .then(this.myExtractor.extractData)
                .catch(this.myExtractor.handleError);

  }   


  updateKlass ( apiKey:string, 
                userIdAdmin:number, 
                klassId:number, 
                klassStatus:string): Promise<MyResponse> {

    if(this.isDebug()) console.log("admin.service / updateKlass / 시작");
    if(this.isDebug()) console.log("admin.service / updateKlass / apiKey : ",apiKey);
    if(this.isDebug()) console.log("admin.service / updateKlass / userIdAdmin : ",userIdAdmin);
    if(this.isDebug()) console.log("admin.service / updateKlass / klassId : ",klassId);

    // POST
    let options = this.myRequest.getReqOptionCafeclassAPI(apiKey);
    let req_url = this.us.get(this.updateKlassUrl);

    let params = {
      user_id_admin:userIdAdmin,
      klass_id:klassId,
      klass_status:klassStatus
    };

    return this.http.post(req_url, params, options)
                .toPromise()
                .then(this.myExtractor.extractData)
                .catch(this.myExtractor.handleError);

  }

  fetchKlassList (  apiKey:string, 
                    pageNum:number, 
                    pageSize:number, 
                    searchQuery:string, 
                    klassStatus:string,
                    klassLevel:string,
                    klassSubwayLine:string,
                    klassSubwayStation:string,
                    klassDays:string,
                    klassTime:string ): Promise<MyResponse> {

    if(this.isDebug()) console.log("admin.service / fetchKlassList / 시작");
    if(this.isDebug()) console.log("admin.service / fetchKlassList / apiKey : ",apiKey);
    if(this.isDebug()) console.log("admin.service / fetchKlassList / pageNum : ",pageNum);
    if(this.isDebug()) console.log("admin.service / fetchKlassList / pageSize : ",pageSize);
    if(this.isDebug()) console.log("admin.service / fetchKlassList / searchQuery : ",searchQuery);

    if(this.isDebug()) console.log("admin.service / fetchKlassList / klassStatus : ",klassStatus);
    if(this.isDebug()) console.log("admin.service / fetchKlassList / klassLevel : ",klassLevel);
    if(this.isDebug()) console.log("admin.service / fetchKlassList / klassSubwayLine : ",klassSubwayLine);
    if(this.isDebug()) console.log("admin.service / fetchKlassList / klassSubwayStation : ",klassSubwayStation);
    if(this.isDebug()) console.log("admin.service / fetchKlassList / klassDays : ",klassDays);
    if(this.isDebug()) console.log("admin.service / fetchKlassList / klassTime : ",klassTime);

    // POST
    let options = this.myRequest.getReqOptionCafeclassAPI(apiKey);
    let req_url = this.us.get(this.fetchKlassListUrl);

    let params = {
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


  updateTeacher ( apiKey:string, 
                  userIdAdmin:number, 
                  teacherId:number, 
                  teacherStatus:string): Promise<MyResponse> {

    if(this.isDebug()) console.log("admin.service / updateTeacher / 시작");
    if(this.isDebug()) console.log("admin.service / updateTeacher / apiKey : ",apiKey);
    if(this.isDebug()) console.log("admin.service / updateTeacher / userIdAdmin : ",userIdAdmin);
    if(this.isDebug()) console.log("admin.service / updateTeacher / teacherId : ",teacherId);

    // POST
    let options = this.myRequest.getReqOptionCafeclassAPI(apiKey);
    let req_url = this.us.get(this.updateTeacherUrl);

    let params = {
      user_id_admin:userIdAdmin,
      teacher_id:teacherId,
      teacher_status:teacherStatus
    };

    return this.http.post(req_url, params, options)
                .toPromise()
                .then(this.myExtractor.extractData)
                .catch(this.myExtractor.handleError);

  }

  fetchTeacherListV2 (apiKey:string, pageNum:number, pageSize:number, searchQuery:string, teacherStatus:string): Promise<MyResponse> {

    if(this.isDebug()) console.log("admin.service / fetchTeacherListV2 / 시작");
    if(this.isDebug()) console.log("admin.service / fetchTeacherListV2 / apiKey : ",apiKey);
    if(this.isDebug()) console.log("admin.service / fetchTeacherListV2 / pageNum : ",pageNum);
    if(this.isDebug()) console.log("admin.service / fetchTeacherListV2 / pageSize : ",pageSize);
    if(this.isDebug()) console.log("admin.service / fetchTeacherListV2 / searchQuery : ",searchQuery);
    if(this.isDebug()) console.log("admin.service / fetchTeacherListV2 / teacherStatus : ",teacherStatus);

    // POST
    let options = this.myRequest.getReqOptionCafeclassAPI(apiKey);
    let req_url = this.us.get(this.fetchTeacherListV2Url);

    let params = {
      page_num:pageNum,
      page_size:pageSize,
      search_query:searchQuery,
      teacher_status:teacherStatus
    };
    
    return this.http.post(req_url, params, options)
                .toPromise()
                .then(this.myExtractor.extractData)
                .catch(this.myExtractor.handleError);

  }

  updateUser (  apiKey:string, 
                userIdAdmin:number, 
                userId:number, 
                userStatus:string, 
                userPermission:string): Promise<MyResponse> {

    if(this.isDebug()) console.log("admin.service / updateUser / 시작");
    if(this.isDebug()) console.log("admin.service / updateUser / apiKey : ",apiKey);

    // POST
    let options = this.myRequest.getReqOptionCafeclassAPI(apiKey);
    let req_url = this.us.get(this.updateUserUrl);

    let params = {
      user_id_admin:userIdAdmin,
      user_id:userId,
      user_status:userStatus,
      user_permission:userPermission
    };

    return this.http.post(req_url, params, options)
                .toPromise()
                .then(this.myExtractor.extractData)
                .catch(this.myExtractor.handleError);

  }

  fetchUserListV2 (apiKey:string, pageNum:number, pageSize:number, searchQuery:string, userStatus:string, userPermission:string): Promise<MyResponse> {

    if(this.isDebug()) console.log("admin.service / fetchUserListV2 / 시작");
    if(this.isDebug()) console.log("admin.service / fetchUserListV2 / apiKey : ",apiKey);
    if(this.isDebug()) console.log("admin.service / fetchUserListV2 / pageNum : ",pageNum);
    if(this.isDebug()) console.log("admin.service / fetchUserListV2 / pageSize : ",pageSize);
    if(this.isDebug()) console.log("admin.service / fetchUserListV2 / searchQuery : ",searchQuery);
    if(this.isDebug()) console.log("admin.service / fetchUserListV2 / userStatus : ",userStatus);
    if(this.isDebug()) console.log("admin.service / fetchUserListV2 / userPermission : ",userPermission);

    // POST
    let options = this.myRequest.getReqOptionCafeclassAPI(apiKey);
    let req_url = this.us.get(this.fetchUserListV2Url);

    let params = {
      page_num:pageNum,
      page_size:pageSize,
      search_query:searchQuery,
      user_status:userStatus,
      user_permission:userPermission
    };
    
    return this.http.post(req_url, params, options)
                .toPromise()
                .then(this.myExtractor.extractData)
                .catch(this.myExtractor.handleError);

  }  

  
} // end class
