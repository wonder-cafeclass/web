import {  Component, 
          Input, 
          Output,
          AfterViewInit,
          OnDestroy}                  from '@angular/core';
import {  Subscription }              from 'rxjs';          
import {  Router,
          ActivatedRoute }            from '@angular/router';
import { LoginService }               from '../service/login.service';
import { UserService }                from '../../users/service/user.service';
import { TeacherService }             from '../../teachers/service/teacher.service';
import { MyCheckerService }           from '../../util/service/my-checker.service';
import { MyLoggerService }            from '../../util/service/my-logger.service';

import { MyEventWatchTowerService }   from '../../util/service/my-event-watchtower.service';

import { MyResponse }                 from '../../util/model/my-response';
import { MyCookie }                   from '../../util/http/my-cookie';

import { User }                       from '../../users/model/user';

@Component({
  moduleId: module.id,
  selector: 'naver-callback',
  templateUrl: 'naver-callback.component.html',
  styleUrls: [ 'naver-callback.component.css' ]
})
export class NaverCallbackComponent implements AfterViewInit, OnDestroy {

  private code:string;
  private state:string;
  private redirectUrl:string="/class-center";
  private isValidState:boolean=false;
  private subscription: Subscription;

  private apiKey:string;
  isAdmin:boolean=false;
  errorMsgArr: string[]=[];

  private myCookie:MyCookie;

  constructor(  public loginService: LoginService,
                private watchTower:MyEventWatchTowerService,
                public myLoggerService:MyLoggerService,
                public myCheckerService:MyCheckerService,
                private userService:UserService,   
                private teacherService:TeacherService,             
                private activatedRoute: ActivatedRoute,
                public router: Router) {

    this.myCookie = new MyCookie();

  } // end function

  private isDebug():boolean {
    return true;
    // return this.watchTower.isDebug();
  }

  ngAfterViewInit(): void {

    // 자식 뷰가 모두 완료된 이후에 초기화를 진행.
    if(this.isDebug()) console.log("\nnaver-callback / ngAfterViewInit");
    this.asyncViewPack();

  }  

  ngOnDestroy() {
    // prevent memory leak by unsubscribing
    this.subscription.unsubscribe();
  }

  private asyncViewPack(): void {
    
    if(this.isDebug()) console.log("\nnaver-callback / asyncViewPack / 시작");

    // 이미 View 기본정보가 들어왔다면 바로 가져온다. 
    if(this.watchTower.getIsViewPackReady()) {
      if(this.isDebug()) console.log("naver-callback / asyncViewPack / isViewPackReady : ",true);
      this.init();
    } // end if

    // View에 필요한 기본 정보가 비동기로 들어올 경우, 처리.
    this.watchTower.isViewPackReady$.subscribe(
      (isViewPackReady:boolean) => {
      if(this.isDebug()) console.log("naver-callback / asyncViewPack / subscribe / isViewPackReady : ",isViewPackReady);
      this.init();
    }); // end subscribe    

  }
  private setViewPack() :void {
    this.isAdmin = this.watchTower.getIsAdmin();
    this.myCheckerService.setReady(
      // checkerMap:any
      this.watchTower.getCheckerMap(),
      // constMap:any
      this.watchTower.getConstMap(),
      // dirtyWordList:any
      this.watchTower.getDirtyWordList(),
      // apiKey:string
      this.watchTower.getApiKey()
    ); // end setReady
  }

  private init() :void {

    // 뷰에 필요한 공통 정보를 설정합니다.
    this.setViewPack();
    this.getQueryString();
    // 로그인, 회원 등록의 경우, 최상단 메뉴를 가립니다.
    this.watchTower.announceToggleTopMenu(false);

  }

  private logActionPage() :void {

    if(this.isDebug()) console.log("\nnaver-callback / logActionPage / 시작");

    // 페이지 진입을 기록으로 남깁니다.
    this.myLoggerService.logActionPage(
      // apiKey:string
      this.watchTower.getApiKey(),
      // pageType:string
      this.myLoggerService.pageTypeLoginNaver
    ).then((myResponse:MyResponse) => {
      // 로그 등록 결과를 확인해볼 수 있습니다.

      if(myResponse.isSuccess()) {

        if(this.isDebug()) console.log("naver-callback / logActionPage / myResponse : ",myResponse);

      } else if(myResponse.isFailed()) {  

        if(null != myResponse.error) {
          this.watchTower.announceErrorMsgArr([myResponse.error]);
        }

        // 에러 로그 등록
        this.myLoggerService.logError(
          // apiKey:string
          this.watchTower.getApiKey(),
          // errorType:string
          this.myLoggerService.errorAPIFailed,
          // errorMsg:string
          `naver-callback / logActionPage / Failed!`
        ); // end logger      

      } // end if

    }) // end service

  } // end method

