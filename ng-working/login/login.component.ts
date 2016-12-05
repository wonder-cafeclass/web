import {  Component, 
          Input, 
          Output,
          ViewChild,
          OnInit }              from '@angular/core';
import { Router,
         NavigationExtras }     from '@angular/router';

import { AuthService }          from '../auth/auth.service';
import { LoginService }         from './service/login.service';
import { UserService }          from '../users/service/user.service';

import { EmailComponent }       from './signup/email/email.component';
import { PasswordComponent }    from './signup/password/password.component';

import { MyLoggerService }      from '../util/service/my-logger.service';
import { MyCheckerService }     from '../util/service/my-checker.service';
import { MyEventService }       from '../util/service/my-event.service';
import { MyEvent }              from '../util/model/my-event';

import { MyEventWatchTowerService } from '../util/service/my-event-watchtower.service';

@Component({
  moduleId: module.id,
  selector: 'login',
  templateUrl: 'login.component.html',
  styleUrls: [ 'login.component.css' ]
})
export class LoginComponent implements OnInit {

  kakaoAuthUrl: string;
  naverAuthUrl: string;
  facebookAuthUrl: string;
  cafeclassAuthUrl: string="http://google.co.kr";

  @ViewChild(EmailComponent)
  private emailComponent: EmailComponent;

  @ViewChild(PasswordComponent)
  private passwordComponent: PasswordComponent;

  private email:string;
  private password:string;

  warningMsgHead:string;
  warningMsgTail:string;

  private redirectUrl:string="/class-center";
  private apiKey:string;
  isAdmin:boolean=false;
  errorMsgArr: string[]=[];

  constructor(  public authService: AuthService, 
                public loginService: LoginService, 
                private userService:UserService,
                public myLoggerService: MyLoggerService,
                public myCheckerService:MyCheckerService,
                private myEventService:MyEventService,
                private myEventWatchTowerService:MyEventWatchTowerService, 
                public router: Router) {

  }

  ngOnInit(): void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("login / ngOnInit / init");

    // 운영 서버인지 서비스 서버인지 판단하는 플래그값 가져옴.
    this.setIsAdmin();

    // my-checker.service의 apikey 가져옴. 
    this.setMyCheckerReady();

