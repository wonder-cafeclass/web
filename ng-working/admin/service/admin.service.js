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
        this.updateUserUrl = '/CI/index.php/api/admin/updateuser';
        this.fetchUserListPaginationUrl = '/CI/index.php/api/admin/userlistpagination';
        this.fetchUserListUrl = '/CI/index.php/api/admin/userlist';
        this.updateTeacherUrl = '/CI/index.php/api/admin/updateteacher';
        this.fetchTeacherTotalCntUrl = '/CI/index.php/api/admin/teacherpagination';
        this.fetchTeacherListUrl = '/CI/index.php/api/admin/teacherlist';
        this.fetchUserAdminTotalCntUrl = '/CI/index.php/api/admin/usersadminpagination';
        this.fetchUserAdminListUrl = '/CI/index.php/api/admin/usersadmin';
        this.searchUserAdminUrl = '/CI/index.php/api/admin/searchusersadmin';
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
    AdminService.prototype.fetchUserList = function (apiKey, pageNum, pageSize) {
        if (this.isDebug())
            console.log("admin.service / fetchUserList / 시작");
        if (this.isDebug())
            console.log("admin.service / fetchUserList / apiKey : ", apiKey);
        if (this.isDebug())
            console.log("admin.service / fetchUserList / pageNum : ", pageNum);
        if (this.isDebug())
            console.log("admin.service / fetchUserList / pageSize : ", pageSize);
        // POST
        var options = this.myRequest.getReqOptionCafeclassAPI(apiKey);
        var req_url = this.us.get(this.fetchUserListUrl);
        var params = {
            page_num: pageNum,
            page_size: pageSize,
        };
        return this.http.post(req_url, params, options)
            .toPromise()
            .then(this.myExtractor.extractData)
            .catch(this.myExtractor.handleError);
    };
    AdminService.prototype.fetchUserListPagination = function (apiKey) {
        if (this.isDebug())
            console.log("admin.service / fetchUserListPagination / 시작");
        if (this.isDebug())
            console.log("admin.service / fetchUserListPagination / apiKey : ", apiKey);
        // POST
        var options = this.myRequest.getReqOptionCafeclassAPI(apiKey);
        var req_url = this.us.get(this.fetchUserListPaginationUrl);
        var params = {};
        return this.http.post(req_url, params, options)
            .toPromise()
            .then(this.myExtractor.extractData)
            .catch(this.myExtractor.handleError);
    };
    AdminService.prototype.updateTeacher = function (apiKey, userIdAdmin, teacherId, teacherStatus) {
        if (this.isDebug())
            console.log("admin.service / updateUser / 시작");
        if (this.isDebug())
            console.log("admin.service / updateUser / apiKey : ", apiKey);
        if (this.isDebug())
            console.log("admin.service / updateUser / userIdAdmin : ", userIdAdmin);
        if (this.isDebug())
            console.log("admin.service / updateUser / teacherId : ", teacherId);
        if (this.isDebug())
            console.log("admin.service / updateUser / teacherStatus : ", teacherStatus);
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
    AdminService.prototype.fetchTeacherList = function (apiKey, pageNum, pageSize) {
        if (this.isDebug())
            console.log("admin.service / fetchTeachersPagination / 시작");
        if (this.isDebug())
            console.log("admin.service / fetchTeachersPagination / apiKey : ", apiKey);
        if (this.isDebug())
            console.log("admin.service / fetchTeachersPagination / pageNum : ", pageNum);
        if (this.isDebug())
            console.log("admin.service / fetchTeachersPagination / pageSize : ", pageSize);
        // POST
        var options = this.myRequest.getReqOptionCafeclassAPI(apiKey);
        var req_url = this.us.get(this.fetchTeacherListUrl);
        var params = {
            page_num: pageNum,
            page_size: pageSize,
        };
        return this.http.post(req_url, params, options)
            .toPromise()
            .then(this.myExtractor.extractData)
            .catch(this.myExtractor.handleError);
    };
    AdminService.prototype.fetchTeachersPagination = function (apiKey) {
        if (this.isDebug())
            console.log("admin.service / fetchTeachersPagination / 시작");
        if (this.isDebug())
            console.log("admin.service / fetchTeachersPagination / apiKey : ", apiKey);
        // POST
        var options = this.myRequest.getReqOptionCafeclassAPI(apiKey);
        var req_url = this.us.get(this.fetchTeacherTotalCntUrl);
        var params = {};
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
    AdminService.prototype.fetchUsersAdminPagination = function (apiKey) {
        if (this.isDebug())
            console.log("admin.service / fetchUsersAdminPagination / 시작");
        if (this.isDebug())
            console.log("admin.service / fetchUsersAdminPagination / apiKey : ", apiKey);
        // POST
        var options = this.myRequest.getReqOptionCafeclassAPI(apiKey);
        var req_url = this.us.get(this.fetchUserAdminTotalCntUrl);
        var params = {};
        return this.http.post(req_url, params, options)
            .toPromise()
            .then(this.myExtractor.extractData)
            .catch(this.myExtractor.handleError);
    };
    AdminService.prototype.fetchUsersAdmin = function (apiKey, pageNum, pageSize) {
        if (this.isDebug())
            console.log("admin.service / fetchUsersAdmin / 시작");
        if (this.isDebug())
            console.log("admin.service / fetchUsersAdmin / apiKey : ", apiKey);
        if (this.isDebug())
            console.log("admin.service / fetchUsersAdmin / pageNum : ", pageNum);
        if (this.isDebug())
            console.log("admin.service / fetchUsersAdmin / pageSize : ", pageSize);
        // POST
        var options = this.myRequest.getReqOptionCafeclassAPI(apiKey);
        var req_url = this.us.get(this.fetchUserAdminListUrl);
        var params = {
            page_num: pageNum,
            page_size: pageSize,
        };
        return this.http.post(req_url, params, options)
            .toPromise()
            .then(this.myExtractor.extractData)
            .catch(this.myExtractor.handleError);
    }; // end method
    AdminService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [url_service_1.UrlService, http_1.Http])
    ], AdminService);
    return AdminService;
}());
exports.AdminService = AdminService; // end class
//# sourceMappingURL=admin.service.js.map