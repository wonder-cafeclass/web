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

import { UserService }                from '../../../users/service/user.service';

import { User }                       from '../../../users/model/user';
import { Klass }                      from '../../../widget/klass/model/klass';
import { KlassNStudent }              from '../../../widget/klass/model/klass-n-student';

import { Pagination }                 from '../../../widget/pagination/model/pagination';

import { PaymentImport }              from '../../../widget/payment/model/payment-import';
import { PaymentService }              from '../../../widget/payment/service/payment.service';

@Component({
  moduleId: module.id,
  selector: 'my-info-payment',
  templateUrl: 'my-info-payment.component.html',
  styleUrls: [ 'my-info-payment.component.css' ]
})
export class MyInfoPaymentComponent implements AfterViewInit {

  @Input() eventKey:string = "";
  @Output() emitter = new EventEmitter<any>();

  loginUser:User;

  piList:PaymentImport[];

  pagination:Pagination;

  constructor(private paymentService:PaymentService,
              public myEventService:MyEventService,
              private watchTower:MyEventWatchTowerService,
              public router:Router) {

    this.paymentService.setWatchTower(watchTower);

  }

  private isDebug():boolean {
    return true;
    // return this.watchTower.isDebug();
  }

  ngAfterViewInit(): void {

    // 자식 뷰가 모두 완료된 이후에 초기화를 진행.
    if(this.isDebug()) console.log("my-info-payment / ngAfterViewInit");
    this.asyncViewPack();
  }

  private asyncViewPack(): void {
    
    if(this.isDebug()) console.log("my-info-payment / asyncViewPack / 시작");

    // 이미 View 기본정보가 들어왔다면 바로 가져온다. 
    if(this.watchTower.getIsViewPackReady()) {
      if(this.isDebug()) console.log("my-info-payment / asyncViewPack / isViewPackReady : ",true);
      this.init();
    } // end if

    // View에 필요한 기본 정보가 비동기로 들어올 경우, 처리.
    this.watchTower.isViewPackReady$.subscribe(
      (isViewPackReady:boolean) => {
      if(this.isDebug()) console.log("my-info-payment / asyncViewPack / subscribe / isViewPackReady : ",isViewPackReady);
      this.init();
    }); // end subscribe

  }



  private init() :void {

    if(this.isDebug()) console.log("my-info-payment / init / 시작");

    // 로그인한 유저 정보를 가져옵니다.
    this.setLoginUser();
    // 페이지 진입을 기록으로 남깁니다.
    this.logActionPage();
    // 컴포넌트가 준비된 것을 부모 객체에게 전달합니다.
    this.emitEventOnReady();
    // Pagination을 기본값으로 설정합니다.
    this.updatePagination(null);
    // 해당 유저에게 필요한 정보를 DB로 부터 가져옵니다.
    this.fetchPaymentList(-1);

  }

  private setLoginUser() :void {

    if(this.isDebug()) console.log("my-info-payment / setLoginUser / 시작");

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

    if(this.isDebug()) console.log("my-info-payment / logActionPage / 시작");

    this.watchTower.logPageEnter(
      // pageType:string
      this.watchTower.getMyLoggerService().pageTypeMyInfoPayment
    );

  } // end method

  private emitEventOnReady() :void {

    if(this.isDebug()) console.log("my-info-payment / emitEventOnReady / 시작");

    let myEvent:MyEvent =
    this.watchTower.getEventOnReady(
      // eventKey:string, 
      this.eventKey,
      // component
      this
    );

    this.emitter.emit(myEvent);

  }

  private updatePagination(jsonPagination:any) :void {

    if(this.isDebug()) console.log("my-info-payment / updatePagination / 시작");

    if(this.isDebug()) console.log("my-info-payment / updatePagination / jsonPagination : ",jsonPagination);

    if(null == jsonPagination) {
      this.pagination = new Pagination();
    } else {
      this.pagination = new Pagination().setJSON(jsonPagination);
    }
  }

