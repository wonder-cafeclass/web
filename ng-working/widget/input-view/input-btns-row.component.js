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
var InputBtnsRowComponent = (function () {
    // 자신의 자식 객체에서 이벤트를 받는다.
    function InputBtnsRowComponent(myEventService) {
        this.myEventService = myEventService;
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
        this.innerText = this.inputText;
        // Ready Event 발송 
        var myEventReady = new my_event_1.MyEvent(
        // public eventName:string
        this.myEventService.ON_READY, 
        // public title:string
        "input-btns-row", 
        // public key:string
        "ready", 
        // public value:string
        "", 
        // public metaObj:any
        null);
        this.emitter.emit(myEventReady);
        console.log("input-btns-row / placeholder : ", this.placeholder);
    };
    InputBtnsRowComponent.prototype.onChange = function (value) {
        // wonder.jung / 문자열의 길이 및 유효성 검증을 해야함.
        // input field의 역할이 어떤 것인지 모르므로 부모에게 change 이벤트 및 input field의 값을 전달합니다.
        var myEventCopy = this.myEventKeyEnter.copy();
        myEventCopy.eventName = this.myEventService.ON_CHANGE;
        myEventCopy.value = value;
        console.log("input-btns=row / onChange / myEventCopy : ", myEventCopy);
        this.emitter.emit(myEventCopy);
    };
    InputBtnsRowComponent.prototype.callbackSave = function (value, myEvent) {
        if (null == myEvent) {
            return;
        }
        var myEventCopy = myEvent.copy();
        if (null != value && "" != value) {
            myEventCopy.value = value;
        }
        this.emitter.emit(myEventCopy);
        this.clearInputField();
    };
    InputBtnsRowComponent.prototype.onKeyEnter = function (event, value) {
        event.stopPropagation();
        event.preventDefault();
        this.callbackSave(value, this.myEventKeyEnter);
    };
    InputBtnsRowComponent.prototype.onClick = function (event, value, myEvent) {
        event.stopPropagation();
        event.preventDefault();
        this.callbackSave(value, myEvent);
    };
    InputBtnsRowComponent.prototype.clearInputField = function () {
        this.innerText = "";
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Array)
    ], InputBtnsRowComponent.prototype, "myEventList", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', my_event_1.MyEvent)
    ], InputBtnsRowComponent.prototype, "myEventKeyEnter", void 0);
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
        __metadata('design:paramtypes', [my_event_service_1.MyEventService])
    ], InputBtnsRowComponent);
    return InputBtnsRowComponent;
}());
exports.InputBtnsRowComponent = InputBtnsRowComponent;
//# sourceMappingURL=input-btns-row.component.js.map