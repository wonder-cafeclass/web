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
var MyLoggerService = (function () {
    function MyLoggerService(us, http) {
        this.us = us;
        this.http = http;
        this.apiLogActionPageUrl = '/CI/index.php/api/log/page';
        this.apiLogErrorUrl = '/CI/index.php/api/log/error';
        this.pageTypeLogin = "LOG_IN";
        this.pageTypeLogout = "LOG_OUT";
        this.pageTypeLoginFacebook = "LOG_IN_FACEBOOK";
        this.pageTypeLoginKakao = "LOG_IN_KAKAO";
        this.pageTypeLoginNaver = "LOG_IN_NAVER";
        this.pageTypeKlassList = "CLASS_LIST";
        this.pageTypePolicy = "POLICY";
        this.pageTypeSignup = "SIGNUP";
        this.pageTypeSignupTeacher = "SIGNUP_TEACHER";
        this.pageTypeSignupSelect = "SIGNUP_SELECT";
        this.pageTypeMyInfo = "MY_INFO";
        this.pageTypeApplyTeacherTerm = "APPLY_TEACHER_TERM";
        this.errorTypeNotValidValue = "NOT_VALID_VALUE";
        this.errorTypeUnknownError = "UNKNOWN_ERROR";
        this.errorAPIFailed = "API_FAILED";
        this.myExtractor = new my_extractor_1.MyExtractor();
    }
    MyLoggerService.prototype.logActionPage = function (apiKey, pageType) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("my-logger.service / logActionPage / 시작");
        if (null == apiKey || "" == apiKey) {
            if (isDebug)
                console.log("my-logger.service / logActionPage / 중단 / apiKey is not valid!");
            return Promise.resolve(null);
        }
        if (null == pageType || "" == pageType) {
            if (isDebug)
                console.log("my-logger.service / logActionPage / 중단 / pageType is not valid!");
            return Promise.resolve(null);
        }
        // POST
        var headers = new http_1.Headers({
            'Content-Type': 'application/json',
            'Cafeclass-REST-API-Key': apiKey
        });
        var options = new http_1.RequestOptions({ headers: headers });
        var req_url = this.us.get(this.apiLogActionPageUrl);
        if (isDebug)
            console.log("my-logger.service / logActionPage / req_url : ", req_url);
        var path = window.location.href;
        if (isDebug)
            console.log("my-logger.service / logActionPage / path : ", path);
        var params = {
            page_type: pageType,
            page_uri: path
        };
        return this.http.post(req_url, params, options)
            .toPromise()
            .then(this.myExtractor.extractData)
            .catch(this.myExtractor.handleError);
    };
    MyLoggerService.prototype.logActionDirtyWord = function (apiKey, dirtyWord) {
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("my-logger.service / logActionDirtyWord / 시작");
        if (null == apiKey || "" == apiKey) {
            if (isDebug)
                console.log("my-logger.service / logActionDirtyWord / 중단 / apiKey is not valid!");
            return Promise.resolve(null);
        }
        if (null == dirtyWord || "" == dirtyWord) {
            if (isDebug)
                console.log("my-logger.service / logActionDirtyWord / 중단 / dirtyWord is not valid!");
            return Promise.resolve(null);
        }
        // Need to implement!
        /*
        let req_url = this.us.get(this.apiLogActionPageUrl);
        req_url += "?dirtyWord=" + dirtyWord;

        this.http.get(req_url).toPromise().then().catch();
        */
    };
    MyLoggerService.prototype.logError = function (apiKey, errorType, errorMsg) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("my-logger.service / logError / 시작");
        if (isDebug)
            console.log("my-logger.service / logError / apiKey : ", apiKey);
        if (isDebug)
            console.log("my-logger.service / logError / errorType : ", errorType);
        if (isDebug)
            console.log("my-logger.service / logError / errorMsg : ", errorMsg);
        if (null == apiKey || "" == apiKey) {
            if (isDebug)
                console.log("my-logger.service / logError / 중단 / apiKey is not valid!");
            return Promise.resolve(null);
        }
        if (null == errorType || "" == errorType) {
            if (isDebug)
                console.log("my-logger.service / logError / 중단 / errorType is not valid!");
            return Promise.resolve(null);
        }
        if (null == errorMsg || "" == errorMsg) {
            if (isDebug)
                console.log("my-logger.service / logError / 중단 / errorMsg is not valid!");
            return Promise.resolve(null);
        }
        // POST
        var headers = new http_1.Headers({
            'Content-Type': 'application/json',
            'Cafeclass-REST-API-Key': apiKey
        });
        var options = new http_1.RequestOptions({ headers: headers });
        var req_url = this.us.get(this.apiLogErrorUrl);
        if (isDebug)
            console.log("my-logger.service / logError / req_url : ", req_url);
        var params = {
            api_key: apiKey,
            error_type: errorType,
            error_msg: errorMsg
        };
        return this.http.post(req_url, params, options)
            .toPromise()
            .then(this.myExtractor.extractData)
            .catch(this.myExtractor.handleError);
    };
    MyLoggerService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [url_service_1.UrlService, http_1.Http])
    ], MyLoggerService);
    return MyLoggerService;
}());
exports.MyLoggerService = MyLoggerService;
//# sourceMappingURL=my-logger.service.js.map