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
var http_1 = require('@angular/http');
var url_service_1 = require("../../util/url.service");
var LoginService = (function () {
    function LoginService(us, http) {
        this.us = us;
        this.http = http;
        this.kakaoAuthLinkUrl = '/CI/index.php/api/kakao/authurl';
        this.kakaoAuthUrl = '/CI/index.php/api/kakao/auth';
        this.kakaoTokenUrl = '/CI/index.php/api/kakao/token';
        this.kakaoSignUpUrl = '/CI/index.php/api/kakao/signup';
        this.kakaoMeUrl = '/CI/index.php/api/kakao/me';
        this.naverAuthUrl = '/CI/index.php/api/naver/authurl';
        this.naverStateUrl = '/CI/index.php/api/naver/state';
        this.naverAccessUrl = '/CI/index.php/api/naver/access';
        this.naverMeUrl = '/CI/index.php/api/naver/me';
        this.facebookAuthUrl = '/CI/index.php/api/facebook/authurl';
        this.facebookStateUrl = '/CI/index.php/api/facebook/state';
        this.facebookAccessUrl = '/CI/index.php/api/facebook/access';
        this.facebookMeUrl = '/CI/index.php/api/facebook/me';
    }
    LoginService.prototype.getFacebookMe = function () {
        var req_url = this.us.get(this.facebookMeUrl);
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("user.service / getFacebookMe / 시작");
        if (isDebug)
            console.log("user.service / getFacebookMe / req_url : ", req_url);
        return this.http.get(req_url)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    };
    LoginService.prototype.getFacebookAccess = function (code) {
        var req_url = this.us.get(this.facebookAccessUrl) + "?code=" + code;
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("user.service / getFacebookAccess / 시작");
        if (isDebug)
            console.log("user.service / getFacebookAccess / req_url : ", req_url);
        return this.http.get(req_url)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    };
    LoginService.prototype.getFacebookState = function (state) {
        var req_url = this.us.get(this.facebookStateUrl) + "?state=" + state;
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("user.service / getFacebookState / 시작");
        if (isDebug)
            console.log("user.service / getFacebookState / state : ", state);
        if (isDebug)
            console.log("user.service / getFacebookState / req_url : ", req_url);
        return this.http.get(req_url)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    };
    LoginService.prototype.getFacebookAuthUrl = function () {
        var req_url = this.us.get(this.facebookAuthUrl);
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("user.service / getFacebookAuthUrl / 시작");
        if (isDebug)
            console.log("user.service / getFacebookAuthUrl / req_url : ", req_url);
        return this.http.get(req_url)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    };
    LoginService.prototype.getNaverMe = function () {
        var req_url = this.us.get(this.naverMeUrl);
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("user.service / getNaverMe / 시작");
        if (isDebug)
            console.log("user.service / getNaverMe / req_url : ", req_url);
        return this.http.get(req_url)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    };
    LoginService.prototype.getNaverAccess = function (naver_code) {
        var req_url = this.us.get(this.naverAccessUrl) + "?naver_code=" + naver_code;
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("user.service / getNaverAccess / 시작");
        if (isDebug)
            console.log("user.service / getNaverAccess / naver_code : ", naver_code);
        if (isDebug)
            console.log("user.service / getNaverAccess / req_url : ", req_url);
        return this.http.get(req_url)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    };
    LoginService.prototype.getNaverState = function (state) {
        var req_url = this.us.get(this.naverStateUrl) + "?state=" + state;
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("user.service / getNaverState / 시작");
        if (isDebug)
            console.log("user.service / getNaverState / req_url : ", req_url);
        return this.http.get(req_url)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    };
    LoginService.prototype.getNaverAuthUrl = function () {
        var req_url = this.us.get(this.naverAuthUrl);
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("user.service / getNaverAuthUrl / 시작");
        if (isDebug)
            console.log("user.service / getNaverAuthUrl / req_url : ", req_url);
        return this.http.get(req_url)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    };
    LoginService.prototype.getKakaoAuthUrl = function () {
        var req_url = this.us.get(this.kakaoAuthLinkUrl);
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("user.service / getKakaoAuthUrl / 시작");
        if (isDebug)
            console.log("user.service / getKakaoAuthUrl / req_url : ", req_url);
        return this.http.get(req_url)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    };
    LoginService.prototype.getKakaoToken = function (code) {
        var req_url = this.us.get(this.kakaoTokenUrl) + "?code=" + code;
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("user.service / getKakaoToken / 시작");
        if (isDebug)
            console.log("user.service / getKakaoToken / code : ", code);
        if (isDebug)
            console.log("user.service / getKakaoToken / req_url : ", req_url);
        return this.http.get(req_url)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    };
    LoginService.prototype.getKakaoSignUp = function (kakaoTokenType, kakaoAccessToken) {
        var req_url = this.us.get(this.kakaoSignUpUrl) + "?token_type=" + kakaoTokenType + "&access_token=" + kakaoAccessToken;
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("user.service / getKakaoSignUp / 시작");
        if (isDebug)
            console.log("user.service / getKakaoSignUp / kakaoTokenType : ", kakaoTokenType);
        if (isDebug)
            console.log("user.service / getKakaoSignUp / kakaoAccessToken : ", kakaoAccessToken);
        if (isDebug)
            console.log("user.service / getKakaoSignUp / req_url : ", req_url);
        return this.http.get(req_url)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    };
    LoginService.prototype.getKakaoMe = function (kakaoTokenType, kakaoAccessToken) {
        var req_url = this.us.get(this.kakaoMeUrl) + "?token_type=" + kakaoTokenType + "&access_token=" + kakaoAccessToken;
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("user.service / getKakaoMe / 시작");
        if (isDebug)
            console.log("user.service / getKakaoMe / kakaoTokenType : ", kakaoTokenType);
        if (isDebug)
            console.log("user.service / getKakaoMe / kakaoAccessToken : ", kakaoAccessToken);
        if (isDebug)
            console.log("user.service / getKakaoMe / req_url : ", req_url);
        return this.http.get(req_url)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    };
    LoginService.prototype.getKakaoAuth = function (code) {
        var req_url = this.us.get(this.kakaoAuthUrl) + "?code=" + code;
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("user.service / getKakaoAuth / 시작");
        if (isDebug)
            console.log("user.service / getKakaoAuth / code : ", code);
        if (isDebug)
            console.log("user.service / getKakaoAuth / req_url : ", req_url);
        return this.http.get(req_url)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    };
    LoginService.prototype.extractData = function (res) {
        var body = res.json();
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("user.service / extractData / 시작");
        if (isDebug)
            console.log("user.service / extractData / body : ", body);
        // TODO - 데이터 검증 프로세스.
        if (null == body.data || !body.success) {
            if (isDebug)
                console.log("user.service / extractData / 중단 / 데이터가 없습니다.");
            return null;
        }
        return body.data;
    };
    LoginService.prototype.handleError = function (error) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("user.service / handleError / 시작");
        // In a real world app, we might use a remote logging infrastructure
        // We'd also dig deeper into the error to get a better message
        var errMsg = (error.message) ? error.message :
            error.status ? error.status + " - " + error.statusText : 'Server error';
        if (isDebug)
            console.log("user.service / handleError / errMsg : ", errMsg);
        // console.error(errMsg); // log to console instead
        // TODO - 에러 내용을 저장해 두어야 합니다.
        return Promise.reject(errMsg);
    };
    LoginService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [url_service_1.UrlService, http_1.Http])
    ], LoginService);
    return LoginService;
}());
exports.LoginService = LoginService;
//# sourceMappingURL=login.service.js.map