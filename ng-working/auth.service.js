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
var url_service_1 = require("./util/url.service");
var AuthService = (function () {
    function AuthService(us, http) {
        this.us = us;
        this.http = http;
        this.adminAuthUrl = '/CI/index.php/api/admin/auth';
        this.kakaoAuthUrl = '/CI/index.php/api/kakao/authurl';
        this.naverAuthUrl = '/CI/index.php/api/naver/authurl';
        this.facebookAuthUrl = '/CI/index.php/api/facebook/authurl';
    }
    AuthService.prototype.getAdminAuth = function () {
        var req_url = this.us.get(this.adminAuthUrl);
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("auth.service / getAdminAuth / 시작");
        if (isDebug)
            console.log("auth.service / getAdminAuth / req_url : ", req_url);
        return this.http.get(req_url)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    };
    AuthService.prototype.getKakaoAuth = function () {
        var req_url = this.us.get(this.kakaoAuthUrl);
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("auth.service / getKakaoAuth / 시작");
        if (isDebug)
            console.log("auth.service / getKakaoAuth / req_url : ", req_url);
        return this.http.get(req_url)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    };
    AuthService.prototype.extractData = function (res) {
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("auth.service / extractData / 시작");
        if (isDebug)
            console.log("auth.service / extractData / res : ", res);
        var body = res.json();
        if (isDebug)
            console.log("auth.service / extractData / body : ", body);
        // TODO - 데이터 검증 프로세스.
        if (null == body.data || !body.success) {
            return null;
        }
        return body.data;
    };
    // New - XHR
    // promise-based
    AuthService.prototype.handleError = function (error) {
        // In a real world app, we might use a remote logging infrastructure
        // We'd also dig deeper into the error to get a better message
        console.log(">>> auth.service / error : ", error);
        var errMsg = (error.message) ? error.message :
            error.status ? error.status + " - " + error.statusText : 'Server error';
        console.error(errMsg); // log to console instead
        return Promise.reject(errMsg);
    };
    AuthService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [url_service_1.UrlService, http_1.Http])
    ], AuthService);
    return AuthService;
}());
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map