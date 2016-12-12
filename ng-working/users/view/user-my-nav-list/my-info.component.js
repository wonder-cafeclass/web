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
        this.gender = "";
        this.isAdmin = false;
        // @ Desc : 사용자가 자신의 유저 정보를 변경했는지 확인하는 플래그
        this.hasChanged = false;
        this.eventKeyPWHead = this.myEventService.KEY_USER_CUR_PASSWORD;
        this.eventKeyPWBody = this.myEventService.KEY_USER_NEW_PASSWORD;
        this.eventKeyPWTail = this.myEventService.KEY_USER_RE_PASSWORD;
        this.defaultMetaList = this.myEventService.getDefaultMetaListMyInfo();
    }
    MyInfoComponent.prototype.ngOnInit = function () { };
    MyInfoComponent.prototype.ngAfterViewInit = function () {
        // 자식 뷰가 모두 완료된 이후에 초기화를 진행.
        var isDebug = true;
        // let isDebug:boolean = false;
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
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("my-info / setLoginUser / 시작");
        // 로그인 데이터를 가져옵니다.
        var loginUser = this.watchTower.getLoginUser();
        if (null != loginUser) {
            this.loginUser = loginUser;
            this.copyUser();
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
        var isDebug = true;
        // let isDebug:boolean = false;
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
    MyInfoComponent.prototype.copyUser = function () {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("my-info / copyUser / 시작");
        if (null == this.loginUser) {
            // 유저가 없는 경우는 복사를 중단합니다.
            if (isDebug)
                console.log("my-info / copyUser / 중단 / 유저가 없는 경우는 복사를 중단합니다.");
            return;
        }
        // 사용자 정보를 변경할 경우, 변경된 값을 저장할 User 객체의 복사본을 만듭니다.
        this.loginUserCopy = this.userService.copyUser(this.loginUser);
        if (isDebug)
            console.log("my-info / copyUser / this.loginUserCopy : ", this.loginUserCopy);
        // TEST
        var isSame = this.userService.isSameUser(this.loginUser, this.loginUserCopy);
        if (isDebug)
            console.log("my-info / copyUser / isSame : ", isSame);
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
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("my-info / fillViewUserInfo");
        if (isDebug)
            console.log("my-info / fillViewUserInfo / this.loginUser : ", this.loginUser);
        if (null == this.loginUser) {
            if (isDebug)
                console.log("my-info / fillViewUserInfo / 중단 / this.loginUser is not valid!");
            return;
        }
        // email
        if (null != this.emailComponent) {
            if (isDebug)
                console.log("my-info / fillViewUserInfo / this.loginUser.email : ", this.loginUser.email);
            this.emailComponent.setInput(this.loginUser.email);
        }
        this.email = this.loginUser.email;
        // name
        if (null != this.nameComponent) {
            if (isDebug)
                console.log("my-info / fillViewUserInfo / this.loginUser.name : ", this.loginUser.name);
            this.nameComponent.setInput(this.loginUser.name);
        }
        this.name = this.loginUser.name;
        // nickname
        if (null != this.nicknameComponent) {
            if (isDebug)
                console.log("my-info / fillViewUserInfo / this.loginUser.nickname : ", this.loginUser.nickname);
            this.nicknameComponent.setInput(this.loginUser.nickname);
        }
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
            this.birthdayComponent.setBirthDay(birthdayArr[1], birthdayArr[2]);
        }
    };
    MyInfoComponent.prototype.onChangedFromChild = function (myEvent, myinfo, myhistory, mypayment, myfavorite) {
        var _this = this;
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("my-info / onChangedFromChild / init");
        if (isDebug)
            console.log("my-info / onChangedFromChild / myEvent : ", myEvent);
        if (isDebug)
            console.log("my-info / onChangedFromChild / myEvent.key : ", myEvent.key);
        if (myEvent.isNotValid()) {
            if (isDebug)
                console.log("my-info / onChangedFromChild / ON_CHANGE_NOT_VALID / 중단 / myEvent.isNotValid()");
            // TODO - Error Logger
            return;
        }
        if (myEvent.hasEventName(this.myEventService.ON_CHANGE)) {
            if (myEvent.hasKey(this.myEventService.KEY_USER_CUR_PASSWORD)) {
                if (isDebug)
                    console.log("my-info / onChangedFromChild / KEY_USER_CUR_PASSWORD");
                if (isDebug)
                    console.log("my-info / onChangedFromChild / myEvent.value : ", myEvent.value);
                // 현재 유저의 비밀번호와 동일한지 비교합니다.
                this.userService.confirmUserEmailPassword(
                // apiKey:string
                this.watchTower.getApiKey(), 
                // email:string
                this.email, 
                // password:string
                myEvent.value).then(function (myResponse) {
                    if (isDebug)
                        console.log("my-info / onChangedFromChild / myResponse : ", myResponse);
                    var user = null;
                    if (myResponse.isSuccess()) {
                        user = myResponse.digDataProp(["user", "mobile"]);
                    } // end if
                    if (null != user) {
                        if (isDebug)
                            console.log("my-info / onChangedFromChild / 패스워드가 확인되었습니다.");
                        if (isDebug)
                            console.log("my-info / onChangedFromChild / user : ", user);
                        // wonder.jung
                        // 사용자가 입력한 패스워드를 변수 - cur_pw에 등록.
                        _this.passwordCur = myEvent.value;
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
                            console.log("my-info / onChangedFromChild / 사용자가 입력한 암호와 다를 경우는 경고 메시지를 노출.");
                        _this.passwordsComponent.showTooltipWarning(
                        // eventKey:string
                        _this.passwordsComponent.eventKeyHead, 
                        // msg:string
                        "비밀번호를 다시 확인해주세요.");
                    } // end if
                });
            }
            else if (myEvent.hasKey(this.myEventService.KEY_USER_NEW_PASSWORD)) {
                if (isDebug)
                    console.log("my-info / onChangedFromChild / KEY_USER_NEW_PASSWORD");
                // 유효한 새로운 패스워드를 받았습니다.
                // 1. 새로운 패스워드는 이전의 패스워드와 달라야 합니다.
                if (this.passwordCur === myEvent.value) {
                    if (isDebug)
                        console.log("my-info / onChangedFromChild / 중단 / 이전 비밀번화와 새로운 비밀번호가 같음.");
                    this.passwordsComponent.showTooltipWarning(
                    // eventKey:string
                    this.passwordsComponent.eventKeyBody, 
                    // msg:string
                    "새로운 비밀번호가 이전과 같습니다!");
                }
                else {
                    if (isDebug)
                        console.log("my-info / onChangedFromChild / 유효한 새로운 패스워드를 받았습니다.");
                    // 변수에 저장합니다.
                    this.passwordNew = myEvent.value;
                    // 사용자에게 성공 메시지 노출
                    this.passwordsComponent.showTooltipSuccess(
                    // eventKey:string
                    this.passwordsComponent.eventKeyBody, 
                    // msg:string
                    "성공! 새로운 비밀번호가 완벽합니다.");
                } // end if
            }
            else if (myEvent.hasKey(this.myEventService.KEY_USER_RE_PASSWORD)) {
                if (isDebug)
                    console.log("my-info / onChangedFromChild / KEY_USER_RE_PASSWORD");
                if (this.passwordNew !== myEvent.value) {
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
                    this.passwordRe = myEvent.value;
                    // 사용자에게 성공 메시지 노출
                    this.passwordsComponent.showTooltipSuccess(
                    // eventKey:string
                    this.passwordsComponent.eventKeyTail, 
                    // msg:string
                    "성공! 새로운 비밀번호가 완벽합니다.");
                    // 저장 버튼 활성화.
                    this.hasChanged = true;
                } // end if
            }
            else if (myEvent.hasKey(this.myEventService.KEY_USER_NAME)) {
                if (isDebug)
                    console.log("my-info / onChangedFromChild / KEY_USER_NAME");
                var isOK = this.myCheckerService.isOK(myEvent.myChecker, myEvent.value);
                if (!isOK) {
                    if (isDebug)
                        console.log("my-info / onChangedFromChild / 중단 / 이름이 유효하지 않습니다.");
                    return;
                }
                // 1. loginUser객체와 비교, 변경된 이름인지 확인합니다.
                this.updateNewProp("name", myEvent.value);
            }
            else if (myEvent.hasKey(this.myEventService.KEY_USER_NICKNAME)) {
                if (isDebug)
                    console.log("my-info / onChangedFromChild / KEY_USER_NICKNAME");
                var isOK = this.myCheckerService.isOK(myEvent.myChecker, myEvent.value);
                if (!isOK) {
                    if (isDebug)
                        console.log("my-info / onChangedFromChild / 중단 / 이름이 유효하지 않습니다.");
                    return;
                }
                // 1. loginUser객체와 비교, 변경된 이름인지 확인합니다.
                this.updateNewProp("nickname", myEvent.value);
            }
            else if (myEvent.hasKey(this.myEventService.KEY_USER_THUMBNAIL)) {
                if (isDebug)
                    console.log("my-info / onChangedFromChild / KEY_USER_THUMBNAIL");
                var isOK = this.myCheckerService.isOK(myEvent.myChecker, myEvent.value);
                if (!isOK) {
                    if (isDebug)
                        console.log("my-info / onChangedFromChild / 중단 / 이름이 유효하지 않습니다.");
                    return;
                }
                // 1. loginUser객체와 비교, 변경된 이름인지 확인합니다.
                this.updateNewProp("thumbnail", myEvent.value);
            }
            else if (myEvent.hasKey(this.myEventService.KEY_USER_MOBILE_NUM_HEAD)) {
                if (isDebug)
                    console.log("my-info / onChangedFromChild / KEY_USER_MOBILE_NUM_HEAD");
                var isOK = this.myCheckerService.isOK(myEvent.myChecker, myEvent.value);
                if (!isOK) {
                    if (isDebug)
                        console.log("my-info / onChangedFromChild / 중단 / 전화번호 첫번째 3자리가 유효하지 않습니다.");
                    return;
                }
                // 1. loginUser객체와 비교, 변경된 전화번호 첫 3자리 인지 확인합니다.
                // 새로운 전화번호라면 변수에 저장합니다.
                this.updateNewMobileHead(myEvent.value);
            }
            else if (myEvent.hasKey(this.myEventService.KEY_USER_MOBILE_NUM_BODY)) {
                if (isDebug)
                    console.log("my-info / onChangedFromChild / KEY_USER_MOBILE_NUM_BODY");
                var isOK = this.myCheckerService.isOK(myEvent.myChecker, myEvent.value);
                if (!isOK) {
                    if (isDebug)
                        console.log("my-info / onChangedFromChild / 중단 / 전화번호 두번째 4자리가 유효하지 않습니다.");
                    return;
                }
                // 1. loginUser객체와 비교, 변경된 전화번호 첫 3자리 인지 확인합니다.
                // 새로운 전화번호라면 변수에 저장합니다.
                this.updateNewMobileBody(myEvent.value);
            }
            else if (myEvent.hasKey(this.myEventService.KEY_USER_MOBILE_NUM_TAIL)) {
                if (isDebug)
                    console.log("my-info / onChangedFromChild / KEY_USER_MOBILE_NUM_TAIL");
                var isOK = this.myCheckerService.isOK(myEvent.myChecker, myEvent.value);
                if (!isOK) {
                    if (isDebug)
                        console.log("my-info / onChangedFromChild / 중단 / 전화번호 마지막 4자리가 유효하지 않습니다.");
                    return;
                }
                // 1. loginUser객체와 비교, 변경된 전화번호 마지막 4자리 인지 확인합니다.
                // 새로운 전화번호라면 변수에 저장합니다.
                this.updateNewMobileTail(myEvent.value);
            }
            else if (myEvent.hasKey(this.myEventService.KEY_USER_BIRTH_YEAR)) {
                if (isDebug)
                    console.log("my-info / onChangedFromChild / KEY_USER_BIRTH_YEAR");
                var isOK = this.myCheckerService.isOK(myEvent.myChecker, myEvent.value);
                if (!isOK) {
                    if (isDebug)
                        console.log("my-info / onChangedFromChild / 중단 / 생일-연도가 유효하지 않습니다.");
                    return;
                }
                this.updateNewBirthYear(myEvent.value);
            }
            else if (myEvent.hasKey(this.myEventService.KEY_USER_BIRTH_MONTH)) {
                if (isDebug)
                    console.log("my-info / onChangedFromChild / KEY_USER_BIRTH_MONTH");
                var isOK = this.myCheckerService.isOK(myEvent.myChecker, myEvent.value);
                if (!isOK) {
                    if (isDebug)
                        console.log("my-info / onChangedFromChild / 중단 / 생일-월이 유효하지 않습니다.");
                    return;
                }
                this.updateNewBirthMonth(myEvent.value);
            }
            else if (myEvent.hasKey(this.myEventService.KEY_USER_BIRTH_DAY)) {
                if (isDebug)
                    console.log("my-info / onChangedFromChild / KEY_USER_BIRTH_DAY");
                var isOK = this.myCheckerService.isOK(myEvent.myChecker, myEvent.value);
                if (!isOK) {
                    if (isDebug)
                        console.log("my-info / onChangedFromChild / 중단 / 생일-날짜 유효하지 않습니다.");
                    return;
                }
                this.updateNewBirthDay(myEvent.value);
            }
            else if (myEvent.hasKey(this.myEventService.KEY_USER_GENDER)) {
                if (isDebug)
                    console.log("my-info / onChangedFromChild / KEY_USER_BIRTH_DAY");
                var isOK = this.myCheckerService.isOK(myEvent.myChecker, myEvent.value);
                if (!isOK) {
                    if (isDebug)
                        console.log("my-info / onChangedFromChild / 중단 / 생일-날짜 유효하지 않습니다.");
                    return;
                }
                this.updateNewProp("gender", myEvent.value);
            } // end if - ON CHANGE
        }
        else if (myEvent.hasEventName(this.myEventService.ON_CHANGE_NOT_VALID)) {
            this.myEventService.onChangeNotValid(myEvent);
        } // end if
    }; // end method
    MyInfoComponent.prototype.isOKBirthday = function (birthYear, birthMonth, birthDay) {
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
    MyInfoComponent.prototype.updateNewMobileHead = function (newMobileHead) {
        var isDebug = true;
        // let isDebug:boolean = false;
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
        // let mobileHead:string = this.mobileNumHead = this.loginUserCopy.getMobileHead();
        var mobileHead = this.mobileNumHead = newMobileHead;
        var mobileBody = this.mobileNumBody = this.loginUserCopy.getMobileBody();
        var mobileTail = this.mobileNumTail = this.loginUserCopy.getMobileTail();
        var newMobile = mobileHead + "-" + mobileBody + "-" + mobileTail;
        if (isDebug)
            console.log("my-info / updateNewMobileHead / newMobile : ", newMobile);
        this.loginUserCopy.mobile = newMobile;
        // 저장 버튼 노출
        this.hasChanged = true;
    };
    MyInfoComponent.prototype.updateNewMobileBody = function (newMobileBody) {
        var isDebug = true;
        // let isDebug:boolean = false;
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
        var mobileHead = this.mobileNumHead = this.loginUserCopy.getMobileHead();
        // let mobileBody:string = this.mobileNumBody = this.loginUserCopy.getMobileBody();
        var mobileBody = this.mobileNumBody = newMobileBody;
        var mobileTail = this.mobileNumTail = this.loginUserCopy.getMobileTail();
        var newMobile = mobileHead + "-" + mobileBody + "-" + mobileTail;
        if (isDebug)
            console.log("my-info / updateNewMobileBody / newMobile : ", newMobile);
        this.loginUserCopy.mobile = newMobile;
        // 저장 버튼 노출
        this.hasChanged = true;
    };
    MyInfoComponent.prototype.updateNewMobileTail = function (newMobileTail) {
        var isDebug = true;
        // let isDebug:boolean = false;
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
        var mobileHead = this.mobileNumHead = this.loginUserCopy.getMobileHead();
        var mobileBody = this.mobileNumBody = this.loginUserCopy.getMobileBody();
        // let mobileTail:string = this.mobileNumTail = this.loginUserCopy.getMobileTail();
        var mobileTail = this.mobileNumTail = newMobileTail;
        var newMobile = mobileHead + "-" + mobileBody + "-" + mobileTail;
        if (isDebug)
            console.log("my-info / updateNewMobileTail / newMobile : ", newMobile);
        this.loginUserCopy.mobile = newMobile;
        // 저장 버튼 노출
        this.hasChanged = true;
    };
    MyInfoComponent.prototype.updateNewBirthYear = function (newBirthYear) {
        var isDebug = true;
        // let isDebug:boolean = false;
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
        // let birthYear:string = this.mobileNumHead = this.loginUserCopy.getBirthYear();
        var birthYear = this.birthYear = newBirthYear;
        var birthMonth = this.birthMonth = this.loginUserCopy.getBirthMonth();
        var birthDay = this.birthDay = this.loginUserCopy.getBirthDay();
        var newBirthday = birthYear + "-" + birthMonth + "-" + birthDay;
        if (isDebug)
            console.log("my-info / updateNewBirthYear / newBirthday : ", newBirthday);
        this.loginUserCopy.birthday = newBirthday;
        // 저장 버튼 노출
        if (this.isOKBirthday(birthYear, birthMonth, birthDay)) {
            this.hasChanged = true;
        }
    };
    MyInfoComponent.prototype.updateNewBirthMonth = function (newBirthMonth) {
        var isDebug = true;
        // let isDebug:boolean = false;
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
        var birthYear = this.mobileNumHead = this.loginUserCopy.getBirthYear();
        // let birthMonth:string = this.birthMonth = this.loginUserCopy.getBirthMonth();
        var birthMonth = this.birthMonth = newBirthMonth;
        var birthDay = this.birthDay = this.loginUserCopy.getBirthDay();
        var newBirthday = birthYear + "-" + birthMonth + "-" + birthDay;
        if (isDebug)
            console.log("my-info / updateNewBirthMonth / newBirthday : ", newBirthday);
        this.loginUserCopy.birthday = newBirthday;
        // 저장 버튼 노출
        if (this.isOKBirthday(birthYear, birthMonth, birthDay)) {
            this.hasChanged = true;
        }
    };
    MyInfoComponent.prototype.updateNewBirthDay = function (newBirthDay) {
        var isDebug = true;
        // let isDebug:boolean = false;
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
        var birthYear = this.mobileNumHead = this.loginUserCopy.getBirthYear();
        var birthMonth = this.birthMonth = this.loginUserCopy.getBirthMonth();
        // let birthDay:string = this.birthDay = this.loginUserCopy.getBirthDay();
        var birthDay = this.birthDay = newBirthDay;
        var newBirthday = birthYear + "-" + birthMonth + "-" + birthDay;
        if (isDebug)
            console.log("my-info / updateNewBirthDay / newBirthday : ", newBirthday);
        this.loginUserCopy.birthday = newBirthday;
        // 저장 버튼 노출
        if (this.isOKBirthday(birthYear, birthMonth, birthDay)) {
            this.hasChanged = true;
        }
    };
    MyInfoComponent.prototype.updateNewProp = function (key, newValue) {
        var isDebug = true;
        // let isDebug:boolean = false;
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
    MyInfoComponent.prototype.onClickSave = function (event) {
        var _this = this;
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("my-info / onClickSave / init");
        var hasChanged = this.checkUserInfoChanged();
        if (isDebug)
            console.log("my-info / onClickSave / hasChanged : ", hasChanged);
        if (isDebug)
            console.log("my-info / onClickSave / this.loginUserCopy : ", this.loginUserCopy);
        if (hasChanged) {
            // 변경되었다면 저장합니다.
            this.userService.updateUserByUser(this.watchTower.getApiKey(), this.loginUserCopy).then(function (myResponse) {
                if (isDebug)
                    console.log("my-info / onClickSave / 유저정보 업데이트 / myResponse : ", myResponse);
                var userUpdated = myResponse.digDataProp(["user"]);
                if (myResponse.isSuccess && null != userUpdated) {
                    // 저장된 유저 정보를 다시 받아옵니다.
                    // 받아온 유저 정보로 업데이트 합니다.
                    _this.loginUser.updateWithJSON(userUpdated);
                    _this.loginUserCopy.updateWithJSON(userUpdated);
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
        var hasChangedPassword = this.checkUserPasswordChanged();
        if (isDebug)
            console.log("my-info / onClickSave / hasChangedPassword : ", hasChangedPassword);
        if (hasChangedPassword) {
            // 변경되었다면 업데이트!
            // 3. DB Update!
            this.userService.updatePassword(
            // apiKey:string
            this.watchTower.getApiKey(), 
            // email:string 
            this.email, 
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
        this.hasChanged = false;
    };
    MyInfoComponent.prototype.checkUserInfoChanged = function () {
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("my-info / checkUserInfoChanged / init");
        if (isDebug)
            console.log("my-info / checkUserInfoChanged / this.loginUser : ", this.loginUser);
        var mobileHead = this.loginUser.getMobileHead();
        var mobileBody = this.loginUser.getMobileBody();
        var mobileTail = this.loginUser.getMobileTail();
        // 생일은 선택 입력이므로 없을 수도 있습니다.
        var birthYear = this.loginUser.getBirthYear();
        var birthMonth = this.loginUser.getBirthMonth();
        var birthDay = this.loginUser.getBirthDay();
        // 검사 시작!
        var hasChanged = false;
        if (this.nameComponent.isOK(this.name) &&
            this.name !== this.loginUser.name) {
            // 1. name
            if (isDebug)
                console.log("my-info / checkUserInfoChanged / 이름이 변경됨");
            hasChanged = true;
        }
        else if (this.nicknameComponent.isOK(this.nickname) &&
            this.nickname !== this.loginUser.nickname) {
            // 2. nickname
            if (isDebug)
                console.log("my-info / checkUserInfoChanged / 닉네임이 변경됨");
            hasChanged = true;
        }
        else if (this.profileImgUploadComponent.isOK(this.thumbnail) &&
            this.thumbnail !== this.loginUser.thumbnail) {
            // 3. profile-img
            if (isDebug)
                console.log("my-info / checkUserInfoChanged / 섬네일이 변경됨");
            hasChanged = true;
        }
        else if (this.mobileComponent.isOKHead(this.mobileNumHead) &&
            mobileHead !== this.mobileNumHead) {
            // 4-1. mobile head
            if (isDebug)
                console.log("my-info / checkUserInfoChanged / 휴대전화 첫 3자리 변경됨");
            hasChanged = true;
        }
        else if (this.mobileComponent.isOKBody(this.mobileNumBody) &&
            mobileBody !== this.mobileNumBody) {
            // 4-2. mobile body
            if (isDebug)
                console.log("my-info / checkUserInfoChanged / 휴대전화 두번째 4자리 변경됨");
            hasChanged = true;
        }
        else if (this.mobileComponent.isOKTail(this.mobileNumTail) &&
            mobileTail !== this.mobileNumTail) {
            // 4-3. mobile tail
            if (isDebug)
                console.log("my-info / checkUserInfoChanged / 휴대전화 세번째 4자리 변경됨");
            hasChanged = true;
        }
        else if (this.genderComponent.isOK(this.gender) &&
            this.gender !== this.loginUser.gender) {
            // 5. gender
            if (isDebug)
                console.log("my-info / checkUserInfoChanged / 성별 변경됨");
            hasChanged = true;
        }
        else if (this.birthdayComponent.isOKBirthYear(this.birthYear) &&
            birthYear !== this.birthYear) {
            // 6-1. birthYear
            if (isDebug)
                console.log("my-info / checkUserInfoChanged / 생일 - 연도 변경됨");
            hasChanged = true;
        }
        else if (this.birthdayComponent.isOKBirthMonth(this.birthMonth) &&
            birthMonth !== this.birthMonth) {
            // 6-2. birthMonth
            if (isDebug)
                console.log("my-info / checkUserInfoChanged / 생일 - 월 변경됨");
            hasChanged = true;
        }
        else if (this.birthdayComponent.isOKBirthDay(this.birthDay) &&
            birthDay !== this.birthDay) {
            // 6-3. birthDay
            if (isDebug)
                console.log("my-info / checkUserInfoChanged / 생일 - 일 변경됨");
            hasChanged = true;
        }
        else if (this.passwordsComponent.isOK(this.passwordNew) &&
            this.passwordCur !== this.passwordNew &&
            this.passwordNew === this.passwordRe) {
            // 7. password
            if (isDebug)
                console.log("my-info / checkUserInfoChanged / 생일 - 일 변경됨");
            hasChanged = true;
        } // end if
        return hasChanged;
    };
    MyInfoComponent.prototype.checkUserPasswordChanged = function () {
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("my-info / checkUserPasswordChanged / init");
        var hasChanged = false;
        if (this.passwordsComponent.isOK(this.passwordNew) &&
            this.passwordCur !== this.passwordNew &&
            this.passwordNew === this.passwordRe) {
            // 7. password
            if (isDebug)
                console.log("my-info / checkUserPasswordChanged / 비밀번호 변경됨.");
            hasChanged = true;
        } // end if
        return hasChanged;
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