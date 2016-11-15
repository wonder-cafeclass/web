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
        this.facebookAuthUrl = '/CI/index.php/api/facebook/authurl';
    }
    LoginService.prototype.getKakaoAuthUrl = function () {
        var req_url = this.us.get(this.kakaoAuthLinkUrl);
        return this.http.get(req_url)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    };
    // TEST
    LoginService.prototype.getKakaoToken = function (code) {
        var req_url = this.us.get(this.kakaoTokenUrl) + "?code=" + code;
        console.log("login.service / getKakaoToken / req_url : ", req_url);
        return this.http.get(req_url)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    };
    LoginService.prototype.getKakaoSignUp = function (kakaoTokenType, kakaoAccessToken) {
        var req_url = this.us.get(this.kakaoSignUpUrl) + "?token_type=" + kakaoTokenType + "&access_token=" + kakaoAccessToken;
        console.log("login.service / getKakaoSignUp / req_url : ", req_url);
        return this.http.get(req_url)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    };
    LoginService.prototype.getKakaoMe = function (kakaoTokenType, kakaoAccessToken) {
        var req_url = this.us.get(this.kakaoMeUrl) + "?token_type=" + kakaoTokenType + "&access_token=" + kakaoAccessToken;
        console.log("login.service / getKakaoMe / req_url : ", req_url);
        return this.http.get(req_url)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    };
    LoginService.prototype.getKakaoAuth = function (code) {
        var req_url = this.us.get(this.kakaoAuthUrl) + "?code=" + code;
        console.log("login.service / getKakaoAuth / req_url : ", req_url);
        return this.http.get(req_url)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    };
    LoginService.prototype.extractData = function (res) {
        var body = res.json();
        console.log("AuthService / extractData / body ::: ", body);
        // TODO - 데이터 검증 프로세스.
        if (null == body.data || !body.success) {
            return null;
        }
        return body.data;
    };
    // New - XHR
    // promise-based
    LoginService.prototype.handleError = function (error) {
        // In a real world app, we might use a remote logging infrastructure
        // We'd also dig deeper into the error to get a better message
        var errMsg = (error.message) ? error.message :
            error.status ? error.status + " - " + error.statusText : 'Server error';
        console.error(errMsg); // log to console instead
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