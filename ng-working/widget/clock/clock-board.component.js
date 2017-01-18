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
var clock_component_1 = require('./clock.component');
var clock_digital_component_1 = require('./clock-digital.component');
var image_service_1 = require('../../util/image.service');
var my_time_1 = require('../../util/helper/my-time');
var my_event_watchtower_service_1 = require('../../util/service/my-event-watchtower.service');
var my_checker_service_1 = require('../../util/service/my-checker.service');
var my_event_service_1 = require('../../util/service/my-event.service');
/*
* @ Desc   : 시간을 나타내주는 원형 시계 컴포넌트, 시작 시간과 종료 시간을 작은 List로 나타내주는 시계 리스트를 담고 있는 컨테이너 컴포넌트입니다.
* @ Author : Wonder Jung
*/
var ClockBoardComponent = (function () {
    function ClockBoardComponent(imageService, myCheckerService, myEventService, watchTower) {
        this.imageService = imageService;
        this.myCheckerService = myCheckerService;
        this.myEventService = myEventService;
        this.watchTower = watchTower;
        // @ Common Props
        this.emitter = new core_1.EventEmitter();
        this.clockHeight = 83;
        this.clockWidth = -1;
        this.simpleClockHeight = 82;
        this.clockDigitalHeight = 83;
        this.eventKey = "";
        this.dcLeftMargin = 40;
        this.myTime = new my_time_1.HelperMyTime();
    } // end method
    ClockBoardComponent.prototype.isDebug = function () {
        return this.watchTower.isDebug();
    };
    ClockBoardComponent.prototype.ngOnInit = function () {
        if (this.isDebug())
            console.log("clock-board / ngOnInit / init");
        this.asyncViewPack();
    }; // end method
    ClockBoardComponent.prototype.asyncViewPack = function () {
        var _this = this;
        if (this.isDebug())
            console.log("clock-board / asyncViewPack / 시작");
        // 이미 View 기본정보가 들어왔다면 바로 가져온다. 
        if (this.watchTower.getIsViewPackReady()) {
            if (this.isDebug())
                console.log("clock-board / asyncViewPack / isViewPackReady : ", true);
            this.init();
        } // end if
        // View에 필요한 기본 정보가 비동기로 들어올 경우, 처리.
        this.watchTower.isViewPackReady$.subscribe(function (isViewPackReady) {
            if (_this.isDebug())
                console.log("clock-board / asyncViewPack / subscribe / isViewPackReady : ", isViewPackReady);
            _this.init();
        }); // end subscribe
    }; // end method  
    ClockBoardComponent.prototype.init = function () {
        if (this.isDebug())
            console.log("clock-board / init / 시작");
        // 부모 객체에게 준비되었다는 이벤트를 보냅니다.
        this.emitEventOnReady();
        this.setClockTimeBeginEnd(this.klassTimeBegin, this.klassTimeEnd);
    }; // end method 
    ClockBoardComponent.prototype.setClockTimeBeginEnd = function (timeBegin, timeEnd) {
        if (this.isDebug())
            console.log("clock-board / setClockTimeBeginEnd / 시작");
        if (this.isDebug())
            console.log("clock-board / setClockTimeBeginEnd / timeBegin : ", timeBegin);
        if (this.isDebug())
            console.log("clock-board / setClockTimeBeginEnd / timeEnd : ", timeEnd);
        if (this.myTime.isNotHHMM(timeBegin)) {
            if (this.isDebug())
                console.log("clock-board / setClockTimeBeginEnd / 중단 / isNotHHMM(timeBegin)");
            return;
        }
        if (this.myTime.isNotHHMM(timeEnd)) {
            if (this.isDebug())
                console.log("clock-board / setClockTimeBeginEnd / 중단 / isNotHHMM(timeEnd)");
            return;
        }
        if (this.isNotSafeTimeRange(timeBegin, timeEnd)) {
            if (this.isDebug())
                console.log("clock-board / setClockTimeBeginEnd / 중단 / this.klassTimeBegin is not valid!");
            return;
        } // end if
        if (null == this.clockComponent) {
            if (this.isDebug())
                console.log("clock-board / setClockTimeBeginEnd / 중단 / this.clockComponent is not valid!");
            return;
        }
        this.klassTimeBegin = timeBegin;
        this.klassTimeEnd = timeEnd;
        this.clockTimeBegin = this.myTime.getClockTime(this.klassTimeBegin);
        this.clockTimeEnd = this.myTime.getClockTime(this.klassTimeEnd);
        this.dcLeftMargin = Math.round(this.clockHeight / 2);
        this.simpleClockHeight = this.clockHeight - 1;
        this.clockDigitalHeight = this.clockHeight;
        var clockDigitalWidth = this.clockWidth - Math.round(this.clockHeight / 2);
        if (0 < this.clockWidth) {
            this.clockDigitalWidthStr = clockDigitalWidth + "px";
        }
        else {
            this.clockDigitalWidthStr = "100%";
        } // end if
        this.clockComponent.show(this.clockTimeBegin, this.clockTimeEnd);
    };
    ClockBoardComponent.prototype.emitEventOnReady = function () {
        if (this.isDebug())
            console.log("clock-board / emitEventOnReady / 시작");
        var myEventOnChange = this.myEventService.getMyEvent(
        // public eventName:string
        this.myEventService.ON_READY, 
        // public key:string
        this.eventKey, 
        // public value:string
        "", 
        // public metaObj:any
        this, 
        // public myChecker:MyChecker
        this.myCheckerService.getFreePassChecker());
        this.emitter.emit(myEventOnChange);
        if (this.isDebug())
            console.log("clock-board / emitEventOnReady / Done!");
    };
    ClockBoardComponent.prototype.isNotSafeTimeRange = function (hhmmBegin, hhmmEnd) {
        return !this.isSafeTimeRange(hhmmBegin, hhmmEnd);
    }; // end method
    ClockBoardComponent.prototype.isSafeTimeRange = function (hhmmBegin, hhmmEnd) {
        if (this.isDebug())
            console.log("clock-board / isSafeTimeRange / 시작");
        if (this.isDebug())
            console.log("clock-board / isSafeTimeRange / hhmmBegin : ", hhmmBegin);
        if (this.isDebug())
            console.log("clock-board / isSafeTimeRange / hhmmEnd : ", hhmmEnd);
        if (this.myTime.isNotHHMM(hhmmBegin)) {
            if (this.isDebug())
                console.log("clock-board / isSafeTimeRange / 중단 / this.myTime.isNotHHMM(hhmmBegin)");
            return false;
        }
        if (this.myTime.isNotHHMM(hhmmEnd)) {
            if (this.isDebug())
                console.log("clock-board / isSafeTimeRange / 중단 / this.myTime.isNotHHMM(hhmmEnd)");
            return false;
        }
        var diffMinutes = this.myTime.getDiffMinutesHHMM(hhmmBegin, hhmmEnd);
        if (this.isDebug())
            console.log("clock-board / isSafeTimeRange / diffMinutes : ", diffMinutes);
        // 최대 표현할 수 있는 시간 범위인지 확인한다.
        // 1hr/1hr 30mins/2hr/2hr 30mins/3hr
        if (!(60 <= diffMinutes && diffMinutes <= 180)) {
            if (this.isDebug())
                console.log("clock-board / isSafeTimeRange / 중단 / 최소,최대시간 범위 밖입니다.");
            return false;
        }
        var clockTimeBegin = this.myTime.getClockTime(hhmmBegin);
        if (null == clockTimeBegin) {
            if (this.isDebug())
                console.log("clock-board / isSafeTimeRange / 중단 / null == clockTimeBegin");
            return false;
        }
        var clockTimeEnd = this.myTime.getClockTime(hhmmEnd);
        if (null == clockTimeEnd) {
            if (this.isDebug())
                console.log("clock-board / isSafeTimeRange / 중단 / null == clockTimeEnd");
            return false;
        }
        return true;
    }; // end method
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], ClockBoardComponent.prototype, "emitter", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], ClockBoardComponent.prototype, "klassTimeBegin", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], ClockBoardComponent.prototype, "klassTimeEnd", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], ClockBoardComponent.prototype, "clockHeight", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], ClockBoardComponent.prototype, "clockWidth", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], ClockBoardComponent.prototype, "simpleClockHeight", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], ClockBoardComponent.prototype, "clockDigitalHeight", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], ClockBoardComponent.prototype, "eventKey", void 0);
    __decorate([
        core_1.ViewChild(clock_component_1.ClockComponent), 
        __metadata('design:type', clock_component_1.ClockComponent)
    ], ClockBoardComponent.prototype, "clockComponent", void 0);
    __decorate([
        core_1.ViewChild(clock_digital_component_1.ClockDigitalComponent), 
        __metadata('design:type', clock_digital_component_1.ClockDigitalComponent)
    ], ClockBoardComponent.prototype, "clockDigitalComponent", void 0);
    ClockBoardComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'clock-board',
            templateUrl: 'clock-board.component.html',
            styleUrls: ['clock-board.component.css']
        }), 
        __metadata('design:paramtypes', [image_service_1.ImageService, my_checker_service_1.MyCheckerService, my_event_service_1.MyEventService, my_event_watchtower_service_1.MyEventWatchTowerService])
    ], ClockBoardComponent);
    return ClockBoardComponent;
}());
exports.ClockBoardComponent = ClockBoardComponent;
//# sourceMappingURL=clock-board.component.js.map