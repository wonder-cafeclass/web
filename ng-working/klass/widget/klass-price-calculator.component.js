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
var my_event_service_1 = require('../../util/service/my-event.service');
var my_checker_service_1 = require('../../util/service/my-checker.service');
var my_event_watchtower_service_1 = require('../../util/service/my-event-watchtower.service');
var my_is_1 = require('../../util/helper/my-is');
var my_array_1 = require('../../util/helper/my-array');
var my_format_1 = require('../../util/helper/my-format');
var KlassPriceCalculatorComponent = (function () {
    // 자신의 자식 객체에서 이벤트를 받는다.
    function KlassPriceCalculatorComponent(watchTower, myEventService, myCheckerService) {
        this.watchTower = watchTower;
        this.myEventService = myEventService;
        this.myCheckerService = myCheckerService;
        this.cageWidth = -1;
        // 이벤트를 부모에게 전달
        this.emitter = new core_1.EventEmitter();
        this.commissionStr = "";
        this.paymentForTeacherStr = "";
        this.totalStr = "";
        this.isEventPackReady = false;
        this.myIs = new my_is_1.HelperMyIs();
        this.myArray = new my_array_1.HelperMyArray();
        this.myFormat = new my_format_1.HelperMyFormat();
        this.defaultMetaList = this.myEventService.getDefaultMetaListKlassPriceCalculator();
    }
    KlassPriceCalculatorComponent.prototype.ngOnInit = function () {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("klass-price-calculator / ngOnInit / init");
        if (0 < this.cageWidth) {
            this.cageWidthStr = this.cageWidth + "px";
        }
        else {
            this.cageWidthStr = "100%";
        }
        this.subscribeEventPack();
        this.init();
    };
    KlassPriceCalculatorComponent.prototype.subscribeEventPack = function () {
        var _this = this;
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("klass-price-calculator / subscribeEventPack / init");
        var isEventPackReady = this.watchTower.getIsEventPackReady();
        if (isDebug)
            console.log("klass-price-calculator / subscribeEventPack / isEventPackReady : ", isEventPackReady);
        if (this.watchTower.getIsEventPackReady()) {
            // 1. 이미 EventPack 로딩이 완료된 경우
            this.isEventPackReady = true;
            this.checkComponentReady();
        }
        else {
            // 2. EventPack 로딩이 완료되지 않았습니다. 로딩을 기다립니다.
            this.watchTower.isEventPackReady$.subscribe(function (isEventPackReady) {
                if (isDebug)
                    console.log("klass-price-calculator / subscribeEventPack / isEventPackReady : ", isEventPackReady);
                // 이벤트 관련 정보가 준비되었습니다.
                _this.isEventPackReady = true;
                _this.checkComponentReady();
            }); // end subscribe
        } // end if
    }; // end method 
    KlassPriceCalculatorComponent.prototype.emitEventOnReady = function () {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("klass-price-calculator / emitEventOnReady / 시작");
        if (!this.watchTower.getIsEventPackReady()) {
            if (isDebug)
                console.log("klass-price-calculator / emitEventOnReady / 중단 / EventPack is not valid!");
            return;
        }
        var myEventOnReady = this.watchTower.getEventOnReady(
        // eventKey:string, 
        this.watchTower.getMyEventService().KEY_KLASS_PRICE_CALC, 
        // component
        this);
        if (isDebug)
            console.log("klass-price-calculator / emitEventOnReady / myEventOnReady : ", myEventOnReady);
        this.emitter.emit(myEventOnReady);
        if (isDebug)
            console.log("klass-price-calculator / emitEventOnReady / Done!");
    };
    KlassPriceCalculatorComponent.prototype.init = function () {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("klass-price-calculator / init / 시작");
    };
    // @ Desc : 자식 컴포넌트들이 모두 준비되었는지 확인합니다. 준비되었다면 부모 객체에게 이벤트를 발송합니다.
    KlassPriceCalculatorComponent.prototype.checkComponentReady = function () {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("klass-price-calculator / checkComponentReady / 시작");
        if (this.isNotReady()) {
            if (isDebug)
                console.log("klass-price-calculator / checkComponentReady / 중단 / this.isNotReady()");
            return;
        } // end if
        this.emitEventOnReady();
    };
    KlassPriceCalculatorComponent.prototype.isNotReady = function () {
        return !this.isReady();
    };
    KlassPriceCalculatorComponent.prototype.isReady = function () {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("klass-price-calculator / isReady / 시작");
        if (!this.isEventPackReady) {
            if (isDebug)
                console.log("klass-price-calculator / isReady / 중단 / !this.isEventPackReady");
            return false;
        }
        else if (null == this.priceForStudentComponent) {
            if (isDebug)
                console.log("klass-price-calculator / isReady / 중단 / null == this.priceForStudentComponent");
            return false;
        }
        else if (null == this.commissionComponent) {
            if (isDebug)
                console.log("klass-price-calculator / isReady / 중단 / null == this.commissionComponent");
            return false;
        }
        else if (null == this.paymentForTeacherComponent) {
            if (isDebug)
                console.log("klass-price-calculator / isReady / 중단 / null == this.paymentForTeacherComponent");
            return false;
        }
        else if (null == this.studentNumberComponent) {
            if (isDebug)
                console.log("klass-price-calculator / isReady / 중단 / null == this.studentNumberComponent");
            return false;
        }
        else if (null == this.totalComponent) {
            if (isDebug)
                console.log("klass-price-calculator / isReady / 중단 / null == this.totalComponent");
            return false;
        }
        return true;
    };
    KlassPriceCalculatorComponent.prototype.setPrice = function (price) {
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("klass-price-calculator / setPrice / 시작");
        if (this.isNotReady()) {
            if (isDebug)
                console.log("klass-price-calculator / setPrice / 중단 / this.isNotReady()");
            return;
        } // end if
        if (isDebug)
            console.log("klass-price-calculator / setPrice / price : ", price);
        this.updatePriceForStudent(price);
    }; // end method
    KlassPriceCalculatorComponent.prototype.updatePriceForStudent = function (price) {
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("klass-price-calculator / updatePriceForStudent / 시작");
        if (isDebug)
            console.log("klass-price-calculator / updatePriceForStudent / this.priceForStudentComponent : ", this.priceForStudentComponent);
        this.priceForStudentComponent.setInput("" + price);
        this.updateCommission(price);
    };
    KlassPriceCalculatorComponent.prototype.updateCommission = function (price) {
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("klass-price-calculator / updateCommission / 시작");
        var commission = this.getcommission(price);
        var commissionStr = commission + "%";
        if (isDebug)
            console.log("klass-price-calculator / updateCommission / commissionStr : ", commissionStr);
        this.commissionComponent.setInput(commissionStr);
        this.updatePaymentForTeacher(price, commission);
    };
    KlassPriceCalculatorComponent.prototype.getcommission = function (price) {
        /*
        5만9천원까지 20 %
        6만원 부터 10만원 25%
        10만원초과 30%
        */
        if (0 < price && price <= 59000) {
            return 20;
        }
        else if (60000 <= price && price <= 100000) {
            return 25;
        }
        else if (100000 < price) {
            return 30;
        }
        return -1;
    };
    KlassPriceCalculatorComponent.prototype.updatePaymentForTeacher = function (price, commission) {
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("klass-price-calculator / updatePaymentForTeacher / 시작");
        if (isDebug)
            console.log("klass-price-calculator / updatePaymentForTeacher / price : ", price);
        if (isDebug)
            console.log("klass-price-calculator / updatePaymentForTeacher / commission : ", commission);
        var payment = Math.round(price * ((100 - commission) / 100));
        var paymentStr = this.myFormat.numberWithCommas(payment);
        paymentStr = "\u20A9" + paymentStr;
        if (isDebug)
            console.log("klass-price-calculator / updatePaymentForTeacher / payment : ", payment);
        if (isDebug)
            console.log("klass-price-calculator / updatePaymentForTeacher / paymentStr : ", paymentStr);
        this.paymentForTeacherComponent.setInput(paymentStr);
        this.updateStudentNumber(-1);
    };
    KlassPriceCalculatorComponent.prototype.updateStudentNumber = function (studentNumber) {
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("klass-price-calculator / updateStudentNumber / 시작");
        if (studentNumber < 0) {
            studentNumber = 3;
        }
        if (isDebug)
            console.log("klass-price-calculator / updateStudentNumber / studentNumber : ", studentNumber);
        this.studentNumberComponent.setInput("" + studentNumber);
        this.updateTotal();
    };
    KlassPriceCalculatorComponent.prototype.updateTotal = function () {
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("klass-price-calculator / updateTotal / 시작");
        var payment = +this.paymentForTeacherComponent.getInput().replace("₩", "").replace(",", "");
        var studentNumber = +this.studentNumberComponent.getInput();
        if (isDebug)
            console.log("klass-price-calculator / updateStudentNumber / payment : ", payment);
        if (isDebug)
            console.log("klass-price-calculator / updateStudentNumber / studentNumber : ", studentNumber);
        var total = payment * studentNumber;
        var totalStr = this.myFormat.numberWithCommas(total);
        totalStr = "\u20A9" + totalStr;
        if (isDebug)
            console.log("klass-price-calculator / updateStudentNumber / total : ", total);
        if (isDebug)
            console.log("klass-price-calculator / updateStudentNumber / totalStr : ", totalStr);
        this.totalComponent.setInput(totalStr);
    };
    KlassPriceCalculatorComponent.prototype.onChangedFromChild = function (myEvent) {
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("klass-price-calculator / onChangedFromChild / 시작");
        if (isDebug)
            console.log("klass-price-calculator / onChangedFromChild / myEvent : ", myEvent);
        if (null == myEvent) {
            return;
        }
        if (myEvent.hasEventName(this.myEventService.ON_READY)) {
            if (myEvent.hasKey(this.myEventService.KEY_KLASS_PRICE_CALC_PRICE_FOR_STUDENT)) {
                this.priceForStudentComponent = myEvent.metaObj;
                this.checkComponentReady();
            }
            else if (myEvent.hasKey(this.myEventService.KEY_KLASS_PRICE_CALC_COMMISSION)) {
                this.commissionComponent = myEvent.metaObj;
                this.checkComponentReady();
            }
            else if (myEvent.hasKey(this.myEventService.KEY_KLASS_PRICE_CALC_PAYMENT_FOR_TEACHER)) {
                this.paymentForTeacherComponent = myEvent.metaObj;
                this.checkComponentReady();
            }
            else if (myEvent.hasKey(this.myEventService.KEY_KLASS_PRICE_CALC_STUDENT_NUMBER)) {
                this.studentNumberComponent = myEvent.metaObj;
                this.checkComponentReady();
            }
            else if (myEvent.hasKey(this.myEventService.KEY_KLASS_PRICE_CALC_TOTAL)) {
                this.totalComponent = myEvent.metaObj;
                this.checkComponentReady();
            } // end if
        }
        else if (myEvent.hasEventName(this.myEventService.ON_CHANGE)) {
            if (myEvent.hasKey(this.myEventService.KEY_KLASS_PRICE_CALC_PRICE_FOR_STUDENT)) {
                var price = +myEvent.value;
                this.updatePriceForStudent(price);
            }
            else if (myEvent.hasKey(this.myEventService.KEY_KLASS_PRICE_CALC_STUDENT_NUMBER)) {
                var studentNumber = +myEvent.value;
                this.updateStudentNumber(studentNumber);
            } // end if       
        } // end if
    }; // end method
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], KlassPriceCalculatorComponent.prototype, "cageWidth", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], KlassPriceCalculatorComponent.prototype, "emitter", void 0);
    KlassPriceCalculatorComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'klass-price-calculator',
            templateUrl: 'klass-price-calculator.component.html',
            styleUrls: ['klass-price-calculator.component.css']
        }), 
        __metadata('design:paramtypes', [my_event_watchtower_service_1.MyEventWatchTowerService, my_event_service_1.MyEventService, my_checker_service_1.MyCheckerService])
    ], KlassPriceCalculatorComponent);
    return KlassPriceCalculatorComponent;
}());
exports.KlassPriceCalculatorComponent = KlassPriceCalculatorComponent; // end class
//# sourceMappingURL=klass-price-calculator.component.js.map