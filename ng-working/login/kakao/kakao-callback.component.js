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
var KakaoCallbackComponent = (function () {
    function KakaoCallbackComponent(loginService, myLoggerService, activatedRoute, router) {
        this.loginService = loginService;
        this.myLoggerService = myLoggerService;
        this.activatedRoute = activatedRoute;
        this.router = router;
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
            console.log("login.component / getKakaoToken / result : ", result);
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
            console.log("login.component / getKakaoSignUp / result : ", result);
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
        this.loginService
            .getKakaoMe(kakaoTokenType, kakaoAccessToken)
            .then(function (result) {
            // this.kakaoToken = kakaoToken;
            console.log("login.component / getKakaoMe / result : ", result);
            if (null != result &&
                null != result.id) {
            }
        });
    };
    KakaoCallbackComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'kakao-callback',
            templateUrl: 'kakao-callback.component.html',
            styleUrls: ['kakao-callback.component.css']
        }), 
        __metadata('design:paramtypes', [login_service_1.LoginService, my_logger_service_1.MyLoggerService, router_1.ActivatedRoute, router_1.Router])
    ], KakaoCallbackComponent);
    return KakaoCallbackComponent;
}());
exports.KakaoCallbackComponent = KakaoCallbackComponent; // end class
//# sourceMappingURL=kakao-callback.component.js.map