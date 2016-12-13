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
var user_service_1 = require('../../../users/service/user.service');
var my_logger_service_1 = require('../../../util/service/my-logger.service');
var my_checker_service_1 = require('../../../util/service/my-checker.service');
var my_event_service_1 = require('../../../util/service/my-event.service');
var my_event_watchtower_service_1 = require('../../../util/service/my-event-watchtower.service');
var MobileComponent = (function () {
    function MobileComponent(userService, myLoggerService, watchTower, myCheckerService, myEventService) {
        this.userService = userService;
        this.myLoggerService = myLoggerService;
        this.watchTower = watchTower;
        this.myCheckerService = myCheckerService;
        this.myEventService = myEventService;
        this.top = -1;
        this.left = -1;
        this.topWarning = -1;
        this.leftWarning = -1;
        this.emitter = new core_1.EventEmitter();
        this.isSuccessHeadInput = false;
        this.isSuccessBodyInput = false;
        this.isSuccessTailInput = false;
        this.tooltipHeadMsg = null;
        this.tooltipBodyMsg = null;
        this.tooltipTailMsg = null;
        this.tooltipHeadNotAllowed = "전화번호에 문제가 있습니다.";
        this.tooltipDuplicated = "이미 사용중인 전화번호입니다.";
        this.tooltipHeadAllowed = "성공! 전화번호에 문제가 없습니다.";
        this.isFocus = false;
        this.isFocusInfo = false;
        this.isFocusMobileHead = false;
        this.isFocusMobileBody = false;
        this.isFocusMobileTail = false;
        this.isFocusMobileInfo = false;
        this.mobileHeadEmitted = "";
        this.mobileBodyEmitted = "";
        this.mobileTailEmitted = "";
        this.mobileHeadPrev = "010";
        this.mobileBodyPrev = "";
        this.mobileTailPrev = "";
        this.ngModelHead = "";
        this.ngModelBody = "";
        this.ngModelTail = "";
        this.isAdmin = false;
    }
    MobileComponent.prototype.ngOnInit = function () {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("mobile / ngOnInit / init");
        this.mobileHeadEmitted = this.mobileHeadPrev;
    };
    MobileComponent.prototype.ngAfterViewInit = function () {
        // 자식 뷰가 모두 완료된 이후에 초기화를 진행.
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("mobile / ngAfterViewInit");
        this.asyncViewPack();
    };
    MobileComponent.prototype.asyncViewPack = function () {
        var _this = this;
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("mobile / asyncViewPack / 시작");
        // 이미 View 기본정보가 들어왔다면 바로 가져온다. 
        if (this.watchTower.getIsViewPackReady()) {
            if (isDebug)
                console.log("mobile / asyncViewPack / isViewPackReady : ", true);
            this.init();
        } // end if
        // View에 필요한 기본 정보가 비동기로 들어올 경우, 처리.
        this.watchTower.isViewPackReady$.subscribe(function (isViewPackReady) {
            if (isDebug)
                console.log("mobile / asyncViewPack / subscribe / isViewPackReady : ", isViewPackReady);
            _this.init();
        }); // end subscribe
    };
    MobileComponent.prototype.setViewPack = function () {
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
    MobileComponent.prototype.setMyChecker = function () {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("mobile / setMyChecker / 시작");
        if (null == this.myCheckerService) {
            if (isDebug)
                console.log("mobile / setMyChecker / this.myCheckerService is not valid!");
            return;
        }
        if (null == this.myCheckerMobileHead) {
            this.myCheckerMobileHead = this.myCheckerService.getMyChecker("user_mobile_kor_head");
        }
        if (null == this.myCheckerMobileBody) {
            this.myCheckerMobileBody = this.myCheckerService.getMyChecker("user_mobile_kor_body");
        }
        if (null == this.myCheckerMobileTail) {
            this.myCheckerMobileTail = this.myCheckerService.getMyChecker("user_mobile_kor_tail");
        }
    };
    MobileComponent.prototype.init = function () {
        // 휴대폰 번호 검사에 필요한 checker를 가져옵니다.
        this.setMyChecker();
        // 뷰에 필요한 공통 정보를 설정합니다.
        this.setViewPack();
    };
    MobileComponent.prototype.isNotOKHead = function (input) {
        return !this.isOKHead(input);
    };
    MobileComponent.prototype.isOKHead = function (input) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("mobile / isOKHead / init");
        if (isDebug)
            console.log("mobile / isOKHead / init / |" + input + "|");
        if (null == this.myCheckerService) {
            if (isDebug)
                console.log("mobile / isOKHead / this.myCheckerService is not valid!");
            return false;
        }
        var isOK = this.myCheckerService.isOK(this.myCheckerMobileHead, input);
        if (isDebug)
            console.log("mobile / isOKHead / isOK : ", isOK);
        if (!isOK) {
            var history_1 = this.myCheckerService.getLastHistory();
            if (isDebug)
                console.log("mobile / isOKHead / history : ", history_1);
        }
        return isOK;
    };
    MobileComponent.prototype.isNotOKBody = function (input) {
        return !this.isOKBody(input);
    };
    MobileComponent.prototype.isOKBody = function (input) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("mobile / isOKBody / init");
        if (isDebug)
            console.log("mobile / isOKBody / init / |" + input + "|");
        if (null == this.myCheckerService) {
            if (isDebug)
                console.log("mobile / isOKBody / this.myCheckerService is not valid!");
            return false;
        }
        var isOK = this.myCheckerService.isOK(this.myCheckerMobileBody, input);
        if (isDebug)
            console.log("mobile / isOKBody / isOK : ", isOK);
        if (!isOK) {
            var history_2 = this.myCheckerService.getLastHistory();
            if (isDebug)
                console.log("mobile / isOKBody / history : ", history_2);
        }
        return isOK;
    };
    MobileComponent.prototype.isNotOKTail = function (input) {
        return !this.isOKTail(input);
    };
    MobileComponent.prototype.isOKTail = function (input) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("mobile / isOKTail / init");
        if (isDebug)
            console.log("mobile / isOKTail / init / |" + input + "|");
        if (null == this.myCheckerService) {
            if (isDebug)
                console.log("mobile / isOKTail / this.myCheckerService is not valid!");
            return false;
        }
        var isOK = this.myCheckerService.isOK(this.myCheckerMobileTail, input);
        if (isDebug)
            console.log("mobile / isOKTail / isOK : ", isOK);
        if (!isOK) {
            var history_3 = this.myCheckerService.getLastHistory();
            if (isDebug)
                console.log("mobile / isOKTail / history : ", history_3);
        }
        return isOK;
    };
    MobileComponent.prototype.setMobileHead = function (mobileHead) {
        if (this.isOKHead(mobileHead)) {
            this.ngModelHead = this.mobileHeadEmitted = this.mobileHeadPrev = mobileHead;
        }
    };
    MobileComponent.prototype.setMobileBody = function (mobileBody) {
        if (this.isOKBody(mobileBody)) {
            this.ngModelBody = this.mobileBodyEmitted = this.mobileBodyPrev = mobileBody;
        }
    };
    MobileComponent.prototype.setMobileTail = function (mobileTail) {
        if (this.isOKTail(mobileTail)) {
            this.ngModelTail = this.mobileTailEmitted = this.mobileTailPrev = mobileTail;
        }
    };
    MobileComponent.prototype.hasDoneMobile = function () {
        if (this.hasDoneMobileHead() &&
            this.hasDoneMobileBody() &&
            this.hasDoneMobileTail()) {
            return true;
        }
        return false;
    };
    // @ Desc : 전화번호 앞자리가 제대로 입력되었는지 확인합니다.
    MobileComponent.prototype.hasNotDoneMobileHead = function () {
        return !this.hasDoneMobileHead();
    };
    MobileComponent.prototype.hasDoneMobileHead = function () {
        var isOKHead = this.isOKHead(this.mobileHeadPrev);
        return isOKHead;
    };
    // @ Desc : 전화번호 앞자리를 확인해 달라는 표시를 보여줍니다.
    MobileComponent.prototype.showWarningMobileHead = function () {
        this.isFocusMobileHead = true;
        this.isSuccessHeadInput = false;
        this.tooltipHeadMsg = this.tooltipHeadNotAllowed;
    };
    MobileComponent.prototype.hideWarningMobileHead = function () {
        this.isFocusMobileHead = false;
        this.isSuccessHeadInput = true;
        this.tooltipHeadMsg = null;
    };
    MobileComponent.prototype.getMobileHead = function () {
        return this.mobileHeadPrev;
    };
    // @ Desc : 전화번호 가운데 자리가 제대로 입력되었는지 확인합니다.
    MobileComponent.prototype.hasNotDoneMobileBody = function () {
        return !this.hasDoneMobileBody();
    };
    MobileComponent.prototype.hasDoneMobileBody = function () {
        return this.isOKBody(this.mobileBodyPrev);
    };
    // @ Desc : 전화번호 가운데 자리를 확인해 달라는 표시를 보여줍니다.
    MobileComponent.prototype.showWarningMobileBody = function () {
        this.isFocusMobileBody = true;
        this.isSuccessBodyInput = false;
        this.tooltipBodyMsg = this.tooltipHeadNotAllowed;
    };
    // @ Desc : 전화번호 마지막 자리가 제대로 입력되었는지 확인합니다.
    MobileComponent.prototype.hasNotDoneMobileTail = function () {
        return !this.hasDoneMobileTail();
    };
    MobileComponent.prototype.hasDoneMobileTail = function () {
        return this.isOKTail(this.mobileTailPrev);
    };
    // @ Desc : 전화번호 마지막 자리를 확인해 달라는 표시를 보여줍니다.
    MobileComponent.prototype.showWarningMobileTail = function () {
        this.isFocusMobileTail = true;
        this.isSuccessTailInput = false;
        this.tooltipTailMsg = this.tooltipHeadNotAllowed;
    };
    MobileComponent.prototype.onClickInfo = function (event) {
        event.stopPropagation();
        event.preventDefault();
        this.isFocusInfo = !this.isFocusInfo;
    };
    MobileComponent.prototype.onMouseOverInfo = function (event) {
        event.stopPropagation();
        event.preventDefault();
        if (!this.isFocusInfo) {
            this.isFocusInfo = true;
        } // end if
    };
    MobileComponent.prototype.onMouseOutInfo = function (event) {
        event.stopPropagation();
        event.preventDefault();
        if (this.isFocusInfo) {
            this.isFocusInfo = false;
        } // end if
    };
    MobileComponent.prototype.onClickHead = function (event, element) {
        event.stopPropagation();
        event.preventDefault();
        if (!this.isFocusMobileHead) {
            this.isFocusMobileHead = true;
        } // end if
        var inputStr = element.value;
        this.mobileHeadPrev = inputStr;
    };
    MobileComponent.prototype.onFocusHead = function (event, element) {
        this.isFocusMobileHead = true;
    };
    MobileComponent.prototype.onKeydownTabHead = function (event, element) {
        this.isFocusMobileHead = true;
    };
    MobileComponent.prototype.onKeydownTabShiftHead = function (event, element) {
        this.isFocusMobileHead = true;
    };
    MobileComponent.prototype.onKeyupHead = function (event, element, elementNext) {
        event.stopPropagation();
        event.preventDefault();
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("mobile / onKeyupHead / init");
        var inputStr = element.value;
        if (null == inputStr || "" == inputStr) {
            if (isDebug)
                console.log("mobile / onKeyupHead / 중단 / 입력된 내용이 없습니다.");
            return;
        }
        if (this.mobileHeadPrev === inputStr) {
            // 방향키로 움직이는 경우를 방어
            if (isDebug)
                console.log("mobile / onKeyupHead / 중단 / 바뀌지 않았다면 검사하지 않습니다.");
            return;
        }
        // 숫자가 아닌 글자들은 모두 삭제해준다.
        var inputStrFiltered = inputStr.replace(/[^0-9]/gi, "");
        if (element.value != inputStrFiltered) {
            // 툴팁을 보여줍니다.
            this.tooltipHeadMsg = "숫자만 가능합니다.";
            this.isFocusMobileHead = true;
            this.isSuccessHeadInput = false;
            element.focus();
            this.hideTooltipHead(2);
            if (isDebug)
                console.log("mobile / onKeyupHead / 숫자가 아닌 글자들은 모두 삭제해준다.");
            inputStr = inputStrFiltered;
        }
        var max = this.myCheckerMobileHead.max;
        var isOK = true;
        if (0 < max && max < inputStr.length) {
            isOK = false;
        }
        if (isDebug)
            console.log("mobile / onKeyupHead / isOK : ", isOK);
        if (isDebug)
            console.log("mobile / onKeyupHead / max : ", max);
        if (!isOK) {
            // 최대 길이보다 깁니다.
            this.tooltipHeadMsg = "숫자 3자리를 입력해주세요.";
            this.isFocusMobileHead = true;
            this.isSuccessHeadInput = false;
            element.focus();
            this.hideTooltipHead(2);
            // 마지막으로 입력한 문자를 지웁니다.
            inputStr = inputStr.slice(0, (inputStr.length - 1));
            if (isDebug)
                console.log("mobile / onKeyupHead / 마지막으로 입력한 문자를 지웁니다.");
        } // end if
        // 전체 필터 검사를 진행합니다.
        isOK = this.isOKHead(inputStr);
        if (!isOK) {
            // 조건에 맞지 않습니다.
            // 원인을 찾아봅니다.
            var history_4 = this.myCheckerService.getLastHistory();
            if (null != history_4 &&
                null != history_4.key &&
                null != history_4.msg) {
                if (isDebug)
                    console.log("mobile / onKeyupHead / 전체 필터 검사 / history : ", history_4);
                if (isDebug)
                    console.log("mobile / onKeyupHead / 전체 필터 검사 / this.mobileHeadPrev : ", this.mobileHeadPrev);
                if ("regexInclude" === history_4.key) {
                    var regExpStr = history_4.value + "";
                    var regExpStrInputStrRange = /^01[0-9]$/g + "";
                    if (regExpStr == regExpStrInputStrRange) {
                        this.tooltipHeadMsg = "휴대전화 형식이 맞지 않습니다.";
                        this.isFocusMobileHead = true;
                        this.isSuccessHeadInput = false;
                        element.focus();
                        this.hideTooltipHead(2);
                        // 직전 내용으로 롤백.
                        element.value = inputStr = this.mobileHeadPrev;
                    }
                }
            } // end inner if
        }
        else {
            // 모든 조건이 맞습니다. 다음 번호 입력창으로 넘어갑니다.
            if (isDebug)
                console.log("mobile / onKeyupHead / 모든 조건이 맞습니다. 다음 번호 입력창으로 넘어갑니다.");
            // hide tooltip
            this.tooltipHeadMsg = null;
            // this.tooltipHeadMsg = this.tooltipHeadAllowed;
            this.isFocusMobileHead = false;
            this.isSuccessHeadInput = true;
            // this.hideTooltipHead(2);
            if (null != elementNext && !this.isSuccessBodyInput) {
                elementNext.focus();
            }
            // 부모 객체에게 Change Event 발송 
            var myEventOnChange = this.myEventService.getMyEvent(
            // public eventName:string
            this.myEventService.ON_CHANGE, 
            // public key:string
            this.myEventService.KEY_USER_MOBILE_NUM_HEAD, 
            // public value:string
            inputStr, 
            // public metaObj:any
            null, 
            // public myChecker:MyChecker
            this.myCheckerMobileHead);
            this.emitter.emit(myEventOnChange);
            // 전송된 전화번호 값을 저장함. 
            this.mobileHeadPrev = this.mobileHeadEmitted = inputStr;
        }
    }; // end method
    MobileComponent.prototype.onBlurHead = function (event, element, elementNext) {
        event.stopPropagation();
        event.preventDefault();
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("mobile / onBlurHead / init");
        if (this.isFocusMobileHead) {
            this.isFocusMobileHead = false;
        } // end if
        var inputStr = element.value;
        if (null == inputStr || "" == inputStr) {
            return;
        }
        var isOK = this.isOKHead(inputStr);
        if (!isOK) {
            // 조건에 맞지 않습니다.
            // 원인을 찾아봅니다.
            var history_5 = this.myCheckerService.getLastHistory();
            if (null != history_5 &&
                null != history_5.key &&
                null != history_5.msg) {
                history_5.value;
                if ("regexInclude" === history_5.key) {
                    var regExpStr = history_5.value + "";
                    var regExpStrInputStrRange = /^01[0-9]$/g + "";
                    if (regExpStr == regExpStrInputStrRange) {
                        this.tooltipHeadMsg = "휴대전화 번호를 다시 확인해주세요.";
                        this.isFocusMobileHead = true;
                        this.isSuccessHeadInput = false;
                        element.focus();
                        // 숫자가 아닌 글자들은 모두 삭제해준다.
                        element.value = inputStr = inputStr.replace(/[^0-9]/gi, "");
                    }
                }
            } // end inner if
        }
        else {
            // 성공! 정상적인 입력입니다.
            this.tooltipHeadMsg = null;
            // this.tooltipHeadMsg = this.tooltipHeadAllowed;
            this.isFocusMobileHead = false;
            this.isSuccessHeadInput = true;
            // this.hideTooltipHead(2);
            if (null != elementNext && !this.isSuccessBodyInput) {
                elementNext.focus();
            }
            // 부모 객체에게 Change Event 발송 
            var myEventOnChange = this.myEventService.getMyEvent(
            // public eventName:string
            this.myEventService.ON_CHANGE, 
            // public key:string
            this.myEventService.KEY_USER_MOBILE_NUM_HEAD, 
            // public value:string
            inputStr, 
            // public metaObj:any
            null, 
            // public myChecker:MyChecker
            this.myCheckerMobileHead);
            this.emitter.emit(myEventOnChange);
            // 전송된 전화번호 값을 저장함. 
            this.mobileHeadEmitted = inputStr;
        } // end if
    };
    MobileComponent.prototype.hideTooltipHead = function (sec) {
        if (null == sec || !(0 < sec)) {
            sec = 3;
        }
        var _self = this;
        setTimeout(function () {
            // 메시지를 3초 뒤에 화면에서 지웁니다.
            _self.tooltipHeadMsg = null;
        }, 1000 * sec);
    };
    MobileComponent.prototype.hideTooltipBody = function (sec) {
        if (null == sec || !(0 < sec)) {
            sec = 3;
        }
        var _self = this;
        setTimeout(function () {
            // 메시지를 3초 뒤에 화면에서 지웁니다.
            _self.tooltipBodyMsg = null;
        }, 1000 * sec);
    };
    MobileComponent.prototype.hideTooltipTail = function (sec) {
        if (null == sec || !(0 < sec)) {
            sec = 3;
        }
        var _self = this;
        setTimeout(function () {
            // 메시지를 3초 뒤에 화면에서 지웁니다.
            _self.tooltipTailMsg = null;
        }, 1000 * sec);
    };
    MobileComponent.prototype.onClickBody = function (event, element) {
        event.stopPropagation();
        event.preventDefault();
        if (!this.isFocusMobileBody) {
            this.isFocusMobileBody = true;
        } // end if
        this.mobileBodyPrev = element.value;
    };
    MobileComponent.prototype.onFocusBody = function (event, element) {
        this.isFocusMobileBody = true;
    };
    MobileComponent.prototype.onKeydownTabBody = function (event, element) {
        this.isFocusMobileBody = true;
    };
    MobileComponent.prototype.onKeydownTabShiftBody = function (event, element) {
        this.isFocusMobileBody = true;
    };
    MobileComponent.prototype.onKeyupBody = function (event, element, elementNext) {
        event.stopPropagation();
        event.preventDefault();
        // let isDebug:boolean = true;
        var isDebug = false;
        var inputStr = element.value;
        if (null == inputStr || "" == inputStr) {
            if (isDebug)
                console.log("mobile / onKeyupBody / 중단 / inputStr is not valid!");
            return;
        }
        if (isDebug)
            console.log("mobile / onKeyupBody / inputStr : ", inputStr);
        if (this.mobileBodyPrev === inputStr) {
            // 방향키로 움직이는 경우를 방어
            if (isDebug)
                console.log("mobile / onKeyupBody / 중단 / 바뀌지 않았다면 검사하지 않습니다.");
            return;
        }
        // 숫자가 아닌 글자들은 모두 삭제해준다.
        var inputStrFiltered = inputStr.replace(/[^0-9]/gi, "");
        if (inputStrFiltered != inputStr) {
            if (isDebug)
                console.log("mobile / onKeyupBody / 숫자가 아닌 글자들은 모두 삭제해준다.");
            element.value = inputStr = inputStrFiltered;
        }
        // 툴팁을 보여줍니다.
        if (element.value != inputStr) {
            this.tooltipBodyMsg = "숫자만 가능합니다.";
            this.isFocusMobileBody = true;
            this.isSuccessBodyInput = false;
            this.hideTooltipBody(2);
        }
        var max = this.myCheckerMobileBody.max;
        var isOK = true;
        if (0 < max && max < inputStr.length) {
            isOK = false;
        }
        if (isDebug)
            console.log("mobile / onKeyupBody / isOK : ", isOK);
        if (isDebug)
            console.log("mobile / onKeyupBody / max : ", max);
        if (!isOK) {
            // 최대 길이보다 깁니다.
            this.tooltipBodyMsg = "숫자 3자리를 입력해주세요.";
            this.isFocusMobileBody = true;
            this.isSuccessBodyInput = false;
            element.focus();
            this.hideTooltipBody(2);
            // 마지막으로 입력한 문자를 지웁니다.
            inputStr = inputStr.slice(0, (inputStr.length - 1));
            if (isDebug)
                console.log("mobile / onKeyupBody / 마지막으로 입력한 문자를 지웁니다.");
        } // end if
        // 전체 필터 검사를 진행합니다.
        isOK = this.isOKBody(inputStr);
        if (!isOK) {
            // 조건에 맞지 않습니다.
            // 원인을 찾아봅니다.
            var history_6 = this.myCheckerService.getLastHistory();
            if (null != history_6 &&
                null != history_6.key &&
                null != history_6.msg) {
                if (isDebug)
                    console.log("mobile / onKeyupBody / 전체 필터 검사 / history : ", history_6);
                if (isDebug)
                    console.log("mobile / onKeyupBody / 전체 필터 검사 / this.mobileBodyPrev : ", this.mobileBodyPrev);
                if ("regexInclude" === history_6.key) {
                    var regExpStr = history_6.value + "";
                    var regExpStrInputStrRange = /^01[0-9]$/g + "";
                    if (regExpStr == regExpStrInputStrRange) {
                        this.tooltipBodyMsg = "휴대전화 형식이 맞지 않습니다.";
                        this.isFocusMobileBody = true;
                        this.isSuccessBodyInput = false;
                        element.focus();
                        this.hideTooltipBody(2);
                        // 직전 내용으로 롤백.
                        element.value = inputStr = this.mobileBodyPrev;
                    }
                }
            } // end inner if
        }
        else if (max === inputStr.length) {
            // 사용자가 입력한 전화번호가 가장 긴 4자리인 경우, 입력은 완료한 것으로 판단합니다.
            // 모든 조건이 맞습니다. 
            if (isDebug)
                console.log("mobile / onKeyupBody / 모든 조건이 맞습니다. 다음 번호 입력창으로 넘어갑니다.");
            // hide tooltip
            this.tooltipBodyMsg = null;
            // this.tooltipBodyMsg = this.tooltipHeadAllowed;
            // this.hideTooltipBody(2);
            this.isFocusMobileBody = false;
            this.isSuccessBodyInput = true;
            // 다음 번호 입력창으로 넘어갑니다.
            if (null != elementNext && !this.isSuccessTailInput) {
                elementNext.focus();
                this.isFocusMobileTail = true;
            }
            // 부모 객체에게 Change Event 발송 
            var myEventOnChange = this.myEventService.getMyEvent(
            // public eventName:string
            this.myEventService.ON_CHANGE, 
            // public key:string
            this.myEventService.KEY_USER_MOBILE_NUM_BODY, 
            // public value:string
            inputStr, 
            // public metaObj:any
            null, 
            // public myChecker:MyChecker
            this.myCheckerMobileBody);
            this.emitter.emit(myEventOnChange);
            // 전송된 전화번호 값을 저장함. 
            this.mobileBodyPrev = this.mobileBodyEmitted = inputStr;
        }
    };
    MobileComponent.prototype.onBlurBody = function (event, element, elementNext) {
        event.stopPropagation();
        event.preventDefault();
        if (this.isFocusMobileBody) {
            this.isFocusMobileBody = false;
        } // end if
        var inputStr = element.value;
        if (null == inputStr || "" == inputStr) {
            return;
        }
        var isOK = this.isOKBody(inputStr);
        if (!isOK) {
            // 조건에 맞지 않습니다.
            // 원인을 찾아봅니다.
            var history_7 = this.myCheckerService.getLastHistory();
            if (null != history_7 &&
                null != history_7.key &&
                null != history_7.msg) {
                //min
                if ("min" === history_7.key) {
                    this.tooltipBodyMsg = history_7.msg;
                    this.isFocusMobileBody = true;
                    this.isSuccessBodyInput = false;
                    element.focus();
                }
                else if ("max" === history_7.key) {
                    this.tooltipBodyMsg = history_7.msg;
                    this.isFocusMobileBody = true;
                    this.isSuccessBodyInput = false;
                    element.focus();
                }
                else if ("regexInclude" === history_7.key) {
                    var regExpStr = history_7.value + "";
                    var regExpStrInputStrRange = /^[0-9]{3,4}$/g + "";
                    if (regExpStr == regExpStrInputStrRange) {
                        this.tooltipBodyMsg = "휴대전화 번호를 다시 확인해주세요.";
                        this.isFocusMobileBody = true;
                        this.isSuccessBodyInput = false;
                        element.focus();
                        // 숫자가 아닌 글자들은 모두 삭제해준다.
                        element.value = inputStr = inputStr.replace(/[^0-9]/gi, "");
                    }
                }
            } // end inner if
        }
        else {
            // 성공! 정상적인 입력입니다.
            this.tooltipBodyMsg = null;
            // this.tooltipBodyMsg = this.tooltipHeadAllowed;
            this.isFocusMobileBody = false;
            this.isSuccessBodyInput = true;
            // this.hideTooltipBody(2);
            if (null != elementNext && !this.isSuccessTailInput) {
                elementNext.focus();
            }
            // 부모 객체에게 Change Event 발송 
            var myEventOnChange = this.myEventService.getMyEvent(
            // public eventName:string
            this.myEventService.ON_CHANGE, 
            // public key:string
            this.myEventService.KEY_USER_MOBILE_NUM_BODY, 
            // public value:string
            inputStr, 
            // public metaObj:any
            null, 
            // public myChecker:MyChecker
            this.myCheckerMobileBody);
            this.emitter.emit(myEventOnChange);
            // 전송된 전화번호 값을 저장함. 
            this.mobileBodyEmitted = inputStr;
        } // end if 
    };
    MobileComponent.prototype.onClickTail = function (event, element, elementPrev) {
        event.stopPropagation();
        event.preventDefault();
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("mobile / onClickTail / init");
        if (!this.isFocusMobileTail) {
            this.isFocusMobileTail = true;
        } // end if
        this.mobileTailPrev = element.value;
        // 중간 전화번호 입력이 안되어 있다면 중간 전화번호 입력으로 먼저 이동합니다.
        if (null != elementPrev && (null == elementPrev.value || "" === elementPrev.value)) {
            if (isDebug)
                console.log("mobile / onClickTail / 중간 전화번호 입력이 안되어 있다면 중간 전화번호 입력으로 먼저 이동합니다.");
            this.isFocusMobileTail = false;
            // 사용자에게 안내메시지 노출.
            this.tooltipBodyMsg = "휴대전화 번호를 먼저 확인해주세요.";
            this.isFocusMobileBody = true;
            this.isSuccessBodyInput = false;
            elementPrev.focus();
            this.hideTooltipTail(2);
        }
    };
    MobileComponent.prototype.onFocusTail = function (event, element) {
        this.isFocusMobileTail = true;
    };
    MobileComponent.prototype.onKeydownTabTail = function (event, element) {
        this.isFocusMobileTail = true;
    };
    MobileComponent.prototype.onKeydownTabShiftTail = function (event, element) {
        this.isFocusMobileTail = true;
    };
    MobileComponent.prototype.onKeyupTail = function (event, element) {
        event.stopPropagation();
        event.preventDefault();
        // let isDebug:boolean = true;
        var isDebug = false;
        var inputStr = element.value;
        if (null == inputStr || "" == inputStr) {
            if (isDebug)
                console.log("mobile / onKeyupTail / 중단 / inputStr is not valid!");
            return;
        }
        if (isDebug)
            console.log("mobile / onKeyupTail / inputStr : ", inputStr);
        if (this.mobileTailPrev === inputStr) {
            // 방향키로 움직이는 경우를 방어
            if (isDebug)
                console.log("mobile / onKeyupTail / 중단 / 바뀌지 않았다면 검사하지 않습니다.");
            return;
        }
        // 숫자가 아닌 글자들은 모두 삭제해준다.
        var inputStrFiltered = inputStr.replace(/[^0-9]/gi, "");
        if (inputStrFiltered != inputStr) {
            if (isDebug)
                console.log("mobile / onKeyupTail / 숫자가 아닌 글자들은 모두 삭제해준다.");
            element.value = inputStr = inputStrFiltered;
        }
        // 툴팁을 보여줍니다.
        if (element.value != inputStr) {
            this.tooltipTailMsg = "숫자만 가능합니다.";
            this.isFocusMobileTail = true;
            this.isSuccessTailInput = false;
            element.focus();
            this.hideTooltipTail(2);
        }
        var max = this.myCheckerMobileTail.max;
        var isOK = true;
        if (0 < max && max < inputStr.length) {
            isOK = false;
        }
        if (isDebug)
            console.log("mobile / onKeyupTail / isOK : ", isOK);
        if (isDebug)
            console.log("mobile / onKeyupTail / max : ", max);
        if (!isOK) {
            // 최대 길이보다 깁니다.
            this.tooltipTailMsg = "숫자 3자리를 입력해주세요.";
            this.isFocusMobileTail = true;
            this.isSuccessTailInput = false;
            element.focus();
            this.hideTooltipTail(2);
            // 마지막으로 입력한 문자를 지웁니다.
            inputStr = inputStr.slice(0, (inputStr.length - 1));
            if (isDebug)
                console.log("mobile / onKeyupTail / 마지막으로 입력한 문자를 지웁니다.");
        } // end if
        // 전체 필터 검사를 진행합니다.
        isOK = this.isOKTail(inputStr);
        if (!isOK) {
            // 조건에 맞지 않습니다.
            // 원인을 찾아봅니다.
            var history_8 = this.myCheckerService.getLastHistory();
            if (null != history_8 &&
                null != history_8.key &&
                null != history_8.msg) {
                if (isDebug)
                    console.log("mobile / onKeyupTail / 전체 필터 검사 / history : ", history_8);
                if (isDebug)
                    console.log("mobile / onKeyupTail / 전체 필터 검사 / this.mobileTailPrev : ", this.mobileTailPrev);
                if ("regexInclude" === history_8.key) {
                    var regExpStr = history_8.value + "";
                    var regExpStrInputStrRange = /^01[0-9]$/g + "";
                    if (regExpStr == regExpStrInputStrRange) {
                        this.tooltipTailMsg = "휴대전화 형식이 맞지 않습니다.";
                        this.isFocusMobileTail = true;
                        this.isSuccessTailInput = false;
                        element.focus();
                        this.hideTooltipTail(2);
                        // 직전 내용으로 롤백.
                        element.value = inputStr = this.mobileTailPrev;
                    }
                }
            } // end inner if
        }
        else if (max === inputStr.length) {
            // 사용자가 입력한 전화번호가 가장 긴 4자리인 경우, 입력은 완료한 것으로 판단합니다.
            // 모든 조건이 맞습니다. 
            if (isDebug)
                console.log("mobile / onKeyupTail / 모든 조건이 맞습니다. 전화번호 입력을 종료합니다.");
            // hide tooltip
            this.tooltipTailMsg = null;
            this.isFocusMobileTail = false;
            this.isSuccessTailInput = true;
            element.blur();
            // wonder.jung
            // 전송될 전화번호 값을 저장함. 
            this.mobileTailPrev = this.mobileTailEmitted = inputStr;
            // 전화번호 중복 확인 뒤에 부모 객체로 이벤트 발송.
            this.emitEventChange();
        }
    };
    MobileComponent.prototype.emitEventChange = function () {
        // 모든 전화번호를 가져와야 함.
        // 완성이 된 전화번호만 검사합니다.
        var _this = this;
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("mobile / emitEventChange / init / 완성이 된 전화번호만 검사합니다.");
        var isOK = this.isOKHead(this.mobileHeadEmitted);
        if (!isOK) {
            if (isDebug)
                console.log("mobile / emitEventChange / 중단 / 전화번호 첫 3자리에 문제가 있습니다.");
            return;
        }
        isOK = this.isOKBody(this.mobileBodyEmitted);
        if (!isOK) {
            if (isDebug)
                console.log("mobile / emitEventChange / 중단 / 전화번호 두번째 3~4자리에 문제가 있습니다.");
            return;
        }
        isOK = this.isOKTail(this.mobileTailEmitted);
        if (!isOK) {
            if (isDebug)
                console.log("mobile / emitEventChange / 중단 / 전화번호 세번째 4자리에 문제가 있습니다.");
            return;
        }
        this.userService
            .getUserByMobile(this.myCheckerService.getAPIKey(), this.mobileHeadEmitted, this.mobileBodyEmitted, this.mobileTailEmitted).then(function (myResponse) {
            if (isDebug)
                console.log("mobile / emitEventChange / getUserByMobile / myResponse : ", myResponse);
            if (myResponse.isSuccess()) {
                var user = myResponse.getDataProp("user");
                if (null == user) {
                    // 전화번호가 유일합니다. 문제 없음.
                    if (isDebug)
                        console.log("mobile / emitEventChange / getUserByMobile / 전화번호가 유일합니다. 문제 없음.");
                    // 부모 객체에게 Change Event 발송 
                    var myEventOnChange = _this.myEventService.getMyEvent(
                    // public eventName:string
                    _this.myEventService.ON_CHANGE, 
                    // public key:string
                    _this.myEventService.KEY_USER_MOBILE_NUM_TAIL, 
                    // public value:string
                    _this.mobileTailEmitted, 
                    // public metaObj:any
                    null, 
                    // public myChecker:MyChecker
                    _this.myCheckerMobileTail);
                    _this.emitter.emit(myEventOnChange);
                    // 이전에 노출한 경고 메시지가 있다면 내립니다.
                    _this.tooltipBodyMsg = null;
                    // 포커싱을 모두 내립니다.
                    _this.isFocusMobileHead = false;
                    _this.isFocusMobileBody = false;
                    _this.isFocusMobileTail = false;
                }
                else {
                    // 전화번호가 유일하지 않습니다. 
                    if (isDebug)
                        console.log("mobile / emitEventChange / getUserByMobile / 전화번호가 유일하지 않습니다. 다른 사용자의 전화번호입니다.");
                    // 사용자에게 알립니다. - 마지막 전화번호 칸에 경고 메시지.
                    _this.isSuccessBodyInput = false;
                    _this.tooltipBodyMsg = _this.tooltipDuplicated;
                    // 전화번호 입력칸을 모두 포커싱합니다.
                    _this.isFocusMobileHead = true;
                    _this.isFocusMobileBody = true;
                    _this.isFocusMobileTail = true;
                } // end inner if
            }
            else {
                // Error Report
                // 에러 로그 등록
                _this.myLoggerService.logError(
                // apiKey:string
                _this.watchTower.getApiKey(), 
                // errorType:string
                _this.myLoggerService.errorAPIFailed, 
                // errorMsg:string
                "mobile / emitEventChange / Failed!");
            } // end if
        });
    };
    MobileComponent.prototype.onBlurTail = function (event, element, elementNext) {
        event.stopPropagation();
        event.preventDefault();
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("mobile / onBlurTail / init");
        if (this.isFocusMobileTail) {
            this.isFocusMobileTail = false;
        } // end if
        var inputStr = element.value;
        if (null == inputStr || "" == inputStr) {
            if (isDebug)
                console.log("mobile / onBlurTail / 중단 / inputStr is not valid!");
            return;
        }
        if (isDebug)
            console.log("mobile / onBlurTail / inputStr : ", inputStr);
        var isOK = this.isOKTail(inputStr);
        if (isDebug)
            console.log("mobile / onBlurTail / isOK : ", isOK);
        if (!isOK) {
            // 조건에 맞지 않습니다.
            if (isDebug)
                console.log("mobile / onBlurTail / 조건에 맞지 않습니다.");
            // 원인을 찾아봅니다.
            var history_9 = this.myCheckerService.getLastHistory();
            if (isDebug)
                console.log("mobile / onBlurTail / history : ", history_9);
            if (null != history_9 &&
                null != history_9.key &&
                null != history_9.msg) {
                //min
                if ("min" === history_9.key) {
                    this.tooltipTailMsg = history_9.msg;
                    this.isFocusMobileTail = true;
                    this.isSuccessTailInput = false;
                    element.focus();
                }
                else if ("max" === history_9.key) {
                    this.tooltipTailMsg = history_9.msg;
                    this.isFocusMobileTail = true;
                    this.isSuccessTailInput = false;
                    element.focus();
                }
                else if ("regexInclude" === history_9.key) {
                    var regExpStr = history_9.value + "";
                    var regExpStrInputStrRange = /^[0-9]{3,4}$/g + "";
                    if (regExpStr == regExpStrInputStrRange) {
                        this.tooltipTailMsg = "휴대전화 번호를 다시 확인해주세요.";
                        this.isFocusMobileTail = true;
                        this.isSuccessTailInput = false;
                        element.focus();
                        // 숫자가 아닌 글자들은 모두 삭제해준다.
                        element.value = inputStr = inputStr.replace(/[^0-9]/gi, "");
                    }
                }
            } // end inner if
        }
        else {
            // 성공! 정상적인 입력입니다.
            // hide tooltip
            this.tooltipTailMsg = null;
            // this.tooltipTailMsg = this.tooltipHeadAllowed;
            this.isFocusMobileTail = false;
            this.isSuccessTailInput = true;
            // this.hideTooltipTail(2);
            if (null != elementNext) {
                elementNext.focus();
            } // end if
            // wonder.jung
            // 전송될 전화번호 값을 저장함. 
            this.mobileTailEmitted = inputStr;
            // 전화번호 중복 확인 뒤에 부모 객체로 이벤트 발송.
            this.emitEventChange();
        } // end if 
    }; // end method
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], MobileComponent.prototype, "top", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], MobileComponent.prototype, "left", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], MobileComponent.prototype, "topWarning", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], MobileComponent.prototype, "leftWarning", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], MobileComponent.prototype, "emitter", void 0);
    MobileComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'mobile',
            templateUrl: 'mobile.component.html',
            styleUrls: ['mobile.component.css']
        }), 
        __metadata('design:paramtypes', [user_service_1.UserService, my_logger_service_1.MyLoggerService, my_event_watchtower_service_1.MyEventWatchTowerService, my_checker_service_1.MyCheckerService, my_event_service_1.MyEventService])
    ], MobileComponent);
    return MobileComponent;
}());
exports.MobileComponent = MobileComponent; // end class
//# sourceMappingURL=mobile.component.js.map