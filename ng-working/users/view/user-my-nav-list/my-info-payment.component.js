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
var my_event_watchtower_service_1 = require('../../../util/service/my-event-watchtower.service');
var my_event_service_1 = require('../../../util/service/my-event.service');
var pagination_1 = require('../../../widget/pagination/model/pagination');
var payment_import_1 = require('../../../widget/payment/model/payment-import');
var payment_service_1 = require('../../../widget/payment/service/payment.service');
var MyInfoPaymentComponent = (function () {
    function MyInfoPaymentComponent(paymentService, myEventService, watchTower, router) {
        this.paymentService = paymentService;
        this.myEventService = myEventService;
        this.watchTower = watchTower;
        this.router = router;
        this.eventKey = "";
        this.emitter = new core_1.EventEmitter();
        this.paymentService.setWatchTower(watchTower);
    }
    MyInfoPaymentComponent.prototype.isDebug = function () {
        return true;
        // return this.watchTower.isDebug();
    };
    MyInfoPaymentComponent.prototype.ngAfterViewInit = function () {
        // 자식 뷰가 모두 완료된 이후에 초기화를 진행.
        if (this.isDebug())
            console.log("my-info-payment / ngAfterViewInit");
        this.asyncViewPack();
    };
    MyInfoPaymentComponent.prototype.asyncViewPack = function () {
        var _this = this;
        if (this.isDebug())
            console.log("my-info-payment / asyncViewPack / 시작");
        // 이미 View 기본정보가 들어왔다면 바로 가져온다. 
        if (this.watchTower.getIsViewPackReady()) {
            if (this.isDebug())
                console.log("my-info-payment / asyncViewPack / isViewPackReady : ", true);
            this.init();
        } // end if
        // View에 필요한 기본 정보가 비동기로 들어올 경우, 처리.
        this.watchTower.isViewPackReady$.subscribe(function (isViewPackReady) {
            if (_this.isDebug())
                console.log("my-info-payment / asyncViewPack / subscribe / isViewPackReady : ", isViewPackReady);
            _this.init();
        }); // end subscribe
    };
    MyInfoPaymentComponent.prototype.init = function () {
        if (this.isDebug())
            console.log("my-info-payment / init / 시작");
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
    };
    MyInfoPaymentComponent.prototype.setLoginUser = function () {
        if (this.isDebug())
            console.log("my-info-payment / setLoginUser / 시작");
        // 로그인 데이터를 가져옵니다.
        this.loginUser = this.watchTower.getLoginUser();
        if (null == this.loginUser) {
            // 로그인 데이터를 가져오지 못한다면, 로그인 페이지로 이동합니다.
            this.router.navigate(['/login']);
        } // end if
    };
    MyInfoPaymentComponent.prototype.getLoginUserId = function () {
        var loginUser = this.watchTower.getLoginUser();
        if (null == loginUser) {
            return -1;
        }
        return loginUser.id;
    };
    MyInfoPaymentComponent.prototype.logActionPage = function () {
        if (this.isDebug())
            console.log("my-info-payment / logActionPage / 시작");
        this.watchTower.logPageEnter(
        // pageType:string
        this.watchTower.getMyLoggerService().pageTypeMyInfoPayment);
    }; // end method
    MyInfoPaymentComponent.prototype.emitEventOnReady = function () {
        if (this.isDebug())
            console.log("my-info-payment / emitEventOnReady / 시작");
        var myEvent = this.watchTower.getEventOnReady(
        // eventKey:string, 
        this.eventKey, 
        // component
        this);
        this.emitter.emit(myEvent);
    };
    MyInfoPaymentComponent.prototype.updatePagination = function (jsonPagination) {
        if (this.isDebug())
            console.log("my-info-payment / updatePagination / 시작");
        if (this.isDebug())
            console.log("my-info-payment / updatePagination / jsonPagination : ", jsonPagination);
        if (null == jsonPagination) {
            this.pagination = new pagination_1.Pagination();
        }
        else {
            this.pagination = new pagination_1.Pagination().setJSON(jsonPagination);
        }
    };
    MyInfoPaymentComponent.prototype.fetchPaymentList = function (klassId) {
        var _this = this;
        if (this.isDebug())
            console.log("my-info-payment / fetchPaymentList / 시작");
        if (this.isDebug())
            console.log("my-info-payment / fetchPaymentList / klassId : ", klassId);
        if (!(0 < this.getLoginUserId())) {
            if (this.isDebug())
                console.log("my-info-payment / fetchPaymentList / 중단 / loginUserId is not valid!");
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
        this.getLoginUserId()).then(function (myResponse) {
            // 로그 등록 결과를 확인해볼 수 있습니다.
            if (_this.isDebug())
                console.log("my-info-payment / fetchPaymentList / myResponse : ", myResponse);
            if (myResponse.isSuccess() &&
                myResponse.hasDataProp("pagination") &&
                myResponse.hasDataProp("list")) {
                // 1. Pagination 재설정
                var jsonPagination = myResponse.getDataProp("pagination");
                if (_this.isDebug())
                    console.log("my-info-payment / fetchKlassList / jsonPagination : ", jsonPagination);
                _this.updatePagination(jsonPagination);
                var piList = [];
                var jsonList = myResponse.getDataProp("list");
                for (var i = 0; i < jsonList.length; ++i) {
                    var json = jsonList[i];
                    var pi = new payment_import_1.PaymentImport().setJSON(json);
                    piList.push(pi);
                } // end for
                _this.piList = piList;
                if (_this.isDebug())
                    console.log("my-info-payment / fetchPaymentList / piList : ", piList);
            }
            else if (myResponse.isFailed()) {
                if (_this.isDebug())
                    console.log("my-info-payment / fetchPaymentList / 수강 학생 정보 등록에 실패했습니다.");
                _this.watchTower.logAPIError("fetchPaymentList has been failed!");
                if (null != myResponse.error) {
                    _this.watchTower.announceErrorMsgArr([myResponse.error]);
                } // end if
            } // end if
        }); // end service
        // 2. 관심 강의 리스트 가져오기(나중에...)
    };
    // @ Desc : 외부에서 이 컴포넌트를 보여주기 전에 호출.
    MyInfoPaymentComponent.prototype.setReadyBeforeShow = function () {
        if (this.isDebug())
            console.log("my-info-payment / setReadyBeforeShow / 시작");
        this.updateFooter();
    };
    MyInfoPaymentComponent.prototype.updateFooter = function () {
        if (null == this.watchTower) {
            return;
        }
        this.watchTower.announceFooterUpdate();
    };
    MyInfoPaymentComponent.prototype.onClickKlass = function (klass) {
        if (this.isDebug())
            console.log("my-info-payment / onClickKlass / 시작");
        if (null == klass) {
            if (this.isDebug())
                console.log("my-info-payment / onClickKlass / 중단 / null == klass");
            return;
        } // end if
        if (!(0 < klass.id)) {
            if (this.isDebug())
                console.log("my-info-payment / onClickKlass / 중단 / klass.id is not valid!");
            return;
        } // end if
        // 클래스 상세 페이지로 이동합니다.
        // this.router.navigate([`/class-center/${klass.id}`]);
    };
    MyInfoPaymentComponent.prototype.onChangedFromChild = function (myEvent) {
        if (this.isDebug())
            console.log("my-info-payment / onChangedFromChild / init");
        if (this.isDebug())
            console.log("my-info-payment / onChangedFromChild / myEvent : ", myEvent);
        if (this.isDebug())
            console.log("my-info-payment / onChangedFromChild / myEvent.key : ", myEvent.key);
        if (this.isDebug())
            console.log("my-info-payment / onChangedFromChild / myEvent.value : ", myEvent.value);
        if (myEvent.isNotValid()) {
            if (this.isDebug())
                console.log("my-info-payment / onChangedFromChild / ON_CHANGE_NOT_VALID / 중단 / myEvent.isNotValid()");
            // 에러 로그 등록
            this.watchTower.logErrorBadValue("my-info-payment / onChangedFromChild / myEvent.isNotValid()");
            return;
        } // end if
        if (this.watchTower.isNotOK(myEvent)) {
            if (this.isDebug())
                console.log("my-info-payment / onChangedFromChild / 중단 / 값이 유효하지 않습니다.");
            // 에러 로그 등록
            this.watchTower.logErrorBadValue("my-info-payment / onChangedFromChild / this.watchTower.isNotOK(myEvent)");
            return;
        } // end if
        if (myEvent.hasEventName(this.watchTower.getMyEventService().ON_READY)) {
        }
        else if (myEvent.hasEventName(this.watchTower.getMyEventService().ON_CHANGE)) {
            /*
            if(myEvent.hasKey(this.myEventService.KEY_USER_CUR_PASSWORD)) {
      
            } else if(myEvent.hasKey(this.myEventService.KEY_USER_NEW_PASSWORD)) {
      
            } // end if - ON CHANGE
            */
            if (myEvent.hasKey(this.myEventService.KEY_PAGE_NUM)) {
                this.pagination.pageNum = +myEvent.value;
                this.fetchPaymentList(null);
            } // end if
        }
        else if (myEvent.hasEventName(this.watchTower.getMyEventService().ON_CLICK)) {
            if (myEvent.hasKey(this.myEventService.KEY_WIDGET_KLASS_CARD)) {
                this.onClickKlass(myEvent.metaObj);
            } // end if
        } // end if
    }; // end method
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], MyInfoPaymentComponent.prototype, "eventKey", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], MyInfoPaymentComponent.prototype, "emitter", void 0);
    MyInfoPaymentComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'my-info-payment',
            templateUrl: 'my-info-payment.component.html',
            styleUrls: ['my-info-payment.component.css']
        }), 
        __metadata('design:paramtypes', [payment_service_1.PaymentService, my_event_service_1.MyEventService, my_event_watchtower_service_1.MyEventWatchTowerService, router_1.Router])
    ], MyInfoPaymentComponent);
    return MyInfoPaymentComponent;
}());
exports.MyInfoPaymentComponent = MyInfoPaymentComponent;
//# sourceMappingURL=my-info-payment.component.js.map