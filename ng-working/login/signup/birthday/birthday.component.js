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
var my_logger_service_1 = require('../../../util/service/my-logger.service');
var my_checker_service_1 = require('../../../util/service/my-checker.service');
var my_event_service_1 = require('../../../util/service/my-event.service');
var my_birthday_service_1 = require("../../../util/service/my-birthday.service");
var BirthdayComponent = (function () {
    function BirthdayComponent(myLoggerService, myEventService, myBirthdayService) {
        this.myLoggerService = myLoggerService;
        this.myEventService = myEventService;
        this.myBirthdayService = myBirthdayService;
        this.top = -1;
        this.left = -1;
        this.myCheckerService = null;
        this.emitter = new core_1.EventEmitter();
        this.isFocus = false;
        this.isFocusInfo = false;
        this.selectedYear = -1;
        this.selectedMonth = -1;
        this.selectedDay = -1;
    }
    BirthdayComponent.prototype.ngOnInit = function () {
        this.birthYearArr = this.myBirthdayService.getYear();
        this.selectedYear = this.birthYearArr[Math.round(this.birthYearArr.length * 2 / 3)];
        this.birthMonthArr = this.myBirthdayService.getMonth();
        this.selectedMonth = this.birthMonthArr[Math.round(this.birthMonthArr.length / 2)];
        this.birthDayArr = this.myBirthdayService.getDay(this.selectedMonth);
        this.selectedDay = this.birthDayArr[Math.round(this.birthDayArr.length / 2)];
    };
    BirthdayComponent.prototype.setMyChecker = function () {
        if (null == this.myCheckerService) {
            return;
        }
        if (null == this.myCheckerBirthYear) {
            this.myCheckerBirthYear = this.myCheckerService.getMyChecker("user_birth_year");
        }
        if (null == this.myCheckerBirthMonth) {
            this.myCheckerBirthMonth = this.myCheckerService.getMyChecker("user_birth_month");
        }
        if (null == this.myCheckerBirthDay) {
            this.myCheckerBirthDay = this.myCheckerService.getMyChecker("user_birth_day");
        }
    };
    BirthdayComponent.prototype.isOKBirthYear = function (input) {
        if (null == this.myCheckerService) {
            return false;
        }
        return this.myCheckerService.isOK(this.myCheckerBirthYear, input);
    };
    BirthdayComponent.prototype.isOKBirthMonth = function (input) {
        if (null == this.myCheckerService) {
            return false;
        }
        return this.myCheckerService.isOK(this.myCheckerBirthMonth, input);
    };
    BirthdayComponent.prototype.isOKBirthDay = function (input) {
        if (null == this.myCheckerService) {
            return false;
        }
        return this.myCheckerService.isOK(this.myCheckerBirthDay, input);
    };
    BirthdayComponent.prototype.onClick = function (event) {
        event.stopPropagation();
        event.preventDefault();
        if (!this.isFocus) {
            this.isFocus = true;
        } // end if
    };
    BirthdayComponent.prototype.onBlur = function (event) {
        event.stopPropagation();
        event.preventDefault();
        if (this.isFocus) {
            this.isFocus = false;
        } // end if
    };
    BirthdayComponent.prototype.onClickInfo = function (event) {
        event.stopPropagation();
        event.preventDefault();
        this.isFocusInfo = !this.isFocusInfo;
    };
    BirthdayComponent.prototype.onMouseOverInfo = function (event) {
        event.stopPropagation();
        event.preventDefault();
        if (!this.isFocusInfo) {
            this.isFocusInfo = true;
        } // end if
    };
    BirthdayComponent.prototype.onMouseOutInfo = function (event) {
        event.stopPropagation();
        event.preventDefault();
        if (this.isFocusInfo) {
            this.isFocusInfo = false;
        } // end if
    };
    BirthdayComponent.prototype.onChangeBirthYear = function (selectBirthYear) {
        this.setMyChecker();
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("birtday / onChangeBirthYear / init");
        this.selectedYear = selectBirthYear;
        if (isDebug)
            console.log("birtday / onChangeBirthYear / this.selectedYear : ", this.selectedYear);
        var isOK = this.isOKBirthYear("" + this.selectedYear);
        if (isDebug)
            console.log("birtday / onChangeBirthYear / isOK : ", isOK);
        if (isOK) {
            // 부모 객체에게 Change Event 발송 
            var myEventOnChange = this.myEventService.getMyEvent(
            // public eventName:string
            this.myEventService.ON_CHANGE, 
            // public key:string
            this.myEventService.KEY_USER_BIRTH_YEAR, 
            // public value:string
            "" + this.selectedYear, 
            // public metaObj:any
            null, 
            // public myChecker:MyChecker
            this.myCheckerBirthYear);
            this.emitter.emit(myEventOnChange);
        }
        else {
            var history_1 = this.myCheckerService.getLastHistory();
            if (isDebug)
                console.log("birtday / onChangeBirthYear / history : ", history_1);
        } // end if
    };
    BirthdayComponent.prototype.onChangeBirthMonth = function (selectBirthMonth) {
        this.setMyChecker();
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("birtday / onChangeBirthMonth / init");
        this.selectedMonth = selectBirthMonth;
        // 월이 바뀌었습니다. 월별 날짜도 연동되어 바꿉니다.
        this.birthDayArr = this.myBirthdayService.getDay(this.selectedMonth);
        this.selectedDay = this.birthDayArr[Math.round(this.birthDayArr.length / 2)];
        if (isDebug)
            console.log("birtday / onChangeBirthMonth / this.selectedMonth : ", this.selectedMonth);
        var monthCalFormat = this.setCalendarFormat("" + this.selectedMonth);
        var isOK = this.isOKBirthMonth(monthCalFormat);
        if (isDebug)
            console.log("birtday / onChangeBirthMonth / isOK : ", isOK);
        if (isOK) {
            // 부모 객체에게 Change Event 발송 
            var myEventOnChange = this.myEventService.getMyEvent(
            // public eventName:string
            this.myEventService.ON_CHANGE, 
            // public key:string
            this.myEventService.KEY_USER_BIRTH_MONTH, 
            // public value:string
            monthCalFormat, 
            // public metaObj:any
            null, 
            // public myChecker:MyChecker
            this.myCheckerBirthMonth);
            this.emitter.emit(myEventOnChange);
        }
        else {
            var history_2 = this.myCheckerService.getLastHistory();
            if (isDebug)
                console.log("birtday / onChangeBirthMonth / history : ", history_2);
        } // end if
    };
    BirthdayComponent.prototype.onChangeBirthDay = function (selectBirthDay) {
        this.setMyChecker();
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("birtday / onChangeBirthDay / init");
        this.selectedDay = selectBirthDay;
        if (isDebug)
            console.log("birtday / onChangeBirthDay / this.selectedDay : ", this.selectedDay);
        var dayCalFormat = this.setCalendarFormat("" + this.selectedDay);
        var isOK = this.isOKBirthDay(dayCalFormat);
        if (isDebug)
            console.log("birtday / onChangeBirthDay / isOK : ", isOK);
        if (isDebug)
            console.log("birtday / onChangeBirthDay / dayCalFormat : ", dayCalFormat);
        if (isOK) {
            // 부모 객체에게 Change Event 발송 
            var myEventOnChange = this.myEventService.getMyEvent(
            // public eventName:string
            this.myEventService.ON_CHANGE, 
            // public key:string
            this.myEventService.KEY_USER_BIRTH_DAY, 
            // public value:string
            dayCalFormat, 
            // public metaObj:any
            null, 
            // public myChecker:MyChecker
            this.myCheckerBirthDay);
            this.emitter.emit(myEventOnChange);
        }
        else {
            var history_3 = this.myCheckerService.getLastHistory();
            if (isDebug)
                console.log("birtday / onChangeBirthDay / history : ", history_3);
        } // end if
    };
    BirthdayComponent.prototype.setCalendarFormat = function (calNumStr) {
        var calNum = parseInt(calNumStr);
        var calNumStrFormatted = "";
        if (0 < calNum && calNum < 10) {
            calNumStrFormatted = "0" + calNum;
        }
        else {
            calNumStrFormatted = "" + calNum;
        }
        return calNumStrFormatted;
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], BirthdayComponent.prototype, "top", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], BirthdayComponent.prototype, "left", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', my_checker_service_1.MyCheckerService)
    ], BirthdayComponent.prototype, "myCheckerService", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], BirthdayComponent.prototype, "emitter", void 0);
    BirthdayComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'birthday',
            templateUrl: 'birthday.component.html',
            styleUrls: ['birthday.component.css']
        }), 
        __metadata('design:paramtypes', [my_logger_service_1.MyLoggerService, my_event_service_1.MyEventService, my_birthday_service_1.MyBirthdayService])
    ], BirthdayComponent);
    return BirthdayComponent;
}());
exports.BirthdayComponent = BirthdayComponent;
//# sourceMappingURL=birthday.component.js.map