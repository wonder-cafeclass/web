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
var my_checker_service_1 = require('../../util/service/my-checker.service');
var my_logger_service_1 = require('../../util/service/my-logger.service');
var FacebookCallbackComponent = (function () {
    function FacebookCallbackComponent(loginService, myLoggerService, myCheckerService, userService, activatedRoute, router) {
        this.loginService = loginService;
        this.myLoggerService = myLoggerService;
        this.myCheckerService = myCheckerService;
        this.userService = userService;
        this.activatedRoute = activatedRoute;
        this.router = router;
        this.redirectUrl = "/class-center";
        this.isValidState = false;
        // Do something...
    } // end function
    FacebookCallbackComponent.prototype.ngOnInit = function () {
        var _this = this;
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("facebook-callback / ngOnInit / init");
        // 페이지 진입을 기록으로 남깁니다.
        this.myLoggerService.logActionPage(this.myLoggerService.pageKeyLoginFacebook);
        // 리다이렉트로 전달된 외부 쿼리 스트링 파라미터를 가져옵니다.
        this.subscription = this.activatedRoute.queryParams.subscribe(function (param) {
            if (isDebug)
                console.log("facebook-callback / queryParams / param : ", param);
            _this.code = param['code'];
            _this.state = param['state'];
            if (isDebug)
                console.log("facebook-callback / queryParams / this.code : ", _this.code);
            if (isDebug)
                console.log("facebook-callback / queryParams / this.state : ", _this.state);
            if (null != _this.code &&
                "" != _this.code &&
                null != _this.state &&
                "" != _this.state) {
                _this.getState(_this.state, _this.code);
            } // end if
        }); // end subscribe
    }; // end function
    FacebookCallbackComponent.prototype.ngOnDestroy = function () {
        // prevent memory leak by unsubscribing
        this.subscription.unsubscribe();
    };
    FacebookCallbackComponent.prototype.getState = function (state, code) {
        var _this = this;
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("facebook-callback / getState / init");
        if (null == state || "" == state) {
            return;
        }
        if (null == code || "" == code) {
            return;
        }
        if (isDebug)
            console.log("facebook-callback / getState / state : ", state);
        if (isDebug)
            console.log("facebook-callback / getState / code : ", code);
        this.loginService
            .getFacebookState(state)
            .then(function (result) {
            if (isDebug)
                console.log("facebook-callback / getState / getFacebookState / result : ", result);
            if (null != result &&
                null != result.is_valid_state) {
                _this.isValidState = result.is_valid_state;
            }
            if (isDebug)
                console.log("facebook-callback / getState / getFacebookState / this.isValidState : ", _this.isValidState);
            // Session에 저장된 state와 비교합니다.
            if (_this.isValidState) {
                // 1. state가 정상적일 경우, 다음 단계를 진행
                if (isDebug)
                    console.log("facebook-callback / getFacebookState / state가 정상적일 경우, 다음 단계를 진행");
                _this.getAccessToken(code);
            }
            else {
                // 2. state가 다를 경우, 사용자에게 메시지 노출. '비정상적인 접근입니다.'. 메시지 확인 뒤, 로그인 홈으로 이동.
                // - 상황 정보를 로그로 남김. ex) '비정상 로그인 접근'
                if (isDebug)
                    console.log("facebook-callback / getFacebookState / state가 다를 경우, 사용자에게 메시지 노출. 메시지 확인 뒤, 로그인 홈으로 이동");
            }
        });
    }; // end function
    FacebookCallbackComponent.prototype.getAccessToken = function (code) {
        var _this = this;
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("facebook-callback / getAccessToken / init");
        this.loginService
            .getFacebookAccess(code)
            .then(function (result) {
            if (isDebug)
                console.log("facebook-callback / getAccessToken / result : ", result);
            if (null != result && null != result.access_token) {
                _this.getMe();
            }
        });
    };
    FacebookCallbackComponent.prototype.getMe = function () {
        var _this = this;
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("facebook-callback / getMe / init");
        this.loginService
            .getFacebookMe()
            .then(function (result) {
            if (isDebug)
                console.log("facebook-callback / getMe / result : ", result);
            if (null == result || null == result.facebook_id) {
                // TODO - 페이스북에서 유저 정보를 가져오는데 실패했습니다. 로그를 기록, 홈으로 이동합니다.
                if (isDebug)
                    console.log("facebook-callback / 페이스북에서 유저 정보를 가져오는데 실패했습니다.");
                return;
            }
            // 페이스북 로그인 성공!
            // 로그인한 유저 정보를 가져오는데 성공했습니다!
            if (null == result.gender ||
                "" === result.gender ||
                null == result.mobile ||
                "" === result.mobile) {
                // 페이스북 로그인은 성공. 페이스북 유저 프로필에서 가져온 정보로 유저 등록됨. 
                // 하지만 추가 정보 필요. 
                // 회원 가입창으로 이동.
                if (isDebug)
                    console.log("facebook-callback / 페이스북 로그인은 성공. 페이스북 유저 프로필에서 가져온 정보로 유저 등록됨.회원 가입창으로 이동.");
                _this.router.navigate(['/login/signup/facebook', result.facebook_id]);
            }
            else {
                // 2. mobile, gender가 있다면 정상 등록된 유저. 로그인 창으로 리다이렉트.
                // this.router.navigate([this.redirectUrl]);
                // 페이스북 로그인 성공. 등록된 유저 정보가 문제 없음. 
                // 로그인이 성공했으므로, 서버에 해당 유저의 로그인 쿠키를 만들어야 함.
                if (isDebug)
                    console.log("facebook-callback / 페이스북 로그인은 성공. 로그인이 성공했으므로, 서버에 해당 유저의 로그인 쿠키를 만들어야 함.");
                // api key 필요!
                _this.myCheckerService
                    .getReady()
                    .then(function () {
                    _this.userService
                        .confirmUserFacebook(_this.myCheckerService.getAPIKey(), result.facebook_id)
                        .then(function (result) {
                        if (isDebug)
                            console.log("facebook-callback / confirmUserFacebook / result : ", result);
                        if (null == result || null == result.success || !result.success) {
                            // facebook id로 쿠키 인증 실패. 홈으로 이동.
                            if (isDebug)
                                console.log("facebook-callback / confirmUserFacebook / facebook id로 쿠키 인증 실패. 홈으로 이동.");
                            _this.router.navigate(['/class-center']);
                            return;
                        }
                        // 쿠키 인증 성공!
                        // 로그인 직전 페이지로 리다이렉트. 
                        // 돌아갈 주소가 없다면, 홈으로 이동.
                        if (isDebug)
                            console.log("facebook-callback / confirmUserFacebook / facebook id로 쿠키 인증 성공!. 로그인 직전 페이지로 리다이렉트.");
                        _this.router.navigate(['/class-center']);
                    }); // end userService
                }); // end myCheckerService
            } // end if
        }); // end service
    };
    FacebookCallbackComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'facebook-callback',
            templateUrl: 'facebook-callback.component.html',
            styleUrls: ['facebook-callback.component.css']
        }), 
        __metadata('design:paramtypes', [login_service_1.LoginService, my_logger_service_1.MyLoggerService, my_checker_service_1.MyCheckerService, user_service_1.UserService, router_1.ActivatedRoute, router_1.Router])
    ], FacebookCallbackComponent);
    return FacebookCallbackComponent;
}());
exports.FacebookCallbackComponent = FacebookCallbackComponent; // end class
//# sourceMappingURL=facebook-callback.component.js.map