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
var router_1 = require('@angular/router');
var login_service_1 = require('../service/login.service');
var my_logger_service_1 = require('../../util/service/my-logger.service');
var upload_service_1 = require('../../util/service/upload.service');
var url_service_1 = require("../../util/url.service");
var SignupComponent = (function () {
    // TODO - 서버에서 anonymous 이미지 받아와야 함.
    function SignupComponent(loginService, myLoggerService, uploadService, urlService, router) {
        this.loginService = loginService;
        this.myLoggerService = myLoggerService;
        this.uploadService = uploadService;
        this.urlService = urlService;
        this.router = router;
        this.uploadUserProfileUrl = '/CI/index.php/api/upload/userprofile';
        this.userProfilePath = "/assets/images/user/";
        this.userProfileUrl = "/assets/images/user/user_anonymous_150x150.png";
    }
    SignupComponent.prototype.ngOnInit = function () {
        // 페이지 진입을 기록으로 남깁니다.
        this.myLoggerService.logActionPage(this.myLoggerService.pageKeySignup);
        // Do something...
    };
    SignupComponent.prototype.onChangeFile = function (event) {
        var _this = this;
        console.log('onChange');
        var files = event.srcElement.files;
        if (null == files || 1 != files.length) {
            // 1개의 파일만 업로드할 수 있습니다.
            return;
        }
        console.log(files);
        var req_url = this.urlService.get(this.uploadUserProfileUrl);
        this.uploadService.makeFileRequest(req_url, [], files).subscribe(function (response) {
            // 섬네일 주소를 받아와서 화면에 표시해야 한다.
            console.log('sent / response : ', response);
            if (null != response &&
                null != response.data &&
                null != response.data.thumbnail) {
                _this.userProfileUrl = _this.userProfilePath + response.data.thumbnail;
            }
        });
    };
    SignupComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'signup',
            templateUrl: 'signup.component.html',
            styleUrls: ['signup.component.css']
        }), 
        __metadata('design:paramtypes', [login_service_1.LoginService, my_logger_service_1.MyLoggerService, upload_service_1.UploadService, url_service_1.UrlService, router_1.Router])
    ], SignupComponent);
    return SignupComponent;
}());
exports.SignupComponent = SignupComponent;
//# sourceMappingURL=signup.component.js.map