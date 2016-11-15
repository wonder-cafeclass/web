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
var LoginComponent = (function () {
    function LoginComponent(authService, loginService, zone, router) {
        var _this = this;
        this.authService = authService;
        this.loginService = loginService;
        this.zone = zone;
        this.router = router;
        this.kakaoSignupCodeAlreadyRegisterd = -102;
        this.angularKey = "angularMyML";
        this.cageHeight = -1;
        this.cageWidth = -1;
        this.isIframeReady = false;
        // set function reference out of app. ( ex)iframe )
        window[this.angularKey] = {
            zone: this.zone,
            componentFn: function (value) { return _this.callFromOutside(value); },
            component: this
        };
    }
    LoginComponent.prototype.ngOnInit = function () {
        var _this = this;
        // 각 플랫폼 별로 로그인 할 수 있는 주소들을 가져옵니다.
        this.loginService
            .getKakaoAuthUrl()
            .then(function (kakaoAuthUrl) {
            _this.kakaoAuthUrl = kakaoAuthUrl;
            if (_this.isIframeReady) {
                _this.childContentWindow.setKakaoAuthUrl(kakaoAuthUrl);
            }
        });
        if (0 < this.cageWidth) {
            var borderWidth = 2;
            this.cageWidthStr = (this.cageWidth + borderWidth) + "px";
        }
        else {
            this.cageWidthStr = "100%";
        }
        if (0 < this.cageHeight) {
            this.cageHeightStr = this.cageHeight + "px";
        }
        else {
            this.cageHeightStr = "100%";
        }
        // Javascript, ifarme 통신 
        // https://plnkr.co/edit/e77JkHmO7n5FYoKSXnIL?p=preview
        this.childContentWindow = this.iframe.nativeElement.contentWindow;
    };
    // iframe에서 호출하는 함수.
    LoginComponent.prototype.callFromOutside = function (myEvent) {
        if (null == myEvent || null == myEvent.key) {
            return;
        }
        console.log("login.component / callFromOutside / myEvent : ", myEvent);
        if ("ready_to_init" === myEvent.key) {
            // 에디터의 너비, 높이를 변경합니다.
            // this.setSize(this.cageWidth, this.cageHeight);
            // iframe을 시작합니다.
            this.isIframeReady = true;
            if (null != this.kakaoAuthUrl && "" != this.kakaoAuthUrl) {
                this.childContentWindow.setKakaoAuthUrl(this.kakaoAuthUrl);
            }
        }
        else if ("authorized_kakao" === myEvent.key) {
            var kakaoCode = myEvent.value;
            // 1. kakaoCode를 받아왔습니다. 
            // 2. kakao 사용자 토큰을 받아옵니다.
            // this.getKakaoToken(kakaoCode);
            this.getKakaoToken(kakaoCode);
        }
    };
    LoginComponent.prototype.initIframe = function (kakao_auth_url, naver_auth_url, facebook_auth_url) {
        if (null != this.childContentWindow) {
            this.childContentWindow.init(kakao_auth_url, naver_auth_url, facebook_auth_url);
        }
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
    // KAKAO
    // 카카오 로그인 토큰을 가져옵니다.
    LoginComponent.prototype.getKakaoToken = function (kakaoCode) {
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
                _this.kakaoAccessToken = result.access_token;
                _this.kakaoTokenType = result.token_type;
                // 유저 앱등록을 진행합니다.
                _this.getKakaoSignUp(result.token_type, result.access_token);
            }
        });
    };
    // 유저를 카카오 앱 - cafeclass에 등록합니다. 이미 등록되어 있다면 재등록되지 않습니다.
    LoginComponent.prototype.getKakaoSignUp = function (kakaoTokenType, kakaoAccessToken) {
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
    LoginComponent.prototype.getKakaoMe = function (kakaoTokenType, kakaoAccessToken) {
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
    __decorate([
        core_1.ViewChild('iframe'), 
        __metadata('design:type', core_1.ElementRef)
    ], LoginComponent.prototype, "iframe", void 0);
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
        __metadata('design:paramtypes', [auth_service_1.AuthService, login_service_1.LoginService, core_1.NgZone, router_1.Router])
    ], LoginComponent);
    return LoginComponent;
}());
exports.LoginComponent = LoginComponent;
//# sourceMappingURL=login.component.js.map