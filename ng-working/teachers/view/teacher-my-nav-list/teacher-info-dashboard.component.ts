import {  Component, 
          ViewChild,
          AfterViewInit,
          Output, 
          EventEmitter,
          Input }                     from '@angular/core';

import {  Router }                    from '@angular/router';

import { MyEventWatchTowerService }   from '../../../util/service/my-event-watchtower.service';          

import { MyEventService }             from '../../../util/service/my-event.service';
import { MyEvent }                    from '../../../util/model/my-event';

import { MyCheckerService }           from '../../../util/service/my-checker.service';
import { MyChecker }                  from '../../../util/model/my-checker';

import { MyResponse }                 from '../../../util/model/my-response';

import { TeacherService }             from '../../../teachers/service/teacher.service';

import { Teacher }                    from '../../../teachers/model/teacher';
import { User }                       from '../../../users/model/user';

import { Klass }                      from '../../../widget/klass/model/klass';
import { KlassAttendance }            from '../../../widget/klass/model/klass-attendance';

@Component({
  moduleId: module.id,
  selector: 'teacher-info-dashboard',
  templateUrl: 'teacher-info-dashboard.component.html',
  styleUrls: [ 'teacher-info-dashboard.component.css' ]
})
export class TeacherInfoDashboardComponent implements AfterViewInit {

  @Input() eventKey:string = "";
  @Output() emitter = new EventEmitter<any>();

  loginUser:User;
  loginTeacher:Teacher;

  klassList:Klass[];

  constructor(private teacherService:TeacherService,
              public myEventService:MyEventService,
              private watchTower:MyEventWatchTowerService,
              public router:Router) {

    this.teacherService.setWatchTower(watchTower);

  }

  private isDebug():boolean {
    return this.watchTower.isDebug();
  }

  ngAfterViewInit(): void {

    // 자식 뷰가 모두 완료된 이후에 초기화를 진행.
    if(this.isDebug()) console.log("teacher-info-dashboard / ngAfterViewInit");
    this.asyncViewPack();
  }

  private asyncViewPack(): void {
    
    if(this.isDebug()) console.log("teacher-info-dashboard / asyncViewPack / 시작");

    // 이미 View 기본정보가 들어왔다면 바로 가져온다. 
    if(this.watchTower.getIsViewPackReady()) {
      if(this.isDebug()) console.log("teacher-info-dashboard / asyncViewPack / isViewPackReady : ",true);
      this.init();
    } // end if

    // View에 필요한 기본 정보가 비동기로 들어올 경우, 처리.
    this.watchTower.isViewPackReady$.subscribe(
      (isViewPackReady:boolean) => {
      if(this.isDebug()) console.log("teacher-info-dashboard / asyncViewPack / subscribe / isViewPackReady : ",isViewPackReady);
      this.init();
    }); // end subscribe

  }



  private init() :void {

    if(this.isDebug()) console.log("teacher-info-dashboard / init / 시작");

    // 로그인한 유저 정보를 가져옵니다.
    this.setLoginUser();
    // 페이지 진입을 기록으로 남깁니다.
    this.logActionPage();
    // 컴포넌트가 준비된 것을 부모 객체에게 전달합니다.
    this.emitEventOnReady();
    // 해당 유저에게 필요한 정보를 DB로 부터 가져옵니다.
    this.fetchActiveKlassList();

  }

  private setLoginUser() :void {

    if(this.isDebug()) console.log("teacher-info-dashboard / setLoginUser / 시작");

    // 로그인 데이터를 가져옵니다.
    this.loginUser = this.watchTower.getLoginUser();
    if(null == this.loginUser) {
      // 로그인 데이터를 가져오지 못한다면, 로그인 페이지로 이동합니다.
      this.router.navigate(['/login']);
    } // end if

  }

  private getLoginUserId():number {
    let loginUser:User = this.watchTower.getLoginUser();
    if(null == loginUser) {
      return -1;
    }

    return loginUser.id;
  }

  private getLoginTeacherId():number {

    this.watchTower.getLoginTeacher();

    let loginTeacher:Teacher = this.watchTower.getLoginTeacher();
    if(null == loginTeacher) {
      return -1;
    }

    return loginTeacher.id;
  }

