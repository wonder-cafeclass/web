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
var login_service_1 = require('../service/login.service');
var user_service_1 = require('../../users/service/user.service');
var my_logger_service_1 = require('../../util/service/my-logger.service');
var my_checker_service_1 = require('../../util/service/my-checker.service');
var my_event_service_1 = require('../../util/service/my-event.service');
var SignupComponent = (function () {
    function SignupComponent(loginService, userService, myLoggerService, myCheckerService, myEventService, router) {
        this.loginService = loginService;
        this.userService = userService;
        this.myLoggerService = myLoggerService;
        this.myCheckerService = myCheckerService;
        this.myEventService = myEventService;
        this.router = router;
        this.gender = "F";
        // 서버에서 파라미터를 검증할 check 데이터를 받아옵니다.
        this.myCheckerService.getReady();
    }
    SignupComponent.prototype.ngOnInit = function () {
        // 페이지 진입을 기록으로 남깁니다.
        this.myLoggerService.logActionPage(this.myLoggerService.pageKeySignup);
    };
    SignupComponent.prototype.onClickSave = function (event) {
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("signup / onClickSave / 시작");
        // 회원 가입을 하는데 필요한 모든 필드를 검사합니다.
        // 등록되지 않은 필드가 있다면 표시해줘야 합니다.
    };
    SignupComponent.prototype.onChangedFromChild = function (myEvent) {
        // 자식 엘리먼트들의 이벤트 처리
        var _this = this;
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("signup / onChangedFromChild / 시작");
        if (isDebug)
            console.log("signup / onChangedFromChild / myEvent : ", myEvent);
        if (null == myEvent) {
            if (isDebug)
                console.log("signup / onChangedFromChild / 중단 / null == myEven");
            return;
        }
        if (null == myEvent.myChecker) {
            if (isDebug)
                console.log("signup / onChangedFromChild / 중단 / null == myEvent.myChecker");
            return;
        }
        if (null == myEvent.value) {
            if (isDebug)
                console.log("signup / onChangedFromChild / 중단 / null == myEvent.value");
            return;
        }
        // 모든 myEvent는 myChecker를 가지고 들어와야 합니다.
        // myChecker로 다시 한번 더 검사, 통과해야만 사용할 수 있습니다.
        var isOK = this.myCheckerService.isOK(myEvent.myChecker, myEvent.value);
        if (!isOK) {
            if (isDebug)
                console.log("signup / onChangedFromChild / 중단 / !isOK");
            return;
        }
        // 정상적인 값을 가진 이벤트입니다.
        if (this.myEventService.ON_CHANGE === myEvent.eventName) {
            if (this.myEventService.KEY_USER_EMAIL === myEvent.key) {
                var email_1 = myEvent.value;
                // DB Unique test
                this.userService
                    .getUserByEmail(email_1)
                    .then(function (result) {
                    if (null != result &&
                        null == result.user) {
                        // 해당 이메일로 등록된 유저는 없습니다. 
                        // email 등록이 가능합니다.
                        _this.email = email_1;
                        if (isDebug)
                            console.log("signup / onChangedFromChild / email 등록이 가능합니다.");
                    } // end if
                }); // end service
            }
            else if (this.myEventService.KEY_USER_PASSWORD === myEvent.key) {
                this.password = myEvent.value;
                if (isDebug)
                    console.log("signup / onChangedFromChild / this.password : ", this.password);
            }
            else if (this.myEventService.KEY_USER_NAME === myEvent.key) {
                this.name = myEvent.value;
                if (isDebug)
                    console.log("signup / onChangedFromChild / this.name : ", this.name);
            }
            else if (this.myEventService.KEY_USER_NICKNAME === myEvent.key) {
                this.nickname = myEvent.value;
                if (isDebug)
                    console.log("signup / onChangedFromChild / this.nickname : ", this.nickname);
            }
            else if (this.myEventService.KEY_USER_THUMBNAIL === myEvent.key) {
                this.thumbnail = myEvent.value;
                if (isDebug)
                    console.log("signup / onChangedFromChild / this.thumbnail : ", this.thumbnail);
            }
            else if (this.myEventService.KEY_USER_MOBILE_NUM_HEAD === myEvent.key) {
                this.mobileNumHead = myEvent.value;
                if (isDebug)
                    console.log("signup / onChangedFromChild / this.mobileNumHead : ", this.mobileNumHead);
            }
            else if (this.myEventService.KEY_USER_MOBILE_NUM_BODY === myEvent.key) {
                this.mobileNumBody = myEvent.value;
                if (isDebug)
                    console.log("signup / onChangedFromChild / this.mobileNumBody : ", this.mobileNumBody);
            }
            else if (this.myEventService.KEY_USER_MOBILE_NUM_TAIL === myEvent.key) {
                this.mobileNumTail = myEvent.value;
                if (isDebug)
                    console.log("signup / onChangedFromChild / this.mobileNumTail : ", this.mobileNumTail);
            }
            else if (this.myEventService.KEY_USER_GENDER === myEvent.key) {
                this.gender = myEvent.value;
                if (isDebug)
                    console.log("signup / onChangedFromChild / this.gender : ", this.gender);
            }
            else if (this.myEventService.KEY_USER_BIRTH_YEAR === myEvent.key) {
                this.birthYear = myEvent.value;
                if (isDebug)
                    console.log("signup / onChangedFromChild / this.birthYear : ", this.birthYear);
            }
            else if (this.myEventService.KEY_USER_BIRTH_MONTH === myEvent.key) {
                this.birthMonth = myEvent.value;
                if (isDebug)
                    console.log("signup / onChangedFromChild / this.birthMonth : ", this.birthMonth);
            }
            else if (this.myEventService.KEY_USER_BIRTH_DAY === myEvent.key) {
                this.birthDay = myEvent.value;
                if (isDebug)
                    console.log("signup / onChangedFromChild / this.birthDay : ", this.birthDay);
            } // end if
        } // end if
        if (isDebug)
            console.log("signup / onChangedFromChild / done");
    };
    SignupComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'signup',
            templateUrl: 'signup.component.html',
            styleUrls: ['signup.component.css']
        }), 
        __metadata('design:paramtypes', [login_service_1.LoginService, user_service_1.UserService, my_logger_service_1.MyLoggerService, my_checker_service_1.MyCheckerService, my_event_service_1.MyEventService, router_1.Router])
    ], SignupComponent);
    return SignupComponent;
}());
exports.SignupComponent = SignupComponent;
//# sourceMappingURL=signup.component.js.map