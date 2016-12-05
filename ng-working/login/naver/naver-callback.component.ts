import {  Component, 
          Input, 
          Output,
          OnInit, 
          OnDestroy}                  from '@angular/core';
import {  Subscription }              from 'rxjs';          
import {  Router,
          ActivatedRoute }            from '@angular/router';
import { LoginService }               from '../service/login.service';
import { UserService }                from '../../users/service/user.service';
import { MyCheckerService }           from '../../util/service/my-checker.service';
import { MyLoggerService }            from '../../util/service/my-logger.service';

import { MyEventWatchTowerService }   from '../../util/service/my-event-watchtower.service';

@Component({
  moduleId: module.id,
  selector: 'naver-callback',
  templateUrl: 'naver-callback.component.html',
  styleUrls: [ 'naver-callback.component.css' ]
})
export class NaverCallbackComponent implements OnInit, OnDestroy {

  private code:string;
  private state:string;
  private redirectUrl:string="/class-center";
  private isValidState:boolean=false;
  private subscription: Subscription;

  private apiKey:string;
  isAdmin:boolean=false;
  errorMsgArr: string[]=[];

  constructor(  public loginService: LoginService,
                private myEventWatchTowerService:MyEventWatchTowerService,
                public myLoggerService:MyLoggerService,
                public myCheckerService:MyCheckerService,
                private userService:UserService,                
                private activatedRoute: ActivatedRoute,
                public router: Router) {

    // Do something...
  } // end function

  ngOnInit(): void {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("naver-callback / ngOnInit / init");

    // 운영 서버인지 서비스 서버인지 판단하는 플래그값 가져옴.
    this.setIsAdmin();

    // my-checker.service의 apikey 가져옴. 
    this.setMyCheckerReady();

    /*
    // 페이지 진입을 기록으로 남깁니다.
    this.myLoggerService.logActionPage(this.myLoggerService.pageTypeLoginNaver);

    // 리다이렉트로 전달된 외부 쿼리 스트링 파라미터를 가져옵니다.
    this.subscription = this.activatedRoute.queryParams.subscribe(
      (param: any) => {

        if(isDebug) console.log("naver-callback / queryParams / param : ",param);

        this.code = param['code'];
        this.state = param['state'];

        if(isDebug) console.log("naver-callback / queryParams / this.code : ",this.code);
        if(isDebug) console.log("naver-callback / queryParams / this.state : ",this.state);

        if(  null != this.code && 
             "" != this.code && 
             null != this.state && 
             "" != this.state) {
          
          this.getNaverState(this.state, this.code);
        } // end if
      }
    ); // end subscribe
    */


  } // end function

  ngOnDestroy() {
    // prevent memory leak by unsubscribing
    this.subscription.unsubscribe();
  }  

  private setIsAdmin() :void {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("naver-callback / setIsAdmin / 시작");

    // 운영 서버인지 서비스 서버인지 판단하는 플래그값 가져옴.
    this.myEventWatchTowerService.isAdmin$.subscribe(
      (isAdmin:boolean) => {

      if(isDebug) console.log("naver-callback / setIsAdmin / isAdmin : ",isAdmin);
      this.isAdmin = isAdmin;
    });
  }  

  private setMyCheckerReady() :void {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("naver-callback / setMyCheckerReady / 시작");

    this.myEventWatchTowerService.myCheckerServiceReady$.subscribe(
      (isReady:boolean) => {

      if(isDebug) console.log("naver-callback / setMyCheckerReady / isReady : ",isReady);

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

      this.logActionPage();
      this.getQueryString();

    });    
  }

  private logActionPage() :void {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("naver-callback / logActionPage / 시작");

    // 페이지 진입을 기록으로 남깁니다.
    this.myLoggerService.logActionPage(
      // apiKey:string
      this.myEventWatchTowerService.getApiKey(),
      // pageType:string
      this.myLoggerService.pageTypeLoginNaver
    ).then(result => {
      // 로그 등록 결과를 확인해볼 수 있습니다.
      if(isDebug) console.log("naver-callback / logActionPage / result : ",result);
    })
  }  

