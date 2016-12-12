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
var login_service_1 = require('../login/service/login.service');
var user_service_1 = require('../users/service/user.service');
var teacher_service_1 = require('./service/teacher.service');
var url_service_1 = require("../util/url.service");
var my_logger_service_1 = require('../util/service/my-logger.service');
var my_event_watchtower_service_1 = require('../util/service/my-event-watchtower.service');
var my_event_service_1 = require('../util/service/my-event.service');
var my_checker_service_1 = require('../util/service/my-checker.service');
var profile_img_upload_component_1 = require('../widget/input/profile-img-upload/profile-img-upload.component');
var mobile_component_1 = require('../widget/input/mobile/mobile.component');
var gender_component_1 = require('../widget/input/gender/gender.component');
var birthday_component_1 = require('../widget/input/birthday/birthday.component');
var default_component_1 = require('../widget/input/default/default.component');
var default_service_1 = require('../widget/input/default/service/default.service');
var ApplyTeacherComponent = (function () {
    function ApplyTeacherComponent(loginService, myEventService, watchTower, userService, teacherService, myLoggerService, myCheckerService, urlService, defaultService, router) {
        this.loginService = loginService;
        this.myEventService = myEventService;
        this.watchTower = watchTower;
        this.userService = userService;
        this.teacherService = teacherService;
        this.myLoggerService = myLoggerService;
        this.myCheckerService = myCheckerService;
        this.urlService = urlService;
        this.defaultService = defaultService;
        this.router = router;
        this.redirectUrl = "/class-center";
        this.isAdmin = false;
        this.gender = "";
        // @ Desc : 사용자가 자신의 선생님 정보를 변경했는지 확인하는 플래그
        this.hasChanged = false;
        // Default Input 셋을 가져옵니다. 이름/닉네임/이메일에 사용됩니다.
        this.defaultMetaList = this.myEventService.getDefaultMetaListApplyTeacher();
    } // end function
    ApplyTeacherComponent.prototype.ngOnInit = function () {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("apply-teacher / ngOnInit / 시작");
        // 선생님 등록화면에서는 상,하단 메뉴를 가립니다.
        this.watchTower.announceToggleTopMenu(false);
    }; // end function
    ApplyTeacherComponent.prototype.ngAfterViewInit = function () {
        // 자식 뷰가 모두 완료된 이후에 초기화를 진행.
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("apply-teacher / ngAfterViewInit");
        this.setDefaultComponents();
        this.asyncViewPack();
    };
    ApplyTeacherComponent.prototype.setDefaultComponents = function () {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("apply-teacher / setDefaultComponents / 시작");
        // DefaultComponent들을 세팅
        this.emailComponent = this.getInput(this.myEventService.KEY_USER_EMAIL);
        this.nameComponent = this.getInput(this.myEventService.KEY_USER_NAME);
        this.nicknameComponent = this.getInput(this.myEventService.KEY_USER_NICKNAME);
        this.resumeComponent = this.getInput(this.myEventService.KEY_TEACHER_RESUME);
        this.greetingComponent = this.getInput(this.myEventService.KEY_TEACHER_GREETING);
    };
    ApplyTeacherComponent.prototype.asyncViewPack = function () {
        var _this = this;
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("apply-teacher / asyncViewPack / 시작");
        // 이미 View 기본정보가 들어왔다면 바로 가져온다.
        if (this.watchTower.getIsViewPackReady()) {
            if (isDebug)
                console.log("apply-teacher / asyncViewPack / isViewPackReady : ", true);
            this.init();
        } // end if
        // View에 필요한 기본 정보가 비동기로 들어올 경우, 처리.
        this.watchTower.isViewPackReady$.subscribe(function (isViewPackReady) {
            if (isDebug)
                console.log("apply-teacher / asyncViewPack / subscribe / isViewPackReady : ", isViewPackReady);
            _this.init();
        }); // end subscribe    
    };
    ApplyTeacherComponent.prototype.setViewPack = function () {
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
    ApplyTeacherComponent.prototype.copyUser = function () {
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("apply-teacher / copyUser / 시작");
        if (null == this.loginUser) {
            // 유저가 없는 경우는 복사를 중단합니다.
            if (isDebug)
                console.log("apply-teacher / copyUser / 중단 / 유저가 없는 경우는 복사를 중단합니다.");
            return;
        }
        this.newTeacher = this.teacherService.getTeacherFromUser(this.loginUser);
        this.newTeacherCopy = this.teacherService.getTeacherFromUser(this.loginUser);
        if (isDebug)
            console.log("apply-teacher / copyUser / this.newTeacherCopy : ", this.newTeacherCopy);
    };
    ApplyTeacherComponent.prototype.init = function () {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("apply-teacher / init / 시작");
        // 뷰에 필요한 공통 정보를 설정합니다.
        this.setViewPack();
        // 로그인한 유저 정보를 가져옵니다.
        this.setLoginUser();
        // 페이지 진입을 기록으로 남깁니다.
        this.logActionPage();
    }; // end init
    ApplyTeacherComponent.prototype.fillViewTeacherInfo = function () {
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("apply-teacher / fillViewTeacherInfo");
        if (isDebug)
            console.log("apply-teacher / fillViewTeacherInfo / this.newTeacher : ", this.newTeacher);
        if (null == this.newTeacher) {
            if (isDebug)
                console.log("apply-teacher / fillViewTeacherInfo / 중단 / this.newTeacherCopy is not valid!");
            return;
        }
        // email
        if (null != this.emailComponent) {
            if (isDebug)
                console.log("apply-teacher / fillViewTeacherInfo / this.newTeacherCopy.email : ", this.newTeacherCopy.email);
            this.emailComponent.setInput(this.newTeacher.email);
        }
        this.email = this.newTeacher.email;
        // name
        if (null != this.nameComponent) {
            if (isDebug)
                console.log("apply-teacher / fillViewTeacherInfo / this.newTeacherCopy.name : ", this.newTeacherCopy.name);
            this.nameComponent.setInput(this.newTeacher.name);
        }
        this.name = this.newTeacher.name;
        // nickname
        if (null != this.nicknameComponent) {
            if (isDebug)
                console.log("apply-teacher / fillViewTeacherInfo / this.newTeacherCopy.nickname : ", this.newTeacherCopy.nickname);
            this.nicknameComponent.setInput(this.newTeacher.nickname);
        }
        this.nickname = this.newTeacher.nickname;
        // resume
        if (null != this.resumeComponent) {
            if (isDebug)
                console.log("apply-teacher / fillViewTeacherInfo / this.newTeacherCopy.resume : ", this.newTeacherCopy.resume);
            this.resumeComponent.setInput(this.newTeacher.resume);
        }
        this.resume = this.newTeacher.resume;
        // greeting
        if (null != this.greetingComponent) {
            if (isDebug)
                console.log("apply-teacher / fillViewTeacherInfo / this.newTeacherCopy.greeting : ", this.newTeacherCopy.greeting);
            this.greetingComponent.setInput(this.newTeacher.greeting);
        }
        this.greeting = this.newTeacher.greeting;
        // thumbnail
        this.profileImgUploadComponent.setProfileImg(this.newTeacher.thumbnail);
        this.thumbnail = this.newTeacher.thumbnail;
        // mobile
        var mobile = this.newTeacher.mobile;
        var mobileArr = mobile.split("-");
        if (isDebug)
            console.log("apply-teacher / fillViewTeacherInfo / mobileArr : ", mobileArr);
        if (null != mobileArr && 3 === mobileArr.length) {
            this.mobileComponent.setMobileHead(mobileArr[0]);
            this.mobileComponent.setMobileBody(mobileArr[1]);
            this.mobileComponent.setMobileTail(mobileArr[2]);
        }
        // gender
        this.genderComponent.setGender(this.newTeacher.gender);
        // birthday
        var birthday = this.newTeacherCopy.birthday;
        var birthdayArr = birthday.split("-");
        if (isDebug)
            console.log("apply-teacher / fillViewTeacherInfo / birthdayArr : ", birthdayArr);
        if (null != birthdayArr && 3 === birthdayArr.length) {
            this.birthdayComponent.setBirthYear(birthdayArr[0]);
            this.birthdayComponent.setBirthMonth(birthdayArr[1]);
            this.birthdayComponent.setBirthDay(birthdayArr[1], birthdayArr[2]);
        }
    };
    ApplyTeacherComponent.prototype.logActionPage = function () {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("apply-teacher / logActionPage / 시작");
        // 페이지 진입을 기록으로 남깁니다.
        this.myLoggerService.logActionPage(
        // apiKey:string
        this.watchTower.getApiKey(), 
        // pageType:string
        this.myLoggerService.pageTypeSignupTeacher).then(function (myResponse) {
            // 로그 등록 결과를 확인해볼 수 있습니다.
            if (isDebug)
                console.log("apply-teacher / logActionPage / myResponse : ", myResponse);
        });
    };
    ApplyTeacherComponent.prototype.logError = function (errorType, errMsg) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("apply-teacher / logError / 시작");
        if (null == errorType) {
            return;
        }
        if (null == errMsg) {
            return;
        }
        // 에러 로그 등록
        this.myLoggerService.logError(
        // apiKey:string
        this.watchTower.getApiKey(), 
        // errorType:string
        errorType, 
        // errorMsg:string
        errMsg).then(function (myResponse) {
            if (isDebug)
                console.log("apply-teacher / logError / myResponse : ", myResponse);
        }); // end logError
    };
    ApplyTeacherComponent.prototype.setLoginUser = function () {
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("apply-teacher / setLoginUser / 시작");
        // 로그인 데이터를 가져옵니다.
        var loginUser = this.watchTower.getLoginUser();
        if (null != loginUser) {
            this.loginUser = loginUser;
            if (isDebug)
                console.log("apply-teacher / setLoginUser / this.loginUser : ", this.loginUser);
            // 가져온 유저 정보로 선생님 객체를 만듭니다.
            this.copyUser();
            // 가져온 유저 정보로 선생님 입력란을 채웁니다.
            this.fillViewTeacherInfo();
        }
        else {
            // 로그인 데이터를 가져오지 못한다면, 로그인 페이지로 이동합니다.
            // 로그인 이후, 선생님 등록 페이지로 리다이렉트 데이터를 전달해야 합니다.
            if (isDebug)
                console.log("apply-teacher / setLoginUser / 로그인 데이터를 가져오지 못한다면, 로그인 페이지로 이동합니다.");
            var req_url = this.urlService.get('#/login?redirect=/applyteacher');
            if (isDebug)
                console.log("apply-teacher / setLoginUser / req_url : ", req_url);
            window.location.href = req_url;
        } // end if
    };
    // @ Desc : DefaultComponent로 부터 원하는 input component를 가져옵니다.
    ApplyTeacherComponent.prototype.getInput = function (eventKey) {
        return this.defaultService.getInput(this.inputComponentList, eventKey);
    };
    ApplyTeacherComponent.prototype.onChangedFromChild = function (myEvent, myinfo, myhistory, mypayment, myfavorite) {
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("apply-teacher / onChangedFromChild / init");
        if (isDebug)
            console.log("apply-teacher / onChangedFromChild / myEvent : ", myEvent);
        if (isDebug)
            console.log("apply-teacher / onChangedFromChild / myEvent.key : ", myEvent.key);
        if (myEvent.isNotValid()) {
            if (isDebug)
                console.log("apply-teacher / onChangedFromChild / ON_CHANGE_NOT_VALID / 중단 / myEvent.isNotValid()");
            // TODO - Error Logger
            return;
        }
        if (myEvent.hasEventName(this.myEventService.ON_CHANGE)) {
            if (myEvent.hasKey(this.myEventService.KEY_USER_EMAIL)) {
                if (isDebug)
                    console.log("apply-teacher / onChangedFromChild / KEY_USER_EMAIL");
                var isOK = this.myCheckerService.isOK(myEvent.myChecker, myEvent.value);
                if (!isOK) {
                    if (isDebug)
                        console.log("apply-teacher / onChangedFromChild / 중단 / 이메일이 유효하지 않습니다.");
                    return;
                }
                // 1. newTeacher객체와 비교, 변경된 이름인지 확인합니다.
                this.updateNewProp("email", myEvent.value);
            }
            else if (myEvent.hasKey(this.myEventService.KEY_USER_NAME)) {
                if (isDebug)
                    console.log("apply-teacher / onChangedFromChild / KEY_USER_NAME");
                var isOK = this.myCheckerService.isOK(myEvent.myChecker, myEvent.value);
                if (!isOK) {
                    if (isDebug)
                        console.log("apply-teacher / onChangedFromChild / 중단 / 이름이 유효하지 않습니다.");
                    return;
                }
                // 1. newTeacher객체와 비교, 변경된 이름인지 확인합니다.
                this.updateNewProp("name", myEvent.value);
            }
            else if (myEvent.hasKey(this.myEventService.KEY_USER_NICKNAME)) {
                if (isDebug)
                    console.log("apply-teacher / onChangedFromChild / KEY_USER_NICKNAME");
                var isOK = this.myCheckerService.isOK(myEvent.myChecker, myEvent.value);
                if (!isOK) {
                    if (isDebug)
                        console.log("apply-teacher / onChangedFromChild / 중단 / 닉네임이 유효하지 않습니다.");
                    return;
                }
                // 1. newTeacher객체와 비교, 변경된 이름인지 확인합니다.
                this.updateNewProp("nickname", myEvent.value);
            }
            else if (myEvent.hasKey(this.myEventService.KEY_TEACHER_RESUME)) {
                if (isDebug)
                    console.log("apply-teacher / onChangedFromChild / KEY_TEACHER_RESUME");
                var isOK = this.myCheckerService.isOK(myEvent.myChecker, myEvent.value);
                if (!isOK) {
                    if (isDebug)
                        console.log("apply-teacher / onChangedFromChild / 중단 / 경력이 유효하지 않습니다.");
                    return;
                }
                // 1. newTeacher객체와 비교, 변경된 이름인지 확인합니다.
                this.updateNewProp("resume", myEvent.value);
            }
            else if (myEvent.hasKey(this.myEventService.KEY_TEACHER_GREETING)) {
                if (isDebug)
                    console.log("apply-teacher / onChangedFromChild / KEY_TEACHER_GREETING");
                var isOK = this.myCheckerService.isOK(myEvent.myChecker, myEvent.value);
                if (!isOK) {
                    if (isDebug)
                        console.log("apply-teacher / onChangedFromChild / 중단 / 인사말이 유효하지 않습니다.");
                    return;
                }
                // 1. newTeacher객체와 비교, 변경된 이름인지 확인합니다.
                this.updateNewProp("greeting", myEvent.value);
            }
            else if (myEvent.hasKey(this.myEventService.KEY_USER_THUMBNAIL)) {
                if (isDebug)
                    console.log("apply-teacher / onChangedFromChild / KEY_USER_THUMBNAIL");
                var isOK = this.myCheckerService.isOK(myEvent.myChecker, myEvent.value);
                if (!isOK) {
                    if (isDebug)
                        console.log("apply-teacher / onChangedFromChild / 중단 / 이름이 유효하지 않습니다.");
                    return;
                }
                // 1. newTeacher객체와 비교, 변경된 이름인지 확인합니다.
                this.updateNewProp("thumbnail", myEvent.value);
            }
            else if (myEvent.hasKey(this.myEventService.KEY_USER_MOBILE_NUM_HEAD)) {
                if (isDebug)
                    console.log("apply-teacher / onChangedFromChild / KEY_USER_MOBILE_NUM_HEAD");
                var isOK = this.myCheckerService.isOK(myEvent.myChecker, myEvent.value);
                if (!isOK) {
                    if (isDebug)
                        console.log("apply-teacher / onChangedFromChild / 중단 / 전화번호 첫번째 3자리가 유효하지 않습니다.");
                    return;
                }
                // 1. newTeacher객체와 비교, 변경된 전화번호 첫 3자리 인지 확인합니다.
                // 새로운 전화번호라면 변수에 저장합니다.
                this.updateNewMobileHead(myEvent.value);
            }
            else if (myEvent.hasKey(this.myEventService.KEY_USER_MOBILE_NUM_BODY)) {
                if (isDebug)
                    console.log("apply-teacher / onChangedFromChild / KEY_USER_MOBILE_NUM_BODY");
                var isOK = this.myCheckerService.isOK(myEvent.myChecker, myEvent.value);
                if (!isOK) {
                    if (isDebug)
                        console.log("apply-teacher / onChangedFromChild / 중단 / 전화번호 두번째 4자리가 유효하지 않습니다.");
                    return;
                }
                // 1. newTeacher객체와 비교, 변경된 전화번호 첫 3자리 인지 확인합니다.
                // 새로운 전화번호라면 변수에 저장합니다.
                this.updateNewMobileBody(myEvent.value);
            }
            else if (myEvent.hasKey(this.myEventService.KEY_USER_MOBILE_NUM_TAIL)) {
                if (isDebug)
                    console.log("apply-teacher / onChangedFromChild / KEY_USER_MOBILE_NUM_TAIL");
                var isOK = this.myCheckerService.isOK(myEvent.myChecker, myEvent.value);
                if (!isOK) {
                    if (isDebug)
                        console.log("apply-teacher / onChangedFromChild / 중단 / 전화번호 마지막 4자리가 유효하지 않습니다.");
                    return;
                }
                // 1. newTeacher객체와 비교, 변경된 전화번호 마지막 4자리 인지 확인합니다.
                // 새로운 전화번호라면 변수에 저장합니다.
                this.updateNewMobileTail(myEvent.value);
            }
            else if (myEvent.hasKey(this.myEventService.KEY_USER_BIRTH_YEAR)) {
                if (isDebug)
                    console.log("apply-teacher / onChangedFromChild / KEY_USER_BIRTH_YEAR");
                var isOK = this.myCheckerService.isOK(myEvent.myChecker, myEvent.value);
                if (!isOK) {
                    if (isDebug)
                        console.log("apply-teacher / onChangedFromChild / 중단 / 생일-연도가 유효하지 않습니다.");
                    return;
                }
                this.updateNewBirthYear(myEvent.value);
            }
            else if (myEvent.hasKey(this.myEventService.KEY_USER_BIRTH_MONTH)) {
                if (isDebug)
                    console.log("apply-teacher / onChangedFromChild / KEY_USER_BIRTH_MONTH");
                var isOK = this.myCheckerService.isOK(myEvent.myChecker, myEvent.value);
                if (!isOK) {
                    if (isDebug)
                        console.log("apply-teacher / onChangedFromChild / 중단 / 생일-월이 유효하지 않습니다.");
                    return;
                }
                this.updateNewBirthMonth(myEvent.value);
            }
            else if (myEvent.hasKey(this.myEventService.KEY_USER_BIRTH_DAY)) {
                if (isDebug)
                    console.log("apply-teacher / onChangedFromChild / KEY_USER_BIRTH_DAY");
                var isOK = this.myCheckerService.isOK(myEvent.myChecker, myEvent.value);
                if (!isOK) {
                    if (isDebug)
                        console.log("apply-teacher / onChangedFromChild / 중단 / 생일-날짜 유효하지 않습니다.");
                    return;
                }
                this.updateNewBirthDay(myEvent.value);
            }
            else if (myEvent.hasKey(this.myEventService.KEY_USER_GENDER)) {
                if (isDebug)
                    console.log("apply-teacher / onChangedFromChild / KEY_USER_BIRTH_DAY");
                var isOK = this.myCheckerService.isOK(myEvent.myChecker, myEvent.value);
                if (!isOK) {
                    if (isDebug)
                        console.log("apply-teacher / onChangedFromChild / 중단 / 생일-날짜 유효하지 않습니다.");
                    return;
                }
                this.updateNewProp("gender", myEvent.value);
            } // end if - ON CHANGE
        }
        else if (myEvent.hasEventName(this.myEventService.ON_CHANGE_NOT_VALID)) {
            this.myEventService.onChangeNotValid(myEvent);
        } // end if
    }; // end method
    ApplyTeacherComponent.prototype.isOKBirthday = function (birthYear, birthMonth, birthDay) {
        if (!this.birthdayComponent.isOKBirthYear(birthYear)) {
            return false;
        }
        if (!this.birthdayComponent.isOKBirthMonth(birthMonth)) {
            return false;
        }
        if (!this.birthdayComponent.isOKBirthDay(birthDay)) {
            return false;
        }
        return true;
    };
    ApplyTeacherComponent.prototype.updateNewMobileHead = function (newMobileHead) {
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("apply-teacher / updateNewMobileHead / init");
        if (!this.mobileComponent.isOKHead(newMobileHead)) {
            if (isDebug)
                console.log("apply-teacher / updateNewMobileHead / 중단 / newMobileHead is not valid!");
            return;
        }
        if (this.newTeacherCopy.isSameMobileHead(newMobileHead)) {
            if (isDebug)
                console.log("apply-teacher / updateNewMobileHead / 중단 / newMobileHead is not changed!");
            return;
        }
        // let mobileHead:string = this.mobileNumHead = this.newTeacherCopy.getMobileHead();
        var mobileHead = this.mobileNumHead = newMobileHead;
        var mobileBody = this.mobileNumBody = this.newTeacherCopy.getMobileBody();
        var mobileTail = this.mobileNumTail = this.newTeacherCopy.getMobileTail();
        var newMobile = mobileHead + "-" + mobileBody + "-" + mobileTail;
        if (isDebug)
            console.log("apply-teacher / updateNewMobileHead / newMobile : ", newMobile);
        this.newTeacherCopy.mobile = newMobile;
        // 저장 버튼 노출
        this.hasChanged = true;
    };
    ApplyTeacherComponent.prototype.updateNewMobileBody = function (newMobileBody) {
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("apply-teacher / updateNewMobileBody / init");
        if (!this.mobileComponent.isOKBody(newMobileBody)) {
            if (isDebug)
                console.log("apply-teacher / updateNewMobileBody / 중단 / newMobileBody is not valid!");
            return;
        }
        if (this.newTeacherCopy.isSameMobileBody(newMobileBody)) {
            if (isDebug)
                console.log("apply-teacher / updateNewMobileBody / 중단 / newMobileBody is not changed!");
            return;
        }
        var mobileHead = this.mobileNumHead = this.newTeacherCopy.getMobileHead();
        // let mobileBody:string = this.mobileNumBody = this.newTeacherCopy.getMobileBody();
        var mobileBody = this.mobileNumBody = newMobileBody;
        var mobileTail = this.mobileNumTail = this.newTeacherCopy.getMobileTail();
        var newMobile = mobileHead + "-" + mobileBody + "-" + mobileTail;
        if (isDebug)
            console.log("apply-teacher / updateNewMobileBody / newMobile : ", newMobile);
        this.newTeacherCopy.mobile = newMobile;
        // 저장 버튼 노출
        this.hasChanged = true;
    };
    ApplyTeacherComponent.prototype.updateNewMobileTail = function (newMobileTail) {
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("apply-teacher / updateNewMobileTail / init");
        if (!this.mobileComponent.isOKTail(newMobileTail)) {
            if (isDebug)
                console.log("apply-teacher / updateNewMobileTail / 중단 / newMobileTail is not valid!");
            return;
        }
        if (this.newTeacherCopy.isSameMobileTail(newMobileTail)) {
            if (isDebug)
                console.log("apply-teacher / updateNewMobileTail / 중단 / newMobileTail is not changed!");
            return;
        }
        var mobileHead = this.mobileNumHead = this.newTeacherCopy.getMobileHead();
        var mobileBody = this.mobileNumBody = this.newTeacherCopy.getMobileBody();
        // let mobileTail:string = this.mobileNumTail = this.newTeacherCopy.getMobileTail();
        var mobileTail = this.mobileNumTail = newMobileTail;
        var newMobile = mobileHead + "-" + mobileBody + "-" + mobileTail;
        if (isDebug)
            console.log("apply-teacher / updateNewMobileTail / newMobile : ", newMobile);
        this.newTeacherCopy.mobile = newMobile;
        // 저장 버튼 노출
        this.hasChanged = true;
    };
    ApplyTeacherComponent.prototype.updateNewBirthYear = function (newBirthYear) {
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("apply-teacher / updateNewBirthYear / init");
        if (!this.birthdayComponent.isOKBirthYear(newBirthYear)) {
            if (isDebug)
                console.log("apply-teacher / updateNewBirthYear / 중단 / newBirthYear is not valid!");
            return;
        }
        if (this.newTeacherCopy.isSameBirthYear(newBirthYear)) {
            if (isDebug)
                console.log("apply-teacher / updateNewBirthYear / 중단 / newBirthYear is not changed!");
            return;
        }
        // let birthYear:string = this.mobileNumHead = this.newTeacherCopy.getBirthYear();
        var birthYear = this.birthYear = newBirthYear;
        var birthMonth = this.birthMonth = this.newTeacherCopy.getBirthMonth();
        var birthDay = this.birthDay = this.newTeacherCopy.getBirthDay();
        var newBirthday = birthYear + "-" + birthMonth + "-" + birthDay;
        if (isDebug)
            console.log("apply-teacher / updateNewBirthYear / newBirthday : ", newBirthday);
        this.newTeacherCopy.birthday = newBirthday;
        // 저장 버튼 노출
        if (this.isOKBirthday(birthYear, birthMonth, birthDay)) {
            this.hasChanged = true;
        }
    };
    ApplyTeacherComponent.prototype.updateNewBirthMonth = function (newBirthMonth) {
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("apply-teacher / updateNewBirthMonth / init");
        if (!this.birthdayComponent.isOKBirthMonth(newBirthMonth)) {
            if (isDebug)
                console.log("apply-teacher / updateNewBirthMonth / 중단 / newBirthMonth is not valid!");
            return;
        }
        if (this.newTeacherCopy.isSameBirthMonth(newBirthMonth)) {
            if (isDebug)
                console.log("apply-teacher / updateNewBirthMonth / 중단 / newBirthMonth is not changed!");
            return;
        }
        var birthYear = this.mobileNumHead = this.newTeacherCopy.getBirthYear();
        // let birthMonth:string = this.birthMonth = this.newTeacherCopy.getBirthMonth();
        var birthMonth = this.birthMonth = newBirthMonth;
        var birthDay = this.birthDay = this.newTeacherCopy.getBirthDay();
        var newBirthday = birthYear + "-" + birthMonth + "-" + birthDay;
        if (isDebug)
            console.log("apply-teacher / updateNewBirthMonth / newBirthday : ", newBirthday);
        this.newTeacherCopy.birthday = newBirthday;
        // 저장 버튼 노출
        if (this.isOKBirthday(birthYear, birthMonth, birthDay)) {
            this.hasChanged = true;
        }
    };
    ApplyTeacherComponent.prototype.updateNewBirthDay = function (newBirthDay) {
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("apply-teacher / updateNewBirthDay / init");
        if (!this.birthdayComponent.isOKBirthDay(newBirthDay)) {
            if (isDebug)
                console.log("apply-teacher / updateNewBirthDay / 중단 / newBirthDay is not valid!");
            return;
        }
        if (this.newTeacherCopy.isSameBirthDay(newBirthDay)) {
            if (isDebug)
                console.log("apply-teacher / updateNewBirthDay / 중단 / newBirthDay is not changed!");
            return;
        }
        var birthYear = this.mobileNumHead = this.newTeacherCopy.getBirthYear();
        var birthMonth = this.birthMonth = this.newTeacherCopy.getBirthMonth();
        // let birthDay:string = this.birthDay = this.newTeacherCopy.getBirthDay();
        var birthDay = this.birthDay = newBirthDay;
        var newBirthday = birthYear + "-" + birthMonth + "-" + birthDay;
        if (isDebug)
            console.log("apply-teacher / updateNewBirthDay / newBirthday : ", newBirthday);
        this.newTeacherCopy.birthday = newBirthday;
        // 저장 버튼 노출
        if (this.isOKBirthday(birthYear, birthMonth, birthDay)) {
            this.hasChanged = true;
        }
    };
    ApplyTeacherComponent.prototype.updateNewProp = function (key, newValue) {
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("apply-teacher / updateNewProp / init");
        if (null == key || "" == key) {
            if (isDebug)
                console.log("apply-teacher / updateNewProp / 중단 / key is not valid!");
            return;
        }
        if (null == this.newTeacherCopy) {
            if (isDebug)
                console.log("apply-teacher / updateNewProp / 중단 / this.newTeacherCopy is not valid!");
            return;
        }
        var valueFromDB = this.newTeacher[key];
        if (valueFromDB !== newValue) {
            // 1-1. 변경된 값이라면 업데이트.
            if (null != this[key]) {
                this[key] = newValue;
            }
            // 변경된 이름을 복사해둔 loginUserCopy에 저장합니다.
            if (null != this.newTeacherCopy && null != this.newTeacherCopy[key]) {
                this.newTeacherCopy[key] = newValue;
                if (isDebug)
                    console.log("apply-teacher / updateNewProp / 변경된 이름을 복사해둔 loginUserCopy에 저장합니다.");
                if (isDebug)
                    console.log("apply-teacher / updateNewProp / this.newTeacherCopy : ", this.newTeacherCopy);
            }
            // 저장 버튼을 노출합니다.
            this.hasChanged = true;
        }
        else {
            // 변경되지 않았습니다.
            if (this.checkUserInfoChanged()) {
                // 모든 다른 항목중에 변경된 것이 없다면, 
                // 저장 버튼을 비활성화 합니다.
                this.hasChanged = false;
            } // end if
        } // end if
    }; // end method
    ApplyTeacherComponent.prototype.onClickSave = function (event) {
        var _this = this;
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("apply-teacher / onClickSave / init");
        var hasChanged = this.checkUserInfoChanged();
        if (isDebug)
            console.log("apply-teacher / onClickSave / hasChanged : ", hasChanged);
        if (isDebug)
            console.log("apply-teacher / onClickSave / this.newTeacherCopy : ", this.newTeacherCopy);
        if (hasChanged) {
            // 변경되었다면 저장합니다.
            if (isDebug)
                console.log("apply-teacher / onClickSave / 변경되었다면 저장합니다.");
            this.teacherService.insertTeacherByTeacher(this.watchTower.getApiKey(), this.newTeacherCopy).then(function (myResponse) {
                if (isDebug)
                    console.log("apply-teacher / onClickSave / 유저정보 업데이트 / myResponse : ", myResponse);
                var teacher = myResponse.digDataProp(["teacher"]);
                if (myResponse.isSuccess() && null != teacher) {
                    // 저장완료!
                    // 홈으로 리다이렉트 합니다.
                    if (isDebug)
                        console.log("apply-teacher / onClickSave / 저장완료! / 홈으로 리다이렉트 합니다.");
                    _this.router.navigate([_this.redirectUrl]);
                }
                else if (myResponse.isFailed()) {
                    if (null != myResponse.error && "" != myResponse.error) {
                        // 에러 내용은 화면에 표시한다.
                        _this.watchTower.announceErrorMsgArr([myResponse.error]);
                    }
                }
                else {
                    // TODO - Error Report
                    if (isDebug)
                        console.log("apply-teacher / onClickSave / Error Report");
                } // end if
            }); // end service
        }
        // 저장 버튼 비활성화.
        this.hasChanged = false;
    };
    ApplyTeacherComponent.prototype.checkUserInfoChanged = function () {
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("apply-teacher / checkUserInfoChanged / init");
        if (isDebug)
            console.log("apply-teacher / checkUserInfoChanged / this.newTeacher : ", this.newTeacher);
        if (isDebug)
            console.log("apply-teacher / checkUserInfoChanged / this.newTeacherCopy : ", this.newTeacherCopy);
        var mobileHead = this.newTeacher.getMobileHead();
        var mobileBody = this.newTeacher.getMobileBody();
        var mobileTail = this.newTeacher.getMobileTail();
        // 생일은 선택 입력이므로 없을 수도 있습니다.
        var birthYear = this.newTeacher.getBirthYear();
        var birthMonth = this.newTeacher.getBirthMonth();
        var birthDay = this.newTeacher.getBirthDay();
        // 검사 시작!
        var hasChanged = false;
        if (this.nameComponent.isOK(this.name) &&
            this.name !== this.newTeacher.name) {
            // 1. name
            if (isDebug)
                console.log("apply-teacher / checkUserInfoChanged / 이름이 변경됨");
            hasChanged = true;
        }
        else if (this.nicknameComponent.isOK(this.nickname) &&
            this.nickname !== this.newTeacher.nickname) {
            // 2. nickname
            if (isDebug)
                console.log("apply-teacher / checkUserInfoChanged / 닉네임이 변경됨");
            hasChanged = true;
        }
        else if (this.resumeComponent.isOK(this.resume) &&
            this.resume !== this.newTeacher.resume) {
            // 3. resume
            if (isDebug)
                console.log("apply-teacher / checkUserInfoChanged / 경력이 변경됨");
            hasChanged = true;
        }
        else if (this.greetingComponent.isOK(this.greeting) &&
            this.greeting !== this.newTeacher.greeting) {
            // 4. greeting
            if (isDebug)
                console.log("apply-teacher / checkUserInfoChanged / 경력이 변경됨");
            hasChanged = true;
        }
        else if (this.profileImgUploadComponent.isOK(this.thumbnail) &&
            this.thumbnail !== this.newTeacher.thumbnail) {
            // 3. profile-img
            if (isDebug)
                console.log("apply-teacher / checkUserInfoChanged / 섬네일이 변경됨");
            hasChanged = true;
        }
        else if (this.mobileComponent.isOKHead(this.mobileNumHead) &&
            mobileHead !== this.mobileNumHead) {
            // 4-1. mobile head
            if (isDebug)
                console.log("apply-teacher / checkUserInfoChanged / 휴대전화 첫 3자리 변경됨");
            hasChanged = true;
        }
        else if (this.mobileComponent.isOKBody(this.mobileNumBody) &&
            mobileBody !== this.mobileNumBody) {
            // 4-2. mobile body
            if (isDebug)
                console.log("apply-teacher / checkUserInfoChanged / 휴대전화 두번째 4자리 변경됨");
            hasChanged = true;
        }
        else if (this.mobileComponent.isOKTail(this.mobileNumTail) &&
            mobileTail !== this.mobileNumTail) {
            // 4-3. mobile tail
            if (isDebug)
                console.log("apply-teacher / checkUserInfoChanged / 휴대전화 세번째 4자리 변경됨");
            hasChanged = true;
        }
        else if (this.genderComponent.isOK(this.gender) &&
            this.gender !== this.newTeacher.gender) {
            // 5. gender
            if (isDebug)
                console.log("apply-teacher / checkUserInfoChanged / 성별 변경됨");
            hasChanged = true;
        }
        else if (this.birthdayComponent.isOKBirthYear(this.birthYear) &&
            birthYear !== this.birthYear) {
            // 6-1. birthYear
            if (isDebug)
                console.log("apply-teacher / checkUserInfoChanged / 생일 - 연도 변경됨");
            hasChanged = true;
        }
        else if (this.birthdayComponent.isOKBirthMonth(this.birthMonth) &&
            birthMonth !== this.birthMonth) {
            // 6-2. birthMonth
            if (isDebug)
                console.log("apply-teacher / checkUserInfoChanged / 생일 - 월 변경됨");
            hasChanged = true;
        }
        else if (this.birthdayComponent.isOKBirthDay(this.birthDay) &&
            birthDay !== this.birthDay) {
            // 6-3. birthDay
            if (isDebug)
                console.log("apply-teacher / checkUserInfoChanged / 생일 - 일 변경됨");
            hasChanged = true;
        } // end if
        return hasChanged;
    };
    __decorate([
        core_1.ViewChildren(default_component_1.DefaultComponent), 
        __metadata('design:type', core_1.QueryList)
    ], ApplyTeacherComponent.prototype, "inputComponentList", void 0);
    __decorate([
        core_1.ViewChild(mobile_component_1.MobileComponent), 
        __metadata('design:type', mobile_component_1.MobileComponent)
    ], ApplyTeacherComponent.prototype, "mobileComponent", void 0);
    __decorate([
        core_1.ViewChild(gender_component_1.GenderComponent), 
        __metadata('design:type', gender_component_1.GenderComponent)
    ], ApplyTeacherComponent.prototype, "genderComponent", void 0);
    __decorate([
        core_1.ViewChild(birthday_component_1.BirthdayComponent), 
        __metadata('design:type', birthday_component_1.BirthdayComponent)
    ], ApplyTeacherComponent.prototype, "birthdayComponent", void 0);
    __decorate([
        core_1.ViewChild(profile_img_upload_component_1.ProfileImgUploadComponent), 
        __metadata('design:type', profile_img_upload_component_1.ProfileImgUploadComponent)
    ], ApplyTeacherComponent.prototype, "profileImgUploadComponent", void 0);
    ApplyTeacherComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'apply-teacher',
            templateUrl: 'apply-teacher.component.html',
            styleUrls: ['apply-teacher.component.css']
        }), 
        __metadata('design:paramtypes', [login_service_1.LoginService, my_event_service_1.MyEventService, my_event_watchtower_service_1.MyEventWatchTowerService, user_service_1.UserService, teacher_service_1.TeacherService, my_logger_service_1.MyLoggerService, my_checker_service_1.MyCheckerService, url_service_1.UrlService, default_service_1.DefaultService, router_1.Router])
    ], ApplyTeacherComponent);
    return ApplyTeacherComponent;
}());
exports.ApplyTeacherComponent = ApplyTeacherComponent; // end class
//# sourceMappingURL=apply-teacher.component.js.map