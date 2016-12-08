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
var NameComponent = (function () {
    function NameComponent(myLoggerService, myCheckerService, watchTower, myEventService) {
        this.myLoggerService = myLoggerService;
        this.myCheckerService = myCheckerService;
        this.watchTower = watchTower;
        this.myEventService = myEventService;
        // REMOVE ME
        // @Input() top:number=-1;
        // @Input() left:number=-1;
        this.topWarning = 0;
        this.leftWarning = 0;
        this.emitter = new core_1.EventEmitter();
        this.isFocus = false;
        this.isFocusInfo = false;
        this.isWarning = false;
        this.isSuccessInput = false;
        this.tooltipHeadMsg = null;
        this.tooltipHeadNotAllowed = "이름에 문제가 있습니다.";
        this.tooltipHeadRemoved = "한글만 입력 가능해요.";
        this.tooltipHeadRemovedEmpties = "빈칸을 2칸 이상 입력할 수 없습니다.";
        this.tooltipHeadAllowed = "성공! 멋진 이름이네요.";
        this.isShowPopover = false;
        this.redirectUrl = "/class-center";
        this.isAdmin = false;
        this.errorMsgArr = [];
        this.inputStrPrev = "";
    }
    NameComponent.prototype.ngOnInit = function () {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("name / ngOnInit / init");
    };
    NameComponent.prototype.ngAfterViewInit = function () {
        // 자식 뷰가 모두 완료된 이후에 초기화를 진행.
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("name / ngAfterViewInit");
        this.asyncViewPack();
    };
    NameComponent.prototype.asyncViewPack = function () {
        var _this = this;
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("name / asyncViewPack / 시작");
        // 이미 View 기본정보가 들어왔다면 바로 가져온다. 
        if (this.watchTower.getIsViewPackReady()) {
            if (isDebug)
                console.log("name / asyncViewPack / isViewPackReady : ", true);
            this.init();
        } // end if
        // View에 필요한 기본 정보가 비동기로 들어올 경우, 처리.
        this.watchTower.isViewPackReady$.subscribe(function (isViewPackReady) {
            if (isDebug)
                console.log("name / asyncViewPack / subscribe / isViewPackReady : ", isViewPackReady);
            _this.init();
        }); // end subscribe
    };
    NameComponent.prototype.setViewPack = function () {
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
    NameComponent.prototype.setMyChecker = function () {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("name / setMyChecker / 시작");
        if (null == this.myChecker) {
            this.myChecker = this.myCheckerService.getMyChecker("user_name");
            if (isDebug)
                console.log("name / setMyChecker / this.myChecker : ", this.myChecker);
        }
    };
    NameComponent.prototype.init = function () {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("name / init / 시작");
        // 뷰에 필요한 공통 정보를 설정합니다.
        this.setViewPack();
        // checker를 설정합니다.
        this.setMyChecker();
    };
    NameComponent.prototype.isOK = function (input) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("name / isOK / 시작");
        if (null == this.myCheckerService) {
            if (isDebug)
                console.log("name / isOK / 중단 / null == this.myCheckerService");
            return false;
        }
        var isOK = this.myCheckerService.isOK(this.myChecker, input);
        if (isDebug)
            console.log("name / isOK / isOK : ", isOK);
        if (!isOK) {
            var history_1 = this.myCheckerService.getLastHistory();
            if (isDebug)
                console.log("name / isOK / history : ", history_1);
        }
        return isOK;
    };
    NameComponent.prototype.setName = function (name) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("name / setName / 시작");
        if (isDebug)
            console.log("name / setName / name : ", name);
        if (this.isOK(name)) {
            if (isDebug)
                console.log("name / setName / updated!");
            this.inputStrPrev = name;
        }
    };
    // @ Desc : 이메일이 제대로 입력되었는지 확인합니다.
    NameComponent.prototype.hasNotDone = function () {
        return !this.hasDone();
    };
    NameComponent.prototype.hasDone = function () {
        var isOK = this.isOK(this.inputStrPrev);
        if (!isOK) {
            var history_2 = this.myCheckerService.getLastHistory();
            console.log("name / history : ", history_2);
        }
        return isOK;
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
    NameComponent.prototype.onBlur = function (event, elementInput, elementTooltip) {
        event.stopPropagation();
        event.preventDefault();
        if (null == this.myCheckerService) {
            return;
        }
        if (this.isFocus) {
            this.isFocus = false;
        } // end if
        var name = elementInput.value;
        // 입력한 이름을 검사합니다.
        // 패스워드를 검사합니다.
        if (null != name && "" != name) {
            // 1. 사용자가 입력한 이메일 주소를 검사합니다.
            var isOK = this.isOK(name);
            if (!isOK) {
                // 원인을 찾아봅니다.
                var history_3 = this.myCheckerService.getLastHistory();
                console.log("password / onBlur / history : ", history_3);
                if (null != history_3 && null != history_3.key && null != history_3.msg) {
                    // Do something..
                    if ("min" === history_3.key) {
                        // 최소 문자 갯수보다 적은 경우.
                        this.showWarningTooltip(elementInput, elementTooltip, history_3.msg, false);
                        // REMOVE ME            
                        // this.tooltipHeadMsg = history.msg;
                        // this.isSuccessInput = false;
                        return;
                    }
                    else if ("max" === history_3.key) {
                        // 최대 문자 갯수보다 많은 경우.
                        this.showWarningTooltip(elementInput, elementTooltip, history_3.msg, false);
                        // REMOVE ME
                        // this.tooltipHeadMsg = history.msg;
                        // 넘는 문자열은 지웁니다.
                        elementInput.value = name = name.slice(0, history_3.value);
                        this.isSuccessInput = false;
                        return;
                    }
                    else if ("regexExclude" === history_3.key) {
                        // 정규표현식에 포함되지 않는 문자열인 경우.
                        this.showWarningTooltip(elementInput, elementTooltip, history_3.msg, false);
                        // REMOVE ME
                        // this.tooltipHeadMsg = history.msg;
                        var regExpStr = history_3.value + "";
                        var regExpStrNameRange = /[^a-zA-Z가-힣0-9 ]+/g + "";
                        if (regExpStr == regExpStrNameRange) {
                            this.showWarningTooltip(elementInput, elementTooltip, "이름에 사용할 수 없는 문자가 있어요.", false);
                            // REMOVE ME
                            // this.tooltipHeadMsg = "이름에 사용할 수 없는 문자가 있어요.";
                            var matchArr = history_3.matchArr;
                            if (null != matchArr && 0 < matchArr.length) {
                                for (var i = 0; i < matchArr.length; ++i) {
                                    var keywordNotAllowed = matchArr[i];
                                    // 사용할 수 없는 문자들을 지웁니다.
                                    elementInput.value = name = name.replace(keywordNotAllowed, "");
                                } // end for
                            } // end if
                            this.isSuccessInput = false;
                            return;
                        } // end if
                    }
                    else {
                        // 이에 해당되지 않는 예외 실패.
                        this.showWarningTooltip(elementInput, elementTooltip, this.tooltipHeadNotAllowed, false);
                        // REMOVE ME
                        // this.tooltipHeadMsg = this.tooltipHeadNotAllowed;
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
                this.showWarningTooltip(elementInput, elementTooltip, "금칙어는 제외됩니다.", true);
                // REMOVE ME
                // this.tooltipHeadMsg = "금칙어는 제외됩니다.";
                // this.isSuccessInput = false;
                // this.hideTooltip(2);
                elementInput.value = name;
                elementInput.focus();
                // Logger - Spam 행위로 등록.
                this.myLoggerService.logActionDirtyWord(
                // apiKey:string
                this.watchTower.getApiKey(), 
                // dirtyWord:string
                nameBeforeSanitize);
                return;
            }
            else {
                // 성공! 비속어가 포함되지 않았습니다.
                // 이전에 노출한 툴팁을 내립니다.
                this.hideWarningTooptip();
                elementInput.value = name;
                // 부모 객체에게 정상적인 이름을 전달합니다.
                // 부모 객체에게 Ready Event 발송 
                this.emitEventOnChange(
                // eventKey:string
                this.myEventService.KEY_USER_NAME, 
                // value:string
                name);
            } // end if - dirty word
            // 마지막 공백 입력이 있다면 공백을 제거해줍니다.
            var regExpLastEmptySpace = /[\s]+$/gi;
            elementInput.value = name = name.replace(regExpLastEmptySpace, "");
        } // end if - check Name
    }; // end method
    NameComponent.prototype.emitEventOnChange = function (eventKey, value) {
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("name / emitEventOnChange / 시작");
        if (null == eventKey) {
            if (isDebug)
                console.log("name / emitEventOnChange / 중단 / eventKey is not valid!");
            return;
        }
        if (null == value) {
            if (isDebug)
                console.log("name / emitEventOnChange / 중단 / value is not valid!");
            return;
        }
        var myEventOnChange = this.myEventService.getMyEvent(
        // public eventName:string
        this.myEventService.ON_CHANGE, 
        // public key:string
        eventKey, 
        // public value:string
        value, 
        // public metaObj:any
        null, 
        // public myChecker:MyChecker
        this.myChecker);
        this.emitter.emit(myEventOnChange);
        if (isDebug)
            console.log("name / emitEventOnChange / Done!");
    };
    // REFACTOR ME - wonder.jung
    // 1. 너비 계산의 문제가 있음. 문자열이 배정된 이후에 change event를 받아서 중간 위치를 계산해야 함.
    NameComponent.prototype.showWarningTooltip = function (inputElement, tooltipElement, msg, isTimeout) {
        // 너비 계산을 위해서 문자열을 먼저 설정합니다.
        this.tooltipHeadMsg = msg;
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("name / showWarningTooltip / 시작");
        if (isDebug)
            console.log("name / showWarningTooltip / inputElement : ", inputElement);
        if (isDebug)
            console.log("name / showWarningTooltip / inputElement : ", inputElement);
        if (isDebug)
            console.log("name / showWarningTooltip / msg : ", msg);
        if (isDebug)
            console.log("name / showWarningTooltip / isTimeout : ", isTimeout);
        // 툴팁의 위치를 계산해서 툴팁을 이동시킵니다.
        var offsetBoxInput = inputElement.getBoundingClientRect();
        var topInput = offsetBoxInput.top;
        var leftInput = offsetBoxInput.left;
        var widthInput = offsetBoxInput.width;
        var heightInput = offsetBoxInput.height;
        if (isDebug)
            console.log("name / showWarningTooltip / offsetBoxInput : ", offsetBoxInput);
        if (isDebug)
            console.log("name / showWarningTooltip / topInput : ", topInput);
        if (isDebug)
            console.log("name / showWarningTooltip / leftInput : ", leftInput);
        if (isDebug)
            console.log("name / showWarningTooltip / widthInput : ", widthInput);
        if (isDebug)
            console.log("name / showWarningTooltip / heightInput : ", heightInput);
        var offsetBoxTooptip = tooltipElement.getBoundingClientRect();
        var topTooptip = offsetBoxTooptip.top;
        var leftTooptip = offsetBoxTooptip.left;
        var widthTooptip = offsetBoxTooptip.width;
        var heightTooptip = offsetBoxTooptip.height;
        if (isDebug)
            console.log("name / showWarningTooltip / offsetBoxTooptip : ", offsetBoxTooptip);
        if (isDebug)
            console.log("name / showWarningTooltip / topTooptip : ", topTooptip);
        if (isDebug)
            console.log("name / showWarningTooltip / leftTooptip : ", leftTooptip);
        if (isDebug)
            console.log("name / showWarningTooltip / widthTooptip : ", widthTooptip);
        if (isDebug)
            console.log("name / showWarningTooltip / heightTooptip : ", heightTooptip);
        var topBuffer = 5;
        this.topWarning = topInput - (topTooptip + heightInput + heightTooptip + topBuffer);
        this.leftWarning = leftInput - leftTooptip + Math.round((widthInput - widthTooptip) / 2);
        if (isDebug)
            console.log("name / showWarningTooltip / this.topWarning : ", this.topWarning);
        if (isDebug)
            console.log("name / showWarningTooltip / this.leftWarning : ", this.leftWarning);
        // 툴팁의 뷰 설정.
        this.isSuccessInput = false;
        this.isFocus = true;
        this.isWarning = true;
        if (isTimeout) {
            this.hideTooltip(2);
        }
    };
    NameComponent.prototype.hideWarningTooptip = function () {
        this.tooltipHeadMsg = null;
        this.topWarning = 0;
        this.leftWarning = 0;
        this.isWarning = false;
    };
    NameComponent.prototype.onKeyup = function (event, elementInput, elementTooltip) {
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("name / onKeyup / init");
        event.stopPropagation();
        event.preventDefault();
        var inputStr = elementInput.value;
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
            // wonder.jung
            // 예외 문자를 삭제했음을 사용자에게 알려줍니다.
            if (isDebug)
                console.log("name / onKeyup / 예외 문자를 삭제했음을 사용자에게 알려줍니다.");
            this.showWarningTooltip(elementInput, elementTooltip, this.tooltipHeadRemoved, false);
            elementInput.value = this.inputStrPrev = inputStr;
            return;
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
            // wonder.jung
            // 공백 삭제에 대해 사용자에게 메시지로 알려줍니다.
            if (isDebug)
                console.log("name / onKeyup / 공백 삭제에 대해 사용자에게 메시지로 알려줍니다.");
            this.showWarningTooltip(elementInput, elementTooltip, this.tooltipHeadRemovedEmpties, false);
            elementInput.value = this.inputStrPrev = inputStr;
            return;
        }
        // 최대 길이 제한 검사
        var isOK = this.isOK(inputStr);
        if (!isOK) {
            // 원인을 찾아봅니다.
            var history_4 = this.myCheckerService.getLastHistory();
            if (null != history_4 && null != history_4.key && null != history_4.msg) {
                // Do something..
                if ("max" === history_4.key) {
                    // 최대 문자 갯수보다 많은 경우.
                    if (isDebug)
                        console.log("name / onKeyup / 최대 문자 갯수보다 많은 경우.");
                    this.showWarningTooltip(elementInput, elementTooltip, history_4.msg, false);
                    // this.tooltipHeadMsg = history.msg;
                    // this.hideTooltip(2);
                    // 넘는 문자열은 지웁니다.
                    inputStr = inputStr.slice(0, history_4.value);
                    this.isSuccessInput = false;
                    if (isDebug)
                        console.log("name / onKeyup / 최대 문자 갯수보다 많은 경우. / history : ", history_4);
                } // end if
            } // end if
        }
        else {
            // 입력된 문자열에 문제가 없습니다. 경고창을 띄웠다면 내립니다.
            if (isDebug)
                console.log("name / onKeyup / 입력된 문자열에 문제가 없습니다. 경고창을 띄웠다면 내립니다.");
            this.hideWarningTooptip();
            // 부모 객체에게 안전한 이름 문자열을 전달합니다.
            this.emitEventOnChange(
            // eventKey:string
            this.myEventService.KEY_USER_NAME, 
            // value:string
            inputStr);
        } // end if 
        elementInput.value = this.inputStrPrev = inputStr;
    };
    NameComponent.prototype.hideTooltip = function (sec) {
        if (null == sec || !(0 < sec)) {
            sec = 3;
        }
        var _self = this;
        setTimeout(function () {
            // 메시지를 3초 뒤에 화면에서 지웁니다.
            _self.tooltipHeadMsg = null;
            _self.isWarning = false;
        }, 1000 * sec);
    };
    // REMOVE ME
    // hideTooltipNow() :void {
    //   this.tooltipHeadMsg = null;
    // }    
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
        __metadata('design:paramtypes', [my_logger_service_1.MyLoggerService, my_checker_service_1.MyCheckerService, my_event_watchtower_service_1.MyEventWatchTowerService, my_event_service_1.MyEventService])
    ], NameComponent);
    return NameComponent;
}());
exports.NameComponent = NameComponent;
//# sourceMappingURL=name.component.js.map