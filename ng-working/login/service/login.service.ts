import { Injectable } from '@angular/core';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import { UrlService } from "../../util/url.service";

@Injectable()
export class LoginService {

    private kakaoAuthLinkUrl = '/CI/index.php/api/kakao/authurl';
    private kakaoAuthUrl = '/CI/index.php/api/kakao/auth';
    private kakaoTokenUrl = '/CI/index.php/api/kakao/token';
    private kakaoSingUpUrl = '/CI/index.php/api/kakao/signup';

    private naverAuthUrl = '/CI/index.php/api/naver/authurl';
    private facebookAuthUrl = '/CI/index.php/api/facebook/authurl';

    constructor(private us:UrlService, private http: Http) {
    }

    getKakaoAuthUrl (): Promise<any> {

        let req_url = this.us.get(this.kakaoAuthLinkUrl);

        return this.http.get(req_url)
                      .toPromise()
                      .then(this.extractData)
                      .catch(this.handleError);
    }

    getKakaoAuth (code:string): Promise<any> {

        let req_url = this.us.get(this.kakaoAuthUrl) + "?code=" + code;

        return this.http.get(req_url)
                      .toPromise()
                      .then(this.extractData)
                      .catch(this.handleError);
    }
// REMOVE ME
/*
    getKakaoToken (code:string): Promise<any> {

        let req_url = this.us.get(this.kakaoTokenUrl) + "?code=" + code;

        console.log("getKakaoToken / req_url : ",req_url);

        return this.http.get(req_url)
                      .toPromise()
                      .then(this.extractData)
                      .catch(this.handleError);
    }

    getKakaoSignUp (accessToken:string, tokenType:string): Promise<any> {

        let req_url = this.us.get(this.kakaoSingUpUrl) + "?access_token=" + accessToken + "&token_type=" + tokenType;

        console.log("getKakaoSignUp / req_url : ",req_url);

        return this.http.get(req_url)
                      .toPromise()
                      .then(this.extractData)
                      .catch(this.handleError);
    }
*/
    private extractData(res: Response) {

        let body = res.json();

        console.log("AuthService / extractData / body ::: ",body);

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
        let errMsg = (error.message) ? error.message :
        error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg); // log to console instead
        return Promise.reject(errMsg);
    }

}
