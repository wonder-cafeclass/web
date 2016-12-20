"use strict";
var klass_calendar_day_1 = require('./klass-calendar-day');
var klass_calendar_1 = require('./klass-calendar');
var my_array_1 = require('../../util/helper/my-array');
var my_is_1 = require('../../util/helper/my-is');
var my_time_1 = require('../../util/helper/my-time');
var Klass = (function () {
    function Klass() {
        this.delimiter_banner = "|||";
        this.myArray = new my_array_1.HelperMyArray();
        this.helperMyIs = new my_is_1.HelperMyIs();
        this.myTime = new my_time_1.HelperMyTime();
    }
    Klass.prototype.addDay = function (day, imgUrl) {
        if (null == day || "" === day) {
            return;
        }
        if (null == imgUrl || "" === imgUrl) {
            return;
        }
        if (null == this.days_list) {
            this.days_list = [];
            this.days_img_url_list = [];
        }
        this.days_list.push(day);
        this.days = this.days_list.join(this.delimiter_banner);
        this.days_img_url_list.push(imgUrl);
        this.days_img_url = this.days_img_url_list.join(this.delimiter_banner);
    };
    Klass.prototype.removeDay = function (day, imgUrl) {
        if (null == day || "" === day) {
            return;
        }
        if (null == imgUrl || "" === imgUrl) {
            return;
        }
        if (null == this.days_list) {
            this.days_list = [];
            this.days_img_url_list = [];
        }
        this.days_list = this.myArray.removeStr(this.days_list, day);
        this.days = this.days_list.join(this.delimiter_banner);
        this.days_img_url_list = this.myArray.removeStr(this.days_img_url_list, imgUrl);
        this.days_img_url = this.days_img_url_list.join(this.delimiter_banner);
    };
    Klass.prototype.setTimeBegin = function (hhmmBegin) {
        if (this.myTime.isNotHHMM(hhmmBegin)) {
            return;
        }
        this.time_begin = hhmmBegin;
        if (this.myTime.isNotHHMM(this.time_end)) {
            return;
        }
        // 종료 시간이 있다면, 수업 시간을 구합니다.
        var diffMinutes = this.myTime.getDiffMinutesHHMM(this.time_begin, this.time_end);
        if (0 < diffMinutes) {
            this.time_duration_minutes = diffMinutes;
        } // end if
    }; // end method
    Klass.prototype.setTimeEnd = function (hhmmEnd) {
        if (this.myTime.isNotHHMM(hhmmEnd)) {
            return;
        }
        this.time_end = hhmmEnd;
        if (this.myTime.isNotHHMM(this.time_begin)) {
            return;
        }
        // 시작 시간이 있다면, 수업 시간을 구합니다.
        var diffMinutes = this.myTime.getDiffMinutesHHMM(this.time_begin, this.time_end);
        if (0 < diffMinutes) {
            this.time_duration_minutes = diffMinutes;
        } // end if
    };
    Klass.prototype.setTimeBeginEnd = function (hhmmBegin, hhmmEnd) {
        if (this.myTime.isNotHHMM(hhmmBegin) || this.myTime.isNotHHMM(hhmmEnd)) {
            return;
        }
        this.setTimeBegin(hhmmBegin);
        this.setTimeEnd(hhmmEnd);
    };
    Klass.prototype.hasNotBanner = function (banner) {
        return this.myArray.hasNotStr(this.class_banner_url_arr, banner);
    };
    Klass.prototype.hasBanner = function (banner) {
        return this.myArray.hasStr(this.class_banner_url_arr, banner);
    };
    Klass.prototype.removeBanner = function (banner) {
        this.class_banner_url_arr = this.myArray.removeStr(this.class_banner_url_arr, banner);
        this.updateBannerUrl();
    };
    Klass.prototype.addBanner = function (banner) {
        this.class_banner_url_arr = this.myArray.addStrUnique(this.class_banner_url_arr, banner);
        this.updateBannerUrl();
    };
    Klass.prototype.updateBannerUrl = function () {
        this.class_banner_url = this.class_banner_url_arr.join(this.delimiter_banner);
    };
    Klass.prototype.getEnrollmentDateList = function () {
        if (null == this.klass_calendar_list || 0 == this.klass_calendar_list.length) {
            return [];
        } // end if
        var enrollmentDateList = [];
        for (var i = 0; i < this.klass_calendar_list.length; ++i) {
            var klassCalendar = this.klass_calendar_list[i];
            var klassCalDayList = klassCalendar.getDayList();
            for (var j = 0; j < klassCalDayList.length; ++j) {
                var klassCalDay = klassCalDayList[j];
                if (null === klassCalDay) {
                    continue;
                }
                if (klassCalDay.isExpired) {
                    continue;
                }
                if (!klassCalDay.hasKlass) {
                    continue;
                }
                if (4 == +this.enrollment_interval_week && !klassCalDay.isEnrollment4weeks) {
                    continue;
                }
                else if (2 == +this.enrollment_interval_week && !klassCalDay.isEnrollment2weeks) {
                    continue;
                }
                else if (1 == +this.enrollment_interval_week && !klassCalDay.isEnrollmentWeek) {
                    continue;
                }
                if (klassCalDay.isEnrollment) {
                    enrollmentDateList.push(klassCalDay);
                } // end if
            } // end for
        } // end for
        return enrollmentDateList;
    };
    // @ Desc : 가장 최근 수업 등록 가능한 날짜(수업 시작 날짜) 를 가져옵니다.
    Klass.prototype.getEnrollmentDate = function () {
        var enrollmentDateList = this.getEnrollmentDateList();
        if (null == enrollmentDateList || 0 == enrollmentDateList.length) {
            return "";
        } // end if
        var enrollmentDate = enrollmentDateList[0];
        return this.getEnrollmentDateStr(enrollmentDate);
    }; // end method
    Klass.prototype.getEnrollmentDateStr = function (enrollmentDate) {
        if (null == enrollmentDate) {
            return "";
        }
        return enrollmentDate.month + "\uC6D4 " + enrollmentDate.date + "\uC77C " + enrollmentDate.dayKor + "\uC694\uC77C";
    };
    Klass.prototype.setKlassCalendarList = function (klassCalendarJSONList) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("klass / setKlassCalendarList / init");
        if (null == klassCalendarJSONList || 0 == klassCalendarJSONList.length) {
            if (isDebug)
                console.log("klass / setKlassCalendarList / 중단 / klassCalendarJSONList is not valid!");
            return;
        }
        var klassCalendarList = [];
        for (var i = 0; i < klassCalendarJSONList.length; ++i) {
            var monthJSON = klassCalendarJSONList[i];
            if (null == monthJSON) {
                if (isDebug)
                    console.log("klass / setKlassCalendarList / \uC911\uB2E8 / monthJSON is not valid! / idx-i : " + i);
                continue;
            }
            var klassCalendar = new klass_calendar_1.KlassCalendar();
            for (var j = 0; j < monthJSON.length; ++j) {
                var weekJSON = monthJSON[j];
                if (null == weekJSON) {
                    if (isDebug)
                        console.log("klass / setKlassCalendarList / \uC911\uB2E8 / weekJSON is not valid! / idx-j : " + j);
                    continue;
                }
                for (var k = 0; k < weekJSON.length; ++k) {
                    var dayJSON = weekJSON[k];
                    if (null == dayJSON) {
                        // 달력에서 날짜가 빠진날
                        klassCalendar.addDay(null);
                        continue;
                    }
                    var klassCalendarDay = new klass_calendar_day_1.KlassCalendarDay().setFromJSON(dayJSON);
                    if (null == klassCalendarDay) {
                        // Error Report
                        if (isDebug)
                            console.log("klass / setKlassCalendarList / \uC911\uB2E8 / klassCalendarDay is not valid! / idx-k : " + k);
                        continue;
                    }
                    // 달력에서 날짜가 있는 날
                    if (isDebug)
                        console.log("klass / setKlassCalendarList / klassCalendarDay : ", klassCalendarDay);
                    klassCalendar.addDay(klassCalendarDay);
                } // end for
            } // end for
            if (isDebug)
                console.log("klass / setKlassCalendarList / klassCalendar : ", klassCalendar);
            klassCalendarList.push(klassCalendar);
        } // end for
        this.klass_calendar_list = klassCalendarList;
        if (isDebug)
            console.log("klass / setKlassCalendarList / klassCalendarList : ", klassCalendarList);
    };
    // REMOVE ME
    /*
    private getFirstClassDateFormat() :string {

        let firstClassDate:Calendar = this.getFirstClassDate(this);
        let firstClassDateFormatStr:string = "";
        if(firstClassDate) {
          firstClassDateFormatStr = `${firstClassDate.month}월 ${firstClassDate.date}일 ${firstClassDate.dayKor}요일`;
        }

        return firstClassDateFormatStr;
    }
    private getFirstClassDate(klass:Klass) :Calendar {

        let calendar_table_monthly = klass.calendar_table_monthly;
        for (var i = 0; i < calendar_table_monthly.length; ++i) {
            let calendar_table = calendar_table_monthly[i];
            // console.log("calendar_table : ",calendar_table);
            for (var j = 0; j < calendar_table.length; ++j) {
                let week = calendar_table[j];
                // console.log("week : ",week);
                for (var k = 0; k < week.length; ++k) {
                    let date:Calendar = week[k];
                    // console.log("date : ",date);

                    if(null === date) {
                    continue;
                    }
                    if(date.isExpired) {
                    continue;
                    }
                    if(!date.hasKlass) {
                    continue;
                    }

                    if(4 == +klass.enrollment_interval_week && !date.isEnrollment4weeks) {
                    continue;
                    } else if(2 == +klass.enrollment_interval_week && !date.isEnrollment2weeks) {
                    continue;
                    } else if(1 == +klass.enrollment_interval_week && !date.isEnrollmentWeek) {
                    continue;
                    }

                    // 첫 수업을 찾았습니다.
                    return date;
                }
            }
        }

        return null;
    }
    */
    Klass.prototype.copy = function () {
        return this.helperMyIs.copy(
        // src:any
        this, 
        // copy:any
        new Klass());
    }; // end method
    return Klass;
}());
exports.Klass = Klass;
//# sourceMappingURL=klass.js.map