  private getQueryString() :void {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("naver-callback / getQueryString / 시작");

    this.subscription = this.activatedRoute.queryParams.subscribe(
      (param: any) => {

        if(isDebug) console.log("naver-callback / getQueryString / param : ",param);

        this.code = param['code'];
        this.state = param['state'];

        if(isDebug) console.log("naver-callback / getQueryString / this.code : ",this.code);
        if(isDebug) console.log("naver-callback / getQueryString / this.state : ",this.state);

        if(  null != this.code && 
             "" != this.code && 
             null != this.state && 
             "" != this.state) {
          
          this.getNaverState(this.state, this.code);
        } else {

          // 에러 로그 등록
          this.myLoggerService.logError(
            // apiKey:string
            this.myEventWatchTowerService.getApiKey(),
            // errorType:string
            this.myLoggerService.errorAPIFailed,
            // errorMsg:string
            `naver-callback / getQueryString / Failed! / this.code : ${this.code} / this.state : ${this.state}`
          );

        }// end if
      }
    ); // end subscribe

  }

  private getNaverState(state:string, code:string) :void {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("naver-callback / getNaverState / init");

    if(null == state || "" == state) {
      return;
    }
    if(null == code || "" == code) {
      return;
    }

    if(isDebug) console.log("naver-callback / getState / state : ",state);
    if(isDebug) console.log("naver-callback / getState / code : ",code);    

    this.loginService
    .getNaverState(state)
    .then(result => {

      if(isDebug) console.log("naver-callback / getState / getNaverState / result : ",result);

      if( null != result &&
          null != result.is_valid_state ) {

        this.isValidState = result.is_valid_state;
      } else {
        // 에러 로그 등록
        this.myLoggerService.logError(
          // apiKey:string
          this.myEventWatchTowerService.getApiKey(),
          // errorType:string
          this.myLoggerService.errorAPIFailed,
          // errorMsg:string
          `naver-callback / getNaverState / Failed! / state : ${state}`
        );
        return;
      }

      if(isDebug) console.log("naver-callback / getState / getNaverState / this.isValidState : ",this.isValidState);

      // Session에 저장된 state와 비교합니다.
      if(this.isValidState) {

        // 1. state가 정상적일 경우, 다음 단계를 진행
        if(isDebug) console.log("naver-callback / getNaverState / state가 정상적일 경우, 다음 단계를 진행");
        this.getNaverAccess(code);

      } else {

        // 2. state가 다를 경우, 사용자에게 메시지 노출. '비정상적인 접근입니다.'. 메시지 확인 뒤, 로그인 홈으로 이동.
        // - 상황 정보를 로그로 남김. ex) '비정상 로그인 접근'
        if(isDebug) console.log("naver-callback / getNaverState / state가 다를 경우, 사용자에게 메시지 노출. 메시지 확인 뒤, 로그인 홈으로 이동");

        // 에러 로그 등록
        this.myLoggerService.logError(
          // apiKey:string
          this.myEventWatchTowerService.getApiKey(),
          // errorType:string
          this.myLoggerService.errorAPIFailed,
          // errorMsg:string
          `naver-callback / getNaverState / Failed! / this.isValidState : ${this.isValidState}`
        ); // end logError

      }
    }); 
  }

  // @ Desc : Naver REST API에 접근하기 위한 접근 토큰(Access Token)을 받아옵니다. 
  private getNaverAccess(code:string) :void {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("naver-callback / getNaverAccess / init");

    if(null == code || "" == code) {
      return;
    }

    this.loginService
    .getNaverAccess(code)
    .then(result => {

      if(isDebug) console.log("naver-callback / getNaverAccess / result : ",result);

      if( null != result && 
          null != result.access_token && 
          null != result.token_type ) {

        this.getNaverMe();

      } else {

        // 에러 로그 등록
        this.myLoggerService.logError(
          // apiKey:string
          this.myEventWatchTowerService.getApiKey(),
          // errorType:string
          this.myLoggerService.errorAPIFailed,
          // errorMsg:string
          `naver-callback / getNaverAccess / Failed! / access_token : ${result.access_token} / token_type : ${result.token_type}`
        ); // end logError

      }// end if
    }); // end method
  } // end method

