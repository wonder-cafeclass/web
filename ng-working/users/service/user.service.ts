import { Injectable }           from '@angular/core';
import { Headers, 
         Http, 
         Response, 
         RequestOptions }       from '@angular/http';
import { UrlService }           from "../../util/url.service";
import { User }                 from "../model/user";

@Injectable()
export class UserService {

  private getUserByEmailUrl = '/CI/index.php/api/users/email';
  private getUserByMobileUrl = '/CI/index.php/api/users/mobile';
  private addUserUrl = '/CI/index.php/api/users/add';

  // http://devcafeclass.co.uk/CI/index.php/api/users/email?q=wonder13662@gmail.com

  constructor(  private us:UrlService, 
                private http: Http) {}

  getUserByEmail (email:string): Promise<any> {

    let req_url = this.us.get(this.getUserByEmailUrl);
    req_url = `${ req_url }?q=${ email }`;

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("user.service / getUserByEmail / 시작");
    if(isDebug) console.log("user.service / getUserByEmail / email : ",email);
    if(isDebug) console.log("user.service / getUserByEmail / req_url : ",req_url);

    return this.http.get(req_url)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
  } 

  getUserByMobile (mobile:string): Promise<any> {

    let req_url = this.us.get(this.getUserByMobileUrl);
    req_url = `${ req_url }?q=${ mobile }`;

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("user.service / getUserByMobile / 시작");
    if(isDebug) console.log("user.service / getUserByMobile / mobile : ",mobile);
    if(isDebug) console.log("user.service / getUserByMobile / req_url : ",req_url);

    return this.http.get(req_url)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
  }   

  addUser ( email:string, 
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
          ): Promise<any> {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("user.service / addUser / 시작");
    if(isDebug) console.log("user.service / addUser / email : ",email);
    if(isDebug) console.log("user.service / addUser / password : ",password);
    if(isDebug) console.log("user.service / addUser / name : ",name);
    if(isDebug) console.log("user.service / addUser / nickname : ",nickname);
    if(isDebug) console.log("user.service / addUser / gender : ",gender);
    if(isDebug) console.log("user.service / addUser / birthYear : ",birthYear);
    if(isDebug) console.log("user.service / addUser / birthMonth : ",birthMonth);
    if(isDebug) console.log("user.service / addUser / birthDay : ",birthDay);
    if(isDebug) console.log("user.service / addUser / thumbnail : ",thumbnail);
    if(isDebug) console.log("user.service / addUser / mobileHead : ",mobileHead);
    if(isDebug) console.log("user.service / addUser / mobileBody : ",mobileBody);
    if(isDebug) console.log("user.service / addUser / mobileTail : ",mobileTail);

        // $output["mobile_head"] = $mobile_head;
        // $output["mobile_body"] = $mobile_body;
        // $output["mobile_tail"] = $mobile_tail;

    // POST
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });    

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
