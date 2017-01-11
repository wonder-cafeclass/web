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
var admin_service_1 = require('./service/admin.service');
var default_type_1 = require('../widget/input/default/model/default-type');
var pagination_1 = require('../widget/pagination/model/pagination');
var payment_import_1 = require('../widget/payment/model/payment-import');
var my_event_service_1 = require('../util/service/my-event.service');
var my_event_watchtower_service_1 = require('../util/service/my-event-watchtower.service');
var my_is_1 = require('../util/helper/my-is');
var my_array_1 = require('../util/helper/my-array');
var my_format_1 = require('../util/helper/my-format');
var ManagePaymentsComponent = (function () {
    // 자신의 자식 객체에서 이벤트를 받는다.
    function ManagePaymentsComponent(adminService, myEventService, watchTower, router) {
        this.adminService = adminService;
        this.myEventService = myEventService;
        this.watchTower = watchTower;
        this.router = router;
        this.checkBoxList = [];
        this.pageNum = 1;
        this.pageRange = 5;
        this.klassId = -1;
        this.userId = -1;
        this.myIs = new my_is_1.HelperMyIs();
        this.myArray = new my_array_1.HelperMyArray();
        this.myFormat = new my_format_1.HelperMyFormat();
        this.defaultType = new default_type_1.DefaultType();
        this.adminService.setWatchTower(watchTower);
        this.pagination = new pagination_1.Pagination();
        this.subscribeLoginUser();
        this.subscribeEventPack();
    } // end constructor
    ManagePaymentsComponent.prototype.ngOnInit = function () {
    };
    ManagePaymentsComponent.prototype.isDebug = function () {
        return this.watchTower.isDebug();
    };
    ManagePaymentsComponent.prototype.subscribeLoginUser = function () {
        if (this.isDebug())
            console.log("manage-payments / subscribeLoginUser / init");
        this.loginUser = this.watchTower.getLoginUser();
        if (null == this.loginUser || !this.loginUser.isAdminUser()) {
            this.goHome();
        } // end if
        this.init();
    }; // end method
    ManagePaymentsComponent.prototype.goHome = function () {
        if (this.isDebug())
            console.log("manage-payments / goHome / init");
        this.router.navigate(["/"]);
    };
    ManagePaymentsComponent.prototype.subscribeEventPack = function () {
        var _this = this;
        if (this.isDebug())
            console.log("manage-payments / subscribeEventPack / init");
        var isEventPackReady = this.watchTower.getIsEventPackReady();
        if (this.isDebug())
            console.log("manage-payments / subscribeEventPack / isEventPackReady : ", isEventPackReady);
        if (this.watchTower.getIsEventPackReady()) {
            this.init();
        }
        else {
            // 2. EventPack 로딩이 완료되지 않았습니다. 로딩을 기다립니다.
            this.watchTower.isEventPackReady$.subscribe(function (isEventPackReady) {
                if (_this.isDebug())
                    console.log("manage-payments / subscribeEventPack / isEventPackReady : ", isEventPackReady);
                _this.init();
            }); // end subscribe
        } // end if
    }; // end method
    ManagePaymentsComponent.prototype.init = function () {
        if (this.isDebug())
            console.log("manage-payments / init / 시작");
        this.dofetchBuyKlass();
    }; // end method
    ManagePaymentsComponent.prototype.updatePagination = function (jsonPagination) {
        if (this.isDebug())
            console.log("manage-payments / updatePagination / 시작");
        if (this.isDebug())
            console.log("manage-payments / updatePagination / jsonPagination : ", jsonPagination);
        if (null == jsonPagination) {
            this.pagination = null;
        }
        else {
            this.pagination = new pagination_1.Pagination().setJSON(jsonPagination);
        }
    };
    ManagePaymentsComponent.prototype.updatePaymentList = function (jsonPaymentList) {
        if (this.isDebug())
            console.log("manage-payments / updatePaymentList / 시작");
        if (this.myArray.isNotOK(jsonPaymentList)) {
            // 검색 결과가 없습니다.
            this.paymentList = null;
        }
        else {
            var paymentList = [];
            for (var i = 0; i < jsonPaymentList.length; ++i) {
                var paymentJSON = jsonPaymentList[i];
                var payment = new payment_import_1.PaymentImport().setJSON(paymentJSON);
                payment.amountWithFormat = this.myFormat.getKRWWithCommas(payment.amount);
                paymentList.push(payment);
            } // end for
            if (this.isDebug())
                console.log("manage-payments / updatePaymentList / paymentList : ", paymentList);
            this.paymentList = paymentList;
        } // end if
    }; // end method    
    // @ Desc : 저장된 변수 값들로 유저 리스트를 가져옵니다.
    ManagePaymentsComponent.prototype.dofetchBuyKlass = function () {
        if (null == this.pagination) {
            this.fetchBuyKlass(
            // pageNum:number, 
            this.pageNum, 
            // pageSize:number, 
            this.pageRange, 
            // klassId:number, 
            this.klassId, 
            // userId:number
            this.userId);
        }
        else {
            this.fetchBuyKlass(
            // pageNum:number, 
            this.pagination.pageNum, 
            // pageSize:number, 
            this.pagination.pageRange, 
            // klassId:number, 
            this.klassId, 
            // userId:number
            this.userId);
        }
    }; // end method
    // @ Desc : 유저 리스트를 가져옵니다.
    ManagePaymentsComponent.prototype.fetchBuyKlass = function (pageNum, pageSize, klassId, userId) {
        var _this = this;
        this.adminService
            .fetchBuyKlass(this.watchTower.getApiKey(), pageNum, pageSize, klassId, userId)
            .then(function (myResponse) {
            if (_this.isDebug())
                console.log("manage-payments / fetchBuyKlass / myResponse : ", myResponse);
            if (myResponse.isSuccess() &&
                myResponse.hasDataProp("pagination") &&
                myResponse.hasDataProp("payment_list")) {
                // 1. Pagination 재설정
                var jsonPagination = myResponse.getDataProp("pagination");
                if (_this.isDebug())
                    console.log("manage-payments / fetchBuyKlass / jsonPagination : ", jsonPagination);
                _this.updatePagination(jsonPagination);
                // 2. Payment List 재설정 
                var paymentJSONList = myResponse.getDataProp("payment_list");
                if (_this.isDebug())
                    console.log("manage-payments / fetchBuyKlass / paymentJSONList : ", paymentJSONList);
                _this.updatePaymentList(paymentJSONList);
            }
            else if (myResponse.isFailed()) {
                if (_this.isDebug())
                    console.log("manage-payments / fetchBuyKlass / 결제 정보 리스트를 가져오는데 실패했습니다.");
                _this.watchTower.logAPIError("fetchBuyKlass has been failed!");
                if (null != myResponse.error) {
                    _this.watchTower.announceErrorMsgArr([myResponse.error]);
                } // end if
            } // end if
        }); // end service
    }; // end method
    ManagePaymentsComponent.prototype.updateCheckBoxes = function (checked) {
        if (this.isDebug())
            console.log("manage-payments / updateCheckBoxes / 시작");
        if (this.isDebug())
            console.log("manage-payments / updateCheckBoxes / this.checkBoxList : ", this.checkBoxList);
        if (this.isDebug())
            console.log("manage-payments / updateCheckBoxes / checked : ", checked);
        for (var i = 0; i < this.checkBoxList.length; ++i) {
            var checkBox = this.checkBoxList[i];
            checkBox.setIsChecked(checked);
        } // end for
    }; // end method
    ManagePaymentsComponent.prototype.onChangedFromChild = function (myEvent) {
        if (this.isDebug())
            console.log("manage-payments / onChangedFromChild / myEvent : ", myEvent);
        if (null == myEvent) {
            if (this.isDebug())
                console.log("manage-payments / onChangedFromChild / 중단 / null == myEvent");
            return;
        } // end if
        if (myEvent.hasEventName(this.myEventService.ON_READY)) {
            if (myEvent.hasKey(this.myEventService.KEY_CHECKBOX_ALL)) {
            }
            else if (myEvent.hasKey(this.myEventService.KEY_CHECKBOX)) {
                this.checkBoxList.push(myEvent.metaObj);
            } // end if
        }
        else if (myEvent.hasEventName(this.myEventService.ON_CHANGE)) {
            if (myEvent.hasKey(this.myEventService.KEY_CHECKBOX_ALL)) {
                var isChecked = ("true" == "" + myEvent.value) ? true : false;
                this.updateCheckBoxes(isChecked);
            }
            else if (myEvent.hasKey(this.myEventService.KEY_PAGE_NUM)) {
                this.pagination.pageNum = +myEvent.value;
                this.dofetchBuyKlass();
            } // end if
        } // end if
    }; // end method
    ManagePaymentsComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'manage-payments',
            templateUrl: 'manage-payments.component.html',
            styleUrls: ['manage-payments.component.css']
        }), 
        __metadata('design:paramtypes', [admin_service_1.AdminService, my_event_service_1.MyEventService, my_event_watchtower_service_1.MyEventWatchTowerService, router_1.Router])
    ], ManagePaymentsComponent);
    return ManagePaymentsComponent;
}());
exports.ManagePaymentsComponent = ManagePaymentsComponent; // end class
//# sourceMappingURL=manage-payments.component.js.map