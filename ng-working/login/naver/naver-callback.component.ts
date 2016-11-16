import {  Component, 
          Input, 
          Output,
          OnInit }              from '@angular/core';
import { Router }               from '@angular/router';
import { LoginService }         from '../service/login.service';

@Component({
  moduleId: module.id,
  selector: 'naver-callback',
  templateUrl: 'naver-callback.component.html',
  styleUrls: [ 'naver-callback.component.css' ]
})
export class NaverCallbackComponent implements OnInit {

  private code:string;
  private state:string;

  private isValidState:boolean=false;

  constructor(  public loginService: LoginService,
                public router: Router) {

    // Do something...
  } // end function

  ngOnInit(): void {

    if( null != this.router && 
        null != this.router.currentUrlTree && 
        null != this.router.currentUrlTree.queryParams &&
        null != this.router.currentUrlTree.queryParams.code &&
        null != this.router.currentUrlTree.queryParams.state ) {

      this.code = this.router.currentUrlTree.queryParams.code;
      this.state = this.router.currentUrlTree.queryParams.state;

    }

    this.getNaverState(this.state, this.code);

  } // end function

  private getNaverState(state:string, code:string) :void {

    if(null == state || "" == state) {
      return;
    }
    if(null == code || "" == code) {
      return;
    }

    this.loginService
    .getNaverState(state)
    .then(result => {

      if( null != result &&
          null != result.is_valid_state ) {

        this.isValidState = result.is_valid_state;
      }

      // Session에 저장된 state와 비교합니다.
      if(this.isValidState) {

        // 1. state가 정상적일 경우, 다음 단계를 진행
        console.log("login.component / getNaverStateUrl / result : ",result);

        this.getNaverAccess(code);

      } else {

        // 2. state가 다를 경우, 사용자에게 메시지 노출. '비정상적인 접근입니다.'. 메시지 확인 뒤, 로그인 홈으로 이동.
        // - 상황 정보를 로그로 남김. ex) '비정상 로그인 접근'
      }
    }); 
  }

  // @ Desc : Naver REST API에 접근하기 위한 접근 토큰(Access Token)을 받아옵니다. 
  private getNaverAccess(code:string) :void {

    console.log("naver-callback / getNaverAccess / 1 / code : ",code);

    if(null == code || "" == code) {
      return;
    }

    console.log("naver-callback / getNaverAccess / 2 / code : ",code);

    this.loginService
    .getNaverAccess(code)
    .then(result => {

      console.log("naver-callback / getNaverAccess / result : ",result);
      console.log("naver-callback / getNaverAccess / result.access_token : ",result.access_token);
      console.log("naver-callback / getNaverAccess / result.token_type : ",result.token_type);

      if( null != result && 
          null != result.access_token && 
          null != result.token_type ) {

        this.getNaverMe();

      } // end if
    }); // end method
  } // end method

  // @ Desc : Naver REST API로 회원정보를 가져옵니다.
  private getNaverMe() :void {


    this.loginService
    .getNaverMe()
    .then(result => {

      console.log("naver-callback / getNaverMe / result : ",result);

      /*
      if( null != result.data && 
          null != result.data.access_token && 
          null != result.data.token_type ) {

        this.getNaverMe(result.data.token_type, result.data.access_token);

      } // end if
      */
    }); // end method    


  }


} // end class