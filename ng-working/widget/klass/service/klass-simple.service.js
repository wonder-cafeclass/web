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
var url_service_1 = require('../../../util/url.service');
var my_extractor_1 = require('../../../util/http/my-extractor');
var my_request_1 = require('../../../util/http/my-request');
var KlassSimpleService = (function () {
    function KlassSimpleService(http, urlService) {
        this.http = http;
        this.urlService = urlService;
        this.fetchKlassListUrl = '/CI/index.php/api/klass/fetchklasslist';
        this.addKlassEmptyUrl = '/CI/index.php/api/klass/addklassempty';
        this.myExtractor = new my_extractor_1.MyExtractor();
        this.myRequest = new my_request_1.MyRequest();
    }
    KlassSimpleService.prototype.setWatchTower = function (watchTower) {
        this.watchTower = watchTower;
    };
    KlassSimpleService.prototype.isDebug = function () {
        if (null == this.watchTower) {
            return false;
        }
        return this.watchTower.isDebug();
    };
    KlassSimpleService.prototype.fetchKlassList = function (apiKey, loginUserId, pageNum, pageRowCnt, searchQuery, klassStatus, klassLevel, klassSubwayLine, klassSubwayStation, klassDays, klassTime) {
        if (this.isDebug())
            console.log("ks.service / fetchKlassList / 시작");
        if (this.isDebug())
            console.log("ks.service / fetchKlassList / apiKey : ", apiKey);
        if (this.isDebug())
            console.log("ks.service / fetchKlassList / loginUserId : ", loginUserId);
        if (this.isDebug())
            console.log("ks.service / fetchKlassList / pageNum : ", pageNum);
        if (this.isDebug())
            console.log("ks.service / fetchKlassList / pageRowCnt : ", pageRowCnt);
        if (this.isDebug())
            console.log("ks.service / fetchKlassList / searchQuery : ", searchQuery);
        if (this.isDebug())
            console.log("ks.service / fetchKlassList / klassStatus : ", klassStatus);
        if (this.isDebug())
            console.log("ks.service / fetchKlassList / klassLevel : ", klassLevel);
        if (this.isDebug())
            console.log("ks.service / fetchKlassList / klassSubwayLine : ", klassSubwayLine);
        if (this.isDebug())
            console.log("ks.service / fetchKlassList / klassSubwayStation : ", klassSubwayStation);
        if (this.isDebug())
            console.log("ks.service / fetchKlassList / klassDays : ", klassDays);
        if (this.isDebug())
            console.log("ks.service / fetchKlassList / klassTime : ", klassTime);
        if ("" === klassStatus) {
            klassStatus = "E"; // Open - 개강
        }
        // POST
        var options = this.myRequest.getReqOptionCafeclassAPI(apiKey);
        var req_url = this.urlService.get(this.fetchKlassListUrl);
        var params = {
            login_user_id: loginUserId,
            page_num: pageNum,
            pageRowCnt: pageRowCnt,
            search_query: searchQuery,
            klass_status: klassStatus,
            klass_level: klassLevel,
            klass_subway_line: klassSubwayLine,
            klass_subway_station: klassSubwayStation,
            klass_days: klassDays,
            klass_time: klassTime
        };
        return this.http.post(req_url, params, options)
            .toPromise()
            .then(this.myExtractor.extractData)
            .catch(this.myExtractor.handleError);
    };
    KlassSimpleService.prototype.addKlassEmpty = function (apiKey, userId, teacherId, teacherResume, teacherGreeting) {
        if (this.isDebug())
            console.log("ks.service / addKlassEmpty / 시작");
        if (this.isDebug())
            console.log("ks.service / addKlassEmpty / apiKey : ", apiKey);
        if (this.isDebug())
            console.log("ks.service / addKlassEmpty / userId : ", userId);
        if (this.isDebug())
            console.log("ks.service / addKlassEmpty / teacherId : ", teacherId);
        if (this.isDebug())
            console.log("ks.service / addKlassEmpty / teacherResume : ", teacherResume);
        if (this.isDebug())
            console.log("ks.service / addKlassEmpty / teacherGreeting : ", teacherGreeting);
        // POST
        var options = this.myRequest.getReqOptionCafeclassAPI(apiKey);
        var req_url = this.urlService.get(this.addKlassEmptyUrl);
        var params = {
            user_id: userId,
            teacher_id: teacherId,
            teacher_resume: teacherResume,
            teacher_greeting: teacherGreeting
        };
        return this.http.post(req_url, params, options)
            .toPromise()
            .then(this.myExtractor.extractData)
            .catch(this.myExtractor.handleError);
    };
    KlassSimpleService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http, url_service_1.UrlService])
    ], KlassSimpleService);
    return KlassSimpleService;
}());
exports.KlassSimpleService = KlassSimpleService; // end class
//# sourceMappingURL=klass-simple.service.js.map