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
var profile_img_upload_component_1 = require('../../widget/input/profile-img-upload/profile-img-upload.component');
var password_component_1 = require('../../widget/input/password/password.component');
var mobile_component_1 = require('../../widget/input/mobile/mobile.component');
var gender_component_1 = require('../../widget/input/gender/gender.component');
var birthday_component_1 = require('../../widget/input/birthday/birthday.component');
var default_component_1 = require('../../widget/input/default/default.component');
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
        this.hasAgreedWithTerms = false;
        this.tooltipMsgTerms = null;
        this.tooltipMsgTermsWarning = "약관 동의가 필요합니다.";
        this.redirectUrl = "/class-center";
        this.isAdmin = false;
        this.errorMsgArr = [];
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("signup / constructor / init");
        this.defaultMetaList = this.myEventService.getDefaultMetaListMyInfo();
        if (isDebug)
            console.log("signup / ngOnInit / this.defaultMetaList : ", this.defaultMetaList);
    }
    SignupComponent.prototype.ngOnInit = function () {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("signup / ngOnInit / init");
    };
    SignupComponent.prototype.ngAfterViewInit = function () {
        // 자식 뷰가 모두 완료된 이후에 초기화를 진행.
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("signup / ngAfterViewInit");
        this.setDefaultComponents();
        this.asyncViewPack();
    };
    SignupComponent.prototype.setDefaultComponents = function () {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("signup / setDefaultComponents / 시작");
        // DefaultComponent들을 세팅
        this.emailComponent = this.getInput(this.myEventService.KEY_USER_EMAIL);
        this.nameComponent = this.getInput(this.myEventService.KEY_USER_NAME);
        this.nicknameComponent = this.getInput(this.myEventService.KEY_USER_NICKNAME);
    };
    SignupComponent.prototype.asyncViewPack = function () {
        var _this = this;
        // let isDebug:boolean = true;
        var isDebug = false;
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
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("signup / init / 시작");
        // 뷰에 필요한 공통 정보를 설정합니다.
        this.setViewPack();
        this.logPageEnter();
        this.checkSignedUpUserInfo();
        // 로그인, 회원 등록의 경우, 최상단 메뉴를 가립니다.
        this.watchTower.announceToggleTopMenu(false);
    };
    // @ Desc : DefaultComponent로 부터 원하는 input component를 가져옵니다.
    SignupComponent.prototype.getInput = function (eventKey) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("signup / getInput / init");
        var target = null;
        this.inputComponentList.forEach(function (inputComponent) {
            if (isDebug)
                console.log("signup / getInput / eventKey : ", eventKey);
            if (isDebug)
                console.log("signup / getInput / inputComponent.getEventKey() : ", inputComponent.getEventKey());
            if (inputComponent.hasEventKey(eventKey)) {
                if (isDebug)
                    console.log("signup / getInput / inputComponent : ", inputComponent);
                target = inputComponent;
                return;
            }
        }); // end for-each
        return target;
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
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("signup / checkSignedUpUserInfo / 시작");
        // 다른 플랫폼으로 로그인 뒤에 회원 가입으로 진입했다면, 해당 파라미터로 미리 등록된 유저 정보를 가져옵니다.
        this.route.params.switchMap(function (params) {
            if (isDebug)
                console.log("signup / checkSignedUpUserInfo / switchMap / params : ", params);
            if (null != params['facebookId']) {
                var facebookId = params['facebookId'];
                if (isDebug)
                    console.log("signup / checkSignedUpUserInfo / switchMap / facebookId : ", facebookId);
                if (null != facebookId && "" != facebookId) {
                    return _this.userService.getUserByFacebookId(facebookId);
                }
            }
            if (null != params['kakaoId']) {
                var kakaoId = params['kakaoId'];
                if (isDebug)
                    console.log("signup / checkSignedUpUserInfo / switchMap / kakaoId : ", kakaoId);
                if (null != kakaoId && "" != kakaoId) {
                    return _this.userService.getUserByKakaoId(kakaoId);
                }
            }
            if (null != params['naverId']) {
                var naverId = params['naverId'];
                if (isDebug)
                    console.log("signup / checkSignedUpUserInfo / switchMap / naverId : ", naverId);
                if (null != naverId && "" != naverId) {
                    return _this.userService.getUserByNaverId(naverId);
                }
            }
            return Observable_1.Observable.of();
        }).subscribe(function (myResponse) {
            if (isDebug)
                console.log("signup / checkSignedUpUserInfo / subscribe / myResponse : ", myResponse);
            // let kakaoId:number = -1;
            var userJSON = null;
            if (myResponse.isSuccess()) {
                // kakaoId = +myResponse.getDataProp("kakao_id");
                userJSON = myResponse.getDataProp("user");
            }
            _this.user = _this.userService.getUserFromJSON(userJSON);
            if (isDebug)
                console.log("signup / checkSignedUpUserInfo / subscribe / this.user : ", _this.user);
            if (null != _this.user) {
                _this.userCopy = _this.user.copy();
                if (_this.userCopy.isFacebookUser()) {
                    if (isDebug)
                        console.log("signup / checkSignedUpUserInfo / subscribe / 페이스북 로그인 - 유저 정보 가져오기.");
                    // 페이스북 로그인 - 유저 정보 가져오기.
                    _this.emailComponent.setInput(_this.userCopy.email);
                    _this.nameComponent.setInput(_this.userCopy.name);
                    _this.nicknameComponent.setInput(_this.userCopy.nickname);
                    _this.profileImgUploadComponent.setProfileImg(_this.userCopy.thumbnail);
                }
                else if (_this.userCopy.isKakaoUser()) {
                    if (isDebug)
                        console.log("signup / checkSignedUpUserInfo / subscribe / 카카오 로그인 - 유저 정보 가져오기.");
                    // 카카오 로그인 - 유저 정보 가져오기.
                    _this.nameComponent.setInput(_this.userCopy.name);
                    _this.nicknameComponent.setInput(_this.userCopy.nickname);
                    _this.profileImgUploadComponent.setProfileImg(_this.userCopy.thumbnail);
                }
                else if (_this.userCopy.isNaverUser()) {
                    if (isDebug)
                        console.log("signup / checkSignedUpUserInfo / subscribe / 네이버 로그인 - 유저 정보 가져오기.");
                    // 네이버 로그인 - 유저 정보 가져오기.
                    _this.emailComponent.setInput(_this.user.email);
                    _this.nameComponent.setInput(_this.user.name);
                    _this.nicknameComponent.setInput(_this.user.nickname);
                    _this.genderComponent.setGender(_this.user.gender);
                } // end if        
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
            } // end if
        }); // end subscribe
    }; // end checkSignedUpUserInfo
    SignupComponent.prototype.onClickSignup = function (event) {
        event.preventDefault();
        event.stopPropagation();
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("signup / onClickSignup / 시작");
        // 회원 가입을 하는데 필요한 모든 필드를 검사합니다.
        // 문제가 있다면 해당 필드에 경고를 보여줍니다.
        // @ Required
        if (this.emailComponent.hasNotDone()) {
            this.nicknameComponent.showTooltipFailWarning(
            // msg:string,
            "이메일을 다시 확인해주세요", 
            // isTimeout:Boolean
            false);
            return;
        }
        // @ Required - password
        if (this.passwordComponent.hasNotDoneP()) {
            if (isDebug)
                console.log("signup / onClickSignup / 비밀번호에 문제가 있습니다. 경고 메시지를 노출합니다.");
            this.passwordComponent.showWarningP();
            return;
        }
        else if (this.passwordComponent.hasNotDoneRP()) {
            if (isDebug)
                console.log("signup / onClickSignup / 비밀번호 재입력에 문제가 있습니다. 화면에 표시해줍니다.");
            this.passwordComponent.showWarningRP();
            return;
        }
        // @ Required - Mobile
        if (this.mobileComponent.hasNotDoneMobileHead()) {
            this.mobileComponent.showWarningMobileHead();
            if (isDebug)
                console.log("signup / onClickSignup / hasNotDoneMobileHead : ");
            return;
        }
        // @ Required - Mobile
        if (this.userCopy.isMobileHeadEmpty()) {
            // 전화번호 첫 3자리가 기본값 '010'일 경우, 컴포넌트에서 기본값을 가져온다.
            this.userCopy.setMobileHead(this.mobileComponent.getMobileHead());
        }
        if (this.mobileComponent.hasDoneMobileHead() &&
            this.mobileComponent.hasNotDoneMobileBody()) {
            // 휴대전화 첫 세자리 완료. 두번째 네자리는 아직 완료안됨.
            this.mobileComponent.showWarningMobileBody(null);
            if (isDebug)
                console.log("signup / onClickSignup / hasNotDoneMobileBody");
            return;
        }
        else if (this.mobileComponent.hasDoneMobileHead() &&
            this.mobileComponent.hasDoneMobileBody() &&
            this.mobileComponent.hasNotDoneMobileTail()) {
            // 휴대전화 첫 세자리 완료. 두번째 네자리는 완료. 휴대전화 세번째 4자리 아직 완료안됨. 경고.
            this.mobileComponent.showWarningMobileTail();
            return;
        }
        // @ Required - Gender
        if (this.genderComponent.hasNotDone()) {
            if (isDebug)
                console.log("signup / onClickSignup / hasNotDoneGender");
            this.genderComponent.showWarning();
            return;
        }
        // @ Required
        // name
        if (this.nicknameComponent.hasNotDone()) {
            if (isDebug)
                console.log("signup / onClickSignup / hasNotDoneNickname");
            // 유효한 값이 아닙니다!
            this.nicknameComponent.showTooltipFailWarning(
            // msg:string,
            "닉네임을 다시 확인해주세요", 
            // isTimeout:Boolean
            false);
            return;
        }
        // @ Required
        if (this.nameComponent.hasNotDone()) {
            if (isDebug)
                console.log("signup / onClickSignup / hasNotDoneName");
            // 유효한 값이 아닙니다!
            this.nameComponent.showTooltipFailWarning(
            // msg:string,
            "이름을 다시 확인해주세요", 
            // isTimeout:Boolean
            false);
            return;
        }
        // @ Optional
        // 프로필 이미지 검사 - 없는 경우, 기본값 설정.
        if (this.userCopy.isEmptyThumbnail()) {
            this.userCopy.thumbnail = this.profileImgUploadComponent.getProfileImgUrl();
        } // end if
        // 약관 동의 확인. 
        if (!this.hasAgreedWithTerms) {
            if (isDebug)
                console.log("signup / onClickSignup / this.hasAgreedWithTerms : ", this.hasAgreedWithTerms);
            // 약관 동의가 필요하다는 경고 메시지를 띄웁니다.
            this.tooltipMsgTerms = this.tooltipMsgTermsWarning;
            return;
        }
        if (null != this.user) {
            // 1-1. 플랫폼을 통해 가입 - facebook
            // 1-2. 플랫폼을 통해 가입 - kakao
            // 1-3. 플랫폼을 통해 가입 - naver
            if (isDebug)
                console.log("signup / onClickSignup / 플랫폼을 통해 가입");
            this.updateUser();
        }
        else if (null == this.user) {
            // 2. 플랫폼을 통하지 않고 직접 가입.
            if (isDebug)
                console.log("signup / onClickSignup / 플랫폼을 통하지 않고 직접 가입.");
            this.addUser();
        } // end inner if
        // REMOVE ME
        // let isAllOK:boolean = true;
        // @ Optional
        // 생년월일 검사
        /*
        if(this.birthdayComponent.hasNotDoneBirthYear()) {
          // this.birthdayComponent.showWarningBirthYear();
          if(isDebug) console.log("signup / onClickSignup / hasNotDoneBirthYear");
          // 유효한 값이 아닙니다!
        }
        if(this.birthdayComponent.hasNotDoneBirthMonth()) {
          // this.birthdayComponent.showWarningBirthMonth();
          if(isDebug) console.log("signup / onClickSignup / hasNotDoneBirthMonth");
          // 유효한 값이 아닙니다!
        }
        if(this.birthdayComponent.hasNotDoneBirthDay()) {
          // this.birthdayComponent.showWarningBirthDay();
          if(isDebug) console.log("signup / onClickSignup / hasNotDoneBirthDay");
          // 유효한 값이 아닙니다!
        }
    
        // @ Optional
        // 프로필 이미지 검사
        if(this.profileImgUploadComponent.hasNotDone()) {
          if(isDebug) console.log("signup / onClickSignup / hasNotDoneProfileImg");
          // 유효한 값이 아닙니다!
        } else {
          if(this.userCopy.isEmptyThumbnail()) {
            this.userCopy.thumbnail = this.profileImgUploadComponent.getProfileImgUrl();
          } // end if
        } // end if
        */
        // 등록되지 않은 필드가 있다면 표시해줘야 합니다.
        /*
        if(isAllOK) {
          if(isDebug) console.log("signup / onClickSignup / 모든 필드가 문제가 없다면 유저 데이터를 전송!");
    
          if(null != this.user) {
            // 1-1. 플랫폼을 통해 가입 - facebook
            // 1-2. 플랫폼을 통해 가입 - kakao
            // 1-3. 플랫폼을 통해 가입 - naver
            if(isDebug) console.log("signup / onClickSignup / 플랫폼을 통해 가입");
            this.updateUser();
          } else if(null == this.user) {
            // 2. 플랫폼을 통하지 않고 직접 가입.
            if(isDebug) console.log("signup / onClickSignup / 플랫폼을 통하지 않고 직접 가입.");
            this.addUser();
          } // end inner if
        } // end outer if
        */
    }; // end method
    SignupComponent.prototype.updateUser = function () {
        var _this = this;
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("signup / updateUser / 시작");
        if (isDebug)
            console.log("signup / updateUser / this.user.id : ", this.userCopy.id);
        if (isDebug)
            console.log("signup / updateUser / this.email : ", this.userCopy.email);
        if (isDebug)
            console.log("signup / updateUser / this.password : ", this.userCopy.password);
        if (isDebug)
            console.log("signup / updateUser / this.name : ", this.userCopy.name);
        if (isDebug)
            console.log("signup / updateUser / this.nickname : ", this.userCopy.nickname);
        if (isDebug)
            console.log("signup / updateUser / this.gender : ", this.userCopy.gender);
        if (isDebug)
            console.log("signup / updateUser / this.birthYear : ", this.userCopy.getBirthYear());
        if (isDebug)
            console.log("signup / updateUser / this.birthMonth : ", this.userCopy.getBirthMonth());
        if (isDebug)
            console.log("signup / updateUser / this.birthDay : ", this.userCopy.getBirthDay());
        if (isDebug)
            console.log("signup / updateUser / this.thumbnail : ", this.userCopy.thumbnail);
        if (isDebug)
            console.log("signup / updateUser / this.mobileNumHead : ", this.userCopy.getMobileHead());
        if (isDebug)
            console.log("signup / updateUser / this.mobileNumBody : ", this.userCopy.getMobileBody());
        if (isDebug)
            console.log("signup / updateUser / this.mobileNumTail : ", this.userCopy.getMobileTail());
        this.userService
            .updateUser(
        // apiKey:string
        this.myCheckerService.getAPIKey(), 
        // userId:number
        this.userCopy.id, 
        // email:string
        this.userCopy.email, 
        // password:string
        this.userCopy.password, 
        // name:string
        this.userCopy.name, 
        // nickname:string
        this.userCopy.nickname, 
        // gender:string
        this.userCopy.gender, 
        // birthYear:string
        this.userCopy.getBirthYear(), 
        // birthMonth:string
        this.userCopy.getBirthMonth(), 
        // birthDay:string  
        this.userCopy.getBirthDay(), 
        // thumbnail:string
        this.userCopy.thumbnail, 
        // mobileHead:string
        this.userCopy.getMobileHead(), 
        // mobileBody:string
        this.userCopy.getMobileBody(), 
        // mobileTail:string
        this.userCopy.getMobileTail()).then(function (myResponse) {
            if (isDebug)
                console.log("signup / updateUser / myResponse : ", myResponse);
            var userJSON = null;
            if (myResponse.isSuccess()) {
                userJSON = myResponse.getDataProp("user");
            }
            if (null != userJSON) {
                _this.user = _this.userService.getUserFromJSON(userJSON);
                _this.userCopy = _this.user.copy();
            }
            if (isDebug)
                console.log("signup / updateUser / this.user : ", _this.user);
            if (null != userJSON &&
                null != _this.user &&
                null != _this.user.id &&
                null != _this.user.email) {
                // 유저 정보가 제대로 추가되었다면, 메일을 발송, 인증을 시작!
                _this.sendMailUserValidation(_this.user.id, _this.user.email);
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
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("signup / addUser / 시작");
        this.userService
            .addUser(
        // apiKey:string
        this.myCheckerService.getAPIKey(), 
        // email:string
        this.userCopy.email, 
        // password:string
        this.userCopy.password, 
        // name:string
        this.userCopy.name, 
        // nickname:string
        this.userCopy.nickname, 
        // gender:string
        this.userCopy.gender, 
        // birthYear:string
        this.userCopy.getBirthYear(), 
        // birthMonth:string
        this.userCopy.getBirthMonth(), 
        // birthDay:string  
        this.userCopy.getBirthDay(), 
        // thumbnail:string
        this.userCopy.thumbnail, 
        // mobileHead:string
        this.userCopy.getMobileHead(), 
        // mobileBody:string
        this.userCopy.getMobileBody(), 
        // mobileTail:string
        this.userCopy.getMobileTail()).then(function (myResponse) {
            if (isDebug)
                console.log("signup / addUser / myResponse : ", myResponse);
            var userJSON = null;
            if (myResponse.isSuccess()) {
                userJSON = myResponse.getDataProp("user");
            }
            if (null != userJSON) {
                _this.user = _this.userService.getUserFromJSON(userJSON);
                _this.userCopy = _this.user.copy();
            }
            if (isDebug)
                console.log("signup / addUser / this.user : ", _this.user);
            if (null != _this.user && null != _this.user.id && null != _this.user.email) {
                // 유저 정보가 제대로 추가되었다면, 메일을 발송, 인증을 시작!
                if (isDebug)
                    console.log("signup / addUser / 메일을 발송, 인증을 시작!");
                _this.sendMailUserValidation(_this.user.id, _this.user.email);
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
        // let isDebug:boolean = true;
        var isDebug = false;
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
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("signup / onChangedFromChild / 시작");
        if (isDebug)
            console.log("signup / onChangedFromChild / myEvent : ", myEvent);
        if (myEvent.isNotValid()) {
            if (isDebug)
                console.log("signup / onChangedFromChild / 중단 / myEvent.isNotValid()");
            return;
        }
        if (null == this.user && null == this.userCopy) {
            if (isDebug)
                console.log("signup / onChangedFromChild / 플랫폼을 통한 회원 등록이 아닌 경우를 대비, user 객체가 없다면, 빈 user 객체를 만들어 데이터를 채운다.");
            this.user = this.userService.getUserEmpty();
            this.userCopy = this.user.copy();
        } // end if
        // 정상적인 값을 가진 이벤트입니다.
        if (myEvent.hasEventName(this.myEventService.ON_CHANGE)) {
            if (myEvent.hasKey(this.myEventService.KEY_USER_EMAIL)) {
                var email = myEvent.value;
                if (isDebug)
                    console.log("signup / onChangedFromChild / email : ", email);
                this.checkEmailUnique(email);
            }
            else if (myEvent.hasKey(this.myEventService.KEY_USER_PASSWORD)) {
                this.userCopy.password = myEvent.value;
                if (isDebug)
                    console.log("signup / onChangedFromChild / this.userCopy.password : ", this.userCopy.password);
            }
            else if (myEvent.hasKey(this.myEventService.KEY_USER_NAME)) {
                this.userCopy.name = myEvent.value;
                if (isDebug)
                    console.log("signup / onChangedFromChild / this.userCopy.name : ", this.userCopy.name);
            }
            else if (myEvent.hasKey(this.myEventService.KEY_USER_NICKNAME)) {
                this.userCopy.nickname = myEvent.value;
                if (isDebug)
                    console.log("signup / onChangedFromChild / this.userCopy.nickname : ", this.userCopy.nickname);
            }
            else if (myEvent.hasKey(this.myEventService.KEY_USER_THUMBNAIL)) {
                this.userCopy.thumbnail = myEvent.value;
                if (isDebug)
                    console.log("signup / onChangedFromChild / this.userCopy.thumbnail : ", this.userCopy.thumbnail);
            }
            else if (myEvent.hasKey(this.myEventService.KEY_USER_MOBILE_NUM_HEAD)) {
                this.userCopy.setMobileHead(myEvent.value);
                if (isDebug)
                    console.log("signup / onChangedFromChild / this.userCopy.mobile : ", this.userCopy.mobile);
            }
            else if (myEvent.hasKey(this.myEventService.KEY_USER_MOBILE_NUM_BODY)) {
                this.userCopy.setMobileBody(myEvent.value);
                if (isDebug)
                    console.log("signup / onChangedFromChild / this.userCopy.mobile : ", this.userCopy.mobile);
            }
            else if (myEvent.hasKey(this.myEventService.KEY_USER_MOBILE_NUM_TAIL)) {
                this.userCopy.setMobileTail(myEvent.value);
                if (isDebug)
                    console.log("signup / onChangedFromChild / this.userCopy.mobile : ", this.userCopy.mobile);
                this.checkMobileUnique(this.userCopy.mobile);
            }
            else if (myEvent.hasKey(this.myEventService.KEY_USER_GENDER)) {
                this.userCopy.gender = myEvent.value;
                if (isDebug)
                    console.log("signup / onChangedFromChild / this.userCopy.gender : ", this.userCopy.gender);
            }
            else if (myEvent.hasKey(this.myEventService.KEY_USER_BIRTH_YEAR)) {
                this.userCopy.setBirthYear(myEvent.value);
                if (isDebug)
                    console.log("signup / onChangedFromChild / this.userCopy.birthday : ", this.userCopy.birthday);
            }
            else if (myEvent.hasKey(this.myEventService.KEY_USER_BIRTH_MONTH)) {
                this.userCopy.setBirthMonth(myEvent.value);
                if (isDebug)
                    console.log("signup / onChangedFromChild / this.userCopy.birthday : ", this.userCopy.birthday);
            }
            else if (myEvent.hasKey(this.myEventService.KEY_USER_BIRTH_DAY)) {
                this.userCopy.setBirthDay(myEvent.value);
                if (isDebug)
                    console.log("signup / onChangedFromChild / this.userCopy.birthday : ", this.userCopy.birthday);
            } // end if
        }
        else if (myEvent.hasEventName(this.myEventService.ON_CHANGE_NOT_VALID)) {
            this.myEventService.onChangeNotValid(myEvent);
        } // end if
        if (isDebug)
            console.log("signup / onChangedFromChild / done");
    };
    SignupComponent.prototype.checkEmailUnique = function (email) {
        var _this = this;
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("signup / checkEmailUnique / 시작");
        if (null == email || "" === email) {
            return;
        }
        // DB Unique test
        this.userService
            .getUserByEmail(email)
            .then(function (myResponse) {
            if (myResponse.isSuccess() &&
                myResponse.hasDataProp("user")) {
                // 해당 이메일로 등록된 유저는 없습니다. 
                // email 등록이 가능합니다.
                _this.userCopy.email = email;
                if (isDebug)
                    console.log("signup / checkEmailUnique / email 등록이 가능합니다.");
                if (isDebug)
                    console.log("signup / checkEmailUnique / this.userCopy.email : ", _this.userCopy.email);
            } // end if
        }); // end service
    }; // end method
    SignupComponent.prototype.checkMobileUnique = function (mobile) {
        var _this = this;
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("signup / checkMobileUnique / 시작");
        if (null == mobile || "" === mobile) {
            return;
        }
        // 휴대전화 번호가 모두 확인되었습니다. 
        // DB Unique test
        this.userService
            .getUserByMobile(
        // apiKey:string, 
        this.watchTower.getApiKey(), 
        // mobileHead:string, 
        this.userCopy.getMobileHead(), 
        // mobileBody:string, 
        this.userCopy.getMobileBody(), 
        // mobileTail:string
        this.userCopy.getMobileTail())
            .then(function (myResponse) {
            if (isDebug)
                console.log("signup / checkMobileUnique / myResponse : ", myResponse);
            if (myResponse.isSuccess()) {
                var userJSON = myResponse.getDataProp("user");
                if (isDebug)
                    console.log("signup / checkMobileUnique / userJSON : ", userJSON);
                if (null != userJSON) {
                    _this.mobileComponent.showWarningMobileBody("이미 등록된 번호입니다");
                }
                else {
                    // 해당 전화번호로 등록된 유저는 없습니다. 
                    if (isDebug)
                        console.log("signup / checkMobileUnique / mobile 등록이 가능합니다.");
                    if (isDebug)
                        console.log("signup / checkMobileUnique / this.userCopy.mobile : ", _this.userCopy.mobile);
                }
            }
            else {
                // TODO - Error Report
                if (isDebug)
                    console.log("signup / checkMobileUnique / Error Report");
                _this.myLoggerService.logError(
                // apiKey:string
                _this.watchTower.getApiKey(), 
                // errorType:string
                _this.myLoggerService.errorAPIFailed, 
                // errorMsg:string
                "signup / checkMobileUnique / Failed!");
            } // end if
        }); // end service    
    }; // end method
    __decorate([
        core_1.ViewChildren(default_component_1.DefaultComponent), 
        __metadata('design:type', core_1.QueryList)
    ], SignupComponent.prototype, "inputComponentList", void 0);
    __decorate([
        core_1.ViewChild(password_component_1.PasswordComponent), 
        __metadata('design:type', password_component_1.PasswordComponent)
    ], SignupComponent.prototype, "passwordComponent", void 0);
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