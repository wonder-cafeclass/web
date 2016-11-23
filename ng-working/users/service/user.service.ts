import { Injectable } from '@angular/core';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import { UrlService } from "../../util/url.service";
import { User } from "../model/user";

@Injectable()
export class UserService {

  private getUserByEmailUrl = '/CI/index.php/api/users/email';

  // http://devcafeclass.co.uk/CI/index.php/api/users/email?q=wonder13662@gmail.com

  constructor(private us:UrlService, private http: Http) {
  }

  getUserByEmail (email:string): Promise<any> {

    let req_url = this.us.get(this.getUserByEmailUrl);
    req_url = `${ req_url }?q=${ email }`;

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("user.service / getUserByEmail / 시작");
    if(isDebug) console.log("user.service / getUserByEmail / email : ",email);
    if(isDebug) console.log("user.service / getUserByEmail / req_url : ",req_url);

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
