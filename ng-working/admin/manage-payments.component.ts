import { Component, 
         OnInit, 
         Input, 
         Output, 
         ViewChild,
         EventEmitter }                from '@angular/core';

import { Router }                      from '@angular/router';

import { AdminService }                from './service/admin.service';

import { User }                        from '../users/model/user';

import { DefaultMeta }                 from '../widget/input/default/model/default-meta';
import { DefaultType }                 from '../widget/input/default/model/default-type';
import { DefaultOption }               from '../widget/input/default/model/default-option';
import { CheckBoxComponent }           from '../widget/checkbox/checkbox.component';
import { Pagination }                  from '../widget/pagination/model/pagination';
import { PaymentImport }               from '../widget/payment/model/payment-import';

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
  selector: 'manage-payments',
  templateUrl: 'manage-payments.component.html',
  styleUrls: [ 'manage-payments.component.css' ]
})
export class ManagePaymentsComponent implements OnInit {

  private myIs:HelperMyIs;
  private myArray:HelperMyArray;
  private myFormat:HelperMyFormat;
  private defaultType:DefaultType;

  // REMOVE ME
  // private defaultMetaUserStatus:DefaultMeta;
  // private defaultMetaUserStatusForSearch:DefaultMeta;
  // private defaultMetaUserPermission:DefaultMeta;
  // private defaultMetaUserPermissionForSearch:DefaultMeta;
  // private defaultMetaSearchQuery:DefaultMeta;

  private loginUser:User;

  private checkBoxList:CheckBoxComponent[]=[];

  paymentList:PaymentImport[];

  pagination:Pagination;

  // REMOVE ME
  // private searchQuery:string="";
  // private userStatus:string="";
  // private userPermission:string="";
  // selectOptionListUserStatus:DefaultOption[];
  // selectOptionListUserPermission:DefaultOption[];

  private pageNum:number = 1;
  private pageRange:number = 5;

  private klassId:number = -1;
  private userId:number = -1;


  // 자신의 자식 객체에서 이벤트를 받는다.
  constructor(  private adminService:AdminService,
                private myEventService:MyEventService,
                private watchTower:MyEventWatchTowerService,
                private router:Router ) {

    this.myIs = new HelperMyIs();
    this.myArray = new HelperMyArray();
    this.myFormat = new HelperMyFormat();
    this.defaultType = new DefaultType();

    this.adminService.setWatchTower(watchTower);

    // REMOVE ME
    // this.defaultMetaUserStatus = this.getMetaSelectUserStatus();
    // this.defaultMetaUserStatusForSearch = this.getMetaSelectUserStatusForSearch();
    // this.defaultMetaUserPermission = this.getMetaSelectUserPermission();
    // this.defaultMetaUserPermissionForSearch = this.getMetaSelectUserPermissionForSearch();
    // this.defaultMetaSearchQuery = this.getMetaSearchInput();

    this.pagination = new Pagination();

    // this.selectOptionListUserStatus = this.getDefaultOptionUserListStatusForSearch();
    // this.selectOptionListUserPermission = this.getDefaultOptionUserListPermissionForSearch();

    this.subscribeLoginUser();
    this.subscribeEventPack();



  } // end constructor

  ngOnInit():void {
  }

  private isDebug():boolean {
    return this.watchTower.isDebug();
  }

  // REMOVE ME
  /*
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

  private getMetaSelectUserStatusForSearch():DefaultMeta{
    return new DefaultMeta( // 5
      // public title:string
      "검색 조건 - 사용자 상태",
      // public placeholder:string
      "검색 조건 - 사용자 상태를 선택해주세요",
      // public eventKey:string
      this.myEventService.KEY_USER_STATUS_FOR_SEARCH,
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

  private getMetaSelectUserPermissionForSearch():DefaultMeta{
    return new DefaultMeta( // 5
      // public title:string
      "검색 조건 - 사용자 권한",
      // public placeholder:string
      "검색 조건 - 사용자 권한를 선택해주세요",
      // public eventKey:string
      this.myEventService.KEY_USER_PERMISSION_FOR_SEARCH,
      // public checkerKey:string
      "user_permission",
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
  */   

  private subscribeLoginUser() :void {

    if(this.isDebug()) console.log("manage-payments / subscribeLoginUser / init");

    this.loginUser = this.watchTower.getLoginUser();

    if(null == this.loginUser || !this.loginUser.isAdminUser()) {
      this.goHome();
    } // end if

    this.init();
  } // end method

  private goHome() :void {
    if(this.isDebug()) console.log("manage-payments / goHome / init");
    this.router.navigate(["/"]);
  }

