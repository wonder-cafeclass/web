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
var my_logger_service_1 = require('../../util/service/my-logger.service');
var my_checker_service_1 = require('../../util/service/my-checker.service');
var user_service_1 = require('../../users/service/user.service');
var KakaoCallbackComponent = (function () {
    function KakaoCallbackComponent(loginService, userService, myLoggerService, myCheckerService, activatedRoute, router) {
        this.loginService = loginService;
        this.userService = userService;
        this.myLoggerService = myLoggerService;
        this.myCheckerService = myCheckerService;
        this.activatedRoute = activatedRoute;
        this.router = router;
        this.redirectUrl = "/class-center";
        this.kakaoSignupCodeAlreadyRegisterd = -102;
        // Do something...
    } // end function
    KakaoCallbackComponent.prototype.ngOnInit = function () {
        var _this = this;
        // 페이지 진입을 기록으로 남깁니다.
        this.myLoggerService.logActionPage(this.myLoggerService.pageKeyLoginKakao);
        // 리다이렉트로 전달된 외부 쿼리 스트링 파라미터를 가져옵니다.
        this.subscription = this.activatedRoute.queryParams.subscribe(function (param) {
            _this.code = param['code'];
            if (null != _this.code && "" != _this.code) {
                _this.getKakaoToken(_this.code);
            }
        }); // end subscribe
    }; // end function
    KakaoCallbackComponent.prototype.ngOnDestroy = function () {
        // prevent memory leak by unsubscribing
        this.subscription.unsubscribe();
    };
    // KAKAO
    // 카카오 로그인 토큰을 가져옵니다.
    KakaoCallbackComponent.prototype.getKakaoToken = function (kakaoCode) {
        var _this = this;
        if (null == kakaoCode || "" == kakaoCode) {
            console.log("!Error! / login.compoenet / ");
            return;
        }
        this.loginService
            .getKakaoToken(kakaoCode)
            .then(function (result) {
            // this.kakaoToken = kakaoToken;
            console.log("kakao-callback / getKakaoToken / result : ", result);
            if (null != result &&
                null != result.access_token &&
                null != result.token_type) {
                result.access_token;
                result.token_type;
                // 유저 앱등록을 진행합니다.
                _this.getKakaoSignUp(result.token_type, result.access_token);
            }
        });
    };
    // 유저를 카카오 앱 - cafeclass에 등록합니다. 이미 등록되어 있다면 재등록되지 않습니다.
    KakaoCallbackComponent.prototype.getKakaoSignUp = function (kakaoTokenType, kakaoAccessToken) {
        var _this = this;
        this.loginService
            .getKakaoSignUp(kakaoTokenType, kakaoAccessToken)
            .then(function (result) {
            // this.kakaoToken = kakaoToken;
            console.log("kakao-callback / getKakaoSignUp / result : ", result);
            if (null != result &&
                null != result.code &&
                null != result.msg) {
                var code = result.code;
                var msg = result.msg;
                if (_this.kakaoSignupCodeAlreadyRegisterd === code) {
                    // 유저 정보를 가져옵니다.
                    _this.getKakaoMe(kakaoTokenType, kakaoAccessToken);
                }
            }
        });
    };
    KakaoCallbackComponent.prototype.getKakaoMe = function (kakaoTokenType, kakaoAccessToken) {
        var _this = this;
        this.loginService
            .getKakaoMe(kakaoTokenType, kakaoAccessToken)
            .then(function (result) {
            if (null == result || null == result.id) {
                // 로그인 실패. 홈으로 리다이렉트
                _this.router.navigate(['/class-center']);
                return;
            }
            // 카카오 플랫폼에서의 로그인 성공!
            // 카카오 아이디로 유저 정보를 가져옵니다.
            _this.getUserByKakaoId(result.kakao_id);
            // 1. 최초 등록된 유저라면 유저 정보 등록 창으로 이동.
            // 2. 이미 등록된 유저라면 이전 페이지로 리다이렉트 합니다. 
            // 1. mobile, gender가 없다면 정상 등록된 유저가 아님. 회원 가입 창으로 이동.
            // this.router.navigate(['/login/signup/kakao', result.kakao_id]);
        }); // end service
    }; // end method 
    KakaoCallbackComponent.prototype.getUserByKakaoId = function (kakaoId) {
        var _this = this;
        this.userService
            .getUserByKakaoId(kakaoId)
            .then(function (result) {
            console.log("getUserByKakaoId / result : ", result);
            if (null == result || null == result.user) {
                // 카카오 로그인은 성공. 하지만 유저 정보가 없음.
                return;
            }
            else if (null == result.user.gender ||
                "" === result.user.gender ||
                null == result.user.mobile ||
                "" === result.user.mobile) {
                // 카카오 로그인은 성공. 카카오 프로필에서 가져온 정보로 유저 등록됨. 
                // 하지만 추가 정보 필요. 
                // 회원 가입창으로 이동.
                _this.router.navigate(['/login/signup/kakao', result.kakao_id]);
                return;
            }
            else {
                // 카카오 로그인 성공. 등록된 유저 정보가 문제 없음. 
                // 로그인이 성공했으므로, 서버에 해당 유저의 로그인 쿠키를 만들어야 함.
                // api key 필요!
                // confirmUserKakao
                _this.myCheckerService
                    .getReady()
                    .then(function () {
                    _this.userService
                        .confirmUserKakao(_this.myCheckerService.getAPIKey(), result.kakao_id)
                        .then(function (result) {
                        if (null == result || null == result.success || !result.success) {
                            // kakaoid로 쿠키 인증 실패. 홈으로 이동.
                            _this.router.navigate(['/class-center']);
                            return;
                        }
                        // 쿠키 인증 성공!
                        // 로그인 직전 페이지로 리다이렉트. 
                        // 돌아갈 주소가 없다면, 홈으로 이동.
                        _this.router.navigate(['/class-center']);
                    }); // end userService
                }); // end myCheckerService
            } // end if
        }); // end service
    };
    KakaoCallbackComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'kakao-callback',
            templateUrl: 'kakao-callback.component.html',
            styleUrls: ['kakao-callback.component.css']
        }), 
        __metadata('design:paramtypes', [login_service_1.LoginService, user_service_1.UserService, my_logger_service_1.MyLoggerService, my_checker_service_1.MyCheckerService, router_1.ActivatedRoute, router_1.Router])
    ], KakaoCallbackComponent);
    return KakaoCallbackComponent;
}());
exports.KakaoCallbackComponent = KakaoCallbackComponent; // end class
//# sourceMappingURL=kakao-callback.component.js.map