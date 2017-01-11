import {  Component, 
          OnInit,
          Input, 
          Output, 
          EventEmitter }            from '@angular/core';

import { Router }                   from '@angular/router';

import { MyResponseImport }         from '../../util/model/my-response-import';
import { MyEvent }                  from '../../util/model/my-event';
import { MyEventService }           from '../../util/service/my-event.service';
import { MyCheckerService }         from '../../util/service/my-checker.service';
import { MyEventWatchTowerService } from '../../util/service/my-event-watchtower.service';
import { MyResponse }               from '../../util/model/my-response';
import { UrlService }               from '../../util/url.service';

import { User }                     from '../../users/model/user';

import { PaymentService }           from './service/payment.service';
import { PaymentImport }            from './model/payment-import';



/*
*
*	@ Desc     : 결재 모듈 아임포트(I'mport)를 사용할 수 있게 도와주는 컴포넌트
*	@ Author   : Wonder Jung
*/

@Component({
  moduleId: module.id,
  selector: 'payment-import',
  templateUrl: 'import.component.html',
  styleUrls: [ 'import.component.css' ]
})
export class ImportComponent implements OnInit {

  @Input() eventKey:string = "";
  @Output() emitter = new EventEmitter<any>();

  private loginUser:User;
  private IMP:any=null;

  constructor(  public myEventService:MyEventService, 
                public myCheckerService:MyCheckerService,
                public urlService:UrlService, 
                public paymentService:PaymentService, 
                private watchTower:MyEventWatchTowerService,
                private router:Router  ) {

  }

  ngOnInit(): void {

    this.subscribeLoginUser();

  } // end method  

  private isDebug():boolean {
    return true;
    // return this.watchTower.isDebug();
  }

  private __test():void {

    this.paymentService
    .addImportHistory(
      // apiKey:string, 
      this.watchTower.getApiKey(),
      // paymentImpUid:string
      "imp_158869218800",
      // klassId:number,
      6,
      // userId:number
      4,
      // loginUserId:number
      4
    )
    .then((myResponse:MyResponse) => {

      if(this.isDebug()) console.log("import / addImportHistory / myResponse : ",myResponse);

      if( myResponse.isSuccess() && myResponse.hasDataProp("paymentImpNext") ) {

        let paymentImpJSON = myResponse.getDataProp("paymentImpNext");
        let paymentImpNext:PaymentImport = new PaymentImport().setJSON(paymentImpJSON);

        // 부모 객체에게 결재 완료를 알립니다.
        this.emitEventOnChangePaymentImp(paymentImpNext);
        
      } else if(myResponse.isFailed()){

        if(this.isDebug()) console.log("import / addImportHistory / 결재 정보 등록에 실패했습니다.");

        this.watchTower.logAPIError("addImportHistory has been failed!");
        if(null != myResponse.error) {
          this.watchTower.announceErrorMsgArr([myResponse.error]);
        } // end if
        
      } // end if

    }); // end service

  } // end method

  private subscribeLoginUser() :void {

    if(this.isDebug()) console.log("import /  subscribeLoginUser / init");

    this.loginUser = this.watchTower.getLoginUser();
    if(this.isDebug()) console.log("import /  subscribeLoginUser / this.loginUser : ",this.loginUser);

    this.init();

  } // end method 

  // @ 로그인 페이지로 이동합니다. 현재 페이지 주소를 리다이렉트 주소로 사용합니다.
  private goLogin():void {

    if(this.isDebug()) console.log("import / goLogin / init");

    let appViewUrl:string = this.urlService.getAppViewUrl();
    if(this.isDebug()) console.log("import / goLogin / appViewUrl : ",appViewUrl);

    let req_url = this.urlService.get(`#/login?redirect=${appViewUrl}`);
    if(this.isDebug()) console.log("import / goLogin / req_url : ",req_url);

    window.location.href = req_url;
  } // end method

