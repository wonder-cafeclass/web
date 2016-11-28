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
        this.getUserByFacebookIdUrl = '/CI/index.php/api/users/facebook';
        this.getUserByKakaoIdUrl = '/CI/index.php/api/users/kakao';
        this.getUserByNaverIdUrl = '/CI/index.php/api/users/naver';
        this.getUserByMobileUrl = '/CI/index.php/api/users/mobile';
        this.addUserUrl = '/CI/index.php/api/users/add';
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
    UserService.prototype.getUserByFacebookId = function (facebookId) {
        var req_url = this.us.get(this.getUserByFacebookIdUrl);
        req_url = req_url + "?q=" + facebookId;
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("user.service / getUserByFacebookId / 시작");
        if (isDebug)
            console.log("user.service / getUserByFacebookId / facebookId : ", facebookId);
        if (isDebug)
            console.log("user.service / getUserByFacebookId / req_url : ", req_url);
        return this.http.get(req_url)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    };
    UserService.prototype.getUserByNaverId = function (naverId) {
        var req_url = this.us.get(this.getUserByNaverIdUrl);
        req_url = req_url + "?q=" + naverId;
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("user.service / getUserByNaverId / 시작");
        if (isDebug)
            console.log("user.service / getUserByNaverId / naverId : ", naverId);
        if (isDebug)
            console.log("user.service / getUserByNaverId / req_url : ", req_url);
        return this.http.get(req_url)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    };
    UserService.prototype.getUserByKakaoId = function (kakaoId) {
        var req_url = this.us.get(this.getUserByKakaoIdUrl);
        req_url = req_url + "?q=" + kakaoId;
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("user.service / getUserByKakaoId / 시작");
        if (isDebug)
            console.log("user.service / getUserByKakaoId / kakaoId : ", kakaoId);
        if (isDebug)
            console.log("user.service / getUserByKakaoId / req_url : ", req_url);
        return this.http.get(req_url)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    };
    UserService.prototype.getUserByMobile = function (mobile) {
        var req_url = this.us.get(this.getUserByMobileUrl);
        req_url = req_url + "?q=" + mobile;
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("user.service / getUserByMobile / 시작");
        if (isDebug)
            console.log("user.service / getUserByMobile / mobile : ", mobile);
        if (isDebug)
            console.log("user.service / getUserByMobile / req_url : ", req_url);
        return this.http.get(req_url)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    };
    UserService.prototype.addUser = function (apiKey, email, password, name, nickname, gender, birthYear, birthMonth, birthDay, thumbnail, mobileHead, mobileBody, mobileTail) {
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("user.service / addUser / 시작");
        if (isDebug)
            console.log("user.service / addUser / apiKey : ", apiKey);
        if (isDebug)
            console.log("user.service / addUser / email : ", email);
        if (isDebug)
            console.log("user.service / addUser / password : ", password);
        if (isDebug)
            console.log("user.service / addUser / name : ", name);
        if (isDebug)
            console.log("user.service / addUser / nickname : ", nickname);
        if (isDebug)
            console.log("user.service / addUser / gender : ", gender);
        if (isDebug)
            console.log("user.service / addUser / birthYear : ", birthYear);
        if (isDebug)
            console.log("user.service / addUser / birthMonth : ", birthMonth);
        if (isDebug)
            console.log("user.service / addUser / birthDay : ", birthDay);
        if (isDebug)
            console.log("user.service / addUser / thumbnail : ", thumbnail);
        if (isDebug)
            console.log("user.service / addUser / mobileHead : ", mobileHead);
        if (isDebug)
            console.log("user.service / addUser / mobileBody : ", mobileBody);
        if (isDebug)
            console.log("user.service / addUser / mobileTail : ", mobileTail);
        // POST
        var headers = new http_1.Headers({
            'Content-Type': 'application/json',
            'Cafeclass-REST-API-Key': apiKey
        });
        var options = new http_1.RequestOptions({ headers: headers });
        var req_url = this.us.get(this.addUserUrl);
        var params = {
            email: email,
            password: password,
            name: name,
            nickname: nickname,
            gender: gender,
            birth_year: birthYear,
            birth_month: birthMonth,
            birth_day: birthDay,
            thumbnail: thumbnail,
            mobile_head: mobileHead,
            mobile_body: mobileBody,
            mobile_tail: mobileTail
        };
        return this.http.post(req_url, params, options)
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