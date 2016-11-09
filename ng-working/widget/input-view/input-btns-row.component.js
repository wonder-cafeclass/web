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
var my_event_service_1 = require('../../util/my-event.service');
var my_event_1 = require('../../util/model/my-event');
var my_checker_service_1 = require('../../util/service/my-checker.service');
var my_button_1 = require('../../util/model/my-button');
var InputBtnsRowComponent = (function () {
    // 자신의 자식 객체에서 이벤트를 받는다.
    function InputBtnsRowComponent(myEventService, myCheckerService) {
        this.myEventService = myEventService;
        this.myCheckerService = myCheckerService;
        this.cageWidth = -1;
        this.isDisabledSave = true;
        // 이벤트를 부모에게 전달
        this.emitter = new core_1.EventEmitter();
    }
    InputBtnsRowComponent.prototype.ngOnInit = function () {
        if (0 < this.cageWidth) {
            this.cageWidthStr = this.cageWidth + "px";
        }
        else {
            this.cageWidthStr = "100%";
        }
        if (null != this.inputText && "" != this.inputText) {
            this.innerText = this.inputText;
        }
        // Ready Event 발송 
        var myEventReady = this.myEventService.getMyEvent(
        // public eventName:string
        this.myEventService.ON_READY, 
        // public key:string
        this.myEventService.KEY_INPUT_BTNS_ROW, 
        // public value:string
        "", 
        // public metaObj:any
        null, 
        // public myChecker:MyChecker
        null);
        this.emitter.emit(myEventReady);
    };
    InputBtnsRowComponent.prototype.onChange = function (value, inputTextEl) {
        // wonder.jung / 문자열의 길이 및 유효성 검증을 해야함.
        console.log("input-btns-row / onChange / this.myEventKeyEnterCallback : ", this.myEventKeyEnterCallback);
        var myChecker = null;
        var myEventCopy = null;
        if (null != this.myEventKeyEnterCallback) {
            myEventCopy = this.myEventKeyEnterCallback.copy();
            myEventCopy.eventName = this.myEventService.ON_CHANGE;
            myEventCopy.value = value;
            myChecker = myEventCopy.myChecker;
        }
        // input field의 역할이 어떤 것인지 모르므로 부모에게 change 이벤트 및 input field의 값을 전달합니다.
        if (null != myChecker && null != myEventCopy) {
            var isOK = this.myCheckerService.isOK(myChecker, value);
            if (isOK) {
                this.emitter.emit(myEventCopy);
                return;
            }
            var history_1 = this.myCheckerService.getLastHistory();
            // console.log(">>> onChange / history : ",history);
            // 유효한 문자열이 아닙니다.
            // 유저에게 알립니다.
            var msg = myEventCopy.myChecker.msg;
            if (null != msg && "" != msg) {
                alert(msg);
                inputTextEl.focus();
            } // end if
        }
    };
    InputBtnsRowComponent.prototype.callbackSave = function (value, myEventCallback) {
        if (null == myEventCallback) {
            console.log("!Error! / input-btns-row / callbackSave / null == myEventCallback");
            return;
        }
        // 새로 추가하는 경우라면, 새로운 이벤트 객체를 만들어 돌려줍니다.
        var myEventReturn;
        if (this.myEventService.ON_ADD_ROW === myEventCallback.eventName) {
            myEventReturn =
                this.myEventService.getMyEvent(
                // eventName:string
                myEventCallback.eventName, 
                // key:string
                myEventCallback.key, 
                // value:string
                myEventCallback.value, 
                // metaObj:any
                myEventCallback.metaObj, 
                // myChecker:MyChecker
                myEventCallback.myChecker);
            this.clearInputField();
        }
        else {
            myEventReturn = myEventCallback;
        }
        this.emitter.emit(myEventReturn);
    };
    InputBtnsRowComponent.prototype.onKeyEnter = function (event, value) {
        event.stopPropagation();
        event.preventDefault();
        this.callbackSave(value, this.myEventKeyEnterCallback);
    };
    InputBtnsRowComponent.prototype.onClick = function (event, value, myButton) {
        event.stopPropagation();
        event.preventDefault();
        if (null == myButton) {
            console.log("!Error! / input-btns-row / onClick / null == myButton");
            return;
        }
        console.log("input-btns-row / onClick / myButton : ", myButton);
        var myEventCopy = myButton.myEvent.copy();
        myEventCopy.eventName = myButton.eventName;
        if (null != value && "" != value) {
            myEventCopy.value = value;
        }
        else if (null == value || "" == value) {
            myEventCopy.value = "";
        }
        this.callbackSave(value, myEventCopy);
    };
    InputBtnsRowComponent.prototype.clearInputField = function () {
        this.innerText = "";
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Array)
    ], InputBtnsRowComponent.prototype, "myButtonList", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', my_button_1.MyButton)
    ], InputBtnsRowComponent.prototype, "myButton", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', my_event_1.MyEvent)
    ], InputBtnsRowComponent.prototype, "myEventKeyEnterCallback", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], InputBtnsRowComponent.prototype, "cageWidth", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], InputBtnsRowComponent.prototype, "type", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], InputBtnsRowComponent.prototype, "placeholder", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], InputBtnsRowComponent.prototype, "inputText", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], InputBtnsRowComponent.prototype, "emitter", void 0);
    InputBtnsRowComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'input-btns-row',
            templateUrl: 'input-btns-row.component.html',
            styleUrls: ['input-btns-row.component.css']
        }), 
        __metadata('design:paramtypes', [my_event_service_1.MyEventService, my_checker_service_1.MyCheckerService])
    ], InputBtnsRowComponent);
    return InputBtnsRowComponent;
}());
exports.InputBtnsRowComponent = InputBtnsRowComponent;
//# sourceMappingURL=input-btns-row.component.js.map