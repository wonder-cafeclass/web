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
var ClockComponent = (function () {
    function ClockComponent(imageService) {
        this.imageService = imageService;
        this.clockHeight = 80;
    }
    ClockComponent.prototype.ngOnInit = function () {
        // Do something
        this.clock1hr0000Url = this.imageService.get(this.imageService.clock1hr0000Url);
        this.clock1hr0030Url = this.imageService.get(this.imageService.clock1hr0030Url);
        this.clock1hrNoticeAMUrl = this.imageService.get(this.imageService.clock1hrNoticeAMUrl);
        this.clock1hrNoticePMUrl = this.imageService.get(this.imageService.clock1hrNoticePMUrl);
        this.clock2hr0000Url = this.imageService.get(this.imageService.clock2hr0000Url);
        this.clock2hr0030Url = this.imageService.get(this.imageService.clock2hr0030Url);
        this.clock2hrNoticeAMUrl = this.imageService.get(this.imageService.clock2hrNoticeAMUrl);
        this.clock2hrNoticePMUrl = this.imageService.get(this.imageService.clock2hrNoticePMUrl);
        this.clock3hr0000Url = this.imageService.get(this.imageService.clock3hr0000Url);
        this.clock3hr0030Url = this.imageService.get(this.imageService.clock3hr0030Url);
        this.clock3hrNoticeAMUrl = this.imageService.get(this.imageService.clock3hrNoticeAMUrl);
        this.clock3hrNoticePMUrl = this.imageService.get(this.imageService.clock3hrNoticePMUrl);
        this.clockBGUrl = this.imageService.get(this.imageService.clockBGUrl);
        this.show(this.klassTimeBegin, this.klassTimeEnd);
    };
    ClockComponent.prototype.getTimeObj = function (time_hh_mm) {
        if (null === time_hh_mm || "" === time_hh_mm) {
            return null;
        }
        // 0. 유효한 시간값인지 검사합니다.
        // ex) 07:30, 08:00 처럼 30분 단위만 허용합니다.
        // 23:00 ~ 25:00 처럼 순방향 진행은 24시를 넘는 표현도 허용합니다.
        // 23:00 ~ 01:00 는 오류로 처리합니다.
        var res = time_hh_mm.match(/^([0-9]|0[0-9]|1[0-9]|2[0-6]):(0|3)0$/gi);
        if (null === res || !(0 < res.length)) {
            console.log("유효한 시간 값이 아닙니다.", time_hh_mm);
            return null;
        }
        // 1. ex) 16:00 24시간 형태로 인자를 받습니다.
        var time_hh_mm_fragments = time_hh_mm.split(":");
        var hours = parseInt(time_hh_mm_fragments[0]);
        var minutes = parseInt(time_hh_mm_fragments[1]);
        var totalMinutes = 60 * hours + minutes;
        var hoursForRotate = hours;
        var isAM = true;
        if (12 <= hoursForRotate) {
            hoursForRotate -= 12;
            isAM = false;
        }
        var timeObj = {
            time_hh_mm: time_hh_mm,
            hours: hours,
            minutes: minutes,
            totalMinutes: totalMinutes,
            hoursForRotate: hoursForRotate,
            isAM: isAM
        };
        return timeObj;
    };
    ClockComponent.prototype.show = function (timeBegin_hh_mm, timeEnd_hh_mm) {
        var timeBeginObj = this.getTimeObj(timeBegin_hh_mm);
        if (null === timeBeginObj) {
            return;
        }
        var timeEndObj = this.getTimeObj(timeEnd_hh_mm);
        if (null === timeEndObj) {
            return;
        }
        var diffMinutes = timeEndObj.totalMinutes - timeBeginObj.totalMinutes;
        if (0 < (diffMinutes % 60)) {
            console.log("Error / 한시간 단위로 파라미터가 변경되어야 합니다.");
            return;
        }
        var diffHours = (diffMinutes / 60);
        if (!(1 <= diffHours) || !(diffHours <= 3)) {
            console.log("Error / 최소 시간 범위는 1시간, 최대 시간 범위는 3시간입니다. / diffHours : ", diffHours);
            return;
        }
        if (1 === diffHours && 30 === timeBeginObj.minutes) {
            this.clockHoursUrl = this.clock1hr0030Url;
            if (timeBeginObj.isAM) {
                this.clockNoticeUrl = this.clock1hrNoticeAMUrl;
            }
            else {
                this.clockNoticeUrl = this.clock1hrNoticePMUrl;
            }
        }
        else if (1 === diffHours) {
            this.clockHoursUrl = this.clock1hr0000Url;
            if (timeBeginObj.isAM) {
                this.clockNoticeUrl = this.clock1hrNoticeAMUrl;
            }
            else {
                this.clockNoticeUrl = this.clock1hrNoticePMUrl;
            }
        }
        else if (2 === diffHours && 30 === timeBeginObj.minutes) {
            this.clockHoursUrl = this.clock2hr0030Url;
            if (timeBeginObj.isAM) {
                this.clockNoticeUrl = this.clock2hrNoticeAMUrl;
            }
            else {
                this.clockNoticeUrl = this.clock2hrNoticePMUrl;
            }
        }
        else if (2 === diffHours) {
            this.clockHoursUrl = this.clock2hr0000Url;
            if (timeBeginObj.isAM) {
                this.clockNoticeUrl = this.clock2hrNoticeAMUrl;
            }
            else {
                this.clockNoticeUrl = this.clock2hrNoticePMUrl;
            }
        }
        else if (3 === diffHours && 30 === timeBeginObj.minutes) {
            this.clockHoursUrl = this.clock3hr0030Url;
            if (timeBeginObj.isAM) {
                this.clockNoticeUrl = this.clock3hrNoticeAMUrl;
            }
            else {
                this.clockNoticeUrl = this.clock3hrNoticePMUrl;
            }
        }
        else if (3 === diffHours) {
            this.clockHoursUrl = this.clock3hr0000Url;
            if (timeBeginObj.isAM) {
                this.clockNoticeUrl = this.clock3hrNoticeAMUrl;
            }
            else {
                this.clockNoticeUrl = this.clock3hrNoticePMUrl;
            }
        }
        this.rotate = timeBeginObj.hoursForRotate * 30;
        console.log("show / timeBeginObj : ", timeBeginObj);
    };
    ClockComponent.prototype.test = function () {
        // 1 hour
        // this.show("00:00", "01:00");
        // this.show("01:00", "02:00");
        // this.show("02:00", "03:00");
        // this.show("03:00", "04:00");
        // this.show("04:00", "05:00");
        // this.show("05:00", "06:00");
        // this.show("06:00", "07:00");
        // this.show("07:00", "08:00");
        // this.show("08:00", "09:00");
        // this.show("09:00", "10:00");
        // this.show("10:00", "11:00");
        // this.show("11:00", "12:00");
        // this.show("12:00", "13:00");
        // this.show("13:00", "14:00");
        // this.show("14:00", "15:00");
        // this.show("15:00", "16:00");
        // this.show("16:00", "17:00");
        // this.show("17:00", "18:00");
        // this.show("18:00", "19:00");
        // this.show("19:00", "20:00");
        // this.show("20:00", "21:00");
        // this.show("21:00", "22:00");
        // this.show("22:00", "23:00");
        // this.show("23:00", "24:00");
        // this.show("00:30", "01:30");
        // this.show("01:30", "02:30");
        // this.show("02:30", "03:30");
        // this.show("03:30", "04:30");
        // this.show("04:30", "05:30");
        // this.show("05:30", "06:30");
        // this.show("06:30", "07:30");
        // this.show("07:30", "08:30");
        // this.show("08:30", "09:30");
        // this.show("09:30", "10:30");
        // this.show("10:30", "11:30");
        // this.show("11:30", "12:30");
        // this.show("12:30", "13:30");
        // this.show("13:30", "14:30");
        // this.show("14:30", "15:30");
        // this.show("15:30", "16:30");
        // this.show("16:30", "17:30");
        // this.show("17:30", "18:30");
        // this.show("18:30", "19:30");
        // this.show("19:30", "20:30");
        // this.show("20:30", "21:30");
        // this.show("21:30", "22:30");
        // this.show("22:30", "23:30");
        // this.show("23:30", "24:30");
        // 2 hours
        // this.show("00:00", "02:00");
        // this.show("01:00", "03:00");
        // this.show("02:00", "04:00");
        // this.show("03:00", "05:00");
        // this.show("04:00", "06:00");
        // this.show("05:00", "07:00");
        // this.show("06:00", "08:00");
        // this.show("07:00", "09:00");
        // this.show("08:00", "10:00");
        // this.show("09:00", "11:00");
        // this.show("10:00", "12:00");
        // this.show("11:00", "13:00");
        // this.show("12:00", "14:00");
        // this.show("13:00", "15:00");
        // this.show("14:00", "16:00");
        // this.show("15:00", "17:00");
        // this.show("16:00", "18:00");
        // this.show("17:00", "19:00");
        // this.show("18:00", "20:00");
        // this.show("19:00", "21:00");
        // this.show("20:00", "22:00");
        // this.show("21:00", "23:00");
        // this.show("22:00", "24:00");
        // this.show("23:00", "25:00");
        // this.show("00:30", "02:30");
        // this.show("01:30", "03:30");
        // this.show("02:30", "04:30");
        // this.show("03:30", "05:30");
        // this.show("04:30", "06:30");
        // this.show("05:30", "07:30");
        // this.show("06:30", "08:30");
        // this.show("07:30", "09:30");
        // this.show("08:30", "10:30");
        // this.show("09:30", "11:30");
        // this.show("10:30", "12:30");
        // this.show("11:30", "13:30");
        // this.show("12:30", "14:30");
        // this.show("13:30", "15:30");
        // this.show("14:30", "16:30");
        // this.show("15:30", "17:30");
        // this.show("16:30", "18:30");
        // this.show("17:30", "19:30");
        // this.show("18:30", "20:30");
        // this.show("19:30", "21:30");
        // this.show("20:30", "22:30");
        // this.show("21:30", "23:30");
        // this.show("22:30", "24:30");
        // this.show("23:30", "25:30");    
        // 3 hours
        // this.show("00:00", "03:00");
        // this.show("01:00", "04:00");
        // this.show("02:00", "05:00");
        // this.show("03:00", "06:00");
        // this.show("04:00", "07:00");
        // this.show("05:00", "08:00");
        // this.show("06:00", "09:00");
        // this.show("07:00", "10:00");
        // this.show("08:00", "11:00");
        // this.show("09:00", "12:00");
        // this.show("10:00", "13:00");
        // this.show("11:00", "14:00");
        // this.show("12:00", "15:00");
        // this.show("13:00", "16:00");
        // this.show("14:00", "17:00");
        // this.show("15:00", "18:00");
        // this.show("16:00", "19:00");
        // this.show("17:00", "20:00");
        // this.show("18:00", "21:00");
        // this.show("19:00", "22:00");
        // this.show("20:00", "23:00");
        // this.show("21:00", "24:00");
        // this.show("22:00", "25:00");
        // this.show("23:00", "26:00");
        // this.show("00:30", "03:30");
        // this.show("01:30", "04:30");
        // this.show("02:30", "05:30");
        // this.show("03:30", "06:30");
        // this.show("04:30", "07:30");
        // this.show("05:30", "08:30");
        // this.show("06:30", "09:30");
        // this.show("07:30", "10:30");
        // this.show("08:30", "11:30");
        // this.show("09:30", "12:30");
        // this.show("10:30", "13:30");
        // this.show("11:30", "14:30");
        // this.show("12:30", "15:30");
        // this.show("13:30", "16:30");
        // this.show("14:30", "17:30");
        // this.show("15:30", "18:30");
        // this.show("16:30", "19:30");
        // this.show("17:30", "20:30");
        // this.show("18:30", "21:30");
        // this.show("19:30", "22:30");
        // this.show("20:30", "23:30");
        // this.show("21:30", "24:30");
        // this.show("22:30", "25:30");
        // this.show("23:30", "26:30");    
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], ClockComponent.prototype, "klassTimeBegin", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], ClockComponent.prototype, "klassTimeEnd", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], ClockComponent.prototype, "clockHeight", void 0);
    ClockComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'simple-clock',
            templateUrl: 'clock.component.html',
            styleUrls: ['clock.component.css']
        }), 
        __metadata('design:paramtypes', [image_service_1.ImageService])
    ], ClockComponent);
    return ClockComponent;
}());
exports.ClockComponent = ClockComponent;
//# sourceMappingURL=clock.component.js.map