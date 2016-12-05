import {  Component, 
          Input, 
          Output,
          OnInit, 
          OnDestroy}                  from '@angular/core';
import {  Subscription }              from 'rxjs';          
import {  Router,
          ActivatedRoute }            from '@angular/router';

import { LoginService }               from '../service/login.service';
import { MyLoggerService }            from '../../util/service/my-logger.service';
import { MyCheckerService }           from '../../util/service/my-checker.service';
import { UserService }                from '../../users/service/user.service';

import { MyEventWatchTowerService }   from '../../util/service/my-event-watchtower.service';

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

  private apiKey:string;
  isAdmin:boolean=false;
  errorMsgArr: string[]=[];

  constructor(  public loginService:LoginService,
                private myEventWatchTowerService:MyEventWatchTowerService,
                private userService:UserService,
                private myLoggerService:MyLoggerService,
                public myCheckerService:MyCheckerService,
                private activatedRoute:ActivatedRoute,
                public router:Router) {

    // Do something...
  } // end function

  ngOnInit(): void {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("kakao-callback / ngOnInit / 시작");

    // 운영 서버인지 서비스 서버인지 판단하는 플래그값 가져옴.
    this.setIsAdmin();

    // my-checker.service의 apikey 가져옴. 
    this.setMyCheckerReady();

  } // end function

  ngOnDestroy() {
    // prevent memory leak by unsubscribing
    this.subscription.unsubscribe();
  }

  private setIsAdmin() :void {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("kakao-callback / setIsAdmin / 시작");

    // 운영 서버인지 서비스 서버인지 판단하는 플래그값 가져옴.
    this.myEventWatchTowerService.isAdmin$.subscribe(
      (isAdmin:boolean) => {

      if(isDebug) console.log("kakao-callback / setIsAdmin / isAdmin : ",isAdmin);
      this.isAdmin = isAdmin;
    });
  }  

  private setMyCheckerReady() :void {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("kakao-callback / setMyCheckerReady / 시작");

    this.myEventWatchTowerService.myCheckerServiceReady$.subscribe(
      (isReady:boolean) => {

      if(isDebug) console.log("kakao-callback / setMyCheckerReady / isReady : ",isReady);

      if(!isReady) {
        return;
      }

      this.myCheckerService.setReady(
        // checkerMap:any
        this.myEventWatchTowerService.getCheckerMap(),
        // constMap:any
        this.myEventWatchTowerService.getConstMap(),
        // dirtyWordList:any
        this.myEventWatchTowerService.getDirtyWordList(),
        // apiKey:string
        this.myEventWatchTowerService.getApiKey()
      ); // end setReady


      this.init();
    });    
  }

  private init(): void {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("kakao-callback / init / 시작");

    // 페이지 진입을 기록으로 남깁니다.
    this.logActionPage();

    // 리다이렉트로 전달된 외부 쿼리 스트링 파라미터를 가져옵니다.
    this.getQueryString();

  } // end init

  private logActionPage() :void {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("kakao-callback / logActionPage / 시작");

    // 페이지 진입을 기록으로 남깁니다.
    this.myLoggerService.logActionPage(
      // apiKey:string
      this.myEventWatchTowerService.getApiKey(),
      // pageType:string
      this.myLoggerService.pageTypeLoginKakao
    ).then(result => {
      // 로그 등록 결과를 확인해볼 수 있습니다.
      if(isDebug) console.log("kakao-callback / logActionPage / result : ",result);
    })
  }  

  private getQueryString() :void {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("kakao-callback / getQueryString / 시작");

    // 리다이렉트로 전달된 외부 쿼리 스트링 파라미터를 가져옵니다.
    this.subscription = this.activatedRoute.queryParams.subscribe(
      (param: any) => {

        if(isDebug) console.log("kakao-callback / getQueryString / param : ",param);

        this.code = param['code'];
        if(null != this.code && "" != this.code) {
          if(isDebug) console.log("kakao-callback / getQueryString / this.code : ",this.code);
          this.getKakaoToken(this.code);
        }
      }
    ); // end subscribe
  }

  // KAKAO
  // 카카오 로그인 토큰을 가져옵니다.
  private getKakaoToken(kakaoCode:string) :void{

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("kakao-callback / getKakaoToken / 시작");
    if(isDebug) console.log("kakao-callback / getKakaoToken / kakaoCode : ",kakaoCode);

    if(null == kakaoCode || "" == kakaoCode) {
      if(isDebug) console.log("kakao-callback / getKakaoToken / 중단 / kakaoCode is not valid!");
      // TODO - 에러 로그 등록
      return;
    }

    this.loginService
    .getKakaoToken(kakaoCode)
    .then(result => {

      if(isDebug) console.log("kakao-callback / getKakaoToken / result : ",result);

      if( null != result && 
          null != result.access_token && 
          null != result.token_type) {

        if(isDebug) console.log("kakao-callback / getKakaoToken / result.access_token : ",result.access_token);
        if(isDebug) console.log("kakao-callback / getKakaoToken / result.access_token : ",result.token_type);

        // 유저 앱등록을 진행합니다.
        this.getKakaoSignUp(result.token_type, result.access_token);

      } else {

        // 에러 로그 등록
        this.myLoggerService.logError(
          // apiKey:string
          this.myEventWatchTowerService.getApiKey(),
          // errorType:string
          this.myLoggerService.errorAPIFailed,
          // errorMsg:string
          "kakao-callback / getKakaoToken / Failed! / kakaoCode : " + kakaoCode
        );
      }
    });
  }

  // 유저를 카카오 앱 - cafeclass에 등록합니다. 이미 등록되어 있다면 재등록되지 않습니다.
  private getKakaoSignUp(kakaoTokenType:string, kakaoAccessToken:string) :void {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("kakao-callback / getKakaoSignUp / 시작");

    this.loginService
    .getKakaoSignUp(kakaoTokenType, kakaoAccessToken)
    .then(result => {

      if(isDebug) console.log("kakao-callback / getKakaoSignUp / result : ",result);

      if( null != result && 
          null != result.code && 
          null != result.msg) {

        let code:number = result.code;
        let msg:string = result.msg;

        if(this.kakaoSignupCodeAlreadyRegisterd === code) {

          if(isDebug) console.log("kakao-callback / getKakaoSignUp / code : ",code);
          if(isDebug) console.log("kakao-callback / getKakaoSignUp / msg : ",msg);

          // 유저 정보를 가져옵니다.
          this.getKakaoMe(kakaoTokenType, kakaoAccessToken);
        }

      } else {

        // 에러 로그 등록
        this.myLoggerService.logError(
          // apiKey:string
          this.myEventWatchTowerService.getApiKey(),
          // errorType:string
          this.myLoggerService.errorAPIFailed,
          // errorMsg:string
          `kakao-callback / getKakaoSignUp / Failed! / kakaoTokenType : ${kakaoTokenType} / kakaoAccessToken : ${kakaoAccessToken}`
        );

      } // end if

    });
  } 

  private getKakaoMe(kakaoTokenType:string, kakaoAccessToken:string) :void {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("kakao-callback / getKakaoMe / 시작");

    this.loginService
    .getKakaoMe(kakaoTokenType, kakaoAccessToken)
    .then(result => {

      if(isDebug) console.log("kakao-callback / getKakaoMe / result : ",result);

      if( null == result || null == result.id ) {
        // 로그인 실패

        // 에러 로그 등록
        this.myLoggerService.logError(
          // apiKey:string
          this.myEventWatchTowerService.getApiKey(),
          // errorType:string
          this.myLoggerService.errorAPIFailed,
          // errorMsg:string
          `kakao-callback / getKakaoMe / Failed! / kakaoTokenType : ${kakaoTokenType} / kakaoAccessToken : ${kakaoAccessToken}`
        );

        // 홈으로 리다이렉트
        this.router.navigate(['/class-center']);
        return;
      }

      // 카카오 플랫폼에서의 로그인 성공!
      if(isDebug) console.log("kakao-callback / getKakaoMe / result.kakao_id : ",result.kakao_id);

      // 카카오 아이디로 유저 정보를 가져옵니다.
      this.getUserByKakaoId(result.kakao_id);

    }); // end service

  } // end method 

  private getUserByKakaoId(kakaoId:string) :void {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("kakao-callback / getUserByKakaoId / 시작");

    this.userService
    .getUserByKakaoId(kakaoId)
    .then(result => {

      if(isDebug) console.log("kakao-callback / getUserByKakaoId / result : ",result);

      if(null == result || null == result.user) {

        // 카카오 로그인은 성공. 하지만 유저 정보가 없음.
        // 카카오 유저 정보가 DB에 등록되지 않았음!
        if(isDebug) console.log("kakao-callback / getUserByKakaoId / 중단 / result is not valid!");
        // 에러 로그 등록
        this.myLoggerService.logError(
          // apiKey:string
          this.myEventWatchTowerService.getApiKey(),
          // errorType:string
          this.myLoggerService.errorAPIFailed,
          // errorMsg:string
          `kakao-callback / getKakaoMe / Failed! / kakaoId : ${kakaoId}`
        );        
        return;

      } else if(  null == result.user.gender || 
                  "" === result.user.gender || 
                  null == result.user.mobile || 
                  "" === result.user.mobile ) {

        // 카카오 로그인은 성공. 카카오 프로필에서 가져온 정보로 유저 등록됨. 
        // 하지만 추가 정보 필요. 
        // 회원 가입창으로 이동.
        if(isDebug) console.log("kakao-callback / getUserByKakaoId / 중단 / 회원 가입창으로 이동.");
        this.router.navigate(['/login/signup/kakao', result.kakao_id]);
        return;

      } else {
        // 카카오 로그인 성공. 등록된 유저 정보가 문제 없음. 
        // 로그인이 성공했으므로, 서버에 해당 유저의 로그인 쿠키를 만들어야 함.

        if(isDebug) console.log("kakao-callback / getUserByKakaoId / 로그인 성공!, 로그인 쿠키 만듦");

        // api key 필요!
        this.userService
        .confirmUserKakao(
          // apiKey:string
          this.myEventWatchTowerService.getApiKey(),
          // kakaoId:string
          result.kakao_id
        ).then(result => {

          if(null == result || null == result.success || !result.success) {
            // kakaoid로 쿠키 인증 실패. 
            if(isDebug) console.log("kakao-callback / getUserByKakaoId / 중단 / kakaoid로 쿠키 인증 실패. 홈으로 이동.");

            // 에러 로그 등록
            this.myLoggerService.logError(
              // apiKey:string
              this.myEventWatchTowerService.getApiKey(),
              // errorType:string
              this.myLoggerService.errorAPIFailed,
              // errorMsg:string
              `kakao-callback / getUserByKakaoId / Failed! / kakaoId : ${kakaoId}`
            );

            // 홈으로 이동.
            this.router.navigate(['/class-center']);
            return;
          }

          // 쿠키 인증 성공!
          // 로그인 직전 페이지로 리다이렉트. 
          // 돌아갈 주소가 없다면, 홈으로 이동.
          if(isDebug) console.log("kakao-callback / getUserByKakaoId / 쿠키 인증 성공! 홈으로 이동.");
          this.router.navigate(['/class-center']);
          
        }); // end userService

      } // end if
    }); // end service

  }


} // end class