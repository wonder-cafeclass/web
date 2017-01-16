import { Injectable }                      from '@angular/core';
import { Headers, 
         Http, 
         Response, 
         RequestOptions }                  from '@angular/http';

import { User }                            from "../model/user";

import { UrlService }                      from "../../util/url.service";
import { MyExtractor }                     from '../../util/http/my-extractor';
import { MyRequest }                       from '../../util/http/my-request';
import { MyResponse }                      from '../../util/model/my-response';
import { MyEventWatchTowerService }        from '../../util/service/my-event-watchtower.service';

@Injectable()
export class UserService {

  private fetchKlassNStudentListUrl = '/CI/index.php/api/klass/fetchklassnstudentlist';

  private getUserListUrl = '/CI/index.php/api/users/list';

  private getUserByEmailUrl = '/CI/index.php/api/users/email';
  private getUserByFacebookIdUrl = '/CI/index.php/api/users/facebook';
  private getUserByKakaoIdUrl = '/CI/index.php/api/users/kakao';
  private getUserByNaverIdUrl = '/CI/index.php/api/users/naver';
  private getUserByMobileUrl = '/CI/index.php/api/users/mobile';

  private sendMailUserValidationUrl = '/CI/index.php/api/users/validation';
  private confirmUserValidationUrl = '/CI/index.php/api/users/confirmvalidation';
  private confirmUserKakaoUrl = '/CI/index.php/api/users/confirmkakao';
  private confirmUserFacebookUrl = '/CI/index.php/api/users/confirmfacebook';
  private confirmUserNaverUrl = '/CI/index.php/api/users/confirmnaver';
  private confirmUserEmailPasswordUrl = '/CI/index.php/api/users/confirm';

  private getUserCookieUrl = '/CI/index.php/api/users/cookie';
  private logoutUrl = '/CI/index.php/api/users/logout';