  private logActionPage() :void {

    if(this.isDebug()) console.log("teacher-info-dashboard / logActionPage / 시작");

    this.watchTower.logPageEnter(
      // pageType:string
      this.watchTower.getMyLoggerService().pageTypeTeacherInfoDashBoard
    );

  } // end method  

  private emitEventOnReady() :void {

    if(this.isDebug()) console.log("teacher-info-dashboard / emitEventOnReady / 시작");

    let myEvent:MyEvent =
    this.watchTower.getEventOnReady(
      // eventKey:string, 
      this.eventKey,
      // component
      this
    );

    this.emitter.emit(myEvent);

  }

  private emitEventOnChangeMeta(value:string):void {

    if(this.isDebug()) console.log("teacher-info-dashboard / emitEventOnChangeMeta / 시작");

    let myEvent:MyEvent =
    this.watchTower.getEventOnChangeMeta(
      // eventKey:string, 
      this.eventKey,
      // value:string, 
      value,
      // myChecker:MyChecker,
      this.watchTower.getMyCheckerService().getFreePassChecker(),
      // meta:any
      this
    );

    this.emitter.emit(myEvent);

  }

  public reload():void {
    if(this.isDebug()) console.log("teacher-info-dashboard / reload / 시작");
    this.fetchActiveKlassList();
  }

  private fetchActiveKlassList():void {

    if(this.isDebug()) console.log("teacher-info-dashboard / fetchActiveKlassList / 시작");

    // 선생님 대시보드에 필요한 정보는?

    // 1. 수강중인 클래스 정보 가져오기
    this.teacherService.fetchActiveKlassList(
      // apiKey:string,
      this.watchTower.getApiKey(),
      // pageNum:number,
      1,
      // pageRowCnt:number,
      10,
      // teacherId:number
      this.getLoginTeacherId()
    ).then((myResponse:MyResponse) => {

      // 로그 등록 결과를 확인해볼 수 있습니다.
      if(this.isDebug()) console.log("teacher-info-dashboard / fetchActiveKlassList / myResponse : ",myResponse);

      if(myResponse.isSuccess() && myResponse.hasDataProp("list")) {

        // Do something... 
        let klassList:Klass[] = [];
        let jsonList = myResponse.getDataProp("list");
        for (var i = 0; i < jsonList.length; ++i) {
          let json = jsonList[i];
          let klassNStudent:Klass = new Klass().setJSON(json);
          klassList.push(klassNStudent);
        } // end for

        this.klassList = klassList;

        if(this.isDebug()) console.log("teacher-info-dashboard / fetchActiveKlassList / klassList : ",this.klassList);

      } else if(myResponse.isFailed()) {  

        if(this.isDebug()) console.log("teacher-info-dashboard / fetchActiveKlassList / 수강 학생 정보 등록에 실패했습니다.");

        this.watchTower.logAPIError("fetchKlassNStudentList has been failed!");
        if(null != myResponse.error) {
          this.watchTower.announceErrorMsgArr([myResponse.error]);
        } // end if

      } // end if

    }); // end service


  }

  private updateKlassAttendance(klassAttendance:KlassAttendance):void {

    if(this.isDebug()) console.log("teacher-info-dashboard / updateKlassAttendance / 시작");

    if(null == klassAttendance) {
      if(this.isDebug()) console.log("teacher-info-dashboard / updateKlassAttendance / 중단 / null == klassAttendance");
      return;
    }

    if(this.isDebug()) console.log("teacher-info-dashboard / updateKlassAttendance / klassAttendance : ",klassAttendance);    

    // updateAttendance

    this.teacherService.updateAttendance(
      // apiKey:string,
      this.watchTower.getApiKey(),
      // loginUserId:number,
      this.getLoginUserId(),
      // attedanceId:number,
      klassAttendance.id,
      // klassId:number,
      klassAttendance.klass_id,
      // userId:number,
      klassAttendance.user_id,
      // klassAttendanceStatus:number
      klassAttendance.status,
    ).then((myResponse:MyResponse) => {

      // 로그 등록 결과를 확인해볼 수 있습니다.
      if(this.isDebug()) console.log("teacher-info-dashboard / updateKlassAttendance / myResponse : ",myResponse);

      if(myResponse.isSuccess() && myResponse.hasDataProp("row")) {

        // Do something... 
        /*
        let klassList:Klass[] = [];
        let jsonList = myResponse.getDataProp("list");
        for (var i = 0; i < jsonList.length; ++i) {
          let json = jsonList[i];
          let klassNStudent:Klass = new Klass().setJSON(json);
          klassList.push(klassNStudent);
        } // end for

        this.klassList = klassList;

        if(this.isDebug()) console.log("teacher-info-dashboard / updateKlassAttendance / klassList : ",this.klassList);
        */

      } else if(myResponse.isFailed()) {  

        if(this.isDebug()) console.log("teacher-info-dashboard / updateKlassAttendance / 수강 학생 정보 등록에 실패했습니다.");

        this.watchTower.logAPIError("updateKlassAttendance has been failed!");
        if(null != myResponse.error) {
          this.watchTower.announceErrorMsgArr([myResponse.error]);
        } // end if

      } // end if

    }); // end service    

  } // end method

