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