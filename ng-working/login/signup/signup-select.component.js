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
    function SignupSelectComponent(loginService, myLoggerService, myCheckerService, watchTower, router) {
        this.loginService = loginService;
        this.myLoggerService = myLoggerService;
        this.myCheckerService = myCheckerService;
        this.watchTower = watchTower;
        this.router = router;
        this.isAdmin = false;
        this.errorMsgArr = [];
    }
    SignupSelectComponent.prototype.ngOnInit = function () {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("signup-select / ngOnInit / 시작");
    }; // end ngOnInit
    SignupSelectComponent.prototype.ngAfterViewInit = function () {
        // 자식 뷰가 모두 완료된 이후에 초기화를 진행.
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("signup-select / ngAfterViewInit");
        this.asyncViewPack();
    };
    SignupSelectComponent.prototype.asyncViewPack = function () {
        var _this = this;
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("signup-select / asyncViewPack / 시작");
        // 이미 View 기본정보가 들어왔다면 바로 가져온다. 
        if (this.watchTower.getIsViewPackReady()) {
            if (isDebug)
                console.log("signup-select / asyncViewPack / isViewPackReady : ", true);
            this.init();
        } // end if
        // View에 필요한 기본 정보가 비동기로 들어올 경우, 처리.
        this.watchTower.isViewPackReady$.subscribe(function (isViewPackReady) {
            if (isDebug)
                console.log("signup-select / asyncViewPack / subscribe / isViewPackReady : ", isViewPackReady);
            _this.init();
        }); // end subscribe    
    };
    SignupSelectComponent.prototype.setViewPack = function () {
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
    SignupSelectComponent.prototype.init = function () {
        var _this = this;
        // 뷰에 필요한 공통 정보를 설정합니다.
        this.setViewPack();
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("signup-select / init / 시작");
        // 페이지 진입을 기록으로 남깁니다.
        this.myLoggerService.logActionPage(
        // apiKey:string
        this.watchTower.getApiKey(), 
        // pageType:string
        this.myLoggerService.pageTypeSignupSelect);
        // 각 플랫폼 별로 로그인 할 수 있는 주소들을 가져옵니다.
        // 1. kakao
        this.loginService
            .getKakaoAuthUrl()
            .then(function (myResponse) {
            if (isDebug)
                console.log("signup-select / getKakaoAuthUrl / 시작");
            if (isDebug)
                console.log("signup-select / getKakaoAuthUrl / myResponse : ", myResponse);
            if (myResponse.isSuccess()) {
                _this.kakaoAuthUrl = myResponse.getDataProp("auth_url");
                if (isDebug)
                    console.log("signup-select / getKakaoAuthUrl / this.kakaoAuthUrl : ", _this.kakaoAuthUrl);
            }
            else {
                // 에러 상황. 
                // 에러 원인에 대한 로그를 화면에 표시!
                _this.errorMsgArr.push(myResponse.getError());
                _this.watchTower.announceErrorMsgArr(_this.errorMsgArr);
            } // end if
        });
        // 2. naver
        this.loginService
            .getNaverAuthUrl()
            .then(function (myResponse) {
            if (isDebug)
                console.log("signup-select / getNaverAuthUrl / 시작");
            if (isDebug)
                console.log("signup-select / getNaverAuthUrl / myResponse : ", myResponse);
            if (myResponse.isSuccess()) {
                _this.naverAuthUrl = myResponse.getDataProp("auth_url");
                if (isDebug)
                    console.log("signup-select / getNaverAuthUrl / this.naverAuthUrl : ", _this.naverAuthUrl);
            }
            else {
                // 에러 상황. 
                // 에러 원인에 대한 로그를 화면에 표시!
                _this.errorMsgArr.push(myResponse.getError());
                _this.watchTower.announceErrorMsgArr(_this.errorMsgArr);
            } // end if
        });
        // 3. facebook
        this.loginService
            .getFacebookAuthUrl()
            .then(function (myResponse) {
            if (isDebug)
                console.log("signup-select / getFacebookAuthUrl / 시작");
            if (isDebug)
                console.log("signup-select / getFacebookAuthUrl / myResponse : ", myResponse);
            if (myResponse.isSuccess()) {
                _this.facebookAuthUrl = myResponse.getDataProp("auth_url");
                if (isDebug)
                    console.log("signup-select / getFacebookAuthUrl / this.facebookAuthUrl : ", _this.facebookAuthUrl);
            }
            else {
                // 에러 상황. 
                // 에러 원인에 대한 로그를 화면에 표시!
                _this.errorMsgArr.push(myResponse.getError());
                _this.watchTower.announceErrorMsgArr(_this.errorMsgArr);
            } // end if
        });
        // 로그인, 회원 등록의 경우, 최상단 메뉴를 가립니다.
        this.watchTower.announceToggleTopMenu(false);
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