  private getQueryString() :void {

    if(this.isDebug()) console.log("\nnaver-callback / getQueryString / 시작");

    this.subscription = this.activatedRoute.queryParams.subscribe(
      (param: any) => {

        if(this.isDebug()) console.log("naver-callback / getQueryString / param : ",param);

        this.code = param['code'];
        this.state = param['state'];

        if(this.isDebug()) console.log("naver-callback / getQueryString / this.code : ",this.code);
        if(this.isDebug()) console.log("naver-callback / getQueryString / this.state : ",this.state);

        if(  null != this.code && 
             "" != this.code && 
             null != this.state && 
             "" != this.state) {
          
          this.getNaverState(this.state, this.code);
        } else {

          // 에러 로그 등록
          this.myLoggerService.logError(
            // apiKey:string
            this.watchTower.getApiKey(),
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

    if(this.isDebug()) console.log("\nnaver-callback / getNaverState / init");

    if(null == state || "" == state) {
      return;
    }
    if(null == code || "" == code) {
      return;
    }

    if(this.isDebug()) console.log("naver-callback / getState / state : ",state);
    if(this.isDebug()) console.log("naver-callback / getState / code : ",code);    

    this.loginService
    .getNaverState(state)
    .then((myResponse:MyResponse) => {

      if(this.isDebug()) console.log("naver-callback / getState / getNaverState / myResponse : ",myResponse);

      if(myResponse.isSuccess()) {

        this.isValidState = myResponse.getDataProp("is_valid_state");

        // Session에 저장된 state와 비교합니다.
        if(this.isValidState) {

          // 1. state가 정상적일 경우, 다음 단계를 진행
          if(this.isDebug()) console.log("naver-callback / getNaverState / state가 정상적일 경우, 다음 단계를 진행");
          this.getNaverAccess(code);

        } else {

          // 2. state가 다를 경우, 사용자에게 메시지 노출. '비정상적인 접근입니다.'. 메시지 확인 뒤, 로그인 홈으로 이동.
          // - 상황 정보를 로그로 남김. ex) '비정상 로그인 접근'
          if(this.isDebug()) console.log("naver-callback / getNaverState / state가 다를 경우, 사용자에게 메시지 노출. 메시지 확인 뒤, 로그인 홈으로 이동");

          // 에러 로그 등록
          this.myLoggerService.logError(
            // apiKey:string
            this.watchTower.getApiKey(),
            // errorType:string
            this.myLoggerService.errorAPIFailed,
            // errorMsg:string
            `naver-callback / getNaverState / Failed! / this.isValidState : ${this.isValidState}`
          ); // end logError

        }        

      } else if(myResponse.isFailed()) {  

        if(null != myResponse.error) {
          this.watchTower.announceErrorMsgArr([myResponse.error]);
        }

        // 에러 로그 등록
        this.myLoggerService.logError(
          // apiKey:string
          this.watchTower.getApiKey(),
          // errorType:string
          this.myLoggerService.errorAPIFailed,
          // errorMsg:string
          `naver-callback / getNaverState / Failed! / state : ${state}`
        ); // end logger      

      } // end if      

// REMOVE ME
/*
      if( myResponse.isSuccess() ) {
        this.isValidState = myResponse.getDataProp("is_valid_state");
      } else {
        // 에러 로그 등록
        this.myLoggerService.logError(
          // apiKey:string
          this.watchTower.getApiKey(),
          // errorType:string
          this.myLoggerService.errorAPIFailed,
          // errorMsg:string
          `naver-callback / getNaverState / Failed! / state : ${state}`
        );
        return;
      }

      if(this.isDebug()) console.log("naver-callback / getState / getNaverState / this.isValidState : ",this.isValidState);

      // Session에 저장된 state와 비교합니다.
      if(this.isValidState) {

        // 1. state가 정상적일 경우, 다음 단계를 진행
        if(this.isDebug()) console.log("naver-callback / getNaverState / state가 정상적일 경우, 다음 단계를 진행");
        this.getNaverAccess(code);

      } else {

        // 2. state가 다를 경우, 사용자에게 메시지 노출. '비정상적인 접근입니다.'. 메시지 확인 뒤, 로그인 홈으로 이동.
        // - 상황 정보를 로그로 남김. ex) '비정상 로그인 접근'
        if(this.isDebug()) console.log("naver-callback / getNaverState / state가 다를 경우, 사용자에게 메시지 노출. 메시지 확인 뒤, 로그인 홈으로 이동");

        // 에러 로그 등록
        this.myLoggerService.logError(
          // apiKey:string
          this.watchTower.getApiKey(),
          // errorType:string
          this.myLoggerService.errorAPIFailed,
          // errorMsg:string
          `naver-callback / getNaverState / Failed! / this.isValidState : ${this.isValidState}`
        ); // end logError

      }

      */
    }); 
  }

  // @ Desc : Naver REST API에 접근하기 위한 접근 토큰(Access Token)을 받아옵니다. 
  private getNaverAccess(code:string) :void {

    if(this.isDebug()) console.log("\nnaver-callback / getNaverAccess / init");

    if(null == code || "" == code) {
      return;
    }

    this.loginService
    .getNaverAccess(code)
    .then((myResponse:MyResponse) => {

      if(this.isDebug()) console.log("naver-callback / getNaverAccess / myResponse : ",myResponse);

      if(myResponse.isSuccess()) {

        let accessToken:string = myResponse.digDataProp(["result","access_token"]);
        let tokenType:string = myResponse.digDataProp(["result","token_type"]);

        if(null != accessToken && null != tokenType) {
          this.getNaverMe();
        } // end if

      } else if(myResponse.isFailed()) {  

        if(null != myResponse.error) {
          this.watchTower.announceErrorMsgArr([myResponse.error]);
        }

        // 에러 로그 등록
        this.myLoggerService.logError(
          // apiKey:string
          this.watchTower.getApiKey(),
          // errorType:string
          this.myLoggerService.errorAPIFailed,
          // errorMsg:string
          `naver-callback / getNaverAccess / Failed!`
        ); // end logger

      }

// REMOVE ME
/*
      let accessToken:string = myResponse.digDataProp(["result","access_token"]);
      let tokenType:string = myResponse.digDataProp(["result","token_type"]);

      if(this.isDebug()) console.log("naver-callback / getNaverAccess / accessToken : ",accessToken);
      if(this.isDebug()) console.log("naver-callback / getNaverAccess / tokenType : ",tokenType);

      if( myResponse.isSuccess() && 
          null != accessToken && 
          null != tokenType ) {

        this.getNaverMe();

      } else {

        if(this.isDebug()) console.log("naver-callback / getNaverAccess / 에러 로그 등록");

        if(null != myResponse.error && "" != myResponse.error) {
          // 에러 내용은 화면에 표시한다.
          this.watchTower.announceErrorMsgArr([myResponse.error]);
        }

        // 에러 로그 등록
        this.myLoggerService.logError(
          // apiKey:string
          this.watchTower.getApiKey(),
          // errorType:string
          this.myLoggerService.errorAPIFailed,
          // errorMsg:string
          `naver-callback / getNaverAccess / Failed! / access_token : ${accessToken} / token_type : ${tokenType}`
        ); // end logError

      }// end if
*/

    }); // end method
  } // end method

  // @ Desc : Naver REST API로 회원정보를 가져옵니다.
  private getNaverMe() :void {

    if(this.isDebug()) console.log("\nnaver-callback / getNaverMe / init");

    this.loginService
    .getNaverMe()
    .then((myResponse:MyResponse) => {

      if(this.isDebug()) console.log("naver-callback / getNaverMe / myResponse : ",myResponse);

      if(myResponse.isSuccess()) {

        // 네이버 로그인 성공!
        // 로그인한 유저 정보를 가져오는데 성공했습니다!
        let user = myResponse.digDataProp(["me"]);
        let naverId = myResponse.digDataProp(["me","naver_id"]);

        if(this.isDebug()) console.log("naver-callback / getNaverMe / user : ",user);
        if(this.isDebug()) console.log("naver-callback / getNaverMe / naverId : ",naverId);

        if( myResponse.isSuccess() && 
            (null == user.gender ||
            "" === user.gender ||
            null == user.mobile ||
            "" === user.mobile)) {

          // 네이버 로그인은 성공. 네이버 유저 프로필에서 가져온 정보로 유저 등록됨. 
          // 하지만 추가 정보 필요. 
          // 회원 가입창으로 이동.
          if(this.isDebug()) console.log("naver-callback / 네이버 로그인은 성공. 네이버 유저 프로필에서 가져온 정보로 유저 등록됨.회원 가입창으로 이동.");
          this.router.navigate(['/login/signup/naver', naverId]);
            
        } else {

          // 2. mobile, gender가 있다면 정상 등록된 유저. 로그인 창으로 리다이렉트.
          // this.router.navigate([this.redirectUrl]);

          // 네이버 로그인 성공. 등록된 유저 정보가 문제 없음. 
          // 로그인이 성공했으므로, 서버에 해당 유저의 로그인 쿠키를 만들어야 함.

          if(null != user) {
            let loginUser:User = new User().setJSON(user);
            if(this.isDebug()) console.log(`naver-callback / getNaverMe / loginUser : `,loginUser);

            // 회원 로그인 정보를 가져왔다면, 가져온 로그인 정보를 다른 컴포넌트들에게도 알려줍니다.
            this.watchTower.announceLogin(loginUser);

            if(loginUser.isTeacher()) {
              this.watchTower.announceLoginTeacher(loginUser.getTeacher());
            } // end if

            // REMOVE ME
            /*
            // 선생님 등록이 되어있는 회원인지 확인.
            this.teacherService
            .getTeacher(this.watchTower.getApiKey(), +user.id)
            .then((myResponse:MyResponse) => {

              if(this.isDebug()) console.log(`naver-callback / getTeacher / myResponse : `,myResponse);

              let teacherFromDB = myResponse.getDataProp("teacher");
              // 선생님 로그인 여부를 확인, 전파한다.
              this.watchTower.announceLoginTeacher(teacherFromDB);

            }); // end service  
            */

          } // end if        

          if(this.isDebug()) console.log("naver-callback / 네이버 로그인은 성공. 로그인이 성공했으므로, 서버에 해당 유저의 로그인 쿠키를 만들어야 함.");

          this.confirmUserNaver(naverId);
          
        } // end if

      } else if(myResponse.isFailed()) {  

        if(null != myResponse.error) {
          this.watchTower.announceErrorMsgArr([myResponse.error]);
        }

        // 에러 로그 등록
        this.myLoggerService.logError(
          // apiKey:string
          this.watchTower.getApiKey(),
          // errorType:string
          this.myLoggerService.errorAPIFailed,
          // errorMsg:string
          `naver-callback / getNaverMe / Failed!`
        ); // end logger  

        // 홈으로 리다이렉트
        if(!this.isDebug()) {
          this.router.navigate([this.redirectUrl]);
        }

      } // end if

    }); // end service

  } // end method  

  private confirmUserNaver(naverId:string) :void{

    if(this.isDebug()) console.log("\nnaver-callback / confirmUserNaver / init");

    this.userService
    .confirmUserNaver(this.myCheckerService.getAPIKey(), naverId)
    .then((myResponse:MyResponse) => {

      if(this.isDebug()) console.log("naver-callback / confirmUserNaver / myResponse : ",myResponse);

      if(myResponse.isSuccess()) {

        // 쿠키 인증 성공!
        // 로그인 직전 페이지로 리다이렉트. 
        // 돌아갈 주소가 없다면, 홈으로 이동.
        let redirectUrl:string = this.myCookie.getCookie("redirectUrl");
        if(null == redirectUrl || "" == redirectUrl) {
          redirectUrl = '/class-center';
        }

        if(this.isDebug()) console.log("naver-callback / getUserByKakaoId / redirectUrl : ",redirectUrl);
        this.router.navigate([redirectUrl]);

      } else if(myResponse.isFailed()) {  

        if(null != myResponse.error) {
          this.watchTower.announceErrorMsgArr([myResponse.error]);
        }

        // 에러 로그 등록
        this.myLoggerService.logError(
          // apiKey:string
          this.watchTower.getApiKey(),
          // errorType:string
          this.myLoggerService.errorAPIFailed,
          // errorMsg:string
          `naver-callback / confirmUserNaver / Failed!`
        ); // end logger 

        // naver id로 쿠키 인증 실패. 홈으로 이동.
        if(this.isDebug()) console.log("naver-callback / confirmUserNaver / naver id로 쿠키 인증 실패. 홈으로 이동.");
        this.router.navigate([this.redirectUrl]);

      } // end if
      
    }); // end userService    
    
  } // end method

} // end class