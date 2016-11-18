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
var my_birthday_service_1 = require("../../util/service/my-birthday.service");
var upload_service_1 = require('../../util/service/upload.service');
var url_service_1 = require("../../util/url.service");
var SignupComponent = (function () {
    function SignupComponent(loginService, myLoggerService, myBirthdayService, uploadService, urlService, renderer, router) {
        this.loginService = loginService;
        this.myLoggerService = myLoggerService;
        this.myBirthdayService = myBirthdayService;
        this.uploadService = uploadService;
        this.urlService = urlService;
        this.renderer = renderer;
        this.router = router;
        this.uploadUserProfileUrl = '/CI/index.php/api/upload/userprofile';
        this.userProfilePath = "/assets/images/user/";
        this.userProfileUrl = "/assets/images/user/user_anonymous_150x150.png";
        // TODO - 서버에서 anonymous 이미지 받아와야 함.
        this.isFemale = false;
        this.isFocusEmail = false;
        this.isFocusPassword = false;
        this.isFocusName = false;
        this.isFocusPhoneNumHead = false;
        this.isFocusPhoneNumBody = false;
        this.isFocusPhoneNumTail = false;
        this.isFocusNickname = false;
        this.selectedYear = -1;
        this.selectedMonth = -1;
        this.selectedDay = -1;
    }
    SignupComponent.prototype.ngOnInit = function () {
        // 페이지 진입을 기록으로 남깁니다.
        this.myLoggerService.logActionPage(this.myLoggerService.pageKeySignup);
        // Do something...
        this.birthYearArr = this.myBirthdayService.getYear();
        this.selectedYear = this.birthYearArr[Math.round(this.birthYearArr.length * 2 / 3)];
        this.birthMonthArr = this.myBirthdayService.getMonth();
        this.selectedMonth = this.birthMonthArr[Math.round(this.birthMonthArr.length / 2)];
        this.birthDayArr = this.myBirthdayService.getDay(this.selectedMonth);
        this.selectedDay = this.birthDayArr[Math.round(this.birthDayArr.length / 2)];
    };
    SignupComponent.prototype.onClickFileUpload = function (event) {
        event.stopPropagation();
        event.preventDefault();
        // from http://stackoverflow.com/a/32010791/217408
        var eventClick = new MouseEvent('click', { bubbles: true });
        this.renderer.invokeElementMethod(this.fileInput.nativeElement, 'dispatchEvent', [eventClick]);
        return;
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
    SignupComponent.prototype.onClickGenderFemale = function (event) {
        event.stopPropagation();
        event.preventDefault();
        if (!this.isFemale) {
            this.isFemale = true;
        } // end if    
    };
    SignupComponent.prototype.onClickGenderMale = function (event) {
        event.stopPropagation();
        event.preventDefault();
        if (this.isFemale) {
            this.isFemale = false;
        } // end if
    };
    SignupComponent.prototype.onClickEmail = function (event) {
        event.stopPropagation();
        event.preventDefault();
        if (!this.isFocusEmail) {
            this.isFocusEmail = true;
        } // end if
    };
    SignupComponent.prototype.onBlurEmail = function (event) {
        event.stopPropagation();
        event.preventDefault();
        if (this.isFocusEmail) {
            this.isFocusEmail = false;
        } // end if
    };
    SignupComponent.prototype.onClickPassword = function (event) {
        event.stopPropagation();
        event.preventDefault();
        if (!this.isFocusPassword) {
            this.isFocusPassword = true;
        } // end if
    };
    SignupComponent.prototype.onBlurPassword = function (event) {
        event.stopPropagation();
        event.preventDefault();
        if (this.isFocusPassword) {
            this.isFocusPassword = false;
        } // end if
    };
    SignupComponent.prototype.onClickName = function (event) {
        event.stopPropagation();
        event.preventDefault();
        if (!this.isFocusName) {
            this.isFocusName = true;
        } // end if
    };
    SignupComponent.prototype.onBlurName = function (event) {
        event.stopPropagation();
        event.preventDefault();
        if (this.isFocusName) {
            this.isFocusName = false;
        } // end if
    };
    SignupComponent.prototype.onClickPhoneNumHead = function (event) {
        event.stopPropagation();
        event.preventDefault();
        if (!this.isFocusPhoneNumHead) {
            this.isFocusPhoneNumHead = true;
        } // end if
    };
    SignupComponent.prototype.onBlurPhoneNumHead = function (event) {
        event.stopPropagation();
        event.preventDefault();
        if (this.isFocusPhoneNumHead) {
            this.isFocusPhoneNumHead = false;
        } // end if
    };
    SignupComponent.prototype.onClickPhoneNumBody = function (event) {
        event.stopPropagation();
        event.preventDefault();
        if (!this.isFocusPhoneNumBody) {
            this.isFocusPhoneNumBody = true;
        } // end if
    };
    SignupComponent.prototype.onBlurPhoneNumBody = function (event) {
        event.stopPropagation();
        event.preventDefault();
        if (this.isFocusPhoneNumBody) {
            this.isFocusPhoneNumBody = false;
        } // end if
    };
    SignupComponent.prototype.onClickPhoneNumTail = function (event) {
        event.stopPropagation();
        event.preventDefault();
        if (!this.isFocusPhoneNumTail) {
            this.isFocusPhoneNumTail = true;
        } // end if
    };
    SignupComponent.prototype.onBlurPhoneNumTail = function (event) {
        event.stopPropagation();
        event.preventDefault();
        if (this.isFocusPhoneNumTail) {
            this.isFocusPhoneNumTail = false;
        } // end if
    };
    SignupComponent.prototype.onClickNickname = function (event) {
        event.stopPropagation();
        event.preventDefault();
        if (!this.isFocusNickname) {
            this.isFocusNickname = true;
        } // end if
    };
    SignupComponent.prototype.onBlurNickname = function (event) {
        event.stopPropagation();
        event.preventDefault();
        if (this.isFocusNickname) {
            this.isFocusNickname = false;
        } // end if
    };
    SignupComponent.prototype.onChangeBirthYear = function (selectBirthYear) {
        this.selectedYear = selectBirthYear;
    };
    SignupComponent.prototype.onChangeBirthMonth = function (selectBirthMonth) {
        this.selectedMonth = selectBirthMonth;
        // 월이 바뀌었습니다. 월별 날짜도 연동되어 바꿉니다.
        this.birthDayArr = this.myBirthdayService.getDay(this.selectedMonth);
        this.selectedDay = this.birthDayArr[Math.round(this.birthDayArr.length / 2)];
    };
    SignupComponent.prototype.onChangeBirthDay = function (selectBirthDay) {
        this.selectedDay = selectBirthDay;
    };
    __decorate([
        core_1.ViewChild('fileInput'), 
        __metadata('design:type', core_1.ElementRef)
    ], SignupComponent.prototype, "fileInput", void 0);
    SignupComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'signup',
            templateUrl: 'signup.component.html',
            styleUrls: ['signup.component.css']
        }), 
        __metadata('design:paramtypes', [login_service_1.LoginService, my_logger_service_1.MyLoggerService, my_birthday_service_1.MyBirthdayService, upload_service_1.UploadService, url_service_1.UrlService, core_1.Renderer, router_1.Router])
    ], SignupComponent);
    return SignupComponent;
}());
exports.SignupComponent = SignupComponent;
//# sourceMappingURL=signup.component.js.map