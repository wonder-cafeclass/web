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

  getTeacherFromUser (user:User): Teacher {

    if(null == user) {
      return null;
    }

    let newTeacher:Teacher = 
    new Teacher(
      // public id:number,
      -1,
      // public nickname:string,
      user.nickname,
      // public name:string,
      user.name,
      // public gender:string,
      user.gender,
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

  }


}