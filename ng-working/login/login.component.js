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
var login_service_1 = require('./service/login.service');
var user_service_1 = require('../users/service/user.service');
var user_1 = require('../users/model/user');
var email_component_1 = require('../widget/input/email/email.component');
var password_component_1 = require('../widget/input/password/password.component');
var my_logger_service_1 = require('../util/service/my-logger.service');
var my_checker_service_1 = require('../util/service/my-checker.service');
var my_event_service_1 = require('../util/service/my-event.service');
var my_cookie_1 = require('../util/http/my-cookie');
var my_event_watchtower_service_1 = require('../util/service/my-event-watchtower.service');
var LoginComponent = (function () {
    function LoginComponent(loginService, userService, myLoggerService, myCheckerService, myEventService, watchTower, activatedRoute, router) {
        this.loginService = loginService;
        this.userService = userService;
        this.myLoggerService = myLoggerService;
        this.myCheckerService = myCheckerService;
        this.myEventService = myEventService;
        this.watchTower = watchTower;
        this.activatedRoute = activatedRoute;
        this.router = router;
        this.cafeclassAuthUrl = "http://google.co.kr";
        this.redirectUrl = "/class-center";
        this.isAdmin = false;
        this.errorMsgArr = [];
        this.myCookie = new my_cookie_1.MyCookie();
    }
    LoginComponent.prototype.isDebug = function () {
        return this.watchTower.isDebug();
    };
    LoginComponent.prototype.ngAfterViewInit = function () {
        // 자식 뷰가 모두 완료된 이후에 초기화를 진행.
        if (this.isDebug())
            console.log("login / ngAfterViewInit");
        this.asyncViewPack();
    };
    LoginComponent.prototype.asyncViewPack = function () {
        var _this = this;
        if (this.isDebug())
            console.log("login / asyncViewPack / 시작");
        // 이미 View 기본정보가 들어왔다면 바로 가져온다. 
        if (this.watchTower.getIsViewPackReady()) {
            if (this.isDebug())
                console.log("login / asyncViewPack / isViewPackReady : ", true);
            this.init();
        } // end if
        // View에 필요한 기본 정보가 비동기로 들어올 경우, 처리.
        this.watchTower.isViewPackReady$.subscribe(function (isViewPackReady) {
            if (_this.isDebug())
                console.log("login / asyncViewPack / subscribe / isViewPackReady : ", isViewPackReady);
            _this.init();
        }); // end subscribe    
    };
    LoginComponent.prototype.setViewPack = function () {
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
    LoginComponent.prototype.checkLoginUser = function () {
        var _this = this;
        if (this.isDebug())
            console.log("login / checkLoginUser / 시작");
        this.userService.getUserCookie(this.myCheckerService.getAPIKey()).then(function (myResponse) {
            if (_this.isDebug())
                console.log("login / checkLoginUser / myResponse : ", myResponse);
            if (myResponse.isSuccess() && myResponse.hasDataProp("user")) {
                if (_this.isDebug())
                    console.log("login / checkLoginUser / 쿠키에 등록된 유저 정보가 있습니다. 홈으로 이동합니다.");
                _this.router.navigate([_this.redirectUrl]);
            }
            else {
                if (_this.isDebug())
                    console.log("login / checkLoginUser / 쿠키에 등록된 유저 정보가 없습니다. 초기화합니다.");
                _this.init();
            }
        });
    };
    LoginComponent.prototype.getQueryString = function () {
        var _this = this;
        if (this.isDebug())
            console.log("kakao-callback / getQueryString / 시작");
        // 리다이렉트로 전달된 외부 쿼리 스트링 파라미터를 가져옵니다.
        this.subscription = this.activatedRoute.queryParams.subscribe(function (param) {
            if (_this.isDebug())
                console.log("kakao-callback / getQueryString / param : ", param);
            var redirectUrl = param['redirect'];
            if (null != _this.redirectUrl && "" != _this.redirectUrl) {
                if (_this.isDebug())
                    console.log("kakao-callback / getQueryString / this.redirectUrl : ", _this.redirectUrl);
                // 쿠키에 저장합니다.
                _this.myCookie.setCookie(
                // cname
                "redirectUrl", 
                // cvalue
                redirectUrl, 
                // exdays
                1);
            } // end if
        }); // end subscribe
    };
    LoginComponent.prototype.init = function () {
        var _this = this;
        if (this.isDebug())
            console.log("login / init / 시작");
        // 뷰에 필요한 공통 정보를 설정합니다.
        this.setViewPack();
        // redirect url을 파라미터로 넘겼는지 확인합니다.
        this.getQueryString();
        // 페이지 진입을 기록으로 남깁니다.
        this.myLoggerService.logActionPage(
        // apiKey:string
        this.watchTower.getApiKey(), 
        // pageType:string
        this.myLoggerService.pageTypeLogin);
        // 각 플랫폼 별로 로그인 할 수 있는 주소들을 가져옵니다.
        // 1. kakao
        this.loginService
            .getKakaoAuthUrl()
            .then(function (myResponse) {
            if (_this.isDebug())
                console.log("login / getKakaoAuthUrl / myResponse : ", myResponse);
            if (myResponse.isSuccess() && myResponse.hasDataProp("auth_url")) {
                _this.kakaoAuthUrl = myResponse.getDataProp("auth_url");
            }
        });
        // 2. naver
        this.loginService
            .getNaverAuthUrl()
            .then(function (myResponse) {
            if (_this.isDebug())
                console.log("login / getNaverAuthUrl / myResponse : ", myResponse);
            if (myResponse.isSuccess() && myResponse.hasDataProp("auth_url")) {
                _this.naverAuthUrl = myResponse.getDataProp("auth_url");
            }
        });
        // 3. facebook
        this.loginService
            .getFacebookAuthUrl()
            .then(function (myResponse) {
            if (_this.isDebug())
                console.log("login / getFacebookAuthUrl / myResponse : ", myResponse);
            if (myResponse.isSuccess() && myResponse.hasDataProp("auth_url")) {
                _this.facebookAuthUrl = myResponse.getDataProp("auth_url");
            }
        });
        // 로그인, 회원 등록의 경우, 최상단 메뉴를 가립니다.
        this.watchTower.announceToggleTopMenu(false);
    };
    LoginComponent.prototype.onChangedFromChild = function (myEvent) {
        // 자식 엘리먼트들의 이벤트 처리
        if (this.isDebug())
            console.log("login / onChangedFromChild / 시작");
        if (this.isDebug())
            console.log("login / onChangedFromChild / myEvent : ", myEvent);
        if (null == myEvent) {
            if (this.isDebug())
                console.log("login / onChangedFromChild / 중단 / null == myEvent");
            return;
        }
        if (null == myEvent.myChecker) {
            if (this.isDebug())
                console.log("login / onChangedFromChild / 중단 / null == myEvent.myChecker");
            return;
        }
        if (null == myEvent.value) {
            if (this.isDebug())
                console.log("login / onChangedFromChild / 중단 / null == myEvent.value");
            return;
        }
        // 모든 myEvent는 myChecker를 가지고 들어와야 합니다.
        // myChecker로 다시 한번 더 검사, 통과해야만 사용할 수 있습니다.
        var isOK = this.myCheckerService.isOK(myEvent.myChecker, myEvent.value);
        if (!isOK) {
            if (this.isDebug())
                console.log("login / onChangedFromChild / 중단 / !isOK");
            return;
        }
        // 정상적인 값을 가진 이벤트입니다.
        if (this.myEventService.ON_CHANGE === myEvent.eventName) {
            if (this.myEventService.KEY_USER_EMAIL === myEvent.key) {
                this.email = myEvent.value;
                if (this.isDebug())
                    console.log("login / onChangedFromChild / this.email : ", this.email);
            }
            else if (this.myEventService.KEY_USER_PASSWORD === myEvent.key) {
                this.password = myEvent.value;
                if (this.isDebug())
                    console.log("login / onChangedFromChild / this.password : ", this.password);
            } // end if
        }
        else if (this.myEventService.ON_KEYUP_ENTER === myEvent.eventName ||
            this.myEventService.ON_SUBMIT === myEvent.eventName) {
            if (this.myEventService.KEY_USER_EMAIL === myEvent.key) {
                this.email = myEvent.value;
                if (this.isDebug())
                    console.log("login / onChangedFromChild / ON_KEYUP_ENTER / KEY_USER_EMAIL ", this.email);
                // 이메일 입력 칸에서 엔터키를 눌렀습니다. 
                // 1. 이메일과 패스워드가 유효하다면 유저 확인 프로세스를 진행합니다.
                // 2. 그렇지 않다면 안내 메시지를 유저에게 보여줍니다.
                this.verifyEmailNPassword();
            }
            else if (this.myEventService.KEY_USER_PASSWORD === myEvent.key) {
                this.password = myEvent.value;
                if (this.isDebug())
                    console.log("login / onChangedFromChild / ON_KEYUP_ENTER / KEY_USER_PASSWORD ", this.password);
                // 패스워드 입력 칸에서 엔터키를 눌렀습니다. 
                // 1. 이메일과 패스워드가 유효하다면 유저 확인 프로세스를 진행합니다.
                // 2. 그렇지 않다면 안내 메시지를 유저에게 보여줍니다.
                this.verifyEmailNPassword();
            } // end if
        } // end if
        if (this.isDebug())
            console.log("login / onChangedFromChild / done");
    };
    LoginComponent.prototype.verifyEmailNPassword = function () {
        var _this = this;
        if (this.isDebug())
            console.log("login / verifyEmailNPassword / 시작");
        var warningMsgHead = "아이디 또는 비밀번호를 다시 확인하세요.";
        var warningMsgTail = "카페클래스에 등록되지 않은 아이디거나, 아이디 또는 비밀번호를 잘못 입력하셨습니다.";
        this.warningMsgHead = null;
        this.warningMsgTail = null;
        if (null == this.email || "" == this.email) {
            if (this.isDebug())
                console.log("login / verifyEmailNPassword / 중단 / 이메일 주소에 문제가 있습니다.", this.email);
            this.warningMsgHead = warningMsgHead;
            this.warningMsgTail = warningMsgTail;
            return;
        }
        if (null == this.password || "" == this.password) {
            if (this.isDebug())
                console.log("login / verifyEmailNPassword / 중단 / 암호에 문제가 있습니다.", this.password);
            this.warningMsgHead = warningMsgHead;
            this.warningMsgTail = warningMsgTail;
            return;
        }
        // DB에 이메일 주소와 암호를 조회합니다.
        var apiKey = this.myCheckerService.getAPIKey();
        if (null != apiKey && "" != apiKey) {
            this.userService
                .confirmUserEmailPassword(apiKey, this.email, this.password)
                .then(function (myResponse) {
                // 로그 등록 결과를 확인해볼 수 있습니다.
                if (_this.isDebug())
                    console.log("login / verifyEmailNPassword / myResponse : ", myResponse);
                if (myResponse.isSuccess() && myResponse.hasDataProp("user")) {
                    // 저장 완료! 초기화!
                    if (myResponse.hasDataProp("user")) {
                        var userJSON = myResponse.getDataProp("user");
                        var user = new user_1.User().setJSON(userJSON);
                        if (_this.isDebug())
                            console.log("login / verifyEmailNPassword / user : ", user);
                        _this.announceLoginUser(user);
                        _this.goRedirect();
                    } // end if
                }
                else if (myResponse.isFailed()) {
                    if (_this.isDebug())
                        console.log("login / confirmUserEmailPassword / 중단 / 회원 인증에 실패했습니다. 메시지를 화면에 노출합니다.");
                    _this.warningMsgHead = warningMsgHead;
                    _this.warningMsgTail = warningMsgTail;
                    if (null != myResponse.error) {
                        _this.watchTower.announceErrorMsgArr([myResponse.error]);
                    } // end if
                    // 에러 로그 등록
                    _this.watchTower.logAPIError("login / verifyEmailNPassword / email : " + _this.email);
                } // end if
            });
        } // end service    
    };
    LoginComponent.prototype.announceLoginUser = function (user) {
        if (this.isDebug())
            console.log("login / announceLoginUser / 시작");
        if (null == user) {
            if (this.isDebug())
                console.log("login / announceLoginUser / 중단 / null == user");
            return;
        }
        this.watchTower.announceLogin(user);
        if (user.isTeacher()) {
            this.watchTower.announceLoginTeacher(user.getTeacher());
        } // end if
    }; // end method
    LoginComponent.prototype.goRedirect = function () {
        if (this.isDebug())
            console.log("login / goRedirect / 시작");
        var redirectUrl = this.myCookie.getCookie("redirectUrl");
        if (null == redirectUrl || "" == redirectUrl) {
            redirectUrl = '/class-center';
        }
        if (this.isDebug())
            console.log("login / goRedirect / redirectUrl : ", redirectUrl);
        this.router.navigate([redirectUrl]);
    }; // end method
    LoginComponent.prototype.onClickLogin = function (event) {
        event.stopPropagation();
        event.preventDefault();
        this.verifyEmailNPassword();
    };
    LoginComponent.prototype.onClickLogo = function (event) {
        event.stopPropagation();
        event.preventDefault();
        // 홈으로 이동
        this.router.navigate(["/"]);
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
        __metadata('design:paramtypes', [login_service_1.LoginService, user_service_1.UserService, my_logger_service_1.MyLoggerService, my_checker_service_1.MyCheckerService, my_event_service_1.MyEventService, my_event_watchtower_service_1.MyEventWatchTowerService, router_1.ActivatedRoute, router_1.Router])
    ], LoginComponent);
    return LoginComponent;
}());
exports.LoginComponent = LoginComponent;
//# sourceMappingURL=login.component.js.map