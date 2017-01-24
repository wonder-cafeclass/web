import { Injectable }         from '@angular/core';
import { Headers, 
         Http, 
         Response, 
         RequestOptions }     from '@angular/http';
import { UrlService }         from "./util/url.service";
import { MyExtractor }        from './util/http/my-extractor';
import { MyRequest }          from './util/http/my-request';
import { MyResponse }         from './util/model/my-response';
import { MyEventWatchTowerService }        from './util/service/my-event-watchtower.service';

@Injectable()
export class AuthService {

    private adminAuthUrl = '/CI/index.php/api/admin/auth';
    private fetchInitUrl = '/CI/index.php/api/init/fetchInit';
    private myRequest:MyRequest;
    private myExtractor:MyExtractor;
    private watchTower:MyEventWatchTowerService;

    constructor(    private us:UrlService, 
                    private http: Http    ) {

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


    getAdminAuth (): Promise<MyResponse> {

        let req_url = this.us.get(this.adminAuthUrl);

        // let isDebug:boolean = true;
        let isDebug:boolean = false;
        if(isDebug) console.log("auth.service / getAdminAuth / 시작");
        if(isDebug) console.log("auth.service / getAdminAuth / req_url : ",req_url); 

        return this.http.get(req_url)
                    .toPromise()
                    .then(this.myExtractor.extractData)
                    .catch(this.myExtractor.handleError);
    }

    fetchInit (): Promise<MyResponse> {

        // wonder.jung
        if(this.isDebug()) console.log("user.service / fetchKlassNStudentList / 시작");

        // POST
        let req_url = this.us.get(this.fetchInitUrl);
        let params = {}

        return this.http.post(req_url, params)
                    .toPromise()
                    .then(this.myExtractor.extractData)
                    .catch(this.myExtractor.handleError);    

    }    

}
