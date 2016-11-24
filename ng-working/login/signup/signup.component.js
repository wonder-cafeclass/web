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
var email_component_1 = require('./email/email.component');
var password_component_1 = require('./password/password.component');
var name_component_1 = require('./name/name.component');
var nickname_component_1 = require('./nickname/nickname.component');
var mobile_component_1 = require('./mobile/mobile.component');
var gender_component_1 = require('./gender/gender.component');
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
        this.gender = "";
        // 서버에서 파라미터를 검증할 check 데이터를 받아옵니다.
        this.myCheckerService.getReady();
    }
    SignupComponent.prototype.ngOnInit = function () {
        // 페이지 진입을 기록으로 남깁니다.
        this.myLoggerService.logActionPage(this.myLoggerService.pageKeySignup);
    };
    SignupComponent.prototype.onClickSave = function (event) {
        event.preventDefault();
        event.stopPropagation();
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("signup / onClickSave / 시작");
        // 회원 가입을 하는데 필요한 모든 필드를 검사합니다.
        // 문제가 있다면 해당 필드에 경고를 보여줍니다.
        var hasNotDoneEmail = this.emailComponent.hasNotDone();
        if (hasNotDoneEmail) {
            this.emailComponent.showWarning();
        }
        var hasNotDonePassword = this.passwordComponent.hasNotDoneP();
        var hasNotDoneRepassword = false;
        if (hasNotDonePassword) {
            this.passwordComponent.showWarningP();
        }
        else {
            // 비밀번호 입력이 확인되었다면, 비밀번호 재입력을 다시 확인합니다.
            hasNotDoneRepassword = this.passwordComponent.hasNotDoneRP();
        }
        if (hasNotDoneRepassword) {
            // 비밀번호 재입력에 문제가 있습니다. 화면에 표시해줍니다.
            this.passwordComponent.showWarningRP();
        }
        var hasNotDoneName = this.nameComponent.hasNotDone();
        if (hasNotDoneName) {
            this.nameComponent.showWarning();
        }
        var hasNotDoneNickname = this.nicknameComponent.hasNotDone();
        if (hasNotDoneNickname) {
            this.nicknameComponent.showWarning();
        }
        var hasNotDoneMobileHead = this.mobileComponent.hasNotDoneMobileHead();
        var hasNotDoneMobileBody = false;
        var hasNotDoneMobileTail = false;
        if (hasNotDoneMobileHead) {
            this.mobileComponent.showWarningMobileHead();
        }
        else {
            // 휴대전화 첫번째 3자리가 문제가 없다면 휴대전화 두번째 4자리를 검사합니다.
            hasNotDoneMobileBody = this.mobileComponent.hasNotDoneMobileBody();
        }
        if (!hasNotDoneMobileHead && hasNotDoneMobileBody) {
            this.mobileComponent.showWarningMobileBody();
        }
        else if (!hasNotDoneMobileHead) {
            // 휴대전화 두번째 4자리가 문제가 없다면 휴대전화 세번째 4자리를 검사합니다.
            hasNotDoneMobileTail = this.mobileComponent.hasNotDoneMobileTail();
        }
        if (!hasNotDoneMobileHead && !hasNotDoneMobileBody && hasNotDoneMobileTail) {
            this.mobileComponent.showWarningMobileTail();
        }
        var hasNotDoneGender = this.genderComponent.hasNotDone();
        console.log("hasNotDoneGender : ", hasNotDoneGender);
        if (hasNotDoneGender) {
            console.log("hasNotDoneGender / 2");
            this.genderComponent.showWarning();
        }
        // 등록되지 않은 필드가 있다면 표시해줘야 합니다.
    };
    SignupComponent.prototype.onClickTerms = function (event) {
        event.preventDefault();
        event.stopPropagation();
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("signup / onClickTerms / 시작");
        // 이용약관 페이지로 이동.
        window.open("/#/policy");
    };
    SignupComponent.prototype.onClickPrivatePolicy = function (event) {
        event.preventDefault();
        event.stopPropagation();
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("signup / onClickPrivatePolicy / 시작");
        // 개인정보 취급방침 페이지로 이동.
        window.open("/#/private-info");
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
    __decorate([
        core_1.ViewChild(email_component_1.EmailComponent), 
        __metadata('design:type', email_component_1.EmailComponent)
    ], SignupComponent.prototype, "emailComponent", void 0);
    __decorate([
        core_1.ViewChild(password_component_1.PasswordComponent), 
        __metadata('design:type', password_component_1.PasswordComponent)
    ], SignupComponent.prototype, "passwordComponent", void 0);
    __decorate([
        core_1.ViewChild(name_component_1.NameComponent), 
        __metadata('design:type', name_component_1.NameComponent)
    ], SignupComponent.prototype, "nameComponent", void 0);
    __decorate([
        core_1.ViewChild(nickname_component_1.NicknameComponent), 
        __metadata('design:type', nickname_component_1.NicknameComponent)
    ], SignupComponent.prototype, "nicknameComponent", void 0);
    __decorate([
        core_1.ViewChild(mobile_component_1.MobileComponent), 
        __metadata('design:type', mobile_component_1.MobileComponent)
    ], SignupComponent.prototype, "mobileComponent", void 0);
    __decorate([
        core_1.ViewChild(gender_component_1.GenderComponent), 
        __metadata('design:type', gender_component_1.GenderComponent)
    ], SignupComponent.prototype, "genderComponent", void 0);
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