  private updateUserUrl = '/CI/index.php/api/users/update';
  private updateUserMutablesUrl = '/CI/index.php/api/users/updatemutables';
  private updatePasswordUrl = '/CI/index.php/api/users/updatepw';
  private addUserUrl = '/CI/index.php/api/users/add';

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
  } 

  fetchKlassNStudentList (
    apiKey:string,
    pageNum:number,
    pageRowCnt:number,
    userId:number ): Promise<MyResponse> {

    // wonder.jung
    if(this.isDebug()) console.log("user.service / fetchKlassNStudentList / 시작");
    if(this.isDebug()) console.log("user.service / fetchKlassNStudentList / apiKey : ",apiKey);

    // POST
    let options = this.myRequest.getReqOptionCafeclassAPI(apiKey);
    let req_url = this.us.get(this.fetchKlassNStudentListUrl);
    let params = {
      page_num:pageNum,
      pageRowCnt:pageRowCnt,
      user_id:userId
    }

    return this.http.post(req_url, params, options)
                .toPromise()
                .then(this.myExtractor.extractData)
                .catch(this.myExtractor.handleError);    

  } // end method

  getUserList (apiKey:string): Promise<MyResponse> {

    // wonder.jung
    if(this.isDebug()) console.log("user.service / getUserList / 시작");
    if(this.isDebug()) console.log("user.service / getUserList / apiKey : ",apiKey);

    // POST
    let options = this.myRequest.getReqOptionCafeclassAPI(apiKey);
    let req_url = this.us.get(this.getUserListUrl);
    let params = {}

    return this.http.post(req_url, params, options)
                .toPromise()
                .then(this.myExtractor.extractData)
                .catch(this.myExtractor.handleError);    

  } // end method

  getUserByEmail (email:string): Promise<MyResponse> {

    // TODO 이메일로 사용자를 조회.
    // 개인 정보 유출 경로가 될 수 있으므로 POST 전송 및 API 키 사용 필요. 

    let req_url = this.us.get(this.getUserByEmailUrl);
    req_url = `${ req_url }?q=${ email }`;

    if(this.isDebug()) console.log("user.service / getUserByEmail / 시작");
    if(this.isDebug()) console.log("user.service / getUserByEmail / email : ",email);
    if(this.isDebug()) console.log("user.service / getUserByEmail / req_url : ",req_url);

    return this.http.get(req_url)
                .toPromise()
                .then(this.myExtractor.extractData)
                .catch(this.myExtractor.handleError);
  }

  getUserByFacebookId (facebookId:string): Promise<MyResponse> {

    let req_url = this.us.get(this.getUserByFacebookIdUrl);
    req_url = `${ req_url }?q=${ facebookId }`;

    if(this.isDebug()) console.log("user.service / getUserByFacebookId / 시작");
    if(this.isDebug()) console.log("user.service / getUserByFacebookId / facebookId : ",facebookId);
    if(this.isDebug()) console.log("user.service / getUserByFacebookId / req_url : ",req_url);

    return this.http.get(req_url)
                .toPromise()
                .then(this.myExtractor.extractData)
                .catch(this.myExtractor.handleError);
  }

  getUserByNaverId (naverId:string): Promise<MyResponse> {

    let req_url = this.us.get(this.getUserByNaverIdUrl);
    req_url = `${ req_url }?q=${ naverId }`;

    if(this.isDebug()) console.log("user.service / getUserByNaverId / 시작");
    if(this.isDebug()) console.log("user.service / getUserByNaverId / naverId : ",naverId);
    if(this.isDebug()) console.log("user.service / getUserByNaverId / req_url : ",req_url);

    return this.http.get(req_url)
                .toPromise()
                .then(this.myExtractor.extractData)
                .catch(this.myExtractor.handleError);
  } 

  getUserByKakaoId (kakaoId:string): Promise<MyResponse> {

    let req_url = this.us.get(this.getUserByKakaoIdUrl);
    req_url = `${ req_url }?q=${ kakaoId }`;

    if(this.isDebug()) console.log("user.service / getUserByKakaoId / 시작");
    if(this.isDebug()) console.log("user.service / getUserByKakaoId / kakaoId : ",kakaoId);
    if(this.isDebug()) console.log("user.service / getUserByKakaoId / req_url : ",req_url);

    return this.http.get(req_url)
                .toPromise()
                .then(this.myExtractor.extractData)
                .catch(this.myExtractor.handleError);
  }    

  getUserByMobile (apiKey:string, mobileHead:string, mobileBody:string, mobileTail:string): Promise<MyResponse> {

    if(this.isDebug()) console.log("user.service / getUserByMobile / 시작");
    if(this.isDebug()) console.log("user.service / getUserByMobile / apiKey : ",apiKey);
    if(this.isDebug()) console.log("user.service / getUserByMobile / mobileHead : ",mobileHead);
    if(this.isDebug()) console.log("user.service / getUserByMobile / mobileBody : ",mobileBody);
    if(this.isDebug()) console.log("user.service / getUserByMobile / mobileTail : ",mobileTail);

    // POST
    let options = this.myRequest.getReqOptionCafeclassAPI(apiKey);
    let req_url = this.us.get(this.getUserByMobileUrl);

    if(this.isDebug()) console.log("user.service / getUserByMobile / req_url : ",req_url);

    let params = {
      mobile_head:mobileHead,
      mobile_body:mobileBody,
      mobile_tail:mobileTail
    }

    return this.http.post(req_url, params, options)
                .toPromise()
                .then(this.myExtractor.extractData)
                .catch(this.myExtractor.handleError);
  }

  updateUserByUser(apiKey:string, user:User): Promise<MyResponse> {

    let mobileArr:string[] = user.getMobileArr();
    let birthdayArr:string[] = user.getBirthdayArr();

    return this.updateUserMutableProps(
      // apiKey:string, 
      apiKey,
      // email:string, 
      user.email,
      // name:string, 
      user.name,
      // nickname:string, 
      user.nickname,
      // gender:string,
      user.gender,
      // birthYear:string,
      birthdayArr[0],
      // birthMonth:string,
      birthdayArr[1],
      // birthDay:string,
      birthdayArr[2],
      // thumbnail:string,
      user.thumbnail,
      // mobileHead:string,
      mobileArr[0],
      // mobileBody:string,
      mobileArr[1],
      // mobileTail:string
      mobileArr[2]
    );
  }

  updateUserMutableProps (  
    apiKey:string, 
    email:string, 
    name:string, 
    nickname:string, 
    gender:string,
    birthYear:string,
    birthMonth:string,
    birthDay:string,
    thumbnail:string,
    mobileHead:string,
    mobileBody:string,
    mobileTail:string): Promise<MyResponse> {

    if(this.isDebug()) console.log("user.service / updateUserMutableProps / 시작");
    if(this.isDebug()) console.log("user.service / updateUserMutableProps / apiKey : ",apiKey);
    if(this.isDebug()) console.log("user.service / updateUserMutableProps / email : ",email);
    if(this.isDebug()) console.log("user.service / updateUserMutableProps / name : ",name);
    if(this.isDebug()) console.log("user.service / updateUserMutableProps / nickname : ",nickname);
    if(this.isDebug()) console.log("user.service / updateUserMutableProps / gender : ",gender);
    if(this.isDebug()) console.log("user.service / updateUserMutableProps / birthYear : ",birthYear);
    if(this.isDebug()) console.log("user.service / updateUserMutableProps / birthMonth : ",birthMonth);
    if(this.isDebug()) console.log("user.service / updateUserMutableProps / birthDay : ",birthDay);
    if(this.isDebug()) console.log("user.service / updateUserMutableProps / thumbnail : ",thumbnail);
    if(this.isDebug()) console.log("user.service / updateUserMutableProps / mobileHead : ",mobileHead);
    if(this.isDebug()) console.log("user.service / updateUserMutableProps / mobileBody : ",mobileBody);
    if(this.isDebug()) console.log("user.service / updateUserMutableProps / mobileTail : ",mobileTail);

    // POST
    let options = this.myRequest.getReqOptionCafeclassAPI(apiKey);
    let req_url = this.us.get(this.updateUserMutablesUrl);

    if(this.isDebug()) console.log("user.service / updateUser / req_url : ",req_url);

    let params = {
      email:email,
      name:name,
      nickname:nickname,
      gender:gender,
      birth_year:birthYear,
      birth_month:birthMonth,
      birth_day:birthDay,
      thumbnail:thumbnail,
      mobile_head:mobileHead,
      mobile_body:mobileBody,
      mobile_tail:mobileTail
    }

    return this.http.post(req_url, params, options)
                .toPromise()
                .then(this.myExtractor.extractData)
                .catch(this.myExtractor.handleError);
  }  


  updateUser (  apiKey:string, 
                userId:number, 
                email:string, 
                password:string, 
                name:string, 
                nickname:string, 
                gender:string,
                birthYear:string,
                birthMonth:string,
                birthDay:string,
                thumbnail:string,
                mobileHead:string,
                mobileBody:string,
                mobileTail:string): Promise<MyResponse> {

    if(this.isDebug()) console.log("user.service / updateUser / 시작");
    if(this.isDebug()) console.log("user.service / updateUser / apiKey : ",apiKey);
    if(this.isDebug()) console.log("user.service / updateUser / userId : ",userId);
    if(this.isDebug()) console.log("user.service / updateUser / email : ",email);
    if(this.isDebug()) console.log("user.service / updateUser / password : ",password);
    if(this.isDebug()) console.log("user.service / updateUser / name : ",name);
    if(this.isDebug()) console.log("user.service / updateUser / nickname : ",nickname);
    if(this.isDebug()) console.log("user.service / updateUser / gender : ",gender);
    if(this.isDebug()) console.log("user.service / updateUser / birthYear : ",birthYear);
    if(this.isDebug()) console.log("user.service / updateUser / birthMonth : ",birthMonth);
    if(this.isDebug()) console.log("user.service / updateUser / birthDay : ",birthDay);
    if(this.isDebug()) console.log("user.service / updateUser / thumbnail : ",thumbnail);
    if(this.isDebug()) console.log("user.service / updateUser / mobileHead : ",mobileHead);
    if(this.isDebug()) console.log("user.service / updateUser / mobileBody : ",mobileBody);
    if(this.isDebug()) console.log("user.service / updateUser / mobileTail : ",mobileTail);

    // POST
    let options = this.myRequest.getReqOptionCafeclassAPI(apiKey);
    let req_url = this.us.get(this.updateUserUrl);

    if(this.isDebug()) console.log("user.service / updateUser / req_url : ",req_url);

    let params = {
      user_id:userId,
      email:email,
      password:password,
      name:name,
      nickname:nickname,
      gender:gender,
      birth_year:birthYear,
      birth_month:birthMonth,
      birth_day:birthDay,
      thumbnail:thumbnail,
      mobile_head:mobileHead,
      mobile_body:mobileBody,
      mobile_tail:mobileTail
    }

    return this.http.post(req_url, params, options)
                .toPromise()
                .then(this.myExtractor.extractData)
                .catch(this.myExtractor.handleError);
  }

  addUser ( apiKey:string, 
            email:string, 
            password:string, 
            name:string, 
            nickname:string, 
            gender:string,
            birthYear:string,
            birthMonth:string,
            birthDay:string,
            thumbnail:string,
            mobileHead:string,
            mobileBody:string,
            mobileTail:string
          ): Promise<MyResponse> {

    if(this.isDebug()) console.log("user.service / addUser / 시작");
    if(this.isDebug()) console.log("user.service / addUser / apiKey : ",apiKey);
    if(this.isDebug()) console.log("user.service / addUser / email : ",email);
    if(this.isDebug()) console.log("user.service / addUser / password : ",password);
    if(this.isDebug()) console.log("user.service / addUser / name : ",name);
    if(this.isDebug()) console.log("user.service / addUser / nickname : ",nickname);
    if(this.isDebug()) console.log("user.service / addUser / gender : ",gender);
    if(this.isDebug()) console.log("user.service / addUser / birthYear : ",birthYear);
    if(this.isDebug()) console.log("user.service / addUser / birthMonth : ",birthMonth);
    if(this.isDebug()) console.log("user.service / addUser / birthDay : ",birthDay);
    if(this.isDebug()) console.log("user.service / addUser / thumbnail : ",thumbnail);
    if(this.isDebug()) console.log("user.service / addUser / mobileHead : ",mobileHead);
    if(this.isDebug()) console.log("user.service / addUser / mobileBody : ",mobileBody);
    if(this.isDebug()) console.log("user.service / addUser / mobileTail : ",mobileTail);

    // POST
    let options = this.myRequest.getReqOptionCafeclassAPI(apiKey);
    let req_url = this.us.get(this.addUserUrl);
    let params = {
      email:email,
      password:password,
      name:name,
      nickname:nickname,
      gender:gender,
      birth_year:birthYear,
      birth_month:birthMonth,
      birth_day:birthDay,
      thumbnail:thumbnail,
      mobile_head:mobileHead,
      mobile_body:mobileBody,
      mobile_tail:mobileTail
    }

    return this.http.post(req_url, params, options)
                .toPromise()
                .then(this.myExtractor.extractData)
                .catch(this.myExtractor.handleError);
  }

  public sendMailUserValidation(apiKey:string, userId:number, email:string) {

    if(this.isDebug()) console.log("user.service / sendMailUserValidation / 시작");
    if(this.isDebug()) console.log("user.service / sendMailUserValidation / apiKey : ",apiKey);
    if(this.isDebug()) console.log("user.service / sendMailUserValidation / userId : ",userId);
    if(this.isDebug()) console.log("user.service / sendMailUserValidation / email : ",email);

    // POST
    let options = this.myRequest.getReqOptionCafeclassAPI(apiKey);
    let req_url = this.us.get(this.sendMailUserValidationUrl);

    if(this.isDebug()) console.log("user.service / sendMailUserValidation / req_url : ",req_url);

    let params = {
      user_id:userId,
      email:email
    }

    return this.http.post(req_url, params, options)
                .toPromise()
                .then(this.myExtractor.extractData)
                .catch(this.myExtractor.handleError);
  }

  public confirmUserValidation(apiKey:string, key:string):Promise<MyResponse> {

    if(this.isDebug()) console.log("user.service / confirmUserValidation / 시작");
    if(this.isDebug()) console.log("user.service / confirmUserValidation / apiKey : ",apiKey);
    if(this.isDebug()) console.log("user.service / confirmUserValidation / key : ",key);

    // POST
    let options = this.myRequest.getReqOptionCafeclassAPI(apiKey);
    let req_url = this.us.get(this.confirmUserValidationUrl);

    if(this.isDebug()) console.log("user.service / confirmUserValidation / req_url : ",req_url);

    let params = {
      key:key
    }

    return this.http.post(req_url, params, options)
                .toPromise()
                .then(this.myExtractor.extractData)
                .catch(this.myExtractor.handleError);
  }

  public confirmUserKakao(apiKey:string, kakaoId:string):Promise<MyResponse> {

    if(this.isDebug()) console.log("user.service / confirmUserKakao / 시작");
    if(this.isDebug()) console.log("user.service / confirmUserKakao / apiKey : ",apiKey);
    if(this.isDebug()) console.log("user.service / confirmUserKakao / kakaoId : ",kakaoId);

    // POST
    let options = this.myRequest.getReqOptionCafeclassAPI(apiKey);
    let req_url = this.us.get(this.confirmUserKakaoUrl);

    if(this.isDebug()) console.log("user.service / confirmUserKakao / req_url : ",req_url);

    let params = {
      kakao_id:kakaoId
    }

    return this.http.post(req_url, params, options)
                .toPromise()
                .then(this.myExtractor.extractData)
                .catch(this.myExtractor.handleError);
  }

  public confirmUserFacebook(apiKey:string, facebookId:string):Promise<MyResponse> {

    if(this.isDebug()) console.log("user.service / confirmUserFacebook / 시작");
    if(this.isDebug()) console.log("user.service / confirmUserFacebook / apiKey : ",apiKey);
    if(this.isDebug()) console.log("user.service / confirmUserFacebook / facebookId : ",facebookId);

    // POST
    let options = this.myRequest.getReqOptionCafeclassAPI(apiKey);
    let req_url = this.us.get(this.confirmUserFacebookUrl);

    if(this.isDebug()) console.log("user.service / confirmUserFacebook / req_url : ",req_url);

    let params = {
      facebook_id:facebookId
    };

    return this.http.post(req_url, params, options)
                .toPromise()
                .then(this.myExtractor.extractData)
                .catch(this.myExtractor.handleError);
  }

  public confirmUserNaver(apiKey:string, naverId:string):Promise<MyResponse> {

    if(this.isDebug()) console.log("user.service / confirmUserNaver / 시작");
    if(this.isDebug()) console.log("user.service / confirmUserNaver / apiKey : ",apiKey);
    if(this.isDebug()) console.log("user.service / confirmUserNaver / naverId : ",naverId);

    // POST
    let options = this.myRequest.getReqOptionCafeclassAPI(apiKey);
    let req_url = this.us.get(this.confirmUserNaverUrl);

    if(this.isDebug()) console.log("user.service / confirmUserNaver / req_url : ",req_url);

    let params = {
      naver_id:naverId
    };

    return this.http.post(req_url, params, options)
                .toPromise()
                .then(this.myExtractor.extractData)
                .catch(this.myExtractor.handleError);
  }      

  public getUserCookie(apiKey:string):Promise<MyResponse> {
    
    if(this.isDebug()) console.log("user.service / getUserCookie / 시작");
    if(this.isDebug()) console.log("user.service / getUserCookie / apiKey : ",apiKey);

    // POST
    let options = this.myRequest.getReqOptionCafeclassAPI(apiKey);
    let req_url = this.us.get(this.getUserCookieUrl);

    if(this.isDebug()) console.log("user.service / getUserCookie / req_url : ",req_url);

    let params = {};

    return this.http.post(req_url, params, options)
                .toPromise()
                .then(this.myExtractor.extractData)
                .catch(this.myExtractor.handleError);
  } 

  public deleteUserCookie():Promise<MyResponse> {
    
    let req_url = this.us.get(this.logoutUrl);

    if(this.isDebug()) console.log("user.service / deleteUserCookie / 시작");
    if(this.isDebug()) console.log("user.service / deleteUserCookie / req_url : ",req_url);

    return this.http.get(req_url)
                .toPromise()
                .then(this.myExtractor.extractData)
                .catch(this.myExtractor.handleError);
  }   

  public confirmUserEmailPassword(apiKey:string, email:string, password:string):Promise<MyResponse> {
    
    if(this.isDebug()) console.log("user.service / confirmUserEmailPassword / 시작");
    if(this.isDebug()) console.log("user.service / confirmUserEmailPassword / apiKey : ",apiKey);

    // POST
    let options = this.myRequest.getReqOptionCafeclassAPI(apiKey);
    let req_url = this.us.get(this.confirmUserEmailPasswordUrl);

    if(this.isDebug()) console.log("user.service / confirmUserEmailPassword / req_url : ",req_url);

    let params = {
      email:email, 
      password:password
    };

    return this.http.post(req_url, params, options)
                .toPromise()
                .then(this.myExtractor.extractData)
                .catch(this.myExtractor.handleError);
  }

  public updatePassword(apiKey:string, email:string, password:string):Promise<MyResponse> {

    if(this.isDebug()) console.log("user.service / updatePassword / 시작");
    if(this.isDebug()) console.log("user.service / updatePassword / apiKey : ",apiKey);
    if(this.isDebug()) console.log("user.service / updatePassword / email : ",email);
    if(this.isDebug()) console.log("user.service / updatePassword / password : ",password);

    // POST
    let options = this.myRequest.getReqOptionCafeclassAPI(apiKey);
    let req_url = this.us.get(this.updatePasswordUrl);

    if(this.isDebug()) console.log("user.service / updatePassword / req_url : ",req_url);

    let params = {
      email:email, 
      password:password
    };

    return this.http.post(req_url, params, options)
                .toPromise()
                .then(this.myExtractor.extractData)
                .catch(this.myExtractor.handleError);

  } // end method
  
} // end class
