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
var InputsBtnsRowsComponent = (function () {
    // 자신의 자식 객체에서 이벤트를 받는다.
    function InputsBtnsRowsComponent(myEventService) {
        this.myEventService = myEventService;
        this.cageWidth = -1;
        this.isDisabledSave = true;
        // 이벤트를 부모에게 전달
        this.emitter = new core_1.EventEmitter();
    }
    InputsBtnsRowsComponent.prototype.ngOnInit = function () {
        if (0 < this.cageWidth) {
            this.cageWidthStr = this.cageWidth + "px";
        }
        else {
            this.cageWidthStr = "100%";
        }
        // 원본 비교를 위한 copy list 만들기
        this.myEventListCopy = this.getCopyEventList(this.myEventList);
        // 열을 추가할 수 있는 기능을 하는 input group 만들기
        this.myEvenListBtnsForAddingRow = [
            new my_event_1.MyEvent(
            // public eventName:string
            this.myEventService.ON_ADD_ROW, 
            // public title:string
            "추가하기", 
            // public key:string
            "add-row", 
            // public value:string
            "", 
            // public metaObj:any
            null)
        ];
        // Ready Event 발송 
        var myEventReady = new my_event_1.MyEvent(
        // public eventName:string
        this.myEventService.ON_READY, 
        // public title:string
        "inputs-btns-rows", 
        // public key:string
        "inputs-btns-rows", 
        // public value:string
        "", 
        // public metaObj:any
        null);
        this.emitter.emit(myEventReady);
    };
    InputsBtnsRowsComponent.prototype.getCopyEventList = function (myEventList) {
        var copyList = [];
        for (var i = 0; i < myEventList.length; ++i) {
            var myEvent = myEventList[i];
            var myEventCopy = myEvent.copy();
            copyList.push(myEventCopy);
        }
        return copyList;
    };
    InputsBtnsRowsComponent.prototype.isSameEventLists = function (firstList, secondList) {
        if (null == firstList || 0 === firstList.length) {
            return false;
        }
        if (null == secondList || 0 === secondList.length) {
            return false;
        }
        if (firstList.length !== secondList.length) {
            return false;
        }
        for (var i = 0; i < firstList.length; ++i) {
            var firstMyEvent = firstList[i];
            var secondMyEvent = secondList[i];
            var isSame = firstMyEvent.isSame(secondMyEvent);
            if (!isSame) {
                return false;
            }
        }
        return true;
    };
    InputsBtnsRowsComponent.prototype.onChangeFromChild = function (myEvent) {
        if (null == myEvent) {
            return;
        }
        console.log("inputs-btns-rows / onChangeFromChild / myEvent : ", myEvent);
        if (this.myEventService.ON_ADD_ROW === myEvent.eventName) {
            if (null != myEvent.value && "" != myEvent.value) {
                // 열을 추가합니다.
                var newMyEvent = new my_event_1.MyEvent(
                // public eventName:string
                this.myEventService.ON_CHANGE, 
                // public title:string
                "single-input-view", 
                // public key:string
                "single-input-view", 
                // public value:string
                myEvent.value, 
                // public metaObj:any
                null);
                this.myEventList.push(newMyEvent);
            }
        }
        else if (this.myEventService.ON_REMOVE_ROW === myEvent.eventName) {
            // 삭제 관련 유효성 검증을 할 수 없으므로 부모에게 이벤트 전달.
            this.emitter.emit(myEvent);
        }
    };
    InputsBtnsRowsComponent.prototype.getMyEvent = function () {
        return null;
    };
    InputsBtnsRowsComponent.prototype.onClickDismiss = function (event) {
        event.stopPropagation();
        event.preventDefault();
        this.dismiss();
    };
    InputsBtnsRowsComponent.prototype.dismiss = function () {
        console.log("inputs-btns-rows / dismiss");
        var hasChanged = !this.isSameEventLists(this.myEventList, this.myEventListCopy);
        var firstMyEvent = this.myEventList[0];
        // 사용자에게 변경된 사항이 있다면 저장할 것인지 물어봅니다.
        var wannaSave = false;
        if (hasChanged && confirm("변경된 사항이 있습니다. 저장하시겠습니까?")) {
            wannaSave = true;
        }
        var myEventReturn = null;
        if (wannaSave) {
            this.save();
            myEventReturn =
                new my_event_1.MyEvent(
                // public eventName:string
                this.myEventService.ON_SHUTDOWN, 
                // public title:string
                "inputs-btns-rows", 
                // public key:string
                firstMyEvent.key, 
                // public value:string
                "", 
                // public metaObj:any
                this.myEventList);
        }
        else {
            // 저장하지 않습니다. 이전 값으로 돌려놓습니다. - wonder.jung 이전 값으로 돌려놓는 방법은?
            myEventReturn =
                new my_event_1.MyEvent(
                // public eventName:string
                this.myEventService.ON_SHUTDOWN_N_ROLLBACK, 
                // public title:string
                "inputs-btns-rows", 
                // public key:string
                firstMyEvent.key, 
                // public value:string
                "", 
                // public metaObj:any
                this.myEventListCopy);
        }
        this.emitter.emit(myEventReturn);
    };
    InputsBtnsRowsComponent.prototype.onClickSave = function (event) {
        event.stopPropagation();
        event.preventDefault();
        this.save();
    };
    InputsBtnsRowsComponent.prototype.save = function () {
        if (this.isDisabledSave) {
            return;
        }
        if (null == this.myEventList || 0 == this.myEventList.length) {
            return;
        }
        // 1. 리스트를 비교해서 변경내역이 있는지 확인합니다.
        var isSameEventLists = this.isSameEventLists(this.myEventList, this.myEventListCopy);
        var firstMyEvent = this.myEventList[0];
        var myEventReturn = null;
        if (isSameEventLists) {
        }
        else {
            // 1-2. 변경 내역이 있다면, 저장을 진행합니다.
            var myEventReturn_1 = new my_event_1.MyEvent(
            // public eventName:string
            this.myEventService.ON_SAVE, 
            // public title:string
            "inputs-btns-rows", 
            // public key:string
            firstMyEvent.key, 
            // public value:string
            "", 
            // public metaObj:any
            this.myEventList);
        }
        this.emitter.emit(myEventReturn);
        // this.myEventListCopy = this.getCopyEventList(this.myEventList);
        // 부모 컴포넌트에게 MyEvent 객체를 전달, 사용자가 수정 및 입력을 완료했음을 알립니다.
        /*
        */
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Array)
    ], InputsBtnsRowsComponent.prototype, "myEventList", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], InputsBtnsRowsComponent.prototype, "cageWidth", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], InputsBtnsRowsComponent.prototype, "placeholderForNewRow", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], InputsBtnsRowsComponent.prototype, "emitter", void 0);
    InputsBtnsRowsComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'inputs-btns-rows',
            templateUrl: 'inputs-btns-rows.component.html',
            styleUrls: ['inputs-btns-rows.component.css']
        }), 
        __metadata('design:paramtypes', [my_event_service_1.MyEventService])
    ], InputsBtnsRowsComponent);
    return InputsBtnsRowsComponent;
}());
exports.InputsBtnsRowsComponent = InputsBtnsRowsComponent;
//# sourceMappingURL=inputs-btns-rows.component.js.map