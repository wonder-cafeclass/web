"use strict";
var Calendar = (function () {
    function Calendar() {
        this.hasKlass = false;
        this.isExpired = false;
        this.isEnrollment = false;
        this.isFirstDayOfWeek = false;
        this.isLastDayOfWeek = false;
        this.isFirstWeekOfMonth = false;
        this.isLastWeekOfMonth = false;
        this.isFirstDayOfMonth = false;
        this.isLastDayOfMonth = false;
        this.isFirstDay = false;
        this.isLastDay = false;
        this.isFirstWeek = false;
        this.isLastWeek = false;
        // 월별 이름을 나타내기위한 2번째주 화요일을 나타내는 플래그값.
        this.isMonthIndicator = false;
    }
    return Calendar;
}());
exports.Calendar = Calendar;
//# sourceMappingURL=calendar.js.map