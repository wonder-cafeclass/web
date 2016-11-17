import {  Component, 
          Input, 
          Output,
          OnInit }              from '@angular/core';
import { Router }               from '@angular/router';
import { LoginService }         from '../service/login.service';
import { MyLoggerService }      from '../../util/service/my-logger.service';

@Component({
  moduleId: module.id,
  selector: 'facebook-callback',
  templateUrl: 'facebook-callback.component.html',
  styleUrls: [ 'facebook-callback.component.css' ]
})
export class FacebookCallbackComponent implements OnInit {

  private code:string;
  private state:string;

  private isValidState:boolean=false;

  constructor(  public loginService: LoginService,
                public myLoggerService:MyLoggerService,
                public router: Router) {

    // Do something...
  } // end function

  ngOnInit(): void {

    // 페이지 진입을 기록으로 남깁니다.
    this.myLoggerService.logActionPage(this.myLoggerService.pageKeyLoginFacebook);

    if( null != this.router && 
        null != this.router.currentUrlTree && 
        null != this.router.currentUrlTree.queryParams &&
        null != this.router.currentUrlTree.queryParams.code &&
        null != this.router.currentUrlTree.queryParams.state ) {

      this.code = this.router.currentUrlTree.queryParams.code;
      this.state = this.router.currentUrlTree.queryParams.state;

    }

    this.getState(this.state, this.code);

  } // end function

  private getState(state:string, code:string) :void {

    if(null == state || "" == state) {
      return;
    }
    if(null == code || "" == code) {
      return;
    }

    this.loginService
    .getFacebookState(state)
    .then(result => {

      if( null != result &&
          null != result.is_valid_state ) {

        this.isValidState = result.is_valid_state;
      }

      // Session에 저장된 state와 비교합니다.
      if(this.isValidState) {

        // 1. state가 정상적일 경우, 다음 단계를 진행
        console.log("login.component / getFacebookState / result : ",result);

        this.getAccessToken(code);

      } else {

        // 2. state가 다를 경우, 사용자에게 메시지 노출. '비정상적인 접근입니다.'. 메시지 확인 뒤, 로그인 홈으로 이동.
        // - 상황 정보를 로그로 남김. ex) '비정상 로그인 접근'
      }
    }); 

  } // end function

  private getAccessToken(code:string) :void {

    this.loginService
    .getFacebookAccess(code)
    .then(result => {

      console.log("login.component / getFacebookAccess / result : ",result);

      if( null != result && null != result.access_token ) {
        this.getMe();
      }

    });     

  }

  private getMe() :void {
    this.loginService
    .getFacebookMe()
    .then(result => {

      console.log("login.component / getFacebookMe / result : ",result);

    });     

  }

} // end class