import {  Component, 
          Input, 
          Output,
          OnInit, 
          AfterViewInit,
          OnDestroy}                  from '@angular/core';
import {  Subscription }              from 'rxjs';          
import {  Router,
          ActivatedRoute }            from '@angular/router';

import { LoginService }               from '../service/login.service';
import { MyLoggerService }            from '../../util/service/my-logger.service';
import { MyCheckerService }           from '../../util/service/my-checker.service';
import { UserService }                from '../../users/service/user.service';
import { TeacherService }                from '../../teachers/service/teacher.service';

import { MyEventWatchTowerService }   from '../../util/service/my-event-watchtower.service';

import { MyResponse }                 from '../../util/model/my-response';
import { MyCookie }                   from '../../util/http/my-cookie';

import { User }                       from '../../users/model/user';

@Component({
  moduleId: module.id,
  selector: 'kakao-callback',
  templateUrl: 'kakao-callback.component.html',
  styleUrls: [ 'kakao-callback.component.css' ]
})
export class KakaoCallbackComponent implements OnInit, AfterViewInit, OnDestroy {

  private code:string;
  private redirectUrl:string="/class-center";
  private kakaoSignupCodeAlreadyRegisterd: number=-102;
  private subscription: Subscription;

  private apiKey:string;
  isAdmin:boolean=false;
  errorMsgArr: string[]=[];

  private myCookie:MyCookie;

  constructor(  public loginService:LoginService,
                private watchTower:MyEventWatchTowerService,
                private userService:UserService,
                private teacherService:TeacherService,
                private myLoggerService:MyLoggerService,
                public myCheckerService:MyCheckerService,
                private activatedRoute:ActivatedRoute,
                public router:Router) {

    this.myCookie = new MyCookie();

  } // end function

