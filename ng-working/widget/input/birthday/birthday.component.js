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
var my_event_watchtower_service_1 = require('../../../util/service/my-event-watchtower.service');
var BirthdayComponent = (function () {
    function BirthdayComponent(myLoggerService, myEventService, watchTower, myCheckerService, myBirthdayService) {
        this.myLoggerService = myLoggerService;
        this.myEventService = myEventService;
        this.watchTower = watchTower;
        this.myCheckerService = myCheckerService;
        this.myBirthdayService = myBirthdayService;
        this.top = -1;
        this.left = -1;
        this.emitter = new core_1.EventEmitter();
        this.isFocus = false;
        this.isFocusInfo = false;
        this.birthYearArr = [];
        this.selectedYear = -1;
        this.birthMonthArr = [];
        this.selectedMonth = -1;
        this.birthDayArr = [];
        this.selectedDay = -1;
        this.isAdmin = false;
        this.isShowTooltipHead = false;
        this.isShowTooltipBody = false;
        this.isShowTooltipTail = false;
        this.isValidHead = false;
        this.isValidBody = false;
        this.isValidTail = false;
        this.tooltipHeadMsg = "";
        this.tooltipBodyMsg = "";
        this.tooltipTailMsg = "";
    }
    BirthdayComponent.prototype.ngOnInit = function () {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("birthday / ngOnInit / init");
    };
    BirthdayComponent.prototype.ngAfterViewInit = function () {
        // 자식 뷰가 모두 완료된 이후에 초기화를 진행.
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("birthday / ngAfterViewInit");
        this.asyncViewPack();
    };
    BirthdayComponent.prototype.asyncViewPack = function () {
        var _this = this;
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("birthday / asyncViewPack / 시작");
        // 이미 View 기본정보가 들어왔다면 바로 가져온다. 
        if (this.watchTower.getIsViewPackReady()) {
            if (isDebug)
                console.log("birthday / asyncViewPack / isViewPackReady : ", true);
            this.init();
        } // end if
        // View에 필요한 기본 정보가 비동기로 들어올 경우, 처리.
        this.watchTower.isViewPackReady$.subscribe(function (isViewPackReady) {
            if (isDebug)
                console.log("birthday / asyncViewPack / subscribe / isViewPackReady : ", isViewPackReady);
            _this.init();
        }); // end subscribe
    };
    BirthdayComponent.prototype.setViewPack = function () {
        this.isAdmin = this.watchTower.getIsAdmin();
        this.myCheckerService.setReady(
        // checkerMap:any
        this.watchTower.getCheckerMap(), 
        // constMap:any
        this.watchTower.getConstMap(), 
        // dirtyWordList:any
        this.watchTower.getDirtyWordList(), 
        // apiKey:string
        this.watchTower.getApiKey()); // end setReady
    };
    BirthdayComponent.prototype.setBirthdayDefault = function () {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("birthday / setBirthdayDefault / 시작");
        this.birthYearArr = this.myBirthdayService.getYear();
        if (isDebug)
            console.log("birthday / setBirthdayDefault / this.birthYearArr : ", this.birthYearArr);
        if (!(0 < this.selectedYear)) {
            // 지정된 '연도'가 없다면, 초기 값은 '선택안됨'
            if (isDebug)
                console.log("birthday / setBirthdayDefault / birthYearArr / 지정된 '월'이 없다면, 초기 값은 '선택안됨'");
            this.birthYearArr.unshift("-");
        } // end if
        this.birthMonthArr = this.myBirthdayService.getMonth();
        if (isDebug)
            console.log("birthday / setBirthdayDefault / this.birthMonthArr : ", this.birthMonthArr);
        if (!(0 < this.selectedMonth)) {
            // 지정된 '월'이 없다면, 초기 값은 '선택안됨'
            if (isDebug)
                console.log("birthday / setBirthdayDefault / birthMonthArr / 지정된 '월'이 없다면, 초기 값은 '선택안됨'");
            this.birthMonthArr.unshift("-");
        } // end if
        this.birthDayArr = this.myBirthdayService.getDay(this.selectedMonth);
        if (isDebug)
            console.log("birthday / setBirthdayDefault / this.birthDayArr : ", this.birthDayArr);
        if (!(0 < this.selectedMonth)) {
            // 지정된 '월'이 없다면, 초기 값은 '선택안됨'
            if (isDebug)
                console.log("birthday / setBirthdayDefault / birthDayArr / 지정된 '월'이 없다면, 초기 값은 '선택안됨'");
            this.birthDayArr.unshift("-");
        } // end if
    };
    BirthdayComponent.prototype.setMyChecker = function () {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("birthday / setMyChecker / 시작");
        if (null == this.myCheckerService) {
            if (isDebug)
                console.log("birthday / setMyChecker / 중단 / this.myCheckerService is not valid!");
            return;
        }
        if (null == this.myCheckerBirthYear) {
            if (isDebug)
                console.log("birthday / setMyChecker / update checker / this.myCheckerBirthYear");
            this.myCheckerBirthYear = this.myCheckerService.getMyChecker("user_birth_year");
        }
        if (null == this.myCheckerBirthMonth) {
            if (isDebug)
                console.log("birthday / setMyChecker / update checker / this.myCheckerBirthMonth");
            this.myCheckerBirthMonth = this.myCheckerService.getMyChecker("user_birth_month");
        }
        if (null == this.myCheckerBirthDay) {
            if (isDebug)
                console.log("birthday / setMyChecker / update checker / this.myCheckerBirthDay");
            this.myCheckerBirthDay = this.myCheckerService.getMyChecker("user_birth_day");
        }
    };
    BirthdayComponent.prototype.init = function () {
        // 뷰에 필요한 공통 정보를 설정합니다.
        this.setViewPack();
        this.setBirthdayDefault();
        this.setMyChecker();
    };
    BirthdayComponent.prototype.isNotOKBirthYear = function (input) {
        return !this.isOKBirthYear(input);
    };
    BirthdayComponent.prototype.isOKBirthYear = function (input) {
        if (null == this.myCheckerService) {
            return false;
        }
        return this.myCheckerService.isOK(this.myCheckerBirthYear, input);
    };
    BirthdayComponent.prototype.isNotOKBirthMonth = function (input) {
        return !this.isOKBirthMonth(input);
    };
    BirthdayComponent.prototype.isOKBirthMonth = function (input) {
        if (null == this.myCheckerService) {
            return false;
        }
        return this.myCheckerService.isOK(this.myCheckerBirthMonth, input);
    };
    BirthdayComponent.prototype.isNotOKBirthDay = function (input) {
        return !this.isOKBirthDay(input);
    };
    BirthdayComponent.prototype.isOKBirthDay = function (input) {
        if (null == this.myCheckerService) {
            return false;
        }
        return this.myCheckerService.isOK(this.myCheckerBirthDay, input);
    };
    BirthdayComponent.prototype.setBirthYear = function (year) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("birthday / setBirthYear / year : ", year);
        if (this.isOKBirthYear(year)) {
            if (isDebug)
                console.log("birthday / setBirthYear / done");
            this.birthYearArr = this.myBirthdayService.getYear();
            this.selectedYear = +year;
        }
    };
    BirthdayComponent.prototype.setBirthMonth = function (month) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("birthday / setBirthMonth / month : ", month);
        if (this.isOKBirthMonth(month)) {
            if (isDebug)
                console.log("birthday / setBirthMonth / done");
            this.birthMonthArr = this.myBirthdayService.getMonth();
            this.selectedMonth = +month;
        }
    };
    BirthdayComponent.prototype.setBirthDay = function (month, day) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("birthday / setBirthDay / day : ", day);
        if (this.isOKBirthDay(day)) {
            if (isDebug)
                console.log("birthday / setBirthDay / done");
            // 날짜가 설정되어 있지 않다면, 세팅해줍니다.
            this.birthDayArr = this.myBirthdayService.getDay(+month);
            this.selectedDay = +day;
        }
    };
    // @ Desc : 생년이 제대로 입력되었는지 확인합니다.
    BirthdayComponent.prototype.hasNotDoneBirthYear = function () {
        return !this.hasDoneBirthYear();
    };
    BirthdayComponent.prototype.hasDoneBirthYear = function () {
        var isOK = this.isOKBirthYear("" + this.selectedYear);
        if (!isOK) {
            var history_1 = this.myCheckerService.getLastHistory();
            console.log("birthday / hasDoneBirthYear / history : ", history_1);
        }
        return isOK;
    };
    // @ Desc : 생년을 입력해달라는 표시를 화면에 보여줍니다.
    BirthdayComponent.prototype.showWarningBirthYear = function () {
        this.isShowTooltipHead = true;
        this.isValidHead = false;
        this.tooltipHeadMsg = "태어난 연도를 확인해주세요";
    };
    BirthdayComponent.prototype.hideWarningBirthYear = function () {
        this.isShowTooltipHead = false;
        this.tooltipHeadMsg = "";
    };
    BirthdayComponent.prototype.getBirthYear = function () {
        return "" + this.selectedYear;
    };
    BirthdayComponent.prototype.hasNotDoneBirthMonth = function () {
        return !this.hasDoneBirthMonth();
    };
    BirthdayComponent.prototype.hasDoneBirthMonth = function () {
        var monthCalFormat = this.setCalendarFormat("" + this.selectedMonth);
        var isOK = this.isOKBirthMonth(monthCalFormat);
        if (!isOK) {
            var history_2 = this.myCheckerService.getLastHistory();
        }
        return isOK;
    };
    // @ Desc : 생월을 입력해달라는 표시를 화면에 보여줍니다.
    BirthdayComponent.prototype.showWarningBirthMonth = function () {
        this.isShowTooltipBody = true;
        this.isValidBody = false;
        this.tooltipBodyMsg = "태어난 월을 확인해주세요";
    };
    BirthdayComponent.prototype.hideWarningBirthMonth = function () {
        this.isShowTooltipBody = false;
        this.tooltipBodyMsg = "";
    };
    BirthdayComponent.prototype.getBirthMonth = function () {
        var monthCalFormat = this.setCalendarFormat("" + this.selectedMonth);
        return monthCalFormat;
    };
    BirthdayComponent.prototype.hasNotDoneBirthDay = function () {
        return !this.hasDoneBirthDay();
    };
    BirthdayComponent.prototype.hasDoneBirthDay = function () {
        var dayCalFormat = this.setCalendarFormat("" + this.selectedDay);
        var isOK = this.isOKBirthDay(dayCalFormat);
        if (!isOK) {
            var history_3 = this.myCheckerService.getLastHistory();
        }
        return isOK;
    };
    // @ Desc : 생일을 입력해달라는 표시를 화면에 보여줍니다.
    BirthdayComponent.prototype.showWarningBirthDay = function () {
        this.isShowTooltipTail = true;
        this.isValidTail = false;
        this.tooltipTailMsg = "태어난 일을 확인해주세요";
    };
    BirthdayComponent.prototype.hideWarningBirthDay = function () {
        this.isShowTooltipTail = false;
        this.tooltipTailMsg = "";
    };
    BirthdayComponent.prototype.getBirthDay = function () {
        var monthCalFormat = this.setCalendarFormat("" + this.selectedDay);
        return monthCalFormat;
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
            // 노출된 경고창이 있다면 감춘다.
            this.hideWarningBirthYear();
        }
        else {
            var history_4 = this.myCheckerService.getLastHistory();
            if (isDebug)
                console.log("birtday / onChangeBirthYear / history : ", history_4);
        } // end if
    };
    BirthdayComponent.prototype.onChangeBirthMonth = function (selectBirthMonth) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("birtday / onChangeBirthMonth / init");
        this.selectedMonth = selectBirthMonth;
        // 월이 바뀌었습니다. 월별 날짜도 연동되어 바꿉니다.
        this.birthDayArr = this.myBirthdayService.getDay(this.selectedMonth);
        this.selectedDay = +this.birthDayArr[Math.round(this.birthDayArr.length / 2)];
        if (isDebug)
            console.log("birtday / onChangeBirthMonth / this.selectedMonth : ", this.selectedMonth);
        var monthCalFormat = this.setCalendarFormat("" + this.selectedMonth);
        var dayCalFormat = this.setCalendarFormat("" + this.selectedDay);
        var isOK = this.isOKBirthMonth(monthCalFormat);
        if (isDebug)
            console.log("birtday / onChangeBirthMonth / isOK : ", isOK);
        if (isOK) {
            // 부모 객체에게 Change Event 발송 
            var myEventOnChangeBirthMonth = this.myEventService.getMyEvent(
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
            this.emitter.emit(myEventOnChangeBirthMonth);
            // 부모 객체에게 Change Event 발송 
            var myEventOnChangeBirthDay = this.myEventService.getMyEvent(
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
            this.emitter.emit(myEventOnChangeBirthDay);
            // 노출된 경고창이 있다면 감춘다.
            this.hideWarningBirthMonth();
        }
        else {
            var history_5 = this.myCheckerService.getLastHistory();
            if (isDebug)
                console.log("birtday / onChangeBirthMonth / history : ", history_5);
        } // end if
    };
    BirthdayComponent.prototype.onChangeBirthDay = function (selectBirthDay) {
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
            // 노출된 경고창이 있다면 감춘다.
            this.hideWarningBirthDay();
        }
        else {
            var history_6 = this.myCheckerService.getLastHistory();
            if (isDebug)
                console.log("birtday / onChangeBirthDay / history : ", history_6);
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
        __metadata('design:paramtypes', [my_logger_service_1.MyLoggerService, my_event_service_1.MyEventService, my_event_watchtower_service_1.MyEventWatchTowerService, my_checker_service_1.MyCheckerService, my_birthday_service_1.MyBirthdayService])
    ], BirthdayComponent);
    return BirthdayComponent;
}());
exports.BirthdayComponent = BirthdayComponent;
//# sourceMappingURL=birthday.component.js.map