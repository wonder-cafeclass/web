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
var teacher_service_1 = require('../../service/teacher.service');
var teacher_1 = require('../../model/teacher');
var url_service_1 = require("../../../util/url.service");
var my_logger_service_1 = require('../../../util/service/my-logger.service');
var my_event_watchtower_service_1 = require('../../../util/service/my-event-watchtower.service');
var my_event_service_1 = require('../../../util/service/my-event.service');
var my_event_1 = require('../../../util/model/my-event');
var my_checker_service_1 = require('../../../util/service/my-checker.service');
var my_array_1 = require('../../../util/helper/my-array');
var profile_img_upload_component_1 = require('../../../widget/input/profile-img-upload/profile-img-upload.component');
var mobile_component_1 = require('../../../widget/input/mobile/mobile.component');
var gender_component_1 = require('../../../widget/input/gender/gender.component');
var birthday_component_1 = require('../../../widget/input/birthday/birthday.component');
var TeacherInfoV2Component = (function () {
    function TeacherInfoV2Component(myEventService, watchTower, teacherService, myLoggerService, myCheckerService, urlService, router) {
        this.myEventService = myEventService;
        this.watchTower = watchTower;
        this.teacherService = teacherService;
        this.myLoggerService = myLoggerService;
        this.myCheckerService = myCheckerService;
        this.urlService = urlService;
        this.router = router;
        this.eventKey = "";
        this.emitter = new core_1.EventEmitter();
        this.redirectUrl = "/class-center";
        this.isAdmin = false;
        // @ Desc : 사용자가 자신의 선생님 정보를 변경했는지 확인하는 플래그
        this.isReadyToSave = false;
        this.myArray = new my_array_1.HelperMyArray();
        // Default Input 셋을 가져옵니다. 이름/닉네임/이메일에 사용됩니다.
        this.defaultMetaList = this.myEventService.getDefaultMetaListTeacherInfo();
    } // end function
    TeacherInfoV2Component.prototype.isDebug = function () {
        return this.watchTower.isDebug();
    };
    TeacherInfoV2Component.prototype.ngOnInit = function () {
        if (this.isDebug())
            console.log("teacher-info-v2 / ngOnInit / 시작");
    }; // end function
    TeacherInfoV2Component.prototype.ngAfterViewInit = function () {
        if (this.isDebug())
            console.log("teacher-info-v2 / ngAfterViewInit");
        this.asyncViewPack();
    };
    TeacherInfoV2Component.prototype.asyncViewPack = function () {
        var _this = this;
        if (this.isDebug())
            console.log("teacher-info-v2 / asyncViewPack / 시작");
        // 이미 View 기본정보가 들어왔다면 바로 가져온다.
        if (this.watchTower.getIsViewPackReady()) {
            if (this.isDebug())
                console.log("teacher-info-v2 / asyncViewPack / isViewPackReady : ", true);
            this.init();
        } // end if
        // View에 필요한 기본 정보가 비동기로 들어올 경우, 처리.
        this.watchTower.isViewPackReady$.subscribe(function (isViewPackReady) {
            if (_this.isDebug())
                console.log("teacher-info-v2 / asyncViewPack / subscribe / isViewPackReady : ", isViewPackReady);
            _this.init();
        }); // end subscribe    
    };
    TeacherInfoV2Component.prototype.setViewPack = function () {
        this.isAdmin = this.watchTower.getIsAdminServer();
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
    TeacherInfoV2Component.prototype.copyTeacher = function () {
        if (this.isDebug())
            console.log("teacher-info-v2 / copyTeacher / 시작");
        if (null == this.loginUser) {
            // 유저가 없는 경우는 복사를 중단합니다.
            if (this.isDebug())
                console.log("teacher-info-v2 / copyTeacher / 중단 / 유저가 없는 경우는 복사를 중단합니다.");
            return;
        }
        if (this.loginUser.isTeacher()) {
            this.teacher = this.loginUser.getTeacher();
        }
        else {
            // 새로 선생님이 되려는 경우, 유저 정보에서 데이터를 복사해줍니다.
            this.teacher = this.loginUser.getNewTeacherFromUser();
        }
        this.teacherBackup = this.teacher.copy();
        if (this.isDebug())
            console.log("teacher-info-v2 / copyTeacher / this.teacher : ", this.teacher);
    };
    TeacherInfoV2Component.prototype.init = function () {
        if (this.isDebug())
            console.log("teacher-info-v2 / init / 시작");
        // 뷰에 필요한 공통 정보를 설정합니다.
        this.setViewPack();
        // 로그인한 유저 정보를 가져옵니다.
        this.setLoginUser();
        // 페이지 진입을 기록으로 남깁니다.
        this.logActionPage();
        // 컴포넌트가 준비된 것을 부모 객체에게 전달합니다.
        this.emitEventOnReady();
    }; // end init
    TeacherInfoV2Component.prototype.fillViewTeacherInfo = function () {
        if (this.isDebug())
            console.log("teacher-info-v2 / fillViewTeacherInfo");
        if (this.isDebug())
            console.log("teacher-info-v2 / fillViewTeacherInfo / this.teacher : ", this.teacher);
        if (null == this.teacher) {
            if (this.isDebug())
                console.log("teacher-info-v2 / fillViewTeacherInfo / 중단 / this.teacher is not valid!");
            return;
        }
        this.setEmail();
        this.setName();
        this.setNickname();
        this.setTeacherResume();
        this.setTeacherGreeting();
        this.profileImgUploadComponent.setProfileImg(this.teacher.thumbnail);
        this.genderComponent.setGender(this.teacher.gender);
        this.mobileComponent.setMobileHead(this.teacher.getMobileHead());
        this.mobileComponent.setMobileBody(this.teacher.getMobileBody());
        this.mobileComponent.setMobileTail(this.teacher.getMobileTail());
        this.birthdayComponent.setBirthYear(this.teacher.getBirthYear());
        this.birthdayComponent.setBirthMonth(this.teacher.getBirthMonth());
        this.birthdayComponent.setBirthDay(this.teacher.getBirthMonth(), this.teacher.getBirthDay());
    }; // end method
    TeacherInfoV2Component.prototype.logActionPage = function () {
        var _this = this;
        if (this.isDebug())
            console.log("teacher-info-v2 / logActionPage / 시작");
        // 페이지 진입을 기록으로 남깁니다.
        this.myLoggerService.logActionPage(
        // apiKey:string
        this.watchTower.getApiKey(), 
        // pageType:string
        this.myLoggerService.pageTypeTeacherInfo).then(function (myResponse) {
            // 로그 등록 결과를 확인해볼 수 있습니다.
            if (_this.isDebug())
                console.log("teacher-info-v2 / logActionPage / myResponse : ", myResponse);
        });
    }; // end method
    TeacherInfoV2Component.prototype.emitEventOnReady = function () {
        if (this.isDebug())
            console.log("teacher-info-v2 / emitEventOnReady / 시작");
        var myEvent = this.watchTower.getEventOnReady(
        // eventKey:string, 
        this.eventKey, 
        // component
        this);
        this.emitter.emit(myEvent);
    }; // end method
    TeacherInfoV2Component.prototype.logError = function (errorType, errMsg) {
        var _this = this;
        if (this.isDebug())
            console.log("teacher-info-v2 / logError / 시작");
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
            if (_this.isDebug())
                console.log("teacher-info-v2 / logError / myResponse : ", myResponse);
        }); // end logError
    };
    TeacherInfoV2Component.prototype.setLoginUser = function () {
        if (this.isDebug())
            console.log("teacher-info-v2 / setLoginUser / 시작");
        // 로그인 데이터를 가져옵니다.
        var loginUser = this.watchTower.getLoginUser();
        if (null != loginUser) {
            this.loginUser = loginUser;
            if (this.isDebug())
                console.log("teacher-info-v2 / setLoginUser / this.loginUser : ", this.loginUser);
            // 가져온 유저 정보로 선생님 객체를 만듭니다.
            this.copyTeacher();
            // 가져온 유저 정보로 선생님 입력란을 채웁니다.
            this.fillViewTeacherInfo();
        }
        else {
            // 로그인 데이터를 가져오지 못한다면, 로그인 페이지로 이동합니다.
            // 로그인 이후, 선생님 등록 페이지로 리다이렉트 데이터를 전달해야 합니다.
            if (this.isDebug())
                console.log("teacher-info-v2 / setLoginUser / 로그인 데이터를 가져오지 못한다면, 로그인 페이지로 이동합니다.");
            var req_url = this.urlService.get('#/login?redirect=/TeacherInfoV2');
            if (this.isDebug())
                console.log("teacher-info-v2 / setLoginUser / req_url : ", req_url);
            window.location.href = req_url;
        } // end if
    };
    TeacherInfoV2Component.prototype.setEmail = function () {
        if (this.isDebug())
            console.log("teacher-info-v2 / setEmail / 시작");
        if (null == this.teacher) {
            if (this.isDebug())
                console.log("teacher-info-v2 / setEmail / 중단 / null == this.teacher");
            return;
        }
        if (null == this.emailComponent) {
            if (this.isDebug())
                console.log("teacher-info-v2 / setEmail / 중단 / null == this.emailComponent");
            return;
        }
        this.emailComponent.setInput(this.teacher.email);
    }; // end method
    TeacherInfoV2Component.prototype.setName = function () {
        if (this.isDebug())
            console.log("teacher-info-v2 / setName / 시작");
        if (null == this.teacher) {
            if (this.isDebug())
                console.log("teacher-info-v2 / setName / 중단 / null == this.teacher");
            return;
        }
        if (null == this.nameComponent) {
            if (this.isDebug())
                console.log("teacher-info-v2 / setName / 중단 / null == this.nameComponent");
            return;
        }
        this.nameComponent.setInput(this.teacher.name);
    }; // end method
    TeacherInfoV2Component.prototype.setNickname = function () {
        if (this.isDebug())
            console.log("teacher-info-v2 / setNickname / 시작");
        if (null == this.teacher) {
            if (this.isDebug())
                console.log("teacher-info-v2 / setNickname / 중단 / null == this.teacher");
            return;
        }
        if (null == this.nicknameComponent) {
            if (this.isDebug())
                console.log("teacher-info-v2 / setNickname / 중단 / null == this.nicknameComponent");
            return;
        }
        this.nicknameComponent.setInput(this.teacher.nickname);
    }; // end method
    TeacherInfoV2Component.prototype.setTeacherResume = function () {
        if (this.isDebug())
            console.log("teacher-info-v2 / setTeacherResume / 시작");
        if (null == this.teacher) {
            if (this.isDebug())
                console.log("teacher-info-v2 / setTeacherResume / 중단 / null == this.teacher");
            return;
        }
        if (null == this.resumeComponent) {
            if (this.isDebug())
                console.log("teacher-info-v2 / setTeacherResume / 중단 / null == this.greetingComponent");
            return;
        }
        if (this.isDebug())
            console.log("teacher-info-v2 / setTeacherResume / this.resumeComponent : ", this.resumeComponent);
        var teacherResumeEventList = this.getTeacherResumeEventList();
        if (this.isDebug())
            console.log("teacher-info-v2 / setTeacherResume / teacherResumeEventList : ", teacherResumeEventList);
        this.resumeComponent.setMyEventList(teacherResumeEventList);
    }; // end method
    // @ Desc : inputs-btns-rows 컴포넌트에서 사용할 입력창 별 이벤트 리스트를 만듭니다.
    TeacherInfoV2Component.prototype.getTeacherResumeEventList = function () {
        if (this.isDebug())
            console.log("teacher-info-v2 / getTeacherResume / 시작");
        if (null == this.teacher) {
            if (this.isDebug())
                console.log("teacher-info-v2 / getTeacherResume / 중단 / null == this.teacher");
            return [];
        }
        var resumeList = this.teacher.getResumeArr();
        if (this.isDebug())
            console.log("teacher-info-v2 / getTeacherResume / resumeList : ", resumeList);
        // 3개 열 고정 노출입니다. 모자라다면 채워서 노출합니다.
        if (this.myArray.isNotOK(resumeList)) {
            resumeList = [];
        }
        var lengthFixed = 3;
        var lengthNeeded = lengthFixed - resumeList.length;
        if (this.isDebug())
            console.log("teacher-info-v2 / getTeacherResume / lengthNeeded : ", lengthNeeded);
        if (0 < lengthNeeded) {
            for (var i = (lengthFixed - lengthNeeded); i < lengthFixed; ++i) {
                resumeList.push("선생님의 이력을 입력해주세요");
            } // end for
        } // end if
        // 검사할 checker를 가져옵니다.
        var myChecker = this.myCheckerService.getMyChecker("teacher_resume_row");
        var myEventList = [];
        if (this.myArray.isOK(resumeList)) {
            for (var i = 0; i < resumeList.length; ++i) {
                var klassFeature = resumeList[i];
                var myEventKlassFeature = new my_event_1.MyEvent(
                // public id:string
                this.myEventService.getUniqueIdx(), 
                // public eventName:string
                this.myEventService.ANY, 
                // public key:string
                this.myEventService.KEY_KLASS_TEACHER_RESUME_LIST, 
                // public value:string
                klassFeature, 
                // public metaObj:any
                null, 
                // public myChecker:MyChecker
                myChecker);
                myEventList.push(myEventKlassFeature);
            } // end for      
        } // end if
        return myEventList;
    }; // end method   
    TeacherInfoV2Component.prototype.setTeacherGreeting = function () {
        if (this.isDebug())
            console.log("teacher-info-v2 / setTeacherGreeting / 시작");
        if (null == this.teacher) {
            if (this.isDebug())
                console.log("teacher-info-v2 / setTeacherGreeting / 중단 / null == this.teacher");
            return;
        }
        if (null == this.greetingComponent) {
            if (this.isDebug())
                console.log("teacher-info-v2 / setTeacherGreeting / 중단 / null == this.greetingComponent");
            return;
        }
        if (this.isDebug())
            console.log("teacher-info-v2 / setTeacherGreeting / this.greetingComponent : ", this.greetingComponent);
        this.greetingComponent.setInput(this.teacher.getGreetingOnTextarea());
    }; // end method
    TeacherInfoV2Component.prototype.setBirthday = function () {
        if (this.isDebug())
            console.log("teacher-info-v2 / setBirthday / 시작");
        if (null == this.teacher) {
            if (this.isDebug())
                console.log("teacher-info-v2 / setBirthday / 중단 / null == this.teacher");
            return;
        }
        if (null == this.birthdayComponent) {
            if (this.isDebug())
                console.log("teacher-info-v2 / setBirthday / 중단 / null == this.birthdayComponent");
            return;
        }
        if (this.isDebug())
            console.log("teacher-info-v2 / setBirthday / this.birthdayComponent : ", this.birthdayComponent);
    };
    TeacherInfoV2Component.prototype.onChangedFromChild = function (myEvent, myinfo, myhistory, mypayment, myfavorite) {
        if (this.isDebug())
            console.log("teacher-info-v2 / onChangedFromChild / init");
        if (this.isDebug())
            console.log("teacher-info-v2 / onChangedFromChild / myEvent : ", myEvent);
        if (this.isDebug())
            console.log("teacher-info-v2 / onChangedFromChild / myEvent.key : ", myEvent.key);
        if (myEvent.isNotValid()) {
            if (this.isDebug())
                console.log("teacher-info-v2 / onChangedFromChild / ON_CHANGE_NOT_VALID / 중단 / myEvent.isNotValid()");
            // TODO - Error Logger
            return;
        }
        var isOK = this.myCheckerService.isOK(myEvent.myChecker, myEvent.value);
        if (!isOK) {
            if (this.isDebug())
                console.log("teacher-info-v2 / onChangedFromChild / 중단 / 값이 유효하지 않습니다.");
            return;
        }
        if (myEvent.hasEventName(this.myEventService.ON_READY)) {
            if (myEvent.hasKey(this.myEventService.KEY_USER_EMAIL)) {
                this.emailComponent = myEvent.metaObj;
                this.setEmail();
            }
            else if (myEvent.hasKey(this.myEventService.KEY_USER_NAME)) {
                this.nameComponent = myEvent.metaObj;
                this.setNickname();
            }
            else if (myEvent.hasKey(this.myEventService.KEY_USER_NICKNAME)) {
                this.nicknameComponent = myEvent.metaObj;
                this.setNickname();
            }
            else if (myEvent.hasKey(this.myEventService.KEY_KLASS_TEACHER_RESUME_LIST)) {
                this.resumeComponent = myEvent.metaObj;
                this.setTeacherResume();
            }
            else if (myEvent.hasKey(this.myEventService.KEY_TEACHER_GREETING)) {
                this.greetingComponent = myEvent.metaObj;
                this.setTeacherGreeting();
            }
            else if (myEvent.hasKey(this.myEventService.KEY_USER_BIRTH)) {
                this.setBirthday();
            } // end if  
        }
        else if (myEvent.hasEventName(this.myEventService.ON_CHANGE)) {
            if (myEvent.hasKey(this.myEventService.KEY_USER_EMAIL)) {
                if (this.isDebug())
                    console.log("teacher-info-v2 / onChangedFromChild / KEY_USER_EMAIL");
                // 1. teacher객체와 비교, 변경된 이름인지 확인합니다.
                this.updateNewProp("email", myEvent.value);
                this.checkEmailUnique(myEvent.value);
            }
            else if (myEvent.hasKey(this.myEventService.KEY_USER_NAME)) {
                if (this.isDebug())
                    console.log("teacher-info-v2 / onChangedFromChild / KEY_USER_NAME");
                // 1. teacher객체와 비교, 변경된 이름인지 확인합니다.
                this.updateNewProp("name", myEvent.value);
            }
            else if (myEvent.hasKey(this.myEventService.KEY_USER_NICKNAME)) {
                if (this.isDebug())
                    console.log("teacher-info-v2 / onChangedFromChild / KEY_USER_NICKNAME");
                // 1. teacher객체와 비교, 변경된 이름인지 확인합니다.
                this.updateNewProp("nickname", myEvent.value);
            }
            else if (myEvent.hasKey(this.myEventService.KEY_KLASS_TEACHER_RESUME_LIST)) {
                if (this.isDebug())
                    console.log("teacher-info-v2 / onChangedFromChild / KEY_KLASS_TEACHER_RESUME_LIST");
                // 1. teacher객체와 비교, 변경된 이름인지 확인합니다.
                this.updateResume(myEvent.metaObj);
            }
            else if (myEvent.hasKey(this.myEventService.KEY_TEACHER_GREETING)) {
                if (this.isDebug())
                    console.log("teacher-info-v2 / onChangedFromChild / KEY_TEACHER_GREETING");
                // 1. teacher객체와 비교, 변경된 이름인지 확인합니다.
                this.updateGreeting(myEvent.value);
            }
            else if (myEvent.hasKey(this.myEventService.KEY_USER_THUMBNAIL)) {
                if (this.isDebug())
                    console.log("teacher-info-v2 / onChangedFromChild / KEY_USER_THUMBNAIL");
                // 1. teacher객체와 비교, 변경된 이름인지 확인합니다.
                this.updateNewProp("thumbnail", myEvent.value);
            }
            else if (myEvent.hasKey(this.myEventService.KEY_USER_MOBILE_NUM_HEAD)) {
                if (this.isDebug())
                    console.log("teacher-info-v2 / onChangedFromChild / KEY_USER_MOBILE_NUM_HEAD");
                // 1. teacher객체와 비교, 변경된 전화번호 첫 3자리 인지 확인합니다.
                // 새로운 전화번호라면 변수에 저장합니다.
                this.updateNewMobileHead(myEvent.value);
            }
            else if (myEvent.hasKey(this.myEventService.KEY_USER_MOBILE_NUM_BODY)) {
                if (this.isDebug())
                    console.log("teacher-info-v2 / onChangedFromChild / KEY_USER_MOBILE_NUM_BODY");
                // 1. teacher객체와 비교, 변경된 전화번호 첫 3자리 인지 확인합니다.
                // 새로운 전화번호라면 변수에 저장합니다.
                this.updateNewMobileBody(myEvent.value);
            }
            else if (myEvent.hasKey(this.myEventService.KEY_USER_MOBILE_NUM_TAIL)) {
                if (this.isDebug())
                    console.log("teacher-info-v2 / onChangedFromChild / KEY_USER_MOBILE_NUM_TAIL");
                // 1. teacher객체와 비교, 변경된 전화번호 마지막 4자리 인지 확인합니다.
                // 새로운 전화번호라면 변수에 저장합니다.
                this.updateNewMobileTail(myEvent.value);
                this.checkMobileUnique(this.teacher.mobile);
            }
            else if (myEvent.hasKey(this.myEventService.KEY_USER_BIRTH_YEAR)) {
                if (this.isDebug())
                    console.log("teacher-info-v2 / onChangedFromChild / KEY_USER_BIRTH_YEAR");
                this.updateNewBirthYear(myEvent.value);
            }
            else if (myEvent.hasKey(this.myEventService.KEY_USER_BIRTH_MONTH)) {
                if (this.isDebug())
                    console.log("teacher-info-v2 / onChangedFromChild / KEY_USER_BIRTH_MONTH");
                this.updateNewBirthMonth(myEvent.value);
            }
            else if (myEvent.hasKey(this.myEventService.KEY_USER_BIRTH_DAY)) {
                if (this.isDebug())
                    console.log("teacher-info-v2 / onChangedFromChild / KEY_USER_BIRTH_DAY");
                this.updateNewBirthDay(myEvent.value);
            }
            else if (myEvent.hasKey(this.myEventService.KEY_USER_GENDER)) {
                if (this.isDebug())
                    console.log("teacher-info-v2 / onChangedFromChild / KEY_USER_BIRTH_DAY");
                this.updateNewProp("gender", myEvent.value);
            } // end if - ON CHANGE
            this.checkIsReadyToSave();
        }
        else if (myEvent.hasEventName(this.myEventService.ON_CHANGE_NOT_VALID)) {
            this.myEventService.onChangeNotValid(myEvent);
            // 유효하지 않은 값이 들어왔습니다. 
            // 저장 버튼을 다시 비활성화합니다.
            this.isReadyToSave = false;
        } // end if
    }; // end method
    TeacherInfoV2Component.prototype.isOKBirthday = function (birthYear, birthMonth, birthDay) {
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
    TeacherInfoV2Component.prototype.updateNewMobileHead = function (newMobileHead) {
        if (this.isDebug())
            console.log("teacher-info-v2 / updateNewMobileHead / init");
        if (!this.mobileComponent.isOKHead(newMobileHead)) {
            if (this.isDebug())
                console.log("teacher-info-v2 / updateNewMobileHead / 중단 / newMobileHead is not valid!");
            return;
        }
        if (this.teacher.isSameMobileHead(newMobileHead)) {
            if (this.isDebug())
                console.log("teacher-info-v2 / updateNewMobileHead / 중단 / newMobileHead is not changed!");
            return;
        }
        this.teacher.setMobileHead(newMobileHead);
        // 저장 버튼 노출
        if (this.isOKAll(false)) {
            // 아래 플래그는 저장 버튼을 활성화합니다.
            // 모든 값들이 유효해야 변경된 것으로 처리.
            this.isReadyToSave = true;
        }
    };
    TeacherInfoV2Component.prototype.updateNewMobileBody = function (newMobileBody) {
        if (this.isDebug())
            console.log("teacher-info-v2 / updateNewMobileBody / init");
        if (!this.mobileComponent.isOKBody(newMobileBody)) {
            if (this.isDebug())
                console.log("teacher-info-v2 / updateNewMobileBody / 중단 / newMobileBody is not valid!");
            return;
        }
        if (this.teacher.isSameMobileBody(newMobileBody)) {
            if (this.isDebug())
                console.log("teacher-info-v2 / updateNewMobileBody / 중단 / newMobileBody is not changed!");
            return;
        }
        this.teacher.setMobileBody(newMobileBody);
        // 저장 버튼 노출
        if (this.isOKAll(false)) {
            // 아래 플래그는 저장 버튼을 활성화합니다.
            // 모든 값들이 유효해야 변경된 것으로 처리.
            this.isReadyToSave = true;
        }
    };
    TeacherInfoV2Component.prototype.updateNewMobileTail = function (newMobileTail) {
        if (this.isDebug())
            console.log("teacher-info-v2 / updateNewMobileTail / init");
        if (!this.mobileComponent.isOKTail(newMobileTail)) {
            if (this.isDebug())
                console.log("teacher-info-v2 / updateNewMobileTail / 중단 / newMobileTail is not valid!");
            return;
        }
        if (this.teacher.isSameMobileTail(newMobileTail)) {
            if (this.isDebug())
                console.log("teacher-info-v2 / updateNewMobileTail / 중단 / newMobileTail is not changed!");
            return;
        }
        this.teacher.setMobileTail(newMobileTail);
        // 저장 버튼 노출
        if (this.isOKAll(false)) {
            // 아래 플래그는 저장 버튼을 활성화합니다.
            // 모든 값들이 유효해야 변경된 것으로 처리.
            this.isReadyToSave = true;
        }
    };
    TeacherInfoV2Component.prototype.updateNewBirthYear = function (newBirthYear) {
        if (this.isDebug())
            console.log("teacher-info-v2 / updateNewBirthYear / init");
        if (!this.birthdayComponent.isOKBirthYear(newBirthYear)) {
            if (this.isDebug())
                console.log("teacher-info-v2 / updateNewBirthYear / 중단 / newBirthYear is not valid!");
            return;
        }
        if (this.teacher.isSameBirthYear(newBirthYear)) {
            if (this.isDebug())
                console.log("teacher-info-v2 / updateNewBirthYear / 중단 / newBirthYear is not changed!");
            return;
        }
        this.teacher.setBirthYear(newBirthYear);
        // 저장 버튼 노출
        // if(this.isOKBirthday(birthYear, birthMonth, birthDay) && this.isOKAll()) {
        if (this.isOKAll(false)) {
            // 아래 플래그는 저장 버튼을 활성화합니다.
            // 모든 값들이 유효해야 변경된 것으로 처리.
            this.isReadyToSave = true;
        }
    };
    TeacherInfoV2Component.prototype.updateNewBirthMonth = function (newBirthMonth) {
        if (this.isDebug())
            console.log("teacher-info-v2 / updateNewBirthMonth / init");
        if (!this.birthdayComponent.isOKBirthMonth(newBirthMonth)) {
            if (this.isDebug())
                console.log("teacher-info-v2 / updateNewBirthMonth / 중단 / newBirthMonth is not valid!");
            return;
        }
        if (this.teacher.isSameBirthMonth(newBirthMonth)) {
            if (this.isDebug())
                console.log("teacher-info-v2 / updateNewBirthMonth / 중단 / newBirthMonth is not changed!");
            return;
        }
        this.teacher.setBirthMonth(newBirthMonth);
        // 저장 버튼 노출
        // if(this.isOKBirthday(birthYear, birthMonth, birthDay) && this.isOKAll()) {
        if (this.isOKAll(false)) {
            // 아래 플래그는 저장 버튼을 활성화합니다.
            // 모든 값들이 유효해야 변경된 것으로 처리.
            this.isReadyToSave = true;
        }
    };
    TeacherInfoV2Component.prototype.updateNewBirthDay = function (newBirthDay) {
        if (this.isDebug())
            console.log("teacher-info-v2 / updateNewBirthDay / init");
        if (!this.birthdayComponent.isOKBirthDay(newBirthDay)) {
            if (this.isDebug())
                console.log("teacher-info-v2 / updateNewBirthDay / 중단 / newBirthDay is not valid!");
            return;
        }
        if (this.teacher.isSameBirthDay(newBirthDay)) {
            if (this.isDebug())
                console.log("teacher-info-v2 / updateNewBirthDay / 중단 / newBirthDay is not changed!");
            return;
        }
        this.teacher.setBirthDay(newBirthDay);
        // 저장 버튼 노출
        if (this.isOKAll(false)) {
            // 아래 플래그는 저장 버튼을 활성화합니다.
            // 모든 값들이 유효해야 변경된 것으로 처리.
            this.isReadyToSave = true;
        }
    };
    TeacherInfoV2Component.prototype.updateResume = function (resumeArr) {
        if (this.isDebug())
            console.log("teacher-info-v2 / updateResume / init");
        if (this.isDebug())
            console.log("teacher-info-v2 / updateResume / resumeArr : ", resumeArr);
        this.teacher.setResumeArr(resumeArr);
        if (this.isDebug())
            console.log("teacher-info-v2 / updateResume / this.teacher : ", this.teacher);
        // 저장 버튼 노출
        if (this.isOKAll(false)) {
            // 아래 플래그는 저장 버튼을 활성화합니다.
            // 모든 값들이 유효해야 변경된 것으로 처리.
            this.isReadyToSave = true;
        } // end if    
    }; // end method
    TeacherInfoV2Component.prototype.updateGreeting = function (greeting) {
        if (this.isDebug())
            console.log("teacher-info-v2 / updateGreeting / init");
        if (this.isDebug())
            console.log("teacher-info-v2 / updateGreeting / greeting : ", greeting);
        this.teacher.setGreeting(greeting);
        var isOKAll = this.isOKAll(false);
        if (this.isDebug())
            console.log("teacher-info-v2 / updateGreeting / isOKAll : ", isOKAll);
        // 저장 버튼 노출
        if (isOKAll) {
            // 아래 플래그는 저장 버튼을 활성화합니다.
            // 모든 값들이 유효해야 변경된 것으로 처리.
            this.isReadyToSave = true;
        } // end if
    }; // end method
    TeacherInfoV2Component.prototype.updateNewProp = function (key, newValue) {
        if (this.isDebug())
            console.log("teacher-info-v2 / updateNewProp / init");
        if (null == key || "" == key) {
            if (this.isDebug())
                console.log("teacher-info-v2 / updateNewProp / 중단 / key is not valid!");
            return;
        }
        if (null == this.teacher) {
            if (this.isDebug())
                console.log("teacher-info-v2 / updateNewProp / 중단 / this.teacher is not valid!");
            return;
        }
        var valueFromDB = this.teacher[key];
        if (valueFromDB !== newValue) {
            // 1-1. 변경된 값이라면 업데이트.
            if (null != this[key]) {
                this[key] = newValue;
            }
            // 변경된 이름을 복사해둔 loginUserCopy에 저장합니다.
            if (null != this.teacher && null != this.teacher[key]) {
                this.teacher[key] = newValue;
                if (this.isDebug())
                    console.log("teacher-info-v2 / updateNewProp / 변경된 이름을 복사해둔 loginUserCopy에 저장합니다.");
                if (this.isDebug())
                    console.log("teacher-info-v2 / updateNewProp / this.teacher : ", this.teacher);
            }
            if (this.isDebug())
                console.log("teacher-info-v2 / updateNewProp / this.isReadyToSave : ", this.isReadyToSave);
        } // end if
    }; // end method
    // @ Desc : 저장이 가능한지 확인. 조건은 모든 입력 값이 유효, 최초의 값과 다르게 변한 상태여야 함.
    TeacherInfoV2Component.prototype.checkIsReadyToSave = function () {
        if (this.isDebug())
            console.log("teacher-info-v2 / checkIsReadyToSave / init");
        this.isReadyToSave = (this.isOKAll(true) && this.hasChanged()) ? true : false;
        if (this.isDebug())
            console.log("teacher-info-v2 / checkIsReadyToSave / this.isReadyToSave : ", this.isReadyToSave);
        return this.isReadyToSave;
    }; // end method
    TeacherInfoV2Component.prototype.hasChanged = function () {
        if (this.isDebug())
            console.log("teacher-info-v2 / hasChanged / init");
        if (null == this.teacher) {
            if (this.isDebug())
                console.log("teacher-info-v2 / hasChanged / 중단 / null == this.teacher");
            return false;
        }
        return (!this.teacher.isSame(this.teacherBackup)) ? true : false;
    };
    TeacherInfoV2Component.prototype.isOKAll = function (showTooltip) {
        if (this.isDebug())
            console.log("teacher-info-v2 / isOKAll / init");
        // 모든 값들을 검사. 
        // 문제가 있다면, 사용자에게 알림.
        if (null == this.teacher) {
            return false;
        }
        var isOK = false;
        isOK = this.emailComponent.isOK(this.teacher.email);
        if (!isOK) {
            if (showTooltip) {
                this.emailComponent.showTooltipFailWarning(
                // msg:string, 
                this.emailComponent.getErrorMsg(), 
                // isTimeout:Boolean
                false);
            }
            if (this.isDebug())
                console.log("teacher-info-v2 / isOKAll / 중단 / email is not valid!");
            return false;
        }
        isOK = this.nameComponent.isOK(this.teacher.name);
        if (!isOK) {
            if (showTooltip) {
                this.nameComponent.showTooltipFailWarning(
                // msg:string, 
                this.nameComponent.getErrorMsg(), 
                // isTimeout:Boolean
                false);
            }
            if (this.isDebug())
                console.log("teacher-info-v2 / isOKAll / 중단 / name is not valid!");
            return false;
        }
        isOK = this.nicknameComponent.isOK(this.teacher.nickname);
        if (!isOK) {
            if (showTooltip) {
                this.nicknameComponent.showTooltipFailWarning(
                // msg:string, 
                this.nicknameComponent.getErrorMsg(), 
                // isTimeout:Boolean
                false);
            }
            if (this.isDebug())
                console.log("teacher-info-v2 / isOKAll / 중단 / nickname is not valid!");
            return false;
        }
        // REMOVE ME
        /*
        let hasChanged:boolean = this.resumeComponent.hasChanged();
        if(!hasChanged) {
          return false;
        }
        */
        isOK = this.greetingComponent.isOK(this.teacher.greeting);
        if (!isOK) {
            if (showTooltip) {
                this.greetingComponent.showTooltipFailWarning(
                // msg:string, 
                this.greetingComponent.getErrorMsg(), 
                // isTimeout:Boolean
                false);
            }
            if (this.isDebug())
                console.log("teacher-info-v2 / isOKAll / 중단 / greeting is not valid!");
            return false;
        }
        if (this.mobileComponent.hasNotDoneMobileHead()) {
            if (showTooltip) {
                this.mobileComponent.showWarningMobileHead();
            }
            if (this.isDebug())
                console.log("teacher-info-v2 / isOKAll / 중단 / MobileHead is not valid!");
            return false;
        }
        if (this.mobileComponent.hasNotDoneMobileBody()) {
            if (showTooltip) {
                this.mobileComponent.showWarningMobileBody(null);
            }
            if (this.isDebug())
                console.log("teacher-info-v2 / isOKAll / 중단 / MobileBody is not valid!");
            return false;
        }
        if (this.mobileComponent.hasNotDoneMobileTail()) {
            if (showTooltip) {
                this.mobileComponent.showWarningMobileTail();
            }
            if (this.isDebug())
                console.log("teacher-info-v2 / isOKAll / 중단 / MobileTail is not valid!");
            return false;
        }
        isOK = this.genderComponent.isOK(this.teacher.gender);
        if (!isOK) {
            if (showTooltip) {
                this.genderComponent.showWarning();
            }
            if (this.isDebug())
                console.log("teacher-info-v2 / isOKAll / 중단 / gender is not valid!");
            return false;
        }
        if (this.birthdayComponent.hasNotDoneBirthYear()) {
            if (showTooltip) {
                this.birthdayComponent.showWarningBirthYear();
            }
            if (this.isDebug())
                console.log("teacher-info-v2 / isOKAll / 중단 / birth-year is not valid!");
            return false;
        }
        if (this.birthdayComponent.hasNotDoneBirthMonth()) {
            if (showTooltip) {
                this.birthdayComponent.showWarningBirthMonth();
            }
            if (this.isDebug())
                console.log("teacher-info-v2 / isOKAll / 중단 / birth-month is not valid!");
            return false;
        }
        if (this.birthdayComponent.hasNotDoneBirthDay()) {
            if (showTooltip) {
                this.birthdayComponent.showWarningBirthDay();
            }
            if (this.isDebug())
                console.log("teacher-info-v2 / isOKAll / 중단 / birth-day is not valid!");
            return false;
        }
        // 기본 이미지나 샘플 이미지 주소여서는 안됩니다.
        if (this.teacher.thumbnail === this.profileImgUploadComponent.userProfileDefaultUrl) {
            // 선생님은 기본이미지를 사용할 수 없습니다.
            if (showTooltip) {
                this.profileImgUploadComponent.showWarning("기본이미지를 사용할 수 없습니다");
            }
            if (this.isDebug())
                console.log("teacher-info-v2 / isOKAll / 중단 / thumbnail is sample!");
            return false;
        }
        if (this.profileImgUploadComponent.hasNotDone()) {
            if (showTooltip) {
                this.profileImgUploadComponent.showWarning("이미지를 확인해주세요");
            }
            if (this.isDebug())
                console.log("teacher-info-v2 / isOKAll / 중단 / thumbnail is not valid!");
            return false;
        }
        return true;
    };
    TeacherInfoV2Component.prototype.insertTeacher = function () {
        var _this = this;
        if (this.isDebug())
            console.log("teacher-info-v2 / insertTeacher / init");
        this.teacherService.insertTeacherByTeacher(this.watchTower.getApiKey(), this.teacher).then(function (myResponse) {
            if (_this.isDebug())
                console.log("teacher-info-v2 / insertTeacher / myResponse : ", myResponse);
            var teacherJSON = myResponse.digDataProp(["teacher"]);
            if (myResponse.isSuccess() && null != teacherJSON) {
                // 저장완료!
                // 저장된 선생님 정보를 전파합니다.
                var teacher = new teacher_1.Teacher().setJSON(teacherJSON);
                _this.watchTower.announceLoginTeacher(teacher);
                // 홈으로 리다이렉트 합니다.
                if (_this.isDebug())
                    console.log("teacher-info-v2 / insertTeacher / 저장완료! / 홈으로 리다이렉트 합니다.");
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
                if (_this.isDebug())
                    console.log("teacher-info-v2 / insertTeacher / Error Report");
            } // end if
        }); // end service    
    }; // end method
    TeacherInfoV2Component.prototype.updateTeacher = function () {
        var _this = this;
        if (this.isDebug())
            console.log("teacher-info-v2 / updateTeacher / init");
        this.teacherService.updateTeacherByTeacher(this.watchTower.getApiKey(), this.teacher).then(function (myResponse) {
            if (_this.isDebug())
                console.log("teacher-info-v2 / updateTeacher / myResponse : ", myResponse);
            var teacherJSON = myResponse.digDataProp(["teacher"]);
            if (myResponse.isSuccess() && null != teacherJSON) {
                // 저장완료!
                // 저장된 선생님 정보를 전파합니다.
                var teacher = new teacher_1.Teacher().setJSON(teacherJSON);
                _this.watchTower.announceLoginTeacher(teacher);
                // DB에서 가져온 선생님 정보로 업데이트합니다.
                _this.teacher = teacher;
                _this.teacherBackup = _this.teacher.copy();
            }
            else if (myResponse.isFailed()) {
                if (null != myResponse.error && "" != myResponse.error) {
                    // 에러 내용은 화면에 표시한다.
                    _this.watchTower.announceErrorMsgArr([myResponse.error]);
                }
            }
            else {
                // TODO - Error Report
                if (_this.isDebug())
                    console.log("teacher-info-v2 / updateTeacher / Error Report");
            } // end if
        }); // end service  
    };
    TeacherInfoV2Component.prototype.onClickSave = function (event) {
        if (this.isDebug())
            console.log("teacher-info-v2 / onClickSave / init");
        if (!this.checkIsReadyToSave()) {
            if (this.isDebug())
                console.log("teacher-info-v2 / onClickSave / 중단 / 저장할 수 없습니다.");
            return;
        } // end if
        if (this.isDebug())
            console.log("teacher-info-v2 / onClickSave / \uBCC0\uACBD\uB418\uC5C8\uB2E4\uBA74 \uC800\uC7A5\uD569\uB2C8\uB2E4. / this.teacher.id : " + this.teacher.id);
        if (0 < this.teacher.id) {
            // 1. 이미 저장된 선생님이라면 변경.
            this.updateTeacher();
        }
        else {
            // 2. 없는 선생님이라면 추가.
            this.insertTeacher();
        } // end if
        // 저장 버튼 비활성화.
        this.isReadyToSave = false;
    }; // end method
    TeacherInfoV2Component.prototype.checkUserInfoChanged = function () {
        if (this.isDebug())
            console.log("teacher-info-v2 / checkUserInfoChanged / init");
        if (this.isDebug())
            console.log("teacher-info-v2 / checkUserInfoChanged / this.teacher : ", this.teacher);
        if (this.isDebug())
            console.log("teacher-info-v2 / checkUserInfoChanged / this.teacher : ", this.teacher);
        if (!this.isOKAll(true)) {
            // 유효하지 않은 값이 있으므로 변경되지 않았다고 처리합니다.
            return false;
        }
        return this.teacher.isNotSame(this.teacher);
    };
    TeacherInfoV2Component.prototype.checkEmailUnique = function (email) {
        var _this = this;
        if (this.isDebug())
            console.log("teacher-info-v2 / checkEmailUnique / 시작");
        if (null == email || "" === email) {
            if (this.isDebug())
                console.log("teacher-info-v2 / checkEmailUnique / 중단 / email is not valid!");
            return;
        }
        // DB Unique test
        this.teacherService
            .getTeacherByEmail(this.watchTower.getApiKey(), email)
            .then(function (myResponse) {
            if (myResponse.isSuccess()) {
                var teacherJSON = myResponse.getDataProp("teacher");
                if (null != teacherJSON) {
                    // 등록된 유저가 있습니다. 유저에게 경고 메시지를 보여줍니다.
                    _this.emailComponent.showTooltipFailWarning(
                    // msg:string, 
                    "이미 사용중인 이메일입니다", 
                    // isTimeout:Boolean
                    false);
                }
                else {
                    // 해당 이메일로 등록된 유저는 없습니다. 
                    // email 등록이 가능합니다.
                    _this.teacher.email = email;
                    if (_this.isDebug())
                        console.log("teacher-info-v2 / checkEmailUnique / email 등록이 가능합니다.");
                    if (_this.isDebug())
                        console.log("teacher-info-v2 / checkEmailUnique / this.teacher.email : ", _this.teacher.email);
                } // end if
            }
            else {
                if (_this.isDebug())
                    console.log("teacher-info-v2 / checkMobileUnique / Error Report");
                _this.myLoggerService.logError(
                // apiKey:string
                _this.watchTower.getApiKey(), 
                // errorType:string
                _this.myLoggerService.errorAPIFailed, 
                // errorMsg:string
                "teacher-info-v2 / checkEmailUnique / Failed!");
            } // end if 
        }); // end service
    }; // end method
    TeacherInfoV2Component.prototype.checkMobileUnique = function (mobile) {
        var _this = this;
        if (this.isDebug())
            console.log("teacher-info-v2 / checkMobileUnique / 시작");
        if (null == mobile || "" === mobile) {
            return;
        }
        // 휴대전화 번호가 모두 확인되었습니다. 
        // DB Unique test
        this.teacherService
            .getTeacherByMobile(
        // apiKey:string, 
        this.watchTower.getApiKey(), 
        // mobileHead:string, 
        this.teacher.getMobileHead(), 
        // mobileBody:string, 
        this.teacher.getMobileBody(), 
        // mobileTail:string
        this.teacher.getMobileTail())
            .then(function (myResponse) {
            if (myResponse.isSuccess()) {
                var teacherJSON = myResponse.getDataProp("teacher");
                if (null != teacherJSON) {
                    _this.mobileComponent.showWarningMobileBody("이미 등록된 번호입니다");
                }
                else {
                    // 해당 전화번호로 등록된 유저는 없습니다. 
                    if (_this.isDebug())
                        console.log("teacher-info-v2 / checkMobileUnique / mobile 등록이 가능합니다.");
                    if (_this.isDebug())
                        console.log("teacher-info-v2 / checkMobileUnique / this.teacher.mobile : ", _this.teacher.mobile);
                    _this.teacher.mobile = mobile;
                } // end if
            }
            else {
                // TODO - Error Report
                if (_this.isDebug())
                    console.log("teacher-info-v2 / checkMobileUnique / Error Report");
                _this.myLoggerService.logError(
                // apiKey:string
                _this.watchTower.getApiKey(), 
                // errorType:string
                _this.myLoggerService.errorAPIFailed, 
                // errorMsg:string
                "teacher-info-v2 / checkMobileUnique / Failed!");
            } // end if
        }); // end service    
    }; // end method  
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], TeacherInfoV2Component.prototype, "eventKey", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], TeacherInfoV2Component.prototype, "emitter", void 0);
    __decorate([
        core_1.ViewChild(mobile_component_1.MobileComponent), 
        __metadata('design:type', mobile_component_1.MobileComponent)
    ], TeacherInfoV2Component.prototype, "mobileComponent", void 0);
    __decorate([
        core_1.ViewChild(gender_component_1.GenderComponent), 
        __metadata('design:type', gender_component_1.GenderComponent)
    ], TeacherInfoV2Component.prototype, "genderComponent", void 0);
    __decorate([
        core_1.ViewChild(birthday_component_1.BirthdayComponent), 
        __metadata('design:type', birthday_component_1.BirthdayComponent)
    ], TeacherInfoV2Component.prototype, "birthdayComponent", void 0);
    __decorate([
        core_1.ViewChild(profile_img_upload_component_1.ProfileImgUploadComponent), 
        __metadata('design:type', profile_img_upload_component_1.ProfileImgUploadComponent)
    ], TeacherInfoV2Component.prototype, "profileImgUploadComponent", void 0);
    TeacherInfoV2Component = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'teacher-info-v2',
            templateUrl: 'teacher-info-v2.component.html',
            styleUrls: ['teacher-info-v2.component.css']
        }), 
        __metadata('design:paramtypes', [my_event_service_1.MyEventService, my_event_watchtower_service_1.MyEventWatchTowerService, teacher_service_1.TeacherService, my_logger_service_1.MyLoggerService, my_checker_service_1.MyCheckerService, url_service_1.UrlService, router_1.Router])
    ], TeacherInfoV2Component);
    return TeacherInfoV2Component;
}());
exports.TeacherInfoV2Component = TeacherInfoV2Component; // end class
//# sourceMappingURL=teacher-info-v2.component.js.map