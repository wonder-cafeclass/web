"use strict";
var klass_teacher_1 = require('./klass-teacher');
var klass_review_1 = require('./klass-review');
var klass_question_1 = require('./klass-question');
var klass_calendar_day_1 = require('./klass-calendar-day');
var klass_calendar_1 = require('./klass-calendar');
var my_array_1 = require('../../util/helper/my-array');
var my_is_1 = require('../../util/helper/my-is');
var my_time_1 = require('../../util/helper/my-time');
var Klass = (function () {
    function Klass() {
        this.id = -1;
        this.teacher = null;
        this.review_list = [];
        this.question_list = [];
        this.teacher_id = -1;
        this.teacher_resume = "";
        this.teacher_greeting = "";
        this.title = "";
        this.desc = "";
        this.feature = "";
        this.target = "";
        this.schedule = "";
        this.date_begin = "";
        this.time_begin = "";
        this.time_begin_img_url = "";
        this.time_duration_minutes = -1;
        this.time_end = "";
        this.level = "";
        this.level_eng = "";
        this.level_kor = "";
        this.level_img_url = "";
        this.week_min = -1;
        this.week_max = -1;
        this.week_list = [];
        this.weekly_price_list = [];
        this.month_min = -1;
        this.month_max = -1;
        this.days = "";
        this.days_list = [];
        this.days_img_url = "";
        this.days_img_url_list = [];
        this.days_eng = "";
        this.days_kor = "";
        this.class_day_per_week = -1; // 주 n회 수업
        this.resume = "";
        this.greeting = "";
        this.venue = "";
        this.venue_cafe = "";
        this.venue_cafe_logo_img_url = "";
        this.venue_map_link = "";
        // @ Deprecated
        this.venue_subway_station = "";
        this.venue_subway_station_img_url = "";
        // @ Recommended
        this.subway_line = "";
        this.subway_station = "";
        this.subway_station_img = "";
        this.venue_title = "";
        this.venue_telephone = "";
        this.venue_address = "";
        this.venue_road_address = "";
        this.venue_latitude = "";
        this.venue_longitude = "";
        this.search_tag = "";
        this.price = -1;
        this.price_list = [];
        this.klass_price_list = [];
        this.price_list_width_discount = [];
        this.discount = "";
        this.discount_arr = [];
        this.price_with_format = "";
        this.class_status = "";
        this.enrollment_interval_week = -1;
        this.class_banner_url = "";
        this.class_banner_url_arr = [];
        this.class_poster_url = "";
        this.class_poster_url_loadable = "";
        this.calendar_table_linear = null;
        this.calendar_table_monthly = null;
        this.klass_calendar_list = null;
        this.date_created = "";
        this.date_updated = "";
        this.delimiter = "|||";
        this.myArray = null;
        this.myIs = null;
        this.myTime = null;
        this.myArray = new my_array_1.HelperMyArray();
        this.myIs = new my_is_1.HelperMyIs();
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
    Klass.prototype.copy = function () {
        return this.myIs.copy(
        // src:any
        this, 
        // copy:any
        new Klass());
    }; // end method
    Klass.prototype.setJSON = function (json) {
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("klass / setJSON / init");
        if (isDebug)
            console.log("klass / setJSON / json : ", json);
        var klass = this._setJSON(json);
        if (isDebug)
            console.log("klass / setJSON / klass : ", klass);
        // teacher
        if (null != klass.teacher) {
            klass.teacher = new klass_teacher_1.KlassTeacher().setJSON(klass.teacher);
        }
        // review_list
        var klassReviewList = [];
        for (var i = 0; i < klass.review_list.length; ++i) {
            var reviewJSON = klass.review_list[i];
            if (null == reviewJSON) {
                continue;
            }
            var klassReview = new klass_review_1.KlassReview().setJSON(reviewJSON);
            klassReviewList.push(klassReview);
        } // end for
        klass.review_list = klassReviewList;
        // question_list
        var klassQuestionList = [];
        for (var i = 0; i < klass.question_list.length; ++i) {
            var questionJSON = klass.question_list[i];
            if (null == questionJSON) {
                continue;
            }
            var klassQuestion = new klass_question_1.KlassQuestion().setJSON(questionJSON);
            klassQuestionList.push(klassQuestion);
        } // end for
        klass.question_list = klassQuestionList;
        // time_end
        if (null == klass.time_end ||
            "" === klass.time_end) {
            if (null != klass.time_begin &&
                "" != klass.time_begin &&
                !isNaN(klass.time_duration_minutes)) {
                // 끝나는 시간이 없고, 시작 시간과 진행 시간 정보가 있다면 계산해서 넣어준다.
                klass.time_end = klass.myTime.addMinutesHHMM(klass.time_begin, klass.time_duration_minutes);
            } // end if
        } // end if  
        // days,
        if (null != klass.days && "" != klass.days) {
            klass.days_list = klass.days.split(klass.delimiter);
        }
        // class_banner_url_arr,
        if (null != klass.class_banner_url && "" != klass.class_banner_url) {
            klass.class_banner_url_arr = klass.class_banner_url.split("|||");
        }
        else {
            klass.class_banner_url_arr = [];
        }
        // days_img_url_list
        if (null != klass.days_img_url && "" != klass.days_img_url) {
            klass.days_img_url_list = klass.days_img_url.split("|||");
        }
        else {
            klass.days_img_url_list = [];
        }
        // calendar_table_monthly
        klass.setKlassCalendarList(klass.calendar_table_monthly);
        return klass;
    }; // end method
    Klass.prototype._setJSON = function (json) {
        return this.myIs.copyFromJSON(
        // target:any,
        this, 
        // json
        json);
    }; // end method
    return Klass;
}());
exports.Klass = Klass;
//# sourceMappingURL=klass.js.map