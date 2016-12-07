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
        this.selectedYear = -1;
        this.selectedMonth = -1;
        this.selectedDay = -1;
        this.isAdmin = false;
    }
    BirthdayComponent.prototype.ngOnInit = function () {
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("user-my-nav-list / ngOnInit / init");
        // REMOVE ME
        // 운영 서버인지 서비스 서버인지 판단하는 플래그값 가져옴.
        // this.setIsAdmin();
        // my-checker.service의 apikey 가져옴. 
        // this.setMyCheckerServiceReady();    
    };
    BirthdayComponent.prototype.ngAfterViewInit = function () {
        // 자식 뷰가 모두 완료된 이후에 초기화를 진행.
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("my-info / ngAfterViewInit");
        this.asyncViewPack();
    };
    BirthdayComponent.prototype.asyncViewPack = function () {
        var _this = this;
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("my-info / asyncViewPack / 시작");
        // 이미 View 기본정보가 들어왔다면 바로 가져온다. 
        if (this.watchTower.getIsViewPackReady()) {
            if (isDebug)
                console.log("my-info / asyncViewPack / isViewPackReady : ", true);
            this.init();
        } // end if
        // View에 필요한 기본 정보가 비동기로 들어올 경우, 처리.
        this.watchTower.isViewPackReady$.subscribe(function (isViewPackReady) {
            if (isDebug)
                console.log("my-info / asyncViewPack / subscribe / isViewPackReady : ", isViewPackReady);
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
    // REMOVE ME  
    /*
      private setIsAdmin() :void {
    
        let isDebug:boolean = true;
        // let isDebug:boolean = false;
        if(isDebug) console.log("user-my-nav-list / setIsAdmin / 시작");
    
        // 사전에 등록된 값을 가져옴. 페이지 이동시에는 직접 값을 가져와야 함.
        this.isAdmin = this.watchTower.getIsAdmin();
        if(isDebug) console.log("user-my-nav-list / setIsAdmin / 시작 / this.isAdmin : ",this.isAdmin);
    
        // 운영 서버인지 서비스 서버인지 판단하는 플래그값 가져옴.
        this.watchTower.isViewPackReady$.subscribe(
          (isAdmin:boolean) => {
    
          if(isDebug) console.log("user-my-nav-list / setIsAdmin / isAdmin : ",isAdmin);
          this.isAdmin = isAdmin;
        });
      }
    
      private setMyCheckerServiceReady() :void {
    
        let isDebug:boolean = true;
        // let isDebug:boolean = false;
        if(isDebug) console.log("user-my-nav-list / setMyCheckerServiceReady / 시작");
    
        // 페이지 이동으로 진입한 경우, watch tower에 저장된 변수 값을 가져온다.
        if(this.watchTower.getIsMyCheckerReady()) {
          this.setMyCheckerService();
          this.init();
        }
    
        this.watchTower.myCheckerServicePackReady$.subscribe(
          (isReady:boolean) => {
    
          if(isDebug) console.log("user-my-nav-list / setMyCheckerServiceReady / isReady : ",isReady);
    
          if(!isReady) {
            // 에러 로그 등록
            this.myLoggerService.logError(
              // apiKey:string
              this.watchTower.getApiKey(),
              // errorType:string
              this.myLoggerService.errorTypeNotValidValue,
              // errorMsg:string
              `user-my-nav-list / setMyCheckerServiceReady / Failed! / isReady : ${isReady}`
            );
            return;
          }
    
          this.setMyCheckerService();
          this.init();
        });
      }
    
      private setMyCheckerService() :void {
    
        let isDebug:boolean = true;
        // let isDebug:boolean = false;
        if(isDebug) console.log("user-my-nav-list / setMyCheckerService / 시작");
    
        if(this.watchTower.getIsMyCheckerReady()) {
    
          this.myCheckerService.setReady(
            // checkerMap:any
            this.watchTower.getCheckerMap(),
            // constMap:any
            this.watchTower.getConstMap(),
            // dirtyWordList:any
            this.watchTower.getDirtyWordList(),
            // apiKey:string
            this.watchTower.getApiKey()
          ); // end setReady
    
          if(isDebug) console.log("user-my-nav-list / setMyCheckerService / done!");
        } // end if
    
      }
    */
    BirthdayComponent.prototype.setBirthdayDefault = function () {
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
    BirthdayComponent.prototype.init = function () {
        // 뷰에 필요한 공통 정보를 설정합니다.
        this.setViewPack();
        this.setBirthdayDefault();
        this.setMyChecker();
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
    BirthdayComponent.prototype.setBirthYear = function (year) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("birthday / setBirthYear / year : ", year);
        if (this.isOKBirthYear(year)) {
            if (isDebug)
                console.log("birthday / setBirthYear / done");
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
            this.selectedMonth = +month;
        }
    };
    BirthdayComponent.prototype.setBirthDay = function (day) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("birthday / setBirthDay / day : ", day);
        if (this.isOKBirthDay(day)) {
            if (isDebug)
                console.log("birthday / setBirthDay / done");
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
        // Do something...
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
            console.log("birthday / hasDoneBirthMonth / history : ", history_2);
        }
        return isOK;
    };
    // @ Desc : 생월을 입력해달라는 표시를 화면에 보여줍니다.
    BirthdayComponent.prototype.showWarningBirthMonth = function () {
        // Do something...
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
        console.log("TEST / hasDoneBirthDay / dayCalFormat : ", dayCalFormat);
        console.log("TEST / hasDoneBirthDay / isOK : ", isOK);
        if (!isOK) {
            var history_3 = this.myCheckerService.getLastHistory();
            console.log("birthday / hasDoneBirthDay / history : ", history_3);
        }
        return isOK;
    };
    // @ Desc : 생일을 입력해달라는 표시를 화면에 보여줍니다.
    BirthdayComponent.prototype.showWarningBirthDay = function () {
        // Do something...
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