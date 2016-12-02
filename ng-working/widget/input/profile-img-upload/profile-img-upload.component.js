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
var upload_service_1 = require('../../../util/service/upload.service');
var url_service_1 = require("../../../util/url.service");
var my_checker_service_1 = require('../../../util/service/my-checker.service');
var my_event_service_1 = require('../../../util/service/my-event.service');
var ProfileImgUploadComponent = (function () {
    function ProfileImgUploadComponent(uploadService, myEventService, renderer, urlService) {
        this.uploadService = uploadService;
        this.myEventService = myEventService;
        this.renderer = renderer;
        this.urlService = urlService;
        this.uploadUserProfileUrl = '/CI/index.php/api/upload/userprofile';
        this.userProfilePath = "/assets/images/user/";
        this.userProfileUrl = "/assets/images/user/user_anonymous_150x150_orange.png";
        this.userProfileSampleArr = [
            "/assets/images/user/user_anonymous_150x150_cat.jpg",
            "/assets/images/user/user_anonymous_150x150_lion.jpg",
            "/assets/images/user/user_anonymous_150x150_dolphin.jpg",
            "/assets/images/user/user_anonymous_150x150_parrot.jpg",
            "/assets/images/user/user_anonymous_150x150_poppy.jpg"
        ];
        this.top = -1;
        this.left = -1;
        this.emitter = new core_1.EventEmitter();
        this.isFocus = false;
        this.isFocusInfo = false;
        this.isShowPopover = false;
    }
    ProfileImgUploadComponent.prototype.ngOnInit = function () { };
    ProfileImgUploadComponent.prototype.setMyChecker = function () {
        if (null == this.myCheckerService) {
            return;
        }
        if (null == this.myChecker) {
            this.myChecker = this.myCheckerService.getMyChecker("user_thumbnail");
        }
    };
    ProfileImgUploadComponent.prototype.isOK = function (input) {
        this.setMyChecker();
        if (null == this.myCheckerService) {
            return false;
        }
        return this.myCheckerService.isOK(this.myChecker, input);
    };
    ProfileImgUploadComponent.prototype.setProfileImg = function (thumbnail) {
        if (this.isOK(thumbnail)) {
            this.userProfileUrl = thumbnail;
        }
    };
    // @ Desc : 프로필 이미지가 제대로 입력되었는지 확인합니다.
    ProfileImgUploadComponent.prototype.hasNotDone = function () {
        return !this.hasDone();
    };
    ProfileImgUploadComponent.prototype.hasDone = function () {
        var isOK = this.isOK(this.userProfileUrl);
        if (!isOK) {
            var history_1 = this.myCheckerService.getLastHistory();
            console.log("profile-img / hasDone / history : ", history_1);
        }
        return isOK;
    };
    // @ Desc : 프로필 이미지를 확인해 달라는 표시를 보여줍니다.
    ProfileImgUploadComponent.prototype.showWarning = function () {
        // Do something...
    };
    ProfileImgUploadComponent.prototype.getProfileImgUrl = function () {
        return this.userProfileUrl;
    };
    ProfileImgUploadComponent.prototype.onClickSampleThumb = function (event, idx) {
        event.stopPropagation();
        event.preventDefault();
        var profileUrlNext = "";
        if (null != idx && -1 < idx && idx < this.userProfileSampleArr.length) {
            profileUrlNext = this.userProfileSampleArr[idx];
        } // end if
        if (null != profileUrlNext && "" != profileUrlNext) {
            this.userProfileUrl = profileUrlNext;
        } // end if
    };
    ProfileImgUploadComponent.prototype.onClick = function (event) {
        event.stopPropagation();
        event.preventDefault();
        if (!this.isFocus) {
            this.isFocus = true;
        } // end if
        this.setMyChecker();
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
    ProfileImgUploadComponent.prototype.onFocusFileUpload = function (event) {
        event.stopPropagation();
        event.preventDefault();
        this.setMyChecker();
    };
    ProfileImgUploadComponent.prototype.onClickFileUpload = function (event) {
        event.stopPropagation();
        event.preventDefault();
        // from http://stackoverflow.com/a/32010791/217408
        var eventClick = new MouseEvent('click', { bubbles: true });
        this.renderer.invokeElementMethod(this.fileInput.nativeElement, 'dispatchEvent', [eventClick]);
        this.setMyChecker();
    };
    ProfileImgUploadComponent.prototype.onChangeFile = function (event) {
        var _this = this;
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("profile-img / onChangeFile / init");
        var files = event.srcElement.files;
        if (null == files || 1 != files.length) {
            // 1개의 파일만 업로드할 수 있습니다.
            return;
        }
        console.log(files);
        var req_url = this.urlService.get(this.uploadUserProfileUrl);
        this.uploadService.makeFileRequest(req_url, [], files).subscribe(function (response) {
            // 섬네일 주소를 받아와서 화면에 표시해야 한다.
            if (isDebug)
                console.log("profile-img / onChangeFile / response : ", response);
            if (null != response &&
                null != response.data &&
                null != response.data.thumbnail) {
                // this.userProfileUrl = this.userProfilePath + response.data.thumbnail;
                _this.userProfileUrl = response.data.thumbnail;
                if (isDebug)
                    console.log("profile-img / onChangeFile / this.userProfileUrl : ", _this.userProfileUrl);
                var isOK = _this.isOK(_this.userProfileUrl);
                if (isDebug)
                    console.log("profile-img / onChangeFile / isOK : ", isOK);
                if (isDebug)
                    console.log("profile-img / onChangeFile / this.myChecker : ", _this.myChecker);
                if (isOK) {
                    // 부모 객체에게 Change Event 발송 
                    var myEventOnChange = _this.myEventService.getMyEvent(
                    // public eventName:string
                    _this.myEventService.ON_CHANGE, 
                    // public key:string
                    _this.myEventService.KEY_USER_THUMBNAIL, 
                    // public value:string
                    _this.userProfileUrl, 
                    // public metaObj:any
                    null, 
                    // public myChecker:MyChecker
                    _this.myChecker);
                    _this.emitter.emit(myEventOnChange);
                }
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
        core_1.Input(), 
        __metadata('design:type', my_checker_service_1.MyCheckerService)
    ], ProfileImgUploadComponent.prototype, "myCheckerService", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], ProfileImgUploadComponent.prototype, "emitter", void 0);
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
        __metadata('design:paramtypes', [upload_service_1.UploadService, my_event_service_1.MyEventService, core_1.Renderer, url_service_1.UrlService])
    ], ProfileImgUploadComponent);
    return ProfileImgUploadComponent;
}());
exports.ProfileImgUploadComponent = ProfileImgUploadComponent;
//# sourceMappingURL=profile-img-upload.component.js.map