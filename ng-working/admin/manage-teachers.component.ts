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
  private defaultMetaTeacherStatusForSearch:DefaultMeta;
  private defaultMetaSearchQuery:DefaultMeta;

  private loginUser:User;

  private checkBoxList:CheckBoxComponent[]=[];

  teacherList:Teacher[];
  pagination:Pagination;

  private searchQuery:string="";
  private teacherStatus:string="";
  private pageNum:number = 1;
  private pageRowCnt:number = 5;

  selectOptionListTeacherStatus:DefaultOption[];

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
    this.defaultMetaTeacherStatusForSearch = this.getMetaSelectTeacherStatusForSearch();

    this.defaultMetaSearchQuery = this.getMetaSearchInput();

    this.pagination = new Pagination();

    this.selectOptionListTeacherStatus = this.getDefaultOptionTeacherListStatusForSearch();

    this.subscribeLoginUser();
    this.subscribeEventPack();

  } // end constructor

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

  private getMetaSelectTeacherStatusForSearch():DefaultMeta{
    return new DefaultMeta( // 5
      // public title:string
      "검색 조건 - 선생님 상태",
      // public placeholder:string
      "검색 조건 - 선생님 상태를 선택해주세요",
      // public eventKey:string
      this.myEventService.KEY_TEACHER_STATUS_FOR_SEARCH,
      // public checkerKey:string
      "teacher_status",
      // public type:string
      this.defaultType.TYPE_SELECT
    );
  }

  private getMetaSearchInput():DefaultMeta{
    return new DefaultMeta( // 2
      // public title:string
      "검색",
      // public placeholder:string
      "검색어를 입력해주세요",
      // public eventKey:string
      this.myEventService.KEY_SEARCH_QUERY,
      // public checkerKey:string
      "search_query",
      // public type:string
      this.defaultType.TYPE_INPUT
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

    this.fetchTeacherList(
      // pageNum:number, 
      this.pageNum,
      // pageRowCnt:number, 
      this.pageRowCnt,
      // searchQuery:string, 
      this.searchQuery,
      // teacherStatus:string, 
      this.teacherStatus
    );

  } // end method

  private getDefaultOptionTeacherListStatus(teacher:Teacher):DefaultOption[] {

    if(this.isDebug()) console.log("manage-teachers / getDefaultOptionTeacherListStatus / 시작");

    let defaultOptionList:DefaultOption[] = 
    this.watchTower.getDefaultOptionListWithMetaByKeys(
      // keyListName:string,
      "teacher_status_kor_list",
      // valueListName:string,
      "teacher_status_list",
      // valueFocus:string,
      teacher.status,
      // metaObj:any
      teacher
    );
    if(this.myArray.isOK(defaultOptionList)) {
      // "모든 상태" - 기본값 을 제거함.
      defaultOptionList.shift();
    }

    if(this.isDebug()) console.log("manage-teachers / getDefaultOptionTeacherListStatus / defaultOptionList : ",defaultOptionList);

    return defaultOptionList;
    
  } // end method

  // @ Desc : 검색을 위한 유저 상태 default option list - select box 
  private getDefaultOptionTeacherListStatusForSearch():DefaultOption[] {

    if(this.isDebug()) console.log("manage-teachers / getDefaultOptionTeacherListStatusForSearch / 시작");

    return this.watchTower.getDefaultOptionListByKeys(
      // keyListName:string,
      "teacher_status_kor_list",
      // valueListName:string,
      "teacher_status_list",
      // valueFocus:string
      ""
    );

  } // end method



   

  private updatePagination(jsonPagination:any) :void {

    if(this.isDebug()) console.log("manage-teachers / updatePagination / 시작");

    if(this.isDebug()) console.log("manage-teachers / updatePagination / jsonPagination : ",jsonPagination);

    if(null == jsonPagination) {
      this.pagination = null;
    } else {
      this.pagination = new Pagination().setJSON(jsonPagination);
    }
  }

  private updateTeacherList(jsonTeacherList:any[]) :void {

    if(this.isDebug()) console.log("manage-teachers / updateTeacherList / 시작");

    if(this.myArray.isNotOK(jsonTeacherList)) {

      // 검색 결과가 없습니다.
      this.teacherList = null;

    } else {

      let teacherList:Teacher[] = [];
      for (var i = 0; i < jsonTeacherList.length; ++i) {
        let teacherJSON = jsonTeacherList[i];
        let teacher:Teacher = new Teacher().setJSON(teacherJSON);

        let defaultOptionListStatus:DefaultOption[] = this.getDefaultOptionTeacherListStatus(teacher);
        teacher["selectOptionListStatus"] = defaultOptionListStatus;

        // 자신의 데이터인지 확인한다.
        if(this.loginUser.id === teacher.user_id) {
          teacher.isMe = true;
        }

        // 성별을 보기 쉽게 변경 
        let genderReadable:string =
        this.watchTower
        .getMyConst()
        .getValue(
          // srcKey:string, 
          "teacher_gender_list",
          // srcValue:string, 
          teacher.gender,
          // targetKey:string
          "teacher_gender_kor_list"
        );

        if(this.isDebug()) console.log("manage-teachers / updateTeacherList / genderReadable : ",genderReadable);

        teacher.gender_readable = genderReadable;

        teacherList.push(teacher);

      } // end for

      if(this.isDebug()) console.log("manage-teachers / updateTeacherList / teacherList : ",teacherList);

      this.teacherList = teacherList;
      
    } // end if

  } // end method

  // @ Desc : 저장된 변수 값들로 유저 리스트를 가져옵니다.
  private dofetchTeacherList():void {

    if(null == this.pagination) {

      this.fetchTeacherList(
        // pageNum:number, 
        this.pageNum, 
        // pageRowCnt:number, 
        this.pageRowCnt,
        // searchQuery:string, 
        this.searchQuery,
        // teacherStatus:string, 
        this.teacherStatus
      );

    } else {

      this.fetchTeacherList(
        // pageNum:number, 
        this.pagination.pageNum, 
        // pageRowCnt:number, 
        this.pagination.pageRowCnt,
        // searchQuery:string, 
        this.searchQuery,
        // teacherStatus:string, 
        this.teacherStatus
      );

    }

  } // end method

  // @ Desc : 유저 리스트를 가져옵니다.
  private fetchTeacherList( pageNum:number, 
                            pageRowCnt:number, 
                            searchQuery:string, 
                            teacherStatus:string) :void {

    this.adminService
    .fetchTeacherListV2(
      // apiKey:string, 
      this.watchTower.getApiKey(), 
      // pageNum:number, 
      pageNum, 
      // pageRowCnt:number, 
      pageRowCnt,
      // searchQuery:string, 
      searchQuery,
      // teacherStatus:string, 
      teacherStatus
    )
    .then((myResponse:MyResponse) => {

      if(this.isDebug()) console.log("manage-teachers / fetchTeacherList / myResponse : ",myResponse);

      if( myResponse.isSuccess() && 
          myResponse.hasDataProp("pagination") &&
          myResponse.hasDataProp("teacher_list")) {

        // 1. Pagination 재설정
        let jsonPagination = myResponse.getDataProp("pagination");
        if(this.isDebug()) console.log("manage-teachers / fetchTeacherList / jsonPagination : ",jsonPagination);
        this.updatePagination(jsonPagination);

        // 2. Teacher List 재설정 
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

  updateteacherStatus(value:string, teacher:Teacher) :void {

    if(this.isDebug()) console.log("manage-teachers / updateteacherStatus / 시작");

    if(null == value || "" === value) {
      if(this.isDebug()) console.log("manage-teachers / updateteacherStatus / 중단 / value is not valid!");
      return;
    }
    if(null == teacher) {
      if(this.isDebug()) console.log("manage-teachers / updateteacherStatus / 중단 / teacher is not valid!");
      return;
    }

    if(this.isDebug()) console.log("manage-teachers / updateteacherStatus / value : ",value);
    if(this.isDebug()) console.log("manage-teachers / updateteacherStatus / teacher : ",teacher);

    this.adminService
    .updateTeacher(
      // apiKey:string, 
      this.watchTower.getApiKey(),
      // userIdAdmin:number, 
      this.loginUser.id,
      // teacherId:number, 
      teacher.id,
      // teacherStatus:string, 
      value
    )
    .then((myResponse:MyResponse) => {

      if(this.isDebug()) console.log("manage-teachers / updateteacherStatus / myResponse : ",myResponse);

      if(myResponse.isSuccess()) {
        if(this.isDebug()) console.log("manage-teachers / updateteacherStatus / success");

      } else if(myResponse.isFailed()){
        if(this.isDebug()) console.log("manage-teachers / updateteacherStatus / failed");

        this.watchTower.logAPIError("updateteacherStatus has been failed!");
        if(null != myResponse.error) {
          this.watchTower.announceErrorMsgArr([myResponse.error]);
        } // end if
        
      } // end if

    }); // end service

  }


  onClickSearch(event) :void {

    if(this.isDebug()) console.log("manage-teachers / onClickSearch / 시작");

    event.stopPropagation();
    event.preventDefault();

    this.fetchTeacherList(
      // pageNum:number,
      1,
      // pageRowCnt:number,
      this.pagination.pageRowCnt,
      // searchQuery:string,
      this.searchQuery,
      // teacherStatus:string, 
      ""
    );

  } // end method

  isDefaultStatus(status:string):boolean {

    if(null == status || "" === status) {
      return false;
    }

    if(this.myArray.isNotOK(this.selectOptionListTeacherStatus)) {
      return false;
    } // end if

    let defaultOption:DefaultOption = this.selectOptionListTeacherStatus[0];
    if(null == defaultOption) {
      return false;
    } // end if

    return (defaultOption.value === status)?true:false;
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

        this.updateteacherStatus(myEvent.value, myEvent.metaObj);


      } else if(myEvent.hasKey(this.myEventService.KEY_PAGE_NUM)) {

        this.pagination.pageNum = +myEvent.value;
        this.dofetchTeacherList();

      } else if(myEvent.hasKey(this.myEventService.KEY_SEARCH_QUERY)) {

        this.searchQuery = myEvent.value;

      } else if(myEvent.hasKey(this.myEventService.KEY_TEACHER_STATUS_FOR_SEARCH)) {

        if(this.isDefaultStatus(myEvent.value)) {
          this.teacherStatus = "";
        } else {
          this.teacherStatus = myEvent.value;  
        } // end if

        this.dofetchTeacherList();

      } // end if

    } // end if

  } // end method

} // end class