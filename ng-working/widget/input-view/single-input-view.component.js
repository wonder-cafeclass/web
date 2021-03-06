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
var my_event_service_1 = require('../../util/service/my-event.service');
var my_event_1 = require('../../util/model/my-event');
var SingleInputViewComponent = (function () {
    // 자신의 자식 객체에서 이벤트를 받는다.
    function SingleInputViewComponent(myEventService) {
        this.myEventService = myEventService;
        this.cageWidth = -1;
        // 이벤트를 부모에게 전달
        this.emitter = new core_1.EventEmitter();
    }
    SingleInputViewComponent.prototype.ngOnInit = function () {
        if (0 < this.cageWidth) {
            this.cageWidthStr = this.cageWidth + "px";
        }
        else {
            this.cageWidthStr = "100%";
        }
        this.myValue = this.myEvent.value;
        if ("removableRow" === this.type) {
            var myEventRemove = this.myEventService.getMyEvent(
            // public eventName:string
            this.myEventService.ON_READY, 
            // public key:string
            this.myEventService.KEY_SMART_EDITOR, 
            // public value:string
            "", 
            // public metaObj:any
            null, 
            // public myChecker:MyChecker
            null);
            this.myEvenListBtns = [myEventRemove];
            this.myEventCallback = this.myEvent.copy();
        }
        // Ready Event 발송 
        var myEventReady = this.myEventService.getMyEvent(
        // public eventName:string
        this.myEventService.ON_READY, 
        // public key:string
        this.myEventService.KEY_SMART_EDITOR, 
        // public value:string
        "", 
        // public metaObj:any
        null, 
        // public myChecker:MyChecker
        null);
        this.emitter.emit(myEventReady);
    };
    SingleInputViewComponent.prototype.onChangeInputText = function (value) {
        console.log("onChangeInputText / value : ", value);
        // 사용자가 내용을 변경한 뒤에 부모에게 내용이 변경되었다고 이벤트 발송.
        var myEventReturn = this.myEventService.getMyEvent(
        // public eventName:string
        this.myEventService.ON_CHANGE, 
        // public key:string
        this.myEventService.KEY_SMART_EDITOR, 
        // public value:string
        value, 
        // public metaObj:any
        null, 
        // public myChecker:MyChecker
        null);
        this.emitter.emit(myEventReturn);
    };
    SingleInputViewComponent.prototype.onChangeFromChild = function (myEvent) {
        console.log("single-input-view / onChangeFromChild / myEvent : ", myEvent);
        if (this.myEventService.ON_REMOVE_ROW === myEvent.eventName) {
            // 열을 지웁니다.
            var myEventTarget = null;
            if (null != myEvent.metaObj) {
                myEventTarget = myEvent.metaObj;
                myEventTarget.eventName = this.myEventService.ON_REMOVE_ROW;
            }
            else {
                myEventTarget = myEvent;
            }
            this.emitter.emit(myEventTarget);
        }
        else if (this.myEventService.ON_CHANGE === myEvent.eventName) {
            this.emitter.emit(myEvent);
        }
    };
    SingleInputViewComponent.prototype.getMyEvent = function () {
        return this.myEvent;
    };
    SingleInputViewComponent.prototype.onChange = function (event, value) {
        event.stopPropagation();
        event.preventDefault();
        console.log("single-input-view / onChange / value : ", value);
        if (null == this.myEvent) {
            return;
        }
        this.myEvent.value = value;
        this.emitter.emit(this.myEvent);
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', my_event_1.MyEvent)
    ], SingleInputViewComponent.prototype, "myEvent", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], SingleInputViewComponent.prototype, "cageWidth", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], SingleInputViewComponent.prototype, "type", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], SingleInputViewComponent.prototype, "emitter", void 0);
    SingleInputViewComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'single-input-view',
            templateUrl: 'single-input-view.component.html',
            styleUrls: ['single-input-view.component.css']
        }), 
        __metadata('design:paramtypes', [my_event_service_1.MyEventService])
    ], SingleInputViewComponent);
    return SingleInputViewComponent;
}());
exports.SingleInputViewComponent = SingleInputViewComponent;
//# sourceMappingURL=single-input-view.component.js.map