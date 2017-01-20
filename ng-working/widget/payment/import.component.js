"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var router_1 = require('@angular/router');
var my_event_service_1 = require('../../util/service/my-event.service');
var my_checker_service_1 = require('../../util/service/my-checker.service');
var my_event_watchtower_service_1 = require('../../util/service/my-event-watchtower.service');
var url_service_1 = require('../../util/url.service');
var payment_service_1 = require('./service/payment.service');
var payment_import_1 = require('./model/payment-import');
/*
*
*	@ Desc     : 결제 모듈 아임포트(I'mport)를 사용할 수 있게 도와주는 컴포넌트
*	@ Author   : Wonder Jung
*/
var ImportComponent = (function () {
    function ImportComponent(myEventService, myCheckerService, urlService, paymentService, watchTower, router) {
        this.myEventService = myEventService;
        this.myCheckerService = myCheckerService;
        this.urlService = urlService;
        this.paymentService = paymentService;
        this.watchTower = watchTower;
        this.router = router;
        this.eventKey = "";
        this.emitter = new core_1.EventEmitter();
        this.IMP = null;
    }
    ImportComponent.prototype.ngOnInit = function () {
        this.subscribeLoginUser();
    }; // end method  
    ImportComponent.prototype.isDebug = function () {
        return true;
        // return this.watchTower.isDebug();
    };
    ImportComponent.prototype.__test = function () {
        var _this = this;
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
        4)
            .then(function (myResponse) {
            if (_this.isDebug())
                console.log("import / addImportHistory / myResponse : ", myResponse);
            if (myResponse.isSuccess() && myResponse.hasDataProp("paymentImpNext")) {
                var paymentImpJSON = myResponse.getDataProp("paymentImpNext");
                var paymentImpNext = new payment_import_1.PaymentImport().setJSON(paymentImpJSON);
                // 부모 객체에게 결제 완료를 알립니다.
                _this.emitEventOnChangePaymentImp(paymentImpNext);
            }
            else if (myResponse.isFailed()) {
                if (_this.isDebug())
                    console.log("import / addImportHistory / 결제 정보 등록에 실패했습니다.");
                _this.watchTower.logAPIError("addImportHistory has been failed!");
                if (null != myResponse.error) {
                    _this.watchTower.announceErrorMsgArr([myResponse.error]);
                } // end if
            } // end if
        }); // end service
    }; // end method
    ImportComponent.prototype.subscribeLoginUser = function () {
        if (this.isDebug())
            console.log("import /  subscribeLoginUser / init");
        this.loginUser = this.watchTower.getLoginUser();
        if (this.isDebug())
            console.log("import /  subscribeLoginUser / this.loginUser : ", this.loginUser);
        this.init();
    }; // end method 
    // @ 로그인 페이지로 이동합니다. 현재 페이지 주소를 리다이렉트 주소로 사용합니다.
    ImportComponent.prototype.goLogin = function () {
        if (this.isDebug())
            console.log("import / goLogin / init");
        var appViewUrl = this.urlService.getAppViewUrl();
        if (this.isDebug())
            console.log("import / goLogin / appViewUrl : ", appViewUrl);
        var req_url = this.urlService.get("#/login?redirect=" + appViewUrl);
        if (this.isDebug())
            console.log("import / goLogin / req_url : ", req_url);
        window.location.href = req_url;
    }; // end method
    ImportComponent.prototype.init = function () {
        this.emitEventOnReady();
    }; // end method
    ImportComponent.prototype.emitEventOnReady = function () {
        if (this.isDebug())
            console.log("import / emitEventOnReady / 시작");
        var myEventOnChange = this.myEventService.getMyEvent(
        // public eventName:string
        this.myEventService.ON_READY, 
        // public key:string
        this.eventKey, 
        // public value:string
        "", 
        // public metaObj:any
        this, 
        // public myChecker:MyChecker
        this.myCheckerService.getFreePassChecker());
        this.emitter.emit(myEventOnChange);
        if (this.isDebug())
            console.log("import / emitEventOnReady / Done!");
    };
    ImportComponent.prototype.emitEventOnChangePaymentImp = function (paymentImp) {
        if (this.isDebug())
            console.log("import / emitEventOnChangePaymentImp / 시작");
        if (null == paymentImp) {
            if (this.isDebug())
                console.log("import / emitEventOnChangePaymentImp / 중단 / null == paymentImp");
            return;
        }
        var myEvent = this.watchTower.getEventOnChangeMeta(
        // eventKey:string, 
        this.eventKey, 
        // value:string, 
        "", 
        // myChecker:MyChecker, 
        this.watchTower.getMyCheckerService().getFreePassChecker(), 
        // meta:any
        paymentImp);
        this.emitter.emit(myEvent);
        if (this.isDebug())
            console.log("import / emitEventOnReady / Done!");
    };
    ImportComponent.prototype.getIMP = function () {
        if (null == this.IMP) {
            this.IMP = window['IMP'];
        }
        return this.IMP;
    };
    ImportComponent.prototype.getPayParam = function (klassId, klassName, userId, userEmail, userName, userMobile, amount, redirectUrl) {
        if (!(0 < klassId)) {
            return null;
        } // end if
        if (null == klassName || "" === klassName) {
            return null;
        } // end if
        if (!(0 < userId)) {
            return null;
        } // end if
        if (null == userEmail || "" === userEmail) {
            return null;
        } // end if
        if (null == userName || "" === userName) {
            return null;
        } // end if
        if (null == userMobile || "" === userMobile) {
            return null;
        } // end if
        if (!(0 < amount)) {
            return null;
        } // end if
        if (null == redirectUrl || "" === redirectUrl) {
            return null;
        } // end if
        // 하나의 아임포트계정으로 여러 PG를 사용할 때 구분자
        var pg = 'html5_inicis'; // html5_inicis(이니시스웹표준)
        // 결제수단
        var pay_method = 'card';
        // 가맹점에서 생성/관리하는 고유 주문번호 / (필수항목) 결제가 된 적이 있는 merchant_uid로는 재결제 불가
        var merchant_uid = "merchant_<KLASS_ID>_<USER_ID>_<TIME>"
            .replace(/\<KLASS_ID\>/gi, "" + klassId)
            .replace(/\<USER_ID\>/gi, "" + userId)
            .replace(/\<TIME\>/gi, "" + new Date().getTime());
        // 주문명 / (선택항목) 원활한 결제정보 확인을 위해 입력 권장 (PG사마다 차이가 있지만) 16자이내로 작성하시길 권장
        var name = "<KLASS_NAME>"
            .replace(/\<KLASS_NAME\>/gi, klassName);
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
            pg: pg,
            pay_method: pay_method,
            merchant_uid: merchant_uid,
            name: name,
            amount: amount,
            buyer_email: buyer_email,
            buyer_name: buyer_name,
            buyer_tel: buyer_tel,
            buyer_addr: buyer_addr,
            buyer_postcode: buyer_postcode,
            m_redirect_url: m_redirect_url
        };
        return param;
    };
    // TODO 
    // @ Desc : 수업을 환불합니다.
    ImportComponent.prototype.refundKlass = function () {
        if (this.isDebug())
            console.log("import /  refundKlass / 시작");
    };
    // @ Desc : 수업을 구매합니다.
    ImportComponent.prototype.buyKlass = function (klassId, klassName, userId, userEmail, userName, userMobile, amount) {
        if (this.isDebug())
            console.log("import /  buyKlass / 시작");
        var imp = this.getIMP();
        if (null == this.loginUser) {
            // 로그인 유저 정보가 필요한 컴포넌트들에게 로그인 정보를 전달!
            this.goLogin();
        } // end if
        if (this.isDebug())
            console.log("import /  buyKlass / klassId : ", klassId);
        if (this.isDebug())
            console.log("import /  buyKlass / klassName : ", klassName);
        if (this.isDebug())
            console.log("import /  buyKlass / userId : ", userId);
        if (this.isDebug())
            console.log("import /  buyKlass / userEmail : ", userEmail);
        if (this.isDebug())
            console.log("import /  buyKlass / userName : ", userName);
        if (this.isDebug())
            console.log("import /  buyKlass / userMobile : ", userMobile);
        if (this.isDebug())
            console.log("import /  buyKlass / amount : ", amount);
        var redirectUrl = this.urlService.get("#/payment/import");
        var param = this.getPayParam(
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
        redirectUrl);
        if (null == param) {
            if (this.isDebug())
                console.log("import /  buyKlass / 중단 / null == param");
            return;
        }
        var _self = this;
        imp['request_pay'](param, function (rsp) {
            if (rsp.success) {
                _self.afterbuyklass(
                // paymentImpUid:string, 
                rsp.imp_uid, 
                // klassId:number, 
                klassId, 
                // userId:number
                userId);
            }
            else {
                // 에러. 로그 등록.
                _self.watchTower.logAPIError(rsp.error_msg);
            } // end if
        } // end callback
         // end callback
        ); // end payment process
    }; // end method
    ImportComponent.prototype.afterbuyklass = function (paymentImpUid, klassId, userId) {
        var _this = this;
        if (this.isDebug())
            console.log("import /  afterbuyklass / 시작");
        if (null == this.loginUser) {
            if (this.isDebug())
                console.log("import /  afterbuyklass / 중단 / null == this.loginUser");
            return;
        }
        this.paymentService
            .afterbuyklass(
        // apiKey:string, 
        this.watchTower.getApiKey(), 
        // paymentImpUid:string
        paymentImpUid, 
        // klassId:number,
        klassId, 
        // userId:number
        userId, 
        // loginUserId:number
        this.loginUser.id)
            .then(function (myResponse) {
            if (_this.isDebug())
                console.log("import / afterbuyklass / myResponse : ", myResponse);
            if (myResponse.isSuccess() && myResponse.hasDataProp("paymentImpNext")) {
                var paymentImpJSON = myResponse.getDataProp("paymentImpNext");
                var paymentImpNext = new payment_import_1.PaymentImport().setJSON(paymentImpJSON);
                // 부모 객체에게 결제 완료를 알립니다.
                _this.emitEventOnChangePaymentImp(paymentImpNext);
            }
            else if (myResponse.isFailed()) {
                if (_this.isDebug())
                    console.log("import / afterbuyklass / 결제 정보 등록에 실패했습니다.");
                _this.watchTower.logAPIError("afterbuyklass has been failed!");
                if (null != myResponse.error) {
                    _this.watchTower.announceErrorMsgArr([myResponse.error]);
                } // end if
            } // end if
        }); // end service
    }; // end method  
    ImportComponent.prototype.addImportHistory = function (paymentImpUid, klassId, userId) {
        var _this = this;
        if (this.isDebug())
            console.log("import /  addImportHistory / 시작");
        if (null == this.loginUser) {
            if (this.isDebug())
                console.log("import /  addImportHistory / 중단 / null == this.loginUser");
            return;
        }
        this.paymentService
            .addImportHistory(
        // apiKey:string, 
        this.watchTower.getApiKey(), 
        // paymentImpUid:string
        paymentImpUid, 
        // klassId:number,
        klassId, 
        // userId:number
        userId, 
        // loginUserId:number
        this.loginUser.id)
            .then(function (myResponse) {
            if (_this.isDebug())
                console.log("import / addImportHistory / myResponse : ", myResponse);
            if (myResponse.isSuccess() && myResponse.hasDataProp("paymentImpNext")) {
                var paymentImpJSON = myResponse.getDataProp("paymentImpNext");
                var paymentImpNext = new payment_import_1.PaymentImport().setJSON(paymentImpJSON);
                // 부모 객체에게 결제 완료를 알립니다.
                _this.emitEventOnChangePaymentImp(paymentImpNext);
            }
            else if (myResponse.isFailed()) {
                if (_this.isDebug())
                    console.log("import / addImportHistory / 결제 정보 등록에 실패했습니다.");
                _this.watchTower.logAPIError("addImportHistory has been failed!");
                if (null != myResponse.error) {
                    _this.watchTower.announceErrorMsgArr([myResponse.error]);
                } // end if
            } // end if
        }); // end service
    }; // end method
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], ImportComponent.prototype, "eventKey", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], ImportComponent.prototype, "emitter", void 0);
    ImportComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'payment-import',
            templateUrl: 'import.component.html',
            styleUrls: ['import.component.css']
        }), 
        __metadata('design:paramtypes', [my_event_service_1.MyEventService, my_checker_service_1.MyCheckerService, url_service_1.UrlService, payment_service_1.PaymentService, my_event_watchtower_service_1.MyEventWatchTowerService, router_1.Router])
    ], ImportComponent);
    return ImportComponent;
}());
exports.ImportComponent = ImportComponent; // end class
//# sourceMappingURL=import.component.js.map