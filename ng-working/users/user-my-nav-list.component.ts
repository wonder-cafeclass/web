import {  Component, 
          ViewChild,
          OnInit, 
          SimpleChanges,
          Output, 
          EventEmitter,
          Input }                     from '@angular/core';

import { MyEventService }             from '../util/service/my-event.service';
import { MyEvent }                    from '../util/model/my-event';

import { MyCheckerService }           from '../util/service/my-checker.service';
import { MyChecker }                  from '../util/model/my-checker';

import { MyLoggerService }            from '../util/service/my-logger.service';

import { KlassColorService }          from '../klass/service/klass-color.service';
import { KlassRadioBtnService }       from '../klass/service/klass-radiobtn.service';

import { RadioBtnOption }             from '../widget/radiobtn/model/radiobtn-option';

import { MyEventWatchTowerService }   from '../util/service/my-event-watchtower.service';
import { MyResponse }                 from '../util/model/my-response';


@Component({
  moduleId: module.id,
  selector: 'user-my-nav-list',
  templateUrl: 'user-my-nav-list.component.html',
  styleUrls: [ 'user-my-nav-list.component.css' ]
})
export class UserMyNavListComponent implements OnInit {

  navTabsOptions:RadioBtnOption[];

  colorWhite:string;
  colorOrange:string;
  colorGray:string;

  showMyInfo:boolean=false;
  showMyHistory:boolean=false;
  showMyPayment:boolean=false;
  showMyFavorite:boolean=false;

  @Output() emitter = new EventEmitter<any>();

  isAdmin:boolean=false;

  constructor(  private klassColorService:KlassColorService,
                public myEventService:MyEventService, 
                public myLoggerService:MyLoggerService,
                private radiobtnService:KlassRadioBtnService,
                private myEventWatchTowerService:MyEventWatchTowerService, 
                private myCheckerService:MyCheckerService) {}

  ngOnInit(): void {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("user-my-nav-list / ngOnInit / init");

    // 운영 서버인지 서비스 서버인지 판단하는 플래그값 가져옴.
    this.setIsAdmin();

    // my-checker.service의 apikey 가져옴. 
    this.setMyCheckerServiceReady();

  }

  private setIsAdmin() :void {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("user-my-nav-list / setIsAdmin / 시작");

    // 사전에 등록된 값을 가져옴. 페이지 이동시에는 직접 값을 가져와야 함.
    this.isAdmin = this.myEventWatchTowerService.getIsAdmin();
    if(isDebug) console.log("user-my-nav-list / setIsAdmin / 시작 / this.isAdmin : ",this.isAdmin);

    // 운영 서버인지 서비스 서버인지 판단하는 플래그값 가져옴.
    this.myEventWatchTowerService.isAdmin$.subscribe(
      (isAdmin:boolean) => {

      if(isDebug) console.log("user-my-nav-list / setIsAdmin / isAdmin : ",isAdmin);
      this.isAdmin = isAdmin;
    });
  }  

  private setMyCheckerServiceReady() :void {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("user-my-nav-list / setMyCheckerServiceReady / 시작");

    // 페이지 이동으로 진입한 경우, watch tower에 저장된 변수 값을 가져온다.
    if(this.myEventWatchTowerService.getIsMyCheckerReady()) {
      this.setMyCheckerService();
      this.init();
    }

    this.myEventWatchTowerService.myCheckerServiceReady$.subscribe(
      (isReady:boolean) => {

      if(isDebug) console.log("user-my-nav-list / setMyCheckerServiceReady / isReady : ",isReady);

      if(!isReady) {
        // 에러 로그 등록
        this.myLoggerService.logError(
          // apiKey:string
          this.myEventWatchTowerService.getApiKey(),
          // errorType:string
          this.myLoggerService.errorTypeNotValidValue,
          // errorMsg:string
          `user-my-nav-list / setMyCheckerServiceReady / Failed! / isReady : ${isReady}`
        );        
        return;
      }

      this.setMyCheckerService();
      this.init();
    });    
  }  

  private setMyCheckerService() :void {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("user-my-nav-list / setMyCheckerService / 시작");

    if(this.myEventWatchTowerService.getIsMyCheckerReady()) {

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

      if(isDebug) console.log("user-my-nav-list / setMyCheckerService / done!");
    } // end if

  }   

  private init() :void {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("user-my-nav-list / init");


    // COLOR
    this.colorWhite = this.klassColorService.white;
    this.colorOrange = this.klassColorService.orange;
    this.colorGray = this.klassColorService.gray;

    if(isDebug) console.log("user-my-nav-list / init / this.colorWhite : ",this.colorWhite);
    if(isDebug) console.log("user-my-nav-list / init / this.colorOrange : ",this.colorOrange);
    if(isDebug) console.log("user-my-nav-list / init / this.colorGray : ",this.colorGray);

    this.navTabsOptions = 
    this.radiobtnService.getNavTabsUserMyInfo(
      // user:User
      null
      // keyFocus:string
      , null
    );
    this.showMyInfo = true;

    if(isDebug) console.log("user-my-nav-list / this.navTabsOptions : ",this.navTabsOptions);    

  }

  onChangedFromChild(myEvent:MyEvent, myinfo, myhistory, mypayment, myfavorite) {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("user-my-nav-list / onChangedFromChild / init");
    if(isDebug) console.log("user-my-nav-list / onChangedFromChild / myEvent : ",myEvent);
    if(isDebug) console.log("user-my-nav-list / onChangedFromChild / myEvent.key : ",myEvent.key);

    // 모든 플래그값을 초기화
    this.showMyInfo = false;
    this.showMyHistory = false;
    this.showMyPayment = false;
    this.showMyFavorite = false;

    if(this.myEventService.KEY_USER_MY_INFO === myEvent.key) {
      this.showMyInfo = true;
    } else if(this.myEventService.KEY_USER_MY_HISTORY === myEvent.key) {
      this.showMyHistory = true;
    } else if(this.myEventService.KEY_USER_MY_PAYMENT === myEvent.key) {
      this.showMyPayment = true;
    } else if(this.myEventService.KEY_USER_MY_FAVORITE === myEvent.key) {
      this.showMyFavorite = true;
    }

  }

}