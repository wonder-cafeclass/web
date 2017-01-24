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
var url_service_1 = require("./util/url.service");
var my_extractor_1 = require('./util/http/my-extractor');
var my_request_1 = require('./util/http/my-request');
var AuthService = (function () {
    function AuthService(us, http) {
        this.us = us;
        this.http = http;
        this.adminAuthUrl = '/CI/index.php/api/admin/auth';
        this.fetchInitUrl = '/CI/index.php/api/init/fetchInit';
        this.myExtractor = new my_extractor_1.MyExtractor();
        this.myRequest = new my_request_1.MyRequest();
    }
    AuthService.prototype.setWatchTower = function (watchTower) {
        this.watchTower = watchTower;
    };
    AuthService.prototype.isDebug = function () {
        if (null == this.watchTower) {
            return false;
        }
        return this.watchTower.isDebug();
    };
    AuthService.prototype.getAdminAuth = function () {
        var req_url = this.us.get(this.adminAuthUrl);
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("auth.service / getAdminAuth / 시작");
        if (isDebug)
            console.log("auth.service / getAdminAuth / req_url : ", req_url);
        return this.http.get(req_url)
            .toPromise()
            .then(this.myExtractor.extractData)
            .catch(this.myExtractor.handleError);
    };
    AuthService.prototype.fetchInit = function () {
        // wonder.jung
        if (this.isDebug())
            console.log("user.service / fetchKlassNStudentList / 시작");
        // POST
        var req_url = this.us.get(this.fetchInitUrl);
        var params = {};
        return this.http.post(req_url, params)
            .toPromise()
            .then(this.myExtractor.extractData)
            .catch(this.myExtractor.handleError);
    };
    AuthService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [url_service_1.UrlService, http_1.Http])
    ], AuthService);
    return AuthService;
}());
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map