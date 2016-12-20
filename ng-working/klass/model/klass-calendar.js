"use strict";
var my_is_1 = require('../../util/helper/my-is');
var KlassCalendar = (function () {
    function KlassCalendar() {
        this.weekDaysCnt = 7;
        this.myIs = new my_is_1.HelperMyIs();
        this.dayList = [];
        this.dayTable = [[]];
    }
    KlassCalendar.prototype.getDayList = function () {
        return this.dayList;
    };
    KlassCalendar.prototype.getDayTable = function () {
        return this.dayTable;
    };
    KlassCalendar.prototype.addDay = function (day) {
        // 시간순 1차원 리스트에 추가.
        this.addDayList(day);
        // 캘린더 형식의 2depth 테이블에 추가. 
        this.addDayTable(day);
    };
    KlassCalendar.prototype.addDayList = function (day) {
        if (null == day) {
            return;
        }
        this.dayList.push(day);
    };
    KlassCalendar.prototype.addDayTable = function (day) {
        // 마지막 주에 해당하는 배열을 가져옵니다.
        var lastWeekIdx = (this.dayTable.length - 1);
        var lastWeekDaysList = this.dayTable[lastWeekIdx];
        if (null == lastWeekDaysList) {
            return;
        }
        if (this.weekDaysCnt === lastWeekDaysList.length) {
            // 마지막 주에 모든 날짜들이 채워졌습니다.
            // 새로운 주를 만듭니다.
            this.dayTable.push([]);
            // 새로 만든 마지막 주를 가져옵니다.
            lastWeekIdx = (this.dayTable.length - 1);
            lastWeekDaysList = this.dayTable[lastWeekIdx];
        }
        if (lastWeekDaysList.length < this.weekDaysCnt) {
            lastWeekDaysList.push(day);
        }
        this.dayTable[lastWeekIdx] = lastWeekDaysList;
    };
    KlassCalendar.prototype.isSame = function (target) {
        return this.myIs.isSame(this, target);
    };
    KlassCalendar.prototype.isSharing = function (key, target) {
        return this.myIs.isSharing(key, this, target);
    };
    return KlassCalendar;
}());
exports.KlassCalendar = KlassCalendar;
//# sourceMappingURL=klass-calendar.js.map