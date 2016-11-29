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
var auth_service_1 = require('../../auth/auth.service');
var login_service_1 = require('../service/login.service');
var my_logger_service_1 = require('../../util/service/my-logger.service');
var my_event_watchtower_service_1 = require('../../util/service/my-event-watchtower.service');
var SignupSelectComponent = (function () {
    function SignupSelectComponent(authService, loginService, myLoggerService, myEventWatchTowerService, router) {
        this.authService = authService;
        this.loginService = loginService;
        this.myLoggerService = myLoggerService;
        this.myEventWatchTowerService = myEventWatchTowerService;
        this.router = router;
        this.cafeclassAuthUrl = "http://google.co.kr";
    }
    SignupSelectComponent.prototype.ngOnInit = function () {
        var _this = this;
        // 페이지 진입을 기록으로 남깁니다.
        this.myLoggerService.logActionPage(this.myLoggerService.pageKeySignupSelect);
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
    SignupSelectComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'signup-select',
            templateUrl: 'signup-select.component.html',
            styleUrls: ['signup-select.component.css']
        }), 
        __metadata('design:paramtypes', [auth_service_1.AuthService, login_service_1.LoginService, my_logger_service_1.MyLoggerService, my_event_watchtower_service_1.MyEventWatchTowerService, router_1.Router])
    ], SignupSelectComponent);
    return SignupSelectComponent;
}());
exports.SignupSelectComponent = SignupSelectComponent;
//# sourceMappingURL=signup-select.component.js.map