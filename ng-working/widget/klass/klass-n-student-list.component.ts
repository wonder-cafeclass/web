import {  Component, 
          Input, 
          Output,
          EventEmitter,          
          OnInit }                  from '@angular/core';

import { MyEvent }                  from '../../util/model/my-event';
import { MyEventWatchTowerService } from '../../util/service/my-event-watchtower.service';
import { HelperMyArray }            from '../../util/helper/my-array';
import { MyResponse }               from '../../util/model/my-response';

import { PaymentImport }            from '../../widget/payment/model/payment-import';
import { PaymentService }           from '../../widget/payment/service/payment.service';

import { Klass }                    from '../../klass/model/klass';
import { KlassAttendance }          from '../../klass/model/klass-attendance';
import { KlassNStudent }            from '../../klass/model/klass-n-student';

import { User }                     from '../../users/model/user';
import { Teacher }                  from '../../teachers/model/teacher';


@Component({
  moduleId: module.id,
  selector: 'klass-n-student-list',
  templateUrl: 'klass-n-student-list.component.html',
  styleUrls: [ 'klass-n-student-list.component.css' ]
})
export class KlassNStudentListComponent implements OnInit {

  // @ Common Props
  @Output() emitter = new EventEmitter<MyEvent>();

  // @ User Custom
  @Input() eventKey:string;
  @Input() klassNStudentList:KlassNStudent[];
  @Input() isShowCancle:boolean=false;

  katStatus:string="";
  isValidPayment:boolean=false;
  isShowCertificate:boolean=false;

  private myArray:HelperMyArray;

  constructor(  private watchTower:MyEventWatchTowerService, 
                private paymentService:PaymentService) {

    // Do something...
    this.myArray = new HelperMyArray();

  } // end constructor

  private isDebug():boolean {
    return this.watchTower.isDebug();
  } // end method

  ngOnInit(): void {

    if(this.isDebug()) console.log("klass-n-student-list / ngOnInit / init");

    this.asyncViewPack();

  }

  private getLoginUserId() :number {

    if(this.isDebug()) console.log("klass-n-student-list / getLoginUserId / 시작");
    let loginUser:User = this.watchTower.getLoginUser();

    let loginUserId:number = -1;
    if(null != loginUser) {
      loginUserId = loginUser.id;
    }
    if(this.isDebug()) console.log("klass-n-student-list / getLoginUserId / loginUserId : ",loginUserId);

    return loginUserId;
  }

  private asyncViewPack(): void {
    
    if(this.isDebug()) console.log("klass-n-student-list / asyncViewPack / 시작");

    // 이미 View 기본정보가 들어왔다면 바로 가져온다. 
    if(this.watchTower.getIsViewPackReady()) {
      if(this.isDebug()) console.log("klass-n-student-list / asyncViewPack / isViewPackReady : ",true);
      this.init();
    } // end if

    // View에 필요한 기본 정보가 비동기로 들어올 경우, 처리.
    this.watchTower.isViewPackReady$.subscribe(
      (isViewPackReady:boolean) => {
      if(this.isDebug()) console.log("klass-n-student-list / asyncViewPack / subscribe / isViewPackReady : ",isViewPackReady);
      this.init();
    }); // end subscribe

  }
  private init() :void {

    if(this.isDebug()) console.log("klass-n-student-list / init / 시작");

    // 부모 객체에게 준비되었다는 이벤트를 보냅니다.
    this.emitEventOnReady();

  } // end method

  private emitEventOnReady() :void {

    if(this.isDebug()) console.log("klass-n-student-list / emitEventOnReady / 시작");

    let myEvent:MyEvent = 
    this.watchTower.getEventOnReady(
      // eventKey:string, 
      this.eventKey,
      // component
      this
    );
    this.emitter.emit(myEvent);

    if(this.isDebug()) console.log("klass-n-student-list / emitEventOnReady / Done!");

  }


  onClickKlass(event, klass:Klass):void {

    if(this.isDebug()) console.log("klass-n-student-list / onClickKlass / 시작");

    event.preventDefault();
    event.stopPropagation();

    // 부모 객체로 클래스를 선택한 것을 전달. 해당 수업 상세 페이지로 이동!
    if(null == klass) {
      if(this.isDebug()) console.log("klass-n-student-list / onClickKlass / 중단 / null == klass");
      return;
    } // end if

    this.emitOnClickMeta(""+klass.id, klass);

  } // end method

  emitOnClickMeta(value:string, meta:any):void {
    let myEvent:MyEvent = 
    this.watchTower.getEventOnClickMetaFreePass(
      // eventKey:string, 
      this.eventKey,
      // value:string, 
      value,
      // meta:any
      meta
    );
    this.emitter.emit(myEvent);
  } // end method