    // REMOVE ME
    /*
    // 로그인되어 있는 회원인지 먼저 확인. 
    // 로그인되어 있는 상태라면 홈으로 이동시킵니다.

    // 회원 로그인 쿠키를 가져옵니다.
    // 로그인 이후 만들어진 쿠키와 유저 정보가 있다면 DB를 통해 가져옵니다.
    this.myCheckerService.getReady().then(() => {
      this.userService.getUserCookie(this.myCheckerService.getAPIKey()).then(result => {
        if(null != result && null != result.user) {
          // 쿠키에 등록된 유저 정보가 있습니다. 홈으로 이동합니다.
          this.router.navigate(['/class-center']);
        } else {
          // 쿠키에 등록된 유저 정보가 없습니다. 초기화합니다.
          this.init();
        }
      });
    }); // end Promise
    */

  }

  private setIsAdmin() :void {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("login / setIsAdmin / 시작");

    // 운영 서버인지 서비스 서버인지 판단하는 플래그값 가져옴.
    this.myEventWatchTowerService.isAdmin$.subscribe(
      (isAdmin:boolean) => {

      if(isDebug) console.log("login / setIsAdmin / isAdmin : ",isAdmin);
      this.isAdmin = isAdmin;
    });
  }  

  private setMyCheckerReady() :void {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("login / setMyCheckerReady / 시작");

    this.myEventWatchTowerService.myCheckerServiceReady$.subscribe(
      (isReady:boolean) => {

      if(isDebug) console.log("login / setMyCheckerReady / isReady : ",isReady);

      if(!isReady) {
        // 에러 로그 등록
        this.myLoggerService.logError(
          // apiKey:string
          this.myEventWatchTowerService.getApiKey(),
          // errorType:string
          this.myLoggerService.errorTypeNotValidValue,
          // errorMsg:string
          `login / setMyCheckerReady / Failed! / isReady : ${isReady}`
        );        
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

      this.checkLoginUser();

    });    
  }  

  private checkLoginUser(): void {
    this.userService.getUserCookie(this.myCheckerService.getAPIKey()).then(result => {
      if(null != result && null != result.user) {
        // 쿠키에 등록된 유저 정보가 있습니다. 홈으로 이동합니다.
        this.router.navigate([this.redirectUrl]);
      } else {
        // 쿠키에 등록된 유저 정보가 없습니다. 초기화합니다.
        this.init();
      }
    });
  }

  private init() :void {
    
    // 페이지 진입을 기록으로 남깁니다.
    this.myLoggerService.logActionPage(
      // apiKey:string
      this.myEventWatchTowerService.getApiKey(),
      // pageType:string
      this.myLoggerService.pageTypeLogin
    );    

    // 각 플랫폼 별로 로그인 할 수 있는 주소들을 가져옵니다.
    // 1. kakao
    this.loginService
    .getKakaoAuthUrl()
    .then(kakaoAuthUrl => {
      this.kakaoAuthUrl = kakaoAuthUrl;      
    });

    // 2. naver
    this.loginService
    .getNaverAuthUrl()
    .then(naverAuthUrl => {
      this.naverAuthUrl = naverAuthUrl;
    });

    // 3. facebook
    this.loginService
    .getFacebookAuthUrl()
    .then(facebookAuthUrl => {
      this.facebookAuthUrl = facebookAuthUrl;
    });

    // 로그인, 회원 등록의 경우, 최상단 메뉴를 가립니다.
    this.myEventWatchTowerService.announceToggleTopMenu(false);    
  }

  onChangedFromChild(myEvent:MyEvent) :void {
    // 자식 엘리먼트들의 이벤트 처리

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("login / onChangedFromChild / 시작");
    if(isDebug) console.log("login / onChangedFromChild / myEvent : ",myEvent);

    if(null == myEvent) {
      if(isDebug) console.log("login / onChangedFromChild / 중단 / null == myEvent");
      return;
    }
    if(null == myEvent.myChecker) {
      if(isDebug) console.log("login / onChangedFromChild / 중단 / null == myEvent.myChecker");
      return;
    }
    if(null == myEvent.value) {
      if(isDebug) console.log("login / onChangedFromChild / 중단 / null == myEvent.value");
      return;
    }

    // 모든 myEvent는 myChecker를 가지고 들어와야 합니다.
    // myChecker로 다시 한번 더 검사, 통과해야만 사용할 수 있습니다.
    let isOK:boolean = this.myCheckerService.isOK(myEvent.myChecker, myEvent.value);
    if(!isOK) {
      if(isDebug) console.log("login / onChangedFromChild / 중단 / !isOK");
      return;
    }

    // 정상적인 값을 가진 이벤트입니다.
    if(this.myEventService.ON_CHANGE === myEvent.eventName) {

      if(this.myEventService.KEY_USER_EMAIL === myEvent.key) {

        this.email = myEvent.value;
        if(isDebug) console.log("login / onChangedFromChild / this.email : ",this.email);

      } else if(this.myEventService.KEY_USER_PASSWORD === myEvent.key) {

        this.password = myEvent.value;
        if(isDebug) console.log("login / onChangedFromChild / this.password : ",this.password);

      } // end if

    } else if(this.myEventService.ON_KEYUP_ENTER === myEvent.eventName) {

      if(this.myEventService.KEY_USER_EMAIL === myEvent.key) {

        this.email = myEvent.value;
        if(isDebug) console.log("login / onChangedFromChild / ON_KEYUP_ENTER / KEY_USER_EMAIL ",this.email);
        // 이메일 입력 칸에서 엔터키를 눌렀습니다. 

        // 1. 이메일과 패스워드가 유효하다면 유저 확인 프로세스를 진행합니다.
        // 2. 그렇지 않다면 안내 메시지를 유저에게 보여줍니다.
        this.verifyEmailNPassword();

      } else if(this.myEventService.KEY_USER_PASSWORD === myEvent.key) {

        this.password = myEvent.value;
        if(isDebug) console.log("login / onChangedFromChild / ON_KEYUP_ENTER / KEY_USER_PASSWORD ",this.password);
        // 패스워드 입력 칸에서 엔터키를 눌렀습니다. 

        // 1. 이메일과 패스워드가 유효하다면 유저 확인 프로세스를 진행합니다.
        // 2. 그렇지 않다면 안내 메시지를 유저에게 보여줍니다.
        this.verifyEmailNPassword();

      }  

    } // end if

    if(isDebug) console.log("login / onChangedFromChild / done");
  }

  verifyEmailNPassword():void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("login / verifyEmailNPassword / 시작");


    let warningMsgHead:string = "아이디 또는 비밀번호를 다시 확인하세요."; 
    let warningMsgTail:string = "카페클래스에 등록되지 않은 아이디거나, 아이디 또는 비밀번호를 잘못 입력하셨습니다."; 
    this.warningMsgHead = null;
    this.warningMsgTail = null;
    if(null == this.email || "" == this.email) {
      if(isDebug) console.log("login / verifyEmailNPassword / 중단 / 이메일 주소에 문제가 있습니다.", this.email);
      this.warningMsgHead = warningMsgHead;
      this.warningMsgTail = warningMsgTail;
      return;
    }

    if(null == this.password || "" == this.password) {
      if(isDebug) console.log("login / verifyEmailNPassword / 중단 / 암호에 문제가 있습니다.", this.password);
      this.warningMsgHead = warningMsgHead;
      this.warningMsgTail = warningMsgTail;
      return;
    }

    // DB에 이메일 주소와 암호를 조회합니다.
    let apiKey:string = this.myCheckerService.getAPIKey();
    if(null != apiKey && "" != apiKey) {
      this.userService
      .confirmUserEmailPassword(apiKey, this.email, this.password)
      .then(result=> {

        if(isDebug) console.log("login / confirmUserEmailPassword / result : ",result);

        if(null == result || null == result.success || !result.success) {
          if(isDebug) console.log("login / confirmUserEmailPassword / 중단 / 회원 인증에 실패했습니다. 메시지를 화면에 노출합니다.");
          this.warningMsgHead = warningMsgHead;
          this.warningMsgTail = warningMsgTail;
          return;
        }

        if(isDebug) console.log("login / confirmUserEmailPassword / 중단 / 회원 인증에 성공했습니다. 홈화면으로 이동합니다.");
        this.router.navigate(['/class-center']);

      });
    } // end service    

  }

  onClickLogin(event):void {

    event.stopPropagation();
    event.preventDefault();

    this.verifyEmailNPassword();

  }

}
