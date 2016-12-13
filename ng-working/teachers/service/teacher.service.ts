import { Injectable }                      from '@angular/core';
import { Headers, 
         Http, 
         Response, 
         RequestOptions }                  from '@angular/http';
import { UrlService }                      from "../../util/url.service";
import { MyExtractor }                     from '../../util/http/my-extractor';
import { MyRequest }                       from '../../util/http/my-request';
import { MyResponse }                      from '../../util/model/my-response';
import { Teacher }                         from "../model/teacher";
import { User }                            from "../../users/model/user";

@Injectable()
export class TeacherService {

  private getTeacherByEmailUrl = '/CI/index.php/api/teachers/email';
  private getTeacherByUserIdUrl = '/CI/index.php/api/teachers/userid';
  private insertTeacherUrl = '/CI/index.php/api/teachers/add';
  private updateTeacherUrl = '/CI/index.php/api/teachers/update';

  private myExtractor:MyExtractor;
  private myRequest:MyRequest;

  constructor(  private urlService:UrlService, 
                private http: Http) {
    this.myExtractor = new MyExtractor();
    this.myRequest = new MyRequest();
  }

  getTeacherByEmail (email:string): Promise<MyResponse> {

    // TODO 이메일로 사용자를 조회.
    // 개인 정보 유출 경로가 될 수 있으므로 POST 전송 및 API 키 사용 필요. 

    let req_url = this.urlService.get(this.getTeacherByEmailUrl);
    req_url = `${ req_url }?q=${ email }`;

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("teacher.service / getUserByEmail / 시작");
    if(isDebug) console.log("teacher.service / getUserByEmail / email : ",email);
    if(isDebug) console.log("teacher.service / getUserByEmail / req_url : ",req_url);

    return this.http.get(req_url)
                .toPromise()
                .then(this.myExtractor.extractData)
                .catch(this.myExtractor.handleError);
  }

  getTeacherByUser (user:User): Teacher {
    return null;
  }

  insertTeacherByTeacher(apiKey:string, teacher:Teacher): Promise<MyResponse> {

    let mobileArr:string[] = teacher.getMobileArr();
    let birthdayArr:string[] = teacher.getBirthdayArr();

    return this.insertTeacher(
      // apiKey:string, 
      apiKey,
      // userId:number,
      teacher.user_id,
      // email:string, 
      teacher.email,
      // name:string, 
      teacher.name,
      // nickname:string, 
      teacher.nickname,
      // resume:string, 
      teacher.resume,
      // greeting:string, 
      teacher.greeting,
      // gender:string,
      teacher.gender,
      // birthYear:string,
      birthdayArr[0],
      // birthMonth:string,
      birthdayArr[1],
      // birthDay:string,
      birthdayArr[2],
      // thumbnail:string,
      teacher.thumbnail,
      // mobileHead:string,
      mobileArr[0],
      // mobileBody:string,
      mobileArr[1],
      // mobileTail:string
      mobileArr[2]
    );
  }  

