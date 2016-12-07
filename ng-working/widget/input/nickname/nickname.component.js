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
var my_logger_service_1 = require('../../../util/service/my-logger.service');
var my_checker_service_1 = require('../../../util/service/my-checker.service');
var my_event_service_1 = require('../../../util/service/my-event.service');
var my_event_watchtower_service_1 = require('../../../util/service/my-event-watchtower.service');
var NicknameComponent = (function () {
    function NicknameComponent(myLoggerService, myCheckerService, watchTower, myEventService) {
        this.myLoggerService = myLoggerService;
        this.myCheckerService = myCheckerService;
        this.watchTower = watchTower;
        this.myEventService = myEventService;
        this.top = -1;
        this.left = -1;
        this.topWarning = -1;
        this.leftWarning = -1;
        this.emitter = new core_1.EventEmitter();
        this.isWarning = false;
        this.isSuccessInput = false;
        this.tooltipHeadMsg = null;
        this.tooltipHeadNotAllowed = "닉네임에 문제가 있습니다.";
        this.tooltipHeadAllowed = "성공! 근사한 닉네임이네요.";
        this.tooltipHeadRemoved = "영문, 숫자, 한글이어야 합니다.";
        this.tooltipHeadRemovedEmpties = "빈칸을 2칸 이상 입력할 수 없습니다.";
        this.isFocus = false;
        this.isFocusInfo = false;
        this.isShowPopover = false;
        this.redirectUrl = "/class-center";
        this.isAdmin = false;
        this.errorMsgArr = [];
        this.inputStrPrev = "";
    }
    NicknameComponent.prototype.ngOnInit = function () {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("nickname / ngOnInit / init");
    };
    NicknameComponent.prototype.ngAfterViewInit = function () {
        // 자식 뷰가 모두 완료된 이후에 초기화를 진행.
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("my-info / ngAfterViewInit");
        this.asyncViewPack();
    };
    NicknameComponent.prototype.asyncViewPack = function () {
        var _this = this;
        var isDebug = true;
        // let isDebug:boolean = false;
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
    NicknameComponent.prototype.setViewPack = function () {
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
    NicknameComponent.prototype.setMyChecker = function () {
        if (null == this.myCheckerService) {
            return;
        }
        if (null == this.myChecker) {
            this.myChecker = this.myCheckerService.getMyChecker("user_nickname");
        }
    };
    NicknameComponent.prototype.init = function () {
        // 뷰에 필요한 공통 정보를 설정합니다.
        this.setViewPack();
        this.setMyChecker();
    };
    NicknameComponent.prototype.isOK = function (input) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("nickname / isOK / 시작");
        if (isDebug)
            console.log("nickname / isOK / input : ", input);
        if (null == this.myCheckerService) {
            return false;
        }
        return this.myCheckerService.isOK(this.myChecker, input);
    };
    NicknameComponent.prototype.setNickname = function (nickname) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("nickname / setNickname / 시작");
        if (isDebug)
            console.log("nickname / setNickname / nickname : ", nickname);
        if (this.isOK(nickname)) {
            this.inputStrPrev = nickname;
        }
        else {
            var history_1 = this.myCheckerService.getLastHistory();
            if (isDebug)
                console.log("nickname / setNickname / history : ", history_1);
        }
    };
    // @ Desc : 이메일이 제대로 입력되었는지 확인합니다.
    NicknameComponent.prototype.hasNotDone = function () {
        return !this.hasDone();
    };
    NicknameComponent.prototype.hasDone = function () {
        return this.isOK(this.inputStrPrev);
    };
    // @ Desc : 이메일 입력을 확인해 달라는 표시를 보여줍니다.
    NicknameComponent.prototype.showWarning = function () {
        this.isFocus = true;
        this.isWarning = true;
        this.isSuccessInput = false;
        this.tooltipHeadMsg = this.tooltipHeadNotAllowed;
    };
    NicknameComponent.prototype.onClick = function (event, element) {
        event.stopPropagation();
        event.preventDefault();
        if (!this.isFocus) {
            this.isFocus = true;
        } // end if
    };
    NicknameComponent.prototype.onFocus = function (event, element) {
        event.stopPropagation();
        event.preventDefault();
        if (!this.isFocus) {
            this.isFocus = true;
        } // end if
    };
    NicknameComponent.prototype.onKeydownTab = function (event) {
        // 탭 이동으로 다른 input 혹은 버튼으로 이동합니다. 
        // 포커싱을 잃습니다.
        this.isFocus = false;
    };
    NicknameComponent.prototype.onKeydownTabShift = function (event) {
        // 탭 이동으로 다른 input 혹은 버튼으로 이동합니다. 
        // 포커싱을 잃습니다.
        this.isFocus = false;
    };
    NicknameComponent.prototype.onBlur = function (event, element) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("nickname / onBlur / 시작");
        event.stopPropagation();
        event.preventDefault();
        if (this.isFocus) {
            this.isFocus = false;
        } // end if
        var inputStr = element.value;
        // 입력한 이름을 검사합니다.
        // 패스워드를 검사합니다.
        if (null != inputStr && "" != inputStr) {
            // 1. 사용자가 입력한 이메일 주소를 검사합니다.
            var isOK = this.isOK(inputStr);
            if (!isOK) {
                // 원인을 찾아봅니다.
                var history_2 = this.myCheckerService.getLastHistory();
                if (isDebug)
                    console.log("nickname / onBlur / history : ", history_2);
                if (null != history_2 && null != history_2.key && null != history_2.msg) {
                    // Do something..
                    if ("min" === history_2.key) {
                        // 최소 문자 갯수보다 적은 경우.
                        this.tooltipHeadMsg = history_2.msg;
                        this.isSuccessInput = false;
                        return;
                    }
                    else if ("max" === history_2.key) {
                        // 최대 문자 갯수보다 많은 경우.
                        this.tooltipHeadMsg = history_2.msg;
                        // 넘는 문자열은 지웁니다.
                        element.value = inputStr = inputStr.slice(0, history_2.value);
                        this.isSuccessInput = false;
                        return;
                    }
                    else if ("regexExclude" === history_2.key) {
                        // 정규표현식에 포함되지 않는 문자열인 경우.
                        this.tooltipHeadMsg = history_2.msg;
                        var regExpStr = history_2.value + "";
                        var regExpStrInputStrRange = /[^a-zA-Z가-힣0-9 ]+/g + "";
                        if (regExpStr == regExpStrInputStrRange) {
                            this.tooltipHeadMsg = "이름에 사용할 수 없는 문자가 있어요.";
                            var matchArr = history_2.matchArr;
                            if (null != matchArr && 0 < matchArr.length) {
                                for (var i = 0; i < matchArr.length; ++i) {
                                    var keywordNotAllowed = matchArr[i];
                                    // 사용할 수 없는 문자들을 지웁니다.
                                    element.value = inputStr = inputStr.replace(keywordNotAllowed, "");
                                } // end for
                                this.isSuccessInput = false;
                                return;
                            } // end if
                        } // end if
                    }
                    else {
                        // 이에 해당되지 않는 예외 실패.
                        this.tooltipHeadMsg = this.tooltipHeadNotAllowed;
                        this.isSuccessInput = false;
                        return;
                    } // end if
                } // end if
            } // end if - isOK
            // 비속어, 욕설 검사.
            var inputStrBeforeSanitize = inputStr;
            inputStr = this.myCheckerService.sanitizeDirtyWord(inputStr);
            if (inputStrBeforeSanitize != inputStr) {
                // 비속어, 욕설이 제거되었습니다. 
                // 사용자에게 금칙어임을 알립니다.
                this.tooltipHeadMsg = "금칙어는 제외됩니다.";
                element.value = inputStr;
                this.hideTooltip(2);
                // Logger - Spam 행위로 등록.
                this.myLoggerService.logActionDirtyWord(
                // apiKey:string
                this.watchTower.getApiKey(), 
                // dirtyWord:string
                inputStrBeforeSanitize);
                this.isSuccessInput = false;
                return;
            }
            else {
                this.hideTooltipNow();
                // this.tooltipHeadMsg = this.tooltipHeadAllowed;
                this.isWarning = false;
                this.isSuccessInput = true;
                this.hideTooltip(2);
                // 부모 객체에게 Change Event 발송 
                var myEventOnChange = this.myEventService.getMyEvent(
                // public eventName:string
                this.myEventService.ON_CHANGE, 
                // public key:string
                this.myEventService.KEY_USER_NICKNAME, 
                // public value:string
                inputStr, 
                // public metaObj:any
                null, 
                // public myChecker:MyChecker
                this.myChecker);
                this.emitter.emit(myEventOnChange);
                return;
            } // end if - dirty word
        } // end if - check inputStr    
    };
    NicknameComponent.prototype.onKeyup = function (event, element) {
        event.stopPropagation();
        event.preventDefault();
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("nickname / onKeyup / init");
        var inputStr = element.value;
        if (null == inputStr || "" == inputStr) {
            if (isDebug)
                console.log("nickname / onKeyup / 중단 / inputStr is not valid!");
            return;
        }
        // 바뀌지 않았다면 검사하지 않습니다.
        if (this.inputStrPrev === inputStr) {
            if (isDebug)
                console.log("nickname / onKeyup / 중단 / 바뀌지 않았다면 검사하지 않습니다.");
            return;
        }
        this.inputStrPrev = inputStr;
        var regExpNotAllowed = /[^ㄱ-ㅎ|ㅏ-ㅣ|가-힣a-zA-Z0-9 ]/gi;
        // 한글이 아닌 문자에 대해서 삭제 처리
        var matchArr = inputStr.match(regExpNotAllowed);
        if (null != matchArr && 0 < matchArr.length) {
            for (var i = 0; i < matchArr.length; ++i) {
                var match = matchArr[i];
                if (null == match || "" == match) {
                    continue;
                }
                inputStr = inputStr.replace(match, "");
            } // end for
            // 사용자에게 영문, 숫자, 한글이 아닌 글자에 대해 삭제한 것을 메시지로 노출합니다.
            // wonder.jung
            this.tooltipHeadMsg = this.tooltipHeadRemoved;
            this.hideTooltip(2);
            if (isDebug)
                console.log("nickname / onKeyup / 한글이 아닌 문자에 대해서 삭제 처리 / matchArr : ", matchArr);
        } // end if
        // 2칸 이상 공백에 대해 1칸으로 줄임.
        var regExpEmptySpaces = /[\s]{2,10}/gi;
        var matchArrEmptySpaces = inputStr.match(regExpEmptySpaces);
        if (null != matchArrEmptySpaces && 0 < matchArrEmptySpaces.length) {
            for (var i = 0; i < matchArrEmptySpaces.length; ++i) {
                var match = matchArrEmptySpaces[i];
                if (null == match || "" == match) {
                    continue;
                }
                inputStr = inputStr.replace(match, " ");
            }
            // 공백 삭제에 대해 사용자에게 메시지로 알려줍니다.
            // wonder.jung
            this.tooltipHeadMsg = this.tooltipHeadRemovedEmpties;
            this.hideTooltip(2);
        }
        // 최대 길이 제한 검사
        var isOK = this.isOK(inputStr);
        if (!isOK) {
            // 원인을 찾아봅니다.
            var history_3 = this.myCheckerService.getLastHistory();
            if (null != history_3 && null != history_3.key && null != history_3.msg) {
                // Do something..
                if ("max" === history_3.key) {
                    // 최대 문자 갯수보다 많은 경우.
                    this.tooltipHeadMsg = history_3.msg;
                    this.hideTooltip(2);
                    // 넘는 문자열은 지웁니다.
                    element.value = inputStr = inputStr.slice(0, history_3.value);
                    this.isSuccessInput = false;
                    if (isDebug)
                        console.log("nickname / onKeyup / 최대 문자 갯수보다 많은 경우. / history : ", history_3);
                } // end if
            } // end if
        } // end if
        element.value = this.inputStrPrev = inputStr;
    };
    NicknameComponent.prototype.hideTooltip = function (sec) {
        if (null == sec || !(0 < sec)) {
            sec = 3;
        }
        var _self = this;
        setTimeout(function () {
            // 메시지를 3초 뒤에 화면에서 지웁니다.
            _self.tooltipHeadMsg = null;
        }, 1000 * sec);
    };
    NicknameComponent.prototype.hideTooltipNow = function () {
        this.tooltipHeadMsg = null;
    };
    NicknameComponent.prototype.onMouseOverInfo = function (event) {
        event.stopPropagation();
        event.preventDefault();
        if (!this.isFocusInfo) {
            this.isFocusInfo = true;
        } // end if
    };
    NicknameComponent.prototype.onMouseOutInfo = function (event) {
        event.stopPropagation();
        event.preventDefault();
        if (this.isFocusInfo) {
            this.isFocusInfo = false;
        } // end if
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], NicknameComponent.prototype, "top", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], NicknameComponent.prototype, "left", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], NicknameComponent.prototype, "topWarning", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], NicknameComponent.prototype, "leftWarning", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], NicknameComponent.prototype, "emitter", void 0);
    NicknameComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'nickname',
            templateUrl: 'nickname.component.html',
            styleUrls: ['nickname.component.css']
        }), 
        __metadata('design:paramtypes', [my_logger_service_1.MyLoggerService, my_checker_service_1.MyCheckerService, my_event_watchtower_service_1.MyEventWatchTowerService, my_event_service_1.MyEventService])
    ], NicknameComponent);
    return NicknameComponent;
}());
exports.NicknameComponent = NicknameComponent;
//# sourceMappingURL=nickname.component.js.map