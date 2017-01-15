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
var AdminService = (function () {
    function AdminService(us, http) {
        this.us = us;
        this.http = http;
        this.fetchBuyKlassUrl = '/CI/index.php/api/admin/fetchbuyklass';
        this.updateKlassUrl = '/CI/index.php/api/admin/updateklass';
        this.fetchKlassListUrl = '/CI/index.php/api/admin/fetchklasslist';
        this.updateTeacherUrl = '/CI/index.php/api/admin/updateteacher';
        this.fetchTeacherListV2Url = '/CI/index.php/api/admin/fetchteacherlist';
        this.updateUserUrl = '/CI/index.php/api/admin/updateuser';
        this.fetchUserListV2Url = '/CI/index.php/api/admin/fetchuserlist';
        this.myExtractor = new my_extractor_1.MyExtractor();
        this.myRequest = new my_request_1.MyRequest();
    }
    AdminService.prototype.setWatchTower = function (watchTower) {
        this.watchTower = watchTower;
    };
    AdminService.prototype.isDebug = function () {
        if (null == this.watchTower) {
            return false;
        }
        return this.watchTower.isDebug();
    }; // end method
    AdminService.prototype.fetchBuyKlass = function (apiKey, pageNum, pageRowCnt, klassId, userId) {
        if (this.isDebug())
            console.log("admin.service / fetchBuyKlass / 시작");
        if (this.isDebug())
            console.log("admin.service / fetchBuyKlass / apiKey : ", apiKey);
        if (this.isDebug())
            console.log("admin.service / fetchBuyKlass / pageNum : ", pageNum);
        if (this.isDebug())
            console.log("admin.service / fetchBuyKlass / pageRowCnt : ", pageRowCnt);
        if (this.isDebug())
            console.log("admin.service / fetchBuyKlass / klassId : ", klassId);
        if (this.isDebug())
            console.log("admin.service / fetchBuyKlass / userId : ", userId);
        // POST
        var options = this.myRequest.getReqOptionCafeclassAPI(apiKey);
        var req_url = this.us.get(this.fetchBuyKlassUrl);
        var params = {
            page_num: pageNum,
            pageRowCnt: pageRowCnt,
            klass_id: klassId,
            user_id: userId
        };
        return this.http.post(req_url, params, options)
            .toPromise()
            .then(this.myExtractor.extractData)
            .catch(this.myExtractor.handleError);
    };
    AdminService.prototype.updateKlass = function (apiKey, userIdAdmin, klassId, klassStatus) {
        if (this.isDebug())
            console.log("admin.service / updateKlass / 시작");
        if (this.isDebug())
            console.log("admin.service / updateKlass / apiKey : ", apiKey);
        if (this.isDebug())
            console.log("admin.service / updateKlass / userIdAdmin : ", userIdAdmin);
        if (this.isDebug())
            console.log("admin.service / updateKlass / klassId : ", klassId);
        // POST
        var options = this.myRequest.getReqOptionCafeclassAPI(apiKey);
        var req_url = this.us.get(this.updateKlassUrl);
        var params = {
            user_id_admin: userIdAdmin,
            klass_id: klassId,
            klass_status: klassStatus
        };
        return this.http.post(req_url, params, options)
            .toPromise()
            .then(this.myExtractor.extractData)
            .catch(this.myExtractor.handleError);
    };
    AdminService.prototype.fetchKlassList = function (apiKey, pageNum, pageRowCnt, searchQuery, klassStatus, klassLevel, klassSubwayLine, klassSubwayStation, klassDays, klassTime) {
        if (this.isDebug())
            console.log("admin.service / fetchKlassList / 시작");
        if (this.isDebug())
            console.log("admin.service / fetchKlassList / apiKey : ", apiKey);
        if (this.isDebug())
            console.log("admin.service / fetchKlassList / pageNum : ", pageNum);
        if (this.isDebug())
            console.log("admin.service / fetchKlassList / pageRowCnt : ", pageRowCnt);
        if (this.isDebug())
            console.log("admin.service / fetchKlassList / searchQuery : ", searchQuery);
        if (this.isDebug())
            console.log("admin.service / fetchKlassList / klassStatus : ", klassStatus);
        if (this.isDebug())
            console.log("admin.service / fetchKlassList / klassLevel : ", klassLevel);
        if (this.isDebug())
            console.log("admin.service / fetchKlassList / klassSubwayLine : ", klassSubwayLine);
        if (this.isDebug())
            console.log("admin.service / fetchKlassList / klassSubwayStation : ", klassSubwayStation);
        if (this.isDebug())
            console.log("admin.service / fetchKlassList / klassDays : ", klassDays);
        if (this.isDebug())
            console.log("admin.service / fetchKlassList / klassTime : ", klassTime);
        // POST
        var options = this.myRequest.getReqOptionCafeclassAPI(apiKey);
        var req_url = this.us.get(this.fetchKlassListUrl);
        var params = {
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
    AdminService.prototype.updateTeacher = function (apiKey, userIdAdmin, teacherId, teacherStatus) {
        if (this.isDebug())
            console.log("admin.service / updateTeacher / 시작");
        if (this.isDebug())
            console.log("admin.service / updateTeacher / apiKey : ", apiKey);
        if (this.isDebug())
            console.log("admin.service / updateTeacher / userIdAdmin : ", userIdAdmin);
        if (this.isDebug())
            console.log("admin.service / updateTeacher / teacherId : ", teacherId);
        // POST
        var options = this.myRequest.getReqOptionCafeclassAPI(apiKey);
        var req_url = this.us.get(this.updateTeacherUrl);
        var params = {
            user_id_admin: userIdAdmin,
            teacher_id: teacherId,
            teacher_status: teacherStatus
        };
        return this.http.post(req_url, params, options)
            .toPromise()
            .then(this.myExtractor.extractData)
            .catch(this.myExtractor.handleError);
    };
    AdminService.prototype.fetchTeacherListV2 = function (apiKey, pageNum, pageRowCnt, searchQuery, teacherStatus) {
        if (this.isDebug())
            console.log("admin.service / fetchTeacherListV2 / 시작");
        if (this.isDebug())
            console.log("admin.service / fetchTeacherListV2 / apiKey : ", apiKey);
        if (this.isDebug())
            console.log("admin.service / fetchTeacherListV2 / pageNum : ", pageNum);
        if (this.isDebug())
            console.log("admin.service / fetchTeacherListV2 / pageRowCnt : ", pageRowCnt);
        if (this.isDebug())
            console.log("admin.service / fetchTeacherListV2 / searchQuery : ", searchQuery);
        if (this.isDebug())
            console.log("admin.service / fetchTeacherListV2 / teacherStatus : ", teacherStatus);
        // POST
        var options = this.myRequest.getReqOptionCafeclassAPI(apiKey);
        var req_url = this.us.get(this.fetchTeacherListV2Url);
        var params = {
            page_num: pageNum,
            pageRowCnt: pageRowCnt,
            search_query: searchQuery,
            teacher_status: teacherStatus
        };
        return this.http.post(req_url, params, options)
            .toPromise()
            .then(this.myExtractor.extractData)
            .catch(this.myExtractor.handleError);
    };
    AdminService.prototype.updateUser = function (apiKey, userIdAdmin, userId, userStatus, userPermission) {
        if (this.isDebug())
            console.log("admin.service / updateUser / 시작");
        if (this.isDebug())
            console.log("admin.service / updateUser / apiKey : ", apiKey);
        // POST
        var options = this.myRequest.getReqOptionCafeclassAPI(apiKey);
        var req_url = this.us.get(this.updateUserUrl);
        var params = {
            user_id_admin: userIdAdmin,
            user_id: userId,
            user_status: userStatus,
            user_permission: userPermission
        };
        return this.http.post(req_url, params, options)
            .toPromise()
            .then(this.myExtractor.extractData)
            .catch(this.myExtractor.handleError);
    };
    AdminService.prototype.fetchUserListV2 = function (apiKey, pageNum, pageRowCnt, searchQuery, userStatus, userPermission) {
        if (this.isDebug())
            console.log("admin.service / fetchUserListV2 / 시작");
        if (this.isDebug())
            console.log("admin.service / fetchUserListV2 / apiKey : ", apiKey);
        if (this.isDebug())
            console.log("admin.service / fetchUserListV2 / pageNum : ", pageNum);
        if (this.isDebug())
            console.log("admin.service / fetchUserListV2 / pageRowCnt : ", pageRowCnt);
        if (this.isDebug())
            console.log("admin.service / fetchUserListV2 / searchQuery : ", searchQuery);
        if (this.isDebug())
            console.log("admin.service / fetchUserListV2 / userStatus : ", userStatus);
        if (this.isDebug())
            console.log("admin.service / fetchUserListV2 / userPermission : ", userPermission);
        // POST
        var options = this.myRequest.getReqOptionCafeclassAPI(apiKey);
        var req_url = this.us.get(this.fetchUserListV2Url);
        var params = {
            page_num: pageNum,
            pageRowCnt: pageRowCnt,
            search_query: searchQuery,
            user_status: userStatus,
            user_permission: userPermission
        };
        return this.http.post(req_url, params, options)
            .toPromise()
            .then(this.myExtractor.extractData)
            .catch(this.myExtractor.handleError);
    };
    AdminService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [url_service_1.UrlService, http_1.Http])
    ], AdminService);
    return AdminService;
}());
exports.AdminService = AdminService; // end class
//# sourceMappingURL=admin.service.js.map