  private onAfterCancelKlass():void {

    if(this.isDebug()) console.log("klass-n-student-list / onAfterCancelKlass / 시작");

    // 메일 발송은 서버의 역할 아닌가?
    // 취소 완료시점에 메일을 발송해야 합니다.

    // TODO -  즉시 취소 

    // # 이메일 - 취소 - 운영진 확인뒤 진행
    // a. # 고객 메일 - 인사말과 영수증('영수증 출력하기 - 버튼')이 같이 나간다.
    // c. # 운영자 메일 - 취소 고객.
    // d. # 강사님에게도 노티 취소 메일.

  }

  onClickCancelKlass(event):void {

    if(this.isDebug()) console.log("klass-n-student-list / onClickCancelKlass / 시작");

    event.preventDefault();
    event.stopPropagation();

    let paymentImpUid:string = "";
    let paymentImpMerchantUid:string = "";
    let paymentImpCancelAmount:number = -1;
    let paymentImpCancelReason:string = "고객 사정에 의한 환불";

    // 아임포트 - 결재를 취소합니다.
    this.paymentService
    .cancelPaymentImport(
      // apiKey:string, 
      this.watchTower.getApiKey(),
      // paymentImpUid:string,
      paymentImpUid,
      // paymentImpMerchantUid:string,
      paymentImpMerchantUid,
      // paymentImpCancelAmount:number,
      paymentImpCancelAmount,
      // paymentImpCancelReason:string,
      paymentImpCancelReason,
      // loginUserId:number
      this.getLoginUserId()
    )
    .then((myResponse:MyResponse) => {

      if(this.isDebug()) console.log("import / onClickCancelKlass / myResponse : ",myResponse);

      // if( myResponse.isSuccess() && myResponse.hasDataProp("paymentImpNext") ) {
      if( myResponse.isSuccess() ) {

        /*
        let paymentImpJSON = myResponse.getDataProp("paymentImpNext");
        let paymentImpNext:PaymentImport = new PaymentImport().setJSON(paymentImpJSON);

        // 부모 객체에게 결재 완료를 알립니다.
        this.emitEventOnChangePaymentImp(paymentImpNext);
        */
        
      } else if(myResponse.isFailed()){

        if(this.isDebug()) console.log("import / onClickCancelKlass / 결재 정보 등록에 실패했습니다.");

        this.watchTower.logAPIError("onClickCancelKlass has been failed!");
        if(null != myResponse.error) {
          this.watchTower.announceErrorMsgArr([myResponse.error]);
        } // end if
        
      } // end if

    }); // end service

  } // end method

  onClickRequestCancelKlass(event):void {

    if(this.isDebug()) console.log("klass-n-student-list / onClickRequestCancelKlass / 시작");

    event.preventDefault();
    event.stopPropagation();

    // TODO - 첫 수업 2일 이내면 운영진의 확인 뒤 취소 가능.
    // 메일로 받아서 확인할 수 있음.
    // 어떤 테이블에서 이 정보를 확인할수 있을까? --> klass_n_student 에서 R 상태로 등록. 운영자는 이 데이터를 확인뒤, A --> R 상태로 변경.

    // # 이메일 - 취소 요청 - 운영진 확인뒤 진행
    // c. # 운영자 메일 - 취소 고객.
    // d. # 강사님에게도 노티 취소 메일.

    // 사용자가 자신이 신청한 수업을 R 상태로 변경.
    // 운영자에게 노티 메일이 전달. 
    // 운영자는 운영툴에서도 '취소 요청'을 확인할 수 있음.

  } // end method  

  onClickTeacher(event):void {

    if(this.isDebug()) console.log("klass-n-student-list / onClickTeacher / 시작");

    event.preventDefault();
    event.stopPropagation();

  } // end method

  onClickStatus(event):void {

    if(this.isDebug()) console.log("klass-n-student-list / onClickStatus / 시작");

    event.preventDefault();
    event.stopPropagation();

  }

  onClickPrintReceipt(event, klassNStudent:KlassNStudent):void {

    if(this.isDebug()) console.log("klass-n-student-list / onClickPrintReceipt / 시작");

    event.preventDefault();
    event.stopPropagation();

    // 새로운 윈도우를 열어서 영수증 링크 열기.
    if( null != klassNStudent && 
        null != klassNStudent.receipt_url && 
        "" != klassNStudent.receipt_url ) {
      window.open(klassNStudent.receipt_url);
    } // end if
    
  } // end method

  onClickPrintCertipicate(event):void {

    if(this.isDebug()) console.log("klass-n-student-list / onClickPrintCertipicate / 시작");

    event.preventDefault();
    event.stopPropagation();

  }

  onClickSupplement(event):void {

    if(this.isDebug()) console.log("klass-n-student-list / onClickSupplement / 시작");

    event.preventDefault();
    event.stopPropagation();

  }

} // end class