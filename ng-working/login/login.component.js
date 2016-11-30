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
var auth_service_1 = require('../auth/auth.service');
var login_service_1 = require('./service/login.service');
var user_service_1 = require('../users/service/user.service');
var email_component_1 = require('./signup/email/email.component');
var password_component_1 = require('./signup/password/password.component');
var my_logger_service_1 = require('../util/service/my-logger.service');
var my_checker_service_1 = require('../util/service/my-checker.service');
var my_event_service_1 = require('../util/service/my-event.service');
var my_event_watchtower_service_1 = require('../util/service/my-event-watchtower.service');
var LoginComponent = (function () {
    function LoginComponent(authService, loginService, userService, myLoggerService, myCheckerService, myEventService, myEventWatchTowerService, router) {
        this.authService = authService;
        this.loginService = loginService;
        this.userService = userService;
        this.myLoggerService = myLoggerService;
        this.myCheckerService = myCheckerService;
        this.myEventService = myEventService;
        this.myEventWatchTowerService = myEventWatchTowerService;
        this.router = router;
        this.cafeclassAuthUrl = "http://google.co.kr";
    }
    LoginComponent.prototype.ngOnInit = function () {
        // 로그인되어 있는 회원인지 먼저 확인. 
        // 로그인되어 있는 상태라면 홈으로 이동시킵니다.
        var _this = this;
        // 회원 로그인 쿠키를 가져옵니다.
        // 로그인 이후 만들어진 쿠키와 유저 정보가 있다면 DB를 통해 가져옵니다.
        this.myCheckerService.getReady().then(function () {
            _this.userService.getUserCookie(_this.myCheckerService.getAPIKey()).then(function (result) {
                if (null != result && null != result.user) {
                    // 쿠키에 등록된 유저 정보가 있습니다. 홈으로 이동합니다.
                    _this.router.navigate(['/class-center']);
                }
                else {
                    // 쿠키에 등록된 유저 정보가 없습니다. 초기화합니다.
                    _this.init();
                }
            });
        }); // end Promise
    };
    LoginComponent.prototype.init = function () {
        var _this = this;
        // 페이지 진입을 기록으로 남깁니다.
        this.myLoggerService.logActionPage(this.myLoggerService.pageKeyLogin);
        // 각 플랫폼 별로 로그인 할 수 있는 주소들을 가져옵니다.
        // 1. kakao
        this.loginService
            .getKakaoAuthUrl()
            .then(function (kakaoAuthUrl) {
            _this.kakaoAuthUrl = kakaoAuthUrl;
        });
        // 2. naver
        this.loginService
            .getNaverAuthUrl()
            .then(function (naverAuthUrl) {
            _this.naverAuthUrl = naverAuthUrl;
        });
        // 3. facebook
        this.loginService
            .getFacebookAuthUrl()
            .then(function (facebookAuthUrl) {
            _this.facebookAuthUrl = facebookAuthUrl;
        });
        // 로그인, 회원 등록의 경우, 최상단 메뉴를 가립니다.
        this.myEventWatchTowerService.announceToggleTopMenu(false);
    };
    LoginComponent.prototype.onChangedFromChild = function (myEvent) {
        // 자식 엘리먼트들의 이벤트 처리
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("login / onChangedFromChild / 시작");
        if (isDebug)
            console.log("login / onChangedFromChild / myEvent : ", myEvent);
        if (null == myEvent) {
            if (isDebug)
                console.log("login / onChangedFromChild / 중단 / null == myEven");
            return;
        }
        if (null == myEvent.myChecker) {
            if (isDebug)
                console.log("login / onChangedFromChild / 중단 / null == myEvent.myChecker");
            return;
        }
        if (null == myEvent.value) {
            if (isDebug)
                console.log("login / onChangedFromChild / 중단 / null == myEvent.value");
            return;
        }
        // 모든 myEvent는 myChecker를 가지고 들어와야 합니다.
        // myChecker로 다시 한번 더 검사, 통과해야만 사용할 수 있습니다.
        var isOK = this.myCheckerService.isOK(myEvent.myChecker, myEvent.value);
        if (!isOK) {
            if (isDebug)
                console.log("login / onChangedFromChild / 중단 / !isOK");
            return;
        }
        // 정상적인 값을 가진 이벤트입니다.
        if (this.myEventService.ON_CHANGE === myEvent.eventName) {
            if (this.myEventService.KEY_USER_EMAIL === myEvent.key) {
                this.email = myEvent.value;
                if (isDebug)
                    console.log("login / onChangedFromChild / this.email : ", this.email);
            }
            else if (this.myEventService.KEY_USER_PASSWORD === myEvent.key) {
                this.password = myEvent.value;
                if (isDebug)
                    console.log("login / onChangedFromChild / this.password : ", this.password);
            } // end if
        } // end if
        if (isDebug)
            console.log("login / onChangedFromChild / done");
    };
    LoginComponent.prototype.onClickLogin = function (event) {
        var _this = this;
        event.stopPropagation();
        event.preventDefault();
        var warningMsgHead = "아이디 또는 비밀번호를 다시 확인하세요.";
        var warningMsgTail = "카페클래스에 등록되지 않은 아이디거나, 아이디 또는 비밀번호를 잘못 입력하셨습니다.";
        this.warningMsgHead = null;
        this.warningMsgTail = null;
        if (null == this.email || "" == this.email) {
            // 이메일 주소에 문제가 있습니다.
            this.warningMsgHead = warningMsgHead;
            this.warningMsgTail = warningMsgTail;
            return;
        }
        if (null == this.password || "" == this.password) {
            // 암호에 문제가 있습니다.
            this.warningMsgHead = warningMsgHead;
            this.warningMsgTail = warningMsgTail;
            return;
        }
        // DB에 이메일 주소와 암호를 조회합니다.
        var apiKey = this.myCheckerService.getAPIKey();
        if (null != apiKey && "" != apiKey) {
            this.userService
                .confirmUserEmailPassword(apiKey, this.email, this.password)
                .then(function (result) {
                if (null == result || null == result.success || !result.success) {
                    // 회원 인증에 실패했습니다. 
                    // 메시지를 화면에 노출합니다.
                    _this.warningMsgHead = warningMsgHead;
                    _this.warningMsgTail = warningMsgTail;
                    return;
                }
                // 회원 인증에 성공했습니다.
                // 홈화면으로 이동합니다.
                _this.router.navigate(['/class-center']);
            });
        } // end service
    };
    __decorate([
        core_1.ViewChild(email_component_1.EmailComponent), 
        __metadata('design:type', email_component_1.EmailComponent)
    ], LoginComponent.prototype, "emailComponent", void 0);
    __decorate([
        core_1.ViewChild(password_component_1.PasswordComponent), 
        __metadata('design:type', password_component_1.PasswordComponent)
    ], LoginComponent.prototype, "passwordComponent", void 0);
    LoginComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'login',
            templateUrl: 'login.component.html',
            styleUrls: ['login.component.css']
        }), 
        __metadata('design:paramtypes', [auth_service_1.AuthService, login_service_1.LoginService, user_service_1.UserService, my_logger_service_1.MyLoggerService, my_checker_service_1.MyCheckerService, my_event_service_1.MyEventService, my_event_watchtower_service_1.MyEventWatchTowerService, router_1.Router])
    ], LoginComponent);
    return LoginComponent;
}());
exports.LoginComponent = LoginComponent;
//# sourceMappingURL=login.component.js.map