import {  Component, 
          AfterViewInit,
          ViewChild,
          Output, 
          EventEmitter }              from '@angular/core';

import { MyEventService }             from '../util/service/my-event.service';
import { MyEvent }                    from '../util/model/my-event';

import { MyCheckerService }           from '../util/service/my-checker.service';
import { MyChecker }                  from '../util/model/my-checker';

import { MyLoggerService }            from '../util/service/my-logger.service';

import { MyEventWatchTowerService }   from '../util/service/my-event-watchtower.service';
import { MyResponse }                 from '../util/model/my-response';

import { KlassColorService }          from '../klass/service/klass-color.service';
import { KlassRadioBtnService }       from '../klass/service/klass-radiobtn.service';

import { RadioBtnOption }             from '../widget/radiobtn/model/radiobtn-option';

import { MyInfoComponent }            from './view/user-my-nav-list/my-info.component';
import { MyInfoDashboardComponent }   from './view/user-my-nav-list/my-info-dashboard.component';

@Component({
  moduleId: module.id,
  selector: 'user-my-nav-list',
  templateUrl: 'user-my-nav-list.component.html',
  styleUrls: [ 'user-my-nav-list.component.css' ]
})
export class UserMyNavListComponent implements AfterViewInit {

  navTabsOptions:RadioBtnOption[];

  colorWhite:string;
  colorOrange:string;
  colorGray:string;

  showHome:boolean=true;
  showMyInfo:boolean=false;
  showMyHistory:boolean=false;
  showMyPayment:boolean=false;
  showMyFavorite:boolean=false;

  @Output() emitter = new EventEmitter<any>();

  isAdmin:boolean=false;

  @ViewChild(MyInfoComponent)
  private myInfoComponent: MyInfoComponent;  

  @ViewChild(MyInfoDashboardComponent)
  private myInfoDashboardComponent: MyInfoDashboardComponent;  


  constructor(  private klassColorService:KlassColorService,
                public myEventService:MyEventService, 
                public myLoggerService:MyLoggerService,
                private radiobtnService:KlassRadioBtnService,
                private watchTower:MyEventWatchTowerService, 
                private myCheckerService:MyCheckerService) {

    this.radiobtnService.setWatchTower(this.watchTower);

    this.watchTower.announceIsLockedBottomFooterFlexible(false);

  }

  private isDebug():boolean {
    return this.watchTower.isDebug();
  }

  ngAfterViewInit(): void {

    // 자식 뷰가 모두 완료된 이후에 초기화를 진행.
    if(this.isDebug()) console.log("user-my-nav-list / ngAfterViewInit");

    this.asyncViewPack();

  } 
  
  private asyncViewPack(): void {
    
    if(this.isDebug()) console.log("user-my-nav-list / asyncViewPack / 시작");

    // 이미 View 기본정보가 들어왔다면 바로 가져온다. 
    if(this.watchTower.getIsViewPackReady()) {
      if(this.isDebug()) console.log("user-my-nav-list / asyncViewPack / isViewPackReady : ",true);
      this.init();
    } // end if

    // View에 필요한 기본 정보가 비동기로 들어올 경우, 처리.
    this.watchTower.isViewPackReady$.subscribe(
      (isViewPackReady:boolean) => {
      if(this.isDebug()) console.log("user-my-nav-list / asyncViewPack / subscribe / isViewPackReady : ",isViewPackReady);
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

    if(this.isDebug()) console.log("user-my-nav-list / init");

    // COLOR
    this.colorWhite = this.klassColorService.white;
    this.colorOrange = this.klassColorService.orange;
    this.colorGray = this.klassColorService.gray;

    if(this.isDebug()) console.log("user-my-nav-list / init / this.colorWhite : ",this.colorWhite);
    if(this.isDebug()) console.log("user-my-nav-list / init / this.colorOrange : ",this.colorOrange);
    if(this.isDebug()) console.log("user-my-nav-list / init / this.colorGray : ",this.colorGray);

    this.navTabsOptions = 
    this.radiobtnService.getNavTabsUserMyInfo(
      // user:User
      this.watchTower.getLoginUser()
      // keyFocus:string
      , this.watchTower.getMyEventService().KEY_USER_MY_INFO_DASHBOARD
    );
    if(this.isDebug()) console.log("user-my-nav-list / this.navTabsOptions : ",this.navTabsOptions);
  }

  resetNavFlag():void {
    // 모든 플래그값을 초기화
    this.showHome = false;
    this.showMyInfo = false;
    this.showMyHistory = false;
    this.showMyPayment = false;
    this.showMyFavorite = false;

  }

  onChangedFromChild(myEvent:MyEvent) {

    if(this.isDebug()) console.log("user-my-nav-list / onChangedFromChild / init");
    if(this.isDebug()) console.log("user-my-nav-list / onChangedFromChild / myEvent : ",myEvent);
    if(this.isDebug()) console.log("user-my-nav-list / onChangedFromChild / myEvent.key : ",myEvent.key);

    if(this.isDebug()) console.log("klass-detail / onChangedFromChild / 시작");
    if(this.isDebug()) console.log("klass-detail / onChangedFromChild / myEvent : ",myEvent);

    let isOK:boolean = this.myCheckerService.isOK(myEvent.myChecker, myEvent.value);
    if(!isOK) {
      if(this.isDebug()) console.log("klass-detail / onChangedFromChild / 중단 / 값이 유효하지 않습니다.");
      let lastHistory = this.myCheckerService.getLastHistory();
      if(this.isDebug()) console.log("klass-detail / onChangedFromChild / lastHistory : ",lastHistory);
      return;
    } // end if

    if(myEvent.hasEventName(this.myEventService.ON_READY)) {

      if(myEvent.hasKey(this.myEventService.KEY_USER_MY_INFO_DASHBOARD)) {

        if(  null != myEvent.metaObj ) {
          this.myInfoDashboardComponent = myEvent.metaObj;
        } // end if

      } else if(myEvent.hasKey(this.myEventService.KEY_USER_MY_INFO)) {

        if(  null != myEvent.metaObj ) {
          this.myInfoComponent = myEvent.metaObj;
        } // end if

      } // end if

      //KEY_USER_MY_INFO_DASHBOARD

    } else if(myEvent.hasEventName(this.myEventService.ON_CHANGE)) {


      if(myEvent.hasKey(this.myEventService.KEY_USER_MY_INFO_DASHBOARD)) {

        this.resetNavFlag();
        this.showHome = true;

      } else if(myEvent.hasKey(this.myEventService.KEY_USER_MY_INFO)) {

        this.resetNavFlag();
        this.showMyInfo = true;

      } else if(myEvent.hasKey(this.myEventService.KEY_USER_MY_HISTORY)) {

        this.resetNavFlag();
        this.showMyHistory = true;

      } else if(myEvent.hasKey(this.myEventService.KEY_USER_MY_PAYMENT)) {

        this.resetNavFlag();
        this.showMyPayment = true;

      } else if(myEvent.hasKey(this.myEventService.KEY_USER_MY_FAVORITE)) {

        this.resetNavFlag();
        this.showMyFavorite = true;

      } // end if

    } // end if

  } // end method

}