  insertTeacher (
    apiKey:string, 
    userId:number,
    email:string,
    name:string, 
    nickname:string, 
    resume:string, 
    greeting:string, 
    gender:string,
    birthYear:string,
    birthMonth:string,
    birthDay:string,
    thumbnail:string,
    mobileHead:string,
    mobileBody:string,
    mobileTail:string): Promise<MyResponse> {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("teacher.service / insertTeacher / 시작");
    if(isDebug) console.log("teacher.service / insertTeacher / apiKey : ",apiKey);
    if(isDebug) console.log("teacher.service / insertTeacher / userId : ",userId);
    if(isDebug) console.log("teacher.service / insertTeacher / email : ",email);
    if(isDebug) console.log("teacher.service / insertTeacher / name : ",name);
    if(isDebug) console.log("teacher.service / insertTeacher / nickname : ",nickname);
    if(isDebug) console.log("teacher.service / insertTeacher / resume : ",resume);
    if(isDebug) console.log("teacher.service / insertTeacher / greeting : ",greeting);
    if(isDebug) console.log("teacher.service / insertTeacher / gender : ",gender);
    if(isDebug) console.log("teacher.service / insertTeacher / birthYear : ",birthYear);
    if(isDebug) console.log("teacher.service / insertTeacher / birthMonth : ",birthMonth);
    if(isDebug) console.log("teacher.service / insertTeacher / birthDay : ",birthDay);
    if(isDebug) console.log("teacher.service / insertTeacher / thumbnail : ",thumbnail);
    if(isDebug) console.log("teacher.service / insertTeacher / mobileHead : ",mobileHead);
    if(isDebug) console.log("teacher.service / insertTeacher / mobileBody : ",mobileBody);
    if(isDebug) console.log("teacher.service / insertTeacher / mobileTail : ",mobileTail);

    // POST
    let options = this.myRequest.getReqOptionCafeclassAPI(apiKey);
    let req_url = this.urlService.get(this.insertTeacherUrl);

    if(isDebug) console.log("teacher.service / insertTeacher / req_url : ",req_url);

    let params = {
      user_id:userId,
      email:email,
      name:name,
      nickname:nickname,
      resume:resume,
      greeting:greeting,
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
  } // end method 




  updateTeacherByTeacher(apiKey:string, teacher:Teacher): Promise<MyResponse> {

    let mobileArr:string[] = teacher.getMobileArr();
    let birthdayArr:string[] = teacher.getBirthdayArr();

    return this.updateTeacher(
      // apiKey:string, 
      apiKey,
      // userId:number,
      teacher.user_id,
      // email:string, 
      teacher.email,
      // name:string, 
      teacher.name,
      // nickname:string, 
      teacher.nickname,
      // resume:string, 
      teacher.resume,
      // greeting:string, 
      teacher.greeting,
      // gender:string,
      teacher.gender,
      // birthYear:string,
      birthdayArr[0],
      // birthMonth:string,
      birthdayArr[1],
      // birthDay:string,
      birthdayArr[2],
      // thumbnail:string,
      teacher.thumbnail,
      // mobileHead:string,
      mobileArr[0],
      // mobileBody:string,
      mobileArr[1],
      // mobileTail:string
      mobileArr[2]
    );
  } 

  updateTeacher (
    apiKey:string, 
    userId:number,
    email:string,
    name:string, 
    nickname:string, 
    resume:string, 
    greeting:string, 
    gender:string,
    birthYear:string,
    birthMonth:string,
    birthDay:string,
    thumbnail:string,
    mobileHead:string,
    mobileBody:string,
    mobileTail:string): Promise<MyResponse> {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("teacher.service / updateTeacher / 시작");
    if(isDebug) console.log("teacher.service / updateTeacher / apiKey : ",apiKey);
    if(isDebug) console.log("teacher.service / updateTeacher / userId : ",userId);
    if(isDebug) console.log("teacher.service / updateTeacher / email : ",email);
    if(isDebug) console.log("teacher.service / updateTeacher / name : ",name);
    if(isDebug) console.log("teacher.service / updateTeacher / nickname : ",nickname);
    if(isDebug) console.log("teacher.service / updateTeacher / resume : ",resume);
    if(isDebug) console.log("teacher.service / updateTeacher / greeting : ",greeting);
    if(isDebug) console.log("teacher.service / updateTeacher / gender : ",gender);
    if(isDebug) console.log("teacher.service / updateTeacher / birthYear : ",birthYear);
    if(isDebug) console.log("teacher.service / updateTeacher / birthMonth : ",birthMonth);
    if(isDebug) console.log("teacher.service / updateTeacher / birthDay : ",birthDay);
    if(isDebug) console.log("teacher.service / updateTeacher / thumbnail : ",thumbnail);
    if(isDebug) console.log("teacher.service / updateTeacher / mobileHead : ",mobileHead);
    if(isDebug) console.log("teacher.service / updateTeacher / mobileBody : ",mobileBody);
    if(isDebug) console.log("teacher.service / updateTeacher / mobileTail : ",mobileTail);

    // POST
    let options = this.myRequest.getReqOptionCafeclassAPI(apiKey);
    let req_url = this.urlService.get(this.updateTeacherUrl);

    if(isDebug) console.log("teacher.service / updateTeacher / req_url : ",req_url);

    let params = {
      user_id:userId,
      email:email,
      name:name,
      nickname:nickname,
      resume:resume,
      greeting:greeting,
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
  } // end method 

  getTeacher(apiKey:string, userId:number): Promise<MyResponse> {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("teacher.service / getTeacher / 시작");
    if(isDebug) console.log("teacher.service / getTeacher / userId : ",userId);

    // POST
    let options = this.myRequest.getReqOptionCafeclassAPI(apiKey);
    let req_url = this.urlService.get(this.getTeacherByUserIdUrl);

    if(isDebug) console.log("teacher.service / getTeacher / req_url : ",req_url);

    let params = {
      user_id:userId
    }

    return this.http.post(req_url, params, options)
                .toPromise()
                .then(this.myExtractor.extractData)
                .catch(this.myExtractor.handleError);

  }

  getTeacherFromUser (user:User): Teacher {

    if(null == user) {
      return null;
    }

    let newTeacher:Teacher = 
    new Teacher(
      // public id:number,
      -1,
      // public user_id:number,
      +user.id,
      // public nickname:string,
      user.nickname,
      // public name:string,
      user.name,
      // public gender:string,
      user.gender,
      // public resume:string,
      "",
      // public greeting:string,
      "",
      // public birthday:string, 
      user.birthday,
      // public thumbnail:string,
      user.thumbnail,
      // public status:string,
      "",
      // public permission:string,
      "",
      // public mobile:string,
      user.mobile,
      // public email:string,
      user.email,
      // public date_created:string,
      "",
      // public date_updated:string
      ""
    );

    return newTeacher;

  } // end method

  getTeacherFromJSON (jsonObj): Teacher {

    if(null == jsonObj) {
      return null;
    }

    let newTeacher:Teacher = 
    new Teacher(
      // public id:number,
      jsonObj.id,
      // public user_id:number,
      +jsonObj.user_id,
      // public nickname:string,
      jsonObj.nickname,
      // public name:string,
      jsonObj.name,
      // public gender:string,
      jsonObj.gender,
      // public resume:string,
      jsonObj.resume,
      // public greeting:string,
      jsonObj.greeting,
      // public birthday:string, 
      jsonObj.birthday,
      // public thumbnail:string,
      jsonObj.thumbnail,
      // public status:string,
      jsonObj.status,
      // public permission:string,
      jsonObj.permission,
      // public mobile:string,
      jsonObj.mobile,
      // public email:string,
      jsonObj.email,
      // public date_created:string,
      jsonObj.date_created,
      // public date_updated:string
      jsonObj.date_updated
    );

    return newTeacher;    

  }
  
}