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
            this.getKakaoAuth(kakaoCode);
        }
    };
    // 로그인 및 사용자 조회 정보를 일괄 조회하는 메서드.
    LoginComponent.prototype.getKakaoAuth = function (kakaoCode) {
        if (null == kakaoCode || "" == kakaoCode) {
            console.log("!Error! / login.compoenet / ");
            return;
        }
        this.loginService
            .getKakaoAuth(kakaoCode)
            .then(function (result) {
            // this.kakaoToken = kakaoToken;
            // 1. 새로 등록된 경우 - 카카오에서 얻은 정보롤 토대로 유저 정보 입력창으로 이동한다.
            console.log("login.component / getKakaoAuth / result : ", result);
            // 2. 이미 등록된 경우 - 유저가 로그인을 시작한 페이지로 다시 돌아간다.(to RedirectUrl)
        });
    };
    // REMOVE ME
    /*
    private getKakaoToken(kakaoCode:string) :void{
  
      if(null == kakaoCode || "" == kakaoCode) {
        console.log("!Error! / login.compoenet / ");
        return;
      }
  
      this.loginService
      .getKakaoToken(kakaoCode)
      .then(result => {
        // this.kakaoToken = kakaoToken;
  
        console.log("login.component / getKakaoToken / result : ",result);
  
        if( null != result &&
            null != result.access_token &&
            null != result.token_type) {
  
          this.kakaoAccessToken = result.access_token;
          this.kakaoTokenType = result.token_type;
  
          // 유저 앱등록을 진행합니다.
          this.getKakaoSignUp(result.access_token, result.token_type);
        }
  
  
      });
    }
  
  
    private getKakaoSignUp(kakaoAccessToken:string, kakaoTokenType:string) :void {
  
      this.loginService
      .getKakaoSignUp(kakaoAccessToken, kakaoTokenType)
      .then(result => {
        // this.kakaoToken = kakaoToken;
  
        console.log("login.component / getKakaoSignUp / result : ",result);
  
        if( null != result &&
            null != result.code &&
            null != result.msg) {
  
          let code:number = result.code;
          let msg:string = result.msg;
  
          if(this.kakaoSignupCodeAlreadyRegisterd === code) {
            // 유저 정보를 가져옵니다.
            // this.getKakaoSignUp(result.access_token, result.token_type);
          }
        }
  
      });
  
    }
    */
    LoginComponent.prototype.initIframe = function (kakao_auth_url, naver_auth_url, facebook_auth_url) {
        if (null != this.childContentWindow) {
            this.childContentWindow.init(kakao_auth_url, naver_auth_url, facebook_auth_url);
        }
    };
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