  private subscribeEventPack() :void {

    if(this.isDebug()) console.log("manage-payments / subscribeEventPack / init");

    let isEventPackReady:boolean = this.watchTower.getIsEventPackReady();
    if(this.isDebug()) console.log("manage-payments / subscribeEventPack / isEventPackReady : ",isEventPackReady);

    if(this.watchTower.getIsEventPackReady()) {
      this.init();
    } else {
      // 2. EventPack 로딩이 완료되지 않았습니다. 로딩을 기다립니다.
      this.watchTower.isEventPackReady$.subscribe(
        (isEventPackReady:boolean) => {

        if(this.isDebug()) console.log("manage-payments / subscribeEventPack / isEventPackReady : ",isEventPackReady);
        this.init();

      }); // end subscribe

    } // end if

  } // end method

  init() :void {

    if(this.isDebug()) console.log("manage-payments / init / 시작");
    this.dofetchBuyKlass();

  } // end method

  /*
  private getDefaultOptionUserListStatus(user:User):DefaultOption[] {

    if(this.isDebug()) console.log("manage-payments / getDefaultOptionUserListStatus / 시작");

    let defaultOptionList:DefaultOption[] = 
    this.watchTower.getDefaultOptionListWithMetaByKeys(
      // keyListName:string,
      "user_status_kor_list",
      // valueListName:string,
      "user_status_list",
      // valueFocus:string,
      user.status,
      // metaObj:any
      user
    );
    if(this.myArray.isOK(defaultOptionList)) {
      // "모든 상태" - 기본값 을 제거함.
      defaultOptionList.shift();
    }

    if(this.isDebug()) console.log("manage-payments / getDefaultOptionUserListStatus / defaultOptionList : ",defaultOptionList);

    return defaultOptionList;
    
  } // end method

  // @ Desc : 검색을 위한 유저 상태 default option list - select box 
  private getDefaultOptionUserListStatusForSearch():DefaultOption[] {

    if(this.isDebug()) console.log("manage-payments / getDefaultOptionUserListStatusForSearch / 시작");

    return this.watchTower.getDefaultOptionListByKeys(
      // keyListName:string,
      "user_status_kor_list",
      // valueListName:string,
      "user_status_list",
      // valueFocus:string
      ""
    );

  } // end method

      // @ Desc : 검색을 위한 유저 권한 default option list - select box 
  private getDefaultOptionUserListPermissionForSearch():DefaultOption[] {

    if(this.isDebug()) console.log("manage-payments / getDefaultOptionUserListPermissionForSearch / 시작");

    return this.watchTower.getDefaultOptionListByKeys(
      // keyListName:string,
      "user_permission_kor_list",
      // valueListName:string,
      "user_permission_list",
      // valueFocus:string
      ""
    );

  } // end method

  private getDefaultOptionUserListPermission(user:User):DefaultOption[] {

    if(this.isDebug()) console.log("manage-payments / getDefaultOptionUserListPermission / 시작");

    if(null == user) {
      if(this.isDebug()) console.log("manage-payments / getDefaultOptionUserListPermission / 중단 / null == user");
      return;
    }

    let defaultOptionList:DefaultOption[] = 
    this.watchTower.getDefaultOptionListWithMetaByKeys(
      // keyListName:string,
      "user_permission_kor_list",
      // valueListName:string,
      "user_permission_list",
      // valueFocus:string,
      user.permission,
      // metaObj:any
      user
    );
    if(this.myArray.isOK(defaultOptionList)) {
      // "모든 권한" - 기본값 을 제거함.
      defaultOptionList.shift();
    } // end if

    if(this.isDebug()) console.log("manage-payments / getDefaultOptionUserListPermission / defaultOptionList : ",defaultOptionList);

    return defaultOptionList;

  } // end method 


  private updateUserList(jsonUserList:any[]) :void {

    if(this.isDebug()) console.log("manage-payments / updateUserList / 시작");

    if(this.myArray.isNotOK(jsonUserList)) {

      // 검색 결과가 없습니다.
      this.userList = null;

    } else {

      let userList:User[] = [];
      for (var i = 0; i < jsonUserList.length; ++i) {
        let userJSON = jsonUserList[i];
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

        if(this.isDebug()) console.log("manage-payments / updateUserList / genderReadable : ",genderReadable);

        user.gender_readable = genderReadable;

        userList.push(user);

      } // end for

      if(this.isDebug()) console.log("manage-payments / updateUserList / userList : ",userList);

      this.userList = userList;
      
    } // end if

  } // end method  
  */   

  private updatePagination(jsonPagination:any) :void {

    if(this.isDebug()) console.log("manage-payments / updatePagination / 시작");

    if(this.isDebug()) console.log("manage-payments / updatePagination / jsonPagination : ",jsonPagination);

    if(null == jsonPagination) {
      this.pagination = null;
    } else {
      this.pagination = new Pagination().setJSON(jsonPagination);
    }
  }

