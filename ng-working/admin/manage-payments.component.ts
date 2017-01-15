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

  private loginUser:User;

  private checkBoxList:CheckBoxComponent[]=[];

  paymentList:PaymentImport[];

  pagination:Pagination;

  private pageNum:number = 1;
  private pageRowCnt:number = 5;

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

    this.pagination = new Pagination();

    this.subscribeLoginUser();
    this.subscribeEventPack();

  } // end constructor

  ngOnInit():void {
  }

  private isDebug():boolean {
    return this.watchTower.isDebug();
  }

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
        // pageRowCnt:number, 
        this.pageRowCnt,
        // klassId:number, 
        this.klassId,
        // userId:number
        this.userId
      );

    } else {

      this.fetchBuyKlass(
        // pageNum:number, 
        this.pagination.pageNum, 
        // pageRowCnt:number, 
        this.pagination.pageRowCnt,
        // klassId:number, 
        this.klassId,
        // userId:number
        this.userId
      );

    }

  } // end method

  // @ Desc : 유저 리스트를 가져옵니다.
  private fetchBuyKlass(  pageNum:number, 
                          pageRowCnt:number, 
                          klassId:number, 
                          userId:number ) :void {

    this.adminService
    .fetchBuyKlass(
      this.watchTower.getApiKey(), 
      pageNum, 
      pageRowCnt,
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

      } // end if

      // TODO - 이 상태에 해당되는 유저 리스트 노출
      // TODO - 전체 갯수 노출

    } // end if

  } // end method

} // end class