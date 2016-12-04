import {  Component, 
          Input, 
          Output,
          OnInit }              from '@angular/core';
import { Router,
         NavigationExtras }     from '@angular/router';
import { AuthService }          from '../../auth.service';
import { LoginService }         from '../service/login.service';
import { MyLoggerService }      from '../../util/service/my-logger.service';

import { MyEventWatchTowerService } from '../../util/service/my-event-watchtower.service';

@Component({
  moduleId: module.id,
  selector: 'signup-select',
  templateUrl: 'signup-select.component.html',
  styleUrls: [ 'signup-select.component.css' ]
})
export class SignupSelectComponent implements OnInit {

  kakaoAuthUrl: string;
  naverAuthUrl: string;
  facebookAuthUrl: string;

  errorMsgArr: string[]=[];

  isAdmin:boolean=false;
  
  constructor(  public authService: AuthService, 
                public loginService: LoginService, 
                public myLoggerService: MyLoggerService, 
                private myEventWatchTowerService:MyEventWatchTowerService,
                public router: Router) {

  }

  ngOnInit(): void {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("signup-select / ngOnInit / 시작");

    // 운영 서버인지 서비스 서버인지 판단하는 플래그값 가져옴.
    this.authService
    .getAdminAuth()
    .then(
      result => {
        if(null != result.is_admin) {
          this.isAdmin = result.is_admin;
        }

        this.init();
      }
    ); // end service
    
  } // end ngOnInit


  init(): void {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("signup-select / init / 시작");

    // 페이지 진입을 기록으로 남깁니다.
    this.myLoggerService.logActionPage(this.myLoggerService.pageKeySignupSelect);    

    // 각 플랫폼 별로 로그인 할 수 있는 주소들을 가져옵니다.
    // 1. kakao
    this.loginService
    .getKakaoAuthUrl()
    .then(output => {

      if(isDebug) console.log("signup-select / getKakaoAuthUrl / 시작");
      if(isDebug) console.log("signup-select / getKakaoAuthUrl / output : ",output);

      if( null != output && 
          null != output["auth_url"] && 
          "" != output["auth_url"]) {

        this.kakaoAuthUrl = output["auth_url"];
        if(isDebug) console.log("signup-select / getKakaoAuthUrl / this.kakaoAuthUrl : ",this.kakaoAuthUrl);

      } else {
        // 에러 상황. 
        // 에러 원인에 대한 로그를 전달해준다.

        this.errorMsgArr.push(output);

      } // end if

    });

    // 2. naver
    this.loginService
    .getNaverAuthUrl()
    .then(output => {

      if(isDebug) console.log("signup-select / getNaverAuthUrl / 시작");
      if(isDebug) console.log("signup-select / getNaverAuthUrl / output : ",output);

      if( null != output && 
          null != output["auth_url"] && 
          "" != output["auth_url"]) {

        this.naverAuthUrl = output["auth_url"];
        if(isDebug) console.log("signup-select / getNaverAuthUrl / this.naverAuthUrl : ",this.naverAuthUrl);

      } else {
        // 에러 상황. 
        // 에러 원인에 대한 로그를 전달해준다.

        this.errorMsgArr.push(output);

      } // end if

      // this.naverAuthUrl = naverAuthUrl;
    });

    // 3. facebook
    this.loginService
    .getFacebookAuthUrl()
    .then(output => {

      if(isDebug) console.log("signup-select / getFacebookAuthUrl / 시작");
      if(isDebug) console.log("signup-select / getFacebookAuthUrl / output : ",output);

      if( null != output && 
          null != output["auth_url"] && 
          "" != output["auth_url"]) {

        this.facebookAuthUrl = output["auth_url"];
        if(isDebug) console.log("signup-select / getFacebookAuthUrl / this.facebookAuthUrl : ",this.facebookAuthUrl);

      } else {
        // 에러 상황. 
        // 에러 원인에 대한 로그를 전달해준다.

        this.errorMsgArr.push(output);
        
      } // end if

      // this.facebookAuthUrl = facebookAuthUrl;
    });

    // 로그인, 회원 등록의 경우, 최상단 메뉴를 가립니다.
    this.myEventWatchTowerService.announceToggleTopMenu(false);    

  } // end init

}
