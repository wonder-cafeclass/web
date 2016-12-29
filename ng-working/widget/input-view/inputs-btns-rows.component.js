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
var my_checker_service_1 = require('../../util/service/my-checker.service');
var my_button_1 = require('../../util/model/my-button');
var my_array_1 = require('../../util/helper/my-array');
var my_event_watchtower_service_1 = require('../../util/service/my-event-watchtower.service');
var InputsBtnsRowsComponent = (function () {
    // 자신의 자식 객체에서 이벤트를 받는다.
    function InputsBtnsRowsComponent(myEventService, watchTower, myCheckerService) {
        this.myEventService = myEventService;
        this.watchTower = watchTower;
        this.myCheckerService = myCheckerService;
        this.hasButton = true;
        this.isShowTitle = false;
        this.maxRowCnt = 3;
        this.isDisabledSave = true;
        // 이벤트를 부모에게 전달
        this.emitter = new core_1.EventEmitter();
        this.myArray = new my_array_1.HelperMyArray();
    }
    InputsBtnsRowsComponent.prototype.ngOnInit = function () {
        this.asyncViewPack();
    };
    InputsBtnsRowsComponent.prototype.isDebug = function () {
        return this.watchTower.isDebug();
    };
    InputsBtnsRowsComponent.prototype.asyncViewPack = function () {
        var _this = this;
        if (this.isDebug())
            console.log("inputs-btns-rows / asyncViewPack / 시작");
        // 이미 View 기본정보가 들어왔다면 바로 가져온다. 
        if (this.watchTower.getIsViewPackReady()) {
            if (this.isDebug())
                console.log("inputs-btns-rows / asyncViewPack / isViewPackReady : ", true);
            this.init();
        } // end if
        // View에 필요한 기본 정보가 비동기로 들어올 경우, 처리.
        this.watchTower.isViewPackReady$.subscribe(function (isViewPackReady) {
            if (_this.isDebug())
                console.log("inputs-btns-rows / asyncViewPack / subscribe / isViewPackReady : ", isViewPackReady);
            _this.init();
        }); // end subscribe
    }; // end method
    InputsBtnsRowsComponent.prototype.init = function () {
        if (this.isDebug())
            console.log("inputs-btns-rows / init / 시작");
        this.emitEventOnReady();
    }; // end method
    InputsBtnsRowsComponent.prototype.emitEventOnReady = function () {
        if (this.isDebug())
            console.log("inputs-btns-rows / emitEventOnReady / 시작");
        var myEvent = this.watchTower.getEventOnReady(
        // eventKey:string, 
        this.eventKey, 
        // component
        this);
        this.emitter.emit(myEvent);
    }; // end method  
    InputsBtnsRowsComponent.prototype.setMyEventList = function (myEventList) {
        if (this.isDebug())
            console.log("inputs-btns-rows / setMyEventList / 시작");
        if (this.myArray.isNotOK(myEventList)) {
            if (this.isDebug())
                console.log("inputs-btns-rows / setMyEventList / 중단 / this.myArray.isNotOK(myEventList)");
            return;
        } // end if
        this.myEventList = myEventList;
        // 원본 비교를 위한 copy list 만들기
        this.myEventListCopy = this.myEventService.getCopyEventList(this.myEventList);
        if (this.isDebug())
            console.log("inputs-btns-rows / setMyEventList / this.myEventList : ", this.myEventList);
        // 열을 추가할 수 있는 기능을 하는 input group 만들기
        var myEvent = this.myEventList[0];
        this.myAddBtnList = [
            new my_button_1.MyButton("추가하기", this.myEventService.ON_ADD_ROW, myEvent.myChecker, myEvent)
        ];
        this.updateMyRemovableBtnList();
    }; // end method
    InputsBtnsRowsComponent.prototype.updateMyRemovableBtnList = function () {
        if (this.isDebug())
            console.log("inputs-btns-rows / updateMyRemovableBtnList / 시작");
        var myRemovableBtnListNext = [];
        for (var i = 0; i < this.myEventList.length; ++i) {
            var curMyEvent = this.myEventList[i];
            var myButtonNext = new my_button_1.MyButton("빼기", this.myEventService.ON_REMOVE_ROW, curMyEvent.myChecker, curMyEvent);
            myRemovableBtnListNext.push(myButtonNext);
        }
        if (this.isDebug())
            console.log("inputs-btns-rows / updateMyRemovableBtnList / myRemovableBtnListNext : ", myRemovableBtnListNext);
        this.myRemovableBtnList = myRemovableBtnListNext;
    }; // end method
    InputsBtnsRowsComponent.prototype.getCopyEventList = function (myEventList) {
        if (this.isDebug())
            console.log("inputs-btns-rows / getCopyEventList / 시작");
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
    InputsBtnsRowsComponent.prototype.getInputTextList = function () {
        var inputTextList = [];
        if (null != this.myEventList && 0 < this.myEventList.length) {
            for (var i = 0; i < this.myEventList.length; ++i) {
                var myEvent = this.myEventList[i];
                if (null != myEvent) {
                    inputTextList.push(myEvent.value);
                } // end if
            } // end for
        } // end if
        return inputTextList;
    };
    InputsBtnsRowsComponent.prototype.onChangeFromChild = function (myEvent) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (this.isDebug())
            console.log("inputs-btns-rows / onChangeFromChild / init");
        if (this.isDebug())
            console.log("inputs-btns-rows / onChangeFromChild / myEvent : ", myEvent);
        if (null == myEvent && null != myEvent.value) {
            return;
        }
        var isOK = this.myCheckerService.isOK(myEvent.myChecker, myEvent.value);
        if (this.isDebug())
            console.log("inputs-btns-rows / onChangeFromChild / isOK : ", isOK);
        if (!isOK) {
            var history_1 = this.myCheckerService.getLastHistory();
            if (this.isDebug())
                console.log("inputs-btns-rows / onChangeFromChild / history : ", history_1);
        }
        if (this.myEventService.ON_CHANGE === myEvent.eventName) {
            // 변수 전파가 즉시 되지 않으므로 동일한 객체라면 직접 업데이트 해줍니다.
            this.myEventList = this.myEventService.setEventValue(myEvent, this.myEventList);
            var hasChanged = this.hasChanged();
            this.isDisabledSave = (hasChanged) ? false : true;
            // 부모 객체에게는 현재 각 이벤트 객체가 가지고 있는 문자열들을 문자배열로 만들어 metaObj로 전달합니다.
            var inputTextList = this.getInputTextList();
            myEvent.metaObj = inputTextList;
            this.emitter.emit(myEvent);
        }
        else if (this.myEventService.ON_ADD_ROW === myEvent.eventName) {
            // 공백 문자열도 허용합니다.
            this.myEventList.push(myEvent);
            // MyButton 객체를 만들어 열울 추가합니다.
            var myButtonNew = new my_button_1.MyButton("빼기", this.myEventService.ON_REMOVE_ROW, myEvent.myChecker, myEvent);
            this.myRemovableBtnList.push(myButtonNew);
            // 부모 객체에게는 현재 각 이벤트 객체가 가지고 있는 문자열들을 문자배열로 만들어 metaObj로 전달합니다.
            var inputTextList = this.getInputTextList();
            myEvent.metaObj = inputTextList;
            // 저장 관련 작업을 할 수 없으므로 부모에게 이벤트 전달.
            var hasChanged = this.hasChanged();
            this.isDisabledSave = (hasChanged) ? false : true;
            this.emitter.emit(myEvent);
        }
        else if (this.myEventService.ON_REMOVE_ROW === myEvent.eventName) {
            var listLengthPrev = this.myEventList.length;
            // console.log("BEFORE / this.myEventList : ",this.myEventList);
            // Update my-event!
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
            // Update my-button!
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
                // 부모 객체에게는 현재 각 이벤트 객체가 가지고 있는 문자열들을 문자배열로 만들어 metaObj로 전달합니다.
                var inputTextList = this.getInputTextList();
                myEvent.metaObj = inputTextList;
                myEvent.parentEventList = this.myEventList;
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
                this.myEventList[0].myChecker);
            myEventReturn.parentEventList = this.myEventList;
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
                this.myEventList[0].myChecker);
            this.rollbackMyEventListCopies();
            myEventReturn.parentEventList = this.myEventList;
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
        this.eventKey, 
        // public value:string
        "", 
        // public metaObj:any
        "", 
        // public myChecker:MyChecker
        this.myEventList[0].myChecker);
        console.log("inputs-btns-rows / save / 010 / myEventReturn : ", myEventReturn);
        // 부모 객체에게는 현재 각 이벤트 객체가 가지고 있는 문자열들을 문자배열로 만들어 metaObj로 전달합니다.
        var inputTextList = this.getInputTextList();
        myEventReturn.metaObj = inputTextList;
        this.emitter.emit(myEventReturn);
    };
    InputsBtnsRowsComponent.prototype.hasChanged = function () {
        var hasChanged = this.myEventService.hasChangedList(this.myEventList, this.myEventListCopy);
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
        // 이벤트 리스트가 바뀌었으므로 버튼 리스트도 바꿔줍니다.
        this.updateMyRemovableBtnList();
    };
    InputsBtnsRowsComponent.prototype.rollbackMyEventListCopies = function () {
        this.myEventList = this.myEventListCopy;
        this.overwriteMyEventList();
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], InputsBtnsRowsComponent.prototype, "eventKey", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], InputsBtnsRowsComponent.prototype, "hasButton", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], InputsBtnsRowsComponent.prototype, "isShowTitle", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], InputsBtnsRowsComponent.prototype, "title", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], InputsBtnsRowsComponent.prototype, "rowType", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], InputsBtnsRowsComponent.prototype, "maxRowCnt", void 0);
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
        __metadata('design:paramtypes', [my_event_service_1.MyEventService, my_event_watchtower_service_1.MyEventWatchTowerService, my_checker_service_1.MyCheckerService])
    ], InputsBtnsRowsComponent);
    return InputsBtnsRowsComponent;
}());
exports.InputsBtnsRowsComponent = InputsBtnsRowsComponent;
//# sourceMappingURL=inputs-btns-rows.component.js.map