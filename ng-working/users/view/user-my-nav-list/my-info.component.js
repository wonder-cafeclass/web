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
var passwords_triplet_component_1 = require('../../../widget/input/password/passwords-triplet.component');
var mobile_component_1 = require('../../../widget/input/mobile/mobile.component');
var gender_component_1 = require('../../../widget/input/gender/gender.component');
var birthday_component_1 = require('../../../widget/input/birthday/birthday.component');
var default_component_1 = require('../../../widget/input/default/default.component');
var my_event_watchtower_service_1 = require('../../../util/service/my-event-watchtower.service');
var my_logger_service_1 = require('../../../util/service/my-logger.service');
var my_event_service_1 = require('../../../util/service/my-event.service');
var my_checker_service_1 = require('../../../util/service/my-checker.service');
var user_service_1 = require('../../../users/service/user.service');
var MyInfoComponent = (function () {
    function MyInfoComponent(myEventService, myLoggerService, myCheckerService, userService, watchTower, router) {
        this.myEventService = myEventService;
        this.myLoggerService = myLoggerService;
        this.myCheckerService = myCheckerService;
        this.userService = userService;
        this.watchTower = watchTower;
        this.router = router;
        this.emitter = new core_1.EventEmitter();
        this.isAdmin = false;
        // @ Desc : 사용자가 자신의 유저 정보를 변경했는지 확인하는 플래그
        this.isReadyToSave = false;
        this.eventKeyPWHead = this.myEventService.KEY_USER_CUR_PASSWORD;
        this.eventKeyPWBody = this.myEventService.KEY_USER_NEW_PASSWORD;
        this.eventKeyPWTail = this.myEventService.KEY_USER_RE_PASSWORD;
        this.defaultMetaList = this.myEventService.getDefaultMetaListMyInfo();
    }
    MyInfoComponent.prototype.ngOnInit = function () { };
    MyInfoComponent.prototype.ngAfterViewInit = function () {
        // 자식 뷰가 모두 완료된 이후에 초기화를 진행.
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("my-info / ngAfterViewInit");
        this.setDefaultComponents();
        this.asyncViewPack();
    };
    MyInfoComponent.prototype.setDefaultComponents = function () {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("my-info / setDefaultComponents / 시작");
        // DefaultComponent들을 세팅
        this.emailComponent = this.getInput(this.myEventService.KEY_USER_EMAIL);
        this.nameComponent = this.getInput(this.myEventService.KEY_USER_NAME);
        this.nicknameComponent = this.getInput(this.myEventService.KEY_USER_NICKNAME);
    };
    MyInfoComponent.prototype.asyncViewPack = function () {
        var _this = this;
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("my-info / asyncViewPack / 시작");
        // 이미 View 기본정보가 들어왔다면 바로 가져온다. 
        if (this.watchTower.getIsViewPackReady()) {
            if (isDebug)
                console.log("my-info / asyncViewPack / isViewPackReady : ", true);
            this.init();
        } // end if
        // View에 필요한 기본 정보가 비동기로 들어올 경우, 처리.
        this.watchTower.isViewPackReady$.subscribe(function (isViewPackReady) {
            if (isDebug)
                console.log("my-info / asyncViewPack / subscribe / isViewPackReady : ", isViewPackReady);
            _this.init();
        }); // end subscribe
    };
    MyInfoComponent.prototype.setViewPack = function () {
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
    MyInfoComponent.prototype.setLoginUser = function () {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("my-info / setLoginUser / 시작");
        // 로그인 데이터를 가져옵니다.
        var userJSON = this.watchTower.getLoginUser();
        var loginUser = null;
        if (null != userJSON) {
            loginUser = this.userService.getUserFromJSON(userJSON);
        }
        if (null != loginUser) {
            this.loginUser = loginUser;
            this.loginUserCopy = this.loginUser.copy();
            this.fillViewUserInfo();
        }
        else {
            // 로그인 데이터를 가져오지 못한다면, 로그인 페이지로 이동합니다.
            // TODO - 페이지 리다이렉트 데이터를 전달해야 합니다.
            this.router.navigate(['/login']);
        } // end if
    };
    // @ Desc : DefaultComponent로 부터 원하는 input component를 가져옵니다.
    MyInfoComponent.prototype.getInput = function (eventKey) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("my-info / getInput / init");
        var target = null;
        this.inputComponentList.forEach(function (inputComponent) {
            if (isDebug)
                console.log("my-info / getInput / eventKey : ", eventKey);
            if (isDebug)
                console.log("my-info / getInput / inputComponent.getEventKey() : ", inputComponent.getEventKey());
            if (inputComponent.hasEventKey(eventKey)) {
                if (isDebug)
                    console.log("my-info / getInput / inputComponent : ", inputComponent);
                target = inputComponent;
                return;
            }
        }); // end for-each
        return target;
    };
    MyInfoComponent.prototype.logActionPage = function () {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("my-info / logActionPage / 시작");
        // 페이지 진입을 기록으로 남깁니다.
        this.myLoggerService.logActionPage(
        // apiKey:string
        this.watchTower.getApiKey(), 
        // pageType:string
        this.myLoggerService.pageTypeMyInfo).then(function (myResponse) {
            // 로그 등록 결과를 확인해볼 수 있습니다.
            if (isDebug)
                console.log("my-info / logActionPage / myResponse : ", myResponse);
        }); // end service
    };
    MyInfoComponent.prototype.init = function () {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("my-info / init / 시작");
        // 뷰에 필요한 공통 정보를 설정합니다.
        this.setViewPack();
        // 로그인한 유저 정보를 가져옵니다.
        this.setLoginUser();
        // 페이지 진입을 기록으로 남깁니다.
        this.logActionPage();
    };
    MyInfoComponent.prototype.fillViewUserInfo = function () {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("my-info / fillViewUserInfo");
        if (isDebug)
            console.log("my-info / fillViewUserInfo / this.loginUser : ", this.loginUser);
        if (null == this.loginUser) {
            if (isDebug)
                console.log("my-info / fillViewUserInfo / 중단 / this.loginUser is not valid!");
            return;
        }
        this.emailComponent.setInput(this.loginUserCopy.email);
        this.nameComponent.setInput(this.loginUserCopy.name);
        this.nicknameComponent.setInput(this.loginUserCopy.nickname);
        this.profileImgUploadComponent.setProfileImg(this.loginUserCopy.thumbnail);
        this.mobileComponent.setMobileHead(this.loginUserCopy.getMobileHead());
        this.mobileComponent.setMobileBody(this.loginUserCopy.getMobileBody());
        this.mobileComponent.setMobileTail(this.loginUserCopy.getMobileTail());
        this.genderComponent.setGender(this.loginUserCopy.gender);
        this.birthdayComponent.setBirthYear(this.loginUserCopy.getBirthYear());
        this.birthdayComponent.setBirthMonth(this.loginUserCopy.getBirthMonth());
        this.birthdayComponent.setBirthDay(this.loginUserCopy.getBirthMonth(), this.loginUserCopy.getBirthDay());
    };
    MyInfoComponent.prototype.confirmUserEmailPassword = function (password) {
        var _this = this;
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("my-info / confirmUserEmailPassword / init");
        // 현재 유저의 비밀번호와 동일한지 비교합니다.
        this.userService.confirmUserEmailPassword(
        // apiKey:string
        this.watchTower.getApiKey(), 
        // email:string
        this.loginUserCopy.email, 
        // password:string
        password).then(function (myResponse) {
            if (isDebug)
                console.log("my-info / confirmUserEmailPassword / myResponse : ", myResponse);
            var user = null;
            if (myResponse.isSuccess()) {
                user = myResponse.digDataProp(["user", "mobile"]);
            } // end if
            if (null != user) {
                if (isDebug)
                    console.log("my-info / confirmUserEmailPassword / 패스워드가 확인되었습니다.");
                if (isDebug)
                    console.log("my-info / confirmUserEmailPassword / user : ", user);
                // wonder.jung
                // 사용자가 입력한 패스워드를 변수 - cur_pw에 등록.
                _this.passwordCur = password;
                // 사용자에게 성공 메시지 노출
                _this.passwordsComponent.showTooltipSuccess(
                // eventKey:string
                _this.passwordsComponent.eventKeyHead, 
                // msg:string
                "성공! 현재 비밀번호가 확인되었습니다.");
            }
            else {
                // 사용자가 입력한 암호와 다를 경우는 경고 메시지를 노출
                if (isDebug)
                    console.log("my-info / confirmUserEmailPassword / 사용자가 입력한 암호와 다를 경우는 경고 메시지를 노출.");
                _this.passwordsComponent.showTooltipWarning(
                // eventKey:string
                _this.passwordsComponent.eventKeyHead, 
                // msg:string
                "비밀번호를 다시 확인해주세요.");
            } // end if
        });
    };
    MyInfoComponent.prototype.confirmNewPassword = function (password) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("my-info / confirmNewPassword / init");
        // 1. 새로운 패스워드는 이전의 패스워드와 달라야 합니다.
        if (this.passwordCur === password) {
            if (isDebug)
                console.log("my-info / confirmNewPassword / 중단 / 이전 비밀번화와 새로운 비밀번호가 같음.");
            this.passwordsComponent.showTooltipWarning(
            // eventKey:string
            this.passwordsComponent.eventKeyBody, 
            // msg:string
            "새로운 비밀번호가 이전과 같습니다!");
        }
        else {
            if (isDebug)
                console.log("my-info / confirmNewPassword / 유효한 새로운 패스워드를 받았습니다.");
            // 변수에 저장합니다.
            this.passwordNew = password;
            // 사용자에게 성공 메시지 노출
            this.passwordsComponent.showTooltipSuccess(
            // eventKey:string
            this.passwordsComponent.eventKeyBody, 
            // msg:string
            "성공! 새로운 비밀번호가 완벽합니다.");
        } // end if
    };
    MyInfoComponent.prototype.confirmRepassword = function (password) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("my-info / confirmRepassword / init");
        if (this.passwordNew !== password) {
            // 새로운 비밀번호 재확인이 새로운 비밀번호와 다릅니다. 
            // 경고 메시지 노출 
            this.passwordsComponent.showTooltipWarning(
            // eventKey:string
            this.passwordsComponent.eventKeyTail, 
            // msg:string
            "새로운 비밀번호와 다릅니다!");
        }
        else {
            // 변수에 저장합니다.
            this.passwordRe = password;
            // 사용자에게 성공 메시지 노출
            this.passwordsComponent.showTooltipSuccess(
            // eventKey:string
            this.passwordsComponent.eventKeyTail, 
            // msg:string
            "성공! 새로운 비밀번호가 완벽합니다.");
            // 저장 버튼 활성화.
            this.isReadyToSave = true;
        } // end if    
    };
    MyInfoComponent.prototype.onChangedFromChild = function (myEvent, myinfo, myhistory, mypayment, myfavorite) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("my-info / onChangedFromChild / init");
        if (isDebug)
            console.log("my-info / onChangedFromChild / myEvent : ", myEvent);
        if (isDebug)
            console.log("my-info / onChangedFromChild / myEvent.key : ", myEvent.key);
        if (isDebug)
            console.log("my-info / onChangedFromChild / myEvent.value : ", myEvent.value);
        if (myEvent.isNotValid()) {
            if (isDebug)
                console.log("my-info / onChangedFromChild / ON_CHANGE_NOT_VALID / 중단 / myEvent.isNotValid()");
            // TODO - Error Logger
            return;
        }
        var isOK = this.myCheckerService.isOK(myEvent.myChecker, myEvent.value);
        if (!isOK) {
            if (isDebug)
                console.log("my-info / onChangedFromChild / 중단 / 값이 유효하지 않습니다.");
            return;
        }
        if (myEvent.hasEventName(this.myEventService.ON_CHANGE)) {
            if (myEvent.hasKey(this.myEventService.KEY_USER_CUR_PASSWORD)) {
                if (isDebug)
                    console.log("my-info / onChangedFromChild / KEY_USER_CUR_PASSWORD");
                this.confirmUserEmailPassword(myEvent.value);
            }
            else if (myEvent.hasKey(this.myEventService.KEY_USER_NEW_PASSWORD)) {
                if (isDebug)
                    console.log("my-info / onChangedFromChild / KEY_USER_NEW_PASSWORD");
                this.confirmNewPassword(myEvent.value);
            }
            else if (myEvent.hasKey(this.myEventService.KEY_USER_RE_PASSWORD)) {
                if (isDebug)
                    console.log("my-info / onChangedFromChild / KEY_USER_RE_PASSWORD");
                this.confirmRepassword(myEvent.value);
            }
            else if (myEvent.hasKey(this.myEventService.KEY_USER_NAME)) {
                if (isDebug)
                    console.log("my-info / onChangedFromChild / KEY_USER_NAME");
                this.updateNewProp("name", myEvent.value);
            }
            else if (myEvent.hasKey(this.myEventService.KEY_USER_NICKNAME)) {
                if (isDebug)
                    console.log("my-info / onChangedFromChild / KEY_USER_NICKNAME");
                this.updateNewProp("nickname", myEvent.value);
            }
            else if (myEvent.hasKey(this.myEventService.KEY_USER_THUMBNAIL)) {
                if (isDebug)
                    console.log("my-info / onChangedFromChild / KEY_USER_THUMBNAIL");
                this.updateNewProp("thumbnail", myEvent.value);
            }
            else if (myEvent.hasKey(this.myEventService.KEY_USER_MOBILE_NUM_HEAD)) {
                if (isDebug)
                    console.log("my-info / onChangedFromChild / KEY_USER_MOBILE_NUM_HEAD");
                this.updateNewMobileHead(myEvent.value);
            }
            else if (myEvent.hasKey(this.myEventService.KEY_USER_MOBILE_NUM_BODY)) {
                if (isDebug)
                    console.log("my-info / onChangedFromChild / KEY_USER_MOBILE_NUM_BODY");
                this.updateNewMobileBody(myEvent.value);
            }
            else if (myEvent.hasKey(this.myEventService.KEY_USER_MOBILE_NUM_TAIL)) {
                if (isDebug)
                    console.log("my-info / onChangedFromChild / KEY_USER_MOBILE_NUM_TAIL");
                this.updateNewMobileTail(myEvent.value);
            }
            else if (myEvent.hasKey(this.myEventService.KEY_USER_BIRTH_YEAR)) {
                if (isDebug)
                    console.log("my-info / onChangedFromChild / KEY_USER_BIRTH_YEAR");
                this.updateNewBirthYear(myEvent.value);
            }
            else if (myEvent.hasKey(this.myEventService.KEY_USER_BIRTH_MONTH)) {
                if (isDebug)
                    console.log("my-info / onChangedFromChild / KEY_USER_BIRTH_MONTH");
                this.updateNewBirthMonth(myEvent.value);
            }
            else if (myEvent.hasKey(this.myEventService.KEY_USER_BIRTH_DAY)) {
                if (isDebug)
                    console.log("my-info / onChangedFromChild / KEY_USER_BIRTH_DAY");
                this.updateNewBirthDay(myEvent.value);
            }
            else if (myEvent.hasKey(this.myEventService.KEY_USER_GENDER)) {
                if (isDebug)
                    console.log("my-info / onChangedFromChild / KEY_USER_BIRTH_DAY");
                this.updateNewProp("gender", myEvent.value);
            } // end if - ON CHANGE
        }
        else if (myEvent.hasEventName(this.myEventService.ON_CHANGE_NOT_VALID)) {
            this.myEventService.onChangeNotValid(myEvent);
        } // end if
    }; // end method
    MyInfoComponent.prototype.updateNewMobileHead = function (newMobileHead) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("my-info / updateNewMobileHead / init");
        if (!this.mobileComponent.isOKHead(newMobileHead)) {
            if (isDebug)
                console.log("my-info / updateNewMobileHead / 중단 / newMobileHead is not valid!");
            return;
        }
        if (this.loginUserCopy.isSameMobileHead(newMobileHead)) {
            if (isDebug)
                console.log("my-info / updateNewMobileHead / 중단 / newMobileHead is not changed!");
            return;
        }
        this.loginUserCopy.setMobileHead(newMobileHead);
        // 저장 버튼 노출
        this.isReadyToSave = true;
    };
    MyInfoComponent.prototype.updateNewMobileBody = function (newMobileBody) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("my-info / updateNewMobileBody / init");
        if (!this.mobileComponent.isOKBody(newMobileBody)) {
            if (isDebug)
                console.log("my-info / updateNewMobileBody / 중단 / newMobileBody is not valid!");
            return;
        }
        if (this.loginUserCopy.isSameMobileBody(newMobileBody)) {
            if (isDebug)
                console.log("my-info / updateNewMobileBody / 중단 / newMobileBody is not changed!");
            return;
        }
        this.loginUserCopy.setMobileBody(newMobileBody);
        // 저장 버튼 노출
        this.isReadyToSave = true;
    };
    MyInfoComponent.prototype.updateNewMobileTail = function (newMobileTail) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("my-info / updateNewMobileTail / init");
        if (!this.mobileComponent.isOKTail(newMobileTail)) {
            if (isDebug)
                console.log("my-info / updateNewMobileTail / 중단 / newMobileTail is not valid!");
            return;
        }
        if (this.loginUserCopy.isSameMobileTail(newMobileTail)) {
            if (isDebug)
                console.log("my-info / updateNewMobileTail / 중단 / newMobileTail is not changed!");
            return;
        }
        this.loginUserCopy.setMobileTail(newMobileTail);
        // 저장 버튼 노출
        this.isReadyToSave = true;
    };
    MyInfoComponent.prototype.updateNewBirthYear = function (newBirthYear) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("my-info / updateNewBirthYear / init");
        if (!this.birthdayComponent.isOKBirthYear(newBirthYear)) {
            if (isDebug)
                console.log("my-info / updateNewBirthYear / 중단 / newBirthYear is not valid!");
            return;
        }
        if (this.loginUserCopy.isSameBirthYear(newBirthYear)) {
            if (isDebug)
                console.log("my-info / updateNewBirthYear / 중단 / newBirthYear is not changed!");
            return;
        }
        this.loginUserCopy.setBirthYear(newBirthYear);
        // 저장 버튼 노출
        this.isReadyToSave = true;
    };
    MyInfoComponent.prototype.updateNewBirthMonth = function (newBirthMonth) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("my-info / updateNewBirthMonth / init");
        if (!this.birthdayComponent.isOKBirthMonth(newBirthMonth)) {
            if (isDebug)
                console.log("my-info / updateNewBirthMonth / 중단 / newBirthMonth is not valid!");
            return;
        }
        if (this.loginUserCopy.isSameBirthMonth(newBirthMonth)) {
            if (isDebug)
                console.log("my-info / updateNewBirthMonth / 중단 / newBirthMonth is not changed!");
            return;
        }
        this.loginUserCopy.setBirthMonth(newBirthMonth);
        // 저장 버튼 노출
        this.isReadyToSave = true;
    };
    MyInfoComponent.prototype.updateNewBirthDay = function (newBirthDay) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("my-info / updateNewBirthDay / init");
        if (!this.birthdayComponent.isOKBirthDay(newBirthDay)) {
            if (isDebug)
                console.log("my-info / updateNewBirthDay / 중단 / newBirthDay is not valid!");
            return;
        }
        if (this.loginUserCopy.isSameBirthDay(newBirthDay)) {
            if (isDebug)
                console.log("my-info / updateNewBirthDay / 중단 / newBirthDay is not changed!");
            return;
        }
        this.loginUserCopy.setBirthDay(newBirthDay);
        // 저장 버튼 노출
        this.isReadyToSave = true;
    };
    MyInfoComponent.prototype.updateNewProp = function (key, newValue) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("my-info / updateNewProp / init");
        if (null == key || "" == key) {
            if (isDebug)
                console.log("my-info / updateNewProp / 중단 / key is not valid!");
            return;
        }
        if (null == this.loginUserCopy) {
            if (isDebug)
                console.log("my-info / updateNewProp / 중단 / this.loginUserCopy is not valid!");
            return;
        }
        var valueFromDB = this.loginUser[key];
        if (valueFromDB !== newValue) {
            // 1-1. 변경된 값이라면 업데이트.
            if (null != this[key]) {
                this[key] = newValue;
            }
            // 변경된 이름을 복사해둔 loginUserCopy에 저장합니다.
            if (null != this.loginUserCopy && null != this.loginUserCopy[key]) {
                this.loginUserCopy[key] = newValue;
                if (isDebug)
                    console.log("my-info / updateNewProp / 변경된 이름을 복사해둔 loginUserCopy에 저장합니다.");
                if (isDebug)
                    console.log("my-info / updateNewProp / this.loginUserCopy : ", this.loginUserCopy);
            }
            // 저장 버튼을 노출합니다.
            this.isReadyToSave = true;
        }
        else {
            // 변경되지 않았습니다.
            if (this.checkUserInfoChanged()) {
                // 모든 다른 항목중에 변경된 것이 없다면, 
                // 저장 버튼을 비활성화 합니다.
                this.isReadyToSave = false;
            } // end if
        } // end if
    }; // end method
    MyInfoComponent.prototype.onClickSave = function (event) {
        var _this = this;
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("my-info / onClickSave / init");
        var isReadyToSave = this.checkUserInfoChanged();
        if (isDebug)
            console.log("my-info / onClickSave / isReadyToSave : ", isReadyToSave);
        if (isDebug)
            console.log("my-info / onClickSave / this.loginUserCopy : ", this.loginUserCopy);
        if (isReadyToSave) {
            // 변경되었다면 저장합니다.
            this.userService.updateUserByUser(this.watchTower.getApiKey(), this.loginUserCopy).then(function (myResponse) {
                if (isDebug)
                    console.log("my-info / onClickSave / 유저정보 업데이트 / myResponse : ", myResponse);
                var userUpdated = myResponse.digDataProp(["user"]);
                if (myResponse.isSuccess && null != userUpdated) {
                    // 저장된 유저 정보를 다시 받아옵니다.
                    // 받아온 유저 정보로 업데이트 합니다.
                    _this.loginUser.updateWithJSON(userUpdated);
                    _this.loginUserCopy = _this.loginUser.copy();
                    if (isDebug)
                        console.log("my-info / onClickSave / 받아온 유저 정보로 업데이트 합니다.");
                    if (isDebug)
                        console.log("my-info / onClickSave / this.loginUser : ", _this.loginUser);
                    if (isDebug)
                        console.log("my-info / onClickSave / this.loginUserCopy : ", _this.loginUserCopy);
                }
                else {
                } // end if
            }); // end service
        }
        // 비밀번호 변경 여부 확인
        var isReadyToSavePassword = this.checkUserPasswordChanged();
        if (isDebug)
            console.log("my-info / onClickSave / isReadyToSavePassword : ", isReadyToSavePassword);
        if (isReadyToSavePassword) {
            // 변경되었다면 업데이트!
            // 3. DB Update!
            this.userService.updatePassword(
            // apiKey:string
            this.watchTower.getApiKey(), 
            // email:string 
            this.loginUserCopy.email, 
            // password:string
            this.passwordNew).then(function (myResponse) {
                if (isDebug)
                    console.log("my-info / onClickSave / 비밀번호 업데이트 / myResponse : ", myResponse);
                var is_valid_password = myResponse.getDataProp("is_valid_password");
                if (myResponse.isSuccess && is_valid_password) {
                    // 비밀번호 업데이트 성공!
                    if (isDebug)
                        console.log("my-info / onClickSave / 비밀번호 업데이트 성공!");
                }
                // 입력한 모든 비밀번호를 초기화합니다.
                _this.passwordsComponent.cleanPasswords();
            });
        }
        // 저장 버튼 비활성화.
        this.isReadyToSave = false;
    };
    // @ Desc : 필수 입력 항목이 문제 없는지 검사
    MyInfoComponent.prototype.isNotOKEssential = function () {
        return !this.isOKEssential();
    };
    MyInfoComponent.prototype.isOKEssential = function () {
        if (this.nameComponent.isNotOK(this.loginUserCopy.name)) {
            return false;
        }
        if (this.nicknameComponent.isNotOK(this.loginUserCopy.nickname)) {
            return false;
        }
        if (this.mobileComponent.isNotOKHead(this.loginUserCopy.getMobileHead())) {
            return false;
        }
        if (this.mobileComponent.isNotOKBody(this.loginUserCopy.getMobileBody())) {
            return false;
        }
        if (this.mobileComponent.isNotOKTail(this.loginUserCopy.getMobileTail())) {
            return false;
        }
        if (this.genderComponent.isNotOK(this.loginUserCopy.gender)) {
            return false;
        }
        return true;
    };
    MyInfoComponent.prototype.checkUserInfoChanged = function () {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("my-info / checkUserInfoChanged / init");
        if (isDebug)
            console.log("my-info / checkUserInfoChanged / this.loginUser : ", this.loginUser);
        // 필수 항목들은 반드시 유효해야합니다.
        if (this.isNotOKEssential()) {
            return false;
        }
        // 검사 시작!
        if (this.loginUser.isNotSame(this.loginUserCopy)) {
            // 2. 유저정보
            if (isDebug)
                console.log("my-info / checkUserInfoChanged / 유저정보 변경됨");
            return true;
        }
        return false;
    };
    MyInfoComponent.prototype.checkUserPasswordChanged = function () {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("my-info / checkUserPasswordChanged / init");
        var isReadyToSave = false;
        if (this.passwordsComponent.isOK(this.passwordNew) &&
            this.passwordCur !== this.passwordNew &&
            this.passwordNew === this.passwordRe) {
            // 7. password
            if (isDebug)
                console.log("my-info / checkUserPasswordChanged / 비밀번호 변경됨.");
            isReadyToSave = true;
        } // end if
        return isReadyToSave;
    };
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], MyInfoComponent.prototype, "emitter", void 0);
    __decorate([
        core_1.ViewChildren(default_component_1.DefaultComponent), 
        __metadata('design:type', core_1.QueryList)
    ], MyInfoComponent.prototype, "inputComponentList", void 0);
    __decorate([
        core_1.ViewChild(passwords_triplet_component_1.PasswordsTripletComponent), 
        __metadata('design:type', passwords_triplet_component_1.PasswordsTripletComponent)
    ], MyInfoComponent.prototype, "passwordsComponent", void 0);
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
        __metadata('design:paramtypes', [my_event_service_1.MyEventService, my_logger_service_1.MyLoggerService, my_checker_service_1.MyCheckerService, user_service_1.UserService, my_event_watchtower_service_1.MyEventWatchTowerService, router_1.Router])
    ], MyInfoComponent);
    return MyInfoComponent;
}());
exports.MyInfoComponent = MyInfoComponent;
//# sourceMappingURL=my-info.component.js.map