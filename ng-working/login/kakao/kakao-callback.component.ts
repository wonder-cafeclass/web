import {  Component, 
          Input, 
          Output,
          OnInit }              from '@angular/core';
import { Router }               from '@angular/router';
import { LoginService }         from '../service/login.service';
import { MyLoggerService }      from '../../util/service/my-logger.service';

@Component({
  moduleId: module.id,
  selector: 'kakao-callback',
  templateUrl: 'kakao-callback.component.html',
  styleUrls: [ 'kakao-callback.component.css' ]
})
export class KakaoCallbackComponent implements OnInit {

  private code:string;

  private kakaoSignupCodeAlreadyRegisterd: number=-102;

  constructor(  public loginService: LoginService,
                public myLoggerService:MyLoggerService,
                public router: Router) {

    // Do something...
  } // end function

  ngOnInit(): void {

    // 페이지 진입을 기록으로 남깁니다.
    this.myLoggerService.logActionPage(this.myLoggerService.pageKeyLoginKakao);

    if( null != this.router && 
        null != this.router.currentUrlTree && 
        null != this.router.currentUrlTree.queryParams &&
        null != this.router.currentUrlTree.queryParams.code ) {

      this.code = this.router.currentUrlTree.queryParams.code;

    }

    if(null != this.code && "" != this.code) {
      this.getKakaoToken(this.code);
    }

  } // end function

  // KAKAO
  // 카카오 로그인 토큰을 가져옵니다.
  private getKakaoToken(kakaoCode:string) :void{

    if(null == kakaoCode || "" == kakaoCode) {
      console.log("!Error! / login.compoenet / ");
      return;
    }

    this.loginService
    .getKakaoToken(kakaoCode)
    .then(result => {
      // this.kakaoToken = kakaoToken;

      console.log("login.component / getKakaoToken / result : ",result);

      if( null != result && 
          null != result.access_token && 
          null != result.token_type) {

        result.access_token;
        result.token_type;

        // 유저 앱등록을 진행합니다.
        this.getKakaoSignUp(result.token_type, result.access_token);
      }
    });
  }

  // 유저를 카카오 앱 - cafeclass에 등록합니다. 이미 등록되어 있다면 재등록되지 않습니다.
  private getKakaoSignUp(kakaoTokenType:string, kakaoAccessToken:string) :void {

    this.loginService
    .getKakaoSignUp(kakaoTokenType, kakaoAccessToken)
    .then(result => {
      // this.kakaoToken = kakaoToken;

      console.log("login.component / getKakaoSignUp / result : ",result);

      if( null != result && 
          null != result.code && 
          null != result.msg) {

        let code:number = result.code;
        let msg:string = result.msg;

        if(this.kakaoSignupCodeAlreadyRegisterd === code) {
          // 유저 정보를 가져옵니다.
          this.getKakaoMe(kakaoTokenType, kakaoAccessToken);
        }
      }
    });
  } 

  private getKakaoMe(kakaoTokenType:string, kakaoAccessToken:string) :void {

    this.loginService
    .getKakaoMe(kakaoTokenType, kakaoAccessToken)
    .then(result => {
      // this.kakaoToken = kakaoToken;

      console.log("login.component / getKakaoMe / result : ",result);

      if( null != result && 
          null != result.id) {

        // 로그인이 성공하였습니다.

        // 1. 최초 등록된 유저라면 유저 정보 등록 창으로 이동.
        // 2. 이미 등록된 유저라면 이전 페이지로 리다이렉트 합니다. 

      }

    });
  }   

} // end class