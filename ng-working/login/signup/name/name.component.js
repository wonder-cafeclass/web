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
var NameComponent = (function () {
    function NameComponent(myLoggerService, myEventService) {
        this.myLoggerService = myLoggerService;
        this.myEventService = myEventService;
        this.top = -1;
        this.left = -1;
        this.topWarning = -1;
        this.leftWarning = -1;
        this.myCheckerService = null;
        this.emitter = new core_1.EventEmitter();
        this.isFocus = false;
        this.isFocusInfo = false;
        this.isWarning = false;
        this.isSuccessInput = false;
        this.tooltipHeadMsg = null;
        this.tooltipHeadNotAllowed = "이름에 문제가 있습니다.";
        this.tooltipHeadRemoved = "한글 2~5자까지 입력 가능합니다.";
        this.tooltipHeadRemovedEmpties = "빈칸을 2칸 이상 입력할 수 없습니다.";
        this.tooltipHeadAllowed = "성공! 멋진 이름이네요.";
        this.isShowPopover = false;
        this.inputStrPrev = "";
    }
    NameComponent.prototype.ngOnInit = function () { };
    NameComponent.prototype.setMyChecker = function () {
        if (null == this.myCheckerService) {
            return;
        }
        if (null == this.myChecker) {
            this.myChecker = this.myCheckerService.getMyChecker("user_name");
        }
    };
    NameComponent.prototype.isOK = function (input) {
        if (null == this.myCheckerService) {
            return false;
        }
        return this.myCheckerService.isOK(this.myChecker, input);
    };
    // @ Desc : 이메일이 제대로 입력되었는지 확인합니다.
    NameComponent.prototype.hasNotDone = function () {
        return !this.hasDone();
    };
    NameComponent.prototype.hasDone = function () {
        return this.isOK(this.inputStrPrev);
    };
    // @ Desc : 이메일 입력을 확인해 달라는 표시를 보여줍니다.
    NameComponent.prototype.showWarning = function () {
        this.isFocus = true;
        this.isWarning = true;
        this.isSuccessInput = false;
        this.tooltipHeadMsg = this.tooltipHeadNotAllowed;
    };
    NameComponent.prototype.onClick = function (event, element) {
        event.stopPropagation();
        event.preventDefault();
        if (!this.isFocus) {
            this.isFocus = true;
        } // end if
        // Checker가 없다면, Checker를 가져옵니다.
        this.setMyChecker();
    };
    NameComponent.prototype.onFocus = function (event, element) {
        if (!this.isFocus) {
            this.isFocus = true;
        } // end if
    };
    NameComponent.prototype.onKeydownTab = function (event) {
        // 탭 이동으로 다른 input 혹은 버튼으로 이동합니다. 
        // 포커싱을 잃습니다.
        this.isFocus = false;
    };
    NameComponent.prototype.onBlur = function (event, element) {
        event.stopPropagation();
        event.preventDefault();
        if (null == this.myCheckerService) {
            return;
        }
        if (this.isFocus) {
            this.isFocus = false;
        } // end if
        var name = element.value;
        // 입력한 이름을 검사합니다.
        // 패스워드를 검사합니다.
        if (null != name && "" != name) {
            // 1. 사용자가 입력한 이메일 주소를 검사합니다.
            var isOK = this.isOK(name);
            if (!isOK) {
                // 원인을 찾아봅니다.
                var history_1 = this.myCheckerService.getLastHistory();
                console.log("password / onBlur / history : ", history_1);
                if (null != history_1 && null != history_1.key && null != history_1.msg) {
                    // Do something..
                    if ("min" === history_1.key) {
                        // 최소 문자 갯수보다 적은 경우.
                        this.tooltipHeadMsg = history_1.msg;
                        this.isSuccessInput = false;
                        return;
                    }
                    else if ("max" === history_1.key) {
                        // 최대 문자 갯수보다 많은 경우.
                        this.tooltipHeadMsg = history_1.msg;
                        // 넘는 문자열은 지웁니다.
                        element.value = name = name.slice(0, history_1.value);
                        this.isSuccessInput = false;
                        return;
                    }
                    else if ("regexExclude" === history_1.key) {
                        // 정규표현식에 포함되지 않는 문자열인 경우.
                        this.tooltipHeadMsg = history_1.msg;
                        var regExpStr = history_1.value + "";
                        var regExpStrNameRange = /[^a-zA-Z가-힣0-9 ]+/g + "";
                        if (regExpStr == regExpStrNameRange) {
                            this.tooltipHeadMsg = "이름에 사용할 수 없는 문자가 있어요.";
                            var matchArr = history_1.matchArr;
                            if (null != matchArr && 0 < matchArr.length) {
                                for (var i = 0; i < matchArr.length; ++i) {
                                    var keywordNotAllowed = matchArr[i];
                                    // 사용할 수 없는 문자들을 지웁니다.
                                    element.value = name = name.replace(keywordNotAllowed, "");
                                } // end for
                            } // end if
                            this.isSuccessInput = false;
                            return;
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
            var nameBeforeSanitize = name;
            name = this.myCheckerService.sanitizeDirtyWord(name);
            if (nameBeforeSanitize != name) {
                // 비속어, 욕설이 제거되었습니다. 
                // 사용자에게 금칙어임을 알립니다.
                this.tooltipHeadMsg = "금칙어는 제외됩니다.";
                this.isSuccessInput = false;
                element.value = name;
                this.hideTooltip(2);
                element.focus();
                // Logger - Spam 행위로 등록.
                this.myLoggerService.logActionDirtyWord(nameBeforeSanitize);
                return;
            }
            else {
                // 이전에 노출한 툴팁을 내립니다.
                this.hideTooltipNow();
                // 성공! 비속어가 포함되지 않았습니다.
                // this.tooltipHeadMsg = this.tooltipHeadAllowed;
                this.isWarning = false;
                this.isSuccessInput = true;
                element.value = name;
                this.hideTooltip(2);
                // 부모 객체에게 정상적인 이메일 주소를 전달합니다.
                // 부모 객체에게 Ready Event 발송 
                var myEventOnChange = this.myEventService.getMyEvent(
                // public eventName:string
                this.myEventService.ON_CHANGE, 
                // public key:string
                this.myEventService.KEY_USER_NAME, 
                // public value:string
                name, 
                // public metaObj:any
                null, 
                // public myChecker:MyChecker
                this.myChecker);
                this.emitter.emit(myEventOnChange);
            } // end if - dirty word
            // 마지막 공백 입력이 있다면 공백을 제거해줍니다.
            var regExpLastEmptySpace = /[\s]+$/gi;
            element.value = name = name.replace(regExpLastEmptySpace, "");
        } // end if - check Name
    }; // end method
    NameComponent.prototype.onKeyup = function (event, element) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("name / onKeyup / init");
        event.stopPropagation();
        event.preventDefault();
        var inputStr = element.value;
        // 비어있는 문자열이라면 검사하지 않습니다.
        if (null == inputStr || "" == inputStr) {
            if (isDebug)
                console.log("name / onKeyup / 중단 / 비어있는 문자열이라면 검사하지 않습니다.");
            return;
        }
        // 바뀌지 않았다면 검사하지 않습니다.
        if (this.inputStrPrev === inputStr) {
            if (isDebug)
                console.log("name / onKeyup / 중단 / 바뀌지 않았다면 검사하지 않습니다.");
            return;
        }
        // 한글이 아닌 문자에 대해서 삭제 처리
        var regExpNotAllowed = /[^ㄱ-ㅎ|ㅏ-ㅣ|가-힣 ]/gi;
        var matchArr = inputStr.match(regExpNotAllowed);
        if (null != matchArr && 0 < matchArr.length) {
            // 지워야 할 문자를 발견했습니다.
            for (var i = 0; i < matchArr.length; ++i) {
                var match = matchArr[i];
                if (null == match || "" == match) {
                    continue;
                }
                inputStr = inputStr.replace(match, "");
            }
            // 예외 문자를 삭제했음을 사용자에게 알려줍니다.
            // wonder.jung
            this.tooltipHeadMsg = this.tooltipHeadRemoved;
            this.hideTooltip(2);
        }
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
            var history_2 = this.myCheckerService.getLastHistory();
            if (null != history_2 && null != history_2.key && null != history_2.msg) {
                // Do something..
                if ("max" === history_2.key) {
                    // 최대 문자 갯수보다 많은 경우.
                    this.tooltipHeadMsg = history_2.msg;
                    this.hideTooltip(2);
                    // 넘는 문자열은 지웁니다.
                    inputStr = inputStr.slice(0, history_2.value);
                    this.isSuccessInput = false;
                    if (isDebug)
                        console.log("name / onKeyup / 최대 문자 갯수보다 많은 경우. / history : ", history_2);
                } // end if
            } // end if
        } // end if 
        element.value = this.inputStrPrev = inputStr;
    };
    NameComponent.prototype.hideTooltip = function (sec) {
        if (null == sec || !(0 < sec)) {
            sec = 3;
        }
        var _self = this;
        setTimeout(function () {
            // 메시지를 3초 뒤에 화면에서 지웁니다.
            _self.tooltipHeadMsg = null;
        }, 1000 * sec);
    };
    NameComponent.prototype.hideTooltipNow = function () {
        this.tooltipHeadMsg = null;
    };
    NameComponent.prototype.onMouseOverInfo = function (event) {
        event.stopPropagation();
        event.preventDefault();
        if (!this.isFocusInfo) {
            this.isFocusInfo = true;
        } // end if
    };
    NameComponent.prototype.onMouseOutInfo = function (event) {
        event.stopPropagation();
        event.preventDefault();
        if (this.isFocusInfo) {
            this.isFocusInfo = false;
        } // end if
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], NameComponent.prototype, "top", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], NameComponent.prototype, "left", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], NameComponent.prototype, "topWarning", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], NameComponent.prototype, "leftWarning", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', my_checker_service_1.MyCheckerService)
    ], NameComponent.prototype, "myCheckerService", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], NameComponent.prototype, "emitter", void 0);
    NameComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'name',
            templateUrl: 'name.component.html',
            styleUrls: ['name.component.css']
        }), 
        __metadata('design:paramtypes', [my_logger_service_1.MyLoggerService, my_event_service_1.MyEventService])
    ], NameComponent);
    return NameComponent;
}());
exports.NameComponent = NameComponent;
//# sourceMappingURL=name.component.js.map