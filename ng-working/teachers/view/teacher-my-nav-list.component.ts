import {  Component, 
          ViewChild,
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

import { TeacherInfoDashboardComponent }  from './teacher-my-nav-list/teacher-info-dashboard.component';
import { TeacherInfoV2Component }  from './teacher-my-nav-list/teacher-info-v2.component';


@Component({
  moduleId: module.id,
  selector: 'teacher-my-nav-list',
  templateUrl: 'teacher-my-nav-list.component.html',
  styleUrls: [ 'teacher-my-nav-list.component.css' ]
})
export class TeacherMyNavListComponent implements AfterViewInit {

  navTabsOptions:RadioBtnOption[];

  colorWhite:string;
  colorOrange:string;
  colorGray:string;

  showDashboard:boolean=false;
  showMyInfo:boolean=false;
  showMyKlass:boolean=false;
  showMyIncome:boolean=false;
  showMyFeedback:boolean=false;

  dashboardComponent:TeacherInfoDashboardComponent;
  teacherInfoComponent:TeacherInfoV2Component;

  @Output() emitter = new EventEmitter<any>();

  isAdmin:boolean=false;

  constructor(  private klassColorService:KlassColorService,
                public myEventService:MyEventService, 
                public myLoggerService:MyLoggerService,
                private radiobtnService:KlassRadioBtnService,
                private watchTower:MyEventWatchTowerService, 
                private myCheckerService:MyCheckerService) {

    this.radiobtnService.setWatchTower(this.watchTower);

  }


  private isDebug():boolean {
    return this.watchTower.isDebug();
  }

  ngAfterViewInit(): void {

    // 자식 뷰가 모두 완료된 이후에 초기화를 진행.
    if(this.isDebug()) console.log("teacher-my-nav-list / ngAfterViewInit");

    this.asyncViewPack();

  } 
  
  private asyncViewPack(): void {
    
    if(this.isDebug()) console.log("teacher-my-nav-list / asyncViewPack / 시작");

    // 이미 View 기본정보가 들어왔다면 바로 가져온다. 
    if(this.watchTower.getIsViewPackReady()) {
      if(this.isDebug()) console.log("teacher-my-nav-list / asyncViewPack / isViewPackReady : ",true);
      this.init();
    } // end if

    // View에 필요한 기본 정보가 비동기로 들어올 경우, 처리.
    this.watchTower.isViewPackReady$.subscribe(
      (isViewPackReady:boolean) => {
      if(this.isDebug()) console.log("teacher-my-nav-list / asyncViewPack / subscribe / isViewPackReady : ",isViewPackReady);
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

    if(this.isDebug()) console.log("teacher-my-nav-list / init");

    // COLOR
    this.colorWhite = this.klassColorService.white;
    this.colorOrange = this.klassColorService.orange;
    this.colorGray = this.klassColorService.gray;

    if(this.isDebug()) console.log("teacher-my-nav-list / init / this.colorWhite : ",this.colorWhite);
    if(this.isDebug()) console.log("teacher-my-nav-list / init / this.colorOrange : ",this.colorOrange);
    if(this.isDebug()) console.log("teacher-my-nav-list / init / this.colorGray : ",this.colorGray);

    this.navTabsOptions = 
    this.radiobtnService.getNavTabsTeacherMyInfo(
      // user:User
      null
      // keyFocus:string
      , this.watchTower.getMyEventService().KEY_TEACHER_MY_INFO_DASHBOARD
    );

    // 대시보드 노출이 기본값
    this.showDashboard = true;

    if(this.isDebug()) console.log("teacher-my-nav-list / this.navTabsOptions : ",this.navTabsOptions);    

  }

  private resetNavFlag():void {
    this.showDashboard = false;
    this.showMyInfo = false;
    this.showMyKlass = false;
    this.showMyIncome = false;
    this.showMyFeedback = false;
  }

  onChangedFromChild(myEvent:MyEvent) {

    if(this.isDebug()) console.log("teacher-my-nav-list / onChangedFromChild / init");
    if(this.isDebug()) console.log("teacher-my-nav-list / onChangedFromChild / myEvent : ",myEvent);
    if(this.isDebug()) console.log("teacher-my-nav-list / onChangedFromChild / myEvent.key : ",myEvent.key);

    if(this.isDebug()) console.log("teacher-my-nav-list / onChangedFromChild / 시작");
    if(this.isDebug()) console.log("teacher-my-nav-list / onChangedFromChild / myEvent : ",myEvent);

    let isOK:boolean = this.myCheckerService.isOK(myEvent.myChecker, myEvent.value);
    if(!isOK) {
      if(this.isDebug()) console.log("teacher-my-nav-list / onChangedFromChild / 중단 / 값이 유효하지 않습니다.");
      let lastHistory = this.myCheckerService.getLastHistory();
      if(this.isDebug()) console.log("teacher-my-nav-list / onChangedFromChild / lastHistory : ",lastHistory);
      return;
    } // end if

    if(myEvent.hasEventName(this.myEventService.ON_READY)) {

      if(myEvent.hasKey(this.myEventService.KEY_TEACHER_MY_INFO_DASHBOARD)) {

        if(  null != myEvent.metaObj ) {
          this.dashboardComponent = myEvent.metaObj;
        } // end if

      } else if(myEvent.hasKey(this.myEventService.KEY_TEACHER_MY_INFO)) {

        if(  null != myEvent.metaObj ) {
          this.teacherInfoComponent = myEvent.metaObj;
        } // end if

      } // end if

    } else if(myEvent.hasEventName(this.myEventService.ON_CHANGE)) {

      if(myEvent.hasKey(this.myEventService.KEY_TEACHER_MY_INFO_DASHBOARD)) {

        this.resetNavFlag();
        this.showDashboard = true;

      } else if(myEvent.hasKey(this.myEventService.KEY_TEACHER_MY_INFO)) {

        this.resetNavFlag();
        this.showMyInfo = true;

      } else if(myEvent.hasKey(this.myEventService.KEY_TEACHER_MY_KLASS)) {

        this.resetNavFlag();
        this.showMyKlass = true;

      } else if(myEvent.hasKey(this.myEventService.KEY_TEACHER_MY_INCOME)) {

        this.resetNavFlag();
        this.showMyIncome = true;

      } else if(myEvent.hasKey(this.myEventService.KEY_TEACHER_MY_FEEDBACK)) {

        this.resetNavFlag();
        this.showMyFeedback = true;

      } // end if

    } // end if  

  } // end method

} // end class