  private fetchPaymentList(klassId:number):void {

    if(this.isDebug()) console.log("my-info-payment / fetchPaymentList / 시작");

    if(this.isDebug()) console.log("my-info-payment / fetchPaymentList / klassId : ",klassId);

    if(!(0 < this.getLoginUserId())) {
      if(this.isDebug()) console.log("my-info-payment / fetchPaymentList / 중단 / loginUserId is not valid!");
      return;
    }

    // 1. 수강중인 클래스 정보 가져오기 (최대 5개 노출)
    this.paymentService.fetchImportHistory(
      // apiKey:string, 
      this.watchTower.getApiKey(),
      // pageNum:number,
      this.pagination.pageNum,
      // pageRowCnt:number,
      this.pagination.pageRowCnt,
      // paymentImpUid:string,
      "",
      // klassId:number,
      klassId,
      // userId:number,
      this.getLoginUserId(),
      // loginUserId:number
      this.getLoginUserId()
      
    ).then((myResponse:MyResponse) => {

      // 로그 등록 결과를 확인해볼 수 있습니다.
      if(this.isDebug()) console.log("my-info-payment / fetchPaymentList / myResponse : ",myResponse);

      if( myResponse.isSuccess() && 
          myResponse.hasDataProp("pagination") &&
          myResponse.hasDataProp("list")) {

        // 1. Pagination 재설정
        let jsonPagination = myResponse.getDataProp("pagination");
        if(this.isDebug()) console.log("my-info-payment / fetchKlassList / jsonPagination : ",jsonPagination);
        this.updatePagination(jsonPagination);

        let piList:PaymentImport[] = [];
        let jsonList = myResponse.getDataProp("list");
        for (var i = 0; i < jsonList.length; ++i) {
          let json = jsonList[i];
          let pi:PaymentImport = new PaymentImport().setJSON(json);
          piList.push(pi);
        } // end for

        this.piList = piList;

        if(this.isDebug()) console.log("my-info-payment / fetchPaymentList / piList : ",piList);

      } else if(myResponse.isFailed()) {  

        if(this.isDebug()) console.log("my-info-payment / fetchPaymentList / 수강 학생 정보 등록에 실패했습니다.");

        this.watchTower.logAPIError("fetchPaymentList has been failed!");
        if(null != myResponse.error) {
          this.watchTower.announceErrorMsgArr([myResponse.error]);
        } // end if

      } // end if

    }); // end service

    // 2. 관심 강의 리스트 가져오기(나중에...)

  }

  // @ Desc : 외부에서 이 컴포넌트를 보여주기 전에 호출.
  setReadyBeforeShow():void {
    if(this.isDebug()) console.log("my-info-payment / setReadyBeforeShow / 시작");
    this.updateFooter();
  }

  private updateFooter():void {
    if(null == this.watchTower) {
      return;
    }
    this.watchTower.announceFooterUpdate();
  }  


  onClickKlass(klass:Klass):void {

    if(this.isDebug()) console.log("my-info-payment / onClickKlass / 시작");

    if(null == klass) {
      if(this.isDebug()) console.log("my-info-payment / onClickKlass / 중단 / null == klass");
      return;
    } // end if

    if(!(0 < klass.id)) {
      if(this.isDebug()) console.log("my-info-payment / onClickKlass / 중단 / klass.id is not valid!");
      return;
    } // end if


    // 클래스 상세 페이지로 이동합니다.
    // this.router.navigate([`/class-center/${klass.id}`]);

  }

  onChangedFromChild(myEvent:MyEvent) {

    if(this.isDebug()) console.log("my-info-payment / onChangedFromChild / init");
    if(this.isDebug()) console.log("my-info-payment / onChangedFromChild / myEvent : ",myEvent);
    if(this.isDebug()) console.log("my-info-payment / onChangedFromChild / myEvent.key : ",myEvent.key);
    if(this.isDebug()) console.log("my-info-payment / onChangedFromChild / myEvent.value : ",myEvent.value);

    if(myEvent.isNotValid()) {
      if(this.isDebug()) console.log("my-info-payment / onChangedFromChild / ON_CHANGE_NOT_VALID / 중단 / myEvent.isNotValid()");
      // 에러 로그 등록
      this.watchTower.logErrorBadValue(
        `my-info-payment / onChangedFromChild / myEvent.isNotValid()`
      );
      return;
    } // end if

    if(this.watchTower.isNotOK(myEvent)) {
      if(this.isDebug()) console.log("my-info-payment / onChangedFromChild / 중단 / 값이 유효하지 않습니다.");
      // 에러 로그 등록
      this.watchTower.logErrorBadValue(
        `my-info-payment / onChangedFromChild / this.watchTower.isNotOK(myEvent)`
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

      if(myEvent.hasKey(this.myEventService.KEY_PAGE_NUM)) {

        this.pagination.pageNum = +myEvent.value;
        this.fetchPaymentList(null);

      } // end if


    } else if(myEvent.hasEventName(this.watchTower.getMyEventService().ON_CLICK)) {

      if(myEvent.hasKey(this.myEventService.KEY_WIDGET_KLASS_CARD)) {

        this.onClickKlass(myEvent.metaObj);

      } // end if
    
    } // end if

  } // end method

}