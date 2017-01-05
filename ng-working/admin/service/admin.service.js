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
    AdminService.prototype.fetchTeacherListV2 = function (apiKey, pageNum, pageSize, searchQuery, teacherStatus) {
        if (this.isDebug())
            console.log("admin.service / fetchTeacherListV2 / 시작");
        if (this.isDebug())
            console.log("admin.service / fetchTeacherListV2 / apiKey : ", apiKey);
        if (this.isDebug())
            console.log("admin.service / fetchTeacherListV2 / pageNum : ", pageNum);
        if (this.isDebug())
            console.log("admin.service / fetchTeacherListV2 / pageSize : ", pageSize);
        if (this.isDebug())
            console.log("admin.service / fetchTeacherListV2 / searchQuery : ", searchQuery);
        if (this.isDebug())
            console.log("admin.service / fetchTeacherListV2 / teacherStatus : ", teacherStatus);
        // POST
        var options = this.myRequest.getReqOptionCafeclassAPI(apiKey);
        var req_url = this.us.get(this.fetchTeacherListV2Url);
        var params = {
            page_num: pageNum,
            page_size: pageSize,
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
    AdminService.prototype.fetchUserListV2 = function (apiKey, pageNum, pageSize, searchQuery, userStatus, userPermission) {
        if (this.isDebug())
            console.log("admin.service / fetchUserListV2 / 시작");
        if (this.isDebug())
            console.log("admin.service / fetchUserListV2 / apiKey : ", apiKey);
        if (this.isDebug())
            console.log("admin.service / fetchUserListV2 / pageNum : ", pageNum);
        if (this.isDebug())
            console.log("admin.service / fetchUserListV2 / pageSize : ", pageSize);
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
            page_size: pageSize,
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