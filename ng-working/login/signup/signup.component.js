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
require('rxjs/add/operator/switchMap');
var Observable_1 = require('rxjs/Observable');
var core_1 = require('@angular/core');
var router_1 = require('@angular/router');
var login_service_1 = require('../service/login.service');
var user_service_1 = require('../../users/service/user.service');
var email_component_1 = require('../../widget/input/email/email.component');
var profile_img_upload_component_1 = require('../../widget/input/profile-img-upload/profile-img-upload.component');
var password_component_1 = require('../../widget/input/password/password.component');
var mobile_component_1 = require('../../widget/input/mobile/mobile.component');
var name_component_1 = require('../../widget/input/name/name.component');
var gender_component_1 = require('../../widget/input/gender/gender.component');
var birthday_component_1 = require('../../widget/input/birthday/birthday.component');
var nickname_component_1 = require('../../widget/input/nickname/nickname.component');
var my_logger_service_1 = require('../../util/service/my-logger.service');
var my_checker_service_1 = require('../../util/service/my-checker.service');
var my_event_service_1 = require('../../util/service/my-event.service');
var my_event_watchtower_service_1 = require('../../util/service/my-event-watchtower.service');
var SignupComponent = (function () {
    function SignupComponent(signupService, userService, myLoggerService, myCheckerService, myEventService, watchTower, route, router) {
        this.signupService = signupService;
        this.userService = userService;
        this.myLoggerService = myLoggerService;
        this.myCheckerService = myCheckerService;
        this.myEventService = myEventService;
        this.watchTower = watchTower;
        this.route = route;
        this.router = router;
        this.gender = "";
        this.hasAgreedWithTerms = false;
        this.tooltipMsgTerms = null;
        this.tooltipMsgTermsWarning = "약관 동의가 필요합니다.";
        this.redirectUrl = "/class-center";
        this.isAdmin = false;
        this.errorMsgArr = [];
    }
    SignupComponent.prototype.ngOnInit = function () {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("signup / ngOnInit / init");
    };
    SignupComponent.prototype.ngAfterViewInit = function () {
        // 자식 뷰가 모두 완료된 이후에 초기화를 진행.
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("signup / ngAfterViewInit");
        this.asyncViewPack();
    };
    SignupComponent.prototype.asyncViewPack = function () {
        var _this = this;
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("signup / asyncViewPack / 시작");
        // 이미 View 기본정보가 들어왔다면 바로 가져온다. 
        if (this.watchTower.getIsViewPackReady()) {
            if (isDebug)
                console.log("signup / asyncViewPack / isViewPackReady : ", true);
            this.init();
        } // end if
        // View에 필요한 기본 정보가 비동기로 들어올 경우, 처리.
        this.watchTower.isViewPackReady$.subscribe(function (isViewPackReady) {
            if (isDebug)
                console.log("signup / asyncViewPack / subscribe / isViewPackReady : ", isViewPackReady);
            _this.init();
        }); // end subscribe    
    };
    SignupComponent.prototype.setViewPack = function () {
        this.isAdmin = this.watchTower.getIsAdmin();
        this.myCheckerService.setReady(
        // checkerMap:any
        this.watchTower.getCheckerMap(), 
        // constMap:any
        this.watchTower.getConstMap(), 
        // dirtyWordList:any
        this.watchTower.getDirtyWordList(), 
        // apiKey:string
        this.watchTower.getApiKey()); // end setReady
    };
    SignupComponent.prototype.init = function () {
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("signup / init / 시작");
        // 뷰에 필요한 공통 정보를 설정합니다.
        this.setViewPack();
        this.logPageEnter();
        this.checkSignedUpUserInfo();
    };
    SignupComponent.prototype.setMyChecker = function () {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("kakao-callback / setMyChecker / 시작");
        if (this.watchTower.getIsMyCheckerReady()) {
            this.myCheckerService.setReady(
            // checkerMap:any
            this.watchTower.getCheckerMap(), 
            // constMap:any
            this.watchTower.getConstMap(), 
            // dirtyWordList:any
            this.watchTower.getDirtyWordList(), 
            // apiKey:string
            this.watchTower.getApiKey()); // end setReady
            if (isDebug)
                console.log("kakao-callback / setMyChecker / done!");
        } // end if
    };
    SignupComponent.prototype.logPageEnter = function () {
        // 페이지 진입을 기록으로 남깁니다.
        this.myLoggerService.logActionPage(
        // apiKey:string
        this.watchTower.getApiKey(), 
        // pageType:string
        this.myLoggerService.pageTypeSignup);
    };
    SignupComponent.prototype.checkSignedUpUserInfo = function () {
        var _this = this;
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("signup / checkSignedUpUserInfo / 시작");
        // 다른 플랫폼으로 로그인 뒤에 회원 가입으로 진입했다면, 해당 파라미터로 미리 등록된 유저 정보를 가져옵니다.
        this.route.params.switchMap(function (params) {
            if (isDebug)
                console.log("signup / checkSignedUpUserInfo / switchMap / params : ", params);
            if (null != params['facebookId']) {
                _this.facebookId = params['facebookId'];
                if (isDebug)
                    console.log("signup / checkSignedUpUserInfo / switchMap / this.facebookId : ", _this.facebookId);
                if (null != _this.facebookId && "" != _this.facebookId) {
                    return _this.userService.getUserByFacebookId(_this.facebookId);
                }
            }
            if (null != params['kakaoId']) {
                _this.kakaoId = params['kakaoId'];
                if (isDebug)
                    console.log("signup / checkSignedUpUserInfo / switchMap / this.kakaoId : ", _this.kakaoId);
                if (null != _this.kakaoId && "" != _this.kakaoId) {
                    return _this.userService.getUserByKakaoId(_this.kakaoId);
                }
            }
            if (null != params['naverId']) {
                _this.naverId = params['naverId'];
                if (isDebug)
                    console.log("signup / checkSignedUpUserInfo / switchMap / this.naverId : ", _this.naverId);
                if (null != _this.naverId && "" != _this.naverId) {
                    return _this.userService.getUserByNaverId(_this.naverId);
                }
            }
            return Observable_1.Observable.of();
        }).subscribe(function (myResponse) {
            if (isDebug)
                console.log("signup / checkSignedUpUserInfo / subscribe / myResponse : ", myResponse);
            var kakaoId = -1;
            var user = null;
            if (myResponse.isSuccess()) {
                kakaoId = +myResponse.getDataProp("kakao_id");
                user = myResponse.getDataProp("user");
            }
            if (isDebug)
                console.log("signup / checkSignedUpUserInfo / subscribe / kakaoId : ", kakaoId);
            if (isDebug)
                console.log("signup / checkSignedUpUserInfo / subscribe / user : ", user);
            if (null != user) {
                _this.user = user;
            }
            else {
                if (isDebug)
                    console.log("signup / checkSignedUpUserInfo / subscribe / Error Report");
                // Error Report
                _this.myLoggerService.logError(
                // apiKey:string
                _this.watchTower.getApiKey(), 
                // errorType:string
                _this.myLoggerService.errorAPIFailed, 
                // errorMsg:string
                "signup / checkSignedUpUserInfo / Failed!");
                return;
            }
            if (null != _this.user.facebook_id && "" != _this.user.facebook_id) {
                if (isDebug)
                    console.log("signup / checkSignedUpUserInfo / subscribe / 페이스북 로그인 - 유저 정보 가져오기.");
                // 페이스북 로그인 - 유저 정보 가져오기.
                // email
                _this.emailComponent.setEmail(_this.user.email);
                _this.email = _this.user.email;
                // name
                _this.nameComponent.setName(_this.user.name);
                _this.name = _this.user.name;
                // nickname
                _this.nicknameComponent.setNickname(_this.user.nickname);
                _this.nickname = _this.user.nickname;
                // thumbnail
                _this.profileImgUploadComponent.setProfileImg(_this.user.thumbnail);
                _this.thumbnail = _this.user.thumbnail;
            }
            else if (null != _this.user.kakao_id && "" != _this.user.kakao_id) {
                if (isDebug)
                    console.log("signup / checkSignedUpUserInfo / subscribe / 카카오 로그인 - 유저 정보 가져오기.");
                // 카카오 로그인 - 유저 정보 가져오기.
                // name
                _this.nameComponent.setName(_this.user.name);
                _this.name = _this.user.name;
                // nickname
                _this.nicknameComponent.setNickname(_this.user.nickname);
                _this.nickname = _this.user.nickname;
                // thumbnail
                _this.profileImgUploadComponent.setProfileImg(_this.user.thumbnail);
                _this.thumbnail = _this.user.thumbnail;
            }
            else if (null != _this.user.naver_id && "" != _this.user.naver_id) {
                if (isDebug)
                    console.log("signup / checkSignedUpUserInfo / subscribe / 네이버 로그인 - 유저 정보 가져오기.");
                // 네이버 로그인 - 유저 정보 가져오기.
                // email
                _this.emailComponent.setEmail(_this.user.email);
                _this.email = _this.user.email;
                // name
                _this.nameComponent.setName(_this.user.name);
                _this.name = _this.user.name;
                // nickname
                _this.nicknameComponent.setNickname(_this.user.nickname);
                _this.nickname = _this.user.nickname;
                // gender
                _this.genderComponent.setGender(_this.user.gender);
                _this.gender = _this.user.gender;
            } // end if
        }); // end subscribe
    }; // end checkSignedUpUserInfo
    SignupComponent.prototype.onClickSignup = function (event) {
        event.preventDefault();
        event.stopPropagation();
        var isAllOK = true;
        // 약관 동의 확인. 
        if (!this.hasAgreedWithTerms) {
            isAllOK = false;
            // 약관 동의가 필요하다는 경고 메시지를 띄웁니다.
            this.tooltipMsgTerms = this.tooltipMsgTermsWarning;
        }
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("signup / onClickSignup / 시작");
        // 회원 가입을 하는데 필요한 모든 필드를 검사합니다.
        // 문제가 있다면 해당 필드에 경고를 보여줍니다.
        var hasNotDoneEmail = this.emailComponent.hasNotDone();
        if (hasNotDoneEmail) {
            this.emailComponent.showWarning();
            if (isDebug)
                console.log("signup / onClickSignup / hasNotDoneEmail : ", hasNotDoneEmail);
            isAllOK = false;
        }
        var hasNotDonePassword = this.passwordComponent.hasNotDoneP();
        var hasNotDoneRepassword = false;
        if (hasNotDonePassword) {
            this.passwordComponent.showWarningP();
            if (isDebug)
                console.log("signup / onClickSignup / hasNotDonePassword : ", hasNotDonePassword);
            isAllOK = false;
        }
        else {
            // 비밀번호 입력이 확인되었다면, 비밀번호 재입력을 다시 확인합니다.
            hasNotDoneRepassword = this.passwordComponent.hasNotDoneRP();
        }
        if (hasNotDoneRepassword) {
            // 비밀번호 재입력에 문제가 있습니다. 화면에 표시해줍니다.
            this.passwordComponent.showWarningRP();
            if (isDebug)
                console.log("signup / onClickSignup / hasNotDoneRepassword : ", hasNotDoneRepassword);
            isAllOK = false;
        }
        var hasNotDoneName = this.nameComponent.hasNotDone();
        if (hasNotDoneName) {
            this.nameComponent.showWarning();
            if (isDebug)
                console.log("signup / onClickSignup / hasNotDoneName : ", hasNotDoneName);
            isAllOK = false;
        }
        var hasNotDoneNickname = this.nicknameComponent.hasNotDone();
        if (hasNotDoneNickname) {
            this.nicknameComponent.showWarning();
            if (isDebug)
                console.log("signup / onClickSignup / hasNotDoneNickname : ", hasNotDoneNickname);
            isAllOK = false;
        }
        var hasNotDoneMobileHead = this.mobileComponent.hasNotDoneMobileHead();
        var hasNotDoneMobileBody = false;
        var hasNotDoneMobileTail = false;
        if (hasNotDoneMobileHead) {
            this.mobileComponent.showWarningMobileHead();
            if (isDebug)
                console.log("signup / onClickSignup / hasNotDoneMobileHead : ", hasNotDoneMobileHead);
            isAllOK = false;
        }
        else {
            // 휴대전화 첫번째 3자리가 문제가 없다면 휴대전화 두번째 4자리를 검사합니다.
            hasNotDoneMobileBody = this.mobileComponent.hasNotDoneMobileBody();
        }
        if (null == this.mobileNumHead || "" === this.mobileNumHead) {
            // 전화번호 첫 3자리가 기본값 '010'일 경우, 컴포넌트에서 기본값을 가져온다.
            this.mobileNumHead = this.mobileComponent.getMobileHead();
        }
        if (!hasNotDoneMobileHead && hasNotDoneMobileBody) {
            this.mobileComponent.showWarningMobileBody();
            if (isDebug)
                console.log("signup / onClickSignup / hasNotDoneMobileBody : ", hasNotDoneMobileBody);
            isAllOK = false;
        }
        else if (!hasNotDoneMobileHead) {
            // 휴대전화 두번째 4자리가 문제가 없다면 휴대전화 세번째 4자리를 검사합니다.
            hasNotDoneMobileTail = this.mobileComponent.hasNotDoneMobileTail();
        }
        if (!hasNotDoneMobileHead && !hasNotDoneMobileBody && hasNotDoneMobileTail) {
            if (isDebug)
                console.log("signup / onClickSignup / hasNotDoneMobileTail : ", hasNotDoneMobileTail);
            this.mobileComponent.showWarningMobileTail();
            isAllOK = false;
        }
        var hasNotDoneGender = this.genderComponent.hasNotDone();
        if (hasNotDoneGender) {
            this.genderComponent.showWarning();
            if (isDebug)
                console.log("signup / onClickSignup / hasNotDoneGender : ", hasNotDoneGender);
            isAllOK = false;
        }
        // 생년월일 검사
        var hasNotDoneBirthYear = this.birthdayComponent.hasNotDoneBirthYear();
        if (hasNotDoneBirthYear) {
            this.birthdayComponent.showWarningBirthYear();
            if (isDebug)
                console.log("signup / onClickSignup / hasNotDoneBirthYear : ", hasNotDoneBirthYear);
            isAllOK = false;
        }
        if (null == this.birthYear || "" === this.birthYear) {
            this.birthYear = this.birthdayComponent.getBirthYear();
        }
        var hasNotDoneBirthMonth = this.birthdayComponent.hasNotDoneBirthMonth();
        if (hasNotDoneBirthMonth) {
            this.birthdayComponent.showWarningBirthMonth();
            if (isDebug)
                console.log("signup / onClickSignup / hasNotDoneBirthMonth : ", hasNotDoneBirthMonth);
            isAllOK = false;
        }
        if (null == this.birthMonth || "" === this.birthMonth) {
            this.birthMonth = this.birthdayComponent.getBirthMonth();
        }
        var hasNotDoneBirthDay = this.birthdayComponent.hasNotDoneBirthDay();
        if (hasNotDoneBirthDay) {
            this.birthdayComponent.showWarningBirthDay();
            if (isDebug)
                console.log("signup / onClickSignup / hasNotDoneBirthDay : ", hasNotDoneBirthDay);
            isAllOK = false;
        }
        if (null == this.birthDay || "" === this.birthDay) {
            this.birthDay = this.birthdayComponent.getBirthDay();
        }
        // 프로필 이미지 검사
        var hasNotDoneProfileImg = this.profileImgUploadComponent.hasNotDone();
        if (hasNotDoneProfileImg) {
            this.profileImgUploadComponent.showWarning();
            if (isDebug)
                console.log("signup / onClickSignup / hasNotDoneProfileImg : ", hasNotDoneProfileImg);
            isAllOK = false;
        }
        if (null == this.thumbnail || "" === this.thumbnail) {
            this.thumbnail = this.profileImgUploadComponent.getProfileImgUrl();
        }
        // 전화번호 검사
        if (isDebug)
            console.log("signup / onClickSignup / isAllOK : ", isAllOK);
        // 등록되지 않은 필드가 있다면 표시해줘야 합니다.
        if (isAllOK) {
            if (isDebug)
                console.log("signup / onClickSignup / 모든 필드가 문제가 없다면 유저 데이터를 전송!");
            if (null != this.user) {
                // 1-1. 플랫폼을 통해 가입 - facebook
                // 1-2. 플랫폼을 통해 가입 - kakao
                // 1-3. 플랫폼을 통해 가입 - naver
                this.updateUser();
            }
            else if (null == this.user) {
                // 2. 플랫폼을 통하지 않고 직접 가입.
                this.addUser();
            } // end inner if
        } // end outer if
    }; // end method
    SignupComponent.prototype.updateUser = function () {
        var _this = this;
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("signup / updateUser / 시작");
        if (isDebug)
            console.log("signup / updateUser / this.user.id : ", this.user.id);
        if (isDebug)
            console.log("signup / updateUser / this.email : ", this.email);
        if (isDebug)
            console.log("signup / updateUser / this.password : ", this.password);
        if (isDebug)
            console.log("signup / updateUser / this.name : ", this.name);
        if (isDebug)
            console.log("signup / updateUser / this.nickname : ", this.nickname);
        if (isDebug)
            console.log("signup / updateUser / this.gender : ", this.gender);
        if (isDebug)
            console.log("signup / updateUser / this.birthYear : ", this.birthYear);
        if (isDebug)
            console.log("signup / updateUser / this.birthMonth : ", this.birthMonth);
        if (isDebug)
            console.log("signup / updateUser / this.birthDay : ", this.birthDay);
        if (isDebug)
            console.log("signup / updateUser / this.thumbnail : ", this.thumbnail);
        if (isDebug)
            console.log("signup / updateUser / this.mobileNumHead : ", this.mobileNumHead);
        if (isDebug)
            console.log("signup / updateUser / this.mobileNumBody : ", this.mobileNumBody);
        if (isDebug)
            console.log("signup / updateUser / this.mobileNumTail : ", this.mobileNumTail);
        this.userService
            .updateUser(
        // apiKey:string
        this.myCheckerService.getAPIKey(), 
        // userId:number
        this.user.id, 
        // email:string
        this.email, 
        // password:string
        this.password, 
        // name:string
        this.name, 
        // nickname:string
        this.nickname, 
        // gender:string
        this.gender, 
        // birthYear:string
        this.birthYear, 
        // birthMonth:string
        this.birthMonth, 
        // birthDay:string  
        this.birthDay, 
        // thumbnail:string
        this.thumbnail, 
        // mobileHead:string
        this.mobileNumHead, 
        // mobileBody:string
        this.mobileNumBody, 
        // mobileTail:string
        this.mobileNumTail).then(function (myReponse) {
            if (isDebug)
                console.log("signup / updateUser / myReponse : ", myReponse);
            var user = null;
            if (myReponse.isSuccess()) {
                user = myReponse.getDataProp("user");
            }
            if (isDebug)
                console.log("signup / updateUser / user : ", user);
            if (null != user && null != user.id && null != user.email) {
                // 유저 정보가 제대로 추가되었다면, 메일을 발송, 인증을 시작!
                _this.sendMailUserValidation(user.id, user.email);
            }
            else {
                // Error Report
                if (isDebug)
                    console.log("signup / updateUser / Error Report");
                _this.myLoggerService.logError(
                // apiKey:string
                _this.watchTower.getApiKey(), 
                // errorType:string
                _this.myLoggerService.errorAPIFailed, 
                // errorMsg:string
                "signup / updateUser / Failed!");
            } // end if
        }); // end service     
    };
    SignupComponent.prototype.addUser = function () {
        var _this = this;
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("signup / addUser / 시작");
        this.userService
            .addUser(
        // apiKey:string
        this.myCheckerService.getAPIKey(), 
        // email:string
        this.email, 
        // password:string
        this.password, 
        // name:string
        this.name, 
        // nickname:string
        this.nickname, 
        // gender:string
        this.gender, 
        // birthYear:string
        this.birthYear, 
        // birthMonth:string
        this.birthMonth, 
        // birthDay:string  
        this.birthDay, 
        // thumbnail:string
        this.thumbnail, 
        // mobileHead:string
        this.mobileNumHead, 
        // mobileBody:string
        this.mobileNumBody, 
        // mobileTail:string
        this.mobileNumTail).then(function (myResponse) {
            if (isDebug)
                console.log("signup / addUser / myResponse : ", myResponse);
            var user = null;
            if (myResponse.isSuccess()) {
                user = myResponse.getDataProp("user");
            }
            if (isDebug)
                console.log("signup / addUser / user : ", user);
            if (null != user && null != user.id && null != user.email) {
                // 유저 정보가 제대로 추가되었다면, 메일을 발송, 인증을 시작!
                if (isDebug)
                    console.log("signup / addUser / 메일을 발송, 인증을 시작!");
                _this.sendMailUserValidation(user.id, user.email);
            }
            else {
                if (isDebug)
                    console.log("signup / addUser / Error Report");
                _this.myLoggerService.logError(
                // apiKey:string
                _this.watchTower.getApiKey(), 
                // errorType:string
                _this.myLoggerService.errorAPIFailed, 
                // errorMsg:string
                "signup / addUser / Failed!");
            } // end if
        }); // end service      
    };
    SignupComponent.prototype.sendMailUserValidation = function (userId, email) {
        var _this = this;
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("signup / sendMailUserValidation / 시작");
        this.userService
            .sendMailUserValidation(
        // apiKey:string
        this.myCheckerService.getAPIKey(), 
        // userId:number
        userId, 
        // email:string
        email).then(function (myResponse) {
            if (isDebug)
                console.log("signup / sendMailUserValidation / myResponse : ", myResponse);
            if (myResponse.isSuccess() && myResponse.hasDataProp("user_validation_key")) {
                // 전송이 완료되었다면 팝업으로 사용자에게 메일을 확인해볼 것을 안내한다.
                _this.router.navigate(['login/signup/validation']);
            }
            else {
                // Error Report
                _this.myLoggerService.logError(
                // apiKey:string
                _this.watchTower.getApiKey(), 
                // errorType:string
                _this.myLoggerService.errorAPIFailed, 
                // errorMsg:string
                "signup / sendMailUserValidation / Failed!");
            } // end if
        }); // end service     
    };
    SignupComponent.prototype.onClickTerms = function (event) {
        event.preventDefault();
        event.stopPropagation();
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("signup / onClickTerms / 시작");
        // 이용약관 페이지로 이동.
        window.open("/#/policy");
    };
    SignupComponent.prototype.onChangeCheckTerms = function (event, checkboxTerms) {
        event.preventDefault();
        event.stopPropagation();
        if (null != checkboxTerms) {
            this.hasAgreedWithTerms = checkboxTerms.checked;
        }
        if (this.hasAgreedWithTerms) {
            this.tooltipMsgTerms = null;
        }
        else {
            // 동의 하지 않았으므로 경고 문구를 보여줍니다.
            this.tooltipMsgTerms = this.tooltipMsgTermsWarning;
        }
    };
    SignupComponent.prototype.onClickPrivatePolicy = function (event) {
        event.preventDefault();
        event.stopPropagation();
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("signup / onClickPrivatePolicy / 시작");
        // 개인정보 취급방침 페이지로 이동.
        window.open("/#/private-info");
    };
    SignupComponent.prototype.onChangedFromChild = function (myEvent) {
        // 자식 엘리먼트들의 이벤트 처리
        var _this = this;
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("signup / onChangedFromChild / 시작");
        if (isDebug)
            console.log("signup / onChangedFromChild / myEvent : ", myEvent);
        if (null == myEvent) {
            if (isDebug)
                console.log("signup / onChangedFromChild / 중단 / null == myEven");
            return;
        }
        if (null == myEvent.myChecker) {
            if (isDebug)
                console.log("signup / onChangedFromChild / 중단 / null == myEvent.myChecker");
            return;
        }
        if (null == myEvent.value) {
            if (isDebug)
                console.log("signup / onChangedFromChild / 중단 / null == myEvent.value");
            return;
        }
        // 모든 myEvent는 myChecker를 가지고 들어와야 합니다.
        // myChecker로 다시 한번 더 검사, 통과해야만 사용할 수 있습니다.
        var isOK = this.myCheckerService.isOK(myEvent.myChecker, myEvent.value);
        if (!isOK) {
            if (isDebug)
                console.log("signup / onChangedFromChild / 중단 / !isOK");
            return;
        }
        // 정상적인 값을 가진 이벤트입니다.
        if (this.myEventService.ON_CHANGE === myEvent.eventName) {
            if (this.myEventService.KEY_USER_EMAIL === myEvent.key) {
                var email_1 = myEvent.value;
                // DB Unique test
                this.userService
                    .getUserByEmail(email_1)
                    .then(function (myResponse) {
                    if (myResponse.isSuccess() &&
                        myResponse.hasDataProp("user")) {
                        // 해당 이메일로 등록된 유저는 없습니다. 
                        // email 등록이 가능합니다.
                        _this.email = email_1;
                        if (isDebug)
                            console.log("signup / onChangedFromChild / email 등록이 가능합니다.");
                    } // end if
                }); // end service
            }
            else if (this.myEventService.KEY_USER_PASSWORD === myEvent.key) {
                this.password = myEvent.value;
                if (isDebug)
                    console.log("signup / onChangedFromChild / this.password : ", this.password);
            }
            else if (this.myEventService.KEY_USER_NAME === myEvent.key) {
                this.name = myEvent.value;
                if (isDebug)
                    console.log("signup / onChangedFromChild / this.name : ", this.name);
            }
            else if (this.myEventService.KEY_USER_NICKNAME === myEvent.key) {
                this.nickname = myEvent.value;
                if (isDebug)
                    console.log("signup / onChangedFromChild / this.nickname : ", this.nickname);
            }
            else if (this.myEventService.KEY_USER_THUMBNAIL === myEvent.key) {
                this.thumbnail = myEvent.value;
                if (isDebug)
                    console.log("signup / onChangedFromChild / this.thumbnail : ", this.thumbnail);
            }
            else if (this.myEventService.KEY_USER_MOBILE_NUM_HEAD === myEvent.key) {
                this.mobileNumHead = myEvent.value;
                if (isDebug)
                    console.log("signup / onChangedFromChild / this.mobileNumHead : ", this.mobileNumHead);
            }
            else if (this.myEventService.KEY_USER_MOBILE_NUM_BODY === myEvent.key) {
                this.mobileNumBody = myEvent.value;
                if (isDebug)
                    console.log("signup / onChangedFromChild / this.mobileNumBody : ", this.mobileNumBody);
            }
            else if (this.myEventService.KEY_USER_MOBILE_NUM_TAIL === myEvent.key) {
                this.mobileNumTail = myEvent.value;
                if (isDebug)
                    console.log("signup / onChangedFromChild / this.mobileNumTail : ", this.mobileNumTail);
            }
            else if (this.myEventService.KEY_USER_GENDER === myEvent.key) {
                this.gender = myEvent.value;
                if (isDebug)
                    console.log("signup / onChangedFromChild / this.gender : ", this.gender);
            }
            else if (this.myEventService.KEY_USER_BIRTH_YEAR === myEvent.key) {
                this.birthYear = myEvent.value;
                if (isDebug)
                    console.log("signup / onChangedFromChild / this.birthYear : ", this.birthYear);
            }
            else if (this.myEventService.KEY_USER_BIRTH_MONTH === myEvent.key) {
                this.birthMonth = myEvent.value;
                if (isDebug)
                    console.log("signup / onChangedFromChild / this.birthMonth : ", this.birthMonth);
            }
            else if (this.myEventService.KEY_USER_BIRTH_DAY === myEvent.key) {
                this.birthDay = myEvent.value;
                if (isDebug)
                    console.log("signup / onChangedFromChild / this.birthDay : ", this.birthDay);
            } // end if
        } // end if
        if (isDebug)
            console.log("signup / onChangedFromChild / done");
    };
    __decorate([
        core_1.ViewChild(email_component_1.EmailComponent), 
        __metadata('design:type', email_component_1.EmailComponent)
    ], SignupComponent.prototype, "emailComponent", void 0);
    __decorate([
        core_1.ViewChild(password_component_1.PasswordComponent), 
        __metadata('design:type', password_component_1.PasswordComponent)
    ], SignupComponent.prototype, "passwordComponent", void 0);
    __decorate([
        core_1.ViewChild(name_component_1.NameComponent), 
        __metadata('design:type', name_component_1.NameComponent)
    ], SignupComponent.prototype, "nameComponent", void 0);
    __decorate([
        core_1.ViewChild(nickname_component_1.NicknameComponent), 
        __metadata('design:type', nickname_component_1.NicknameComponent)
    ], SignupComponent.prototype, "nicknameComponent", void 0);
    __decorate([
        core_1.ViewChild(mobile_component_1.MobileComponent), 
        __metadata('design:type', mobile_component_1.MobileComponent)
    ], SignupComponent.prototype, "mobileComponent", void 0);
    __decorate([
        core_1.ViewChild(gender_component_1.GenderComponent), 
        __metadata('design:type', gender_component_1.GenderComponent)
    ], SignupComponent.prototype, "genderComponent", void 0);
    __decorate([
        core_1.ViewChild(birthday_component_1.BirthdayComponent), 
        __metadata('design:type', birthday_component_1.BirthdayComponent)
    ], SignupComponent.prototype, "birthdayComponent", void 0);
    __decorate([
        core_1.ViewChild(profile_img_upload_component_1.ProfileImgUploadComponent), 
        __metadata('design:type', profile_img_upload_component_1.ProfileImgUploadComponent)
    ], SignupComponent.prototype, "profileImgUploadComponent", void 0);
    SignupComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'signup',
            templateUrl: 'signup.component.html',
            styleUrls: ['signup.component.css']
        }), 
        __metadata('design:paramtypes', [login_service_1.LoginService, user_service_1.UserService, my_logger_service_1.MyLoggerService, my_checker_service_1.MyCheckerService, my_event_service_1.MyEventService, my_event_watchtower_service_1.MyEventWatchTowerService, router_1.ActivatedRoute, router_1.Router])
    ], SignupComponent);
    return SignupComponent;
}());
exports.SignupComponent = SignupComponent;
//# sourceMappingURL=signup.component.js.map