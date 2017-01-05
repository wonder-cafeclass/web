import { Component, 
         OnInit, 
         Input, 
         Output, 
         ViewChild,
         EventEmitter }                from '@angular/core';

import { Router }                      from '@angular/router';

import { AdminService }                from './service/admin.service';

import { Teacher }                     from '../teachers/model/teacher';
import { User }                        from '../users/model/user';

import { DefaultComponent }            from '../widget/input/default/default.component';
import { DefaultMeta }                 from '../widget/input/default/model/default-meta';
import { DefaultType }                 from '../widget/input/default/model/default-type';
import { DefaultOption }               from '../widget/input/default/model/default-option';
import { CheckBoxComponent }           from '../widget/checkbox/checkbox.component';
import { Pagination }                  from '../widget/pagination/model/pagination';

import { MyEventService }              from '../util/service/my-event.service';
import { MyCheckerService }            from '../util/service/my-checker.service';
import { MyEventWatchTowerService }    from '../util/service/my-event-watchtower.service';
import { MyEvent }                     from '../util/model/my-event';
import { MyResponse }                  from '../util/model/my-response';

import { HelperMyIs }                  from '../util/helper/my-is';
import { HelperMyTime }                from '../util/helper/my-time';
import { HelperMyArray }               from '../util/helper/my-array';
import { HelperMyFormat }              from '../util/helper/my-format';




@Component({
  moduleId: module.id,
  selector: 'manage-teachers',
  templateUrl: 'manage-teachers.component.html',
  styleUrls: [ 'manage-teachers.component.css' ]
})
export class ManageTeachersComponent implements OnInit {

  private myIs:HelperMyIs;
  private myArray:HelperMyArray;
  private myFormat:HelperMyFormat;
  private defaultType:DefaultType;
  private defaultMetaTeacherStatus:DefaultMeta;

  private loginUser:User;

  private checkBoxList:CheckBoxComponent[]=[];

  private selectStatusComponent:DefaultComponent;

  teacherList:Teacher[];

  pagination:Pagination;

  // 자신의 자식 객체에서 이벤트를 받는다.
  constructor(  private adminService:AdminService,
                private myEventService:MyEventService,
                private watchTower:MyEventWatchTowerService,
                private router:Router ) {

    this.myIs = new HelperMyIs();
    this.myArray = new HelperMyArray();
    this.myFormat = new HelperMyFormat();
    this.defaultType = new DefaultType();
    this.defaultMetaTeacherStatus = this.getMetaSelectTeacherStatus();

    this.pagination = new Pagination();

    this.subscribeLoginUser();
    this.subscribeEventPack();

  }

  ngOnInit():void {
  }

  private isDebug():boolean {
    return this.watchTower.isDebug();
  }

  private getMetaSelectTeacherStatus():DefaultMeta{
    return new DefaultMeta( // 5
      // public title:string
      "선생님 상태",
      // public placeholder:string
      "선생님 상태를 선택해주세요",
      // public eventKey:string
      this.myEventService.KEY_TEACHER_STATUS,
      // public checkerKey:string
      "teacher_status",
      // public type:string
      this.defaultType.TYPE_SELECT
    );
  }

  private subscribeLoginUser() :void {

    if(this.isDebug()) console.log("manage-teachers / subscribeLoginUser / init");

    this.loginUser = this.watchTower.getLoginUser();

    if(null == this.loginUser || !this.loginUser.isAdminUser()) {
      this.goHome();
    } // end if

    this.init();
  } // end method

  private goHome() :void {
    if(this.isDebug()) console.log("manage-teachers / goHome / init");
    this.router.navigate(["/"]);
  }

  private subscribeEventPack() :void {

    if(this.isDebug()) console.log("manage-teachers / subscribeEventPack / init");

    let isEventPackReady:boolean = this.watchTower.getIsEventPackReady();
    if(this.isDebug()) console.log("manage-teachers / subscribeEventPack / isEventPackReady : ",isEventPackReady);

    if(this.watchTower.getIsEventPackReady()) {
      this.init();
    } else {
      // 2. EventPack 로딩이 완료되지 않았습니다. 로딩을 기다립니다.
      this.watchTower.isEventPackReady$.subscribe(
        (isEventPackReady:boolean) => {

        if(this.isDebug()) console.log("manage-teachers / subscribeEventPack / isEventPackReady : ",isEventPackReady);
        this.init();

      }); // end subscribe

    } // end if

  } // end method

