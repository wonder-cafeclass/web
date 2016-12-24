"use strict";
var klass_teacher_1 = require('./klass-teacher');
var klass_review_1 = require('./klass-review');
var klass_question_1 = require('./klass-question');
var klass_calendar_day_1 = require('./klass-calendar-day');
var klass_calendar_1 = require('./klass-calendar');
var klass_venue_1 = require('./klass-venue');
var my_array_1 = require('../../util/helper/my-array');
var my_is_1 = require('../../util/helper/my-is');
var my_time_1 = require('../../util/helper/my-time');
var my_format_1 = require('../../util/helper/my-format');
var Klass = (function () {
    function Klass() {
        this.id = -1;
        this.teacher = null;
        this.review_list = [];
        this.question_list = [];
        this.klassVenue = null;
        this.teacher_id = -1;
        this.teacher_resume = "";
        this.teacher_resume_list = [];
        this.teacher_greeting = "";
        this.teacher_greeting_list = [];
        this.title = "";
        this.desc = "";
        this.feature = "";
        this.feature_list = [];
        this.target = "";
        this.target_list = [];
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
        this.resume = ""; // @ Deprecated
        this.greeting = ""; // @ Deprecated
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
        this.myFormat = null;
        this.myArray = new my_array_1.HelperMyArray();
        this.myIs = new my_is_1.HelperMyIs();
        this.myTime = new my_time_1.HelperMyTime();
        this.myFormat = new my_format_1.HelperMyFormat();
    }
    // @ Desc : 가격별 수수료에 대해 계산, 반환해줍니다.
    Klass.prototype.getCommision = function () {
        if (!(0 < this.price)) {
            return -1;
        }
        /*
        5만9천원까지 20 %
        6만원 부터 10만원 25%
        10만원초과 30%
        */
        if (0 < this.price && this.price <= 59000) {
            return 20;
        }
        else if (60000 <= this.price && this.price <= 100000) {
            return 25;
        }
        else if (100000 < this.price) {
            return 30;
        }
        return -1;
    };
    Klass.prototype.getPayment = function () {
        var commission = this.getCommision();
        if (commission < 0) {
            return -1;
        }
        return this.price * ((100 - commission) / 100);
    };
    Klass.prototype.getPaymentStr = function () {
        var payment = this.getPayment();
        if (0 < payment) {
            return this.myFormat.numberWithCommas(payment);
        } // end if
        return "";
    };
    // @ Desc : 수업의 특징을 배열 형태로 반환합니다.
    Klass.prototype.getFeatureList = function () {
        if (null == this.feature || "" === this.feature) {
            return [];
        }
        return this.feature.split(this.delimiter);
    };
    Klass.prototype.setFeatureList = function (featureList) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("klass / setFeatureList / init");
        if (this.myArray.isNotOK(featureList)) {
            if (isDebug)
                console.log("klass / setFeatureList / 중단 / featureList is not valid!");
        } // end if
        this.feature_list = featureList;
        this.feature = featureList.join(this.delimiter);
    }; // end method
    // @ Desc : 수업의 대상을 배열 형태로 반환합니다.
    Klass.prototype.getTargetList = function () {
        if (null == this.target || "" === this.target) {
            return [];
        }
        return this.target.split(this.delimiter);
    };
    Klass.prototype.setTargetList = function (targetList) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("klass / setTargetList / init");
        if (this.myArray.isNotOK(targetList)) {
            if (isDebug)
                console.log("klass / setTargetList / 중단 / targetList is not valid!");
        } // end if
        this.target_list = targetList;
        this.target = targetList.join(this.delimiter);
    }; // end method 
    Klass.prototype.setSchedule = function (schedule) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("klass / setSchedule / init");
        this.schedule = schedule;
    };
    Klass.prototype.setTeacherResumeList = function (resumeList) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("klass / setTeacherResumeList / init");
        if (this.myArray.isNotOK(resumeList)) {
            if (isDebug)
                console.log("klass / setTeacherResumeList / 중단 / resumeList is not valid!");
        } // end if
        this.teacher_resume = resumeList.join(this.delimiter);
    }; // end method
    Klass.prototype.setTeacherGreetingList = function (greetingList) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("klass / setTeacherGreetingList / init");
        if (this.myArray.isNotOK(greetingList)) {
            if (isDebug)
                console.log("klass / setTeacherGreetingList / 중단 / greetingList is not valid!");
        } // end if
        this.teacher_greeting = greetingList.join(this.delimiter);
    }; // end method
    // @ Desc : 네이버 맵에서 검색한 수업 장소 데이터를 저장합니다. klass 내의 venue관련 데이터도 함께 업데이트합니다.
    Klass.prototype.setKlassVenue = function (klassVenue) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("klass / setKlassVenue / init");
        if (null == klassVenue) {
            return;
        } // end if
        this.klassVenue = klassVenue;
        this.venue_title = klassVenue.title;
        this.venue_telephone = klassVenue.telephone;
        this.venue_address = klassVenue.address;
        this.venue_road_address = klassVenue.roadAddress;
        this.venue_latitude = "" + klassVenue.latitude;
        this.venue_longitude = "" + klassVenue.longitude;
    };
    Klass.prototype.getKlassVenue = function () {
        if (null == this.klassVenue) {
            this.klassVenue =
                new klass_venue_1.KlassVenue().set(
                // title:string,
                this.venue_title, 
                // telephone:string,
                this.venue_telephone, 
                // address:string,
                this.venue_address, 
                // roadAddress:string,
                this.venue_road_address, 
                // latitude:number,
                +this.venue_latitude, 
                // longitude:number
                +this.venue_longitude);
        } // end if
        return this.klassVenue;
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
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("klass / setJSON / init");
        if (isDebug)
            console.log("klass / setJSON / json : ", json);
        var klass = this._setJSON(json);
        if (isDebug)
            console.log("klass / setJSON / klass : ", klass);
        // json 자동 설정 이후의 추가 작업을 여기서 합니다.
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
        // teacher - resume
        if (null != klass.teacher_resume && "" != klass.teacher_resume) {
            klass.teacher_resume_list = klass.teacher_resume.split(this.delimiter);
        } // end if
        // teacher - greeting
        if (null != klass.teacher_greeting && "" != klass.teacher_greeting) {
            klass.teacher_greeting_list = klass.teacher_greeting.split(this.delimiter);
        } // end if
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