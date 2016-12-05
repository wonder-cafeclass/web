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
var my_event_watchtower_service_1 = require('../../util/service/my-event-watchtower.service');
var SignupSelectComponent = (function () {
    function SignupSelectComponent(loginService, myLoggerService, myCheckerService, myEventWatchTowerService, router) {
        this.loginService = loginService;
        this.myLoggerService = myLoggerService;
        this.myCheckerService = myCheckerService;
        this.myEventWatchTowerService = myEventWatchTowerService;
        this.router = router;
        this.isAdmin = false;
        this.errorMsgArr = [];
    }
    SignupSelectComponent.prototype.ngOnInit = function () {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("signup-select / ngOnInit / 시작");
        // 운영 서버인지 서비스 서버인지 판단하는 플래그값 가져옴.
        this.setIsAdmin();
        // my-checker.service의 apikey 가져옴. 
        this.setMyCheckerReady();
        /*
        // 운영 서버인지 서비스 서버인지 판단하는 플래그값 가져옴.
        this.myEventWatchTowerService.isAdmin$.subscribe(
          (isAdmin:boolean) => {
          this.isAdmin = isAdmin;
          this.init();
        });
        */
    }; // end ngOnInit
    SignupSelectComponent.prototype.setIsAdmin = function () {
        var _this = this;
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("signup-select / setIsAdmin / 시작");
        // 운영 서버인지 서비스 서버인지 판단하는 플래그값 가져옴.
        this.myEventWatchTowerService.isAdmin$.subscribe(function (isAdmin) {
            if (isDebug)
                console.log("signup-select / setIsAdmin / isAdmin : ", isAdmin);
            _this.isAdmin = isAdmin;
        });
    };
    SignupSelectComponent.prototype.setMyCheckerReady = function () {
        var _this = this;
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("signup-select / setMyCheckerReady / 시작");
        this.myEventWatchTowerService.myCheckerServiceReady$.subscribe(function (isReady) {
            if (isDebug)
                console.log("signup-select / setMyCheckerReady / isReady : ", isReady);
            if (!isReady) {
                // 에러 로그 등록
                _this.myLoggerService.logError(
                // apiKey:string
                _this.myEventWatchTowerService.getApiKey(), 
                // errorType:string
                _this.myLoggerService.errorTypeNotValidValue, 
                // errorMsg:string
                "login / setMyCheckerReady / Failed! / isReady : " + isReady);
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
    SignupSelectComponent.prototype.init = function () {
        var _this = this;
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("signup-select / init / 시작");
        // 페이지 진입을 기록으로 남깁니다.
        this.myLoggerService.logActionPage(
        // apiKey:string
        this.myEventWatchTowerService.getApiKey(), 
        // pageType:string
        this.myLoggerService.pageTypeSignupSelect);
        // 각 플랫폼 별로 로그인 할 수 있는 주소들을 가져옵니다.
        // 1. kakao
        this.loginService
            .getKakaoAuthUrl()
            .then(function (output) {
            if (isDebug)
                console.log("signup-select / getKakaoAuthUrl / 시작");
            if (isDebug)
                console.log("signup-select / getKakaoAuthUrl / output : ", output);
            if (null != output &&
                null != output["auth_url"] &&
                "" != output["auth_url"]) {
                _this.kakaoAuthUrl = output["auth_url"];
                if (isDebug)
                    console.log("signup-select / getKakaoAuthUrl / this.kakaoAuthUrl : ", _this.kakaoAuthUrl);
            }
            else {
                // 에러 상황. 
                // 에러 원인에 대한 로그를 화면에 표시!
                _this.errorMsgArr.push(output);
                _this.myEventWatchTowerService.announceErrorMsgArr(_this.errorMsgArr);
            } // end if
        });
        // 2. naver
        this.loginService
            .getNaverAuthUrl()
            .then(function (output) {
            if (isDebug)
                console.log("signup-select / getNaverAuthUrl / 시작");
            if (isDebug)
                console.log("signup-select / getNaverAuthUrl / output : ", output);
            if (null != output &&
                null != output["auth_url"] &&
                "" != output["auth_url"]) {
                _this.naverAuthUrl = output["auth_url"];
                if (isDebug)
                    console.log("signup-select / getNaverAuthUrl / this.naverAuthUrl : ", _this.naverAuthUrl);
            }
            else {
                // 에러 상황. 
                // 에러 원인에 대한 로그를 화면에 표시!
                _this.errorMsgArr.push(output);
                _this.myEventWatchTowerService.announceErrorMsgArr(_this.errorMsgArr);
            } // end if
            // this.naverAuthUrl = naverAuthUrl;
        });
        // 3. facebook
        this.loginService
            .getFacebookAuthUrl()
            .then(function (output) {
            if (isDebug)
                console.log("signup-select / getFacebookAuthUrl / 시작");
            if (isDebug)
                console.log("signup-select / getFacebookAuthUrl / output : ", output);
            if (null != output &&
                null != output["auth_url"] &&
                "" != output["auth_url"]) {
                _this.facebookAuthUrl = output["auth_url"];
                if (isDebug)
                    console.log("signup-select / getFacebookAuthUrl / this.facebookAuthUrl : ", _this.facebookAuthUrl);
            }
            else {
                // 에러 상황. 
                // 에러 원인에 대한 로그를 화면에 표시!
                _this.errorMsgArr.push(output);
                _this.myEventWatchTowerService.announceErrorMsgArr(_this.errorMsgArr);
            } // end if
            // this.facebookAuthUrl = facebookAuthUrl;
        });
        // 로그인, 회원 등록의 경우, 최상단 메뉴를 가립니다.
        this.myEventWatchTowerService.announceToggleTopMenu(false);
    }; // end init
    SignupSelectComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'signup-select',
            templateUrl: 'signup-select.component.html',
            styleUrls: ['signup-select.component.css']
        }), 
        __metadata('design:paramtypes', [login_service_1.LoginService, my_logger_service_1.MyLoggerService, my_checker_service_1.MyCheckerService, my_event_watchtower_service_1.MyEventWatchTowerService, router_1.Router])
    ], SignupSelectComponent);
    return SignupSelectComponent;
}());
exports.SignupSelectComponent = SignupSelectComponent;
//# sourceMappingURL=signup-select.component.js.map