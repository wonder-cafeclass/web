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

  private loginUser:User;

  private checkBoxList:CheckBoxComponent[]=[];

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

    this.pagination = new Pagination();

    this.subscribeLoginUser();
    this.subscribeEventPack();

  }

  ngOnInit():void {
  }

  private isDebug():boolean {
    return this.watchTower.isDebug();
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
    this.fetchUsersAdminPagination();
    // 2. 선생님 유저의 pagination을 가져옵니다.

    // 3. 학생 유저의 pagination을 가져옵니다.

  }

  // @ Desc : 운영자 유저리스트의 페이지 네이션을 가져옵니다.
  private fetchUsersAdminPagination() :void {

    if(this.isDebug()) console.log("manage-users / fetchUsersAdminPagination / 시작");

    this.adminService
    .fetchUsersAdminPagination(this.watchTower.getApiKey())
    .then((myResponse:MyResponse) => {

      if(this.isDebug()) console.log("manage-users / fetchUsersAdminPagination / myResponse : ",myResponse);

      if(myResponse.isSuccess() && myResponse.hasDataProp("pagination")) {
        if(this.isDebug()) console.log("manage-users / fetchUsersAdminPagination / success");

        // 1. 페이지네이션 데이터를 저장합니다. 가져온 데이터로 페이지네이션을 표시.
        let json = myResponse.getDataProp("pagination");
        this.pagination.setJSON(json);

        // 2. 유저 리스트를 가져옵니다. 
        this.fetchUserAdminList(this.pagination["PAGE_NUM"], this.pagination["PAGE_RANGE"]);
        
      } else if(myResponse.isFailed()){
        if(this.isDebug()) console.log("manage-users / fetchUsersAdminPagination / failed");

        this.watchTower.logAPIError("fetchUsersAdminPagination has been failed!");
        if(null != myResponse.error) {
          this.watchTower.announceErrorMsgArr([myResponse.error]);
        } // end if
        
      } // end if

    }); // end service    

  }

  // @ Desc : 운영자 유저 리스트를 가져옵니다.
  private fetchUserAdminList(pageNum:number, pageSize:number) :void {
    
    // 유저 리스트는 아래 카테고리별로 나누어 가져옵니다.
    // a. 운영자
    // b. 선생님
    // c. 학생

    this.adminService
    .fetchUsersAdmin(this.watchTower.getApiKey(), pageNum, pageSize)
    .then((myResponse:MyResponse) => {

      if(this.isDebug()) console.log("manage-users / fetchUserAdminList / myResponse : ",myResponse);

      if(myResponse.isSuccess() && myResponse.hasDataProp("admin_user_list")) {

        let userJSONList:any[] = myResponse.getDataProp("admin_user_list");

        if(this.isDebug()) console.log("manage-users / fetchUserAdminList / userJSONList : ",userJSONList);

        let userList:User[] = [];
        for (var i = 0; i < userJSONList.length; ++i) {
          let userJSON = userJSONList[i];
          let user:User = new User().setJSON(userJSON);
          userList.push(user);
        } // end for

        if(this.isDebug()) console.log("manage-users / fetchUserAdminList / userList : ",userList);

        this.userList = userList;
        
      } else if(myResponse.isFailed()){
        if(this.isDebug()) console.log("manage-users / fetchUserAdminList / 쿠키에 등록된 유저 정보가 없습니다. 초기화합니다.");

        this.watchTower.logAPIError("fetchUserAdminList has been failed!");
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

  onChangedFromChild(myEvent:MyEvent) :void{

    if(this.isDebug()) console.log("manage-users / onChangedFromChild / myEvent : ",myEvent);

    if(null == myEvent) {
      if(this.isDebug()) console.log("manage-users / onChangedFromChild / 중단 / null == myEvent");
      return;
    } // end if

    if(myEvent.hasEventName(this.myEventService.ON_READY)) {

      if(myEvent.hasKey(this.myEventService.KEY_CHECKBOX_ALL)) {

        // this.checkBoxList.push(myEvent.metaObj);

      } else if(myEvent.hasKey(this.myEventService.KEY_CHECKBOX)) {

        this.checkBoxList.push(myEvent.metaObj);

      }

    } else if(myEvent.hasEventName(this.myEventService.ON_CHANGE)) {

      if(myEvent.hasKey(this.myEventService.KEY_CHECKBOX_ALL)) {

        let isChecked:boolean = ("true" === myEvent.value)?true:false;
        this.updateCheckBoxes(isChecked);

      } // end if

      // Do someting ...     

    } // end if

  } // end method

} // end class