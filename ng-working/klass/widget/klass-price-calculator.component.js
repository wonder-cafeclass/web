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
        this.price = -1;
        this.studentCnt = -1;
        this.weeks = -1;
        this.commission = -1;
        this.isEventPackReady = false;
        this.payment = -1;
        this.total = -1;
        this.totalStr = "";
        this.myIs = new my_is_1.HelperMyIs();
        this.myArray = new my_array_1.HelperMyArray();
        this.myFormat = new my_format_1.HelperMyFormat();
        this.defaultMetaList = this.myEventService.getDefaultMetaListKlassPriceCalculator();
    }
    KlassPriceCalculatorComponent.prototype.isDebug = function () {
        return this.watchTower.isDebug();
    };
    KlassPriceCalculatorComponent.prototype.ngOnInit = function () {
        if (this.isDebug())
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
        if (this.isDebug())
            console.log("klass-price-calculator / subscribeEventPack / init");
        var isEventPackReady = this.watchTower.getIsEventPackReady();
        if (this.isDebug())
            console.log("klass-price-calculator / subscribeEventPack / isEventPackReady : ", isEventPackReady);
        if (this.watchTower.getIsEventPackReady()) {
            // 1. 이미 EventPack 로딩이 완료된 경우
            this.isEventPackReady = true;
            this.checkComponentReady();
        }
        else {
            // 2. EventPack 로딩이 완료되지 않았습니다. 로딩을 기다립니다.
            this.watchTower.isEventPackReady$.subscribe(function (isEventPackReady) {
                if (_this.isDebug())
                    console.log("klass-price-calculator / subscribeEventPack / isEventPackReady : ", isEventPackReady);
                // 이벤트 관련 정보가 준비되었습니다.
                _this.isEventPackReady = true;
                _this.checkComponentReady();
            }); // end subscribe
        } // end if
    }; // end method 
    KlassPriceCalculatorComponent.prototype.emitEventOnReady = function () {
        if (this.isDebug())
            console.log("klass-price-calculator / emitEventOnReady / 시작");
        if (!this.watchTower.getIsEventPackReady()) {
            if (this.isDebug())
                console.log("klass-price-calculator / emitEventOnReady / 중단 / EventPack is not valid!");
            return;
        }
        var myEventOnReady = this.watchTower.getEventOnReady(
        // eventKey:string, 
        this.watchTower.getMyEventService().KEY_KLASS_PRICE_CALC, 
        // component
        this);
        if (this.isDebug())
            console.log("klass-price-calculator / emitEventOnReady / myEventOnReady : ", myEventOnReady);
        this.emitter.emit(myEventOnReady);
        if (this.isDebug())
            console.log("klass-price-calculator / emitEventOnReady / Done!");
    };
    KlassPriceCalculatorComponent.prototype.emitEventOnChange = function () {
        if (this.isDebug())
            console.log("klass-price-calculator / emitEventOnReady / 시작");
        if (!this.watchTower.getIsEventPackReady()) {
            if (this.isDebug())
                console.log("klass-price-calculator / emitEventOnReady / 중단 / EventPack is not valid!");
            return;
        }
        var metaObj = {
            price: this.price,
            studentCnt: this.studentCnt,
            commission: this.commission,
            weeks: this.weeks,
            total: this.total,
            totalStr: this.totalStr
        };
        var myEventOnChange = this.watchTower.getEventOnChangeMeta(
        // eventKey:string, 
        this.watchTower.getMyEventService().KEY_KLASS_PRICE_CALC, 
        // value:string, 
        "", 
        // myChecker:MyChecker, 
        this.watchTower.getMyCheckerService().getFreePassChecker(), 
        // meta:any
        metaObj);
        if (this.isDebug())
            console.log("klass-price-calculator / emitEventOnReady / myEventOnChange : ", myEventOnChange);
        this.emitter.emit(myEventOnChange);
    };
    KlassPriceCalculatorComponent.prototype.init = function () {
        if (this.isDebug())
            console.log("klass-price-calculator / init / 시작");
    };
    // @ Desc : 자식 컴포넌트들이 모두 준비되었는지 확인합니다. 준비되었다면 부모 객체에게 이벤트를 발송합니다.
    KlassPriceCalculatorComponent.prototype.checkComponentReady = function () {
        if (this.isDebug())
            console.log("klass-price-calculator / checkComponentReady / 시작");
        if (this.isNotReady()) {
            if (this.isDebug())
                console.log("klass-price-calculator / checkComponentReady / 중단 / this.isNotReady()");
            return;
        } // end if
        this.emitEventOnReady();
    };
    KlassPriceCalculatorComponent.prototype.isNotReady = function () {
        return !this.isReady();
    };
    KlassPriceCalculatorComponent.prototype.isReady = function () {
        if (this.isDebug())
            console.log("klass-price-calculator / isReady / 시작");
        if (!this.isEventPackReady) {
            if (this.isDebug())
                console.log("klass-price-calculator / isReady / 중단 / !this.isEventPackReady");
            return false;
        }
        else if (null == this.priceForStudentComponent) {
            if (this.isDebug())
                console.log("klass-price-calculator / isReady / 중단 / null == this.priceForStudentComponent");
            return false;
        }
        else if (null == this.commissionComponent) {
            if (this.isDebug())
                console.log("klass-price-calculator / isReady / 중단 / null == this.commissionComponent");
            return false;
        }
        else if (null == this.paymentForTeacherComponent) {
            if (this.isDebug())
                console.log("klass-price-calculator / isReady / 중단 / null == this.paymentForTeacherComponent");
            return false;
        }
        else if (null == this.studentCntComponent) {
            if (this.isDebug())
                console.log("klass-price-calculator / isReady / 중단 / null == this.studentCntComponent");
            return false;
        }
        else if (null == this.totalComponent) {
            if (this.isDebug())
                console.log("klass-price-calculator / isReady / 중단 / null == this.totalComponent");
            return false;
        }
        else if (null == this.weeksComponent) {
            if (this.isDebug())
                console.log("klass-price-calculator / isReady / 중단 / null == this.weeksComponent");
            return false;
        }
        return true;
    };
    KlassPriceCalculatorComponent.prototype.setPriceNStudentCnt = function (price, studentCnt) {
        if (this.isDebug())
            console.log("klass-price-calculator / setPriceNStudentCnt / 시작");
        if (!(0 < price)) {
            if (this.isDebug())
                console.log("klass-price-calculator / setPriceNStudentCnt / 중단 / price is not valid!");
            return;
        } // end if
        if (!(0 < studentCnt)) {
            if (this.isDebug())
                console.log("klass-price-calculator / setPriceNStudentCnt / 중단 / studentCnt is not valid!");
            return;
        } // end if
        this.setPrice(price);
        this.updateStudentCnt(studentCnt);
    }; // end method
    KlassPriceCalculatorComponent.prototype.setPrice = function (price) {
        if (this.isDebug())
            console.log("klass-price-calculator / setPrice / 시작");
        if (this.isDebug())
            console.log("klass-price-calculator / setPrice / price : ", price);
        this.price = price;
        this.updatePriceForStudent(price);
    }; // end method
    KlassPriceCalculatorComponent.prototype.updatePriceForStudent = function (price) {
        if (this.isDebug())
            console.log("klass-price-calculator / updatePriceForStudent / 시작");
        if (null == this.priceForStudentComponent) {
            if (this.isDebug())
                console.log("klass-price-calculator / updatePriceForStudent / 중단 / this.priceForStudentComponent is not valid!");
            return;
        }
        this.priceForStudentComponent.setInput("" + price);
        this.updateCommission(price);
    };
    KlassPriceCalculatorComponent.prototype.setWeeks = function (weeks) {
        if (this.isDebug())
            console.log("klass-price-calculator / setWeeks / 시작");
        if (!(0 < weeks)) {
            if (this.isDebug())
                console.log("klass-price-calculator / setWeeks / 중단 / weeks is not valid!");
            return;
        }
        if (null == this.weeksComponent) {
            if (this.isDebug())
                console.log("klass-price-calculator / setWeeks / 중단 / this.weeksComponent is not valid!");
            return;
        }
        var classWeeksList = this.watchTower.getMyConst().getList("class_weeks_list");
        var classWeeksKorList = this.watchTower.getMyConst().getList("class_weeks_kor_list");
        var weekKor = this.myArray.getValueFromLists(
        // key:string, 
        "" + weeks, 
        // srcList:string[], 
        classWeeksList, 
        // targetList:string[]
        classWeeksKorList);
        var selectOptionList = this.getDefaultOptionList(
        // keyList:string[],
        classWeeksKorList, 
        // valueList:string[],
        classWeeksList, 
        // valueFocus:string
        "" + weeks);
        if (this.isDebug())
            console.log("klass-price-calculator / setWeeks / selectOptionList : ", selectOptionList);
        if (this.isDebug())
            console.log("klass-price-calculator / setWeeks / weeks : ", weeks);
        if (this.isDebug())
            console.log("klass-price-calculator / setWeeks / weekKor : ", weekKor);
        this.weeksComponent.setSelectOption(selectOptionList);
        this.updateWeeks(weeks);
    };
    // @ Desc : 변경된 수업 주수에 따라서 가격 데이터를 다시 표시해야 합니다.
    KlassPriceCalculatorComponent.prototype.updateWeeks = function (weeks) {
        if (this.isDebug())
            console.log("klass-price-calculator / updateWeeks / 시작");
        if (this.isDebug())
            console.log("klass-price-calculator / updateWeeks / weeks : ", weeks);
        this.weeks = weeks;
        this.updateTotal();
    };
    KlassPriceCalculatorComponent.prototype.getDefaultOptionList = function (keyList, valueList, valueFocus) {
        if (null == this.watchTower) {
            return [];
        }
        return this.watchTower
            .getMyConst()
            .getDefaultOptionList(
        // keyList:string[], 
        keyList, 
        // valueList:string[],
        valueList, 
        // valueFocus:string
        valueFocus);
    }; // end method    
    KlassPriceCalculatorComponent.prototype.updateCommission = function (price) {
        if (this.isDebug())
            console.log("klass-price-calculator / updateCommission / 시작");
        var commission = this.commission = this.getcommission(price);
        var commissionStr = commission + "%";
        if (this.isDebug())
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
        if (this.isDebug())
            console.log("klass-price-calculator / updatePaymentForTeacher / 시작");
        if (this.isDebug())
            console.log("klass-price-calculator / updatePaymentForTeacher / price : ", price);
        if (this.isDebug())
            console.log("klass-price-calculator / updatePaymentForTeacher / commission : ", commission);
        var profitPercentage = (100 - this.commission);
        var priceStr = this.myFormat.numberWithCommas(price);
        priceStr = "\u20A9" + priceStr;
        var payment = this.payment = Math.round(price * ((100 - commission) / 100));
        var paymentStr = this.myFormat.numberWithCommas(payment);
        // paymentStr = `₩${paymentStr}`;
        paymentStr = priceStr + " X " + profitPercentage + "% = \u20A9" + paymentStr;
        if (this.isDebug())
            console.log("klass-price-calculator / updatePaymentForTeacher / payment : ", payment);
        if (this.isDebug())
            console.log("klass-price-calculator / updatePaymentForTeacher / paymentStr : ", paymentStr);
        this.paymentForTeacherComponent.setInput(paymentStr);
        this.updateTotal();
    };
    KlassPriceCalculatorComponent.prototype.updateStudentCnt = function (studentCnt) {
        if (this.isDebug())
            console.log("klass-price-calculator / updateStudentCnt / 시작");
        if (null == this.studentCntComponent) {
            if (this.isDebug())
                console.log("klass-price-calculator / updateStudentCnt / 중단 / null == this.studentCntComponent");
        } // end if
        if (studentCnt < 0) {
            studentCnt = 3;
        }
        this.studentCnt = studentCnt;
        if (this.isDebug())
            console.log("klass-price-calculator / updateStudentCnt / studentCnt : ", studentCnt);
        this.studentCntComponent.setInput("" + studentCnt);
        this.updateTotal();
    }; // end method
    KlassPriceCalculatorComponent.prototype.updateTotal = function () {
        if (this.isDebug())
            console.log("klass-price-calculator / updateTotal / 시작");
        if (null == this.totalComponent) {
            if (this.isDebug())
                console.log("klass-price-calculator / updateTotal / 중단 / null == this.totalComponent");
            return;
        }
        var paymentStr = "₩" + this.myFormat.numberWithCommas(this.payment);
        var studentCnt = +this.studentCntComponent.getInput();
        var weekCnt = 1;
        if (0 < this.weeks && 0 == (this.weeks % 4)) {
            weekCnt = (this.weeks / 4);
        } // end if
        if (this.isDebug())
            console.log("klass-price-calculator / updateTotal / this.payment : ", this.payment);
        if (this.isDebug())
            console.log("klass-price-calculator / updateTotal / paymentStr : ", paymentStr);
        if (this.isDebug())
            console.log("klass-price-calculator / updateTotal / this.studentCnt : ", this.studentCnt);
        if (this.isDebug())
            console.log("klass-price-calculator / updateTotal / weekCnt : ", weekCnt);
        var total = this.total = this.payment * this.studentCnt * weekCnt;
        var totalStr = this.totalStr = this.myFormat.numberWithCommas(total);
        totalStr = paymentStr + " X " + studentCnt + "\uBA85 X " + this.weeks + "\uC8FC = \u20A9" + totalStr;
        if (this.isDebug())
            console.log("klass-price-calculator / updateTotal / total : ", total);
        if (this.isDebug())
            console.log("klass-price-calculator / updateTotal / totalStr : ", totalStr);
        this.totalComponent.setInput(totalStr);
    }; // end method
    KlassPriceCalculatorComponent.prototype.onChangedFromChild = function (myEvent) {
        if (this.isDebug())
            console.log("klass-price-calculator / onChangedFromChild / 시작");
        if (this.isDebug())
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
                this.studentCntComponent = myEvent.metaObj;
                this.checkComponentReady();
            }
            else if (myEvent.hasKey(this.myEventService.KEY_KLASS_PRICE_CALC_TOTAL)) {
                this.totalComponent = myEvent.metaObj;
                this.checkComponentReady();
            }
            else if (myEvent.hasKey(this.myEventService.KEY_KLASS_PRICE_CALC_WEEK)) {
                this.weeksComponent = myEvent.metaObj;
                this.checkComponentReady();
            } // end if
        }
        else if (myEvent.hasEventName(this.myEventService.ON_CHANGE)) {
            if (myEvent.hasKey(this.myEventService.KEY_KLASS_PRICE_CALC_PRICE_FOR_STUDENT)) {
                var price = +myEvent.value;
                this.updatePriceForStudent(price);
                // 가격 변경을 부모 객체에도 전달.
                this.emitEventOnChange();
            }
            else if (myEvent.hasKey(this.myEventService.KEY_KLASS_PRICE_CALC_STUDENT_NUMBER)) {
                var studentCnt = +myEvent.value;
                this.updateStudentCnt(studentCnt);
                // 전체 데이터를 부모 객체에도 전달.
                this.emitEventOnChange();
            }
            else if (myEvent.hasKey(this.myEventService.KEY_KLASS_PRICE_CALC_WEEK)) {
                this.updateWeeks(+myEvent.value);
                // 전체 데이터를 부모 객체에도 전달.
                this.emitEventOnChange();
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