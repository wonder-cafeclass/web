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
var email_component_1 = require('../../../widget/input/email/email.component');
var profile_img_upload_component_1 = require('../../../widget/input/profile-img-upload/profile-img-upload.component');
var password_component_1 = require('../../../widget/input/password/password.component');
var mobile_component_1 = require('../../../widget/input/mobile/mobile.component');
var name_component_1 = require('../../../widget/input/name/name.component');
var gender_component_1 = require('../../../widget/input/gender/gender.component');
var birthday_component_1 = require('../../../widget/input/birthday/birthday.component');
var nickname_component_1 = require('../../../widget/input/nickname/nickname.component');
var my_event_watchtower_service_1 = require('../../../util/service/my-event-watchtower.service');
var my_event_service_1 = require('../../../util/service/my-event.service');
var my_checker_service_1 = require('../../../util/service/my-checker.service');
var MyInfoComponent = (function () {
    function MyInfoComponent(myEventService, myEventWatchTowerService) {
        this.myEventService = myEventService;
        this.myEventWatchTowerService = myEventWatchTowerService;
        this.emitter = new core_1.EventEmitter();
        this.gender = "";
    }
    MyInfoComponent.prototype.ngOnInit = function () {
        var _this = this;
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("my-info / ngOnInit");
        // Subscribe login user
        this.myEventWatchTowerService.loginAnnounced$.subscribe(function (loginUser) {
            if (isDebug)
                console.log("my-info / loginUser : ", loginUser);
            // Example
            /*
            {
              birthday: "1981-07-17"
              date_created: "2016-11-29 23:11:53"
              date_updated: "2016-11-29 23:12:53"
              email: "wonder13662@gmail.com"
              facebook_id: ""
              gender: "M"
              google_id: null
              id: "1"
              kakao_id: "311947172"
              mobile: "010-1234-5678"
              name: "정원덕"
              naver_id: ""
              nickname: "정원덕"
              permission: "U"
              status: "A"
              thumbnail: "assets/images/user/2016-11-29|23|11|53|640151.jpg"
            }
            */
            // 로그인한 유저 정보가 들어왔습니다.
            _this.loginUser = loginUser;
            _this.fillViewUserInfo();
        });
    };
    MyInfoComponent.prototype.fillViewUserInfo = function () {
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("my-info / fillViewUserInfo");
        if (isDebug)
            console.log("my-info / fillViewUserInfo / this.loginUser : ", this.loginUser);
        if (null == this.loginUser) {
            return;
        }
        this.emailComponent.setEmail(this.loginUser.email);
        this.email = this.loginUser.email;
        // name
        this.nameComponent.setName(this.loginUser.name);
        this.name = this.loginUser.name;
        // nickname
        this.nicknameComponent.setNickname(this.loginUser.nickname);
        this.nickname = this.loginUser.nickname;
        // thumbnail
        this.profileImgUploadComponent.setProfileImg(this.loginUser.thumbnail);
        this.thumbnail = this.loginUser.thumbnail;
        // mobile
        var mobile = this.loginUser.mobile;
        var mobileArr = mobile.split("-");
        if (isDebug)
            console.log("my-info / fillViewUserInfo / mobileArr : ", mobileArr);
        if (null != mobileArr && 3 === mobileArr.length) {
            this.mobileComponent.setMobileHead(mobileArr[0]);
            this.mobileComponent.setMobileBody(mobileArr[1]);
            this.mobileComponent.setMobileTail(mobileArr[2]);
        }
        // gender
        this.genderComponent.setGender(this.loginUser.gender);
        // birthday
        var birthday = this.loginUser.birthday;
        var birthdayArr = birthday.split("-");
        if (isDebug)
            console.log("my-info / fillViewUserInfo / birthdayArr : ", birthdayArr);
        if (null != birthdayArr && 3 === birthdayArr.length) {
            this.birthdayComponent.setBirthYear(birthdayArr[0]);
            this.birthdayComponent.setBirthMonth(birthdayArr[1]);
            this.birthdayComponent.setBirthDay(birthdayArr[2]);
        }
    };
    MyInfoComponent.prototype.onChangedFromChild = function (myEvent, myinfo, myhistory, mypayment, myfavorite) {
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("my-info / onChangedFromChild / init");
        if (isDebug)
            console.log("my-info / onChangedFromChild / myEvent : ", myEvent);
        if (isDebug)
            console.log("my-info / onChangedFromChild / myEvent.key : ", myEvent.key);
    };
    MyInfoComponent.prototype.onClickSave = function (event) {
        // TODO - 
        // 1. this.loginUser 객체와 비교, 값이 달라졌다면 save 버튼 활성화.
        // 2. 업데이트 뒤에는 다시 유저 객체도 업데이트.
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', my_checker_service_1.MyCheckerService)
    ], MyInfoComponent.prototype, "myCheckerService", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], MyInfoComponent.prototype, "emitter", void 0);
    __decorate([
        core_1.ViewChild(email_component_1.EmailComponent), 
        __metadata('design:type', email_component_1.EmailComponent)
    ], MyInfoComponent.prototype, "emailComponent", void 0);
    __decorate([
        core_1.ViewChild(password_component_1.PasswordComponent), 
        __metadata('design:type', password_component_1.PasswordComponent)
    ], MyInfoComponent.prototype, "passwordComponent", void 0);
    __decorate([
        core_1.ViewChild(name_component_1.NameComponent), 
        __metadata('design:type', name_component_1.NameComponent)
    ], MyInfoComponent.prototype, "nameComponent", void 0);
    __decorate([
        core_1.ViewChild(nickname_component_1.NicknameComponent), 
        __metadata('design:type', nickname_component_1.NicknameComponent)
    ], MyInfoComponent.prototype, "nicknameComponent", void 0);
    __decorate([
        core_1.ViewChild(mobile_component_1.MobileComponent), 
        __metadata('design:type', mobile_component_1.MobileComponent)
    ], MyInfoComponent.prototype, "mobileComponent", void 0);
    __decorate([
        core_1.ViewChild(gender_component_1.GenderComponent), 
        __metadata('design:type', gender_component_1.GenderComponent)
    ], MyInfoComponent.prototype, "genderComponent", void 0);
    __decorate([
        core_1.ViewChild(birthday_component_1.BirthdayComponent), 
        __metadata('design:type', birthday_component_1.BirthdayComponent)
    ], MyInfoComponent.prototype, "birthdayComponent", void 0);
    __decorate([
        core_1.ViewChild(profile_img_upload_component_1.ProfileImgUploadComponent), 
        __metadata('design:type', profile_img_upload_component_1.ProfileImgUploadComponent)
    ], MyInfoComponent.prototype, "profileImgUploadComponent", void 0);
    MyInfoComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'my-info',
            templateUrl: 'my-info.component.html',
            styleUrls: ['my-info.component.css']
        }), 
        __metadata('design:paramtypes', [my_event_service_1.MyEventService, my_event_watchtower_service_1.MyEventWatchTowerService])
    ], MyInfoComponent);
    return MyInfoComponent;
}());
exports.MyInfoComponent = MyInfoComponent;
//# sourceMappingURL=my-info.component.js.map