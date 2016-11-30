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
    // http://devcafeclass.co.uk/CI/index.php/api/users/cookie
    function UserService(us, http) {
        this.us = us;
        this.http = http;
        this.getUserByEmailUrl = '/CI/index.php/api/users/email';
        this.getUserByFacebookIdUrl = '/CI/index.php/api/users/facebook';
        this.getUserByKakaoIdUrl = '/CI/index.php/api/users/kakao';
        this.getUserByNaverIdUrl = '/CI/index.php/api/users/naver';
        this.getUserByMobileUrl = '/CI/index.php/api/users/mobile';
        this.sendMailUserValidationUrl = '/CI/index.php/api/users/validation';
        this.confirmUserValidationUrl = '/CI/index.php/api/users/confirmvalidation';
        this.confirmUserKakaoUrl = '/CI/index.php/api/users/confirmkakao';
        this.confirmUserEmailPasswordUrl = '/CI/index.php/api/users/confirm';
        this.getUserCookieUrl = '/CI/index.php/api/users/cookie';
        this.logoutUrl = '/CI/index.php/api/users/logout';
        this.updateUserUrl = '/CI/index.php/api/users/update';
        this.addUserUrl = '/CI/index.php/api/users/add';
    }
    UserService.prototype.getUserByEmail = function (email) {
        var req_url = this.us.get(this.getUserByEmailUrl);
        req_url = req_url + "?q=" + email;
        // let isDebug:boolean = true;
        var isDebug = false;
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
        // let isDebug:boolean = true;
        var isDebug = false;
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
        // let isDebug:boolean = true;
        var isDebug = false;
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
        // let isDebug:boolean = true;
        var isDebug = false;
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
        // let isDebug:boolean = true;
        var isDebug = false;
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
    UserService.prototype.updateUser = function (apiKey, userId, email, password, name, nickname, gender, birthYear, birthMonth, birthDay, thumbnail, mobileHead, mobileBody, mobileTail) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("user.service / updateUser / 시작");
        if (isDebug)
            console.log("user.service / updateUser / apiKey : ", apiKey);
        if (isDebug)
            console.log("user.service / updateUser / userId : ", userId);
        if (isDebug)
            console.log("user.service / updateUser / email : ", email);
        if (isDebug)
            console.log("user.service / updateUser / password : ", password);
        if (isDebug)
            console.log("user.service / updateUser / name : ", name);
        if (isDebug)
            console.log("user.service / updateUser / nickname : ", nickname);
        if (isDebug)
            console.log("user.service / updateUser / gender : ", gender);
        if (isDebug)
            console.log("user.service / updateUser / birthYear : ", birthYear);
        if (isDebug)
            console.log("user.service / updateUser / birthMonth : ", birthMonth);
        if (isDebug)
            console.log("user.service / updateUser / birthDay : ", birthDay);
        if (isDebug)
            console.log("user.service / updateUser / thumbnail : ", thumbnail);
        if (isDebug)
            console.log("user.service / updateUser / mobileHead : ", mobileHead);
        if (isDebug)
            console.log("user.service / updateUser / mobileBody : ", mobileBody);
        if (isDebug)
            console.log("user.service / updateUser / mobileTail : ", mobileTail);
        // POST
        var headers = new http_1.Headers({
            'Content-Type': 'application/json',
            'Cafeclass-REST-API-Key': apiKey
        });
        var options = new http_1.RequestOptions({ headers: headers });
        var req_url = this.us.get(this.updateUserUrl);
        if (isDebug)
            console.log("user.service / updateUser / req_url : ", req_url);
        var params = {
            user_id: userId,
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
    UserService.prototype.addUser = function (apiKey, email, password, name, nickname, gender, birthYear, birthMonth, birthDay, thumbnail, mobileHead, mobileBody, mobileTail) {
        // let isDebug:boolean = true;
        var isDebug = false;
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
    UserService.prototype.sendMailUserValidation = function (apiKey, userId, email) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("user.service / sendMailUserValidation / 시작");
        if (isDebug)
            console.log("user.service / sendMailUserValidation / apiKey : ", apiKey);
        if (isDebug)
            console.log("user.service / sendMailUserValidation / userId : ", userId);
        if (isDebug)
            console.log("user.service / sendMailUserValidation / email : ", email);
        // POST
        var headers = new http_1.Headers({
            'Content-Type': 'application/json',
            'Cafeclass-REST-API-Key': apiKey
        });
        var options = new http_1.RequestOptions({ headers: headers });
        var req_url = this.us.get(this.sendMailUserValidationUrl);
        if (isDebug)
            console.log("user.service / sendMailUserValidation / req_url : ", req_url);
        var params = {
            user_id: userId,
            email: email
        };
        return this.http.post(req_url, params, options)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    };
    UserService.prototype.confirmUserValidation = function (apiKey, key) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("user.service / confirmUserValidation / 시작");
        if (isDebug)
            console.log("user.service / confirmUserValidation / apiKey : ", apiKey);
        if (isDebug)
            console.log("user.service / confirmUserValidation / key : ", key);
        // POST
        var headers = new http_1.Headers({
            'Content-Type': 'application/json',
            'Cafeclass-REST-API-Key': apiKey
        });
        var options = new http_1.RequestOptions({ headers: headers });
        var req_url = this.us.get(this.confirmUserValidationUrl);
        if (isDebug)
            console.log("user.service / confirmUserValidation / req_url : ", req_url);
        var params = {
            key: key
        };
        return this.http.post(req_url, params, options)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    };
    UserService.prototype.confirmUserKakao = function (apiKey, kakaoId) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("user.service / confirmUserKakao / 시작");
        if (isDebug)
            console.log("user.service / confirmUserKakao / apiKey : ", apiKey);
        if (isDebug)
            console.log("user.service / confirmUserKakao / kakaoId : ", kakaoId);
        // POST
        var headers = new http_1.Headers({
            'Content-Type': 'application/json',
            'Cafeclass-REST-API-Key': apiKey
        });
        var options = new http_1.RequestOptions({ headers: headers });
        var req_url = this.us.get(this.confirmUserKakaoUrl);
        if (isDebug)
            console.log("user.service / confirmUserKakao / req_url : ", req_url);
        var params = {
            kakao_id: kakaoId
        };
        return this.http.post(req_url, params, options)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    };
    UserService.prototype.getUserCookie = function (apiKey) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("user.service / getUserCookie / 시작");
        if (isDebug)
            console.log("user.service / getUserCookie / apiKey : ", apiKey);
        // POST
        var headers = new http_1.Headers({
            'Content-Type': 'application/json',
            'Cafeclass-REST-API-Key': apiKey
        });
        var options = new http_1.RequestOptions({ headers: headers });
        var req_url = this.us.get(this.getUserCookieUrl);
        if (isDebug)
            console.log("user.service / getUserCookie / req_url : ", req_url);
        var params = {};
        return this.http.post(req_url, params, options)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    };
    UserService.prototype.deleteUserCookie = function () {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("user.service / deleteUserCookie / 시작");
        // wonder.jung
        var req_url = this.us.get(this.logoutUrl);
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("user.service / deleteUserCookie / 시작");
        if (isDebug)
            console.log("user.service / deleteUserCookie / req_url : ", req_url);
        return this.http.get(req_url)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    };
    UserService.prototype.confirmUserEmailPassword = function (apiKey, email, password) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("user.service / confirmUserEmailPassword / 시작");
        if (isDebug)
            console.log("user.service / confirmUserEmailPassword / apiKey : ", apiKey);
        // POST
        var headers = new http_1.Headers({
            'Content-Type': 'application/json',
            'Cafeclass-REST-API-Key': apiKey
        });
        var options = new http_1.RequestOptions({ headers: headers });
        var req_url = this.us.get(this.confirmUserEmailPasswordUrl);
        if (isDebug)
            console.log("user.service / confirmUserEmailPassword / req_url : ", req_url);
        var params = {
            email: email,
            password: password
        };
        return this.http.post(req_url, params, options)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    };
    UserService.prototype.extractData = function (res) {
        var body = res.json();
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("user.service / extractData / body ::: ", body);
        // TODO - 데이터 검증 프로세스.
        if (null == body.data || !body.success) {
            console.log("user.service / extractData / 데이터가 없습니다.");
            return null;
        }
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