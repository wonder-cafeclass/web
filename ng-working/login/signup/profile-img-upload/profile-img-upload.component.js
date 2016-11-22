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
var login_service_1 = require('../../service/login.service');
var upload_service_1 = require('../../../util/service/upload.service');
var url_service_1 = require("../../../util/url.service");
var ProfileImgUploadComponent = (function () {
    function ProfileImgUploadComponent(loginService, uploadService, renderer, urlService) {
        this.loginService = loginService;
        this.uploadService = uploadService;
        this.renderer = renderer;
        this.urlService = urlService;
        this.uploadUserProfileUrl = '/CI/index.php/api/upload/userprofile';
        this.userProfilePath = "/assets/images/user/";
        this.userProfileUrl = "/assets/images/user/user_anonymous_150x150_orange.png";
        this.top = -1;
        this.left = -1;
        this.isFocus = false;
        this.isFocusInfo = false;
        this.isShowPopover = false;
    }
    ProfileImgUploadComponent.prototype.ngOnInit = function () { };
    ProfileImgUploadComponent.prototype.onClick = function (event) {
        event.stopPropagation();
        event.preventDefault();
        if (!this.isFocus) {
            this.isFocus = true;
        } // end if
    };
    ProfileImgUploadComponent.prototype.onBlur = function (event) {
        event.stopPropagation();
        event.preventDefault();
        if (this.isFocus) {
            this.isFocus = false;
        } // end if
    };
    ProfileImgUploadComponent.prototype.onMouseOverInfo = function (event) {
        event.stopPropagation();
        event.preventDefault();
        if (!this.isFocusInfo) {
            this.isFocusInfo = true;
        } // end if
    };
    ProfileImgUploadComponent.prototype.onMouseOutInfo = function (event) {
        event.stopPropagation();
        event.preventDefault();
        if (this.isFocusInfo) {
            this.isFocusInfo = false;
        } // end if
    };
    ProfileImgUploadComponent.prototype.onClickFileUpload = function (event) {
        event.stopPropagation();
        event.preventDefault();
        // from http://stackoverflow.com/a/32010791/217408
        var eventClick = new MouseEvent('click', { bubbles: true });
        this.renderer.invokeElementMethod(this.fileInput.nativeElement, 'dispatchEvent', [eventClick]);
        return;
    };
    ProfileImgUploadComponent.prototype.onChangeFile = function (event) {
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
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], ProfileImgUploadComponent.prototype, "top", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], ProfileImgUploadComponent.prototype, "left", void 0);
    __decorate([
        core_1.ViewChild('fileInput'), 
        __metadata('design:type', core_1.ElementRef)
    ], ProfileImgUploadComponent.prototype, "fileInput", void 0);
    ProfileImgUploadComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'profile-img-upload',
            templateUrl: 'profile-img-upload.component.html',
            styleUrls: ['profile-img-upload.component.css']
        }), 
        __metadata('design:paramtypes', [login_service_1.LoginService, upload_service_1.UploadService, core_1.Renderer, url_service_1.UrlService])
    ], ProfileImgUploadComponent);
    return ProfileImgUploadComponent;
}());
exports.ProfileImgUploadComponent = ProfileImgUploadComponent;
//# sourceMappingURL=profile-img-upload.component.js.map