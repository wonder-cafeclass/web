"use strict";
var my_is_1 = require('../../../util/helper/my-is');
var my_time_1 = require('../../../util/helper/my-time');
var KlassCalendarDay = (function () {
    function KlassCalendarDay() {
        this.myIs = new my_is_1.HelperMyIs();
        this.myTime = new my_time_1.HelperMyTime();
    }
    KlassCalendarDay.prototype.setFromJSON = function (json) {
        if (null == json) {
            return;
        }
        if (null != json["year"]) {
            this.year = parseInt(json["year"]);
        }
        if (null != json["month"]) {
            this.month = parseInt(json["month"]);
        }
        if (null != json["date"]) {
            this.date = parseInt(json["date"]);
        }
        if (null != json["day"] && "" != json["day"]) {
            this.day = json["day"];
        }
        if (null != json["dayEng"] && "" != json["dayEng"]) {
            this.dayEng = json["dayEng"];
        }
        if (null != json["dayKor"] && "" != json["dayKor"]) {
            this.dayKor = json["dayKor"];
        }
        if (null != json["hasKlass"]) {
            this.hasKlass = json["hasKlass"];
        }
        if (null != json["isEnrollment"]) {
            this.isEnrollment = json["isEnrollment"];
        }
        if (null != json["isEnrollment2weeks"]) {
            this.isEnrollment2weeks = json["isEnrollment2weeks"];
        }
        if (null != json["isEnrollment4weeks"]) {
            this.isEnrollment4weeks = json["isEnrollment4weeks"];
        }
        if (null != json["isEnrollmentWeek"]) {
            this.isEnrollmentWeek = json["isEnrollmentWeek"];
        }
        if (null != json["isExpired"]) {
            this.isExpired = json["isExpired"];
        }
        if (null != json["isFirstDay"]) {
            this.isFirstDay = json["isFirstDay"];
        }
        if (null != json["isFirstDayOfMonth"]) {
            this.isFirstDayOfMonth = json["isFirstDayOfMonth"];
        }
        if (null != json["isFirstDayOfWeek"]) {
            this.isFirstDayOfWeek = json["isFirstDayOfWeek"];
        }
        if (null != json["isFirstWeekOfMonth"]) {
            this.isFirstWeekOfMonth = json["isFirstWeekOfMonth"];
        }
        if (null != json["isLastDay"]) {
            this.isLastDay = json["isLastDay"];
        }
        if (null != json["isLastDayOfMonth"]) {
            this.isLastDayOfMonth = json["isLastDayOfMonth"];
        }
        if (null != json["isLastDayOfWeek"]) {
            this.isLastDayOfWeek = json["isLastDayOfWeek"];
        }
        if (null != json["isLastWeek"]) {
            this.isLastWeek = json["isLastWeek"];
        }
        if (null != json["isLastWeekOfMonth"]) {
            this.isLastWeekOfMonth = json["isLastWeekOfMonth"];
        }
        if (null != json["isMonthIndicator"]) {
            this.isMonthIndicator = json["isMonthIndicator"];
        }
        if (null != json["yyyy_mm_dd_DD"]) {
            this.yyyy_mm_dd_DD = json["yyyy_mm_dd_DD"];
        }
        return this;
    };
    KlassCalendarDay.prototype.getYYYYMMDD = function () {
        var month = this.myTime.getDoubleDigit(this.month);
        var date = this.myTime.getDoubleDigit(this.date);
        return this.year + "-" + month + "-" + date;
    };
    KlassCalendarDay.prototype.isSame = function (target) {
        return this.myIs.isSame(this, target);
    };
    KlassCalendarDay.prototype.isSharing = function (key, target) {
        return this.myIs.isSharing(key, this, target);
    };
    return KlassCalendarDay;
}());
exports.KlassCalendarDay = KlassCalendarDay;
//# sourceMappingURL=klass-calendar-day.js.map