  // @ Desc : Naver REST API로 회원정보를 가져옵니다.
  private getNaverMe() :void {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("naver-callback / getNaverMe / init");

    this.loginService
    .getNaverMe()
    .then(result => {

      if(isDebug) console.log("naver-callback / getNaverMe / result : ",result);

      if(null == result || null == result.kakao_id) {
        // 네이버에서 유저 정보를 가져오는데 실패했습니다. 로그를 기록, 홈으로 이동합니다.
        if(isDebug) console.log("naver-callback / getNaverMe / 네이버에서 유저 정보를 가져오는데 실패했습니다. 로그를 기록, 홈으로 이동합니다.");

        // 에러 로그 등록
        this.myLoggerService.logError(
          // apiKey:string
          this.myEventWatchTowerService.getApiKey(),
          // errorType:string
          this.myLoggerService.errorAPIFailed,
          // errorMsg:string
          `naver-callback / getNaverMe / Failed!`
        ); // end logError

        // 홈으로 리다이렉트
        this.router.navigate([this.redirectUrl]);

        return;
      }

      // 네이버 로그인 성공!
      // 로그인한 유저 정보를 가져오는데 성공했습니다!
      if( null == result.gender ||
          "" === result.gender ||
          null == result.mobile ||
          "" === result.mobile ) {

        // 페이스북 로그인은 성공. 페이스북 유저 프로필에서 가져온 정보로 유저 등록됨. 
        // 하지만 추가 정보 필요. 
        // 회원 가입창으로 이동.
        if(isDebug) console.log("naver-callback / 네이버 로그인은 성공. 네이버 유저 프로필에서 가져온 정보로 유저 등록됨.회원 가입창으로 이동.");
        this.router.navigate(['/login/signup/naver', result.naver_id]);
          
      } else {

        // 2. mobile, gender가 있다면 정상 등록된 유저. 로그인 창으로 리다이렉트.
        // this.router.navigate([this.redirectUrl]);

        // 페이스북 로그인 성공. 등록된 유저 정보가 문제 없음. 
        // 로그인이 성공했으므로, 서버에 해당 유저의 로그인 쿠키를 만들어야 함.

        if(isDebug) console.log("naver-callback / 네이버 로그인은 성공. 로그인이 성공했으므로, 서버에 해당 유저의 로그인 쿠키를 만들어야 함.");

        this.userService
        .confirmUserNaver(this.myCheckerService.getAPIKey(), result.naver_id)
        .then(result => {

          if(isDebug) console.log("naver-callback / confirmUserNaver / result : ",result);

          if(null == result || null == result.success || !result.success) {
            // naver id로 쿠키 인증 실패. 홈으로 이동.
            if(isDebug) console.log("naver-callback / confirmUserNaver / naver id로 쿠키 인증 실패. 홈으로 이동.");
            this.router.navigate([this.redirectUrl]);

            // 에러 로그 등록
            this.myLoggerService.logError(
              // apiKey:string
              this.myEventWatchTowerService.getApiKey(),
              // errorType:string
              this.myLoggerService.errorAPIFailed,
              // errorMsg:string
              `naver-callback / confirmUserNaver / Failed!`
            ); // end logError              
            return;
          }

          // 쿠키 인증 성공!
          // 로그인 직전 페이지로 리다이렉트. 
          // 돌아갈 주소가 없다면, 홈으로 이동.
          if(isDebug) console.log("naver-callback / confirmUserNaver / naver id로 쿠키 인증 성공!. 로그인 직전 페이지로 리다이렉트.");
          this.router.navigate([this.redirectUrl]);
          
        }); // end userService
        
      } // end if

    }); // end method    


  }


} // end class