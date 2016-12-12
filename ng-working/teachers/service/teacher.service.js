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
var teacher_1 = require("../model/teacher");
var TeacherService = (function () {
    function TeacherService(urlService, http) {
        this.urlService = urlService;
        this.http = http;
        this.getTeacherByEmailUrl = '/CI/index.php/api/teachers/email';
        this.myExtractor = new my_extractor_1.MyExtractor();
        this.myRequest = new my_request_1.MyRequest();
    }
    TeacherService.prototype.getTeacherByEmail = function (email) {
        // TODO 이메일로 사용자를 조회.
        // 개인 정보 유출 경로가 될 수 있으므로 POST 전송 및 API 키 사용 필요. 
        var req_url = this.urlService.get(this.getTeacherByEmailUrl);
        req_url = req_url + "?q=" + email;
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("teacher.service / getUserByEmail / 시작");
        if (isDebug)
            console.log("teacher.service / getUserByEmail / email : ", email);
        if (isDebug)
            console.log("teacher.service / getUserByEmail / req_url : ", req_url);
        return this.http.get(req_url)
            .toPromise()
            .then(this.myExtractor.extractData)
            .catch(this.myExtractor.handleError);
    };
    TeacherService.prototype.getTeacherFromUser = function (user) {
        if (null == user) {
            return null;
        }
        var newTeacher = new teacher_1.Teacher(
        // public id:number,
        -1, 
        // public nickname:string,
        user.nickname, 
        // public name:string,
        user.name, 
        // public gender:string,
        user.gender, 
        // public birthday:string, 
        user.birthday, 
        // public thumbnail:string,
        user.thumbnail, 
        // public status:string,
        "", 
        // public permission:string,
        "", 
        // public mobile:string,
        user.mobile, 
        // public email:string,
        user.email, 
        // public date_created:string,
        "", 
        // public date_updated:string
        "");
        return newTeacher;
    };
    TeacherService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [url_service_1.UrlService, http_1.Http])
    ], TeacherService);
    return TeacherService;
}());
exports.TeacherService = TeacherService;
//# sourceMappingURL=teacher.service.js.map