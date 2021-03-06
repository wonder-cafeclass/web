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
var my_clock_time_1 = require('../../util/model/my-clock-time');
var my_event_watchtower_service_1 = require('../../util/service/my-event-watchtower.service');
var ClockComponent = (function () {
    function ClockComponent(imageService, watchTower) {
        this.imageService = imageService;
        this.watchTower = watchTower;
        this.clockHeight = 80;
    }
    ClockComponent.prototype.isDebug = function () {
        return this.watchTower.isDebug();
    };
    ClockComponent.prototype.ngOnInit = function () {
        // Do something
        this.clock1hr00m00mUrl = this.imageService.get(this.imageService.clock1hr00m00mUrl);
        this.clock1hr00m30mUrl = this.imageService.get(this.imageService.clock1hr00m30mUrl);
        this.clock1hr30m00mUrl = this.imageService.get(this.imageService.clock1hr30m00mUrl);
        this.clock1hr30m30mUrl = this.imageService.get(this.imageService.clock1hr30m30mUrl);
        this.clock1hrNoticeAMUrl = this.imageService.get(this.imageService.clock1hrNoticeAMUrl);
        this.clock1hrNoticePMUrl = this.imageService.get(this.imageService.clock1hrNoticePMUrl);
        this.clock1hr30mNoticeAMUrl = this.imageService.get(this.imageService.clock1hr30mNoticeAMUrl);
        this.clock1hr30mNoticePMUrl = this.imageService.get(this.imageService.clock1hr30mNoticePMUrl);
        this.clock2hr00m00mUrl = this.imageService.get(this.imageService.clock2hr00m00mUrl);
        this.clock2hr00m30mUrl = this.imageService.get(this.imageService.clock2hr00m30mUrl);
        this.clock2hr30m00mUrl = this.imageService.get(this.imageService.clock2hr30m00mUrl);
        this.clock2hr30m30mUrl = this.imageService.get(this.imageService.clock2hr30m30mUrl);
        this.clock2hrNoticeAMUrl = this.imageService.get(this.imageService.clock2hrNoticeAMUrl);
        this.clock2hrNoticePMUrl = this.imageService.get(this.imageService.clock2hrNoticePMUrl);
        this.clock2hr30mNoticeAMUrl = this.imageService.get(this.imageService.clock2hr30mNoticeAMUrl);
        this.clock2hr30mNoticePMUrl = this.imageService.get(this.imageService.clock2hr30mNoticePMUrl);
        this.clock3hr00m00mUrl = this.imageService.get(this.imageService.clock3hr00m00mUrl);
        this.clock3hr00m30mUrl = this.imageService.get(this.imageService.clock3hr00m30mUrl);
        this.clock3hr30m00mUrl = this.imageService.get(this.imageService.clock3hr30m00mUrl);
        this.clock3hr30m30mUrl = this.imageService.get(this.imageService.clock3hr30m30mUrl);
        this.clock3hrNoticeAMUrl = this.imageService.get(this.imageService.clock3hrNoticeAMUrl);
        this.clock3hrNoticePMUrl = this.imageService.get(this.imageService.clock3hrNoticePMUrl);
        this.clock3hr30mNoticeAMUrl = this.imageService.get(this.imageService.clock3hr30mNoticeAMUrl);
        this.clock3hr30mNoticePMUrl = this.imageService.get(this.imageService.clock3hr30mNoticePMUrl);
        this.clockBGUrl = this.imageService.get(this.imageService.clockBGUrl);
        this.show(this.clockTimeBegin, this.clockTimeEnd);
    };
    ClockComponent.prototype.show = function (clockTimeBegin, clockTimeEnd) {
        if (this.isDebug())
            console.log("klass-detail / updateClockTime / 시작");
        if (this.isDebug())
            console.log("klass-detail / updateClockTime / clockTimeBegin : ", clockTimeBegin);
        if (this.isDebug())
            console.log("klass-detail / updateClockTime / clockTimeEnd : ", clockTimeEnd);
        if (null == clockTimeBegin || !(0 < clockTimeBegin.totalMinutes)) {
            return;
        }
        if (null == clockTimeEnd || !(0 < clockTimeEnd.totalMinutes)) {
            return;
        }
        var diffMinutes = clockTimeEnd.totalMinutes - clockTimeBegin.totalMinutes;
        if (0 < (diffMinutes % 10)) {
            if (this.isDebug())
                console.log("klass-detail / updateClockTime / 중단 / 10분 단위로 파라미터가 변경되어야 합니다.");
            return;
        }
        var diffHours = Math.floor(diffMinutes / 60);
        if (!(1 <= diffHours) || !(diffHours <= 3)) {
            if (this.isDebug())
                console.log("klass-detail / updateClockTime / \uC911\uB2E8 / \uCD5C\uC18C \uC2DC\uAC04 \uBC94\uC704\uB294 1\uC2DC\uAC04, \uCD5C\uB300 \uC2DC\uAC04 \uBC94\uC704\uB294 3\uC2DC\uAC04\uC785\uB2C8\uB2E4. / diffHours : " + diffHours);
            return;
        }
        // 시작 시간으로부터 15분 미만까지는 동일 시간으로 표현합니다.
        if (1 === diffHours) {
            if (60 === diffMinutes) {
                if (0 <= clockTimeBegin.minutes && clockTimeBegin.minutes < 15) {
                    this.clockHoursUrl = this.clock1hr00m00mUrl;
                }
                else if (30 <= clockTimeBegin.minutes && clockTimeBegin.minutes < 45) {
                    this.clockHoursUrl = this.clock1hr00m30mUrl;
                }
            }
            else if (90 === diffMinutes) {
                if (0 <= clockTimeBegin.minutes && clockTimeBegin.minutes < 15) {
                    this.clockHoursUrl = this.clock1hr30m00mUrl;
                }
                else if (30 <= clockTimeBegin.minutes && clockTimeBegin.minutes < 45) {
                    this.clockHoursUrl = this.clock1hr30m30mUrl;
                }
            }
            if (60 === diffMinutes) {
                // 1 hour 00 minutes / ex) 13:30 ~ 14:30
                if (clockTimeBegin.isAM) {
                    this.clockNoticeUrl = this.clock1hrNoticeAMUrl;
                }
                else {
                    this.clockNoticeUrl = this.clock1hrNoticePMUrl;
                }
            }
            else if (90 === diffMinutes) {
                // 1 hour 30 minutes / ex) 13:30 ~ 15:00
                if (clockTimeBegin.isAM) {
                    this.clockNoticeUrl = this.clock1hr30mNoticeAMUrl;
                }
                else {
                    this.clockNoticeUrl = this.clock1hr30mNoticePMUrl;
                }
            }
        }
        else if (2 === diffHours) {
            if (120 === diffMinutes) {
                if (0 <= clockTimeBegin.minutes && clockTimeBegin.minutes < 15) {
                    this.clockHoursUrl = this.clock2hr00m00mUrl;
                }
                else if (30 <= clockTimeBegin.minutes && clockTimeBegin.minutes < 45) {
                    this.clockHoursUrl = this.clock2hr00m30mUrl;
                }
            }
            else if (150 === diffMinutes) {
                if (0 <= clockTimeBegin.minutes && clockTimeBegin.minutes < 15) {
                    this.clockHoursUrl = this.clock2hr30m00mUrl;
                }
                else if (30 <= clockTimeBegin.minutes && clockTimeBegin.minutes < 45) {
                    this.clockHoursUrl = this.clock2hr30m30mUrl;
                }
            }
            if (120 === diffMinutes) {
                // 2 hour 00 minutes / ex) 13:30 ~ 15:30
                if (clockTimeBegin.isAM) {
                    this.clockNoticeUrl = this.clock2hrNoticeAMUrl;
                }
                else {
                    this.clockNoticeUrl = this.clock2hrNoticePMUrl;
                }
            }
            else if (150 === diffMinutes) {
                // 2 hour 30 minutes / ex) 13:30 ~ 16:00
                if (clockTimeBegin.isAM) {
                    this.clockNoticeUrl = this.clock2hr30mNoticeAMUrl;
                }
                else {
                    this.clockNoticeUrl = this.clock2hr30mNoticePMUrl;
                }
            }
        }
        else if (3 === diffHours) {
            if (180 === diffMinutes) {
                if (0 <= clockTimeBegin.minutes && clockTimeBegin.minutes < 15) {
                    this.clockHoursUrl = this.clock3hr00m00mUrl;
                }
                else if (30 <= clockTimeBegin.minutes && clockTimeBegin.minutes < 45) {
                    this.clockHoursUrl = this.clock3hr00m30mUrl;
                }
            }
            else if (210 === diffMinutes) {
                if (0 <= clockTimeBegin.minutes && clockTimeBegin.minutes < 15) {
                    this.clockHoursUrl = this.clock3hr30m00mUrl;
                }
                else if (30 <= clockTimeBegin.minutes && clockTimeBegin.minutes < 45) {
                    this.clockHoursUrl = this.clock3hr30m30mUrl;
                }
            }
            if (180 === diffMinutes) {
                // 3 hour 00 minutes / ex) 13:30 ~ 16:30
                if (clockTimeBegin.isAM) {
                    this.clockNoticeUrl = this.clock3hrNoticeAMUrl;
                }
                else {
                    this.clockNoticeUrl = this.clock3hrNoticePMUrl;
                }
            }
            else if (210 === diffMinutes) {
                // 3 hour 30 minutes / ex) 13:30 ~ 17:00
                if (clockTimeBegin.isAM) {
                    this.clockNoticeUrl = this.clock3hr30mNoticeAMUrl;
                }
                else {
                    this.clockNoticeUrl = this.clock3hr30mNoticePMUrl;
                }
            }
        }
        this.rotate = clockTimeBegin.hoursForRotate * 30;
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
        __metadata('design:type', my_clock_time_1.MyClockTime)
    ], ClockComponent.prototype, "clockTimeBegin", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', my_clock_time_1.MyClockTime)
    ], ClockComponent.prototype, "clockTimeEnd", void 0);
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
        __metadata('design:paramtypes', [image_service_1.ImageService, my_event_watchtower_service_1.MyEventWatchTowerService])
    ], ClockComponent);
    return ClockComponent;
}());
exports.ClockComponent = ClockComponent;
//# sourceMappingURL=clock.component.js.map