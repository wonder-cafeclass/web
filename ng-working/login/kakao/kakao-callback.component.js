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
var my_event_watchtower_service_1 = require('../../util/service/my-event-watchtower.service');
var KakaoCallbackComponent = (function () {
    function KakaoCallbackComponent(loginService, myEventWatchTowerService, userService, myLoggerService, myCheckerService, activatedRoute, router) {
        this.loginService = loginService;
        this.myEventWatchTowerService = myEventWatchTowerService;
        this.userService = userService;
        this.myLoggerService = myLoggerService;
        this.myCheckerService = myCheckerService;
        this.activatedRoute = activatedRoute;
        this.router = router;
        this.redirectUrl = "/class-center";
        this.kakaoSignupCodeAlreadyRegisterd = -102;
        this.isAdmin = false;
        this.errorMsgArr = [];
        // Do something...
    } // end function
    KakaoCallbackComponent.prototype.ngOnInit = function () {
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("kakao-callback / ngOnInit / 시작");
        // 운영 서버인지 서비스 서버인지 판단하는 플래그값 가져옴.
        this.setIsAdmin();
        // my-checker.service의 apikey 가져옴. 
        this.setMyCheckerReady();
    }; // end function
    KakaoCallbackComponent.prototype.ngOnDestroy = function () {
        // prevent memory leak by unsubscribing
        this.subscription.unsubscribe();
    };
    KakaoCallbackComponent.prototype.setIsAdmin = function () {
        var _this = this;
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("kakao-callback / setIsAdmin / 시작");
        // 운영 서버인지 서비스 서버인지 판단하는 플래그값 가져옴.
        this.myEventWatchTowerService.isAdmin$.subscribe(function (isAdmin) {
            if (isDebug)
                console.log("kakao-callback / setIsAdmin / isAdmin : ", isAdmin);
            _this.isAdmin = isAdmin;
        });
    };
    KakaoCallbackComponent.prototype.setMyCheckerReady = function () {
        var _this = this;
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("kakao-callback / setMyCheckerReady / 시작");
        this.myEventWatchTowerService.myCheckerServiceReady$.subscribe(function (isReady) {
            if (isDebug)
                console.log("kakao-callback / setMyCheckerReady / isReady : ", isReady);
            if (!isReady) {
                return;
            }
            _this.myCheckerService.setReady(
            // checkerMap:any
            _this.myEventWatchTowerService.getCheckerMap(), 
            // constMap:any
            _this.myEventWatchTowerService.getConstMap(), 
            // dirtyWordList:any
            _this.myEventWatchTowerService.getDirtyWordList(), 
            // apiKey:string
            _this.myEventWatchTowerService.getApiKey()); // end setReady
            _this.init();
        });
    };
    KakaoCallbackComponent.prototype.init = function () {
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("kakao-callback / init / 시작");
        // 페이지 진입을 기록으로 남깁니다.
        this.logActionPage();
        // 리다이렉트로 전달된 외부 쿼리 스트링 파라미터를 가져옵니다.
        this.getQueryString();
    }; // end init
    KakaoCallbackComponent.prototype.logActionPage = function () {
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("kakao-callback / logActionPage / 시작");
        // 페이지 진입을 기록으로 남깁니다.
        this.myLoggerService.logActionPage(
        // apiKey:string
        this.myEventWatchTowerService.getApiKey(), 
        // pageType:string
        this.myLoggerService.pageTypeLoginKakao).then(function (myResponse) {
            // 로그 등록 결과를 확인해볼 수 있습니다.
            if (isDebug)
                console.log("kakao-callback / logActionPage / myResponse : ", myResponse);
        });
    };
    KakaoCallbackComponent.prototype.getQueryString = function () {
        var _this = this;
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("kakao-callback / getQueryString / 시작");
        // 리다이렉트로 전달된 외부 쿼리 스트링 파라미터를 가져옵니다.
        this.subscription = this.activatedRoute.queryParams.subscribe(function (param) {
            if (isDebug)
                console.log("kakao-callback / getQueryString / param : ", param);
            _this.code = param['code'];
            if (null != _this.code && "" != _this.code) {
                if (isDebug)
                    console.log("kakao-callback / getQueryString / this.code : ", _this.code);
                _this.getKakaoToken(_this.code);
            }
        }); // end subscribe
    };
    // KAKAO
    // 카카오 로그인 토큰을 가져옵니다.
    KakaoCallbackComponent.prototype.getKakaoToken = function (kakaoCode) {
        var _this = this;
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("kakao-callback / getKakaoToken / 시작");
        if (isDebug)
            console.log("kakao-callback / getKakaoToken / kakaoCode : ", kakaoCode);
        if (null == kakaoCode || "" == kakaoCode) {
            if (isDebug)
                console.log("kakao-callback / getKakaoToken / 중단 / kakaoCode is not valid!");
            // TODO - 에러 로그 등록
            return;
        }
        this.loginService
            .getKakaoToken(kakaoCode)
            .then(function (myResponse) {
            if (isDebug)
                console.log("kakao-callback / getKakaoToken / myResponse : ", myResponse);
            var accessToken = myResponse.getDataProp("access_token");
            var tokenType = myResponse.getDataProp("token_type");
            if (myResponse.isSuccess() &&
                null != accessToken &&
                null != tokenType) {
                if (isDebug)
                    console.log("kakao-callback / getKakaoToken / accessToken : " + accessToken);
                if (isDebug)
                    console.log("kakao-callback / getKakaoToken / tokenType : " + tokenType);
                // 유저 앱등록을 진행합니다.
                _this.getKakaoSignUp(tokenType, accessToken);
            }
            else {
                // 에러 로그 등록
                _this.myLoggerService.logError(
                // apiKey:string
                _this.myEventWatchTowerService.getApiKey(), 
                // errorType:string
                _this.myLoggerService.errorAPIFailed, 
                // errorMsg:string
                "kakao-callback / getKakaoToken / Failed! / kakaoCode : " + kakaoCode);
            }
        });
    };
    // 유저를 카카오 앱 - cafeclass에 등록합니다. 이미 등록되어 있다면 재등록되지 않습니다.
    KakaoCallbackComponent.prototype.getKakaoSignUp = function (kakaoTokenType, kakaoAccessToken) {
        var _this = this;
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("kakao-callback / getKakaoSignUp / 시작");
        this.loginService
            .getKakaoSignUp(kakaoTokenType, kakaoAccessToken)
            .then(function (myResponse) {
            if (isDebug)
                console.log("kakao-callback / getKakaoSignUp / myResponse : ", myResponse);
            var code = +myResponse.getDataProp("code");
            var msg = myResponse.getDataProp("msg");
            if (myResponse.isSuccess() &&
                null != code &&
                null != msg) {
                if (_this.kakaoSignupCodeAlreadyRegisterd === code) {
                    if (isDebug)
                        console.log("kakao-callback / getKakaoSignUp / code : ", code);
                    if (isDebug)
                        console.log("kakao-callback / getKakaoSignUp / msg : ", msg);
                    // 유저 정보를 가져옵니다.
                    _this.getKakaoMe(kakaoTokenType, kakaoAccessToken);
                }
            }
            else {
                // 에러 로그 등록
                _this.myLoggerService.logError(
                // apiKey:string
                _this.myEventWatchTowerService.getApiKey(), 
                // errorType:string
                _this.myLoggerService.errorAPIFailed, 
                // errorMsg:string
                "kakao-callback / getKakaoSignUp / Failed! / kakaoTokenType : " + kakaoTokenType + " / kakaoAccessToken : " + kakaoAccessToken);
            } // end if
        });
    };
    KakaoCallbackComponent.prototype.getKakaoMe = function (kakaoTokenType, kakaoAccessToken) {
        var _this = this;
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("kakao-callback / getKakaoMe / 시작");
        this.loginService
            .getKakaoMe(kakaoTokenType, kakaoAccessToken)
            .then(function (myResponse) {
            if (isDebug)
                console.log("kakao-callback / getKakaoMe / myResponse : ", myResponse);
            var kakaoId = +myResponse.getDataProp("kakao_id");
            if (myResponse.isSuccess() && !(0 < kakaoId)) {
                // 로그인 실패
                // 에러 로그 등록
                _this.myLoggerService.logError(
                // apiKey:string
                _this.myEventWatchTowerService.getApiKey(), 
                // errorType:string
                _this.myLoggerService.errorAPIFailed, 
                // errorMsg:string
                "kakao-callback / getKakaoMe / Failed! / kakaoTokenType : " + kakaoTokenType + " / kakaoAccessToken : " + kakaoAccessToken);
                // 홈으로 리다이렉트
                _this.router.navigate(['/class-center']);
                return;
            }
            // 카카오 플랫폼에서의 로그인 성공!
            if (isDebug)
                console.log("kakao-callback / getKakaoMe / kakao_id : " + kakaoId);
            // 카카오 아이디로 유저 정보를 가져옵니다.
            _this.getUserByKakaoId("" + kakaoId);
        }); // end service
    }; // end method 
    KakaoCallbackComponent.prototype.getUserByKakaoId = function (kakaoId) {
        var _this = this;
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("kakao-callback / getUserByKakaoId / 시작");
        this.userService
            .getUserByKakaoId(kakaoId)
            .then(function (myResponse) {
            if (isDebug)
                console.log("kakao-callback / getUserByKakaoId / myResponse : ", myResponse);
            var user = myResponse.getDataProp("user");
            if (myResponse.isSuccess() && null == user) {
                // 카카오 로그인은 성공. 하지만 유저 정보가 없음.
                // 카카오 유저 정보가 DB에 등록되지 않았음!
                if (isDebug)
                    console.log("kakao-callback / getUserByKakaoId / 중단 / result is not valid!");
                // 에러 로그 등록
                _this.myLoggerService.logError(
                // apiKey:string
                _this.myEventWatchTowerService.getApiKey(), 
                // errorType:string
                _this.myLoggerService.errorAPIFailed, 
                // errorMsg:string
                "kakao-callback / getKakaoMe / Failed! / kakaoId : " + kakaoId);
                return;
            }
            else if (null != user ||
                null == user["gender"] ||
                "" == user["gender"] ||
                null == user["mobile"] ||
                "" == user["mobile"]) {
                // 카카오 로그인은 성공. 카카오 프로필에서 가져온 정보로 유저 등록됨. 
                // 하지만 추가 정보 필요. 
                // 회원 가입창으로 이동.
                if (isDebug)
                    console.log("kakao-callback / getUserByKakaoId / 중단 / 회원 가입창으로 이동.");
                _this.router.navigate(['/login/signup/kakao', myResponse.getDataProp("kakao_id")]);
                return;
            }
            else {
                // 카카오 로그인 성공. 등록된 유저 정보가 문제 없음. 
                // 로그인이 성공했으므로, 서버에 해당 유저의 로그인 쿠키를 만들어야 함.
                if (isDebug)
                    console.log("kakao-callback / getUserByKakaoId / 로그인 성공!, 로그인 쿠키 만듦");
                // api key 필요!
                _this.userService
                    .confirmUserKakao(
                // apiKey:string
                _this.myEventWatchTowerService.getApiKey(), 
                // kakaoId:string
                myResponse.getDataProp("kakao_id")).then(function (result) {
                    if (null == result || null == result.success || !result.success) {
                        // kakaoid로 쿠키 인증 실패. 
                        if (isDebug)
                            console.log("kakao-callback / getUserByKakaoId / 중단 / kakaoid로 쿠키 인증 실패. 홈으로 이동.");
                        // 에러 로그 등록
                        _this.myLoggerService.logError(
                        // apiKey:string
                        _this.myEventWatchTowerService.getApiKey(), 
                        // errorType:string
                        _this.myLoggerService.errorAPIFailed, 
                        // errorMsg:string
                        "kakao-callback / getUserByKakaoId / Failed! / kakaoId : " + kakaoId);
                        // 홈으로 이동.
                        _this.router.navigate(['/class-center']);
                        return;
                    }
                    // 쿠키 인증 성공!
                    // 로그인 직전 페이지로 리다이렉트. 
                    // 돌아갈 주소가 없다면, 홈으로 이동.
                    if (isDebug)
                        console.log("kakao-callback / getUserByKakaoId / 쿠키 인증 성공! 홈으로 이동.");
                    _this.router.navigate(['/class-center']);
                }); // end userService
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
        __metadata('design:paramtypes', [login_service_1.LoginService, my_event_watchtower_service_1.MyEventWatchTowerService, user_service_1.UserService, my_logger_service_1.MyLoggerService, my_checker_service_1.MyCheckerService, router_1.ActivatedRoute, router_1.Router])
    ], KakaoCallbackComponent);
    return KakaoCallbackComponent;
}());
exports.KakaoCallbackComponent = KakaoCallbackComponent; // end class
//# sourceMappingURL=kakao-callback.component.js.map