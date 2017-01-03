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

  private fetchUserAdminTotalCntUrl = '/CI/index.php/api/admin/usersadminpagination';
  private fetchUserAdminListUrl = '/CI/index.php/api/admin/usersadmin';
  private searchUserAdminUrl = '/CI/index.php/api/admin/searchusersadmin';

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
  
} // end class
