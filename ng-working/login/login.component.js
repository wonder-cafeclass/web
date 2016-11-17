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
var auth_service_1 = require('../auth/auth.service');
var login_service_1 = require('./service/login.service');
var my_logger_service_1 = require('../util/service/my-logger.service');
var LoginComponent = (function () {
    function LoginComponent(authService, loginService, myLoggerService, router) {
        this.authService = authService;
        this.loginService = loginService;
        this.myLoggerService = myLoggerService;
        this.router = router;
        this.cageHeight = -1;
        this.cageWidth = -1;
        this.isIframeReady = false;
    }
    LoginComponent.prototype.ngOnInit = function () {
        var _this = this;
        // 페이지 진입을 기록으로 남깁니다.
        this.myLoggerService.logActionPage(this.myLoggerService.pageKeyLogin);
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
        // REMOVE ME
        /*
        if(0 < this.cageWidth) {
          let borderWidth:number = 2;
          this.cageWidthStr=`${this.cageWidth + borderWidth}px`;
        } else {
          this.cageWidthStr="100%";
        }
    
        if(0 < this.cageHeight) {
          this.cageHeightStr=`${this.cageHeight}px`;
        } else {
          this.cageHeightStr="100%";
        }
        */
    };
    // @ Deprecated
    LoginComponent.prototype.login = function () {
        var _this = this;
        this.authService.login().subscribe(function () {
            if (_this.authService.isLoggedIn) {
                // Get the redirect URL from our auth service
                // If no redirect has been set, use the default
                var redirect = _this.authService.redirectUrl ? _this.authService.redirectUrl : '/admin';
                // Set our navigation extras object
                // that passes on our global query params and fragment
                var navigationExtras = {
                    preserveQueryParams: true,
                    preserveFragment: true
                };
                // Redirect the user
                _this.router.navigate([redirect], navigationExtras);
            }
        });
    };
    LoginComponent.prototype.logout = function () {
        this.authService.logout();
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], LoginComponent.prototype, "cageHeight", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], LoginComponent.prototype, "cageWidth", void 0);
    LoginComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'login',
            templateUrl: 'login.component.html',
            styleUrls: ['login.component.css']
        }), 
        __metadata('design:paramtypes', [auth_service_1.AuthService, login_service_1.LoginService, my_logger_service_1.MyLoggerService, router_1.Router])
    ], LoginComponent);
    return LoginComponent;
}());
exports.LoginComponent = LoginComponent;
//# sourceMappingURL=login.component.js.map