  ngOnInit(): void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("kakao-callback / ngOnInit / 시작");

  } // end function

  ngAfterViewInit(): void {

    // 자식 뷰가 모두 완료된 이후에 초기화를 진행.
    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("kakao-callback / ngAfterViewInit");

    this.asyncViewPack();

  }  

  ngOnDestroy() {
    // prevent memory leak by unsubscribing
    this.subscription.unsubscribe();
  }

  private asyncViewPack(): void {
    
    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("kakao-callback / asyncViewPack / 시작");

    // 이미 View 기본정보가 들어왔다면 바로 가져온다.
    if(this.watchTower.getIsViewPackReady()) {
      if(isDebug) console.log("kakao-callback / asyncViewPack / isViewPackReady : ",true);
      this.init();
    } // end if

    // View에 필요한 기본 정보가 비동기로 들어올 경우, 처리.
    this.watchTower.isViewPackReady$.subscribe(
      (isViewPackReady:boolean) => {
      if(isDebug) console.log("kakao-callback / asyncViewPack / subscribe / isViewPackReady : ",isViewPackReady);
      
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

  private init(): void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("kakao-callback / init / 시작");

    // 뷰에 필요한 공통 정보를 설정합니다.
    this.setViewPack();

    // 페이지 진입을 기록으로 남깁니다.
    this.logActionPage();

    // 리다이렉트로 전달된 외부 쿼리 스트링 파라미터를 가져옵니다.
    this.getQueryString();

  } // end init

  private logActionPage() :void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("kakao-callback / logActionPage / 시작");

    // 페이지 진입을 기록으로 남깁니다.
    this.myLoggerService.logActionPage(
      // apiKey:string
      this.watchTower.getApiKey(),
      // pageType:string
      this.myLoggerService.pageTypeLoginKakao
    ).then((myResponse:MyResponse) => {
      // 로그 등록 결과를 확인해볼 수 있습니다.
      if(isDebug) console.log("kakao-callback / logActionPage / myResponse : ",myResponse);
    })
  }  

  private getQueryString() :void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
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

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("kakao-callback / getKakaoToken / 시작");
    if(isDebug) console.log("kakao-callback / getKakaoToken / kakaoCode : ",kakaoCode);

    if(null == kakaoCode || "" == kakaoCode) {
      if(isDebug) console.log("kakao-callback / getKakaoToken / 중단 / kakaoCode is not valid!");

      this.myLoggerService.logError(
        // apiKey:string
        this.watchTower.getApiKey(),
        // errorType:string
        this.myLoggerService.errorTypeNotValidValue,
        // errorMsg:string
        "kakao-callback / getKakaoToken / kakaoCode is not valid! : " + kakaoCode
      );
      return;
    }

    this.loginService
    .getKakaoToken(kakaoCode)
    .then((myResponse:MyResponse) => {

      if(isDebug) console.log("kakao-callback / getKakaoToken / myResponse : ",myResponse);

      let accessToken:string = myResponse.getDataProp("access_token");
      let tokenType:string = myResponse.getDataProp("token_type");

      if(isDebug) console.log(`kakao-callback / getKakaoToken / accessToken : ${accessToken}`);
      if(isDebug) console.log(`kakao-callback / getKakaoToken / tokenType : ${tokenType}`);

      if( myResponse.isSuccess() && 
          null != accessToken && 
          null != tokenType) {

        if(isDebug) console.log(`kakao-callback / getKakaoToken / 유저 앱등록을 진행합니다.`);
        this.getKakaoSignUp(tokenType, accessToken);

      } else {

        if(isDebug) console.log(`kakao-callback / getKakaoToken / 에러 로그 등록`);
        this.myLoggerService.logError(
          // apiKey:string
          this.watchTower.getApiKey(),
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

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("kakao-callback / getKakaoSignUp / 시작");

    this.loginService
    .getKakaoSignUp(kakaoTokenType, kakaoAccessToken)
    .then((myResponse:MyResponse) => {

      if(isDebug) console.log("kakao-callback / getKakaoSignUp / myResponse : ",myResponse);

      let code:number = +myResponse.getDataProp("code");
      let msg:string = myResponse.getDataProp("msg");
      if( myResponse.isSuccess() && 
          null != code && 
          null != msg) {

        if(this.kakaoSignupCodeAlreadyRegisterd === code) {

          if(isDebug) console.log("kakao-callback / getKakaoSignUp / code : ",code);
          if(isDebug) console.log("kakao-callback / getKakaoSignUp / msg : ",msg);

          // 유저 정보를 가져옵니다.
          this.getKakaoMe(kakaoTokenType, kakaoAccessToken);
        }

      } else {

        if(isDebug) console.log("kakao-callback / getKakaoSignUp / 에러 로그 등록");

        let errMsg:string = `kakao-callback / getKakaoSignUp / Failed! / kakaoTokenType : ${kakaoTokenType} / kakaoAccessToken : ${kakaoAccessToken}`;
        this.logError(
          // errorType:string
          this.myLoggerService.errorAPIFailed,
          // errMsg:string
          errMsg
        );

        if(null != myResponse.error && "" != myResponse.error) {
          // 에러 내용은 화면에 표시한다.
          this.watchTower.announceErrorMsgArr([myResponse.error]);
        }

      } // end if

    });
  } 

  private logError(errorType:string, errMsg:string) :void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("kakao-callback / logError / 시작");

    if(null == errorType) {
      return;
    }
    if(null == errMsg) {
      return;
    }

    // 에러 로그 등록
    this.myLoggerService.logError(
      // apiKey:string
      this.watchTower.getApiKey(),
      // errorType:string
      errorType,
      // errorMsg:string
      errMsg
    ).then((myResponse:MyResponse) => {

      if(isDebug) console.log("kakao-callback / logError / myResponse : ",myResponse);

    }); // end logError

  }

  private getKakaoMe(kakaoTokenType:string, kakaoAccessToken:string) :void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("kakao-callback / getKakaoMe / 시작");

    this.loginService
    .getKakaoMe(kakaoTokenType, kakaoAccessToken)
    .then((myResponse:MyResponse) => {

      if(isDebug) console.log("kakao-callback / getKakaoMe / myResponse : ",myResponse);

      let kakaoId:number = +myResponse.digDataProp(["me","kakao_id"]);

      if( myResponse.isSuccess() && !(0 < kakaoId) ) {
        // 로그인 실패

        // 에러 로그 등록
        this.myLoggerService.logError(
          // apiKey:string
          this.watchTower.getApiKey(),
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
      if(isDebug) console.log(`kakao-callback / getKakaoMe / kakao_id : ${kakaoId}`);

      // 카카오 아이디로 유저 정보를 가져옵니다.
      this.getUserByKakaoId(""+kakaoId);

    }); // end service

  } // end method 

  private getUserByKakaoId(kakaoId:string) :void {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("kakao-callback / getUserByKakaoId / 시작");

    this.userService
    .getUserByKakaoId(kakaoId)
    .then((myResponse:MyResponse) => {

      if(isDebug) console.log("kakao-callback / getUserByKakaoId / myResponse : ",myResponse);

      let user = myResponse.getDataProp("user");
      if(myResponse.isSuccess() && null == user) {

        // 카카오 로그인은 성공. 하지만 유저 정보가 없음.
        // 카카오 유저 정보가 DB에 등록되지 않았음!
        if(isDebug) console.log("kakao-callback / getUserByKakaoId / 중단 / result is not valid!");
        // 에러 로그 등록
        this.myLoggerService.logError(
          // apiKey:string
          this.watchTower.getApiKey(),
          // errorType:string
          this.myLoggerService.errorAPIFailed,
          // errorMsg:string
          `kakao-callback / getKakaoMe / Failed! / kakaoId : ${kakaoId}`
        );        
        return;

      } else if(null != user && (null == user["mobile"] || "" == user["mobile"]) ) {

        // 카카오 로그인은 성공. 카카오 프로필에서 가져온 정보로 유저 등록됨. 
        // 하지만 추가 정보 필요. 
        // 회원 가입창으로 이동.
        if(isDebug) console.log("kakao-callback / getUserByKakaoId / 중단 / 회원 가입창으로 이동.");
        this.router.navigate(['/login/signup/kakao', myResponse.getDataProp("kakao_id")]);
        return;

      } else if(myResponse.isSuccess()) {
        // 카카오 로그인 성공. 등록된 유저 정보가 문제 없음. 
        // 로그인이 성공했으므로, 서버에 해당 유저의 로그인 쿠키를 만들어야 함.

        if(isDebug) console.log("kakao-callback / getUserByKakaoId / 로그인 성공!, 로그인 쿠키 만듦");

        // 가져온 유저 정보를 전파.
        let userFromDB = myResponse.getDataProp("user");
        if(null != userFromDB) {
          let user:User = this.userService.getUserFromJSON(userFromDB);
          if(isDebug) console.log(`kakao-callback / getUserByKakaoId / user : `,user);
  
          // 회원 로그인 정보를 가져왔다면, 가져온 로그인 정보를 다른 컴포넌트들에게도 알려줍니다.
          this.watchTower.announceLogin(user);

          // wonder.jung
          // 선생님 등록이 되어있는 회원인지 확인.
          this.teacherService
          .getTeacher(this.watchTower.getApiKey(), +user.id)
          .then((myResponse:MyResponse) => {

            if(isDebug) console.log(`kakao-callback / getTeacher / myResponse : `,myResponse);

            let teacherFromDB = myResponse.getDataProp("teacher");
            // 선생님 로그인 여부를 확인, 전파한다.
            this.watchTower.announceLoginTeacher(teacherFromDB);

          }); // end service          

        } // end if 

        // api key 필요!
        this.userService
        .confirmUserKakao(

          // apiKey:string
          this.watchTower.getApiKey(),
          // kakaoId:string
          myResponse.getDataProp("kakao_id")

        ).then((myResponse:MyResponse) => {

          if(isDebug) console.log("kakao-callback / getUserByKakaoId / myResponse : ",myResponse);

          if(myResponse.isSuccess()) {

            // 쿠키 인증 성공!
            if(isDebug) console.log("kakao-callback / getUserByKakaoId / 쿠키 인증 성공! 홈으로 이동.");

            // 로그인 직전 페이지로 리다이렉트. 
            // 돌아갈 주소가 없다면, 홈으로 이동.
            let redirectUrl:string = this.myCookie.getCookie("redirectUrl");
            if(null == redirectUrl || "" == redirectUrl) {
              redirectUrl = '/class-center';
            }

            if(isDebug) console.log("kakao-callback / getUserByKakaoId / redirectUrl : ",redirectUrl);
            
            this.router.navigate([redirectUrl]);

          } else {

            // kakaoid로 쿠키 인증 실패. 
            if(isDebug) console.log("kakao-callback / getUserByKakaoId / 중단 / kakaoid로 쿠키 인증 실패. 홈으로 이동.");

            // 에러 로그 등록
            this.myLoggerService.logError(
              // apiKey:string
              this.watchTower.getApiKey(),
              // errorType:string
              this.myLoggerService.errorAPIFailed,
              // errorMsg:string
              `kakao-callback / getUserByKakaoId / Failed! / kakaoId : ${kakaoId}`
            );

            // 홈으로 이동.
            this.router.navigate(['/class-center']);
          }

          
        }); // end userService

      } // end if
    }); // end service

  }


} // end class