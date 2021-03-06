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
        // 선생님의 수업 리뷰 가져오기
        this.fetchKlassReviewByTeacherUrl = '/CI/index.php/api/klass/fetchklassreviewbyteacher';
        // 학생 출석 상태 바꾸기
        this.updateAttendanceUrl = '/CI/index.php/api/klass/updateattendance';
        // 활동중인 수업만 가져오기
        this.fetchActiveKlassListUrl = '/CI/index.php/api/klass/fetchactiveklasslistbyteacher';
        // 모든 수업 가져오기
        this.fetchAllKlassListUrl = '/CI/index.php/api/klass/fetchallklassnlistbyteacher';
        this.getTeacherByMobileUrl = '/CI/index.php/api/teachers/mobile';
        this.getTeacherByEmailUrl = '/CI/index.php/api/teachers/email';
        this.getTeacherByUserIdUrl = '/CI/index.php/api/teachers/userid';
        this.insertTeacherUrl = '/CI/index.php/api/teachers/add';
        this.updateTeacherUrl = '/CI/index.php/api/teachers/update';
        this.myExtractor = new my_extractor_1.MyExtractor();
        this.myRequest = new my_request_1.MyRequest();
    }
    TeacherService.prototype.fetchKlassReviewByTeacher = function (apiKey, loginUserId, teacherId, klassId, pageNum, pageRowCnt) {
        if (this.isDebug())
            console.log("user.service / updateAttendance / 시작");
        if (this.isDebug())
            console.log("user.service / updateAttendance / apiKey : ", apiKey);
        if (this.isDebug())
            console.log("user.service / updateAttendance / loginUserId : ", loginUserId);
        if (this.isDebug())
            console.log("user.service / updateAttendance / teacherId : ", teacherId);
        if (this.isDebug())
            console.log("user.service / updateAttendance / klassId : ", klassId);
        if (this.isDebug())
            console.log("user.service / updateAttendance / pageNum : ", pageNum);
        if (this.isDebug())
            console.log("user.service / updateAttendance / pageRowCnt : ", pageRowCnt);
        // POST
        var options = this.myRequest.getReqOptionCafeclassAPI(apiKey);
        var req_url = this.urlService.get(this.fetchKlassReviewByTeacherUrl);
        var params = {
            login_user_id: loginUserId,
            teacher_id: teacherId,
            klass_id: klassId,
            page_num: pageNum,
            page_row_cnt: pageRowCnt
        };
        return this.http.post(req_url, params, options)
            .toPromise()
            .then(this.myExtractor.extractData)
            .catch(this.myExtractor.handleError);
    }; // end method  
    TeacherService.prototype.updateAttendance = function (apiKey, loginUserId, attedanceId, klassId, userId, klassAttendanceStatus) {
        if (this.isDebug())
            console.log("user.service / updateAttendance / 시작");
        if (this.isDebug())
            console.log("user.service / updateAttendance / apiKey : ", apiKey);
        if (this.isDebug())
            console.log("user.service / updateAttendance / loginUserId : ", loginUserId);
        if (this.isDebug())
            console.log("user.service / updateAttendance / attedanceId : ", attedanceId);
        if (this.isDebug())
            console.log("user.service / updateAttendance / klassId : ", klassId);
        if (this.isDebug())
            console.log("user.service / updateAttendance / userId : ", userId);
        if (this.isDebug())
            console.log("user.service / updateAttendance / klassAttendanceStatus : ", klassAttendanceStatus);
        // POST
        var options = this.myRequest.getReqOptionCafeclassAPI(apiKey);
        var req_url = this.urlService.get(this.updateAttendanceUrl);
        var params = {
            login_user_id: loginUserId,
            klass_attendance_id: attedanceId,
            klass_id: klassId,
            user_id: userId,
            klass_attendance_status: klassAttendanceStatus
        };
        return this.http.post(req_url, params, options)
            .toPromise()
            .then(this.myExtractor.extractData)
            .catch(this.myExtractor.handleError);
    }; // end method    
    TeacherService.prototype.fetchActiveKlassList = function (apiKey, pageNum, pageRowCnt, teacherId) {
        if (this.isDebug())
            console.log("user.service / fetchActiveKlassListUrl / 시작");
        if (this.isDebug())
            console.log("user.service / fetchActiveKlassListUrl / apiKey : ", apiKey);
        if (this.isDebug())
            console.log("user.service / fetchActiveKlassListUrl / pageNum : ", pageNum);
        if (this.isDebug())
            console.log("user.service / fetchActiveKlassListUrl / pageRowCnt : ", pageRowCnt);
        if (this.isDebug())
            console.log("user.service / fetchActiveKlassListUrl / teacherId : ", teacherId);
        // POST
        var options = this.myRequest.getReqOptionCafeclassAPI(apiKey);
        var req_url = this.urlService.get(this.fetchActiveKlassListUrl);
        var params = {
            page_num: pageNum,
            pageRowCnt: pageRowCnt,
            teacher_id: teacherId
        };
        return this.http.post(req_url, params, options)
            .toPromise()
            .then(this.myExtractor.extractData)
            .catch(this.myExtractor.handleError);
    }; // end method   
    TeacherService.prototype.fetchAllKlassList = function (apiKey, pageNum, pageRowCnt, teacherId) {
        if (this.isDebug())
            console.log("user.service / fetchAllKlassList / 시작");
        if (this.isDebug())
            console.log("user.service / fetchAllKlassList / apiKey : ", apiKey);
        if (this.isDebug())
            console.log("user.service / fetchAllKlassList / pageNum : ", pageNum);
        if (this.isDebug())
            console.log("user.service / fetchAllKlassList / pageRowCnt : ", pageRowCnt);
        if (this.isDebug())
            console.log("user.service / fetchAllKlassList / teacherId : ", teacherId);
        // POST
        var options = this.myRequest.getReqOptionCafeclassAPI(apiKey);
        var req_url = this.urlService.get(this.fetchAllKlassListUrl);
        var params = {
            page_num: pageNum,
            pageRowCnt: pageRowCnt,
            teacher_id: teacherId
        };
        return this.http.post(req_url, params, options)
            .toPromise()
            .then(this.myExtractor.extractData)
            .catch(this.myExtractor.handleError);
    }; // end method  
    TeacherService.prototype.insertTeacherByTeacher = function (apiKey, teacher) {
        return this.insertTeacher(
        // apiKey:string, 
        apiKey, 
        // userId:number,
        teacher.user_id, 
        // email:string, 
        teacher.email, 
        // name:string, 
        teacher.name, 
        // nickname:string, 
        teacher.nickname, 
        // resume:string, 
        teacher.resume, 
        // greeting:string, 
        teacher.greeting, 
        // gender:string,
        teacher.gender, 
        // birthYear:string,
        teacher.getBirthYear(), 
        // birthMonth:string,
        teacher.getBirthMonth(), 
        // birthDay:string,
        teacher.getBirthDay(), 
        // thumbnail:string,
        teacher.thumbnail, 
        // mobileHead:string,
        teacher.getMobileHead(), 
        // mobileBody:string,
        teacher.getMobileBody(), 
        // mobileTail:string
        teacher.getMobileTail());
    };
    TeacherService.prototype.insertTeacher = function (apiKey, userId, email, name, nickname, resume, greeting, gender, birthYear, birthMonth, birthDay, thumbnail, mobileHead, mobileBody, mobileTail) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("teacher.service / insertTeacher / 시작");
        if (isDebug)
            console.log("teacher.service / insertTeacher / apiKey : ", apiKey);
        if (isDebug)
            console.log("teacher.service / insertTeacher / userId : ", userId);
        if (isDebug)
            console.log("teacher.service / insertTeacher / email : ", email);
        if (isDebug)
            console.log("teacher.service / insertTeacher / name : ", name);
        if (isDebug)
            console.log("teacher.service / insertTeacher / nickname : ", nickname);
        if (isDebug)
            console.log("teacher.service / insertTeacher / resume : ", resume);
        if (isDebug)
            console.log("teacher.service / insertTeacher / greeting : ", greeting);
        if (isDebug)
            console.log("teacher.service / insertTeacher / gender : ", gender);
        if (isDebug)
            console.log("teacher.service / insertTeacher / birthYear : ", birthYear);
        if (isDebug)
            console.log("teacher.service / insertTeacher / birthMonth : ", birthMonth);
        if (isDebug)
            console.log("teacher.service / insertTeacher / birthDay : ", birthDay);
        if (isDebug)
            console.log("teacher.service / insertTeacher / thumbnail : ", thumbnail);
        if (isDebug)
            console.log("teacher.service / insertTeacher / mobileHead : ", mobileHead);
        if (isDebug)
            console.log("teacher.service / insertTeacher / mobileBody : ", mobileBody);
        if (isDebug)
            console.log("teacher.service / insertTeacher / mobileTail : ", mobileTail);
        // POST
        var options = this.myRequest.getReqOptionCafeclassAPI(apiKey);
        var req_url = this.urlService.get(this.insertTeacherUrl);
        if (isDebug)
            console.log("teacher.service / insertTeacher / req_url : ", req_url);
        var params = {
            user_id: userId,
            email: email,
            name: name,
            nickname: nickname,
            resume: resume,
            greeting: greeting,
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
    }; // end method 
    TeacherService.prototype.updateTeacherByTeacher = function (apiKey, teacher) {
        var mobileArr = teacher.getMobileArr();
        var birthdayArr = teacher.getBirthdayArr();
        return this.updateTeacher(
        // apiKey:string, 
        apiKey, 
        // userId:number,
        teacher.user_id, 
        // nickname:string, 
        teacher.nickname, 
        // resume:string, 
        teacher.resume, 
        // greeting:string, 
        teacher.greeting, 
        // gender:string,
        teacher.gender, 
        // birthYear:string,
        birthdayArr[0], 
        // birthMonth:string,
        birthdayArr[1], 
        // birthDay:string,
        birthdayArr[2], 
        // thumbnail:string,
        teacher.thumbnail, 
        // mobileHead:string,
        mobileArr[0], 
        // mobileBody:string,
        mobileArr[1], 
        // mobileTail:string
        mobileArr[2]);
    };
    TeacherService.prototype.updateTeacher = function (apiKey, userId, nickname, resume, greeting, gender, birthYear, birthMonth, birthDay, thumbnail, mobileHead, mobileBody, mobileTail) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("teacher.service / updateTeacher / 시작");
        if (isDebug)
            console.log("teacher.service / updateTeacher / apiKey : ", apiKey);
        if (isDebug)
            console.log("teacher.service / updateTeacher / userId : ", userId);
        if (isDebug)
            console.log("teacher.service / updateTeacher / nickname : ", nickname);
        if (isDebug)
            console.log("teacher.service / updateTeacher / resume : ", resume);
        if (isDebug)
            console.log("teacher.service / updateTeacher / greeting : ", greeting);
        if (isDebug)
            console.log("teacher.service / updateTeacher / gender : ", gender);
        if (isDebug)
            console.log("teacher.service / updateTeacher / birthYear : ", birthYear);
        if (isDebug)
            console.log("teacher.service / updateTeacher / birthMonth : ", birthMonth);
        if (isDebug)
            console.log("teacher.service / updateTeacher / birthDay : ", birthDay);
        if (isDebug)
            console.log("teacher.service / updateTeacher / thumbnail : ", thumbnail);
        if (isDebug)
            console.log("teacher.service / updateTeacher / mobileHead : ", mobileHead);
        if (isDebug)
            console.log("teacher.service / updateTeacher / mobileBody : ", mobileBody);
        if (isDebug)
            console.log("teacher.service / updateTeacher / mobileTail : ", mobileTail);
        // POST
        var options = this.myRequest.getReqOptionCafeclassAPI(apiKey);
        var req_url = this.urlService.get(this.updateTeacherUrl);
        if (isDebug)
            console.log("teacher.service / updateTeacher / req_url : ", req_url);
        var params = {
            user_id: userId,
            nickname: nickname,
            resume: resume,
            greeting: greeting,
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
    }; // end method 
    TeacherService.prototype.getTeacher = function (apiKey, userId) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("teacher.service / getTeacher / 시작");
        if (isDebug)
            console.log("teacher.service / getTeacher / userId : ", userId);
        // POST
        var options = this.myRequest.getReqOptionCafeclassAPI(apiKey);
        var req_url = this.urlService.get(this.getTeacherByUserIdUrl);
        if (isDebug)
            console.log("teacher.service / getTeacher / req_url : ", req_url);
        var params = {
            user_id: userId
        };
        return this.http.post(req_url, params, options)
            .toPromise()
            .then(this.myExtractor.extractData)
            .catch(this.myExtractor.handleError);
    };
    TeacherService.prototype.getTeacherByMobile = function (apiKey, mobileHead, mobileBody, mobileTail) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("teacher.service / getTeacherByMobile / 시작");
        if (isDebug)
            console.log("teacher.service / getTeacherByMobile / mobileHead : ", mobileHead);
        if (isDebug)
            console.log("teacher.service / getTeacherByMobile / mobileBody : ", mobileBody);
        if (isDebug)
            console.log("teacher.service / getTeacherByMobile / mobileTail : ", mobileTail);
        // POST
        var options = this.myRequest.getReqOptionCafeclassAPI(apiKey);
        var req_url = this.urlService.get(this.getTeacherByMobileUrl);
        if (isDebug)
            console.log("teacher.service / getTeacherByMobile / req_url : ", req_url);
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
    TeacherService.prototype.getTeacherByEmail = function (apiKey, email) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("teacher.service / getUserByEmail / 시작");
        if (isDebug)
            console.log("teacher.service / getUserByEmail / email : ", email);
        // POST
        var options = this.myRequest.getReqOptionCafeclassAPI(apiKey);
        var req_url = this.urlService.get(this.getTeacherByEmailUrl);
        if (isDebug)
            console.log("teacher.service / getUserByEmail / req_url : ", req_url);
        var params = {
            email: email
        };
        return this.http.post(req_url, params, options)
            .toPromise()
            .then(this.myExtractor.extractData)
            .catch(this.myExtractor.handleError);
    };
    TeacherService.prototype.getTeacherFromUser = function (user) {
        if (null == user) {
            return null;
        }
        var newTeacher = new teacher_1.Teacher().set(
        // public id:number,
        -1, 
        // public user_id:number,
        +user.id, 
        // public nickname:string,
        user.nickname, 
        // public name:string,
        user.name, 
        // public gender:string,
        user.gender, 
        // public resume:string,
        "", 
        // public greeting:string,
        "", 
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
    }; // end method
    TeacherService.prototype.getTeacherFromJSON = function (jsonObj) {
        if (null == jsonObj) {
            return null;
        }
        return new teacher_1.Teacher().setJSON(jsonObj);
    };
    // @ Common
    TeacherService.prototype.setWatchTower = function (watchTower) {
        this.watchTower = watchTower;
    };
    TeacherService.prototype.isDebug = function () {
        if (null == this.watchTower) {
            return false;
        }
        return this.watchTower.isDebug();
    };
    TeacherService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [url_service_1.UrlService, http_1.Http])
    ], TeacherService);
    return TeacherService;
}());
exports.TeacherService = TeacherService;
//# sourceMappingURL=teacher.service.js.map