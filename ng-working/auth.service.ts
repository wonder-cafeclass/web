import { Injectable }         from '@angular/core';
import { Headers, 
         Http, 
         Response, 
         RequestOptions }     from '@angular/http';
import { UrlService }         from "./util/url.service";
import { MyExtractor }        from './util/http/my-extractor';
import { MyResponse }         from './util/model/my-response';

@Injectable()
export class AuthService {

    private adminAuthUrl = '/CI/index.php/api/admin/auth';
    private myExtractor:MyExtractor;

    constructor(    private us:UrlService, 
                    private http: Http    ) {

        this.myExtractor = new MyExtractor();
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

}
