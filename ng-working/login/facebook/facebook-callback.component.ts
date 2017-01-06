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
  selector: 'facebook-callback',
  templateUrl: 'facebook-callback.component.html',
  styleUrls: [ 'facebook-callback.component.css' ]
})
export class FacebookCallbackComponent implements OnDestroy {

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
                public myLoggerService:MyLoggerService,
                public myCheckerService:MyCheckerService,
                private watchTower:MyEventWatchTowerService,
                private userService:UserService,
                private teacherService:TeacherService,
                private activatedRoute: ActivatedRoute,
                public router: Router) {

    this.myCookie = new MyCookie();
    
  } // end function

  private isDebug():boolean {
    return this.watchTower.isDebug();
  }

  ngAfterViewInit(): void {

    // 자식 뷰가 모두 완료된 이후에 초기화를 진행.
    if(this.isDebug()) console.log("facebook-callback / ngAfterViewInit");
    this.asyncViewPack();

  }  

  ngOnDestroy() {
    // prevent memory leak by unsubscribing
    this.subscription.unsubscribe();
  }

  private asyncViewPack(): void {
    
    if(this.isDebug()) console.log("my-info / asyncViewPack / 시작");

    // 이미 View 기본정보가 들어왔다면 바로 가져온다. 
    if(this.watchTower.getIsViewPackReady()) {
      if(this.isDebug()) console.log("my-info / asyncViewPack / isViewPackReady : ",true);
      this.init();
    } // end if

    // View에 필요한 기본 정보가 비동기로 들어올 경우, 처리.
    this.watchTower.isViewPackReady$.subscribe(
      (isViewPackReady:boolean) => {
      if(this.isDebug()) console.log("my-info / asyncViewPack / subscribe / isViewPackReady : ",isViewPackReady);
      
      this.init();
    }); // end subscribe    

  }
  private setViewPack() :void {
    this.isAdmin = this.watchTower.getIsAdminServer();
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
    // 페이지 진입을 기록합니다.
    this.logActionPage();
    // 쿼리 스트링으로 전달받을 parameter들을 가져옵니다.
    this.getQueryString();
    // 로그인, 회원 등록의 경우, 최상단 메뉴를 가립니다.
    this.watchTower.announceToggleTopMenu(false);
    this.watchTower.announceToggleFooter(false);

  }
  
  private logActionPage() :void {

    if(this.isDebug()) console.log("facebook-callback / getQueryString / init");

    // 페이지 진입을 기록으로 남깁니다.
    this.myLoggerService.logActionPage(
      // apiKey:string
      this.watchTower.getApiKey(),
      // pageType:string
      this.myLoggerService.pageTypeLoginFacebook
    ).then((myResponse:MyResponse) => {
      // 로그 등록 결과를 확인해볼 수 있습니다.
      if(this.isDebug()) console.log("facebook-callback / getQueryString / myResponse : ",myResponse);
    })
  }    

  private getQueryString() :void {

    if(this.isDebug()) console.log("facebook-callback / getQueryString / init");

    // 리다이렉트로 전달된 외부 쿼리 스트링 파라미터를 가져옵니다.
    this.subscription = this.activatedRoute.queryParams.subscribe(
      (param: any) => {

        if(this.isDebug()) console.log("facebook-callback / getQueryString / param : ",param);

        this.code = param['code'];
        this.state = param['state'];

        if(this.isDebug()) console.log("facebook-callback / getQueryString / this.code : ",this.code);
        if(this.isDebug()) console.log("facebook-callback / getQueryString / this.state : ",this.state);

        if(  null != this.code && 
             "" != this.code && 
             null != this.state && 
             "" != this.state) {

          this.getState(this.state, this.code);
        
        } // end if
      }
    ); // end subscribe
  }

  private getState(state:string, code:string) :void {

    if(this.isDebug()) console.log("facebook-callback / getState / init");

    if(null == state || "" == state) {
      return;
    }
    if(null == code || "" == code) {
      return;
    }

    if(this.isDebug()) console.log("facebook-callback / getState / state : ",state);
    if(this.isDebug()) console.log("facebook-callback / getState / code : ",code);

    this.loginService
    .getFacebookState(state)
    .then((myResponse:MyResponse) => {

      if(this.isDebug()) console.log("facebook-callback / getState / getFacebookState / myResponse : ",myResponse);

      if( myResponse.isSuccess() ) {
        this.isValidState = myResponse.getDataProp("is_valid_state");
      }

      if(this.isDebug()) console.log("facebook-callback / getState / getFacebookState / this.isValidState : ",this.isValidState);

      // Session에 저장된 state와 비교합니다.
      if(this.isValidState) {

        // 1. state가 정상적일 경우, 다음 단계를 진행
        if(this.isDebug()) console.log("facebook-callback / getFacebookState / state가 정상적일 경우, 다음 단계를 진행");

        this.getAccessToken(code);

      } else {

        // 2. state가 다를 경우, 사용자에게 메시지 노출. '비정상적인 접근입니다.'. 메시지 확인 뒤, 로그인 홈으로 이동.
        // - 상황 정보를 로그로 남김. ex) '비정상 로그인 접근'
        if(this.isDebug()) console.log("facebook-callback / getFacebookState / state가 다를 경우, 사용자에게 메시지 노출. 메시지 확인 뒤, 로그인 홈으로 이동");

        // 에러 로그 등록
        this.myLoggerService.logError(
          // apiKey:string
          this.watchTower.getApiKey(),
          // errorType:string
          this.myLoggerService.errorAPIFailed,
          // errorMsg:string
          `facebook-callback / getFacebookState / Failed! / state : ${state}`
        );

      } // end if
    }); // end getFacebookState

  } // end function

  private getAccessToken(code:string) :void {

    if(this.isDebug()) console.log("facebook-callback / getAccessToken / init");

    this.loginService
    .getFacebookAccess(code)
    .then((myResponse:MyResponse) => {

      if(this.isDebug()) console.log("facebook-callback / getAccessToken / myResponse : ",myResponse);

      if( myResponse.isSuccess() && null != myResponse.digDataProp(["result","access_token"]) ) {
        this.getMe();
      } else {
        // 에러 로그 등록
        this.myLoggerService.logError(
          // apiKey:string
          this.watchTower.getApiKey(),
          // errorType:string
          this.myLoggerService.errorAPIFailed,
          // errorMsg:string
          `facebook-callback / getAccessToken / Failed! / code : ${code}`
        );
      } // end if
    });     

  } // end method

  private getMe() :void {

    if(this.isDebug()) console.log("facebook-callback / getMe / init");

    this.loginService
    .getFacebookMe()
    .then((myResponse:MyResponse) => {

      if(this.isDebug()) console.log("facebook-callback / getMe / myResponse : ",myResponse);

      if(myResponse.isFailed() || null == myResponse.digDataProp(["me","facebook_id"])) {
        // TODO - 페이스북에서 유저 정보를 가져오는데 실패했습니다. 로그를 기록, 홈으로 이동합니다.
        if(this.isDebug()) console.log("facebook-callback / 페이스북에서 유저 정보를 가져오는데 실패했습니다.");
        // 에러 로그 등록
        this.myLoggerService.logError(
          // apiKey:string
          this.watchTower.getApiKey(),
          // errorType:string
          this.myLoggerService.errorAPIFailed,
          // errorMsg:string
          `facebook-callback / getMe / Failed!`
        );        
        return;
      }

      // 페이스북 로그인 성공!
      // 로그인한 유저 정보를 가져오는데 성공했습니다!
      let facebookId = myResponse.digDataProp(["me","facebook_id"]);
      let user = myResponse.digDataProp(["me"]);

      if(this.isDebug()) console.log("facebook-callback / getMe / facebookId : ",facebookId);
      if(this.isDebug()) console.log("facebook-callback / getMe / user : ",user);

      if( myResponse.isSuccess() && 
          null != user && 
          null != user["mobile"] &&
          "" != user["mobile"] ) {

        // 페이스북 로그인 성공. 등록된 유저 정보가 문제 없음. 
        // 로그인이 성공했으므로, 서버에 해당 유저의 로그인 쿠키를 만들어야 함.        
        // 가져온 유저 정보를 전파.
        if(null != user) {
          let loginUser:User = new User().setJSON(user);
          if(this.isDebug()) console.log(`facebook-callback / getMe / loginUser : `,loginUser);

          // 회원 로그인 정보를 가져왔다면, 가져온 로그인 정보를 다른 컴포넌트들에게도 알려줍니다.
          this.watchTower.announceLogin(loginUser);

          // this.getTeacher(+user.id);
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

        }

        if(this.isDebug()) console.log("facebook-callback / 페이스북 로그인은 성공. 로그인이 성공했으므로, 서버에 해당 유저의 로그인 쿠키를 만들어야 함.");
        this.confirmUserFacebook(facebookId);
          
      } else {

        // 페이스북 로그인은 성공. 페이스북 유저 프로필에서 가져온 정보로 유저 등록됨. 
        // 하지만 추가 정보 필요.
        // 회원 가입창으로 이동.
        if(this.isDebug()) console.log("facebook-callback / 페이스북 로그인은 성공. 페이스북 유저 프로필에서 가져온 정보로 유저 등록됨.회원 가입창으로 이동.");
        this.router.navigate(['/login/signup/facebook', facebookId]);
        
      } // end if

    }); // end service

  }

  private confirmUserFacebook(facebookId:string) :void {

    if(this.isDebug()) console.log("facebook-callback / confirmUserFacebook / init");
    if(this.isDebug()) console.log(`facebook-callback / confirmUserFacebook / facebookId : ${facebookId}`);

    this.userService
    .confirmUserFacebook(this.myCheckerService.getAPIKey(), facebookId)
    .then((myResponse:MyResponse) => {

      if(this.isDebug()) console.log("facebook-callback / confirmUserFacebook / myResponse : ",myResponse);

      if(myResponse.isFailed()) {
        // facebook id로 쿠키 인증 실패. 홈으로 이동.
        if(this.isDebug()) console.log("facebook-callback / confirmUserFacebook / facebook id로 쿠키 인증 실패. 홈으로 이동.");
        this.router.navigate([this.redirectUrl]);

        // 에러 로그 등록
        this.myLoggerService.logError(
          // apiKey:string
          this.watchTower.getApiKey(),
          // errorType:string
          this.myLoggerService.errorAPIFailed,
          // errorMsg:string
          `facebook-callback / getMe / confirmUserFacebook / Failed!`
        );
        return;
      }

      // 쿠키 인증 성공!
      // 로그인 직전 페이지로 리다이렉트. 
      // 돌아갈 주소가 없다면, 홈으로 이동.
      let redirectUrl:string = this.myCookie.getCookie("redirectUrl");
      if(null == redirectUrl || "" == redirectUrl) {
        redirectUrl = '/class-center';
      }

      if(this.isDebug()) console.log("facebook-callback / getUserByKakaoId / redirectUrl : ",redirectUrl);
      this.router.navigate([redirectUrl]);
      
    }); // end userService    

  }

} // end class