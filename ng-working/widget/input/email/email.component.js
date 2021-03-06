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
var my_checker_service_1 = require('../../../util/service/my-checker.service');
var my_event_service_1 = require('../../../util/service/my-event.service');
var my_logger_service_1 = require('../../../util/service/my-logger.service');
var my_event_watchtower_service_1 = require('../../../util/service/my-event-watchtower.service');
var user_service_1 = require('../../../users/service/user.service');
var EmailComponent = (function () {
    function EmailComponent(myEventService, myLoggerService, watchTower, myCheckerService, userService) {
        this.myEventService = myEventService;
        this.myLoggerService = myLoggerService;
        this.watchTower = watchTower;
        this.myCheckerService = myCheckerService;
        this.userService = userService;
        this.width = 380;
        this.top = -1;
        this.left = -1;
        this.topWarning = -1;
        this.leftWarning = -1;
        this.isCheckUnique = true;
        this.isDisabled = false;
        this.emitter = new core_1.EventEmitter();
        this.isFocus = false;
        this.isFocusInfo = false;
        this.isWarning = false;
        this.isSuccessInput = false;
        this.tooltipMsg = "";
        this.tooltipMsgEmailNotValid = "이메일 주소를 다시 확인해주세요.";
        this.tooltipMsgEmailNotUnique = "이미 등록되어 있는 이메일입니다.";
        this.tooltipMsgEmailValid = "성공! 이메일 주소가 완벽해요.";
        this.isShowPopover = false;
        this.isAdmin = false;
        this.inputStrPrevOnBlur = "";
        this.inputStrPrevOnKeyup = "";
    }
    EmailComponent.prototype.ngOnInit = function () {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("email / ngOnInit / 시작");
    };
    EmailComponent.prototype.ngAfterViewInit = function () {
        // 자식 뷰가 모두 완료된 이후에 초기화를 진행.
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("email / ngAfterViewInit");
        this.asyncViewPack();
    };
    EmailComponent.prototype.asyncViewPack = function () {
        var _this = this;
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("email / asyncViewPack / 시작");
        // 이미 View 기본정보가 들어왔다면 바로 가져온다. 
        if (this.watchTower.getIsViewPackReady()) {
            if (isDebug)
                console.log("email / asyncViewPack / isViewPackReady : ", true);
            this.init();
        } // end if
        // View에 필요한 기본 정보가 비동기로 들어올 경우, 처리.
        this.watchTower.isViewPackReady$.subscribe(function (isViewPackReady) {
            if (isDebug)
                console.log("email / asyncViewPack / subscribe / isViewPackReady : ", isViewPackReady);
            _this.init();
        }); // end subscribe
    };
    EmailComponent.prototype.setViewPack = function () {
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
    EmailComponent.prototype.setMyChecker = function () {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("email / setMyChecker / 시작");
        if (null == this.myChecker) {
            this.myChecker = this.myCheckerService.getMyChecker("user_email");
        }
    };
    EmailComponent.prototype.init = function () {
        // 뷰에 필요한 공통 정보를 설정합니다.
        this.setViewPack();
        // 이메일 검사에 필요한 checker를 가져옵니다.
        this.setMyChecker();
    };
    // @ Desc : 이메일이 제대로 입력되었는지 확인합니다.
    EmailComponent.prototype.hasNotDone = function () {
        return !this.hasDone();
    };
    EmailComponent.prototype.hasDone = function () {
        return this.isOK(this.inputStrPrevOnKeyup);
    };
    // @ Desc : 이메일 입력을 확인해 달라는 표시를 보여줍니다.
    EmailComponent.prototype.showWarning = function () {
        this.isFocus = true;
        this.isWarning = true;
        this.isSuccessInput = false;
        this.tooltipMsg = this.tooltipMsgEmailNotValid;
    };
    EmailComponent.prototype.onClick = function (event) {
        event.stopPropagation();
        event.preventDefault();
    };
    EmailComponent.prototype.onBlur = function (event, email, element) {
        var _this = this;
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("email / onBlur / logPageEnter / 시작");
        event.stopPropagation();
        event.preventDefault();
        if (null == this.myCheckerService) {
            if (isDebug)
                console.log("email / onBlur / 중단 / null == this.myCheckerService");
            return;
        }
        // 내용이 동일하다면 중단합니다.
        if (null != this.inputStrPrevOnBlur && this.inputStrPrevOnBlur === email) {
            if (isDebug)
                console.log("email / onBlur / 중단 / 내용이 동일하다면 중단합니다.");
            this.isFocus = false;
            return;
        }
        if (this.isFocus) {
            this.isFocus = false;
        } // end if
        // 이메일 주소가 입력된 경우에만 검사를 진행합니다.
        if (null != email && "" != email) {
            // 마지막 공백 입력이 있다면 공백을 제거해줍니다.
            var regExpLastEmptySpace = /[\s]+$/gi;
            element.value = this.inputStrPrevOnBlur = email = email.replace(regExpLastEmptySpace, "");
            // 1. 사용자가 입력한 이메일 주소를 검사합니다.
            var isOK = this.isOK(email);
            if (isDebug)
                console.log("email / onBlur / getUserByEmail / isOK : ", isOK);
            if (isDebug)
                console.log("email / onBlur / getUserByEmail / this.isCheckUnique : ", this.isCheckUnique);
            if (isOK && this.isCheckUnique) {
                // 회원 가입시, 유일한 이메일인지 검사.
                this.userService
                    .getUserByEmail(email)
                    .then(function (myResponse) {
                    if (isDebug)
                        console.log("email / onBlur / getUserByEmail / myResponse : ", myResponse);
                    var user = null;
                    if (myResponse.isSuccess()) {
                        user = myResponse.getDataProp("user");
                        if (null != user) {
                            // 이미 이메일이 등록되어 있습니다.
                            _this.emailFailed(_this.tooltipMsgEmailNotUnique);
                        }
                        else {
                            // 이메일이 등록되어 있지 않습니다. 회원 가입 다음단계로 진행합니다.
                            _this.emailSuccess(email);
                        }
                    }
                    else {
                        // Error Report
                        if (isDebug)
                            console.log("email / onBlur / getUserByEmail / Error Report");
                        // Error Report
                        _this.myLoggerService.logError(
                        // apiKey:string
                        _this.watchTower.getApiKey(), 
                        // errorType:string
                        _this.myLoggerService.errorAPIFailed, 
                        // errorMsg:string
                        "email / getUserByEmail / Failed!");
                    } // end if
                }); // end service
            }
            else if (isOK) {
                // 로그인 시에는 이메일이 유일한지 검사하지 않습니다.
                if (isDebug)
                    console.log("email / onBlur / 로그인 시에는 이메일이 유일한지 검사하지 않습니다.");
                this.emailSuccess(email);
            }
            else {
                if (isDebug)
                    console.log("email / onBlur / 이메일에 문제가 있습니다.");
                this.emailFailed(this.tooltipMsgEmailNotValid);
            } // end if
        } // end if
    };
    EmailComponent.prototype.emailFailed = function (msgWarning) {
        if (null == msgWarning || "" == msgWarning) {
            return;
        }
        // 1-1-1. 이메일 주소에 문제가 있습니다!
        var lastHistory = this.myCheckerService.getLastHistory();
        this.isWarning = true;
        // 1-1-2. 경고 메시지를 노출합니다.
        this.tooltipMsg = msgWarning;
        this.isSuccessInput = false;
    };
    EmailComponent.prototype.emailSuccess = function (email) {
        if (null == email || "" == email) {
            return;
        }
        // 노출되어 있는 툴팁이 있다면 내립니다.
        this.hideTooltipNow();
        // 1-2-1. 정상적인 이메일 주소를 등록했습니다.
        this.isWarning = false;
        // 1-1-2. 성공 메시지를 노출합니다.
        // this.tooltipMsg = this.tooltipMsgEmailValid;
        this.tooltipMsg = null;
        this.isSuccessInput = true;
        // 1-1-3. 부모 객체에게 정상적인 이메일 주소를 전달합니다.
        // 부모 객체에게 Ready Event 발송 
        var myEventOnChange = this.myEventService.getMyEvent(
        // public eventName:string
        this.myEventService.ON_CHANGE, 
        // public key:string
        this.myEventService.KEY_USER_EMAIL, 
        // public value:string
        email, 
        // public metaObj:any
        null, 
        // public myChecker:MyChecker
        this.myChecker);
        this.emitter.emit(myEventOnChange);
        this.hideTooltip(2);
    };
    EmailComponent.prototype.hideTooltip = function (sec) {
        if (null == sec || !(0 < sec)) {
            sec = 3;
        }
        var _self = this;
        setTimeout(function () {
            // 메시지를 3초 뒤에 화면에서 지웁니다.
            _self.tooltipMsg = null;
            _self.isSuccessInput = false;
        }, 1000 * sec);
    };
    EmailComponent.prototype.hideTooltipNow = function () {
        this.tooltipMsg = null;
        this.isSuccessInput = false;
    };
    EmailComponent.prototype.onKeyupEnter = function (event) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("email / onKeyupEnter / init");
        event.stopPropagation();
        event.preventDefault();
        // 사용자가 input 영역에서 enter를 누르는 이벤트를 부모 객체로 전달합니다.
        var myEventOnChange = this.myEventService.getMyEvent(
        // public eventName:string
        this.myEventService.ON_KEYUP_ENTER, 
        // public key:string
        this.myEventService.KEY_USER_EMAIL, 
        // public value:string
        this.inputStrPrevOnKeyup, 
        // public metaObj:any
        null, 
        // public myChecker:MyChecker
        this.myChecker);
        this.emitter.emit(myEventOnChange);
    };
    EmailComponent.prototype.onKeyup = function (event, element) {
        event.stopPropagation();
        event.preventDefault();
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("email / onKeyup / init");
        var inputStr = element.value;
        // 비어있는 문자열이라면 검사하지 않습니다.
        if (null == inputStr || "" == inputStr) {
            if (isDebug)
                console.log("email / onKeyup / 중단 / 비어있는 문자열이라면 검사하지 않습니다.");
            return;
        }
        // 바뀌지 않았다면 검사하지 않습니다.
        if (this.inputStrPrevOnKeyup === inputStr) {
            if (isDebug)
                console.log("email / onKeyup / 중단 / 바뀌지 않았다면 검사하지 않습니다.");
            return;
        }
        // 한글 및 공백 입력시 삭제 처리.
        var regExpNotAllowed = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣 ]/gi;
        var matchArr = inputStr.match(regExpNotAllowed);
        if (null != matchArr && 0 < matchArr.length) {
            for (var i = 0; i < matchArr.length; ++i) {
                var match = matchArr[i];
                if (null == match || "" == match) {
                    continue;
                }
                inputStr = inputStr.replace(match, "");
            }
            // 1-1-2. 삭제 안내 메시지를 노출합니다.
            this.tooltipMsg = "한글 및 공백을 사용할 수 없어요.";
            this.isSuccessInput = false;
            this.hideTooltip(2);
            if (isDebug)
                console.log("email / onKeyup / 한글 및 공백 입력시 삭제 처리.");
        }
        element.value = this.inputStrPrevOnKeyup = inputStr;
    };
    EmailComponent.prototype.onFocus = function (event) {
        event.stopPropagation();
        event.preventDefault();
        if (!this.isFocus) {
            this.isFocus = true;
        } // end if
    };
    EmailComponent.prototype.setEmail = function (email) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("email / setEmail / init");
        if (isDebug)
            console.log("email / setEmail / email : ", email);
        // 외부에서 email주소를 지정하는 경우.
        if (this.isOK(email)) {
            if (isDebug)
                console.log("email / setEmail / 2");
            this.inputStrPrevOnKeyup = email;
        }
    };
    EmailComponent.prototype.isOK = function (email) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("email / isOK / 시작");
        var isOK = false;
        if (null == this.myCheckerService) {
            if (isDebug)
                console.log("email / isOK / 중단 / this.myCheckerService is not valid!");
            return isOK;
        }
        // 1. myChecker로 검사.
        return this.myCheckerService.isOK(this.myChecker, email);
    };
    EmailComponent.prototype.onMouseOverInfo = function (event) {
        event.stopPropagation();
        event.preventDefault();
        if (!this.isFocusInfo) {
            this.isFocusInfo = true;
        } // end if
    };
    EmailComponent.prototype.onMouseOutInfo = function (event) {
        event.stopPropagation();
        event.preventDefault();
        if (this.isFocusInfo) {
            this.isFocusInfo = false;
        } // end if
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], EmailComponent.prototype, "width", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], EmailComponent.prototype, "top", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], EmailComponent.prototype, "left", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], EmailComponent.prototype, "topWarning", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], EmailComponent.prototype, "leftWarning", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], EmailComponent.prototype, "isCheckUnique", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], EmailComponent.prototype, "isDisabled", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], EmailComponent.prototype, "emitter", void 0);
    EmailComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'email',
            templateUrl: 'email.component.html',
            styleUrls: ['email.component.css']
        }), 
        __metadata('design:paramtypes', [my_event_service_1.MyEventService, my_logger_service_1.MyLoggerService, my_event_watchtower_service_1.MyEventWatchTowerService, my_checker_service_1.MyCheckerService, user_service_1.UserService])
    ], EmailComponent);
    return EmailComponent;
}());
exports.EmailComponent = EmailComponent;
//# sourceMappingURL=email.component.js.map