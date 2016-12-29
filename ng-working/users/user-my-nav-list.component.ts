import {  Component, 
          AfterViewInit,
          Output, 
          EventEmitter }              from '@angular/core';

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
export class UserMyNavListComponent implements AfterViewInit {

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
                private watchTower:MyEventWatchTowerService, 
                private myCheckerService:MyCheckerService) {}

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
      null
      // keyFocus:string
      , null
    );
    this.showMyInfo = true;

    if(this.isDebug()) console.log("user-my-nav-list / this.navTabsOptions : ",this.navTabsOptions);    

  }

  onChangedFromChild(myEvent:MyEvent, myinfo, myhistory, mypayment, myfavorite) {

    if(this.isDebug()) console.log("user-my-nav-list / onChangedFromChild / init");
    if(this.isDebug()) console.log("user-my-nav-list / onChangedFromChild / myEvent : ",myEvent);
    if(this.isDebug()) console.log("user-my-nav-list / onChangedFromChild / myEvent.key : ",myEvent.key);

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