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
var my_checker_service_1 = require('../../util/service/my-checker.service');
var my_button_1 = require('../../util/model/my-button');
var InputsBtnsRowsComponent = (function () {
    // 자신의 자식 객체에서 이벤트를 받는다.
    function InputsBtnsRowsComponent(myEventService, myCheckerService) {
        this.myEventService = myEventService;
        this.myCheckerService = myCheckerService;
        this.isDisabledSave = true;
        // 이벤트를 부모에게 전달
        this.emitter = new core_1.EventEmitter();
    }
    InputsBtnsRowsComponent.prototype.ngOnInit = function () {
        if (null == this.myEventList || 0 === this.myEventList.length) {
            console.log("!Error! / inputs-btns-rows / this.myEventList is not valid!");
            return;
        }
        console.log("inputs-btns-rows / key : ", this.key);
        // 원본 비교를 위한 copy list 만들기
        this.myEventListCopy =
            this.myEventService.getCopyEventList(this.myEventList);
        // 열을 추가할 수 있는 기능을 하는 input group 만들기
        var myChecker = this.myCheckerService.getTitleChecker();
        var myEvent = this.myEventList[0];
        this.myAddBtnList = [
            new my_button_1.MyButton("추가하기", this.myEventService.ON_ADD_ROW, myChecker, myEvent)
        ];
        this.myRemovableBtnList = [];
        for (var i = 0; i < this.myEventList.length; ++i) {
            var curMyEvent = this.myEventList[i];
            var myButtonNext = new my_button_1.MyButton("빼기", this.myEventService.ON_REMOVE_ROW, myChecker, curMyEvent);
            this.myRemovableBtnList.push(myButtonNext);
        }
        // Ready Event 발송 
        var myEventReady = this.myEventService.getMyEvent(
        // public eventName:string
        this.myEventService.ON_READY, 
        // public key:string
        this.myEventService.KEY_INPUTS_BTNS_ROWS, 
        // public value:string
        "", 
        // public metaObj:any
        null, 
        // public myChecker:MyChecker
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
        console.log("inputs-btns-rows / onChangeFromChild / myEvent : ", myEvent);
        if (null == myEvent && null != myEvent.value) {
            return;
        }
        if (this.myEventService.ON_CHANGE === myEvent.eventName) {
            // 변수 전파가 즉시 되지 않으므로 동일한 객체라면 직접 업데이트 해줍니다.
            this.myEventList = this.myEventService.setEventValue(myEvent, this.myEventList);
            var hasChanged = this.hasChanged();
            this.isDisabledSave = (hasChanged) ? false : true;
            this.emitter.emit(myEvent);
        }
        else if (this.myEventService.ON_ADD_ROW === myEvent.eventName) {
            // 공백 문자열도 허용합니다.
            this.myEventList.push(myEvent);
            // MyButton 객체를 만들어 열울 추가합니다.
            var myChecker = this.myCheckerService.getTitleChecker();
            var myButtonNew = new my_button_1.MyButton("빼기", this.myEventService.ON_REMOVE_ROW, myChecker, myEvent);
            this.myRemovableBtnList.push(myButtonNew);
            // 저장 관련 작업을 할 수 없으므로 부모에게 이벤트 전달.
            var hasChanged = this.hasChanged();
            this.isDisabledSave = (hasChanged) ? false : true;
            this.emitter.emit(myEvent);
        }
        else if (this.myEventService.ON_REMOVE_ROW === myEvent.eventName) {
            var listLengthPrev = this.myEventList.length;
            // console.log("BEFORE / this.myEventList : ",this.myEventList);
            var myEventListNext = [];
            for (var i = 0; i < this.myEventList.length; ++i) {
                var myEventNext = this.myEventList[i];
                if (myEventNext.isSame(myEvent)) {
                    // 지울 이벤트를 찾았습니다. 리스트에서 제외합니다.
                    continue;
                }
                myEventListNext.push(myEventNext);
            } // end for
            this.myEventList = myEventListNext;
            var myRemovableBtnListNext = [];
            for (var i = 0; i < this.myRemovableBtnList.length; ++i) {
                var myBtnNext = this.myRemovableBtnList[i];
                var myEventNext = myBtnNext.myEvent;
                if (myEventNext.isSame(myEvent)) {
                    // 지울 이벤트를 찾았습니다. 리스트에서 제외합니다.
                    continue;
                }
                myRemovableBtnListNext.push(myBtnNext);
            } // end for
            this.myRemovableBtnList = myRemovableBtnListNext;
            var listLengthAfter = this.myEventList.length;
            // console.log("AFTER / listLengthAfter : ",listLengthAfter);
            if (listLengthPrev === (listLengthAfter + 1)) {
                // 리스트가 1개가 줄어야 부모에게 이벤트를 발송할 있다.
                var hasChanged = this.hasChanged();
                this.isDisabledSave = (hasChanged) ? false : true;
                this.emitter.emit(myEvent);
            }
            else {
                console.log("!Error! / Target Not Found!");
                console.log("listLengthPrev : ", listLengthPrev);
                console.log("listLengthAfter : ", listLengthAfter);
            } // end inner if
        } // end if
    }; // end method
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
        var hasChanged = this.hasChanged();
        var firstMyEvent = this.myEventList[0];
        // 사용자에게 변경된 사항이 있다면 저장할 것인지 물어봅니다.
        var wannaSave = false;
        if (hasChanged && confirm("변경된 사항이 있습니다. 저장하시겠습니까?")) {
            wannaSave = true;
        }
        var myEventReturn = null;
        if (wannaSave) {
            this.save();
            // wonder.jung
            myEventReturn =
                this.myEventService.getMyEvent(
                // public eventName:string
                this.myEventService.ON_SHUTDOWN, 
                // public key:string
                firstMyEvent.key, 
                // public value:string
                "", 
                // public metaObj:any
                this.myEventList, 
                // public myChecker:MyChecker
                null);
        }
        else {
            // 저장하지 않습니다. 이전 값으로 돌려놓습니다.
            myEventReturn =
                this.myEventService.getMyEvent(
                // public eventName:string
                this.myEventService.ON_SHUTDOWN_N_ROLLBACK, 
                // public key:string
                firstMyEvent.key, 
                // public value:string
                "", 
                // public metaObj:any
                this.myEventListCopy, 
                // public myChecker:MyChecker
                null);
        }
        this.emitter.emit(myEventReturn);
    };
    InputsBtnsRowsComponent.prototype.onClickSave = function (event) {
        event.stopPropagation();
        event.preventDefault();
        this.save();
    };
    InputsBtnsRowsComponent.prototype.save = function () {
        console.log("inputs-btns-rows / save / 00 / this.isDisabledSave : ", this.isDisabledSave);
        if (null == this.myEventList || 0 == this.myEventList.length) {
            return;
        }
        // 1. 리스트를 비교해서 변경내역이 있는지 확인합니다.
        var hasChanged = this.hasChanged();
        console.log("inputs-btns-rows / save / 01 / hasChanged : ", hasChanged);
        if (hasChanged) {
            this.isDisabledSave = false;
        }
        else {
            this.isDisabledSave = true;
        }
        if (this.isDisabledSave) {
            return;
        }
        // 저장이 완료됨. Event 데이터를 copy와 원본을 동일하게 덮어쓰기.
        this.overwriteMyEventList();
        console.log("inputs-btns-rows / save / 02 / 저장이 완료됨. Event 데이터를 copy와 원본을 동일하게 덮어쓰기.");
        // 부모 객체에게 전달할 이벤트 객체 만들기.
        // wonder.jung
        var myEventReturn = this.myEventService.getMyEvent(
        // public eventName:string
        this.myEventService.ON_SAVE, 
        // public key:string
        this.key, 
        // public value:string
        "", 
        // public metaObj:any
        "", 
        // public myChecker:MyChecker
        this.myCheckerService.getTitleChecker());
        console.log("inputs-btns-rows / save / 010 / myEventReturn : ", myEventReturn);
        this.emitter.emit(myEventReturn);
    };
    InputsBtnsRowsComponent.prototype.hasChanged = function () {
        var hasChanged = this.myEventService.hasChangedList(this.myEventList, this.myEventListCopy);
        console.log("inputs-btns-rows / hasChanged / this.myEventList : ", this.myEventList);
        console.log("inputs-btns-rows / hasChanged / this.myEventListCopy : ", this.myEventListCopy);
        return hasChanged;
    };
    InputsBtnsRowsComponent.prototype.getChanged = function () {
        var myEventChangedList = this.myEventService.getChangedFromList(this.myEventList, this.myEventListCopy);
        if (null != myEventChangedList &&
            0 != myEventChangedList.length) {
            // 첫번째 Event가 서비스중인 데이터.
            return myEventChangedList[0];
        }
        return null;
    };
    InputsBtnsRowsComponent.prototype.overwriteMyEventList = function () {
        this.myEventListCopy =
            this.myEventService.getCopyEventList(this.myEventList);
        // 원본과 복사본이 동일. '저장'버튼을 비활성화.
        this.isDisabledSave = true;
        console.log("overwriteMyEventList / this.isDisabledSave : ", this.isDisabledSave);
    };
    InputsBtnsRowsComponent.prototype.rollbackMyEventListCopies = function () {
        this.myEventList = this.myEventListCopy;
        this.overwriteMyEventList();
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], InputsBtnsRowsComponent.prototype, "key", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Array)
    ], InputsBtnsRowsComponent.prototype, "myEventList", void 0);
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
        __metadata('design:paramtypes', [my_event_service_1.MyEventService, my_checker_service_1.MyCheckerService])
    ], InputsBtnsRowsComponent);
    return InputsBtnsRowsComponent;
}());
exports.InputsBtnsRowsComponent = InputsBtnsRowsComponent;
//# sourceMappingURL=inputs-btns-rows.component.js.map