  private updatePaymentList(jsonPaymentList:any[]) :void {

    if(this.isDebug()) console.log("manage-payments / updatePaymentList / 시작");

    if(this.myArray.isNotOK(jsonPaymentList)) {

      // 검색 결과가 없습니다.
      this.paymentList = null;

    } else {

      let paymentList:PaymentImport[] = [];
      for (var i = 0; i < jsonPaymentList.length; ++i) {
        let paymentJSON = jsonPaymentList[i];
        let payment:PaymentImport = new PaymentImport().setJSON(paymentJSON);

        paymentList.push(payment);

      } // end for

      if(this.isDebug()) console.log("manage-payments / updatePaymentList / paymentList : ",paymentList);

      this.paymentList = paymentList;
      
    } // end if

  } // end method    


  // @ Desc : 저장된 변수 값들로 유저 리스트를 가져옵니다.
  private dofetchBuyKlass():void {

    if(null == this.pagination) {

      this.fetchBuyKlass(
        // pageNum:number, 
        this.pageNum, 
        // pageSize:number, 
        this.pageRange,
        // klassId:number, 
        this.klassId,
        // userId:number
        this.userId
      );

    } else {

      this.fetchBuyKlass(
        // pageNum:number, 
        this.pagination.pageNum, 
        // pageSize:number, 
        this.pagination.pageRange,
        // klassId:number, 
        this.klassId,
        // userId:number
        this.userId
      );

    }

  } // end method

  // @ Desc : 유저 리스트를 가져옵니다.
  private fetchBuyKlass(  pageNum:number, 
                          pageSize:number, 
                          klassId:number, 
                          userId:number ) :void {

    this.adminService
    .fetchBuyKlass(
      this.watchTower.getApiKey(), 
      pageNum, 
      pageSize,
      klassId,
      userId
    )
    .then((myResponse:MyResponse) => {

      if(this.isDebug()) console.log("manage-payments / fetchBuyKlass / myResponse : ",myResponse);

      if( myResponse.isSuccess() && 
          myResponse.hasDataProp("pagination") &&
          myResponse.hasDataProp("payment_list")) {

        // 1. Pagination 재설정
        let jsonPagination = myResponse.getDataProp("pagination");
        if(this.isDebug()) console.log("manage-payments / fetchBuyKlass / jsonPagination : ",jsonPagination);
        this.updatePagination(jsonPagination);

        // 2. Payment List 재설정 
        let paymentJSONList:any[] = myResponse.getDataProp("payment_list");
        if(this.isDebug()) console.log("manage-payments / fetchBuyKlass / paymentJSONList : ",paymentJSONList);

        this.updatePaymentList(paymentJSONList);
        
      } else if(myResponse.isFailed()){

        if(this.isDebug()) console.log("manage-payments / fetchBuyKlass / 결제 정보 리스트를 가져오는데 실패했습니다.");

        this.watchTower.logAPIError("fetchBuyKlass has been failed!");
        if(null != myResponse.error) {
          this.watchTower.announceErrorMsgArr([myResponse.error]);
        } // end if
        
      } // end if

    }); // end service

  } // end method



