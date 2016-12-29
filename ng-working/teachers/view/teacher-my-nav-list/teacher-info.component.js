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
var profile_img_upload_component_1 = require('../../../widget/input/profile-img-upload/profile-img-upload.component');
var mobile_component_1 = require('../../../widget/input/mobile/mobile.component');
var gender_component_1 = require('../../../widget/input/gender/gender.component');
var birthday_component_1 = require('../../../widget/input/birthday/birthday.component');
var default_component_1 = require('../../../widget/input/default/default.component');
var my_event_watchtower_service_1 = require('../../../util/service/my-event-watchtower.service');
var my_logger_service_1 = require('../../../util/service/my-logger.service');
var my_event_service_1 = require('../../../util/service/my-event.service');
var my_checker_service_1 = require('../../../util/service/my-checker.service');
var teacher_service_1 = require('../../service/teacher.service');
var TeacherInfoComponent = (function () {
    function TeacherInfoComponent(myEventService, myLoggerService, myCheckerService, teacherService, watchTower, router) {
        this.myEventService = myEventService;
        this.myLoggerService = myLoggerService;
        this.myCheckerService = myCheckerService;
        this.teacherService = teacherService;
        this.watchTower = watchTower;
        this.router = router;
        this.emitter = new core_1.EventEmitter();
        this.isAdmin = false;
        // @ Desc : 사용자가 자신의 유저 정보를 변경했는지 확인하는 플래그
        this.isReadyToSave = false;
        this.defaultMetaList = this.myEventService.getDefaultMetaListTeacherInfo();
    }
    TeacherInfoComponent.prototype.isDebug = function () {
        return this.watchTower.isDebug();
    };
    TeacherInfoComponent.prototype.ngAfterViewInit = function () {
        // 자식 뷰가 모두 완료된 이후에 초기화를 진행.
        if (this.isDebug())
            console.log("teacher-info / ngAfterViewInit");
        // REMOVE ME
        // this.setDefaultComponents();
        this.asyncViewPack();
    };
    /*
    private setDefaultComponents() :void {
  
      if(this.isDebug()) console.log("teacher-info / setDefaultComponents / 시작");
  
      // DefaultComponent들을 세팅
      this.emailComponent = this.getInput(this.myEventService.KEY_USER_EMAIL);
      this.nameComponent = this.getInput(this.myEventService.KEY_USER_NAME);
      this.nicknameComponent = this.getInput(this.myEventService.KEY_USER_NICKNAME);
      this.resumeComponent = this.getInput(this.myEventService.KEY_TEACHER_RESUME);
      this.greetingComponent = this.getInput(this.myEventService.KEY_TEACHER_GREETING);
  
    }
    */
    TeacherInfoComponent.prototype.asyncViewPack = function () {
        var _this = this;
        if (this.isDebug())
            console.log("teacher-info / asyncViewPack / 시작");
        // 이미 View 기본정보가 들어왔다면 바로 가져온다. 
        if (this.watchTower.getIsViewPackReady()) {
            if (this.isDebug())
                console.log("teacher-info / asyncViewPack / isViewPackReady : ", true);
            this.init();
        } // end if
        // View에 필요한 기본 정보가 비동기로 들어올 경우, 처리.
        this.watchTower.isViewPackReady$.subscribe(function (isViewPackReady) {
            if (_this.isDebug())
                console.log("teacher-info / asyncViewPack / subscribe / isViewPackReady : ", isViewPackReady);
            _this.init();
        }); // end subscribe
    };
    TeacherInfoComponent.prototype.setViewPack = function () {
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
    TeacherInfoComponent.prototype.setLoginTeacher = function () {
        if (this.isDebug())
            console.log("teacher-info / setLoginTeacher / 시작");
        // 로그인 데이터를 가져옵니다.
        var loginTeacher = this.watchTower.getLoginTeacher();
        if (null != loginTeacher) {
            this.loginTeacher = loginTeacher;
            this.loginTeacherCopy = this.loginTeacher.copy();
            this.fillViewTeacherInfo();
        }
        else {
            // 선생님 로그인 데이터를 가져오지 못한다면, 홈으로 이동합니다.
            this.router.navigate(['/']);
        } // end if
    };
    // @ Desc : DefaultComponent로 부터 원하는 input component를 가져옵니다.
    /*
    private getInput(eventKey:string) :any {
  
      if(this.isDebug()) console.log("teacher-info / getInput / init");
  
      let target:DefaultComponent = null;
  
      this.inputComponentList.forEach(function(inputComponent) {
  
        if(this.isDebug()) console.log("teacher-info / getInput / eventKey : ",eventKey);
        if(this.isDebug()) console.log("teacher-info / getInput / inputComponent.getEventKey() : ",inputComponent.getEventKey());
  
        if(inputComponent.hasEventKey(eventKey)) {
          if(this.isDebug()) console.log("teacher-info / getInput / inputComponent : ",inputComponent);
          target = inputComponent;
          return;
        }
  
      }); // end for-each
  
      return target;
    }
    */
    TeacherInfoComponent.prototype.logActionPage = function () {
        var _this = this;
        if (this.isDebug())
            console.log("teacher-info / logActionPage / 시작");
        // 페이지 진입을 기록으로 남깁니다.
        this.myLoggerService.logActionPage(
        // apiKey:string
        this.watchTower.getApiKey(), 
        // pageType:string
        this.myLoggerService.pageTypeTeacherInfo).then(function (myResponse) {
            // 로그 등록 결과를 확인해볼 수 있습니다.
            if (_this.isDebug())
                console.log("teacher-info / logActionPage / myResponse : ", myResponse);
        }); // end service
    };
    TeacherInfoComponent.prototype.init = function () {
        if (this.isDebug())
            console.log("teacher-info / init / 시작");
        // 뷰에 필요한 공통 정보를 설정합니다.
        this.setViewPack();
        // 로그인한 유저 정보를 가져옵니다.
        this.setLoginTeacher();
        // 페이지 진입을 기록으로 남깁니다.
        this.logActionPage();
    };
    TeacherInfoComponent.prototype.fillViewTeacherInfo = function () {
        if (this.isDebug())
            console.log("teacher-info / fillViewTeacherInfo");
        if (this.isDebug())
            console.log("teacher-info / fillViewTeacherInfo / this.loginTeacher : ", this.loginTeacher);
        if (null == this.loginTeacher) {
            if (this.isDebug())
                console.log("teacher-info / fillViewTeacherInfo / 중단 / this.loginTeacher is not valid!");
            return;
        }
        this.emailComponent.setInput(this.loginTeacherCopy.email);
        this.nameComponent.setInput(this.loginTeacherCopy.name);
        this.nicknameComponent.setInput(this.loginTeacherCopy.nickname);
        this.resumeComponent.setInput(this.loginTeacherCopy.resume);
        this.greetingComponent.setInput(this.loginTeacherCopy.greeting);
        this.profileImgUploadComponent.setProfileImg(this.loginTeacherCopy.thumbnail);
        this.mobileComponent.setMobileHead(this.loginTeacherCopy.getMobileHead());
        this.mobileComponent.setMobileBody(this.loginTeacherCopy.getMobileBody());
        this.mobileComponent.setMobileTail(this.loginTeacherCopy.getMobileTail());
        this.genderComponent.setGender(this.loginTeacherCopy.gender);
        this.birthdayComponent.setBirthYear(this.loginTeacherCopy.getBirthYear());
        this.birthdayComponent.setBirthMonth(this.loginTeacherCopy.getBirthMonth());
        this.birthdayComponent.setBirthDay(this.loginTeacherCopy.getBirthMonth(), this.loginTeacherCopy.getBirthDay());
    };
    TeacherInfoComponent.prototype.onChangedFromChild = function (myEvent, myinfo, myhistory, mypayment, myfavorite) {
        if (this.isDebug())
            console.log("teacher-info / onChangedFromChild / init");
        if (this.isDebug())
            console.log("teacher-info / onChangedFromChild / myEvent : ", myEvent);
        if (this.isDebug())
            console.log("teacher-info / onChangedFromChild / myEvent.key : ", myEvent.key);
        if (myEvent.isNotValid()) {
            if (this.isDebug())
                console.log("teacher-info / onChangedFromChild / ON_CHANGE_NOT_VALID / 중단 / myEvent.isNotValid()");
            // TODO - Error Logger
            return;
        }
        if (this.myCheckerService.isOK(myEvent.myChecker, myEvent.value)) {
            if (this.isDebug())
                console.log("teacher-info / onChangedFromChild / 중단 / 값이 유효하지 않습니다.");
            return;
        }
        if (myEvent.hasEventName(this.myEventService.ON_CHANGE)) {
            if (myEvent.hasKey(this.myEventService.KEY_USER_NAME)) {
                if (this.isDebug())
                    console.log("teacher-info / onChangedFromChild / KEY_USER_NAME");
                // 1. loginTeacher객체와 비교, 변경된 이름인지 확인합니다.
                this.updateNewProp("name", myEvent.value);
            }
            else if (myEvent.hasKey(this.myEventService.KEY_USER_NICKNAME)) {
                if (this.isDebug())
                    console.log("teacher-info / onChangedFromChild / KEY_USER_NICKNAME");
                // 1. loginTeacher객체와 비교, 변경된 이름인지 확인합니다.
                this.updateNewProp("nickname", myEvent.value);
            }
            else if (myEvent.hasKey(this.myEventService.KEY_TEACHER_RESUME)) {
                if (this.isDebug())
                    console.log("teacher-info / onChangedFromChild / KEY_TEACHER_RESUME");
                // 1. loginTeacher객체와 비교, 변경된 이름인지 확인합니다.
                this.updateNewProp("resume", myEvent.value);
            }
            else if (myEvent.hasKey(this.myEventService.KEY_TEACHER_GREETING)) {
                if (this.isDebug())
                    console.log("teacher-info / onChangedFromChild / KEY_TEACHER_GREETING");
                // 1. loginTeacher객체와 비교, 변경된 이름인지 확인합니다.
                this.updateNewProp("greeting", myEvent.value);
            }
            else if (myEvent.hasKey(this.myEventService.KEY_USER_THUMBNAIL)) {
                if (this.isDebug())
                    console.log("teacher-info / onChangedFromChild / KEY_USER_THUMBNAIL");
                // 1. loginTeacher객체와 비교, 변경된 이름인지 확인합니다.
                this.updateNewProp("thumbnail", myEvent.value);
            }
            else if (myEvent.hasKey(this.myEventService.KEY_USER_MOBILE_NUM_HEAD)) {
                if (this.isDebug())
                    console.log("teacher-info / onChangedFromChild / KEY_USER_MOBILE_NUM_HEAD");
                // 1. loginTeacher객체와 비교, 변경된 전화번호 첫 3자리 인지 확인합니다.
                // 새로운 전화번호라면 변수에 저장합니다.
                this.updateNewMobileHead(myEvent.value);
            }
            else if (myEvent.hasKey(this.myEventService.KEY_USER_MOBILE_NUM_BODY)) {
                if (this.isDebug())
                    console.log("teacher-info / onChangedFromChild / KEY_USER_MOBILE_NUM_BODY");
                // 1. loginTeacher객체와 비교, 변경된 전화번호 첫 3자리 인지 확인합니다.
                // 새로운 전화번호라면 변수에 저장합니다.
                this.updateNewMobileBody(myEvent.value);
            }
            else if (myEvent.hasKey(this.myEventService.KEY_USER_MOBILE_NUM_TAIL)) {
                if (this.isDebug())
                    console.log("teacher-info / onChangedFromChild / KEY_USER_MOBILE_NUM_TAIL");
                // 1. loginTeacher객체와 비교, 변경된 전화번호 마지막 4자리 인지 확인합니다.
                // 새로운 전화번호라면 변수에 저장합니다.
                this.updateNewMobileTail(myEvent.value);
            }
            else if (myEvent.hasKey(this.myEventService.KEY_USER_BIRTH_YEAR)) {
                if (this.isDebug())
                    console.log("teacher-info / onChangedFromChild / KEY_USER_BIRTH_YEAR");
                this.updateNewBirthYear(myEvent.value);
            }
            else if (myEvent.hasKey(this.myEventService.KEY_USER_BIRTH_MONTH)) {
                if (this.isDebug())
                    console.log("teacher-info / onChangedFromChild / KEY_USER_BIRTH_MONTH");
                this.updateNewBirthMonth(myEvent.value);
            }
            else if (myEvent.hasKey(this.myEventService.KEY_USER_BIRTH_DAY)) {
                if (this.isDebug())
                    console.log("teacher-info / onChangedFromChild / KEY_USER_BIRTH_DAY");
                this.updateNewBirthDay(myEvent.value);
            }
            else if (myEvent.hasKey(this.myEventService.KEY_USER_GENDER)) {
                if (this.isDebug())
                    console.log("teacher-info / onChangedFromChild / KEY_USER_BIRTH_DAY");
                this.updateNewProp("gender", myEvent.value);
            } // end if - ON CHANGE
        }
        else if (myEvent.hasEventName(this.myEventService.ON_CHANGE_NOT_VALID)) {
            this.myEventService.onChangeNotValid(myEvent);
            // 필드값 중 하나라도 유효하지 않다면, 저장 버튼을 동작하지 않게 합니다.
            this.isReadyToSave = false;
        } // end if
    }; // end method
    TeacherInfoComponent.prototype.isOKBirthday = function (birthYear, birthMonth, birthDay) {
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
    TeacherInfoComponent.prototype.updateNewMobileHead = function (newMobileHead) {
        if (this.isDebug())
            console.log("teacher-info / updateNewMobileHead / init");
        if (!this.mobileComponent.isOKHead(newMobileHead)) {
            if (this.isDebug())
                console.log("teacher-info / updateNewMobileHead / 중단 / newMobileHead is not valid!");
            return;
        }
        if (this.loginTeacherCopy.isSameMobileHead(newMobileHead)) {
            if (this.isDebug())
                console.log("teacher-info / updateNewMobileHead / 중단 / newMobileHead is not changed!");
            return;
        }
        this.loginTeacherCopy.setMobileHead(newMobileHead);
        if (this.isOKAll()) {
            // 저장 버튼 노출
            this.isReadyToSave = true;
        }
    };
    TeacherInfoComponent.prototype.updateNewMobileBody = function (newMobileBody) {
        if (this.isDebug())
            console.log("teacher-info / updateNewMobileBody / init");
        if (!this.mobileComponent.isOKBody(newMobileBody)) {
            if (this.isDebug())
                console.log("teacher-info / updateNewMobileBody / 중단 / newMobileBody is not valid!");
            return;
        }
        if (this.loginTeacherCopy.isSameMobileBody(newMobileBody)) {
            if (this.isDebug())
                console.log("teacher-info / updateNewMobileBody / 중단 / newMobileBody is not changed!");
            return;
        }
        this.loginTeacherCopy.setMobileBody(newMobileBody);
        if (this.isOKAll()) {
            // 저장 버튼 노출
            this.isReadyToSave = true;
        }
    };
    TeacherInfoComponent.prototype.updateNewMobileTail = function (newMobileTail) {
        if (this.isDebug())
            console.log("teacher-info / updateNewMobileTail / init");
        if (!this.mobileComponent.isOKTail(newMobileTail)) {
            if (this.isDebug())
                console.log("teacher-info / updateNewMobileTail / 중단 / newMobileTail is not valid!");
            return;
        }
        if (this.loginTeacherCopy.isSameMobileTail(newMobileTail)) {
            if (this.isDebug())
                console.log("teacher-info / updateNewMobileTail / 중단 / newMobileTail is not changed!");
            return;
        }
        this.loginTeacherCopy.setMobileBody(newMobileTail);
        if (this.isOKAll()) {
            // 저장 버튼 노출
            this.isReadyToSave = true;
        }
    };
    TeacherInfoComponent.prototype.updateNewBirthYear = function (newBirthYear) {
        if (this.isDebug())
            console.log("teacher-info / updateNewBirthYear / init");
        if (!this.birthdayComponent.isOKBirthYear(newBirthYear)) {
            if (this.isDebug())
                console.log("teacher-info / updateNewBirthYear / 중단 / newBirthYear is not valid!");
            return;
        }
        if (this.loginTeacherCopy.isSameBirthYear(newBirthYear)) {
            if (this.isDebug())
                console.log("teacher-info / updateNewBirthYear / 중단 / newBirthYear is not changed!");
            return;
        }
        this.loginTeacherCopy.setBirthYear(newBirthYear);
        if (this.isOKAll()) {
            // 저장 버튼 노출
            this.isReadyToSave = true;
        }
    };
    TeacherInfoComponent.prototype.updateNewBirthMonth = function (newBirthMonth) {
        if (this.isDebug())
            console.log("teacher-info / updateNewBirthMonth / init");
        if (!this.birthdayComponent.isOKBirthMonth(newBirthMonth)) {
            if (this.isDebug())
                console.log("teacher-info / updateNewBirthMonth / 중단 / newBirthMonth is not valid!");
            return;
        }
        if (this.loginTeacherCopy.isSameBirthMonth(newBirthMonth)) {
            if (this.isDebug())
                console.log("teacher-info / updateNewBirthMonth / 중단 / newBirthMonth is not changed!");
            return;
        }
        this.loginTeacherCopy.setBirthMonth(newBirthMonth);
        if (this.isOKAll()) {
            // 저장 버튼 노출
            this.isReadyToSave = true;
        }
    };
    TeacherInfoComponent.prototype.updateNewBirthDay = function (newBirthDay) {
        if (this.isDebug())
            console.log("teacher-info / updateNewBirthDay / init");
        if (!this.birthdayComponent.isOKBirthDay(newBirthDay)) {
            if (this.isDebug())
                console.log("teacher-info / updateNewBirthDay / 중단 / newBirthDay is not valid!");
            return;
        }
        if (this.loginTeacherCopy.isSameBirthDay(newBirthDay)) {
            if (this.isDebug())
                console.log("teacher-info / updateNewBirthDay / 중단 / newBirthDay is not changed!");
            return;
        }
        this.loginTeacherCopy.setBirthDay(newBirthDay);
        if (this.isOKAll()) {
            // 저장 버튼 노출
            this.isReadyToSave = true;
        }
    };
    TeacherInfoComponent.prototype.updateNewProp = function (key, newValue) {
        if (this.isDebug())
            console.log("teacher-info / updateNewProp / init");
        if (null == key || "" == key) {
            if (this.isDebug())
                console.log("teacher-info / updateNewProp / 중단 / key is not valid!");
            return;
        }
        if (null == this.loginTeacherCopy) {
            if (this.isDebug())
                console.log("teacher-info / updateNewProp / 중단 / this.loginTeacherCopy is not valid!");
            return;
        }
        var valueFromDB = this.loginTeacher[key];
        if (valueFromDB !== newValue) {
            // 1-1. 변경된 값이라면 업데이트.
            if (null != this[key]) {
                this[key] = newValue;
            }
            // 변경된 이름을 복사해둔 loginTeacherCopy에 저장합니다.
            if (null != this.loginTeacherCopy && null != this.loginTeacherCopy[key]) {
                this.loginTeacherCopy[key] = newValue;
                if (this.isDebug())
                    console.log("teacher-info / updateNewProp / 변경된 이름을 복사해둔 loginTeacherCopy에 저장합니다.");
                if (this.isDebug())
                    console.log("teacher-info / updateNewProp / this.loginTeacherCopy : ", this.loginTeacherCopy);
            }
            if (this.isDebug())
                console.log("teacher-info / updateNewProp / 저장 버튼을 노출합니다.");
            this.isReadyToSave = true;
        }
        else {
            if (this.checkHasNotChanged()) {
                if (this.isDebug())
                    console.log("teacher-info / updateNewProp / 모든 다른 항목중에 변경된 것이 없다면, 저장 버튼을 비활성화 합니다.");
                this.isReadyToSave = false;
            } // end if
        } // end if
    }; // end method
    TeacherInfoComponent.prototype.onClickSave = function (event) {
        var _this = this;
        if (this.isDebug())
            console.log("teacher-info / onClickSave / init");
        var isReadyToSave = this.checkHasChanged();
        if (this.isDebug())
            console.log("teacher-info / onClickSave / isReadyToSave : ", isReadyToSave);
        if (this.isDebug())
            console.log("teacher-info / onClickSave / this.loginTeacherCopy : ", this.loginTeacherCopy);
        if (this.isReadyToSave) {
            // 변경되었다면 저장합니다.
            this.teacherService.updateTeacherByTeacher(this.watchTower.getApiKey(), this.loginTeacherCopy).then(function (myResponse) {
                if (_this.isDebug())
                    console.log("teacher-info / onClickSave / 유저정보 업데이트 / myResponse : ", myResponse);
                var teacherUpdated = myResponse.digDataProp(["teacher"]);
                if (myResponse.isSuccess && null != teacherUpdated) {
                    // 저장된 유저 정보를 다시 받아옵니다.
                    // 받아온 유저 정보로 업데이트 합니다.
                    _this.loginTeacher.setJSON(teacherUpdated);
                    _this.loginTeacherCopy = _this.loginTeacher.copy();
                    // 업데이트한 선생님 정보를 전파합니다.
                    _this.watchTower.announceLoginTeacher(_this.loginTeacher);
                    if (_this.isDebug())
                        console.log("teacher-info / onClickSave / 받아온 유저 정보로 업데이트 합니다.");
                    if (_this.isDebug())
                        console.log("teacher-info / onClickSave / this.loginTeacher : ", _this.loginTeacher);
                    if (_this.isDebug())
                        console.log("teacher-info / onClickSave / this.loginTeacherCopy : ", _this.loginTeacherCopy);
                }
                else {
                } // end if
            }); // end service
        }
        // 저장 버튼 비활성화.
        this.isReadyToSave = false;
    };
    TeacherInfoComponent.prototype.isNotOKAll = function () {
        return !this.isOKAll();
    };
    TeacherInfoComponent.prototype.isOKAll = function () {
        if (this.isDebug())
            console.log("teacher-info / isOKAll / init");
        if (null == this.loginTeacherCopy) {
            return false;
        }
        if (this.nameComponent.isNotOK(this.loginTeacherCopy.name)) {
            return false;
        }
        if (this.nicknameComponent.isNotOK(this.loginTeacherCopy.nickname)) {
            return false;
        }
        if (this.resumeComponent.isNotOK(this.loginTeacherCopy.resume)) {
            return false;
        }
        if (this.greetingComponent.isNotOK(this.loginTeacherCopy.greeting)) {
            return false;
        }
        if (this.profileImgUploadComponent.isNotOK(this.loginTeacherCopy.nickname)) {
            return false;
        }
        if (this.mobileComponent.isNotOKHead(this.loginTeacherCopy.getMobileHead())) {
            return false;
        }
        if (this.mobileComponent.isNotOKBody(this.loginTeacherCopy.getMobileBody())) {
            return false;
        }
        if (this.mobileComponent.isNotOKTail(this.loginTeacherCopy.getMobileTail())) {
            return false;
        }
        if (this.genderComponent.isNotOK(this.loginTeacherCopy.gender)) {
            return false;
        }
        if (this.birthdayComponent.isNotOKBirthYear(this.loginTeacherCopy.getBirthYear())) {
            return false;
        }
        if (this.birthdayComponent.isNotOKBirthMonth(this.loginTeacherCopy.getBirthMonth())) {
            return false;
        }
        if (this.birthdayComponent.isNotOKBirthDay(this.loginTeacherCopy.getBirthDay())) {
            return false;
        }
        return true;
    };
    TeacherInfoComponent.prototype.checkHasNotChanged = function () {
        return !this.checkHasChanged();
    };
    TeacherInfoComponent.prototype.checkHasChanged = function () {
        if (this.isDebug())
            console.log("teacher-info / checkHasChanged / init");
        if (this.isDebug())
            console.log("teacher-info / checkHasChanged / this.loginTeacher : ", this.loginTeacher);
        // 모든 입력이 정상적이어야 변화가 있었는지 검사할 수 있습니다.
        if (this.isNotOKAll()) {
            if (this.isDebug())
                console.log("teacher-info / checkHasChanged / 중단 / 정상적이지 않은 값이 있습니다.");
            return false;
        } // end method
        if (this.loginTeacher.isNotSame(this.loginTeacherCopy)) {
            if (this.isDebug())
                console.log("teacher-info / checkHasChanged / 변경됨");
            return true;
        } // end method
        return false;
    }; // end method
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], TeacherInfoComponent.prototype, "emitter", void 0);
    __decorate([
        core_1.ViewChildren(default_component_1.DefaultComponent), 
        __metadata('design:type', core_1.QueryList)
    ], TeacherInfoComponent.prototype, "inputComponentList", void 0);
    __decorate([
        core_1.ViewChild(mobile_component_1.MobileComponent), 
        __metadata('design:type', mobile_component_1.MobileComponent)
    ], TeacherInfoComponent.prototype, "mobileComponent", void 0);
    __decorate([
        core_1.ViewChild(gender_component_1.GenderComponent), 
        __metadata('design:type', gender_component_1.GenderComponent)
    ], TeacherInfoComponent.prototype, "genderComponent", void 0);
    __decorate([
        core_1.ViewChild(birthday_component_1.BirthdayComponent), 
        __metadata('design:type', birthday_component_1.BirthdayComponent)
    ], TeacherInfoComponent.prototype, "birthdayComponent", void 0);
    __decorate([
        core_1.ViewChild(profile_img_upload_component_1.ProfileImgUploadComponent), 
        __metadata('design:type', profile_img_upload_component_1.ProfileImgUploadComponent)
    ], TeacherInfoComponent.prototype, "profileImgUploadComponent", void 0);
    TeacherInfoComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'teacher-info',
            templateUrl: 'teacher-info.component.html',
            styleUrls: ['teacher-info.component.css']
        }), 
        __metadata('design:paramtypes', [my_event_service_1.MyEventService, my_logger_service_1.MyLoggerService, my_checker_service_1.MyCheckerService, teacher_service_1.TeacherService, my_event_watchtower_service_1.MyEventWatchTowerService, router_1.Router])
    ], TeacherInfoComponent);
    return TeacherInfoComponent;
}());
exports.TeacherInfoComponent = TeacherInfoComponent;
//# sourceMappingURL=teacher-info.component.js.map