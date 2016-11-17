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
var MyLoggerService = (function () {
    function MyLoggerService(us, http) {
        this.us = us;
        this.http = http;
        this.apiLogActionPageUrl = '/CI/index.php/api/log/page';
        this.pageKeyLogin = "LOG_IN";
        this.pageKeyLoginFacebook = "LOG_IN_FACEBOOK";
        this.pageKeyLoginKakao = "LOG_IN_KAKAO";
        this.pageKeyLoginNaver = "LOG_IN_NAVER";
        this.pageKeySignup = "SIGNUP";
    }
    MyLoggerService.prototype.logActionPage = function (pageKey) {
        if (null == pageKey || "" == pageKey) {
            return;
        }
        var req_url = this.us.get(this.apiLogActionPageUrl);
        req_url += "?pageKey=" + pageKey;
        this.http.get(req_url).toPromise().then().catch();
    };
    MyLoggerService.prototype.logError = function (pageKey) {
        // Do something...
    };
    MyLoggerService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [url_service_1.UrlService, http_1.Http])
    ], MyLoggerService);
    return MyLoggerService;
}());
exports.MyLoggerService = MyLoggerService;
//# sourceMappingURL=my-logger.service.js.map