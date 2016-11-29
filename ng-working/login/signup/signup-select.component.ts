import {  Component, 
          Input, 
          Output,
          OnInit }              from '@angular/core';
import { Router,
         NavigationExtras }     from '@angular/router';
import { AuthService }          from '../../auth/auth.service';
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
  cafeclassAuthUrl: string="http://google.co.kr";

  constructor(  public authService: AuthService, 
                public loginService: LoginService, 
                public myLoggerService: MyLoggerService, 
                private myEventWatchTowerService:MyEventWatchTowerService,
                public router: Router) {

  }

  ngOnInit(): void {

    // 페이지 진입을 기록으로 남깁니다.
    this.myLoggerService.logActionPage(this.myLoggerService.pageKeySignupSelect);    

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
}
