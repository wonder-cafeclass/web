import { Injectable } from '@angular/core';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import { UrlService } from "../../util/url.service";

@Injectable()
export class LoginService {

    private kakaoAuthLinkUrl = '/CI/index.php/api/kakao/authurl';
    private kakaoAuthUrl = '/CI/index.php/api/kakao/auth';
    private kakaoTokenUrl = '/CI/index.php/api/kakao/token';
    private kakaoSignUpUrl = '/CI/index.php/api/kakao/signup';
    private kakaoMeUrl = '/CI/index.php/api/kakao/me';

    private naverAuthUrl = '/CI/index.php/api/naver/authurl';
    private naverStateUrl = '/CI/index.php/api/naver/state';
    private naverAccessUrl = '/CI/index.php/api/naver/access';
    private naverMeUrl = '/CI/index.php/api/naver/me';
    
    private facebookAuthUrl = '/CI/index.php/api/facebook/authurl';

    constructor(private us:UrlService, private http: Http) {
    }

    getNaverMe (): Promise<any> {

        let req_url = this.us.get(this.naverMeUrl);

        console.log("login.service / getNaverMe / req_url : ",req_url);

        return this.http.get(req_url)
                      .toPromise()
                      .then(this.extractData)
                      .catch(this.handleError);
    }

    getNaverAccess (naver_code:string): Promise<any> {

        let req_url = this.us.get(this.naverAccessUrl) + "?naver_code=" + naver_code;

        console.log("login.service / getNaverAccess / req_url : ",req_url);

        return this.http.get(req_url)
                      .toPromise()
                      .then(this.extractData)
                      .catch(this.handleError);
    }

    getNaverState (state:string): Promise<any> {

        let req_url = this.us.get(this.naverStateUrl) + "?state=" + state;

        console.log("login.service / getNaverState / req_url : ",req_url);

        return this.http.get(req_url)
                      .toPromise()
                      .then(this.extractData)
                      .catch(this.handleError);
    }

    getNaverAuthUrl (): Promise<any> {

        let req_url = this.us.get(this.naverAuthUrl);

        console.log("login.service / getNaverAuthUrl / req_url : ",req_url);

        return this.http.get(req_url)
                      .toPromise()
                      .then(this.extractData)
                      .catch(this.handleError);
    }

    getKakaoAuthUrl (): Promise<any> {

        let req_url = this.us.get(this.kakaoAuthLinkUrl);

        console.log("login.service / getKakaoAuthUrl / req_url : ",req_url);

        return this.http.get(req_url)
                      .toPromise()
                      .then(this.extractData)
                      .catch(this.handleError);
    }
    getKakaoToken (code:string): Promise<any> {

        let req_url = this.us.get(this.kakaoTokenUrl) + "?code=" + code;

        console.log("login.service / getKakaoToken / req_url : ",req_url);

        return this.http.get(req_url)
                      .toPromise()
                      .then(this.extractData)
                      .catch(this.handleError);
    }
    getKakaoSignUp (kakaoTokenType:string, kakaoAccessToken:string): Promise<any> {

        let req_url = this.us.get(this.kakaoSignUpUrl) + "?token_type=" + kakaoTokenType + "&access_token=" + kakaoAccessToken;

        console.log("login.service / getKakaoSignUp / req_url : ",req_url);

        return this.http.get(req_url)
                      .toPromise()
                      .then(this.extractData)
                      .catch(this.handleError);
    }
    getKakaoMe (kakaoTokenType:string, kakaoAccessToken:string): Promise<any> {

        let req_url = this.us.get(this.kakaoMeUrl) + "?token_type=" + kakaoTokenType + "&access_token=" + kakaoAccessToken;

        console.log("login.service / getKakaoMe / req_url : ",req_url);

        return this.http.get(req_url)
                      .toPromise()
                      .then(this.extractData)
                      .catch(this.handleError);
    }
    getKakaoAuth (code:string): Promise<any> {

        let req_url = this.us.get(this.kakaoAuthUrl) + "?code=" + code;

        console.log("login.service / getKakaoAuth / req_url : ",req_url);

        return this.http.get(req_url)
                      .toPromise()
                      .then(this.extractData)
                      .catch(this.handleError);
    }

    private extractData(res: Response) {

        let body = res.json();

        console.log("login.service / extractData / body ::: ",body);

        // TODO - 데이터 검증 프로세스.
        if(null == body.data || !body.success) {
            console.log("login.service / extractData / 데이터가 없습니다.");
            return null;
        }

        console.log("login.service / extractData / 3");

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