  init() :void {

    if(this.isDebug()) console.log("manage-teachers / init / 시작");

    // 1. 운영자 유저의 pagination을 가져옵니다.
    this.fetchTeachersPagination();
    // 2. 선생님 유저의 pagination을 가져옵니다.

    // 3. 학생 유저의 pagination을 가져옵니다.

  }

  private getDefaultOptionTeacherListStatus(teacher:Teacher):DefaultOption[] {

    if(this.isDebug()) console.log("manage-teachers / getDefaultOptionTeacherListStatus / 시작");

    if(null == teacher) {
      if(this.isDebug()) console.log("manage-teachers / getDefaultOptionTeacherListStatus / 중단 / null == teacher");
      return;
    }

    let keyList:string[] = [];  
    let valueList:string[] = [];

    let teacherStatusList:string[] = this.watchTower.getMyConst().getList("teacher_status_list");
    let teacherStatusKorList:string[] = this.watchTower.getMyConst().getList("teacher_status_kor_list");

    for (var i = 0; i < teacherStatusList.length; ++i) {
      let teacherStatusKor:string = teacherStatusKorList[i];
      let teacherStatus:string = teacherStatusList[i];

      keyList.push(teacherStatusKor);
      valueList.push(teacherStatus);
    }

    return this.watchTower.getDefaultOptionListWithMeta(keyList, valueList, teacher.status, teacher);
  } // end method
 

  // @ Desc : 운영자 유저리스트의 페이지 네이션을 가져옵니다.
  private fetchTeachersPagination() :void {

    if(this.isDebug()) console.log("manage-teachers / fetchTeachersPagination / 시작");

    this.adminService
    .fetchTeachersPagination(this.watchTower.getApiKey())
    .then((myResponse:MyResponse) => {

      if(this.isDebug()) console.log("manage-teachers / fetchTeachersPagination / myResponse : ",myResponse);

      if(myResponse.isSuccess() && myResponse.hasDataProp("pagination")) {
        if(this.isDebug()) console.log("manage-teachers / fetchTeachersPagination / success");

        // 1. 페이지네이션 데이터를 저장합니다. 가져온 데이터로 페이지네이션을 표시.
        let json = myResponse.getDataProp("pagination");
        this.pagination.setJSON(json);

        // 2. 선생님 리스트를 가져옵니다. 
        this.fetchTeacherList(this.pagination.pageNum, this.pagination.pageRange);
        
      } else if(myResponse.isFailed()){
        if(this.isDebug()) console.log("manage-teachers / fetchTeachersPagination / failed");

        this.watchTower.logAPIError("fetchTeachersPagination has been failed!");
        if(null != myResponse.error) {
          this.watchTower.announceErrorMsgArr([myResponse.error]);
        } // end if
        
      } // end if

    }); // end service    

  }

  private updateTeacherList(teacherJSONList:any[]) :void {

    if(this.isDebug()) console.log("manage-teachers / updateTeacherList / 시작");

    if(this.myArray.isNotOK(teacherJSONList)) {
      if(this.isDebug()) console.log("manage-teachers / updateTeacherList / 중단 / this.myArray.isNotOK(teacherJSONList)");
      return;
    }

    let teacherList:Teacher[] = [];
    for (var i = 0; i < teacherJSONList.length; ++i) {
      let teacherJSON = teacherJSONList[i];
      let teacher:Teacher = new Teacher().setJSON(teacherJSON);

      let defaultOptionListStatus:DefaultOption[] = this.getDefaultOptionTeacherListStatus(teacher);
      teacher["selectOptionListStatus"] = defaultOptionListStatus;

      // 성별을 보기 쉽게 변경 
      let genderReadable:string =
      this.watchTower
      .getMyConst()
      .getValue(
        // srcKey:string, 
        "user_gender_list",
        // srcValue:string, 
        teacher.gender,
        // targetKey:string
        "user_gender_kor_list"
      );

      if(this.isDebug()) console.log("manage-teachers / updateTeacherList / genderReadable : ",genderReadable);

      teacher.gender_readable = genderReadable;

      teacherList.push(teacher);

    } // end for

    if(this.isDebug()) console.log("manage-teachers / updateTeacherList / teacherList : ",teacherList);

    this.teacherList = teacherList;
  }

