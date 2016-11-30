import {  Component, 
          Input, 
          Output,
          ViewChild,
          OnInit }              from '@angular/core';
import { Router,
         NavigationExtras }     from '@angular/router';

import { AuthService }          from '../auth/auth.service';
import { LoginService }         from './service/login.service';

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

  constructor(  public authService: AuthService, 
                public loginService: LoginService, 
                public myLoggerService: MyLoggerService,
                public myCheckerService:MyCheckerService,
                private myEventService:MyEventService,
                private myEventWatchTowerService:MyEventWatchTowerService, 
                public router: Router) {

    // 서버에서 파라미터를 검증할 check 데이터를 받아옵니다.
    this.myCheckerService.getReady();

  }

  ngOnInit(): void {

    // 페이지 진입을 기록으로 남깁니다.
    this.myLoggerService.logActionPage(this.myLoggerService.pageKeyLogin);    

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
      if(isDebug) console.log("login / onChangedFromChild / 중단 / null == myEven");
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

    } // end if

    if(isDebug) console.log("login / onChangedFromChild / done");
  }

  onClickLogin(event):void {

    event.stopPropagation();
    event.preventDefault();

    console.log("onClickLogin / this.email : ",this.email);
    console.log("onClickLogin / this.password : ",this.password);
  }  
}
