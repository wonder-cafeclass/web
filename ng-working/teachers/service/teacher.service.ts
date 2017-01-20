import { Injectable }                      from '@angular/core';
import { Headers, 
         Http, 
         Response, 
         RequestOptions }                  from '@angular/http';
import { UrlService }                      from "../../util/url.service";
import { MyExtractor }                     from '../../util/http/my-extractor';
import { MyRequest }                       from '../../util/http/my-request';
import { MyResponse }                      from '../../util/model/my-response';
import { MyEventWatchTowerService }        from '../../util/service/my-event-watchtower.service';
import { Teacher }                         from "../model/teacher";
import { User }                            from "../../users/model/user";

@Injectable()
export class TeacherService {

  // 선생님의 수업 리뷰 가져오기
  private fetchKlassReviewByTeacherUrl = '/CI/index.php/api/klass/fetchklassreviewbyteacher';
  
  // 학생 출석 상태 바꾸기
  private updateAttendanceUrl = '/CI/index.php/api/klass/updateattendance';
  // 활동중인 수업만 가져오기
  private fetchActiveKlassListUrl = '/CI/index.php/api/klass/fetchactiveklasslistbyteacher';
  // 모든 수업 가져오기
  private fetchAllKlassListUrl = '/CI/index.php/api/klass/fetchallklassnlistbyteacher';

  private getTeacherByMobileUrl = '/CI/index.php/api/teachers/mobile';
  private getTeacherByEmailUrl = '/CI/index.php/api/teachers/email';
  private getTeacherByUserIdUrl = '/CI/index.php/api/teachers/userid';
  private insertTeacherUrl = '/CI/index.php/api/teachers/add';
  private updateTeacherUrl = '/CI/index.php/api/teachers/update';

  private myExtractor:MyExtractor;
  private myRequest:MyRequest;

  private watchTower:MyEventWatchTowerService;

  constructor(  private urlService:UrlService, 
                private http: Http) {
    this.myExtractor = new MyExtractor();
    this.myRequest = new MyRequest();
  }

  fetchKlassReviewByTeacher (
    apiKey:string,
    loginUserId:number,
    teacherId:number,
    klassId:number,
    pageNum:number,
    pageRowCnt:number ): Promise<MyResponse> {

    if(this.isDebug()) console.log("user.service / updateAttendance / 시작");
    if(this.isDebug()) console.log("user.service / updateAttendance / apiKey : ",apiKey);
    if(this.isDebug()) console.log("user.service / updateAttendance / loginUserId : ",loginUserId);
    if(this.isDebug()) console.log("user.service / updateAttendance / teacherId : ",teacherId);
    if(this.isDebug()) console.log("user.service / updateAttendance / klassId : ",klassId);
    if(this.isDebug()) console.log("user.service / updateAttendance / pageNum : ",pageNum);
    if(this.isDebug()) console.log("user.service / updateAttendance / pageRowCnt : ",pageRowCnt);

    // POST
    let options = this.myRequest.getReqOptionCafeclassAPI(apiKey);
    let req_url = this.urlService.get(this.fetchKlassReviewByTeacherUrl);
    let params = {
      login_user_id:loginUserId,
      teacher_id:teacherId,
      klass_id:klassId,
      page_num:pageNum,
      page_row_cnt:pageRowCnt
    }

    return this.http.post(req_url, params, options)
                .toPromise()
                .then(this.myExtractor.extractData)
                .catch(this.myExtractor.handleError);    

  } // end method  

  updateAttendance (
    apiKey:string,
    loginUserId:number,
    attedanceId:number,
    klassId:number,
    userId:number,
    klassAttendanceStatus:string ): Promise<MyResponse> {

    if(this.isDebug()) console.log("user.service / updateAttendance / 시작");
    if(this.isDebug()) console.log("user.service / updateAttendance / apiKey : ",apiKey);
    if(this.isDebug()) console.log("user.service / updateAttendance / loginUserId : ",loginUserId);
    if(this.isDebug()) console.log("user.service / updateAttendance / attedanceId : ",attedanceId);
    if(this.isDebug()) console.log("user.service / updateAttendance / klassId : ",klassId);
    if(this.isDebug()) console.log("user.service / updateAttendance / userId : ",userId);
    if(this.isDebug()) console.log("user.service / updateAttendance / klassAttendanceStatus : ",klassAttendanceStatus);

    // POST
    let options = this.myRequest.getReqOptionCafeclassAPI(apiKey);
    let req_url = this.urlService.get(this.updateAttendanceUrl);
    let params = {
      login_user_id:loginUserId,
      klass_attendance_id:attedanceId,
      klass_id:klassId,
      user_id:userId,
      klass_attendance_status:klassAttendanceStatus
    }

    return this.http.post(req_url, params, options)
                .toPromise()
                .then(this.myExtractor.extractData)
                .catch(this.myExtractor.handleError);    

  } // end method    

