import {  Component, 
          ViewChild,
          AfterViewInit,
          Output, 
          EventEmitter,
          Input }                     from '@angular/core';

import {  Router }                    from '@angular/router';

import { ProfileImgUploadComponent }  from '../../../widget/input/profile-img-upload/profile-img-upload.component';
import { PasswordComponent }          from '../../../widget/input/password/password.component';
import { PasswordsTripletComponent }  from '../../../widget/input/password/passwords-triplet.component';
import { MobileComponent }            from '../../../widget/input/mobile/mobile.component';
import { GenderComponent }            from '../../../widget/input/gender/gender.component';
import { BirthdayComponent }          from '../../../widget/input/birthday/birthday.component';

import { DefaultComponent }           from '../../../widget/input/default/default.component';
import { DefaultMeta }                from '../../../widget/input/default/model/default-meta';

import { MyEventWatchTowerService }   from '../../../util/service/my-event-watchtower.service';          

import { MyEventService }             from '../../../util/service/my-event.service';
import { MyEvent }                    from '../../../util/model/my-event';

import { MyCheckerService }           from '../../../util/service/my-checker.service';
import { MyChecker }                  from '../../../util/model/my-checker';

import { MyResponse }                 from '../../../util/model/my-response';

import { UserService }                from '../../../users/service/user.service';

import { User }                       from '../../../users/model/user';

@Component({
  moduleId: module.id,
  selector: 'my-info-dashboard',
  templateUrl: 'my-info-dashboard.component.html',
  styleUrls: [ 'my-info-dashboard.component.css' ]
})
export class MyInfoDashboardComponent implements AfterViewInit {

  @Input() eventKey:string = "";
  @Output() emitter = new EventEmitter<any>();

  loginUser:User;

  constructor(private userService:UserService,
              private watchTower:MyEventWatchTowerService,
              public router:Router) {

    this.userService.setWatchTower(watchTower);

  }

  private isDebug():boolean {
    return this.watchTower.isDebug();
  }

  ngAfterViewInit(): void {

    // 자식 뷰가 모두 완료된 이후에 초기화를 진행.
    if(this.isDebug()) console.log("my-info-dashboard / ngAfterViewInit");
    this.asyncViewPack();
  }

  private asyncViewPack(): void {
    
    if(this.isDebug()) console.log("my-info-dashboard / asyncViewPack / 시작");

    // 이미 View 기본정보가 들어왔다면 바로 가져온다. 
    if(this.watchTower.getIsViewPackReady()) {
      if(this.isDebug()) console.log("my-info-dashboard / asyncViewPack / isViewPackReady : ",true);
      this.init();
    } // end if

    // View에 필요한 기본 정보가 비동기로 들어올 경우, 처리.
    this.watchTower.isViewPackReady$.subscribe(
      (isViewPackReady:boolean) => {
      if(this.isDebug()) console.log("my-info-dashboard / asyncViewPack / subscribe / isViewPackReady : ",isViewPackReady);
      this.init();
    }); // end subscribe

  }



  private init() :void {

    if(this.isDebug()) console.log("my-info-dashboard / init / 시작");

    // 로그인한 유저 정보를 가져옵니다.
    this.setLoginUser();
    // 페이지 진입을 기록으로 남깁니다.
    this.logActionPage();
    // 컴포넌트가 준비된 것을 부모 객체에게 전달합니다.
    this.emitEventOnReady();
    // 해당 유저에게 필요한 정보를 DB로 부터 가져옵니다.
    this.fetchUserInfoDashboard();

  }

  private setLoginUser() :void {

    if(this.isDebug()) console.log("my-info-dashboard / setLoginUser / 시작");

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

    if(this.isDebug()) console.log("my-info-dashboard / logActionPage / 시작");

    this.watchTower.logPageEnter(
      // pageType:string
      this.watchTower.getMyLoggerService().pageTypeMyInfoDashBoard
    );

  } // end method  

  private emitEventOnReady() :void {

    if(this.isDebug()) console.log("my-info-dashboard / emitEventOnReady / 시작");

    let myEvent:MyEvent =
    this.watchTower.getEventOnReady(
      // eventKey:string, 
      this.eventKey,
      // component
      this
    );

    this.emitter.emit(myEvent);

  }

  private fetchUserInfoDashboard():void {

    if(this.isDebug()) console.log("my-info-dashboard / fetchUserInfoDashboard / 시작");

    // 1. 수강중인 클래스 정보 가져오기 (최대 5개 노출)
    this.userService.fetchKlassNStudentList(
      // apiKey:string,
      this.watchTower.getApiKey(),
      // pageNum:number,
      1,
      // pageSize:number,
      5,
      // userId:number
      this.getLoginUserId()
    ).then((myResponse:MyResponse) => {

      // 로그 등록 결과를 확인해볼 수 있습니다.
      if(this.isDebug()) console.log("my-info-dashboard / fetchUserInfoDashboard / myResponse : ",myResponse);

      if(myResponse.isSuccess()) {

        // Do something... 

      } else if(myResponse.isFailed()) {  

        if(this.isDebug()) console.log("my-info-dashboard / fetchUserInfoDashboard / 수강 학생 정보 등록에 실패했습니다.");

        this.watchTower.logAPIError("fetchKlassNStudentList has been failed!");
        if(null != myResponse.error) {
          this.watchTower.announceErrorMsgArr([myResponse.error]);
        } // end if

      } // end if

    }); // end service

    // 2. 관심 강의 리스트 가져오기(나중에...)

  }

  onChangedFromChild(myEvent:MyEvent) {

    if(this.isDebug()) console.log("my-info-dashboard / onChangedFromChild / init");
    if(this.isDebug()) console.log("my-info-dashboard / onChangedFromChild / myEvent : ",myEvent);
    if(this.isDebug()) console.log("my-info-dashboard / onChangedFromChild / myEvent.key : ",myEvent.key);
    if(this.isDebug()) console.log("my-info-dashboard / onChangedFromChild / myEvent.value : ",myEvent.value);

    if(myEvent.isNotValid()) {
      if(this.isDebug()) console.log("my-info-dashboard / onChangedFromChild / ON_CHANGE_NOT_VALID / 중단 / myEvent.isNotValid()");
      // 에러 로그 등록
      this.watchTower.logErrorBadValue(
        `my-info-dashboard / onChangedFromChild / myEvent.isNotValid()`
      );
      return;
    } // end if

    if(this.watchTower.isNotOK(myEvent)) {
      if(this.isDebug()) console.log("my-info-dashboard / onChangedFromChild / 중단 / 값이 유효하지 않습니다.");
      // 에러 로그 등록
      this.watchTower.logErrorBadValue(
        `my-info-dashboard / onChangedFromChild / this.watchTower.isNotOK(myEvent)`
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
    
    } // end if

  } // end method

}