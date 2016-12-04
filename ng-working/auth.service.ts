import { Injectable } from '@angular/core';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import { UrlService } from "./util/url.service";

@Injectable()
export class AuthService {

    private adminAuthUrl = '/CI/index.php/api/admin/auth';
    private kakaoAuthUrl = '/CI/index.php/api/kakao/authurl';
    private naverAuthUrl = '/CI/index.php/api/naver/authurl';
    private facebookAuthUrl = '/CI/index.php/api/facebook/authurl';

    constructor(private us:UrlService, private http: Http) {
    }

    getAdminAuth (): Promise<any> {

        let req_url = this.us.get(this.adminAuthUrl);

        let isDebug:boolean = true;
        // let isDebug:boolean = false;
        if(isDebug) console.log("auth.service / getAdminAuth / 시작");
        if(isDebug) console.log("auth.service / getAdminAuth / req_url : ",req_url); 

        return this.http.get(req_url)
                      .toPromise()
                      .then(this.extractData)
                      .catch(this.handleError);
    }

    getKakaoAuth (): Promise<any> {

        let req_url = this.us.get(this.kakaoAuthUrl);

        let isDebug:boolean = true;
        // let isDebug:boolean = false;
        if(isDebug) console.log("auth.service / getKakaoAuth / 시작");
        if(isDebug) console.log("auth.service / getKakaoAuth / req_url : ",req_url);

        return this.http.get(req_url)
                      .toPromise()
                      .then(this.extractData)
                      .catch(this.handleError);
    }

    private extractData(res: Response) {

        let isDebug:boolean = true;
        // let isDebug:boolean = false;
        if(isDebug) console.log("auth.service / extractData / 시작");
        if(isDebug) console.log("auth.service / extractData / res : ",res);

        let body = res.json();
        if(isDebug) console.log("auth.service / extractData / body : ",body);

        // TODO - 데이터 검증 프로세스.
        if(null == body.data || !body.success) {
            return null;
        }

        return body.data;
    }

    // New - XHR
    // promise-based
    private handleError (error: any) {
        // In a real world app, we might use a remote logging infrastructure
        // We'd also dig deeper into the error to get a better message

        console.log(">>> auth.service / error : ",error);

        let errMsg = (error.message) ? error.message :
        error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg); // log to console instead
        return Promise.reject(errMsg);
    }

}
