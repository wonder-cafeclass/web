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
var my_event_watchtower_service_1 = require('../../util/service/my-event-watchtower.service');
var NaverCallbackComponent = (function () {
    function NaverCallbackComponent(loginService, watchTower, myLoggerService, myCheckerService, userService, activatedRoute, router) {
        // Do something...
        this.loginService = loginService;
        this.watchTower = watchTower;
        this.myLoggerService = myLoggerService;
        this.myCheckerService = myCheckerService;
        this.userService = userService;
        this.activatedRoute = activatedRoute;
        this.router = router;
        this.redirectUrl = "/class-center";
        this.isValidState = false;
        this.isAdmin = false;
        this.errorMsgArr = [];
    } // end function
    NaverCallbackComponent.prototype.ngOnInit = function () {
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("\nnaver-callback / ngOnInit / init");
    }; // end function
    NaverCallbackComponent.prototype.ngAfterViewInit = function () {
        // 자식 뷰가 모두 완료된 이후에 초기화를 진행.
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("\nnaver-callback / ngAfterViewInit");
        this.asyncViewPack();
    };
    NaverCallbackComponent.prototype.ngOnDestroy = function () {
        // prevent memory leak by unsubscribing
        this.subscription.unsubscribe();
    };
    NaverCallbackComponent.prototype.asyncViewPack = function () {
        var _this = this;
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("\nnaver-callback / asyncViewPack / 시작");
        // 이미 View 기본정보가 들어왔다면 바로 가져온다. 
        if (this.watchTower.getIsViewPackReady()) {
            if (isDebug)
                console.log("naver-callback / asyncViewPack / isViewPackReady : ", true);
            this.init();
        } // end if
        // View에 필요한 기본 정보가 비동기로 들어올 경우, 처리.
        this.watchTower.isViewPackReady$.subscribe(function (isViewPackReady) {
            if (isDebug)
                console.log("naver-callback / asyncViewPack / subscribe / isViewPackReady : ", isViewPackReady);
            _this.init();
        }); // end subscribe    
    };
    NaverCallbackComponent.prototype.setViewPack = function () {
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
    NaverCallbackComponent.prototype.init = function () {
        // 뷰에 필요한 공통 정보를 설정합니다.
        this.setViewPack();
        this.getQueryString();
    };
    NaverCallbackComponent.prototype.logActionPage = function () {
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("\nnaver-callback / logActionPage / 시작");
        // 페이지 진입을 기록으로 남깁니다.
        this.myLoggerService.logActionPage(
        // apiKey:string
        this.watchTower.getApiKey(), 
        // pageType:string
        this.myLoggerService.pageTypeLoginNaver).then(function (myResponse) {
            // 로그 등록 결과를 확인해볼 수 있습니다.
            if (isDebug)
                console.log("naver-callback / logActionPage / myResponse : ", myResponse);
        });
    };
    NaverCallbackComponent.prototype.getQueryString = function () {
        var _this = this;
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("\nnaver-callback / getQueryString / 시작");
        this.subscription = this.activatedRoute.queryParams.subscribe(function (param) {
            if (isDebug)
                console.log("naver-callback / getQueryString / param : ", param);
            _this.code = param['code'];
            _this.state = param['state'];
            if (isDebug)
                console.log("naver-callback / getQueryString / this.code : ", _this.code);
            if (isDebug)
                console.log("naver-callback / getQueryString / this.state : ", _this.state);
            if (null != _this.code &&
                "" != _this.code &&
                null != _this.state &&
                "" != _this.state) {
                _this.getNaverState(_this.state, _this.code);
            }
            else {
                // 에러 로그 등록
                _this.myLoggerService.logError(
                // apiKey:string
                _this.watchTower.getApiKey(), 
                // errorType:string
                _this.myLoggerService.errorAPIFailed, 
                // errorMsg:string
                "naver-callback / getQueryString / Failed! / this.code : " + _this.code + " / this.state : " + _this.state);
            } // end if
        }); // end subscribe
    };
    NaverCallbackComponent.prototype.getNaverState = function (state, code) {
        var _this = this;
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("\nnaver-callback / getNaverState / init");
        if (null == state || "" == state) {
            return;
        }
        if (null == code || "" == code) {
            return;
        }
        if (isDebug)
            console.log("naver-callback / getState / state : ", state);
        if (isDebug)
            console.log("naver-callback / getState / code : ", code);
        this.loginService
            .getNaverState(state)
            .then(function (myResponse) {
            if (isDebug)
                console.log("naver-callback / getState / getNaverState / myResponse : ", myResponse);
            if (myResponse.isSuccess()) {
                _this.isValidState = myResponse.getDataProp("is_valid_state");
            }
            else {
                // 에러 로그 등록
                _this.myLoggerService.logError(
                // apiKey:string
                _this.watchTower.getApiKey(), 
                // errorType:string
                _this.myLoggerService.errorAPIFailed, 
                // errorMsg:string
                "naver-callback / getNaverState / Failed! / state : " + state);
                return;
            }
            if (isDebug)
                console.log("naver-callback / getState / getNaverState / this.isValidState : ", _this.isValidState);
            // Session에 저장된 state와 비교합니다.
            if (_this.isValidState) {
                // 1. state가 정상적일 경우, 다음 단계를 진행
                if (isDebug)
                    console.log("naver-callback / getNaverState / state가 정상적일 경우, 다음 단계를 진행");
                _this.getNaverAccess(code);
            }
            else {
                // 2. state가 다를 경우, 사용자에게 메시지 노출. '비정상적인 접근입니다.'. 메시지 확인 뒤, 로그인 홈으로 이동.
                // - 상황 정보를 로그로 남김. ex) '비정상 로그인 접근'
                if (isDebug)
                    console.log("naver-callback / getNaverState / state가 다를 경우, 사용자에게 메시지 노출. 메시지 확인 뒤, 로그인 홈으로 이동");
                // 에러 로그 등록
                _this.myLoggerService.logError(
                // apiKey:string
                _this.watchTower.getApiKey(), 
                // errorType:string
                _this.myLoggerService.errorAPIFailed, 
                // errorMsg:string
                "naver-callback / getNaverState / Failed! / this.isValidState : " + _this.isValidState); // end logError
            }
        });
    };
    // @ Desc : Naver REST API에 접근하기 위한 접근 토큰(Access Token)을 받아옵니다. 
    NaverCallbackComponent.prototype.getNaverAccess = function (code) {
        var _this = this;
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("\nnaver-callback / getNaverAccess / init");
        if (null == code || "" == code) {
            return;
        }
        this.loginService
            .getNaverAccess(code)
            .then(function (myResponse) {
            if (isDebug)
                console.log("naver-callback / getNaverAccess / myResponse : ", myResponse);
            var accessToken = myResponse.digDataProp(["result", "access_token"]);
            var tokenType = myResponse.digDataProp(["result", "token_type"]);
            if (isDebug)
                console.log("naver-callback / getNaverAccess / accessToken : ", accessToken);
            if (isDebug)
                console.log("naver-callback / getNaverAccess / tokenType : ", tokenType);
            if (myResponse.isSuccess() &&
                null != accessToken &&
                null != tokenType) {
                _this.getNaverMe();
            }
            else {
                if (isDebug)
                    console.log("naver-callback / getNaverAccess / 에러 로그 등록");
                if (null != myResponse.error && "" != myResponse.error) {
                    // 에러 내용은 화면에 표시한다.
                    _this.watchTower.announceErrorMsgArr([myResponse.error]);
                }
                // 에러 로그 등록
                _this.myLoggerService.logError(
                // apiKey:string
                _this.watchTower.getApiKey(), 
                // errorType:string
                _this.myLoggerService.errorAPIFailed, 
                // errorMsg:string
                "naver-callback / getNaverAccess / Failed! / access_token : " + accessToken + " / token_type : " + tokenType); // end logError
            } // end if
        }); // end method
    }; // end method
    // @ Desc : Naver REST API로 회원정보를 가져옵니다.
    NaverCallbackComponent.prototype.getNaverMe = function () {
        var _this = this;
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("\nnaver-callback / getNaverMe / init");
        this.loginService
            .getNaverMe()
            .then(function (myResponse) {
            if (isDebug)
                console.log("naver-callback / getNaverMe / myResponse : ", myResponse);
            if (myResponse.isFailed() || null == myResponse.hasNotDataProp("naver_id")) {
                // 네이버에서 유저 정보를 가져오는데 실패했습니다. 로그를 기록, 홈으로 이동합니다.
                if (isDebug)
                    console.log("naver-callback / getNaverMe / 네이버에서 유저 정보를 가져오는데 실패했습니다. 로그를 기록, 홈으로 이동합니다.");
                if (null != myResponse.error && "" != myResponse.error) {
                    // 에러 내용은 화면에 표시한다.
                    _this.watchTower.announceErrorMsgArr([myResponse.error]);
                }
                // 에러 로그 등록
                _this.myLoggerService.logError(
                // apiKey:string
                _this.watchTower.getApiKey(), 
                // errorType:string
                _this.myLoggerService.errorAPIFailed, 
                // errorMsg:string
                "naver-callback / getNaverMe / Failed!"); // end logError
                // 홈으로 리다이렉트
                _this.router.navigate([_this.redirectUrl]);
                return;
            }
            // 네이버 로그인 성공!
            // 로그인한 유저 정보를 가져오는데 성공했습니다!
            var user = myResponse.digDataProp(["me"]);
            var naverId = myResponse.digDataProp(["me", "naver_id"]);
            if (isDebug)
                console.log("naver-callback / getNaverMe / user : ", user);
            if (isDebug)
                console.log("naver-callback / getNaverMe / naverId : ", naverId);
            if (myResponse.isSuccess() &&
                (null == user.gender ||
                    "" === user.gender ||
                    null == user.mobile ||
                    "" === user.mobile)) {
                // 페이스북 로그인은 성공. 페이스북 유저 프로필에서 가져온 정보로 유저 등록됨. 
                // 하지만 추가 정보 필요. 
                // 회원 가입창으로 이동.
                if (isDebug)
                    console.log("naver-callback / 네이버 로그인은 성공. 네이버 유저 프로필에서 가져온 정보로 유저 등록됨.회원 가입창으로 이동.");
                _this.router.navigate(['/login/signup/naver', naverId]);
            }
            else {
                // 2. mobile, gender가 있다면 정상 등록된 유저. 로그인 창으로 리다이렉트.
                // this.router.navigate([this.redirectUrl]);
                // 페이스북 로그인 성공. 등록된 유저 정보가 문제 없음. 
                // 로그인이 성공했으므로, 서버에 해당 유저의 로그인 쿠키를 만들어야 함.
                if (isDebug)
                    console.log("naver-callback / 네이버 로그인은 성공. 로그인이 성공했으므로, 서버에 해당 유저의 로그인 쿠키를 만들어야 함.");
                _this.confirmUserNaver(naverId);
            } // end if
        }); // end service
    }; // end method  
    NaverCallbackComponent.prototype.confirmUserNaver = function (naverId) {
        var _this = this;
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("\nnaver-callback / confirmUserNaver / init");
        this.userService
            .confirmUserNaver(this.myCheckerService.getAPIKey(), naverId)
            .then(function (myResponse) {
            if (isDebug)
                console.log("naver-callback / confirmUserNaver / myResponse : ", myResponse);
            if (myResponse.isFailed()) {
                // naver id로 쿠키 인증 실패. 홈으로 이동.
                if (isDebug)
                    console.log("naver-callback / confirmUserNaver / naver id로 쿠키 인증 실패. 홈으로 이동.");
                _this.router.navigate([_this.redirectUrl]);
                // 에러 로그 등록
                _this.myLoggerService.logError(
                // apiKey:string
                _this.watchTower.getApiKey(), 
                // errorType:string
                _this.myLoggerService.errorAPIFailed, 
                // errorMsg:string
                "naver-callback / confirmUserNaver / Failed!"); // end logError              
                return;
            }
            // 쿠키 인증 성공!
            // 로그인 직전 페이지로 리다이렉트. 
            // 돌아갈 주소가 없다면, 홈으로 이동.
            if (isDebug)
                console.log("naver-callback / confirmUserNaver / naver id로 쿠키 인증 성공!. 로그인 직전 페이지로 리다이렉트.");
            _this.router.navigate([_this.redirectUrl]);
        }); // end userService    
    }; // end method
    NaverCallbackComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'naver-callback',
            templateUrl: 'naver-callback.component.html',
            styleUrls: ['naver-callback.component.css']
        }), 
        __metadata('design:paramtypes', [login_service_1.LoginService, my_event_watchtower_service_1.MyEventWatchTowerService, my_logger_service_1.MyLoggerService, my_checker_service_1.MyCheckerService, user_service_1.UserService, router_1.ActivatedRoute, router_1.Router])
    ], NaverCallbackComponent);
    return NaverCallbackComponent;
}());
exports.NaverCallbackComponent = NaverCallbackComponent; // end class
//# sourceMappingURL=naver-callback.component.js.map