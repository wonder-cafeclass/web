"use strict";
var my_clock_time_1 = require('../model/my-clock-time');
/*
*	@ Desc : 시간 관련 함수 모음
*/
var HelperMyTime = (function () {
    function HelperMyTime() {
        /*2012-12-11*/
        this.DATE_TYPE_YYYY_MM_DD = 1;
        /*01:02*/
        this.DATE_TYPE_HH_MM = 2;
        /*01:02*/
        this.DATE_TYPE_MM_SS = 3;
        // TODO /*01:02 --> 01:00 // 01:52 --> 02:00 // 01:00,01:15,01:30,01:45,02:00 으로 반환*/
        this.DATE_TYPE_HH_MM_ROUND = 4;
        /*20121211010203*/
        this.DATE_TYPE_YYYYMMDDHHMMSS = 5;
        /* 2012-12-11 01:02:03 */
        this.DATE_TYPE_YYYY_MM_DD_HH_MM_SS = 6;
        /* 2012년 12월 11일 01:02:03 */
        this.DATE_TYPE_H_YYYY_MM_DD_HH_MM_SS = 7;
        /* 2012년 12월 11일*/
        this.DATE_TYPE_H_YYYY_MM_DD = 8;
        /* 2012년 12월 11일 화요일*/
        this.DATE_TYPE_H_YYYY_MM_DD_K_D = 9;
    }
    HelperMyTime.prototype.getUniqueId = function () {
        return Math.round(window.performance.now() * 100);
    };
    HelperMyTime.prototype.getTimeFormatHHMM = function (target) {
        if (null == target) {
            return "";
        }
        return this.getTimeFormat(target, this.DATE_TYPE_HH_MM);
    };
    HelperMyTime.prototype.getTimeFormat = function (target, timeFormat) {
        if (null == target) {
            return "";
        }
        if (null == timeFormat) {
            return "";
        }
        if (this.DATE_TYPE_HH_MM === timeFormat) {
            var hours = this.getDoubleDigit(target.getHours());
            var minutes = this.getDoubleDigit(target.getMinutes());
            return hours + ":" + minutes;
        }
        return "";
    }; // end method
    HelperMyTime.prototype.getDiffMinutesHHMM = function (headHHMM, tailHHMM) {
        if (null == headHHMM || "" === headHHMM) {
            return -1;
        }
        if (this.isNotHHMM(headHHMM)) {
            return -1;
        }
        if (null == tailHHMM || "" === tailHHMM) {
            return -1;
        }
        if (this.isNotHHMM(tailHHMM)) {
            return -1;
        }
        var headDate = this.getDateFromHHMM(headHHMM);
        if (null == headDate) {
            return -1;
        }
        var tailDate = this.getDateFromHHMM(tailHHMM);
        if (null == tailDate) {
            return -1;
        }
        return this.getDiffMinutes(headDate, tailDate);
    };
    // @ Desc : 지정된 날짜가 오늘을 포함 이전 날짜인지 확인.
    HelperMyTime.prototype.isBeforeTomorrow = function (YYYYMMDD_HHMMSS) {
        if (this.isNotYYYYMMDD_HHMMSS(YYYYMMDD_HHMMSS)) {
            return false;
        }
        var headDate = this.getDateFromYYYYMMDD_HHMMSS(YYYYMMDD_HHMMSS);
        var todayDate = new Date();
        var diffDays = this.getDiffDays(headDate, todayDate);
        return (-1 < diffDays) ? true : false;
    }; // end method
    // @ Desc : 오늘로부터 며칠전인지를 구함. / wonder.jung
    HelperMyTime.prototype.getDaysAgo = function (YYYYMMDD) {
        if (this.isNotYYYYMMDD(YYYYMMDD)) {
            return null;
        }
        var headDate = this.getDateFromYYYYMMDD(YYYYMMDD);
        var todayDate = new Date();
        return this.getDiffDays(headDate, todayDate);
    }; // end method
    HelperMyTime.prototype.getDiffDaysYYYYMMDD_HHMMSS = function (headYYYYMMDD_HHMMSS, tailYYYYMMDD_HHMMSS) {
        if (null == headYYYYMMDD_HHMMSS || "" === headYYYYMMDD_HHMMSS) {
            return -1;
        }
        if (this.isNotYYYYMMDD_HHMMSS(headYYYYMMDD_HHMMSS)) {
            return -1;
        }
        if (null == tailYYYYMMDD_HHMMSS || "" === tailYYYYMMDD_HHMMSS) {
            return -1;
        }
        if (this.isNotYYYYMMDD_HHMMSS(tailYYYYMMDD_HHMMSS)) {
            return -1;
        }
        var headDate = this.getDateFromYYYYMMDD_HHMMSS(headYYYYMMDD_HHMMSS);
        if (null == headDate) {
            return -1;
        }
        var tailDate = this.getDateFromYYYYMMDD_HHMMSS(tailYYYYMMDD_HHMMSS);
        if (null == tailDate) {
            return -1;
        }
        return this.getDiffDays(headDate, tailDate);
    };
    HelperMyTime.prototype.getDiffMinutes = function (head, tail) {
        var minutes = 60 * 1000;
        return Math.floor((tail.getTime() - head.getTime()) / minutes);
    };
    HelperMyTime.prototype.getDiffHours = function (head, tail) {
        var hour = 60 * 60 * 1000;
        return Math.floor((tail.getTime() - head.getTime()) / hour);
    };
    HelperMyTime.prototype.getDiffDays = function (head, tail) {
        var day = 60 * 60 * 1000 * 24;
        return Math.floor((tail.getTime() - head.getTime()) / day);
    };
    HelperMyTime.prototype.addHoursHHMM = function (hhmm, hours) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("my-time / addHoursHHMM / 시작");
        if (isDebug)
            console.log("my-time / addHoursHHMM / hhmm : ", hhmm);
        if (isDebug)
            console.log("my-time / addHoursHHMM / hours : ", hours);
        if (this.isNotHHMM(hhmm)) {
            if (isDebug)
                console.log("my-time / addHoursHHMM / 중단 / hhmm is not valid!");
            return "";
        }
        var dateFromHHMM = this.getDateFromHHMM(hhmm);
        if (null == dateFromHHMM) {
            if (isDebug)
                console.log("my-time / addHoursHHMM / 중단 / dateFromHHMM is not valid!");
            return "";
        }
        if (isDebug)
            console.log("my-time / addHoursHHMM / dateFromHHMM : ", dateFromHHMM);
        var dateAfterHours = this.addHoursToDate(dateFromHHMM, hours);
        if (null == dateAfterHours) {
            if (isDebug)
                console.log("my-time / addHoursHHMM / 중단 / dateAfterHours is not valid!");
            return "";
        }
        if (isDebug)
            console.log("my-time / addHoursHHMM / dateAfterHours : ", dateAfterHours);
        var hhmmAfterHours = this.getTimeFormatHHMM(dateAfterHours);
        if (null == hhmmAfterHours) {
            if (isDebug)
                console.log("my-time / addHoursHHMM / 중단 / hhmmAfterHours is not valid!");
            return "";
        }
        if (isDebug)
            console.log("my-time / addHoursHHMM / hhmmAfterHours : ", hhmmAfterHours);
        return hhmmAfterHours;
    }; // end method
    HelperMyTime.prototype.addMinutesHHMM = function (hhmm, minutes) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("my-time / addMinutesHHMM / 시작");
        if (isDebug)
            console.log("my-time / addMinutesHHMM / hhmm : ", hhmm);
        if (isDebug)
            console.log("my-time / addMinutesHHMM / minutes : ", minutes);
        if (this.isNotHHMM(hhmm)) {
            if (isDebug)
                console.log("my-time / addMinutesHHMM / 중단 / hhmm is not valid!");
            return "";
        }
        var dateFromHHMM = this.getDateFromHHMM(hhmm);
        if (null == dateFromHHMM) {
            if (isDebug)
                console.log("my-time / addMinutesHHMM / 중단 / dateFromHHMM is not valid!");
            return "";
        }
        if (isDebug)
            console.log("my-time / addMinutesHHMM / dateFromHHMM : ", dateFromHHMM);
        var dateAfterMinutes = this.addMinutesToDate(dateFromHHMM, minutes);
        if (null == dateAfterMinutes) {
            if (isDebug)
                console.log("my-time / addMinutesHHMM / 중단 / dateAfterMinutes is not valid!");
            return "";
        }
        if (isDebug)
            console.log("my-time / addMinutesHHMM / dateAfterMinutes : ", dateAfterMinutes);
        var hhmmAfterMinutes = this.getTimeFormatHHMM(dateAfterMinutes);
        if (null == hhmmAfterMinutes) {
            if (isDebug)
                console.log("my-time / addMinutesHHMM / 중단 / hhmmAfterMinutes is not valid!");
            return "";
        }
        if (isDebug)
            console.log("my-time / addMinutesHHMM / hhmmAfterMinutes : ", hhmmAfterMinutes);
        return hhmmAfterMinutes;
    }; // end method
    HelperMyTime.prototype.addWeeksToDate = function (target, weeks) {
        if (null == target) {
            return target;
        }
        if (null == weeks) {
            return target;
        }
        var days = weeks * 7;
        return this.addDaysToDate(target, days);
    };
    HelperMyTime.prototype.addDaysToDate = function (target, days) {
        if (null == target) {
            return target;
        }
        if (null == days) {
            return target;
        }
        var hours = days * 24;
        return this.addHoursToDate(target, hours);
    };
    HelperMyTime.prototype.addHoursToDate = function (target, hours) {
        if (null == target) {
            return target;
        }
        if (null == hours) {
            return target;
        }
        var minutes = hours * 60;
        return this.addMinutesToDate(target, minutes);
    };
    HelperMyTime.prototype.addMinutesToDate = function (target, minutes) {
        if (null == target) {
            return target;
        }
        if (null == minutes) {
            return target;
        }
        return new Date(target.getTime() + (minutes * 60 * 1000));
    };
    HelperMyTime.prototype.getHoursFromHHMM = function (date_str) {
        var date = this.getDateFromHHMM(date_str);
        if (null == date) {
            return -1;
        }
        return date.getHours();
    };
    HelperMyTime.prototype.getDateFromHHMM = function (date_str) {
        if (null == date_str || "" == date_str) {
            return null;
        }
        return this.getDate(date_str, this.DATE_TYPE_HH_MM);
    };
    HelperMyTime.prototype.getDateFromYYYYMMDD_HHMMSS = function (date_str) {
        if (null == date_str || "" == date_str) {
            return null;
        }
        return this.getDate(date_str, this.DATE_TYPE_YYYY_MM_DD_HH_MM_SS);
    };
    HelperMyTime.prototype.getDateFromYYYYMMDD = function (date_str) {
        if (null == date_str || "" == date_str) {
            return null;
        }
        return this.getDate(date_str, this.DATE_TYPE_YYYY_MM_DD);
    };
    HelperMyTime.prototype.getNow_YYYY_MM_DD_HH_MM_SS = function () {
        return this.getNow(this.DATE_TYPE_YYYY_MM_DD_HH_MM_SS);
    };
    HelperMyTime.prototype.getNow_H_YYYY_MM_DD_HH_MM_SS = function () {
        return this.getNow(this.DATE_TYPE_H_YYYY_MM_DD_HH_MM_SS);
    };
    HelperMyTime.prototype.getNow = function (input_date_format_type) {
        if (null == input_date_format_type) {
            return null;
        }
        var now = new Date();
        return this.getDateFommattedStr(now, input_date_format_type);
    };
    HelperMyTime.prototype.convert = function (date_str, input_date_format_type, output_date_format_type) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("my-time / convert / 시작");
        var dateInput = null;
        if (this.DATE_TYPE_YYYY_MM_DD_HH_MM_SS === input_date_format_type) {
            dateInput = this.getDate(date_str, this.DATE_TYPE_YYYY_MM_DD_HH_MM_SS);
        }
        else if (this.DATE_TYPE_YYYY_MM_DD === input_date_format_type) {
            dateInput = this.getDate(date_str, this.DATE_TYPE_YYYY_MM_DD);
        } // end if // wonder.jung
        if (null == dateInput) {
            return "";
        }
        if (this.DATE_TYPE_H_YYYY_MM_DD_HH_MM_SS === output_date_format_type) {
            return this.getDateFommattedStr(dateInput, this.DATE_TYPE_H_YYYY_MM_DD_HH_MM_SS);
        }
        else if (this.DATE_TYPE_H_YYYY_MM_DD === output_date_format_type) {
            return this.getDateFommattedStr(dateInput, this.DATE_TYPE_H_YYYY_MM_DD);
        }
        else if (this.DATE_TYPE_H_YYYY_MM_DD_K_D === output_date_format_type) {
            return this.getDateFommattedStr(dateInput, this.DATE_TYPE_H_YYYY_MM_DD_K_D);
        }
        return "";
    };
    HelperMyTime.prototype.getDateFommattedStr = function (date, input_date_format_type) {
        if (this.DATE_TYPE_YYYY_MM_DD_HH_MM_SS === input_date_format_type) {
            var year = date.getFullYear();
            var month = this.getDoubleDigit(date.getMonth() + 1);
            var days = this.getDoubleDigit(date.getDate());
            var hours = this.getDoubleDigit(date.getHours());
            var minutes = this.getDoubleDigit(date.getMinutes());
            var seconds = this.getDoubleDigit(date.getSeconds());
            // 2012-12-11 01:02:03
            return year + "-" + month + "-" + days + " " + hours + ":" + minutes + ":" + seconds;
        }
        else if (this.DATE_TYPE_H_YYYY_MM_DD_HH_MM_SS === input_date_format_type) {
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var days = date.getDate();
            var hours = this.getDoubleDigit(date.getHours());
            var minutes = this.getDoubleDigit(date.getMinutes());
            var seconds = this.getDoubleDigit(date.getSeconds());
            // 2012년 12월 11일 01:02:03
            return year + "\uB144 " + month + "\uC6D4 " + days + "\uC77C " + hours + ":" + minutes + ":" + seconds;
        }
        else if (this.DATE_TYPE_YYYY_MM_DD === input_date_format_type) {
            var year = date.getFullYear();
            var month = this.getDoubleDigit(date.getMonth() + 1);
            var days = this.getDoubleDigit(date.getDate());
            // 2012년 12월 11일 01:02:03
            return year + "-" + month + "-" + days;
        }
        else if (this.DATE_TYPE_H_YYYY_MM_DD === input_date_format_type) {
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var days = date.getDate();
            // 2012년 12월 11일 01:02:03
            return year + "\uB144 " + month + "\uC6D4 " + days + "\uC77C";
        }
        else if (this.DATE_TYPE_H_YYYY_MM_DD_K_D === input_date_format_type) {
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var days = date.getDate();
            var daysKorean = this.getDayKorean(date.getDay());
            // 2012년 12월 11일 01:02:03
            return year + "\uB144 " + month + "\uC6D4 " + days + "\uC77C " + daysKorean;
        } // end if
        return "";
    };
    HelperMyTime.prototype.getDayKorean = function (dayIdx) {
        if (!(0 <= dayIdx && dayIdx <= 6)) {
            return "";
        }
        if (0 === dayIdx) {
            return "일요일";
        }
        else if (1 === dayIdx) {
            return "월요일";
        }
        else if (2 === dayIdx) {
            return "화요일";
        }
        else if (3 === dayIdx) {
            return "수요일";
        }
        else if (4 === dayIdx) {
            return "목요일";
        }
        else if (5 === dayIdx) {
            return "금요일";
        }
        else if (6 === dayIdx) {
            return "토요일";
        } // end if
        return "";
    };
    HelperMyTime.prototype.getDayIdx = function (day) {
        if (null == day || "" === day) {
            return -1;
        }
        var dayList = [
            "sunday",
            "monday",
            "tuesday",
            "wednesday",
            "thursday",
            "friday",
            "saturday"
        ];
        for (var i = 0; i < dayList.length; ++i) {
            var dayFromList = dayList[i];
            if (-1 < dayFromList.indexOf(day.toLowerCase())) {
                return i;
            }
        }
        return -1;
    };
    /*
    @ Input :
    ["tue","fri"],0,3
    @ Return :
    [
        0:"2017년 2월 7일 화요일"
        1:"2017년 2월 10일 금요일"
        2:"2017년 2월 14일 화요일"
        3:"2017년 2월 17일 금요일"
        4:"2017년 2월 21일 화요일"
        5:"2017년 2월 24일 금요일"
    ]
    */
    HelperMyTime.prototype.getDateListYYYYMMDDKDWidthDayList = function (dayList, weekIdxBegin, weekIdxEnd) {
        var dayIdxList = [];
        for (var i = 0; i < dayList.length; ++i) {
            var day = dayList[i];
            var dayIdx = this.getDayIdx(day);
            dayIdxList.push(dayIdx);
        }
        return this.getDateListWithDayOnFormat(dayIdxList, weekIdxBegin, weekIdxEnd, this.DATE_TYPE_H_YYYY_MM_DD_K_D);
    }; // end method
    HelperMyTime.prototype.getDateListYYYYMMDDWidthDayList = function (dayList, weekIdxBegin, weekIdxEnd) {
        var dayIdxList = [];
        for (var i = 0; i < dayList.length; ++i) {
            var day = dayList[i];
            var dayIdx = this.getDayIdx(day);
            dayIdxList.push(dayIdx);
        }
        return this.getDateListWithDayOnFormat(dayIdxList, weekIdxBegin, weekIdxEnd, this.DATE_TYPE_YYYY_MM_DD);
    }; // end method	
    /*
    @ Input :
    [2,5],0,3
    @ Return :
    [
        0:"2017년 2월 7일 화요일"
        1:"2017년 2월 10일 금요일"
        2:"2017년 2월 14일 화요일"
        3:"2017년 2월 17일 금요일"
        4:"2017년 2월 21일 화요일"
        5:"2017년 2월 24일 금요일"
    ]
    */
    HelperMyTime.prototype.getDateListYYYYMMDDKD = function (dayIdxList, weekIdxBegin, weekIdxEnd) {
        return this.getDateListWithDayOnFormat(dayIdxList, weekIdxBegin, weekIdxEnd, this.DATE_TYPE_H_YYYY_MM_DD_K_D);
    }; // end method
    HelperMyTime.prototype.getDateListWithDayOnFormat = function (dayIdxList, weekIdxBegin, weekIdxEnd, inputDateFormatType) {
        var dateList = this.getDateListWithDayList(dayIdxList, weekIdxBegin, weekIdxEnd);
        var dateStrList = [];
        for (var i = 0; i < dateList.length; ++i) {
            var date = dateList[i];
            var dateStr = this.getDateFommattedStr(date, inputDateFormatType);
            dateStrList.push(dateStr);
        }
        return dateStrList;
    };
    // 원하는 기능 : 요일을 선택하면 사용자가 넣은 범위 안에서 해당 요일의 날짜를 구해준다. 
    HelperMyTime.prototype.getDateListWithDayList = function (
        // 0 ~ 6 : Sunday ~ Saturday
        dayIdxList, 
        // 검색을 시작하는 주의 인덱스. 현재를 기준으로 몇주 전인지를 결졍. -1: 1주전. -2: 2주전.
        weekIdxBegin, 
        // 검색을 끝내는 주의 인덱스. 현재를 기준으로 몇주 뒤인지를 결졍. 1: 1주뒤. 2: 2주뒤.
        weekIdxEnd) {
        if (null == dayIdxList || !(0 < dayIdxList.length)) {
            return [];
        }
        for (var i = 0; i < dayIdxList.length; ++i) {
            var dayIdx = dayIdxList[i];
            if (!(0 <= dayIdx && dayIdx <= 6)) {
                return [];
            }
        }
        if (isNaN(weekIdxBegin)) {
            return [];
        }
        if (isNaN(weekIdxEnd)) {
            return [];
        }
        if (!(weekIdxBegin <= weekIdxEnd)) {
            return [];
        }
        // 오늘의 요일을 가져온다. 
        var today = new Date();
        var dayIdxToday = today.getDay();
        // 한주의 시작. 경계값.
        var sundayThisWeek = this.addDaysToDate(today, -1 * dayIdxToday);
        console.log("TEST / sundayThisWeek : ", sundayThisWeek);
        // 검색을 하려는 요일 값들을 이번주 요일의 date 객체 리스트로 만듭니다.
        var dayListThisWeek = [];
        for (var i = 0; i < dayIdxList.length; ++i) {
            var dayIdx = dayIdxList[i];
            console.log("TEST / dayIdx : ", dayIdx);
            var date = this.addDaysToDate(sundayThisWeek, dayIdx);
            console.log("TEST / date : ", date);
            dayListThisWeek.push(date);
        } // end for
        console.log("TEST / dayListThisWeek : ", dayListThisWeek);
        var dayMilliSec = 60 * 60 * 1000 * 24;
        var weekMilliSec = dayMilliSec * 7;
        var dateListNext = [];
        for (var i = weekIdxBegin; i < (weekIdxEnd + 1); ++i) {
            for (var j = 0; j < dayListThisWeek.length; ++j) {
                var date = dayListThisWeek[j];
                var dateNext = this.addWeeksToDate(date, i);
                dateListNext.push(dateNext);
            } // end for
        } // end for
        return dateListNext;
    };
    HelperMyTime.prototype.getDate = function (date_str, input_date_format_type) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("my-time / getDate / 시작");
        if (null == date_str || "" == date_str) {
            return null;
        }
        if (null == input_date_format_type) {
            return null;
        }
        //new Date(year, month, day, hours, minutes, seconds, milliseconds)
        if (input_date_format_type == this.DATE_TYPE_YYYY_MM_DD) {
            var date_arr = date_str.split("-");
            if (date_arr == null ||
                date_arr.length != 3 ||
                date_arr[0].length != 4 ||
                date_arr[1].length != 2 ||
                date_arr[2].length != 2) {
                console.log("!Error! / airborne.dates / getFormattedDate / date_str is not this.DATE_TYPE_YYYY_MM_DD");
                return null;
            }
            // ['2012','03','04'] --> 2012
            var year = parseInt(date_arr[0]);
            // ['2012','03','04'] --> 3
            var month = parseInt(date_arr[1]) - 1;
            // ['2012','03','04'] --> 4
            var days = parseInt(date_arr[2]);
            return new Date(year, month, days, 0, 0, 0, 0);
        }
        else if (input_date_format_type == this.DATE_TYPE_YYYY_MM_DD_HH_MM_SS) {
            // EX ) "2012-11-22 11:22:33"
            var res = date_str.match(/[0-9]{2,4}/g);
            if (null == res || 6 != res.length) {
                return null;
            }
            var year = parseInt(res[0]);
            var month = parseInt(res[1]) - 1; // month starts with 0, january.d
            var day = parseInt(res[2]);
            var hour = parseInt(res[3]);
            var minute = parseInt(res[4]);
            var second = parseInt(res[5]);
            return new Date(year, month, day, hour, minute, second);
        }
        else if (input_date_format_type == this.DATE_TYPE_YYYYMMDDHHMMSS) {
            if (date_str.length == 8) {
                console.log("date_str.length == 8");
                return null;
            }
            var year = parseInt(date_str.slice(0, 4));
            var month = parseInt(date_str.slice(4, 6)) - 1; // month starts with 0, january.d
            var day = parseInt(date_str.slice(6, 8));
            var hour = parseInt(date_str.slice(8, 10));
            var minute = parseInt(date_str.slice(10, 12));
            var second = parseInt(date_str.slice(12, 14));
            return new Date(year, month, day, hour, minute, second);
        }
        else if (input_date_format_type == this.DATE_TYPE_HH_MM) {
            // sample : "07:00"
            if (this.isNotHHMM(date_str))
                return null;
            var time_arr = date_str.split(":");
            var hours = parseInt(time_arr[0]);
            if (hours < 0 || 23 < hours)
                return null;
            var minutes = parseInt(time_arr[1]);
            if (minutes < 0 || 59 < minutes)
                return null;
            var now_date = new Date();
            var cur_year = now_date.getFullYear();
            var cur_month = now_date.getMonth() + 1;
            // cur_month = this.getDoubleDigit(cur_month);
            var cur_days = now_date.getDate();
            // cur_days = this.getDoubleDigit(cur_days);
            var cur_hours = parseInt(time_arr[0]);
            var cur_minutes = parseInt(time_arr[1]);
            var cur_seconds = 0;
            return new Date(cur_year, cur_month, cur_days, cur_hours, cur_minutes, cur_seconds);
        }
        else if (input_date_format_type == this.DATE_TYPE_MM_SS) {
            // sample : "07:00"
            if (this.isNotHHMM(date_str))
                return null;
            var time_arr = date_str.split(":");
            var minutes = parseInt(time_arr[0]);
            if (minutes < 0 || 59 < minutes)
                return null;
            var seconds = parseInt(time_arr[1]);
            if (seconds < 0 || 59 < seconds)
                return null;
            var now_date = new Date();
            var cur_year = now_date.getFullYear();
            var cur_month = now_date.getMonth() + 1;
            // cur_month = this.getDoubleDigit(cur_month);
            var cur_days = now_date.getDate();
            // cur_days = this.getDoubleDigit(cur_days);
            var cur_hours = now_date.getHours();
            var cur_minutes = parseInt(time_arr[0]);
            var cur_seconds = parseInt(time_arr[1]);
            return new Date(cur_year, cur_month, cur_days, cur_hours, cur_minutes, cur_seconds);
        }
        return null;
    };
    HelperMyTime.prototype.isNotHHMM = function (time_str) {
        return !this.isHHMM(time_str);
    };
    // @ Public
    // @ Desc : 사용자가 입력한 시간이 다음과 같은 포맷인지 (00시 00분) 확인합니다.
    HelperMyTime.prototype.isHHMM = function (time_str) {
        if (null == time_str || "" === time_str) {
            return false;
        }
        var res = time_str.match(/^([0-9]|0[0-9]|1[0-9]|2[0-6]):[0-5]0$/gi);
        if (null === res || !(0 < res.length)) {
            return false;
        }
        // 17:11 의 포맷인지 확인합니다.
        var time_arr = time_str.split(":");
        if (time_arr == null ||
            time_arr.length != 2 ||
            time_arr[0].length != 2 ||
            time_arr[1].length != 2) {
            return false;
        }
        return true;
    };
    HelperMyTime.prototype.isNotYYYYMMDD_HHMMSS = function (date_str_yyyymmdd_hhmmss) {
        return !this.isYYYYMMDD_HHMMSS(date_str_yyyymmdd_hhmmss);
    };
    // @ Public
    // @ Desc : 사용자가 입력한 시간이 다음과 같은 포맷인지 (ex : 2017-01-13 22:12:11) 확인합니다.
    HelperMyTime.prototype.isYYYYMMDD_HHMMSS = function (date_str_yyyymmdd_hhmmss) {
        if (null == date_str_yyyymmdd_hhmmss || "" === date_str_yyyymmdd_hhmmss) {
            return false;
        }
        var res = date_str_yyyymmdd_hhmmss.match(/^([2]{1}[0-9]{3})-([0]{1}[1-9]{1}|[1]{1}[0-2]{1})-([0]{1}[1-9]{1}|[1]{1}[0-9]{1}|[2]{1}[0-9]{1}|[3]{1}[0-1]{1}) (0[0-9]|1[0-9]|2[0-4]):([0-5]{1}[0-9]{1}):([0-5]{1}[0-9]{1})$/gi);
        if (null === res || !(0 < res.length)) {
            return false;
        }
        return true;
    };
    HelperMyTime.prototype.isNotYYYYMMDD = function (date_str_yyyymmdd) {
        return !this.isYYYYMMDD(date_str_yyyymmdd);
    };
    // @ Public
    // @ Desc : 사용자가 입력한 시간이 다음과 같은 포맷인지 (ex : 2017-01-13) 확인합니다.
    HelperMyTime.prototype.isYYYYMMDD = function (date_str_yyyymmdd) {
        if (null == date_str_yyyymmdd || "" === date_str_yyyymmdd) {
            return false;
        }
        var res = date_str_yyyymmdd.match(/^([2]{1}[0-9]{3})-([0]{1}[1-9]{1}|[1]{1}[0-2]{1})-([0]{1}[1-9]{1}|[1]{1}[0-9]{1}|[2]{1}[0-9]{1}|[3]{1}[0-1]{1})$/gi);
        if (null === res || !(0 < res.length)) {
            return false;
        }
        return true;
    };
    HelperMyTime.prototype.getDoubleDigit = function (target_number) {
        if (target_number < 10) {
            return "0" + target_number;
        }
        return "" + target_number;
    };
    HelperMyTime.prototype.getClockTime = function (hhmm) {
        if (this.isNotHHMM(hhmm)) {
            return null;
        }
        // 1. ex) 16:00 24시간 형태로 인자를 받습니다.
        var hhmmfragments = hhmm.split(":");
        var hoursStr = hhmmfragments[0];
        var hours = parseInt(hoursStr);
        var minutesStr = hhmmfragments[1];
        var minutes = parseInt(minutesStr);
        var totalMinutes = 60 * hours + minutes;
        var hoursForRotate = hours;
        var isAM = true;
        var hhmm24 = hhmm;
        var hhmm12 = "\uC624\uC804 " + hoursStr + ":" + minutesStr;
        if (12 <= hoursForRotate) {
            // 오후 시간대 표시
            hoursForRotate -= 12;
            var hoursIn12 = "" + hoursForRotate;
            if (0 == hoursForRotate) {
                // 낮 12시인 경우.
                hoursIn12 = "12";
                hhmm12 = "\uB0AE " + hoursIn12 + ":" + minutesStr;
            }
            else if (0 < hoursForRotate && hoursForRotate < 3) {
                hoursIn12 = "0" + hoursForRotate;
                hhmm12 = "\uB0AE " + hoursIn12 + ":" + minutesStr;
            }
            else if (3 <= hoursForRotate && hoursForRotate < 6) {
                hoursIn12 = "0" + hoursForRotate;
                hhmm12 = "\uC624\uD6C4 " + hoursIn12 + ":" + minutesStr;
            }
            else if (6 <= hoursForRotate && hoursForRotate < 9) {
                // 저녁 시간을 나타냄. 오후 6시부터 저녁
                hoursIn12 = "0" + hoursForRotate;
                hhmm12 = "\uC800\uB141 " + hoursIn12 + ":" + minutesStr;
            }
            else if (9 <= hoursForRotate) {
                // 밤 시간을 나타냄. 밤은 9시부터...
                if (hoursForRotate < 10) {
                    hoursIn12 = "0" + hoursForRotate;
                }
                hhmm12 = "\uBC24 " + hoursIn12 + ":" + minutesStr;
            }
            isAM = false;
        }
        var clockTimeObj = new my_clock_time_1.MyClockTime();
        clockTimeObj.hhmm = hhmm;
        clockTimeObj.hours = hours;
        clockTimeObj.minutes = minutes;
        clockTimeObj.totalMinutes = totalMinutes;
        clockTimeObj.hoursForRotate = hoursForRotate;
        clockTimeObj.isAM = isAM;
        clockTimeObj.hhmm24 = hhmm24;
        clockTimeObj.hhmm12 = hhmm12;
        return clockTimeObj;
    };
    return HelperMyTime;
}());
exports.HelperMyTime = HelperMyTime;
//# sourceMappingURL=my-time.js.map