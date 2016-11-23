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
var UserService = (function () {
    // http://devcafeclass.co.uk/CI/index.php/api/users/email?q=wonder13662@gmail.com
    function UserService(us, http) {
        this.us = us;
        this.http = http;
        this.getUserByEmailUrl = '/CI/index.php/api/users/email';
    }
    UserService.prototype.getUserByEmail = function (email) {
        var req_url = this.us.get(this.getUserByEmailUrl);
        req_url = req_url + "?q=" + email;
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("user.service / getUserByEmail / 시작");
        if (isDebug)
            console.log("user.service / getUserByEmail / email : ", email);
        if (isDebug)
            console.log("user.service / getUserByEmail / req_url : ", req_url);
        return this.http.get(req_url)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    };
    UserService.prototype.extractData = function (res) {
        var body = res.json();
        console.log("login.service / extractData / body ::: ", body);
        // TODO - 데이터 검증 프로세스.
        if (null == body.data || !body.success) {
            console.log("login.service / extractData / 데이터가 없습니다.");
            return null;
        }
        console.log("login.service / extractData / 3");
        return body.data;
    };
    // New - XHR
    // promise-based
    UserService.prototype.handleError = function (error) {
        // In a real world app, we might use a remote logging infrastructure
        // We'd also dig deeper into the error to get a better message
        var errMsg = (error.message) ? error.message :
            error.status ? error.status + " - " + error.statusText : 'Server error';
        console.error(errMsg); // log to console instead
        return Promise.reject(errMsg);
    };
    UserService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [url_service_1.UrlService, http_1.Http])
    ], UserService);
    return UserService;
}());
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map