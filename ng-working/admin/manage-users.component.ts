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
  selector: 'manage-users',
  templateUrl: 'manage-users.component.html',
  styleUrls: [ 'manage-users.component.css' ]
})
export class ManageUsersComponent implements OnInit {

  private myIs:HelperMyIs;
  private myArray:HelperMyArray;
  private myFormat:HelperMyFormat;
  private defaultType:DefaultType;
  private defaultMetaUserStatus:DefaultMeta;
  private defaultMetaUserPermission:DefaultMeta;

  private loginUser:User;

  private checkBoxList:CheckBoxComponent[]=[];

  private selectStatusComponent:DefaultComponent;

  userList:User[];

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
    this.defaultMetaUserStatus = this.getMetaSelectUserStatus();
    this.defaultMetaUserPermission = this.getMetaSelectUserPermission();

    this.pagination = new Pagination();

    this.subscribeLoginUser();
    this.subscribeEventPack();

  }

  ngOnInit():void {
  }

  private isDebug():boolean {
    return this.watchTower.isDebug();
  }

  private getMetaSelectUserStatus():DefaultMeta{
    return new DefaultMeta( // 5
      // public title:string
      "사용자 상태",
      // public placeholder:string
      "사용자 상태를 선택해주세요",
      // public eventKey:string
      this.myEventService.KEY_USER_STATUS,
      // public checkerKey:string
      "user_status",
      // public type:string
      this.defaultType.TYPE_SELECT
    );
  }
  private getMetaSelectUserPermission():DefaultMeta{
    return new DefaultMeta( // 5
      // public title:string
      "사용자 권한",
      // public placeholder:string
      "사용자 권한를 선택해주세요",
      // public eventKey:string
      this.myEventService.KEY_USER_PERMISSION,
      // public checkerKey:string
      "user_permission",
      // public type:string
      this.defaultType.TYPE_SELECT
    );
  }     

  private subscribeLoginUser() :void {

    if(this.isDebug()) console.log("manage-users / subscribeLoginUser / init");

    this.loginUser = this.watchTower.getLoginUser();

    if(null == this.loginUser || !this.loginUser.isAdminUser()) {
      this.goHome();
    } // end if

    this.init();
  } // end method

  private goHome() :void {
    if(this.isDebug()) console.log("manage-users / goHome / init");
    this.router.navigate(["/"]);
  }

  private subscribeEventPack() :void {

    if(this.isDebug()) console.log("manage-users / subscribeEventPack / init");

    let isEventPackReady:boolean = this.watchTower.getIsEventPackReady();
    if(this.isDebug()) console.log("manage-users / subscribeEventPack / isEventPackReady : ",isEventPackReady);

    if(this.watchTower.getIsEventPackReady()) {
      this.init();
    } else {
      // 2. EventPack 로딩이 완료되지 않았습니다. 로딩을 기다립니다.
      this.watchTower.isEventPackReady$.subscribe(
        (isEventPackReady:boolean) => {

        if(this.isDebug()) console.log("manage-users / subscribeEventPack / isEventPackReady : ",isEventPackReady);
        this.init();

      }); // end subscribe

    } // end if

  } // end method

  init() :void {

    if(this.isDebug()) console.log("manage-users / init / 시작");

    // 1. 운영자 유저의 pagination을 가져옵니다.
    this.fetchUserListPagination();
    // 2. 선생님 유저의 pagination을 가져옵니다.

    // 3. 학생 유저의 pagination을 가져옵니다.

  }

  private getDefaultOptionUserListStatus(user:User):DefaultOption[] {

    if(this.isDebug()) console.log("manage-users / getDefaultOptionUserList / 시작");

    if(null == user) {
      if(this.isDebug()) console.log("manage-users / getDefaultOptionUserList / 중단 / null == user");
      return;
    }

    let keyList:string[] = [];  
    let valueList:string[] = [];

    let userStatusList:string[] = this.watchTower.getMyConst().getList("user_status_list");
    let userStatusKorList:string[] = this.watchTower.getMyConst().getList("user_status_kor_list");

    for (var i = 0; i < userStatusList.length; ++i) {
      let userStatusKor:string = userStatusKorList[i];
      let userStatus:string = userStatusList[i];

      keyList.push(userStatusKor);
      valueList.push(userStatus);
    }

    return this.watchTower.getDefaultOptionListWithMeta(keyList, valueList, user.status, user);
  } // end method

  private getDefaultOptionUserListPermission(user:User):DefaultOption[] {

    if(this.isDebug()) console.log("manage-users / getDefaultOptionUserListPermission / 시작");

    if(null == user) {
      if(this.isDebug()) console.log("manage-users / getDefaultOptionUserListPermission / 중단 / null == user");
      return;
    }

    let keyList:string[] = [];  
    let valueList:string[] = [];

    let userPermissionList:string[] = this.watchTower.getMyConst().getList("user_permission_list");
    let userPermissionKorList:string[] = this.watchTower.getMyConst().getList("user_permission_kor_list");

    for (var i = 0; i < userPermissionList.length; ++i) {

      let userPermissionKor:string = userPermissionKorList[i];
      let userPermission:string = userPermissionList[i];

      keyList.push(userPermissionKor);
      valueList.push(userPermission);

    }

    return this.watchTower.getDefaultOptionListWithMeta(keyList, valueList, user.permission, user);
  } // end method    

  // @ Desc : 운영자 유저리스트의 페이지 네이션을 가져옵니다.
  private fetchUserListPagination() :void {

    if(this.isDebug()) console.log("manage-users / fetchUserListPagination / 시작");

    this.adminService
    .fetchUserListPagination(this.watchTower.getApiKey())
    .then((myResponse:MyResponse) => {

      if(this.isDebug()) console.log("manage-users / fetchUserListPagination / myResponse : ",myResponse);

      if(myResponse.isSuccess() && myResponse.hasDataProp("pagination")) {
        if(this.isDebug()) console.log("manage-users / fetchUserListPagination / success");

        // 1. 페이지네이션 데이터를 저장합니다. 가져온 데이터로 페이지네이션을 표시.
        let json = myResponse.getDataProp("pagination");
        this.pagination.setJSON(json);

        // 2. 유저 리스트를 가져옵니다. 
        this.fetchUserList(this.pagination["PAGE_NUM"], this.pagination["PAGE_RANGE"]);
        
      } else if(myResponse.isFailed()){
        if(this.isDebug()) console.log("manage-users / fetchUserListPagination / failed");

        this.watchTower.logAPIError("fetchUserListPagination has been failed!");
        if(null != myResponse.error) {
          this.watchTower.announceErrorMsgArr([myResponse.error]);
        } // end if
        
      } // end if

    }); // end service    

  }

  private updateUserList(userJSONList:any[]) :void {

    if(this.isDebug()) console.log("manage-users / updateUserList / 시작");

    if(this.myArray.isNotOK(userJSONList)) {
      if(this.isDebug()) console.log("manage-users / updateUserList / 중단 / this.myArray.isNotOK(userJSONList)");
      return;
    }

    let userList:User[] = [];
    for (var i = 0; i < userJSONList.length; ++i) {
      let userJSON = userJSONList[i];
      let user:User = new User().setJSON(userJSON);

      let defaultOptionListStatus:DefaultOption[] = this.getDefaultOptionUserListStatus(user);
      user["selectOptionListStatus"] = defaultOptionListStatus;

      let defaultOptionListPermission:DefaultOption[] = this.getDefaultOptionUserListPermission(user);
      user["selectOptionListPermission"] = defaultOptionListPermission;

      // 자신의 데이터인지 확인한다.
      if(this.loginUser.id === user.id) {
        user.isMe = true;
      }

      // 성별을 보기 쉽게 변경 
      let genderReadable:string =
      this.watchTower
      .getMyConst()
      .getValue(
        // srcKey:string, 
        "user_gender_list",
        // srcValue:string, 
        user.gender,
        // targetKey:string
        "user_gender_kor_list"
      );

      if(this.isDebug()) console.log("manage-users / updateUserList / genderReadable : ",genderReadable);

      user.gender_readable = genderReadable;

      userList.push(user);

    } // end for

    if(this.isDebug()) console.log("manage-users / updateUserList / userList : ",userList);

    this.userList = userList;
  }

  // @ Desc : 운영자 유저 리스트를 가져옵니다.
  private fetchUserList(pageNum:number, pageSize:number) :void {
    
    // 유저 리스트는 아래 카테고리별로 나누어 가져옵니다.
    // a. 운영자
    // b. 선생님
    // c. 학생

    this.adminService
    .fetchUserList(this.watchTower.getApiKey(), pageNum, pageSize)
    .then((myResponse:MyResponse) => {

      if(this.isDebug()) console.log("manage-users / fetchUserList / myResponse : ",myResponse);

      if(myResponse.isSuccess() && myResponse.hasDataProp("admin_user_list")) {

        let userJSONList:any[] = myResponse.getDataProp("admin_user_list");
        if(this.isDebug()) console.log("manage-users / fetchUserList / userJSONList : ",userJSONList);

        this.updateUserList(userJSONList);
        
      } else if(myResponse.isFailed()){
        if(this.isDebug()) console.log("manage-users / fetchUserList / 쿠키에 등록된 유저 정보가 없습니다. 초기화합니다.");

        this.watchTower.logAPIError("fetchUserList has been failed!");
        if(null != myResponse.error) {
          this.watchTower.announceErrorMsgArr([myResponse.error]);
        } // end if
        
      } // end if

    }); // end service

  } // end method

  updateCheckBoxes(checked:boolean) :void {

    if(this.isDebug()) console.log("manage-users / updateCheckBoxes / 시작");

    if(this.isDebug()) console.log("manage-users / updateCheckBoxes / this.checkBoxList : ",this.checkBoxList);    

    if(this.isDebug()) console.log("manage-users / updateCheckBoxes / checked : ",checked);

    for (var i = 0; i < this.checkBoxList.length; ++i) {
      let checkBox:CheckBoxComponent = this.checkBoxList[i];
      checkBox.setIsChecked(checked);
    } // end for

  } // end method

  updateUserStatus(value:string, user:User) :void {

    if(this.isDebug()) console.log("manage-users / updateUserStatus / 시작");

    if(null == value || "" === value) {
      if(this.isDebug()) console.log("manage-users / updateUserStatus / 중단 / value is not valid!");
      return;
    }
    if(null == user) {
      if(this.isDebug()) console.log("manage-users / updateUserStatus / 중단 / user is not valid!");
      return;
    }

    if(this.isDebug()) console.log("manage-users / updateUserStatus / value : ",value);
    if(this.isDebug()) console.log("manage-users / updateUserStatus / user : ",user);

    this.adminService
    .updateUser(
      // apiKey:string, 
      this.watchTower.getApiKey(),
      // userIdAdmin:number, 
      this.loginUser.id,
      // userId:number, 
      user.id,
      // userStatus:string, 
      value,
      // userPermission:string      
      user.permission
    )
    .then((myResponse:MyResponse) => {

      if(this.isDebug()) console.log("manage-users / updateUserStatus / myResponse : ",myResponse);

      if(myResponse.isSuccess()) {
        if(this.isDebug()) console.log("manage-users / updateUserStatus / success");

      } else if(myResponse.isFailed()){
        if(this.isDebug()) console.log("manage-users / updateUserStatus / failed");

        this.watchTower.logAPIError("updateUserStatus has been failed!");
        if(null != myResponse.error) {
          this.watchTower.announceErrorMsgArr([myResponse.error]);
        } // end if
        
      } // end if

    }); // end service

  }

  updateUserPermission(value:string, user:User) :void {

    if(this.isDebug()) console.log("manage-users / updateUserPermission / 시작");

    if(null == value || "" === value) {
      if(this.isDebug()) console.log("manage-users / updateUserPermission / 중단 / value is not valid!");
      return;
    }
    if(null == user) {
      if(this.isDebug()) console.log("manage-users / updateUserPermission / 중단 / user is not valid!");
      return;
    }

    if(this.isDebug()) console.log("manage-users / updateUserPermission / value : ",value);
    if(this.isDebug()) console.log("manage-users / updateUserPermission / user : ",user);

    this.adminService
    .updateUser(
      // apiKey:string, 
      this.watchTower.getApiKey(),
      // userIdAdmin:number, 
      this.loginUser.id,
      // userId:number, 
      user.id,
      // userStatus:string, 
      user.status,
      // userPermission:string      
      value
    )
    .then((myResponse:MyResponse) => {

      if(this.isDebug()) console.log("manage-users / updateUserPermission / myResponse : ",myResponse);

      if(myResponse.isSuccess()) {
        if(this.isDebug()) console.log("manage-users / updateUserPermission / success");

      } else if(myResponse.isFailed()){
        if(this.isDebug()) console.log("manage-users / updateUserPermission / failed");

        this.watchTower.logAPIError("updateUserPermission has been failed!");
        if(null != myResponse.error) {
          this.watchTower.announceErrorMsgArr([myResponse.error]);
        } // end if
        
      } // end if

    }); // end service

  }  

  onChangedFromChild(myEvent:MyEvent) :void{

    if(this.isDebug()) console.log("manage-users / onChangedFromChild / myEvent : ",myEvent);

    if(null == myEvent) {
      if(this.isDebug()) console.log("manage-users / onChangedFromChild / 중단 / null == myEvent");
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

      } else if(myEvent.hasKey(this.myEventService.KEY_USER_STATUS)) {

        this.updateUserStatus(myEvent.value, myEvent.metaObj);

      } else if(myEvent.hasKey(this.myEventService.KEY_USER_PERMISSION)) {

        this.updateUserPermission(myEvent.value, myEvent.metaObj);

      } // end if

      // Do someting ...     

    } // end if

  } // end method

} // end class