  onClickKlass(klass:Klass):void {

    if(this.isDebug()) console.log("teacher-info-dashboard / onClickKlass / 시작");

    if(null == klass) {
      if(this.isDebug()) console.log("teacher-info-dashboard / onClickKlass / 중단 / null == klass");
      return;
    } // end if

    if(!(0 < klass.id)) {
      if(this.isDebug()) console.log("teacher-info-dashboard / onClickKlass / 중단 / klass.id is not valid!");
      return;
    } // end if


    // 클래스 상세 페이지로 이동합니다.
    this.router.navigate([`/class-center/${klass.id}`]);

  }

  onChangedFromChild(myEvent:MyEvent) {

    if(this.isDebug()) console.log("teacher-info-dashboard / onChangedFromChild / init");
    if(this.isDebug()) console.log("teacher-info-dashboard / onChangedFromChild / myEvent : ",myEvent);
    if(this.isDebug()) console.log("teacher-info-dashboard / onChangedFromChild / myEvent.key : ",myEvent.key);
    if(this.isDebug()) console.log("teacher-info-dashboard / onChangedFromChild / myEvent.value : ",myEvent.value);

    if(myEvent.isNotValid()) {
      if(this.isDebug()) console.log("teacher-info-dashboard / onChangedFromChild / ON_CHANGE_NOT_VALID / 중단 / myEvent.isNotValid()");
      // 에러 로그 등록
      this.watchTower.logErrorBadValue(
        `teacher-info-dashboard / onChangedFromChild / myEvent.isNotValid()`
      );
      return;
    } // end if

    if(this.watchTower.isNotOK(myEvent)) {
      if(this.isDebug()) console.log("teacher-info-dashboard / onChangedFromChild / 중단 / 값이 유효하지 않습니다.");
      // 에러 로그 등록
      this.watchTower.logErrorBadValue(
        `teacher-info-dashboard / onChangedFromChild / this.watchTower.isNotOK(myEvent)`
      );
      return;
    } // end if
    
    if(myEvent.hasEventName(this.watchTower.getMyEventService().ON_READY)) {

      /*
      if(myEvent.hasKey(this.myEventService.KEY_USER_EMAIL)) {

      } else if(myEvent.hasKey(this.myEventService.KEY_USER_NAME)) {

      } // end if - ON READY
      */

    } else if(myEvent.hasEventName(this.watchTower.getMyEventService().ON_CHANGE)) {

      if(myEvent.hasKey(this.myEventService.KEY_WIDGET_KLASS_TEACHER)) {

        if(myEvent.metaObj instanceof KlassAttendance) {

          this.updateKlassAttendance(myEvent.metaObj);
          this.emitEventOnChangeMeta("");

        } // end if

      } // end if

    } else if(myEvent.hasEventName(this.watchTower.getMyEventService().ON_CLICK)) {

      if(myEvent.hasKey(this.myEventService.KEY_WIDGET_KLASS_TEACHER)) {
        if(myEvent.metaObj instanceof Klass) {
          this.onClickKlass(myEvent.metaObj);
        } // end if
      } // end if
    
    } // end if

  } // end method

}