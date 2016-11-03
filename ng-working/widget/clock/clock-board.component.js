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
var image_service_1 = require('../../util/image.service');
var clock_time_1 = require('./model/clock-time');
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
    }
    ClockBoardComponent.prototype.ngOnInit = function () {
        // Do something
        this.clockTimeBegin = this.getClockTime(this.klassTimeBegin);
        this.clockTimeEnd = this.getClockTime(this.klassTimeEnd);
        this.dcLeftMargin = Math.round(this.clockHeight / 2);
        this.simpleClockHeight = this.clockHeight - 1;
        this.clockDigitalHeight = this.clockHeight;
        var clockDigitalWidth = this.clockWidth - Math.round(this.clockHeight / 2);
        if (0 < this.clockWidth) {
            this.clockDigitalWidthStr = clockDigitalWidth + "px";
        }
        else {
            this.clockDigitalWidthStr = "100%";
        }
    };
    ClockBoardComponent.prototype.getClockTime = function (time_hh_mm) {
        if (null === time_hh_mm || "" === time_hh_mm) {
            return null;
        }
        // 0. 유효한 시간값인지 검사합니다.
        // ex) 07:30, 08:00, 07:40, 08:10, 처럼 10분 단위까지 허용합니다. - 퇴근 시간이후롤 노린 마케팅 목적도 있음.
        // 23:00 ~ 25:00 처럼 순방향 진행은 24시를 넘는 표현도 허용합니다.
        // 23:00 ~ 01:00 는 오류로 처리합니다.
        var res = time_hh_mm.match(/^([0-9]|0[0-9]|1[0-9]|2[0-6]):[0-5]0$/gi);
        if (null === res || !(0 < res.length)) {
            console.log("유효한 시간 값이 아닙니다.", time_hh_mm);
            return null;
        }
        // 1. ex) 16:00 24시간 형태로 인자를 받습니다.
        var time_hh_mm_fragments = time_hh_mm.split(":");
        var hoursStr = time_hh_mm_fragments[0];
        var hours = parseInt(hoursStr);
        var minutesStr = time_hh_mm_fragments[1];
        var minutes = parseInt(minutesStr);
        var totalMinutes = 60 * hours + minutes;
        var hoursForRotate = hours;
        var isAM = true;
        var time_hh_mm_24 = time_hh_mm;
        var time_hh_mm_12 = "\uC624\uC804 " + hoursStr + ":" + minutesStr;
        if (12 <= hoursForRotate) {
            hoursForRotate -= 12;
            var hoursIn12 = "" + hoursForRotate;
            if (hoursForRotate == 0 || hoursForRotate <= 2) {
                // 낮 12시인 경우.
                hoursIn12 = "12";
                time_hh_mm_12 = "\uB0AE " + hoursIn12 + ":" + minutesStr;
            }
            else if (9 <= hoursForRotate) {
                // 밤 시간을 나타냄. 밤은 9시부터...
                if (hoursForRotate < 10) {
                    hoursIn12 = "0" + hoursForRotate;
                }
                time_hh_mm_12 = "\uBC24 " + hoursIn12 + ":" + minutesStr;
            }
            else if (hoursForRotate < 10) {
                hoursIn12 = "0" + hoursForRotate;
                time_hh_mm_12 = "\uC624\uD6C4 " + hoursIn12 + ":" + minutesStr;
            }
            isAM = false;
        }
        var clockTimeObj = new clock_time_1.ClockTime();
        clockTimeObj.time_hh_mm = time_hh_mm;
        clockTimeObj.hours = hours;
        clockTimeObj.minutes = minutes;
        clockTimeObj.totalMinutes = totalMinutes;
        clockTimeObj.hoursForRotate = hoursForRotate;
        clockTimeObj.isAM = isAM;
        clockTimeObj.time_hh_mm_24 = time_hh_mm_24;
        clockTimeObj.time_hh_mm_12 = time_hh_mm_12;
        return clockTimeObj;
    };
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