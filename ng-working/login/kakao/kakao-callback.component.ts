import {  Component, 
          Input, 
          Output,
          OnInit, 
          OnDestroy}            from '@angular/core';
import {  Subscription }        from 'rxjs';          
import {  Router,
          ActivatedRoute }      from '@angular/router';
import { LoginService }         from '../service/login.service';
import { MyLoggerService }      from '../../util/service/my-logger.service';
import { MyCheckerService }     from '../../util/service/my-checker.service';
import { UserService }          from '../../users/service/user.service';

@Component({
  moduleId: module.id,
  selector: 'kakao-callback',
  templateUrl: 'kakao-callback.component.html',
  styleUrls: [ 'kakao-callback.component.css' ]
})
export class KakaoCallbackComponent implements OnInit, OnDestroy {

  private code:string;

  private redirectUrl:string="/class-center";

  private kakaoSignupCodeAlreadyRegisterd: number=-102;

  private subscription: Subscription;

  constructor(  public loginService:LoginService,
                private userService:UserService,
                public myLoggerService:MyLoggerService,
                public myCheckerService:MyCheckerService,
                private activatedRoute:ActivatedRoute,
                public router:Router) {

    // Do something...
  } // end function

  ngOnInit(): void {

    // 페이지 진입을 기록으로 남깁니다.
    this.myLoggerService.logActionPage(this.myLoggerService.pageKeyLoginKakao);

    // 리다이렉트로 전달된 외부 쿼리 스트링 파라미터를 가져옵니다.
    this.subscription = this.activatedRoute.queryParams.subscribe(
      (param: any) => {

        this.code = param['code'];
        if(null != this.code && "" != this.code) {
          this.getKakaoToken(this.code);
        }
      }
    ); // end subscribe
    

  } // end function

  ngOnDestroy() {
    // prevent memory leak by unsubscribing
    this.subscription.unsubscribe();
  }  


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

      console.log("kakao-callback / getKakaoToken / result : ",result);

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

      console.log("kakao-callback / getKakaoSignUp / result : ",result);

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

      if( null == result || null == result.id ) {
        // 로그인 실패. 홈으로 리다이렉트
        this.router.navigate(['/class-center']);
        return;
      }

      // 카카오 플랫폼에서의 로그인 성공!

      // 카카오 아이디로 유저 정보를 가져옵니다.
      this.getUserByKakaoId(result.kakao_id);

      // 1. 최초 등록된 유저라면 유저 정보 등록 창으로 이동.
      // 2. 이미 등록된 유저라면 이전 페이지로 리다이렉트 합니다. 

      // 1. mobile, gender가 없다면 정상 등록된 유저가 아님. 회원 가입 창으로 이동.
      // this.router.navigate(['/login/signup/kakao', result.kakao_id]);


    }); // end service

  } // end method 

  private getUserByKakaoId(kakaoId:string) :void {

    this.userService
    .getUserByKakaoId(kakaoId)
    .then(result => {
      console.log("getUserByKakaoId / result : ",result);

      if(null == result || null == result.user) {

        // 카카오 로그인은 성공. 하지만 유저 정보가 없음.
        return;

      } else if(  null == result.user.gender || 
                  "" === result.user.gender || 
                  null == result.user.mobile || 
                  "" === result.user.mobile ) {

        // 카카오 로그인은 성공. 카카오 프로필에서 가져온 정보로 유저 등록됨. 
        // 하지만 추가 정보 필요. 
        // 회원 가입창으로 이동.
        this.router.navigate(['/login/signup/kakao', result.kakao_id]);
        return;
      } else {
        // 카카오 로그인 성공. 등록된 유저 정보가 문제 없음. 
        // 로그인이 성공했으므로, 서버에 해당 유저의 로그인 쿠키를 만들어야 함.

        // api key 필요!
        // confirmUserKakao
        this.myCheckerService
        .getReady()
        .then(() => {

          this.userService
          .confirmUserKakao(this.myCheckerService.getAPIKey(), result.kakao_id)
          .then(result => {

            if(null == result || null == result.success || !result.success) {
              // kakaoid로 쿠키 인증 실패. 홈으로 이동.
              this.router.navigate(['/class-center']);
              return;
            }

            // 쿠키 인증 성공!
            // 로그인 직전 페이지로 리다이렉트. 
            // 돌아갈 주소가 없다면, 홈으로 이동.
            this.router.navigate(['/class-center']);
            
          }); // end userService
          
        }); // end myCheckerService

      } // end if
    }); // end service

  }


} // end class