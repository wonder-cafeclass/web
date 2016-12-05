import { Injectable }               from '@angular/core';
import { Headers, 
         Http, 
         Response, 
         RequestOptions }           from '@angular/http';
import { UrlService }               from "../../util/url.service";
import { MyExtractor }              from '../../util/http/my-extractor';

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
  private facebookStateUrl = '/CI/index.php/api/facebook/state';
  private facebookAccessUrl = '/CI/index.php/api/facebook/access';
  private facebookMeUrl = '/CI/index.php/api/facebook/me';

  private myExtractor:MyExtractor;

  constructor(  private us:UrlService,
                private http:Http  ) {
    this.myExtractor = new MyExtractor();
  }

  getFacebookMe (): Promise<any> {

      let req_url = this.us.get(this.facebookMeUrl);

      // let isDebug:boolean = true;
      let isDebug:boolean = false;
      if(isDebug) console.log("user.service / getFacebookMe / 시작");
      if(isDebug) console.log("user.service / getFacebookMe / req_url : ",req_url);

      return this.http.get(req_url)
                    .toPromise()
                    .then(this.myExtractor.extractData)
                    .catch(this.myExtractor.handleError);
  } 

  getFacebookAccess (code:string): Promise<any> {

      let req_url = this.us.get(this.facebookAccessUrl) + "?code=" + code;

      // let isDebug:boolean = true;
      let isDebug:boolean = false;
      if(isDebug) console.log("user.service / getFacebookAccess / 시작");
      if(isDebug) console.log("user.service / getFacebookAccess / req_url : ",req_url);

      return this.http.get(req_url)
                    .toPromise()
                    .then(this.myExtractor.extractData)
                    .catch(this.myExtractor.handleError);
  }    

  getFacebookState (state:string): Promise<any> {

      let req_url = this.us.get(this.facebookStateUrl) + "?state=" + state;

      // let isDebug:boolean = true;
      let isDebug:boolean = false;
      if(isDebug) console.log("user.service / getFacebookState / 시작");
      if(isDebug) console.log("user.service / getFacebookState / state : ",state);
      if(isDebug) console.log("user.service / getFacebookState / req_url : ",req_url);

      return this.http.get(req_url)
                    .toPromise()
                    .then(this.myExtractor.extractData)
                    .catch(this.myExtractor.handleError);
  }

  getFacebookAuthUrl (): Promise<any> {

      let req_url = this.us.get(this.facebookAuthUrl);

      let isDebug:boolean = true;
      // let isDebug:boolean = false;
      if(isDebug) console.log("user.service / getFacebookAuthUrl / 시작");
      if(isDebug) console.log("user.service / getFacebookAuthUrl / req_url : ",req_url);

      return this.http.get(req_url)
                    .toPromise()
                    .then(this.myExtractor.extractData)
                    .catch(this.myExtractor.handleError);
  }    

  getNaverMe (): Promise<any> {

      let req_url = this.us.get(this.naverMeUrl);

      // let isDebug:boolean = true;
      let isDebug:boolean = false;
      if(isDebug) console.log("user.service / getNaverMe / 시작");
      if(isDebug) console.log("user.service / getNaverMe / req_url : ",req_url);

      return this.http.get(req_url)
                    .toPromise()
                    .then(this.myExtractor.extractData)
                    .catch(this.myExtractor.handleError);
  }

  getNaverAccess (naver_code:string): Promise<any> {

      let req_url = this.us.get(this.naverAccessUrl) + "?naver_code=" + naver_code;

      // let isDebug:boolean = true;
      let isDebug:boolean = false;
      if(isDebug) console.log("user.service / getNaverAccess / 시작");
      if(isDebug) console.log("user.service / getNaverAccess / naver_code : ",naver_code);
      if(isDebug) console.log("user.service / getNaverAccess / req_url : ",req_url);

      return this.http.get(req_url)
                    .toPromise()
                    .then(this.myExtractor.extractData)
                    .catch(this.myExtractor.handleError);
  }

  getNaverState (state:string): Promise<any> {

      let req_url = this.us.get(this.naverStateUrl) + "?state=" + state;

      // let isDebug:boolean = true;
      let isDebug:boolean = false;
      if(isDebug) console.log("user.service / getNaverState / 시작");
      if(isDebug) console.log("user.service / getNaverState / req_url : ",req_url);

      return this.http.get(req_url)
                    .toPromise()
                    .then(this.myExtractor.extractData)
                    .catch(this.myExtractor.handleError);
  }

  getNaverAuthUrl (): Promise<any> {

      let req_url = this.us.get(this.naverAuthUrl);

      let isDebug:boolean = true;
      // let isDebug:boolean = false;
      if(isDebug) console.log("user.service / getNaverAuthUrl / 시작");
      if(isDebug) console.log("user.service / getNaverAuthUrl / req_url : ",req_url);

      return this.http.get(req_url)
                    .toPromise()
                    .then(this.myExtractor.extractData)
                    .catch(this.myExtractor.handleError);
  }

  getKakaoAuthUrl (): Promise<any> {

      let req_url = this.us.get(this.kakaoAuthLinkUrl);

      let isDebug:boolean = true;
      // let isDebug:boolean = false;
      if(isDebug) console.log("user.service / getKakaoAuthUrl / 시작");
      if(isDebug) console.log("user.service / getKakaoAuthUrl / req_url : ",req_url);

      return this.http.get(req_url)
                    .toPromise()
                    .then(this.myExtractor.extractData)
                    .catch(this.myExtractor.handleError);

  }
  getKakaoToken (code:string): Promise<any> {

      let req_url = this.us.get(this.kakaoTokenUrl) + "?code=" + code;

      // let isDebug:boolean = true;
      let isDebug:boolean = false;
      if(isDebug) console.log("user.service / getKakaoToken / 시작");
      if(isDebug) console.log("user.service / getKakaoToken / code : ",code);
      if(isDebug) console.log("user.service / getKakaoToken / req_url : ",req_url);

      return this.http.get(req_url)
                    .toPromise()
                    .then(this.myExtractor.extractData)
                    .catch(this.myExtractor.handleError);
  }
  getKakaoSignUp (kakaoTokenType:string, kakaoAccessToken:string): Promise<any> {

      let req_url = this.us.get(this.kakaoSignUpUrl) + "?token_type=" + kakaoTokenType + "&access_token=" + kakaoAccessToken;

      // let isDebug:boolean = true;
      let isDebug:boolean = false;
      if(isDebug) console.log("user.service / getKakaoSignUp / 시작");
      if(isDebug) console.log("user.service / getKakaoSignUp / kakaoTokenType : ",kakaoTokenType);
      if(isDebug) console.log("user.service / getKakaoSignUp / kakaoAccessToken : ",kakaoAccessToken);
      if(isDebug) console.log("user.service / getKakaoSignUp / req_url : ",req_url);

      return this.http.get(req_url)
                    .toPromise()
                    .then(this.myExtractor.extractData)
                    .catch(this.myExtractor.handleError);
  }
  getKakaoMe (kakaoTokenType:string, kakaoAccessToken:string): Promise<any> {

      let req_url = this.us.get(this.kakaoMeUrl) + "?token_type=" + kakaoTokenType + "&access_token=" + kakaoAccessToken;

      // let isDebug:boolean = true;
      let isDebug:boolean = false;
      if(isDebug) console.log("user.service / getKakaoMe / 시작");
      if(isDebug) console.log("user.service / getKakaoMe / kakaoTokenType : ",kakaoTokenType);
      if(isDebug) console.log("user.service / getKakaoMe / kakaoAccessToken : ",kakaoAccessToken);
      if(isDebug) console.log("user.service / getKakaoMe / req_url : ",req_url);

      return this.http.get(req_url)
                    .toPromise()
                    .then(this.myExtractor.extractData)
                    .catch(this.myExtractor.handleError);
  }
  getKakaoAuth (code:string): Promise<any> {

      let req_url = this.us.get(this.kakaoAuthUrl) + "?code=" + code;

      // let isDebug:boolean = true;
      let isDebug:boolean = false;
      if(isDebug) console.log("user.service / getKakaoAuth / 시작");
      if(isDebug) console.log("user.service / getKakaoAuth / code : ",code);
      if(isDebug) console.log("user.service / getKakaoAuth / req_url : ",req_url);

      return this.http.get(req_url)
                    .toPromise()
                    .then(this.myExtractor.extractData)
                    .catch(this.myExtractor.handleError);
  }

}
