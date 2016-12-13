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
var my_extractor_1 = require('../../util/http/my-extractor');
var my_request_1 = require('../../util/http/my-request');
var user_1 = require("../model/user");
var UserService = (function () {
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
        this.confirmUserFacebookUrl = '/CI/index.php/api/users/confirmfacebook';
        this.confirmUserNaverUrl = '/CI/index.php/api/users/confirmnaver';
        this.confirmUserEmailPasswordUrl = '/CI/index.php/api/users/confirm';
        this.getUserCookieUrl = '/CI/index.php/api/users/cookie';
        this.logoutUrl = '/CI/index.php/api/users/logout';
        this.updateUserUrl = '/CI/index.php/api/users/update';
        this.updateUserMutablesUrl = '/CI/index.php/api/users/updatemutables';
        this.updatePasswordUrl = '/CI/index.php/api/users/updatepw';
        this.addUserUrl = '/CI/index.php/api/users/add';
        this.myExtractor = new my_extractor_1.MyExtractor();
        this.myRequest = new my_request_1.MyRequest();
    }
    UserService.prototype.getUserByEmail = function (email) {
        // TODO 이메일로 사용자를 조회.
        // 개인 정보 유출 경로가 될 수 있으므로 POST 전송 및 API 키 사용 필요. 
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
            .then(this.myExtractor.extractData)
            .catch(this.myExtractor.handleError);
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
            .then(this.myExtractor.extractData)
            .catch(this.myExtractor.handleError);
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
            .then(this.myExtractor.extractData)
            .catch(this.myExtractor.handleError);
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
            .then(this.myExtractor.extractData)
            .catch(this.myExtractor.handleError);
    };
    UserService.prototype.getUserByMobile = function (apiKey, mobileHead, mobileBody, mobileTail) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("user.service / getUserByMobile / 시작");
        if (isDebug)
            console.log("user.service / getUserByMobile / apiKey : ", apiKey);
        if (isDebug)
            console.log("user.service / getUserByMobile / mobileHead : ", mobileHead);
        if (isDebug)
            console.log("user.service / getUserByMobile / mobileBody : ", mobileBody);
        if (isDebug)
            console.log("user.service / getUserByMobile / mobileTail : ", mobileTail);
        // POST
        var headers = new http_1.Headers({
            'Content-Type': 'application/json',
            'Cafeclass-REST-API-Key': apiKey
        });
        var options = new http_1.RequestOptions({ headers: headers });
        var req_url = this.us.get(this.getUserByMobileUrl);
        if (isDebug)
            console.log("user.service / getUserByMobile / req_url : ", req_url);
        var params = {
            mobile_head: mobileHead,
            mobile_body: mobileBody,
            mobile_tail: mobileTail
        };
        return this.http.post(req_url, params, options)
            .toPromise()
            .then(this.myExtractor.extractData)
            .catch(this.myExtractor.handleError);
    };
    UserService.prototype.updateUserByUser = function (apiKey, user) {
        var mobileArr = user.getMobileArr();
        var birthdayArr = user.getBirthdayArr();
        return this.updateUserMutableProps(
        // apiKey:string, 
        apiKey, 
        // email:string, 
        user.email, 
        // name:string, 
        user.name, 
        // nickname:string, 
        user.nickname, 
        // gender:string,
        user.gender, 
        // birthYear:string,
        birthdayArr[0], 
        // birthMonth:string,
        birthdayArr[1], 
        // birthDay:string,
        birthdayArr[2], 
        // thumbnail:string,
        user.thumbnail, 
        // mobileHead:string,
        mobileArr[0], 
        // mobileBody:string,
        mobileArr[1], 
        // mobileTail:string
        mobileArr[2]);
    };
    UserService.prototype.updateUserMutableProps = function (apiKey, email, name, nickname, gender, birthYear, birthMonth, birthDay, thumbnail, mobileHead, mobileBody, mobileTail) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("user.service / updateUserMutableProps / 시작");
        if (isDebug)
            console.log("user.service / updateUserMutableProps / apiKey : ", apiKey);
        if (isDebug)
            console.log("user.service / updateUserMutableProps / email : ", email);
        if (isDebug)
            console.log("user.service / updateUserMutableProps / name : ", name);
        if (isDebug)
            console.log("user.service / updateUserMutableProps / nickname : ", nickname);
        if (isDebug)
            console.log("user.service / updateUserMutableProps / gender : ", gender);
        if (isDebug)
            console.log("user.service / updateUserMutableProps / birthYear : ", birthYear);
        if (isDebug)
            console.log("user.service / updateUserMutableProps / birthMonth : ", birthMonth);
        if (isDebug)
            console.log("user.service / updateUserMutableProps / birthDay : ", birthDay);
        if (isDebug)
            console.log("user.service / updateUserMutableProps / thumbnail : ", thumbnail);
        if (isDebug)
            console.log("user.service / updateUserMutableProps / mobileHead : ", mobileHead);
        if (isDebug)
            console.log("user.service / updateUserMutableProps / mobileBody : ", mobileBody);
        if (isDebug)
            console.log("user.service / updateUserMutableProps / mobileTail : ", mobileTail);
        // POST
        var options = this.myRequest.getReqOptionCafeclassAPI(apiKey);
        var req_url = this.us.get(this.updateUserMutablesUrl);
        if (isDebug)
            console.log("user.service / updateUser / req_url : ", req_url);
        var params = {
            email: email,
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
            .then(this.myExtractor.extractData)
            .catch(this.myExtractor.handleError);
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
            .then(this.myExtractor.extractData)
            .catch(this.myExtractor.handleError);
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
            .then(this.myExtractor.extractData)
            .catch(this.myExtractor.handleError);
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
            .then(this.myExtractor.extractData)
            .catch(this.myExtractor.handleError);
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
            .then(this.myExtractor.extractData)
            .catch(this.myExtractor.handleError);
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
            .then(this.myExtractor.extractData)
            .catch(this.myExtractor.handleError);
    };
    UserService.prototype.confirmUserFacebook = function (apiKey, facebookId) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("user.service / confirmUserFacebook / 시작");
        if (isDebug)
            console.log("user.service / confirmUserFacebook / apiKey : ", apiKey);
        if (isDebug)
            console.log("user.service / confirmUserFacebook / facebookId : ", facebookId);
        // POST
        var headers = new http_1.Headers({
            'Content-Type': 'application/json',
            'Cafeclass-REST-API-Key': apiKey
        });
        var options = new http_1.RequestOptions({ headers: headers });
        var req_url = this.us.get(this.confirmUserFacebookUrl);
        if (isDebug)
            console.log("user.service / confirmUserFacebook / req_url : ", req_url);
        var params = {
            facebook_id: facebookId
        };
        return this.http.post(req_url, params, options)
            .toPromise()
            .then(this.myExtractor.extractData)
            .catch(this.myExtractor.handleError);
    };
    UserService.prototype.confirmUserNaver = function (apiKey, naverId) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("user.service / confirmUserNaver / 시작");
        if (isDebug)
            console.log("user.service / confirmUserNaver / apiKey : ", apiKey);
        if (isDebug)
            console.log("user.service / confirmUserNaver / naverId : ", naverId);
        // POST
        var headers = new http_1.Headers({
            'Content-Type': 'application/json',
            'Cafeclass-REST-API-Key': apiKey
        });
        var options = new http_1.RequestOptions({ headers: headers });
        var req_url = this.us.get(this.confirmUserNaverUrl);
        if (isDebug)
            console.log("user.service / confirmUserNaver / req_url : ", req_url);
        var params = {
            naver_id: naverId
        };
        return this.http.post(req_url, params, options)
            .toPromise()
            .then(this.myExtractor.extractData)
            .catch(this.myExtractor.handleError);
    };
    UserService.prototype.getUserCookie = function (apiKey) {
        // let isDebug:boolean = true;
        // let isDebug:boolean = false;
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
            .then(this.myExtractor.extractData)
            .catch(this.myExtractor.handleError);
    };
    UserService.prototype.deleteUserCookie = function () {
        var req_url = this.us.get(this.logoutUrl);
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("user.service / deleteUserCookie / 시작");
        if (isDebug)
            console.log("user.service / deleteUserCookie / req_url : ", req_url);
        return this.http.get(req_url)
            .toPromise()
            .then(this.myExtractor.extractData)
            .catch(this.myExtractor.handleError);
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
            .then(this.myExtractor.extractData)
            .catch(this.myExtractor.handleError);
    };
    UserService.prototype.updatePassword = function (apiKey, email, password) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("user.service / updatePassword / 시작");
        if (isDebug)
            console.log("user.service / updatePassword / apiKey : ", apiKey);
        if (isDebug)
            console.log("user.service / updatePassword / email : ", email);
        if (isDebug)
            console.log("user.service / updatePassword / password : ", password);
        // POST
        var options = this.myRequest.getReqOptionCafeclassAPI(apiKey);
        var req_url = this.us.get(this.updatePasswordUrl);
        if (isDebug)
            console.log("user.service / updatePassword / req_url : ", req_url);
        var params = {
            email: email,
            password: password
        };
        return this.http.post(req_url, params, options)
            .toPromise()
            .then(this.myExtractor.extractData)
            .catch(this.myExtractor.handleError);
    };
    UserService.prototype.getUserFromJSON = function (userJSON) {
        if (null == userJSON) {
            return null;
        }
        var user = new user_1.User(
        // public id:number,
        +userJSON["id"], 
        // public nickname:string,
        userJSON["nickname"], 
        // public name:string,
        userJSON["name"], 
        // public gender:string,
        userJSON["gender"], 
        // public birthday:string, 
        userJSON["birthday"], 
        // public thumbnail:string,
        userJSON["thumbnail"], 
        // public status:string,
        userJSON["status"], 
        // public permission:string,
        userJSON["permission"], 
        // public kakao_id:string,
        userJSON["kakao_id"], 
        // public naver_id:string,
        userJSON["naver_id"], 
        // public facebook_id:string,
        userJSON["facebook_id"], 
        // public google_id:string,
        userJSON["google_id"], 
        // public mobile:string,
        userJSON["mobile"], 
        // public email:string,
        userJSON["email"], 
        // public date_created:string,
        userJSON["date_created"], 
        // public date_updated:string          
        userJSON["date_updated"]);
        return user;
    };
    UserService.prototype.copyUser = function (user) {
        if (null == user) {
            return;
        }
        var copy = new user_1.User(
        // public id:number
        user.id, 
        // public nickname:string
        user.nickname, 
        // public name:string
        user.name, 
        // public gender:string
        user.gender, 
        // public birthday:string 
        user.birthday, 
        // public thumbnail:string
        user.thumbnail, 
        // public status:string
        user.status, 
        // public permission:string
        user.permission, 
        // public kakao_id:string
        user.kakao_id, 
        // public naver_id:string
        user.naver_id, 
        // public facebook_id:string
        user.facebook_id, 
        // public google_id:string
        user.google_id, 
        // public mobile:string
        user.mobile, 
        // public email:string
        user.email, 
        // public date_created:string
        user.date_created, 
        // public date_updated:string      
        user.date_updated);
        return copy;
    };
    UserService.prototype.isSameUser = function (userHead, userTail) {
        if (null == userHead || null == userTail) {
            return false;
        }
        if (userHead.id !== userTail.id) {
            return false;
        }
        else if (userHead.nickname !== userTail.nickname) {
            return false;
        }
        else if (userHead.name !== userTail.name) {
            return false;
        }
        else if (userHead.gender !== userTail.gender) {
            return false;
        }
        else if (userHead.birthday !== userTail.birthday) {
            return false;
        }
        else if (userHead.thumbnail !== userTail.thumbnail) {
            return false;
        }
        else if (userHead.status !== userTail.status) {
            return false;
        }
        else if (userHead.permission !== userTail.permission) {
            return false;
        }
        else if (userHead.kakao_id !== userTail.kakao_id) {
            return false;
        }
        else if (userHead.naver_id !== userTail.naver_id) {
            return false;
        }
        else if (userHead.facebook_id !== userTail.facebook_id) {
            return false;
        }
        else if (userHead.google_id !== userTail.google_id) {
            return false;
        }
        else if (userHead.mobile !== userTail.mobile) {
            return false;
        }
        else if (userHead.email !== userTail.email) {
            return false;
        }
        else if (userHead.date_created !== userTail.date_created) {
            return false;
        }
        else if (userHead.date_updated !== userTail.date_updated) {
            return false;
        }
        return true;
    };
    UserService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [url_service_1.UrlService, http_1.Http])
    ], UserService);
    return UserService;
}());
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map