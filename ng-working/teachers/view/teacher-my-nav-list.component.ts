import {  Component, 
          ViewChild,
          OnInit, 
          AfterViewInit,
          SimpleChanges,
          Output, 
          EventEmitter,
          Input }                     from '@angular/core';

import { MyEventService }             from '../../util/service/my-event.service';
import { MyEvent }                    from '../../util/model/my-event';

import { MyCheckerService }           from '../../util/service/my-checker.service';
import { MyChecker }                  from '../../util/model/my-checker';

import { MyLoggerService }            from '../../util/service/my-logger.service';

import { KlassColorService }          from '../../klass/service/klass-color.service';
import { KlassRadioBtnService }       from '../../klass/service/klass-radiobtn.service';

import { RadioBtnOption }             from '../../widget/radiobtn/model/radiobtn-option';

import { MyEventWatchTowerService }   from '../../util/service/my-event-watchtower.service';
import { MyResponse }                 from '../../util/model/my-response';


@Component({
  moduleId: module.id,
  selector: 'teacher-my-nav-list',
  templateUrl: 'teacher-my-nav-list.component.html',
  styleUrls: [ 'teacher-my-nav-list.component.css' ]
})
export class TeacherMyNavListComponent implements OnInit, AfterViewInit {

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

  ngOnInit(): void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("teacher-my-nav-list / ngOnInit / init");

  }

  ngAfterViewInit(): void {

    // 자식 뷰가 모두 완료된 이후에 초기화를 진행.
    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("teacher-my-nav-list / ngAfterViewInit");

    this.asyncViewPack();

  } 
  
  private asyncViewPack(): void {
    
    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("teacher-my-nav-list / asyncViewPack / 시작");

    // 이미 View 기본정보가 들어왔다면 바로 가져온다. 
    if(this.watchTower.getIsViewPackReady()) {
      if(isDebug) console.log("teacher-my-nav-list / asyncViewPack / isViewPackReady : ",true);
      this.init();
    } // end if

    // View에 필요한 기본 정보가 비동기로 들어올 경우, 처리.
    this.watchTower.isViewPackReady$.subscribe(
      (isViewPackReady:boolean) => {
      if(isDebug) console.log("teacher-my-nav-list / asyncViewPack / subscribe / isViewPackReady : ",isViewPackReady);
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

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("teacher-my-nav-list / init");

    // COLOR
    this.colorWhite = this.klassColorService.white;
    this.colorOrange = this.klassColorService.orange;
    this.colorGray = this.klassColorService.gray;

    if(isDebug) console.log("teacher-my-nav-list / init / this.colorWhite : ",this.colorWhite);
    if(isDebug) console.log("teacher-my-nav-list / init / this.colorOrange : ",this.colorOrange);
    if(isDebug) console.log("teacher-my-nav-list / init / this.colorGray : ",this.colorGray);

    this.navTabsOptions = 
    this.radiobtnService.getNavTabsTeacherMyInfo(
      // user:User
      null,
      // keyFocus:string
      null
    );
    this.showMyInfo = true;

    if(isDebug) console.log("teacher-my-nav-list / this.navTabsOptions : ",this.navTabsOptions);    

  }

  onChangedFromChild(myEvent:MyEvent, myinfo, myhistory, mypayment, myfavorite) {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("teacher-my-nav-list / onChangedFromChild / init");
    if(isDebug) console.log("teacher-my-nav-list / onChangedFromChild / myEvent : ",myEvent);
    if(isDebug) console.log("teacher-my-nav-list / onChangedFromChild / myEvent.key : ",myEvent.key);

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