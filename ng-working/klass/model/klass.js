"use strict";
var klass_teacher_1 = require('./klass-teacher');
var klass_calendar_day_1 = require('./klass-calendar-day');
var klass_calendar_1 = require('./klass-calendar');
var my_array_1 = require('../../util/helper/my-array');
var my_is_1 = require('../../util/helper/my-is');
var my_time_1 = require('../../util/helper/my-time');
var Klass = (function () {
    function Klass() {
        this.delimiter = "|||";
        this.myArray = new my_array_1.HelperMyArray();
        this.helperMyIs = new my_is_1.HelperMyIs();
        this.myTime = new my_time_1.HelperMyTime();
    }
    // @ Desc : 수업의 대상을 배열 형태로 반환합니다.
    Klass.prototype.getTargetList = function () {
        if (null == this.target || "" === this.target) {
            return [];
        }
        return this.target.split(this.delimiter);
    };
    // @ Desc : 수업의 특징을 배열 형태로 반환합니다.
    Klass.prototype.getFeatureList = function () {
        if (null == this.feature || "" === this.feature) {
            return [];
        }
        return this.feature.split(this.delimiter);
    };
    /*
    // @ Desc : 수업의 특징을 1열 추가합니다.
    addFeature(feature:string):void {

        if(null == feature || "" === feature) {
            return;
        }

        let featureList:string[] = this.getFeatureList();
        if(null == featureList) {
            featureList = [];
        }

        featureList.push(feature);

        this.feature = featureList.join(this.delimiter);

    } // end method
    removeFeature(feature:string):void {

        if(null == feature || "" === feature) {
            return;
        }

        // Do somthing...

    }
    */
    // @ Desc : 수업이 있는 요일을 추가합니다.
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
        this.days = this.days_list.join(this.delimiter);
        this.days_img_url_list.push(imgUrl);
        this.days_img_url = this.days_img_url_list.join(this.delimiter);
    };
    // @ Desc : 수업이 있는 요일을 뺍니다.
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
        this.days = this.days_list.join(this.delimiter);
        this.days_img_url_list = this.myArray.removeStr(this.days_img_url_list, imgUrl);
        this.days_img_url = this.days_img_url_list.join(this.delimiter);
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
        this.class_banner_url = this.class_banner_url_arr.join(this.delimiter);
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
    Klass.prototype.setJSON = function (json) {
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("klass / setJSON / 시작");
        if (isDebug)
            console.log("klass / setJSON / json : ", json);
        // id,
        this.id = -1;
        if (null != json.id) {
            this.id = +json.id;
        }
        // review - TODO
        // comment - TODO
        // teacher
        if (null != json["teacher"]) {
            this.teacher = new klass_teacher_1.KlassTeacher().setJSON(json["teacher"]);
        }
        // teacher_id,
        this.teacher_id = -1;
        if (null != json.teacher_id) {
            this.teacher_id = +json.teacher_id;
        }
        // teacher_resume,
        this.teacher_resume = json.teacher_resume;
        // teacher_greeting,
        this.teacher_greeting = json.teacher_greeting;
        // title,
        this.title = json.title;
        // desc,
        this.desc = json.desc;
        // feature,
        this.feature = json.feature;
        // target,
        this.target = json.target;
        // schedule,
        this.schedule = json.schedule;
        // date_begin,
        this.date_begin = json.date_begin;
        // time_begin,
        this.time_begin = json.time_begin;
        // time_duration_minutes,
        this.time_duration_minutes = parseInt(json.time_duration_minutes);
        // time_end,
        this.time_end = json.time_end;
        if (null == this.time_end ||
            "" === this.time_end) {
            if (null != this.time_begin &&
                "" != this.time_begin &&
                !isNaN(this.time_duration_minutes)) {
                // 끝나는 시간이 없고, 시작 시간과 진행 시간 정보가 있다면 계산해서 넣어준다.
                this.time_end = this.myTime.addMinutesHHMM(this.time_begin, this.time_duration_minutes);
            } // end if
        } // end if
        // level,
        this.level = json.level;
        // week_min,
        this.week_min = json.week_min;
        // week_max,
        this.week_max = json.week_max;
        // days,
        this.days = json.days;
        if (null != this.days && "" != this.days) {
            this.days_list = this.days.split(this.delimiter);
        }
        // class_per_week, / Warning! 이름다름
        this.class_day_per_week = json.class_per_week;
        // venue,
        this.venue = json.venue;
        // venue_cafe,
        this.venue_cafe = json.venue_cafe;
        // venue_map_link,
        this.venue_map_link = json.venue_map_link;
        // venue_title,
        this.venue_title = json.venue_title;
        // venue_telephone,
        this.venue_telephone = json.venue_telephone;
        // venue_address,
        this.venue_address = json.venue_address;
        // venue_road_address,
        this.venue_road_address = json.venue_road_address;
        // venue_latitude,
        this.venue_latitude = json.venue_latitude;
        // venue_longitude,
        this.venue_longitude = json.venue_longitude;
        // @ Deprecated
        // venue_subway_station,
        this.venue_subway_station = json.venue_subway_station;
        // venue_subway_station_img_url,
        this.venue_subway_station_img_url = json.venue_subway_station_img_url;
        // @ Recommended
        if (null != json.subway_line) {
            this.subway_line = json.subway_line;
        }
        if (null != json.subway_station) {
            this.subway_station = json.subway_station;
        }
        if (null != json.subway_station_img) {
            this.subway_station_img = json.subway_station_img;
        }
        // staturlService,
        this.class_status = json.status;
        // enrollment_interval_week,
        this.enrollment_interval_week = json.enrollment_interval_week;
        // tags,
        this.search_tag = json.tags;
        // price,
        this.price = json.price;
        // discount,
        this.discount = json.discount;
        // class_poster_url,
        this.class_poster_url = json.class_poster_url;
        // class_poster_url_loadable,
        this.class_poster_url_loadable = json.class_poster_url_loadable;
        // class_banner_url,
        this.class_banner_url = json.class_banner_url;
        // class_banner_url_arr,
        if (null != json.class_banner_url && "" != json.class_banner_url) {
            this.class_banner_url_arr = json.class_banner_url.split("|||");
        }
        else {
            this.class_banner_url_arr = [];
        }
        // level_img_url,
        this.level_img_url = json.level_img_url;
        // days_img_url,
        this.days_img_url = json.days_img_url;
        // days_img_url_list
        if (null != json.days_img_url && "" != json.days_img_url) {
            this.days_img_url_list = json.days_img_url.split("|||");
        }
        else {
            this.days_img_url_list = [];
        }
        // time_begin_img_url,
        this.time_begin_img_url = json.time_begin_img_url;
        // calendar_table_linear // @ Deprecated
        // this.calendar_table_linear = json.calendar_table_linear;
        // calendar_table_monthly
        this.calendar_table_monthly = json.calendar_table_monthly;
        this.setKlassCalendarList(json.calendar_table_monthly);
        // date_created,
        this.date_created = json.date_created;
        // date_updated
        this.date_updated = json.date_updated;
        return this;
    }; // end method    
    return Klass;
}());
exports.Klass = Klass;
//# sourceMappingURL=klass.js.map