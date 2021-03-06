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

@Component({
  moduleId: module.id,
  selector: 'teacher-info-question',
  templateUrl: 'teacher-info-question.component.html',
  styleUrls: [ 'teacher-info-question.component.css' ]
})
export class TeacherInfoQuestionComponent implements AfterViewInit {

  @Input() eventKey:string = "";
  @Output() emitter = new EventEmitter<any>();

  loginUser:User;

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
    if(this.isDebug()) console.log("teacher-info-question / ngAfterViewInit");
    this.asyncViewPack();
  }

  private asyncViewPack(): void {
    
    if(this.isDebug()) console.log("teacher-info-question / asyncViewPack / 시작");

    // 이미 View 기본정보가 들어왔다면 바로 가져온다. 
    if(this.watchTower.getIsViewPackReady()) {
      if(this.isDebug()) console.log("teacher-info-question / asyncViewPack / isViewPackReady : ",true);
      this.init();
    } // end if

    // View에 필요한 기본 정보가 비동기로 들어올 경우, 처리.
    this.watchTower.isViewPackReady$.subscribe(
      (isViewPackReady:boolean) => {
      if(this.isDebug()) console.log("teacher-info-question / asyncViewPack / subscribe / isViewPackReady : ",isViewPackReady);
      this.init();
    }); // end subscribe

  }



  private init() :void {

    if(this.isDebug()) console.log("teacher-info-question / init / 시작");

    // 로그인한 유저 정보를 가져옵니다.
    this.setLoginUser();
    // 페이지 진입을 기록으로 남깁니다.
    this.logActionPage();
    // 컴포넌트가 준비된 것을 부모 객체에게 전달합니다.
    this.emitEventOnReady();
    // 해당 유저에게 필요한 정보를 DB로 부터 가져옵니다.
    this.fetchTeacherInfoDashboard();

  }

  private setLoginUser() :void {

    if(this.isDebug()) console.log("teacher-info-question / setLoginUser / 시작");

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

  private logActionPage() :void {

    if(this.isDebug()) console.log("teacher-info-question / logActionPage / 시작");

    this.watchTower.logPageEnter(
      // pageType:string
      this.watchTower.getMyLoggerService().pageTypeTeacherInfoDashBoard
    );

  } // end method  

  private emitEventOnReady() :void {

    if(this.isDebug()) console.log("teacher-info-question / emitEventOnReady / 시작");

    let myEvent:MyEvent =
    this.watchTower.getEventOnReady(
      // eventKey:string, 
      this.eventKey,
      // component
      this
    );

    this.emitter.emit(myEvent);

  }

  private fetchTeacherInfoDashboard():void {

    if(this.isDebug()) console.log("teacher-info-question / fetchTeacherInfoDashboard / 시작");

    // 선생님 대시보드에 필요한 정보는?

    // 1. 수강중인 클래스 정보 가져오기 (최대 5개 노출)
    /*
    this.userService.fetchKlassNStudentList(
      // apiKey:string,
      this.watchTower.getApiKey(),
      // pageNum:number,
      1,
      // pageRowCnt:number,
      5,
      // userId:number
      this.getLoginUserId()
    ).then((myResponse:MyResponse) => {

      // 로그 등록 결과를 확인해볼 수 있습니다.
      if(this.isDebug()) console.log("teacher-info-question / fetchTeacherInfoDashboard / myResponse : ",myResponse);

      if(myResponse.isSuccess() && myResponse.hasDataProp("list")) {

        // Do something... 
        let klassNStudentList:KlassNStudent[] = [];
        let jsonList = myResponse.getDataProp("list");
        for (var i = 0; i < jsonList.length; ++i) {
          let json = jsonList[i];
          let klassNStudent:KlassNStudent = new KlassNStudent().setJSON(json);
          klassNStudentList.push(klassNStudent);
        } // end for

        this.klassNStudentList = klassNStudentList;

        if(this.isDebug()) console.log("teacher-info-question / fetchTeacherInfoDashboard / klassNStudentList : ",klassNStudentList);

      } else if(myResponse.isFailed()) {  

        if(this.isDebug()) console.log("teacher-info-question / fetchTeacherInfoDashboard / 수강 학생 정보 등록에 실패했습니다.");

        this.watchTower.logAPIError("fetchKlassNStudentList has been failed!");
        if(null != myResponse.error) {
          this.watchTower.announceErrorMsgArr([myResponse.error]);
        } // end if

      } // end if

    }); // end service

    // 2. 관심 강의 리스트 가져오기(나중에...)
    */

  }

  onClickKlass(klass:Klass):void {

    if(this.isDebug()) console.log("teacher-info-question / onClickKlass / 시작");

    if(null == klass) {
      if(this.isDebug()) console.log("teacher-info-question / onClickKlass / 중단 / null == klass");
      return;
    } // end if

    if(!(0 < klass.id)) {
      if(this.isDebug()) console.log("teacher-info-question / onClickKlass / 중단 / klass.id is not valid!");
      return;
    } // end if


    // 클래스 상세 페이지로 이동합니다.
    this.router.navigate([`/class-center/${klass.id}`]);

  }

  onChangedFromChild(myEvent:MyEvent) {

    if(this.isDebug()) console.log("teacher-info-question / onChangedFromChild / init");
    if(this.isDebug()) console.log("teacher-info-question / onChangedFromChild / myEvent : ",myEvent);
    if(this.isDebug()) console.log("teacher-info-question / onChangedFromChild / myEvent.key : ",myEvent.key);
    if(this.isDebug()) console.log("teacher-info-question / onChangedFromChild / myEvent.value : ",myEvent.value);

    if(myEvent.isNotValid()) {
      if(this.isDebug()) console.log("teacher-info-question / onChangedFromChild / ON_CHANGE_NOT_VALID / 중단 / myEvent.isNotValid()");
      // 에러 로그 등록
      this.watchTower.logErrorBadValue(
        `teacher-info-question / onChangedFromChild / myEvent.isNotValid()`
      );
      return;
    } // end if

    if(this.watchTower.isNotOK(myEvent)) {
      if(this.isDebug()) console.log("teacher-info-question / onChangedFromChild / 중단 / 값이 유효하지 않습니다.");
      // 에러 로그 등록
      this.watchTower.logErrorBadValue(
        `teacher-info-question / onChangedFromChild / this.watchTower.isNotOK(myEvent)`
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

      /*
      if(myEvent.hasKey(this.myEventService.KEY_USER_CUR_PASSWORD)) {

      } else if(myEvent.hasKey(this.myEventService.KEY_USER_NEW_PASSWORD)) {

      } // end if - ON CHANGE
      */

    } else if(myEvent.hasEventName(this.watchTower.getMyEventService().ON_CLICK)) {

      if(myEvent.hasKey(this.myEventService.KEY_WIDGET_KLASS_CARD)) {

        this.onClickKlass(myEvent.metaObj);

      } // end if
    
    } // end if

  } // end method

}