  private init():void {
    this.emitEventOnReady();
    this.__test(); // wonder.jung
  } // end method

  private emitEventOnReady() :void {

    if(this.isDebug()) console.log("import / emitEventOnReady / 시작");

    let myEventOnChange:MyEvent =
    this.myEventService.getMyEvent(
      // public eventName:string
      this.myEventService.ON_READY,
      // public key:string
      this.eventKey,
      // public value:string
      "",
      // public metaObj:any
      this,
      // public myChecker:MyChecker
      this.myCheckerService.getFreePassChecker()
    );
    this.emitter.emit(myEventOnChange);

    if(this.isDebug()) console.log("import / emitEventOnReady / Done!");

  }  

  private emitEventOnChangePaymentImp(paymentImp:PaymentImport) :void {

    if(this.isDebug()) console.log("import / emitEventOnChangePaymentImp / 시작");

    if(null == paymentImp) {
      if(this.isDebug()) console.log("import / emitEventOnChangePaymentImp / 중단 / null == paymentImp");
      return;
    }

    let myEvent:MyEvent =
    this.watchTower.getEventOnChangeMeta(
      // eventKey:string, 
      this.eventKey,
      // value:string, 
      "",
      // myChecker:MyChecker, 
      this.watchTower.getMyCheckerService().getFreePassChecker(),
      // meta:any
      paymentImp
    );

    this.emitter.emit(myEvent);

    if(this.isDebug()) console.log("import / emitEventOnReady / Done!");

  }  


  private getIMP() :void {
    if(null == this.IMP) {
      this.IMP = window['IMP'];
    }

    return this.IMP;
  } 

  public getPayParam( klassId:number, 
                      klassName:string, 
                      userId:number,  
                      userEmail:string, 
                      userName:string,
                      userMobile:string,
                      amount:number,
                      redirectUrl:string  ) {

    if(!(0 < klassId)) {
      return null;
    } // end if
    if(null == klassName || "" === klassName) {
      return null;
    } // end if
    if(!(0 < userId)) {
      return null;
    } // end if
    if(null == userEmail || "" === userEmail) {
      return null;
    } // end if
    if(null == userName || "" === userName) {
      return null;
    } // end if
    if(null == userMobile || "" === userMobile) {
      return null;
    } // end if
    if(!(0 < amount)) {
      return null;
    } // end if
    if(null == redirectUrl || "" === redirectUrl) {
      return null;
    } // end if


    // 하나의 아임포트계정으로 여러 PG를 사용할 때 구분자
    var pg = 'html5_inicis'; // html5_inicis(이니시스웹표준)
    // 결제수단
    var pay_method = 'card';
    // 가맹점에서 생성/관리하는 고유 주문번호 / (필수항목) 결제가 된 적이 있는 merchant_uid로는 재결제 불가
    var merchant_uid =
    "merchant_<KLASS_ID>_<USER_ID>_<TIME>"
    .replace(/\<KLASS_ID\>/gi, ""+klassId)
    .replace(/\<USER_ID\>/gi, ""+userId)
    .replace(/\<TIME\>/gi, ""+new Date().getTime())
    ;
    // 주문명 / (선택항목) 원활한 결제정보 확인을 위해 입력 권장 (PG사마다 차이가 있지만) 16자이내로 작성하시길 권장
    var name = 
    "주문명:<KLASS_NAME>"
    .replace(/\<KLASS_NAME\>/gi, klassName)
    ;
    // 결제할 금액 / (필수항목) / 고객으로부터 결제될 금액을 의미합니다.
    // amount

    var buyer_email = userEmail;
    // 주문자명 / (선택항목)
    var buyer_name = userName;
    // 주문자 연락처 / (필수항목) 누락되거나 blank일 때 일부 PG사에서 오류 발생
    var buyer_tel = userMobile;
    // 주문자 주소 / (선택항목)
    var buyer_addr = "";
    // 주문자 우편번호 / (선택항목)
    var buyer_postcode = "";
    // 인증 결제 리다이렉트 주소
    var m_redirect_url = redirectUrl;

    var param = {
        pg : pg,
        pay_method : pay_method,
        merchant_uid : merchant_uid,
        name : name,
        amount : amount,
        buyer_email : buyer_email,
        buyer_name : buyer_name,
        buyer_tel : buyer_tel,
        buyer_addr : buyer_addr,
        buyer_postcode : buyer_postcode,
        m_redirect_url : m_redirect_url
    };

    return param;
  }  

