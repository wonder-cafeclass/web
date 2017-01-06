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







// REMOVE ME
/*

  // REMOVE ME
  // private fetchUserListPaginationUrl = '/CI/index.php/api/admin/userlistpagination';
  // private fetchUserListUrl = '/CI/index.php/api/admin/userlist';
  // private searchUserUrl = '/CI/index.php/api/admin/searchuser';
  // private fetchUserAdminTotalCntUrl = '/CI/index.php/api/admin/usersadminpagination';
  // private fetchUserAdminListUrl = '/CI/index.php/api/admin/usersadmin';
  // private searchUserAdminUrl = '/CI/index.php/api/admin/searchusersadmin';
  // private fetchTeacherTotalCntUrl = '/CI/index.php/api/admin/teacherpagination';
  // private fetchTeacherListUrl = '/CI/index.php/api/admin/teacherlist';

  fetchUserListPagination (apiKey:string): Promise<MyResponse> {

    if(this.isDebug()) console.log("admin.service / fetchUserListPagination / 시작");
    if(this.isDebug()) console.log("admin.service / fetchUserListPagination / apiKey : ",apiKey);

    // POST
    let options = this.myRequest.getReqOptionCafeclassAPI(apiKey);
    let req_url = this.us.get(this.fetchUserListPaginationUrl);

    let params = {};

    return this.http.post(req_url, params, options)
                .toPromise()
                .then(this.myExtractor.extractData)
                .catch(this.myExtractor.handleError);

  }   

  fetchUserList (apiKey:string, pageNum:number, pageSize:number): Promise<MyResponse> {

    if(this.isDebug()) console.log("admin.service / fetchUserList / 시작");
    if(this.isDebug()) console.log("admin.service / fetchUserList / apiKey : ",apiKey);
    if(this.isDebug()) console.log("admin.service / fetchUserList / pageNum : ",pageNum);
    if(this.isDebug()) console.log("admin.service / fetchUserList / pageSize : ",pageSize);

    // POST
    let options = this.myRequest.getReqOptionCafeclassAPI(apiKey);
    let req_url = this.us.get(this.fetchUserListUrl);

    let params = {
      page_num:pageNum,
      page_size:pageSize,
    };
    
    return this.http.post(req_url, params, options)
                .toPromise()
                .then(this.myExtractor.extractData)
                .catch(this.myExtractor.handleError);

  }  


  searchUser (apiKey:string, searchQuery:string, pageNum:number, pageSize:number): Promise<MyResponse> {

    if(this.isDebug()) console.log("admin.service / fetchUserList / 시작");
    if(this.isDebug()) console.log("admin.service / fetchUserList / apiKey : ",apiKey);
    if(this.isDebug()) console.log("admin.service / fetchUserList / searchQuery : ",searchQuery);
    if(this.isDebug()) console.log("admin.service / fetchUserList / pageNum : ",pageNum);
    if(this.isDebug()) console.log("admin.service / fetchUserList / pageSize : ",pageSize);

    // POST
    let options = this.myRequest.getReqOptionCafeclassAPI(apiKey);
    let req_url = this.us.get(this.searchUserUrl);

    let params = {
      search_query:searchQuery,
      page_num:pageNum,
      page_size:pageSize,
    };
    
    return this.http.post(req_url, params, options)
                .toPromise()
                .then(this.myExtractor.extractData)
                .catch(this.myExtractor.handleError);

  }  

  fetchUsersAdminPagination (apiKey:string): Promise<MyResponse> {

    if(this.isDebug()) console.log("admin.service / fetchUsersAdminPagination / 시작");
    if(this.isDebug()) console.log("admin.service / fetchUsersAdminPagination / apiKey : ",apiKey);

    // POST
    let options = this.myRequest.getReqOptionCafeclassAPI(apiKey);
    let req_url = this.us.get(this.fetchUserAdminTotalCntUrl);

    let params = {};

    return this.http.post(req_url, params, options)
                .toPromise()
                .then(this.myExtractor.extractData)
                .catch(this.myExtractor.handleError);

  }  

  fetchUsersAdmin (apiKey:string, pageNum:number, pageSize:number): Promise<MyResponse> {

    if(this.isDebug()) console.log("admin.service / fetchUsersAdmin / 시작");
    if(this.isDebug()) console.log("admin.service / fetchUsersAdmin / apiKey : ",apiKey);
    if(this.isDebug()) console.log("admin.service / fetchUsersAdmin / pageNum : ",pageNum);
    if(this.isDebug()) console.log("admin.service / fetchUsersAdmin / pageSize : ",pageSize);

    // POST
    let options = this.myRequest.getReqOptionCafeclassAPI(apiKey);
    let req_url = this.us.get(this.fetchUserAdminListUrl);

    let params = {
      page_num:pageNum,
      page_size:pageSize,
    };

    return this.http.post(req_url, params, options)
                .toPromise()
                .then(this.myExtractor.extractData)
                .catch(this.myExtractor.handleError);
  } // end method


  fetchTeacherList (apiKey:string, pageNum:number, pageSize:number): Promise<MyResponse> {

    if(this.isDebug()) console.log("admin.service / fetchTeachersPagination / 시작");
    if(this.isDebug()) console.log("admin.service / fetchTeachersPagination / apiKey : ",apiKey);
    if(this.isDebug()) console.log("admin.service / fetchTeachersPagination / pageNum : ",pageNum);
    if(this.isDebug()) console.log("admin.service / fetchTeachersPagination / pageSize : ",pageSize);

    // POST
    let options = this.myRequest.getReqOptionCafeclassAPI(apiKey);
    let req_url = this.us.get(this.fetchTeacherListUrl);

    let params = {
      page_num:pageNum,
      page_size:pageSize,
    };
    
    return this.http.post(req_url, params, options)
                .toPromise()
                .then(this.myExtractor.extractData)
                .catch(this.myExtractor.handleError);

  }

  fetchTeachersPagination (apiKey:string): Promise<MyResponse> {

    if(this.isDebug()) console.log("admin.service / fetchTeachersPagination / 시작");
    if(this.isDebug()) console.log("admin.service / fetchTeachersPagination / apiKey : ",apiKey);

    // POST
    let options = this.myRequest.getReqOptionCafeclassAPI(apiKey);
    let req_url = this.us.get(this.fetchTeacherTotalCntUrl);

    let params = {};

    return this.http.post(req_url, params, options)
                .toPromise()
                .then(this.myExtractor.extractData)
                .catch(this.myExtractor.handleError);

  }  

*/

  
} // end class
