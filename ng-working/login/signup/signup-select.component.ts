import { Component, 
         Input, 
         Output,
         OnInit,
         AfterViewInit }            from '@angular/core';

import { Router,
         NavigationExtras }         from '@angular/router';

import { LoginService }             from '../service/login.service';

import { MyLoggerService }          from '../../util/service/my-logger.service';
import { MyCheckerService }         from '../../util/service/my-checker.service';
import { MyEventWatchTowerService } from '../../util/service/my-event-watchtower.service';

import { MyResponse }               from '../../util/model/my-response';

@Component({
  moduleId: module.id,
  selector: 'signup-select',
  templateUrl: 'signup-select.component.html',
  styleUrls: [ 'signup-select.component.css' ]
})
export class SignupSelectComponent implements OnInit, AfterViewInit {

  kakaoAuthUrl: string;
  naverAuthUrl: string;
  facebookAuthUrl: string;

  isAdmin:boolean=false;
  errorMsgArr: string[]=[];
  
  constructor(  public loginService: LoginService, 
                public myLoggerService: MyLoggerService, 
                public myCheckerService:MyCheckerService,
                private watchTower:MyEventWatchTowerService,
                public router: Router) {

  }

  ngOnInit(): void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("signup-select / ngOnInit / 시작");

  } // end ngOnInit

  ngAfterViewInit(): void {

    // 자식 뷰가 모두 완료된 이후에 초기화를 진행.
    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("signup-select / ngAfterViewInit");

    this.asyncViewPack();

  }

  private asyncViewPack(): void {
    
    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("signup-select / asyncViewPack / 시작");

    // 이미 View 기본정보가 들어왔다면 바로 가져온다. 
    if(this.watchTower.getIsViewPackReady()) {
      if(isDebug) console.log("signup-select / asyncViewPack / isViewPackReady : ",true);
      this.init();
    } // end if

    // View에 필요한 기본 정보가 비동기로 들어올 경우, 처리.
    this.watchTower.isViewPackReady$.subscribe(
      (isViewPackReady:boolean) => {
      if(isDebug) console.log("signup-select / asyncViewPack / subscribe / isViewPackReady : ",isViewPackReady);
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
  
  private init(): void {

    // 뷰에 필요한 공통 정보를 설정합니다.
    this.setViewPack();

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("signup-select / init / 시작");

    // 페이지 진입을 기록으로 남깁니다.
    this.myLoggerService.logActionPage(
      // apiKey:string
      this.watchTower.getApiKey(),
      // pageType:string
      this.myLoggerService.pageTypeSignupSelect
    );    

    // 각 플랫폼 별로 로그인 할 수 있는 주소들을 가져옵니다.
    // 1. kakao
    this.loginService
    .getKakaoAuthUrl()
    .then((myResponse:MyResponse) => {

      if(isDebug) console.log("signup-select / getKakaoAuthUrl / 시작");
      if(isDebug) console.log("signup-select / getKakaoAuthUrl / myResponse : ",myResponse);

      if(myResponse.isSuccess()) {

        this.kakaoAuthUrl = myResponse.getDataProp("auth_url");
        if(isDebug) console.log("signup-select / getKakaoAuthUrl / this.kakaoAuthUrl : ",this.kakaoAuthUrl);

      } else {

        // 에러 상황. 
        // 에러 원인에 대한 로그를 화면에 표시!
        this.errorMsgArr.push(myResponse.getError());
        this.watchTower.announceErrorMsgArr(this.errorMsgArr);

      } // end if

    });

    // 2. naver
    this.loginService
    .getNaverAuthUrl()
    .then((myResponse:MyResponse) => {

      if(isDebug) console.log("signup-select / getNaverAuthUrl / 시작");
      if(isDebug) console.log("signup-select / getNaverAuthUrl / myResponse : ",myResponse);

      if(myResponse.isSuccess()) {

        this.naverAuthUrl = myResponse.getDataProp("auth_url");
        if(isDebug) console.log("signup-select / getNaverAuthUrl / this.naverAuthUrl : ",this.naverAuthUrl);

      } else {
        // 에러 상황. 
        // 에러 원인에 대한 로그를 화면에 표시!
        this.errorMsgArr.push(myResponse.getError());
        this.watchTower.announceErrorMsgArr(this.errorMsgArr);

      } // end if

    });

    // 3. facebook
    this.loginService
    .getFacebookAuthUrl()
    .then((myResponse:MyResponse) => {

      if(isDebug) console.log("signup-select / getFacebookAuthUrl / 시작");
      if(isDebug) console.log("signup-select / getFacebookAuthUrl / myResponse : ",myResponse);

      if(myResponse.isSuccess()) {

        this.facebookAuthUrl = myResponse.getDataProp("auth_url");
        if(isDebug) console.log("signup-select / getFacebookAuthUrl / this.facebookAuthUrl : ",this.facebookAuthUrl);

      } else {
        // 에러 상황. 
        // 에러 원인에 대한 로그를 화면에 표시!
        this.errorMsgArr.push(myResponse.getError());
        this.watchTower.announceErrorMsgArr(this.errorMsgArr);
        
      } // end if

    });

    // 로그인, 회원 등록의 경우, 최상단 메뉴를 가립니다.
    this.watchTower.announceToggleTopMenu(false);
    this.watchTower.announceToggleFooter(false);

  } // end init

  onClickLogo(event):void {

    event.stopPropagation();
    event.preventDefault();

    // 홈으로 이동
    this.router.navigate(["/"]);

  }

}
