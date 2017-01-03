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
var teacher_service_1 = require('../../teachers/service/teacher.service');
var my_event_watchtower_service_1 = require('../../util/service/my-event-watchtower.service');
var my_cookie_1 = require('../../util/http/my-cookie');
var user_1 = require('../../users/model/user');
var KakaoCallbackComponent = (function () {
    function KakaoCallbackComponent(loginService, watchTower, userService, teacherService, myLoggerService, myCheckerService, activatedRoute, router) {
        this.loginService = loginService;
        this.watchTower = watchTower;
        this.userService = userService;
        this.teacherService = teacherService;
        this.myLoggerService = myLoggerService;
        this.myCheckerService = myCheckerService;
        this.activatedRoute = activatedRoute;
        this.router = router;
        this.redirectUrl = "/class-center";
        this.kakaoSignupCodeAlreadyRegisterd = -102;
        this.isAdmin = false;
        this.errorMsgArr = [];
        this.myCookie = new my_cookie_1.MyCookie();
    } // end function
    KakaoCallbackComponent.prototype.isDebug = function () {
        return this.watchTower.isDebug();
    };
    KakaoCallbackComponent.prototype.ngAfterViewInit = function () {
        // 자식 뷰가 모두 완료된 이후에 초기화를 진행.
        if (this.isDebug())
            console.log("kakao-callback / ngAfterViewInit");
        this.asyncViewPack();
    };
    KakaoCallbackComponent.prototype.ngOnDestroy = function () {
        // prevent memory leak by unsubscribing
        this.subscription.unsubscribe();
    };
    KakaoCallbackComponent.prototype.asyncViewPack = function () {
        var _this = this;
        if (this.isDebug())
            console.log("kakao-callback / asyncViewPack / 시작");
        // 이미 View 기본정보가 들어왔다면 바로 가져온다.
        if (this.watchTower.getIsViewPackReady()) {
            if (this.isDebug())
                console.log("kakao-callback / asyncViewPack / isViewPackReady : ", true);
            this.init();
        } // end if
        // View에 필요한 기본 정보가 비동기로 들어올 경우, 처리.
        this.watchTower.isViewPackReady$.subscribe(function (isViewPackReady) {
            if (_this.isDebug())
                console.log("kakao-callback / asyncViewPack / subscribe / isViewPackReady : ", isViewPackReady);
            _this.init();
        }); // end subscribe    
    };
    KakaoCallbackComponent.prototype.setViewPack = function () {
        this.isAdmin = this.watchTower.getIsAdminServer();
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
    KakaoCallbackComponent.prototype.init = function () {
        if (this.isDebug())
            console.log("kakao-callback / init / 시작");
        // 뷰에 필요한 공통 정보를 설정합니다.
        this.setViewPack();
        // 페이지 진입을 기록으로 남깁니다.
        this.logActionPage();
        // 리다이렉트로 전달된 외부 쿼리 스트링 파라미터를 가져옵니다.
        this.getQueryString();
        // 로그인, 회원 등록의 경우, 최상단 메뉴를 가립니다.
        this.watchTower.announceToggleTopMenu(false);
    }; // end init
    KakaoCallbackComponent.prototype.logActionPage = function () {
        var _this = this;
        if (this.isDebug())
            console.log("kakao-callback / logActionPage / 시작");
        // 페이지 진입을 기록으로 남깁니다.
        this.myLoggerService.logActionPage(
        // apiKey:string
        this.watchTower.getApiKey(), 
        // pageType:string
        this.myLoggerService.pageTypeLoginKakao).then(function (myResponse) {
            // 로그 등록 결과를 확인해볼 수 있습니다.
            if (myResponse.isFailed() && null != myResponse.error) {
                if (null != myResponse.error) {
                    _this.watchTower.announceErrorMsgArr([myResponse.error]);
                }
                // 에러 로그 등록
                _this.myLoggerService.logError(
                // apiKey:string
                _this.watchTower.getApiKey(), 
                // errorType:string
                _this.myLoggerService.errorAPIFailed, 
                // errorMsg:string
                "kakao-callback / logActionPage"); // end logger      
            } // end if
        }); // end service
    }; // end method 
    KakaoCallbackComponent.prototype.getQueryString = function () {
        var _this = this;
        if (this.isDebug())
            console.log("kakao-callback / getQueryString / 시작");
        // 리다이렉트로 전달된 외부 쿼리 스트링 파라미터를 가져옵니다.
        this.subscription = this.activatedRoute.queryParams.subscribe(function (param) {
            if (_this.isDebug())
                console.log("kakao-callback / getQueryString / param : ", param);
            _this.code = param['code'];
            if (null != _this.code && "" != _this.code) {
                if (_this.isDebug())
                    console.log("kakao-callback / getQueryString / this.code : ", _this.code);
                _this.getKakaoToken(_this.code);
            }
        }); // end subscribe
    };
    // KAKAO
    // 카카오 로그인 토큰을 가져옵니다.
    KakaoCallbackComponent.prototype.getKakaoToken = function (kakaoCode) {
        var _this = this;
        if (this.isDebug())
            console.log("kakao-callback / getKakaoToken / 시작");
        if (this.isDebug())
            console.log("kakao-callback / getKakaoToken / kakaoCode : ", kakaoCode);
        if (null == kakaoCode || "" == kakaoCode) {
            if (this.isDebug())
                console.log("kakao-callback / getKakaoToken / 중단 / kakaoCode is not valid!");
            this.myLoggerService.logError(
            // apiKey:string
            this.watchTower.getApiKey(), 
            // errorType:string
            this.myLoggerService.errorTypeNotValidValue, 
            // errorMsg:string
            "kakao-callback / getKakaoToken / kakaoCode is not valid! : " + kakaoCode);
            return;
        }
        this.loginService
            .getKakaoToken(kakaoCode)
            .then(function (myResponse) {
            if (_this.isDebug())
                console.log("kakao-callback / getKakaoToken / myResponse : ", myResponse);
            var accessToken = myResponse.getDataProp("access_token");
            var tokenType = myResponse.getDataProp("token_type");
            if (_this.isDebug())
                console.log("kakao-callback / getKakaoToken / accessToken : " + accessToken);
            if (_this.isDebug())
                console.log("kakao-callback / getKakaoToken / tokenType : " + tokenType);
            if (myResponse.isSuccess() &&
                null != accessToken &&
                null != tokenType) {
                if (_this.isDebug())
                    console.log("kakao-callback / getKakaoToken / \uC720\uC800 \uC571\uB4F1\uB85D\uC744 \uC9C4\uD589\uD569\uB2C8\uB2E4.");
                _this.getKakaoSignUp(tokenType, accessToken);
            }
            else if (myResponse.isFailed()) {
                if (null != myResponse.error) {
                    _this.watchTower.announceErrorMsgArr([myResponse.error]);
                }
                // 에러 로그 등록
                _this.myLoggerService.logError(
                // apiKey:string
                _this.watchTower.getApiKey(), 
                // errorType:string
                _this.myLoggerService.errorAPIFailed, 
                // errorMsg:string
                "kakao-callback / getUserByKakaoId / kakaoCode : " + kakaoCode); // end logger      
            } // end if       
        }); // end service
    }; // end method
    // 유저를 카카오 앱 - cafeclass에 등록합니다. 이미 등록되어 있다면 재등록되지 않습니다.
    KakaoCallbackComponent.prototype.getKakaoSignUp = function (kakaoTokenType, kakaoAccessToken) {
        var _this = this;
        if (this.isDebug())
            console.log("kakao-callback / getKakaoSignUp / 시작");
        this.loginService
            .getKakaoSignUp(kakaoTokenType, kakaoAccessToken)
            .then(function (myResponse) {
            if (_this.isDebug())
                console.log("kakao-callback / getKakaoSignUp / myResponse : ", myResponse);
            var code = +myResponse.getDataProp("code");
            var msg = myResponse.getDataProp("msg");
            if (myResponse.isSuccess() &&
                null != code &&
                null != msg) {
                if (_this.kakaoSignupCodeAlreadyRegisterd === code) {
                    if (_this.isDebug())
                        console.log("kakao-callback / getKakaoSignUp / code : ", code);
                    if (_this.isDebug())
                        console.log("kakao-callback / getKakaoSignUp / msg : ", msg);
                    // 유저 정보를 가져옵니다.
                    _this.getKakaoMe(kakaoTokenType, kakaoAccessToken);
                }
            }
            else if (myResponse.isFailed()) {
                if (null != myResponse.error) {
                    _this.watchTower.announceErrorMsgArr([myResponse.error]);
                }
                // 에러 로그 등록
                _this.myLoggerService.logError(
                // apiKey:string
                _this.watchTower.getApiKey(), 
                // errorType:string
                _this.myLoggerService.errorAPIFailed, 
                // errorMsg:string
                "kakao-callback / getKakaoSignUp / kakaoTokenType : " + kakaoTokenType + " / kakaoAccessToken : " + kakaoAccessToken); // end logger      
            } // end if        
        }); // end service
    }; // end method
    KakaoCallbackComponent.prototype.logError = function (errorType, errMsg) {
        var _this = this;
        if (this.isDebug())
            console.log("kakao-callback / logError / 시작");
        if (null == errorType) {
            return;
        }
        if (null == errMsg) {
            return;
        }
        // 에러 로그 등록
        this.myLoggerService.logError(
        // apiKey:string
        this.watchTower.getApiKey(), 
        // errorType:string
        errorType, 
        // errorMsg:string
        errMsg).then(function (myResponse) {
            if (_this.isDebug())
                console.log("kakao-callback / logError / myResponse : ", myResponse);
        }); // end logError
    };
    KakaoCallbackComponent.prototype.getKakaoMe = function (kakaoTokenType, kakaoAccessToken) {
        var _this = this;
        if (this.isDebug())
            console.log("kakao-callback / getKakaoMe / 시작");
        this.loginService
            .getKakaoMe(kakaoTokenType, kakaoAccessToken)
            .then(function (myResponse) {
            if (_this.isDebug())
                console.log("kakao-callback / getKakaoMe / myResponse : ", myResponse);
            var kakaoId = +myResponse.digDataProp(["me", "kakao_id"]);
            if (myResponse.isSuccess() && !(0 < kakaoId)) {
                // 로그인 실패
                // 에러 로그 등록
                _this.myLoggerService.logError(
                // apiKey:string
                _this.watchTower.getApiKey(), 
                // errorType:string
                _this.myLoggerService.errorAPIFailed, 
                // errorMsg:string
                "kakao-callback / getKakaoMe / Failed! / kakaoTokenType : " + kakaoTokenType + " / kakaoAccessToken : " + kakaoAccessToken);
                // 홈으로 리다이렉트
                _this.router.navigate(['/class-center']);
                return;
            }
            else if (myResponse.isSuccess()) {
                // 카카오 플랫폼에서의 로그인 성공!
                if (_this.isDebug())
                    console.log("kakao-callback / getKakaoMe / kakao_id : " + kakaoId);
                // 카카오 아이디로 유저 정보를 가져옵니다.
                _this.getUserByKakaoId("" + kakaoId);
            }
            else if (myResponse.isFailed()) {
                if (null != myResponse.error) {
                    _this.watchTower.announceErrorMsgArr([myResponse.error]);
                }
                // 에러 로그 등록
                _this.myLoggerService.logError(
                // apiKey:string
                _this.watchTower.getApiKey(), 
                // errorType:string
                _this.myLoggerService.errorAPIFailed, 
                // errorMsg:string
                "kakao-callback / getKakaoMe / kakaoTokenType : " + kakaoTokenType + " / kakaoAccessToken : " + kakaoAccessToken); // end logger      
            } // end if
        }); // end service
    }; // end method 
    KakaoCallbackComponent.prototype.getUserByKakaoId = function (kakaoId) {
        var _this = this;
        if (this.isDebug())
            console.log("kakao-callback / getUserByKakaoId / 시작");
        this.userService
            .getUserByKakaoId(kakaoId)
            .then(function (myResponse) {
            if (_this.isDebug())
                console.log("kakao-callback / getUserByKakaoId / myResponse : ", myResponse);
            var user = myResponse.getDataProp("user");
            if (myResponse.isSuccess() && null == user) {
                // 카카오 로그인은 성공. 하지만 유저 정보가 없음.
                // 카카오 유저 정보가 DB에 등록되지 않았음!
                if (_this.isDebug())
                    console.log("kakao-callback / getUserByKakaoId / 중단 / result is not valid!");
                // 에러 로그 등록
                _this.myLoggerService.logError(
                // apiKey:string
                _this.watchTower.getApiKey(), 
                // errorType:string
                _this.myLoggerService.errorAPIFailed, 
                // errorMsg:string
                "kakao-callback / getKakaoMe / Failed! / kakaoId : " + kakaoId);
                return;
            }
            else if (null != user && (null == user["mobile"] || "" == user["mobile"])) {
                // 카카오 로그인은 성공. 카카오 프로필에서 가져온 정보로 유저 등록됨. 
                // 하지만 추가 정보 필요. 
                // 회원 가입창으로 이동.
                if (_this.isDebug())
                    console.log("kakao-callback / getUserByKakaoId / 중단 / 회원 가입창으로 이동.");
                _this.router.navigate(['/login/signup/kakao', myResponse.getDataProp("kakao_id")]);
                return;
            }
            else if (myResponse.isSuccess()) {
                // 카카오 로그인 성공. 등록된 유저 정보가 문제 없음. 
                // 로그인이 성공했으므로, 서버에 해당 유저의 로그인 쿠키를 만들어야 함.
                if (_this.isDebug())
                    console.log("kakao-callback / getUserByKakaoId / 로그인 성공!, 로그인 쿠키 만듦");
                // 가져온 유저 정보를 전파.
                var userFromDB = myResponse.getDataProp("user");
                if (null != userFromDB) {
                    var user_2 = new user_1.User().setJSON(userFromDB);
                    if (_this.isDebug())
                        console.log("kakao-callback / getUserByKakaoId / user : ", user_2);
                    // 회원 로그인 정보를 가져왔다면, 가져온 로그인 정보를 다른 컴포넌트들에게도 알려줍니다.
                    _this.watchTower.announceLogin(user_2);
                    if (user_2.isTeacher()) {
                        _this.watchTower.announceLoginTeacher(user_2.getTeacher());
                    } // end if
                } // end if 
                // api key 필요!
                _this.userService
                    .confirmUserKakao(
                // apiKey:string
                _this.watchTower.getApiKey(), 
                // kakaoId:string
                myResponse.getDataProp("kakao_id")).then(function (myResponse) {
                    if (_this.isDebug())
                        console.log("kakao-callback / getUserByKakaoId / myResponse : ", myResponse);
                    if (myResponse.isSuccess()) {
                        // 쿠키 인증 성공!
                        if (_this.isDebug())
                            console.log("kakao-callback / getUserByKakaoId / 쿠키 인증 성공! 홈으로 이동.");
                        // 로그인 직전 페이지로 리다이렉트. 
                        // 돌아갈 주소가 없다면, 홈으로 이동.
                        var redirectUrl = _this.myCookie.getCookie("redirectUrl");
                        if (null == redirectUrl || "" == redirectUrl) {
                            redirectUrl = '/class-center';
                        }
                        if (_this.isDebug())
                            console.log("kakao-callback / getUserByKakaoId / redirectUrl : ", redirectUrl);
                        _this.router.navigate([redirectUrl]);
                    }
                    else {
                        // kakaoid로 쿠키 인증 실패. 
                        if (_this.isDebug())
                            console.log("kakao-callback / getUserByKakaoId / 중단 / kakaoid로 쿠키 인증 실패. 홈으로 이동.");
                        // 에러 로그 등록
                        _this.myLoggerService.logError(
                        // apiKey:string
                        _this.watchTower.getApiKey(), 
                        // errorType:string
                        _this.myLoggerService.errorAPIFailed, 
                        // errorMsg:string
                        "kakao-callback / getUserByKakaoId / Failed! / kakaoId : " + kakaoId);
                        // 홈으로 이동.
                        _this.router.navigate(['/class-center']);
                    }
                }); // end userService
            }
            else if (myResponse.isFailed()) {
                if (null != myResponse.error) {
                    _this.watchTower.announceErrorMsgArr([myResponse.error]);
                }
                // 에러 로그 등록
                _this.myLoggerService.logError(
                // apiKey:string
                _this.watchTower.getApiKey(), 
                // errorType:string
                _this.myLoggerService.errorAPIFailed, 
                // errorMsg:string
                "kakao-callback / getUserByKakaoId / kakaoId : " + kakaoId); // end logger      
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
        __metadata('design:paramtypes', [login_service_1.LoginService, my_event_watchtower_service_1.MyEventWatchTowerService, user_service_1.UserService, teacher_service_1.TeacherService, my_logger_service_1.MyLoggerService, my_checker_service_1.MyCheckerService, router_1.ActivatedRoute, router_1.Router])
    ], KakaoCallbackComponent);
    return KakaoCallbackComponent;
}());
exports.KakaoCallbackComponent = KakaoCallbackComponent; // end class
//# sourceMappingURL=kakao-callback.component.js.map