  fetchActiveKlassList (
    apiKey:string,
    pageNum:number,
    pageRowCnt:number,
    teacherId:number ): Promise<MyResponse> {

    if(this.isDebug()) console.log("user.service / fetchActiveKlassListUrl / 시작");
    if(this.isDebug()) console.log("user.service / fetchActiveKlassListUrl / apiKey : ",apiKey);
    if(this.isDebug()) console.log("user.service / fetchActiveKlassListUrl / pageNum : ",pageNum);
    if(this.isDebug()) console.log("user.service / fetchActiveKlassListUrl / pageRowCnt : ",pageRowCnt);
    if(this.isDebug()) console.log("user.service / fetchActiveKlassListUrl / teacherId : ",teacherId);

    // POST
    let options = this.myRequest.getReqOptionCafeclassAPI(apiKey);
    let req_url = this.urlService.get(this.fetchActiveKlassListUrl);
    let params = {
      page_num:pageNum,
      pageRowCnt:pageRowCnt,
      teacher_id:teacherId
    }

    return this.http.post(req_url, params, options)
                .toPromise()
                .then(this.myExtractor.extractData)
                .catch(this.myExtractor.handleError);    

  } // end method   

  fetchAllKlassList (
    apiKey:string,
    pageNum:number,
    pageRowCnt:number,
    teacherId:number ): Promise<MyResponse> {

    if(this.isDebug()) console.log("user.service / fetchAllKlassList / 시작");
    if(this.isDebug()) console.log("user.service / fetchAllKlassList / apiKey : ",apiKey);
    if(this.isDebug()) console.log("user.service / fetchAllKlassList / pageNum : ",pageNum);
    if(this.isDebug()) console.log("user.service / fetchAllKlassList / pageRowCnt : ",pageRowCnt);
    if(this.isDebug()) console.log("user.service / fetchAllKlassList / teacherId : ",teacherId);

    // POST
    let options = this.myRequest.getReqOptionCafeclassAPI(apiKey);
    let req_url = this.urlService.get(this.fetchAllKlassListUrl);
    let params = {
      page_num:pageNum,
      pageRowCnt:pageRowCnt,
      teacher_id:teacherId
    }

    return this.http.post(req_url, params, options)
                .toPromise()
                .then(this.myExtractor.extractData)
                .catch(this.myExtractor.handleError);    

  } // end method  
  
  insertTeacherByTeacher(apiKey:string, teacher:Teacher): Promise<MyResponse> {

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
      teacher.getBirthYear(),
      // birthMonth:string,
      teacher.getBirthMonth(),
      // birthDay:string,
      teacher.getBirthDay(),
      // thumbnail:string,
      teacher.thumbnail,
      // mobileHead:string,
      teacher.getMobileHead(),
      // mobileBody:string,
      teacher.getMobileBody(),
      // mobileTail:string
      teacher.getMobileTail()
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

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
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

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("teacher.service / updateTeacher / 시작");
    if(isDebug) console.log("teacher.service / updateTeacher / apiKey : ",apiKey);
    if(isDebug) console.log("teacher.service / updateTeacher / userId : ",userId);
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

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
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

  getTeacherByMobile( apiKey:string, 
                      mobileHead:string,
                      mobileBody:string,
                      mobileTail:string ): Promise<MyResponse> {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("teacher.service / getTeacherByMobile / 시작");
    if(isDebug) console.log("teacher.service / getTeacherByMobile / mobileHead : ",mobileHead);
    if(isDebug) console.log("teacher.service / getTeacherByMobile / mobileBody : ",mobileBody);
    if(isDebug) console.log("teacher.service / getTeacherByMobile / mobileTail : ",mobileTail);

    // POST
    let options = this.myRequest.getReqOptionCafeclassAPI(apiKey);
    let req_url = this.urlService.get(this.getTeacherByMobileUrl);

    if(isDebug) console.log("teacher.service / getTeacherByMobile / req_url : ",req_url);

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

  getTeacherByEmail (apiKey:string, email:string): Promise<MyResponse> {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("teacher.service / getUserByEmail / 시작");
    if(isDebug) console.log("teacher.service / getUserByEmail / email : ",email);    

    // POST
    let options = this.myRequest.getReqOptionCafeclassAPI(apiKey);
    let req_url = this.urlService.get(this.getTeacherByEmailUrl);

    if(isDebug) console.log("teacher.service / getUserByEmail / req_url : ",req_url);

    let params = {
      email:email
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
    new Teacher().set(
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

    return new Teacher().setJSON(jsonObj);
  }




  // @ Common

  setWatchTower(watchTower:MyEventWatchTowerService):void {
    this.watchTower = watchTower;
  }

  private isDebug():boolean {
    if(null == this.watchTower) {
      return false;
    }

    return this.watchTower.isDebug();
  }  
  
}