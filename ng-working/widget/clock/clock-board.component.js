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
/*
* @ Desc   : 시간을 나타내주는 원형 시계 컴포넌트, 시작 시간과 종료 시간을 작은 List로 나타내주는 시계 리스트를 담고 있는 컨테이너 컴포넌트입니다.
* @ Author : Wonder Jung
*/
var ClockBoardComponent = (function () {
    function ClockBoardComponent(imageService) {
        this.imageService = imageService;
        this.clockHeight = 83;
        this.clockWidth = -1;
        this.simpleClockHeight = 82;
        this.clockDigitalHeight = 83;
        this.dcLeftMargin = 10;
        this.myTime = new my_time_1.HelperMyTime();
    }
    ClockBoardComponent.prototype.ngOnInit = function () {
        // Do something
        if (this.isNotSafeTimeRange(this.klassTimeBegin, this.klassTimeEnd)) {
            return;
        } // end if
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
    }; // end method
    ClockBoardComponent.prototype.isNotSafeTimeRange = function (hhmmBegin, hhmmEnd) {
        return !this.isSafeTimeRange(hhmmBegin, hhmmEnd);
    }; // end method
    ClockBoardComponent.prototype.isSafeTimeRange = function (hhmmBegin, hhmmEnd) {
        if (this.myTime.isNotHHMM(hhmmBegin)) {
            return false;
        }
        if (this.myTime.isNotHHMM(hhmmEnd)) {
            return false;
        }
        var diffMinutes = this.myTime.getDiffMinutesHHMM(hhmmBegin, hhmmEnd);
        // 최대 표현할 수 있는 시간 범위인지 확인한다.
        // 1hr/1hr 30mins/2hr/2hr 30mins/3hr
        if (!(60 <= diffMinutes && diffMinutes <= 180)) {
            return false;
        }
        var clockTimeBegin = this.myTime.getClockTime(hhmmBegin);
        if (null == clockTimeBegin) {
            return false;
        }
        var clockTimeEnd = this.myTime.getClockTime(hhmmEnd);
        if (null == clockTimeEnd) {
            return false;
        }
        return true;
    }; // end method
    ClockBoardComponent.prototype.setClockTimeBeginEnd = function (hhmmBegin, hhmmEnd) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("clock-board / setClockTimeBeginEnd / init");
        if (this.isNotSafeTimeRange(hhmmBegin, hhmmEnd)) {
            return;
        }
        var clockTimeBegin = this.myTime.getClockTime(hhmmBegin);
        var clockTimeEnd = this.myTime.getClockTime(hhmmEnd);
        if (isDebug)
            console.log("clock-board / setClockTimeBeginEnd / clockTimeBegin : ", clockTimeBegin);
        if (isDebug)
            console.log("clock-board / setClockTimeBeginEnd / clockTimeEnd : ", clockTimeEnd);
        if (null == clockTimeBegin || null == clockTimeEnd) {
            return;
        }
        this.clockTimeBegin = clockTimeBegin;
        this.clockTimeEnd = clockTimeEnd;
        if (null != this.clockComponent) {
            this.clockComponent.show(this.clockTimeBegin, this.clockTimeEnd);
        }
    }; // end method
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
        __metadata('design:paramtypes', [image_service_1.ImageService])
    ], ClockBoardComponent);
    return ClockBoardComponent;
}());
exports.ClockBoardComponent = ClockBoardComponent;
//# sourceMappingURL=clock-board.component.js.map