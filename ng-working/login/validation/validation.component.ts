import 'rxjs/add/operator/switchMap';
import {  Subscription }        from 'rxjs';
import {  Observable }          from 'rxjs/Observable';
import {  Component, 
          Input, 
          Output,
          ViewChild,
          OnInit }              from '@angular/core';
import {  Router,
          ActivatedRoute,
          Params }              from '@angular/router';

import { LoginService }         from '../service/login.service';
import { UserService }          from '../../users/service/user.service';

import { MyLoggerService }      from '../../util/service/my-logger.service';
import { MyCheckerService }     from '../../util/service/my-checker.service';
import { MyEventService }       from '../../util/service/my-event.service';
import { MyEvent }              from '../../util/model/my-event';

import { User }                 from '../../users/model/user';

@Component({
  moduleId: module.id,
  selector: 'validation',
  templateUrl: 'validation.component.html',
  styleUrls: [ 'validation.component.css' ]
})
export class ValidationComponent implements OnInit {

  private key:string;

  msgTop:string="";
  msgBottom:string="";
  msgGuide:string="등록하신 메일 주소로 보내드린 회원인증링크를 클릭해주세요.";
  msgWarning:string="경고! 정상적이지 않은 접근입니다.";
  msgConfirmed:string="축하합니다! 정상적으로 회원 등록이 완료되었습니다.";
  msgRedirect:string="잠시 뒤에 홈화면으로 이동합니다.";

  constructor(  private loginService: LoginService, 
                private userService:UserService,
                private myLoggerService: MyLoggerService,
                public myCheckerService:MyCheckerService,
                private myEventService:MyEventService,
                private route: ActivatedRoute,
                public router: Router) {

    // 서버에서 파라미터를 검증할 check 데이터를 받아옵니다.
    // 데이터를 받아온 이후에 처리를 진행합니다.
    this.myCheckerService.getReady().then(() => {
      this.getUserValidation();
      return Promise.resolve();
    });
  }

  getUserValidation(): void {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("validation / getUserValidation / init");

    // 외부 쿼리 스트링 파라미터를 가져옵니다.
    this.route.queryParams.switchMap((params: Params) => {

      if(isDebug) console.log("validation / getUserValidation / switchMap / params : ",params);

      let key:string = "";
      if(null != params['key']) {
        // 받은 파라미터로 async 데이터를 가져온다.
        key = params['key'];
      }

      if(isDebug) console.log("validation / getUserValidation / switchMap / key : ",key);

      if(null != key && "" != key) {
        return this.userService.confirmUserValidation(this.myCheckerService.getAPIKey(),key);
      }

      // @ Referer : http://stackoverflow.com/questions/35758209/typeerror-cannot-read-property-then-of-undefined
      return Promise.resolve(); 

    }).subscribe((result) => {

      // async 데이터 결과를 여기서 처리.
      if(isDebug) console.log("validation / getUserValidation / subscribe / result : ",result);

      // 등록이 완료되었는지 확인.

      if(null == result) {
        console.log("1. 회원 정보를 등록하고 바로 이동한 경우.");
        this.msgTop = this.msgGuide;
      } else if(null != result && null != result.is_confirmed) {

        if(result.is_confirmed) {
          console.log("2. 인증 변경 완료후에는 사용자에게 완료 팝업을 노출.");
          this.msgTop = this.msgConfirmed;
          this.msgBottom = this.msgRedirect;

          // 3초 뒤에 홈으로 이동.
          var _self = this;
          setTimeout(function () {
              // 메시지를 3초 뒤에 화면에서 지웁니다.
              _self.router.navigate(['/class-center']);
          }, 3000);

        } else if(result.is_attack) {
          console.log("3. 정상적이지 않은 접근.");
          this.msgTop = this.msgWarning;
          this.msgBottom = this.msgRedirect;

          // 3초 뒤에 홈으로 이동.
          var _self = this;
          setTimeout(function () {
              // 메시지를 3초 뒤에 화면에서 지웁니다.
              _self.router.navigate(['/class-center']);
          }, 3000);

        } else {
          // TODO - 3. 인증 변경 실패에는 사용자에게 실패 팝업 및 문의 할수 있는 이메일/전화번호등을 노출함.
          console.log("3. 인증 변경 실패에는 사용자에게 실패 팝업 및 문의 할수 있는 이메일/전화번호등을 노출함.");
          this.msgTop = this.msgGuide;
          
        } // end if
      } // end if

      return Promise.resolve();

    }); // end subscribe

  } // end method

  ngOnInit(): void {}

}
