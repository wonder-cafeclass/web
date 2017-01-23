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
var my_event_watchtower_service_1 = require('../../util/service/my-event-watchtower.service');
var my_array_1 = require('../../util/helper/my-array');
var payment_import_1 = require('../../widget/payment/model/payment-import');
var payment_service_1 = require('../../widget/payment/service/payment.service');
var KlassNStudentListComponent = (function () {
    function KlassNStudentListComponent(watchTower, paymentService, router) {
        this.watchTower = watchTower;
        this.paymentService = paymentService;
        this.router = router;
        // @ Common Props
        this.emitter = new core_1.EventEmitter();
        this.isShowCancle = false;
        this.katStatus = "";
        this.isValidPayment = false;
        this.isShowCertificate = false;
        // Do something...
        this.myArray = new my_array_1.HelperMyArray();
    } // end constructor
    KlassNStudentListComponent.prototype.isDebug = function () {
        return this.watchTower.isDebug();
    }; // end method
    KlassNStudentListComponent.prototype.ngOnInit = function () {
        if (this.isDebug())
            console.log("klass-n-student-list / ngOnInit / init");
        this.asyncViewPack();
    };
    KlassNStudentListComponent.prototype.getLoginUserId = function () {
        if (this.isDebug())
            console.log("klass-n-student-list / getLoginUserId / 시작");
        var loginUser = this.watchTower.getLoginUser();
        var loginUserId = -1;
        if (null != loginUser) {
            loginUserId = loginUser.id;
        }
        if (this.isDebug())
            console.log("klass-n-student-list / getLoginUserId / loginUserId : ", loginUserId);
        return loginUserId;
    };
    KlassNStudentListComponent.prototype.asyncViewPack = function () {
        var _this = this;
        if (this.isDebug())
            console.log("klass-n-student-list / asyncViewPack / 시작");
        // 이미 View 기본정보가 들어왔다면 바로 가져온다. 
        if (this.watchTower.getIsViewPackReady()) {
            if (this.isDebug())
                console.log("klass-n-student-list / asyncViewPack / isViewPackReady : ", true);
            this.init();
        } // end if
        // View에 필요한 기본 정보가 비동기로 들어올 경우, 처리.
        this.watchTower.isViewPackReady$.subscribe(function (isViewPackReady) {
            if (_this.isDebug())
                console.log("klass-n-student-list / asyncViewPack / subscribe / isViewPackReady : ", isViewPackReady);
            _this.init();
        }); // end subscribe
    };
    KlassNStudentListComponent.prototype.init = function () {
        if (this.isDebug())
            console.log("klass-n-student-list / init / 시작");
        // 부모 객체에게 준비되었다는 이벤트를 보냅니다.
        this.emitEventOnReady();
    }; // end method
    KlassNStudentListComponent.prototype.emitEventOnReady = function () {
        if (this.isDebug())
            console.log("klass-n-student-list / emitEventOnReady / 시작");
        var myEvent = this.watchTower.getEventOnReady(
        // eventKey:string, 
        this.eventKey, 
        // component
        this);
        this.emitter.emit(myEvent);
        if (this.isDebug())
            console.log("klass-n-student-list / emitEventOnReady / Done!");
    };
    KlassNStudentListComponent.prototype.onClickKlass = function (event, klass) {
        if (this.isDebug())
            console.log("klass-n-student-list / onClickKlass / 시작");
        event.preventDefault();
        event.stopPropagation();
        // 부모 객체로 클래스를 선택한 것을 전달. 해당 수업 상세 페이지로 이동!
        if (null == klass) {
            if (this.isDebug())
                console.log("klass-n-student-list / onClickKlass / 중단 / null == klass");
            return;
        } // end if
        this.emitOnClickMeta("" + klass.id, klass);
    }; // end method
    KlassNStudentListComponent.prototype.emitOnClickMeta = function (value, meta) {
        var myEvent = this.watchTower.getEventOnClickMetaFreePass(
        // eventKey:string, 
        this.eventKey, 
        // value:string, 
        value, 
        // meta:any
        meta);
        this.emitter.emit(myEvent);
    }; // end method
    KlassNStudentListComponent.prototype.onAfterCancelKlass = function () {
        if (this.isDebug())
            console.log("klass-n-student-list / onAfterCancelKlass / 시작");
    };
    KlassNStudentListComponent.prototype.onClickCancelKlass = function (event, klassNStudent) {
        var _this = this;
        if (this.isDebug())
            console.log("klass-n-student-list / onClickCancelKlass / 시작");
        if (this.isDebug())
            console.log("klass-n-student-list / onClickCancelKlass / klassNStudent : ", klassNStudent);
        event.preventDefault();
        event.stopPropagation();
        var paymentImpUid = "";
        var paymentImpMerchantUid = "";
        var paymentImpCancelAmount = -1;
        var paymentImpCancelReason = "고객 사정에 의한 환불";
        // TODO - 결재 취소 페이지로 이동.
        // 아임포트 - 결제를 취소합니다.
        this.paymentService
            .cancelPaymentImport(
        // apiKey:string, 
        this.watchTower.getApiKey(), 
        // klassId:number,
        klassNStudent.klass_id, 
        // userId:number,
        klassNStudent.user_id, 
        // loginUserId:number
        this.getLoginUserId())
            .then(function (myResponse) {
            if (_this.isDebug())
                console.log("import / onClickCancelKlass / myResponse : ", myResponse);
            // if( myResponse.isSuccess() && myResponse.hasDataProp("paymentImpNext") ) {
            if (myResponse.isSuccess()) {
                var paymentImpJSON = myResponse.getDataProp("paymentImpNext");
                var paymentImpNext = new payment_import_1.PaymentImport().setJSON(paymentImpJSON);
                alert("결제가 취소되었습니다.");
                // 홈으로 이동
                _this.router.navigate(['/']);
            }
            else if (myResponse.isFailed()) {
                if (_this.isDebug())
                    console.log("import / onClickCancelKlass / 결제 정보 등록에 실패했습니다.");
                _this.watchTower.logAPIError("onClickCancelKlass has been failed!");
                if (null != myResponse.error) {
                    _this.watchTower.announceErrorMsgArr([myResponse.error]);
                } // end if
            } // end if
        }); // end service
    }; // end method
    KlassNStudentListComponent.prototype.onClickRequestCancelKlass = function (event) {
        if (this.isDebug())
            console.log("klass-n-student-list / onClickRequestCancelKlass / 시작");
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
    }; // end method  
    KlassNStudentListComponent.prototype.onClickTeacher = function (event) {
        if (this.isDebug())
            console.log("klass-n-student-list / onClickTeacher / 시작");
        event.preventDefault();
        event.stopPropagation();
    }; // end method
    KlassNStudentListComponent.prototype.onClickStatus = function (event) {
        if (this.isDebug())
            console.log("klass-n-student-list / onClickStatus / 시작");
        event.preventDefault();
        event.stopPropagation();
    };
    KlassNStudentListComponent.prototype.onClickPrintReceipt = function (event, klassNStudent) {
        if (this.isDebug())
            console.log("klass-n-student-list / onClickPrintReceipt / 시작");
        event.preventDefault();
        event.stopPropagation();
        // 새로운 윈도우를 열어서 영수증 링크 열기.
        if (null != klassNStudent &&
            null != klassNStudent.receipt_url &&
            "" != klassNStudent.receipt_url) {
            window.open(klassNStudent.receipt_url);
        } // end if
    }; // end method
    KlassNStudentListComponent.prototype.onClickPrintCertipicate = function (event) {
        if (this.isDebug())
            console.log("klass-n-student-list / onClickPrintCertipicate / 시작");
        event.preventDefault();
        event.stopPropagation();
    };
    KlassNStudentListComponent.prototype.onClickSupplement = function (event) {
        if (this.isDebug())
            console.log("klass-n-student-list / onClickSupplement / 시작");
        event.preventDefault();
        event.stopPropagation();
    };
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], KlassNStudentListComponent.prototype, "emitter", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], KlassNStudentListComponent.prototype, "eventKey", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Array)
    ], KlassNStudentListComponent.prototype, "klassNStudentList", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], KlassNStudentListComponent.prototype, "isShowCancle", void 0);
    KlassNStudentListComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'klass-n-student-list',
            templateUrl: 'klass-n-student-list.component.html',
            styleUrls: ['klass-n-student-list.component.css']
        }), 
        __metadata('design:paramtypes', [my_event_watchtower_service_1.MyEventWatchTowerService, payment_service_1.PaymentService, router_1.Router])
    ], KlassNStudentListComponent);
    return KlassNStudentListComponent;
}());
exports.KlassNStudentListComponent = KlassNStudentListComponent; // end class
//# sourceMappingURL=klass-n-student-list.component.js.map