  updateCheckBoxes(checked:boolean) :void {

    if(this.isDebug()) console.log("manage-payments / updateCheckBoxes / 시작");

    if(this.isDebug()) console.log("manage-payments / updateCheckBoxes / this.checkBoxList : ",this.checkBoxList);    

    if(this.isDebug()) console.log("manage-payments / updateCheckBoxes / checked : ",checked);

    for (var i = 0; i < this.checkBoxList.length; ++i) {
      let checkBox:CheckBoxComponent = this.checkBoxList[i];
      checkBox.setIsChecked(checked);
    } // end for

  } // end method


// REMOVE ME
/*
  onClickSearch(event) :void {

    if(this.isDebug()) console.log("manage-payments / onClickSearch / 시작");

    event.stopPropagation();
    event.preventDefault();

    // 새로운 검색어라면 첫 검색 결과 페이지 노출
    // pagination 내의 이동이라면, 검색어와 pageNum, pageRange를 모두 사용한다.
    // this.searchUser(this.searchQuery, 1, this.pagination.pageRange);

    this.fetchUserList(
      // pageNum:number,
      1,
      // pageSize:number,
      this.pagination.pageRange,
      // searchQuery:string,
      this.searchQuery,
      // userStatus:string, 
      "",
      // userPermission:string
      this.userPermission
    );

  } // end method
  isDefaultStatus(status:string):boolean {

    if(null == status || "" === status) {
      return false;
    }

    if(this.myArray.isNotOK(this.selectOptionListUserStatus)) {
      return false;
    } // end if

    let defaultOption:DefaultOption = this.selectOptionListUserStatus[0];
    if(null == defaultOption) {
      return false;
    } // end if

    return (defaultOption.value === status)?true:false;
  }
  isDefaultPermission(permission:string):boolean {

    if(null == permission || "" === permission) {
      return false;
    }

    if(this.myArray.isNotOK(this.selectOptionListUserPermission)) {
      return false;
    } // end if

    let defaultOption:DefaultOption = this.selectOptionListUserPermission[0];
    if(null == defaultOption) {
      return false;
    } // end if

    return (defaultOption.value === permission)?true:false;
  }


  updateUserStatus(value:string, user:User) :void {

    if(this.isDebug()) console.log("manage-payments / updateUserStatus / 시작");

    if(null == value || "" === value) {
      if(this.isDebug()) console.log("manage-payments / updateUserStatus / 중단 / value is not valid!");
      return;
    }
    if(null == user) {
      if(this.isDebug()) console.log("manage-payments / updateUserStatus / 중단 / user is not valid!");
      return;
    }

    if(this.isDebug()) console.log("manage-payments / updateUserStatus / value : ",value);
    if(this.isDebug()) console.log("manage-payments / updateUserStatus / user : ",user);

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

      if(this.isDebug()) console.log("manage-payments / updateUserStatus / myResponse : ",myResponse);

      if(myResponse.isSuccess()) {
        if(this.isDebug()) console.log("manage-payments / updateUserStatus / success");

      } else if(myResponse.isFailed()){
        if(this.isDebug()) console.log("manage-payments / updateUserStatus / failed");

        this.watchTower.logAPIError("updateUserStatus has been failed!");
        if(null != myResponse.error) {
          this.watchTower.announceErrorMsgArr([myResponse.error]);
        } // end if
        
      } // end if

    }); // end service

  }

  updateUserPermission(value:string, user:User) :void {

    if(this.isDebug()) console.log("manage-payments / updateUserPermission / 시작");

    if(null == value || "" === value) {
      if(this.isDebug()) console.log("manage-payments / updateUserPermission / 중단 / value is not valid!");
      return;
    }
    if(null == user) {
      if(this.isDebug()) console.log("manage-payments / updateUserPermission / 중단 / user is not valid!");
      return;
    }

    if(this.isDebug()) console.log("manage-payments / updateUserPermission / value : ",value);
    if(this.isDebug()) console.log("manage-payments / updateUserPermission / user : ",user);

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

      if(this.isDebug()) console.log("manage-payments / updateUserPermission / myResponse : ",myResponse);

      if(myResponse.isSuccess()) {
        if(this.isDebug()) console.log("manage-payments / updateUserPermission / success");

      } else if(myResponse.isFailed()){
        if(this.isDebug()) console.log("manage-payments / updateUserPermission / failed");

        this.watchTower.logAPIError("updateUserPermission has been failed!");
        if(null != myResponse.error) {
          this.watchTower.announceErrorMsgArr([myResponse.error]);
        } // end if
        
      } // end if

    }); // end service

  } // end method  
*/  


  onChangedFromChild(myEvent:MyEvent) :void{

    if(this.isDebug()) console.log("manage-payments / onChangedFromChild / myEvent : ",myEvent);

    if(null == myEvent) {
      if(this.isDebug()) console.log("manage-payments / onChangedFromChild / 중단 / null == myEvent");
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

      } else if(myEvent.hasKey(this.myEventService.KEY_PAGE_NUM)) {

        this.pagination.pageNum = +myEvent.value;
        this.dofetchBuyKlass();
// REMOVE ME
/*
      } else if(myEvent.hasKey(this.myEventService.KEY_USER_STATUS)) {

        this.updateUserStatus(myEvent.value, myEvent.metaObj);

      } else if(myEvent.hasKey(this.myEventService.KEY_USER_PERMISSION)) {

        this.updateUserPermission(myEvent.value, myEvent.metaObj);


      } else if(myEvent.hasKey(this.myEventService.KEY_SEARCH_QUERY)) {

        this.searchQuery = myEvent.value;

      } else if(myEvent.hasKey(this.myEventService.KEY_USER_STATUS_FOR_SEARCH)) {

        if(this.isDefaultStatus(myEvent.value)) {
          this.userStatus = "";
        } else {
          this.userStatus = myEvent.value;  
        } // end if

        this.dofetchBuyKlass();

      } else if(myEvent.hasKey(this.myEventService.KEY_USER_PERMISSION_FOR_SEARCH)) {

        if(this.isDefaultPermission(myEvent.value)) {
          this.userPermission = "";
        } else {
          this.userPermission = myEvent.value;  
        } // end if

        this.dofetchBuyKlass();
*/
      } // end if

      // TODO - 이 상태에 해당되는 유저 리스트 노출
      // TODO - 전체 갯수 노출

    } // end if

  } // end method

} // end class