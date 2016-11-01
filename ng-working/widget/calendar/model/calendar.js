"use strict";
var Calendar = (function () {
    function Calendar() {
        this.hasKlass = false;
        this.isExpired = false;
        this.isEnrollment = false; // 강의 참여가 가능한지 알려주는 플래그.
        this.isEnrollmentWeek = false; // 매주마다 강의 참여가 가능한지 알려주는 플래그.
        this.isEnrollment2weeks = false; // 2주마다 강의 참여가 가능한지 알려주는 플래그.
        this.isEnrollment4weeks = false; // 4주마다 강의 참여가 가능한지 알려주는 플래그.
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
        // 월별 이름을 나타내기위한 2번째주 화요일을 나타내는 플래그.
        this.isMonthIndicator = false;
        // View에서 선택되었는지 여부를 나타내는 플래그.
        this.isFocus = false;
    }
    return Calendar;
}());
exports.Calendar = Calendar;
//# sourceMappingURL=calendar.js.map