  // @ Desc : 운영자 유저 리스트를 가져옵니다.
  private fetchTeacherList(pageNum:number, pageSize:number) :void {
    
    // 유저 리스트는 아래 카테고리별로 나누어 가져옵니다.
    // a. 운영자
    // b. 선생님
    // c. 학생

    this.adminService
    .fetchTeacherList(this.watchTower.getApiKey(), pageNum, pageSize)
    .then((myResponse:MyResponse) => {

      if(this.isDebug()) console.log("manage-teachers / fetchTeacherList / myResponse : ",myResponse);

      if(myResponse.isSuccess() && myResponse.hasDataProp("teacher_list")) {

        let teacherJSONList:any[] = myResponse.getDataProp("teacher_list");
        if(this.isDebug()) console.log("manage-teachers / fetchTeacherList / teacherJSONList : ",teacherJSONList);

        this.updateTeacherList(teacherJSONList);
        
      } else if(myResponse.isFailed()){
        if(this.isDebug()) console.log("manage-teachers / fetchTeacherList / 쿠키에 등록된 유저 정보가 없습니다. 초기화합니다.");

        this.watchTower.logAPIError("fetchTeacherList has been failed!");
        if(null != myResponse.error) {
          this.watchTower.announceErrorMsgArr([myResponse.error]);
        } // end if
        
      } // end if

    }); // end service

  } // end method

  updateCheckBoxes(checked:boolean) :void {

    if(this.isDebug()) console.log("manage-teachers / updateCheckBoxes / 시작");

    if(this.isDebug()) console.log("manage-teachers / updateCheckBoxes / this.checkBoxList : ",this.checkBoxList);    

    if(this.isDebug()) console.log("manage-teachers / updateCheckBoxes / checked : ",checked);

    for (var i = 0; i < this.checkBoxList.length; ++i) {
      let checkBox:CheckBoxComponent = this.checkBoxList[i];
      checkBox.setIsChecked(checked);
    } // end for

  } // end method

  updateTeacherStatus(value:string, teacher:Teacher) :void {

    if(this.isDebug()) console.log("manage-teachers / updateTeacherStatus / 시작");

    if(null == value || "" === value) {
      if(this.isDebug()) console.log("manage-teachers / updateTeacherStatus / 중단 / value is not valid!");
      return;
    }
    if(null == teacher) {
      if(this.isDebug()) console.log("manage-teachers / updateTeacherStatus / 중단 / teacher is not valid!");
      return;
    }

    if(this.isDebug()) console.log("manage-teachers / updateTeacherStatus / value : ",value);
    if(this.isDebug()) console.log("manage-teachers / updateTeacherStatus / teacher : ",teacher);

    this.adminService
    .updateTeacher(
      // apiKey:string, 
      this.watchTower.getApiKey(),
      // userIdAdmin:number, 
      this.loginUser.id,
      // teacherId:number, 
      teacher.id,
      // teacherStatus:string 
      value
    )
    .then((myResponse:MyResponse) => {

      if(this.isDebug()) console.log("manage-teachers / updateTeacherStatus / myResponse : ",myResponse);

      if(myResponse.isSuccess()) {
        if(this.isDebug()) console.log("manage-teachers / updateTeacherStatus / success");

      } else if(myResponse.isFailed()){
        if(this.isDebug()) console.log("manage-teachers / updateTeacherStatus / failed");

        this.watchTower.logAPIError("updateTeacherStatus has been failed!");
        if(null != myResponse.error) {
          this.watchTower.announceErrorMsgArr([myResponse.error]);
        } // end if
        
      } // end if

    }); // end service
  }

  onChangedFromChild(myEvent:MyEvent) :void{

    if(this.isDebug()) console.log("manage-teachers / onChangedFromChild / myEvent : ",myEvent);

    if(null == myEvent) {
      if(this.isDebug()) console.log("manage-teachers / onChangedFromChild / 중단 / null == myEvent");
      return;
    } // end if

    if(myEvent.hasEventName(this.myEventService.ON_READY)) {

      if(myEvent.hasKey(this.myEventService.KEY_CHECKBOX_ALL)) {

        // Do something...

      } else if(myEvent.hasKey(this.myEventService.KEY_CHECKBOX)) {

        this.checkBoxList.push(myEvent.metaObj);

      } // end if

    } else if(myEvent.hasEventName(this.myEventService.ON_CHANGE)) {

      if(myEvent.hasKey(this.myEventService.KEY_CHECKBOX_ALL)) {

        let isChecked:boolean = ("true" == ""+myEvent.value)?true:false;
        this.updateCheckBoxes(isChecked);

      } else if(myEvent.hasKey(this.myEventService.KEY_TEACHER_STATUS)) {

        this.updateTeacherStatus(myEvent.value, myEvent.metaObj);

      } else if(myEvent.hasKey(this.myEventService.KEY_PAGE_NUM)) {

        this.fetchTeacherList(this.pagination.pageNum, this.pagination.pageRange);

      } // end if


      // Do someting ...     

    } // end if

  } // end method

} // end class