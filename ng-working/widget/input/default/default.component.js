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
var default_meta_1 = require('../../../widget/input/default/model/default-meta');
var my_event_watchtower_service_1 = require('../../../util/service/my-event-watchtower.service');
var DefaultComponent = (function () {
    function DefaultComponent(myCheckerService, myEventService, watchTower) {
        this.myCheckerService = myCheckerService;
        this.myEventService = myEventService;
        this.watchTower = watchTower;
        // @ Common Props
        this.emitter = new core_1.EventEmitter();
        this.inputStrPrev = "";
        this.tooltipMsg = null;
        this.isShowTooltip = false;
        this.isFocus = false;
        this.isValid = true;
        this.isDisabled = false;
        // set default meta
        this.meta =
            new default_meta_1.DefaultMeta(
            // public title:string
            "No Title", 
            // public placeholder:string
            "No PlaceHolder", 
            // public eventKey:string
            "", 
            // public checkerKey:string
            "");
    } // end constructor
    DefaultComponent.prototype.ngOnInit = function () {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("default / ngOnInit / init");
    };
    DefaultComponent.prototype.ngAfterViewInit = function () {
        // 자식 뷰가 모두 완료된 이후에 초기화를 진행.
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("default / ngAfterViewInit");
        this.asyncViewPack();
    };
    DefaultComponent.prototype.asyncViewPack = function () {
        var _this = this;
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("default / asyncViewPack / 시작");
        // 이미 View 기본정보가 들어왔다면 바로 가져온다. 
        if (this.watchTower.getIsViewPackReady()) {
            if (isDebug)
                console.log("default / asyncViewPack / isViewPackReady : ", true);
            this.init();
        } // end if
        // View에 필요한 기본 정보가 비동기로 들어올 경우, 처리.
        this.watchTower.isViewPackReady$.subscribe(function (isViewPackReady) {
            if (isDebug)
                console.log("default / asyncViewPack / subscribe / isViewPackReady : ", isViewPackReady);
            _this.init();
        }); // end subscribe
    };
    DefaultComponent.prototype.setViewPack = function () {
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
    DefaultComponent.prototype.setMyChecker = function () {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("default / setMyChecker / 시작");
        if (null == this.myChecker) {
            this.myChecker = this.myCheckerService.getMyChecker(this.meta.checkerKey);
            if (isDebug)
                console.log("default / setMyChecker / this.myChecker : ", this.myChecker);
        }
    };
    DefaultComponent.prototype.init = function () {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("default / init / 시작");
        // 뷰에 필요한 공통 정보를 설정합니다.
        this.setViewPack();
        // checker를 설정합니다.
        this.setMyChecker();
    };
    DefaultComponent.prototype.isNotOK = function (input) {
        return !this.isOK(input);
    };
    DefaultComponent.prototype.isOK = function (input) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("default / isOK / 시작");
        if (null == this.myCheckerService) {
            if (isDebug)
                console.log("default / isOK / 중단 / null == this.myCheckerService");
            return false;
        }
        var isOK = this.myCheckerService.isOK(this.myChecker, input);
        if (isDebug)
            console.log("default / isOK / isOK : ", isOK);
        if (!isOK) {
            var history_1 = this.myCheckerService.getLastHistory();
            if (isDebug)
                console.log("default / isOK / history : ", history_1);
        }
        return isOK;
    };
    DefaultComponent.prototype.setInput = function (input) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("default / setInput / 시작");
        if (isDebug)
            console.log("default / setInput / input : ", input);
        if (this.isOK(input)) {
            if (isDebug)
                console.log("default / setInput / updated!");
            this.ngModelInput = this.inputStrPrev = input;
        }
    };
    DefaultComponent.prototype.initInput = function () {
        this.ngModelInput = "";
        this.inputStrPrev = "";
    };
    DefaultComponent.prototype.getInput = function () {
        return this.ngModelInput;
    };
    // @ Desc : 이메일이 제대로 입력되었는지 확인합니다.
    DefaultComponent.prototype.hasNotDone = function () {
        return !this.hasDone();
    };
    DefaultComponent.prototype.hasDone = function () {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("default / hasDone / 시작");
        var isOK = this.isOK(this.inputStrPrev);
        if (!isOK) {
            var history_2 = this.myCheckerService.getLastHistory();
            if (isDebug)
                console.log("default / hasDone / history : ", history_2);
        }
        return isOK;
    };
    DefaultComponent.prototype.onClick = function (event, element) {
        event.stopPropagation();
        event.preventDefault();
        if (!this.isFocus) {
            this.isFocus = true;
        } // end if
    };
    DefaultComponent.prototype.onFocus = function (event, element) {
        if (!this.isFocus) {
            this.isFocus = true;
        } // end if
    };
    DefaultComponent.prototype.onKeydownTab = function (event) {
        // 탭 이동으로 다른 input 혹은 버튼으로 이동합니다. 
        // 포커싱을 잃습니다.
        this.isFocus = false;
    };
    DefaultComponent.prototype.onBlur = function (event, elementInput) {
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("default / onBlur / 시작");
        event.stopPropagation();
        event.preventDefault();
        if (this.isFocus) {
            this.isFocus = false;
        } // end if
        var inputStr = elementInput.value;
        if (inputStr == this.inputStrPrev) {
            if (isDebug)
                console.log("default / onBlur / 중단 / 동일한 내용이라면 중단합니다.");
            return;
        }
        var isValidInput = this.onCheckInputValid(inputStr);
        if (isDebug)
            console.log("default / onBlur / isValidInput : ", isValidInput);
        if (isValidInput) {
            if (isDebug)
                console.log("default / onBlur / 입력이 문제없습니다.");
            this.hideWarningTooptip();
        }
    }; // end method
    DefaultComponent.prototype.emitEventOnChange = function (value) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("default / emitEventOnChange / 시작");
        if (null == value) {
            if (isDebug)
                console.log("default / emitEventOnChange / 중단 / value is not valid!");
            return;
        }
        var myEventOnChange = this.myEventService.getMyEvent(
        // public eventName:string
        this.myEventService.ON_CHANGE, 
        // public key:string
        this.meta.eventKey, 
        // public value:string
        value, 
        // public metaObj:any
        null, 
        // public myChecker:MyChecker
        this.myChecker);
        this.emitter.emit(myEventOnChange);
        if (isDebug)
            console.log("default / emitEventOnChange / Done!");
    };
    DefaultComponent.prototype.emitEventOnChangeNotValid = function (value, metaObj) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("default / emitEventOnChangeNotValid / 시작");
        if (null == value) {
            if (isDebug)
                console.log("default / emitEventOnChangeNotValid / 중단 / value is not valid!");
            return;
        }
        if (null == metaObj) {
            if (isDebug)
                console.log("default / emitEventOnChangeNotValid / 중단 / metaObj is not valid!");
            return;
        }
        var myEventOnChange = this.myEventService.getMyEvent(
        // public eventName:string
        this.myEventService.ON_CHANGE_NOT_VALID, 
        // public key:string
        this.meta.eventKey, 
        // public value:string
        value, 
        // public metaObj:any
        metaObj, 
        // public myChecker:MyChecker
        this.myChecker);
        this.emitter.emit(myEventOnChange);
        if (isDebug)
            console.log("default / emitEventOnChangeNotValid / Done!");
    };
    // @ Desc : 실패 툴팁을 보여줍니다.
    DefaultComponent.prototype.showTooltipFailWarning = function (msg, isTimeout) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("default / showTooltipFailWarning / init");
        if (isDebug)
            console.log("default / showTooltipFailWarning / msg : ", msg);
        this.isShowTooltip = true;
        this.isFocus = true;
        this.isValid = false;
        this.tooltipMsg = msg;
        if (isDebug)
            console.log("default / showTooltipFailWarning / this.isShowTooltip : ", this.isShowTooltip);
        if (null != isTimeout && isTimeout) {
            if (isDebug)
                console.log("default / showTooltipFailWarning / this.hideTooltipHead(2)");
            this.hideTooltip(2);
        } // end if
    };
    DefaultComponent.prototype.hideWarningTooptip = function () {
        this.tooltipMsg = null;
        this.isValid = true;
        this.isShowTooltip = false;
    };
    DefaultComponent.prototype.hideTooltip = function (sec) {
        if (null == sec || !(0 < sec)) {
            sec = 3;
        }
        var _self = this;
        setTimeout(function () {
            // 메시지를 지정된 시간 뒤에 화면에서 지웁니다.
            _self.hideWarningTooptip();
        }, 1000 * sec);
    };
    // @ Desc : 새로 입력받은 값이 문제가 없는지 확인합니다.
    // 입력받은 모든 값은 문자열입니다.
    DefaultComponent.prototype.onCheckInputValid = function (input) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("default / onCheckInputValid / init");
        if (isDebug)
            console.log("default / onCheckInputValid / input : ", input);
        // 여기서 유저가 설정한 조건이 필요합니다.
        // 비어있는 문자열이라면 검사하지 않습니다.
        if (null == input || "" == input) {
            if (isDebug)
                console.log("default / onCheckInputValid / 중단 / 비어있는 문자열이라면 검사하지 않습니다.");
            return true;
        }
        // 바뀌지 않았다면 검사하지 않습니다.
        if (this.inputStrPrev === input) {
            if (isDebug)
                console.log("default / onCheckInputValid / 중단 / 바뀌지 않았다면 검사하지 않습니다.");
            return true;
        }
        // MyChecker로 검사, 예외 사항에 대한 처리.
        var isNotOK = this.isNotOK(input);
        if (isNotOK) {
            // 원인을 찾아봅니다.
            var history_3 = this.myCheckerService.getLastHistory();
            if (null != history_3 &&
                null != history_3.key &&
                null != history_3.msg) {
                // 문제가 있습니다!
                // 문제 원인 별로 처리해줍니다.
                if ("max" === history_3.key) {
                    // 최대 문자 갯수보다 많은 경우.
                    if (isDebug)
                        console.log("default / onCheckInputValid / 최대 문자 갯수보다 많은 경우.");
                    this.showTooltipFailWarning(history_3.msg, true);
                    // 넘는 문자열은 지웁니다.
                    this.inputStrPrev = input = input.slice(0, history_3.value);
                    this.isValid = false;
                    if (isDebug)
                        console.log("default / onCheckInputValid / 최대 문자 갯수보다 많은 경우. / history : ", history_3);
                }
                else if ("min" === history_3.key) {
                    // 최소 문자 갯수보다 적은 경우.
                    if (isDebug)
                        console.log("default / onCheckInputValid / 최소 문자 갯수보다 적은 경우.");
                    // 사용자의 입력을 기다려야 하므로 해야하는 일이 없습니다.
                    // 예외적으로 true 반환.
                    return true;
                } // end if
                // 모든 예외 사항에 대해 부모 객체에 전달합니다.
                var metaObj = {
                    view: this,
                    history: history_3
                };
                if (isDebug)
                    console.log("default / onCheckInputValid / 모든 예외 사항에 대해 부모 객체에 전달합니다.");
                this.emitEventOnChangeNotValid(
                // value:string
                input, 
                // metaObj
                metaObj);
            }
            else {
                // TODO - 문제는 있으나 원인을 발견하지 못했습니다.
                // 내부에서 처리할 수 없으므로 부모에게 전달, 조치합니다.
                if (isDebug)
                    console.log("default / onCheckInputValid / 문제는 있으나 원인을 발견하지 못했습니다.");
                this.emitEventOnChangeNotValid(
                // value:string
                input, 
                // metaObj
                null);
            } // end if 
            return false;
        }
        else {
            // 정상적인 값입니다. 
            // 부모 객체에 전파합니다.
            if (isDebug)
                console.log("default / onCheckInputValid / 정상적인 값입니다.");
            this.emitEventOnChange(input);
            return true;
        } // end if
    }; // end method
    DefaultComponent.prototype.onKeyup = function (event, elementInput) {
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("default / onKeyup / init");
        event.stopPropagation();
        event.preventDefault();
        var inputStr = elementInput.value;
        if (inputStr == this.inputStrPrev) {
            if (isDebug)
                console.log("default / onKeyup / 중단 / 동일한 내용이라면 중단합니다.");
            return;
        }
        var isValidInput = this.onCheckInputValid(inputStr);
        if (isDebug)
            console.log("default / onKeyup / isValidInput : ", isValidInput);
        if (isValidInput) {
            if (isDebug)
                console.log("default / onKeyup / 입력이 문제없습니다. 저장합니다.");
            this.inputStrPrev = inputStr;
            this.hideWarningTooptip();
        }
        else {
            if (isDebug)
                console.log("default / onKeyup / 입력이 유효하지 않습니다. 이전으로 되돌립니다.");
            this.ngModelInput = this.inputStrPrev;
            if (isDebug)
                console.log("default / onKeyup / 입력이 유효하지 않습니다. 이전으로 되돌립니다. / Done");
        }
    }; // end method - keyup
    DefaultComponent.prototype.getEventKey = function () {
        if (this.meta.hasEventKey()) {
            return this.meta.eventKey;
        }
        return "";
    };
    DefaultComponent.prototype.hasEventKey = function (eventKey) {
        if (null == eventKey || "" === eventKey) {
            return false;
        }
        if (eventKey === this.getEventKey()) {
            return true;
        }
        return false;
    };
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], DefaultComponent.prototype, "emitter", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', default_meta_1.DefaultMeta)
    ], DefaultComponent.prototype, "meta", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], DefaultComponent.prototype, "isDisabled", void 0);
    DefaultComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'widget-input-default',
            templateUrl: 'default.component.html',
            styleUrls: ['default.component.css']
        }), 
        __metadata('design:paramtypes', [my_checker_service_1.MyCheckerService, my_event_service_1.MyEventService, my_event_watchtower_service_1.MyEventWatchTowerService])
    ], DefaultComponent);
    return DefaultComponent;
}());
exports.DefaultComponent = DefaultComponent; // end class
//# sourceMappingURL=default.component.js.map