  public buyKlass(  klassId:number, 
                    klassName:string, 
                    userId:number,  
                    userEmail:string, 
                    userName:string,
                    userMobile:string,
                    amount:number ) :void {

    if(this.isDebug()) console.log("import /  buyKlass / 시작");

    let imp = this.getIMP();

    if(null == this.loginUser) {
      // 로그인 유저 정보가 필요한 컴포넌트들에게 로그인 정보를 전달!
      this.goLogin();
    } // end if

    if(this.isDebug()) console.log("import /  buyKlass / klassId : ",klassId);
    if(this.isDebug()) console.log("import /  buyKlass / klassName : ",klassName);
    if(this.isDebug()) console.log("import /  buyKlass / userId : ",userId);
    if(this.isDebug()) console.log("import /  buyKlass / userEmail : ",userEmail);
    if(this.isDebug()) console.log("import /  buyKlass / userName : ",userName);
    if(this.isDebug()) console.log("import /  buyKlass / userMobile : ",userMobile);
    if(this.isDebug()) console.log("import /  buyKlass / amount : ",amount);

    let redirectUrl:string = this.urlService.get(`#/payment/import`);

    let param:any = 
    this.getPayParam(
      // klassId:number, 
      klassId,
      // klassName:string, 
      klassName,
      // userId:number,  
      userId,
      // userEmail:string, 
      userEmail,
      // userName:string,
      userName,
      // userMobile:string,
      userMobile,
      // amount:number,
      amount,
      // redirectUrl:string
      redirectUrl
    );

    if(null == param) {
      if(this.isDebug()) console.log("import /  buyKlass / 중단 / null == param");
      return;
    }

    imp['request_pay'](
      param, 
      function(rsp) {

        // 받은 결과를 바로 저장? 아니면 REST API로 정보 다시 가져옴?
        /*
apply_num:"33163144"
buyer_addr:""
buyer_email:"wonder13662test3@gmail.com"
buyer_name:"아놀드"
buyer_postcode:""
buyer_tel:"010-0000-0003"
card_name:"신한카드"
card_quota:0
custom_data:null
imp_uid:"imp_158869218800"
merchant_uid:"merchant_6_4_1484053869624"
name:"주문명:여행가서 현지인처럼 주문해보기"
paid_amount:65000
paid_at:1484054892
pay_method:"card"
pg_provider:"html5_inicis"
pg_tid:"StdpayCARDINIpayTest20170110222811748230"
receipt_url:"https://iniweb.inicis.com/DefaultWebApp/mall/cr/cm/mCmReceipt_head.jsp?noTid=StdpayCARDINIpayTest20170110222811748230&noMethod=1"
request_id:"req_1484053869628"
status:"paid"
success:true
        */

        console.log("import / buyKlass / rsp : ",rsp);

          if ( rsp.success ) {
              var msg = '결제가 완료되었습니다.';
              msg += '고유ID : ' + rsp.imp_uid;
              msg += '상점 거래ID : ' + rsp.merchant_uid;
              msg += '결제 금액 : ' + rsp.paid_amount;
              msg += '카드 승인번호 : ' + rsp.apply_num;
          } else {
              var msg = '결제에 실패하였습니다.';
              msg += '에러내용 : ' + rsp.error_msg;
          }
      }    

    );    



  } // end method
}