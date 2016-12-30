"use strict";
var klass_review_1 = require('./klass-review');
var klass_question_1 = require('./klass-question');
var klass_calendar_day_1 = require('./klass-calendar-day');
var klass_calendar_1 = require('./klass-calendar');
var klass_venue_1 = require('./klass-venue');
var my_array_1 = require('../../util/helper/my-array');
var my_is_1 = require('../../util/helper/my-is');
var my_time_1 = require('../../util/helper/my-time');
var my_format_1 = require('../../util/helper/my-format');
var teacher_1 = require('../../teachers/model/teacher');
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
        this.week = -1;
        this.week_min = -1;
        this.week_max = -1;
        this.days = "";
        this.days_list = [];
        this.days_img_url = "";
        this.days_img_url_list = [];
        this.days_eng = "";
        this.days_kor = "";
        this.class_day_per_week = -1; // 주 n회 수업
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
        this.price_with_format = "";
        // 수업 참여 학생수
        this.student_cnt = -1;
        this.class_status = "";
        this.enrollment_interval_week = -1; // @ Deprecated / REMOVE ME
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
    // @ Desc : 수업없음 클래스인지 여부.
    Klass.prototype.isNoClassBtn = function () {
        return (-1 === this.id) ? true : false;
    };
    Klass.prototype.isNotNoClassBtn = function () {
        return !this.isNoClassBtn();
    };
    // @ Desc : 새로운 클래스를 만드는 버튼 역할의 수업인지 여부.
    Klass.prototype.isNewClassBtn = function () {
        return (-100 === this.id) ? true : false;
    };
    Klass.prototype.isNotNewClassBtn = function () {
        return !this.isNewClassBtn();
    };
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
    Klass.prototype.getPriceForStudentStr = function () {
        var priceForStudent = this.getPriceForStudent();
        var priceForStudentStr = this.myFormat.numberWithCommas(priceForStudent);
        return "\u20A9" + priceForStudentStr;
    };
    Klass.prototype.getPriceForStudent = function () {
        if (null == this.week || !(0 < this.week && 0 == (this.week % 4))) {
            return -1;
        }
        if (null == this.price || !(0 < this.price)) {
            return -1;
        }
        var studentPrice = (this.week / 4) * this.price;
        return studentPrice;
    }; // end method
    Klass.prototype.getPaymentForTeacherStr = function () {
        if (null == this.week || !(0 < this.week && 0 == (this.week % 4))) {
            return "";
        } // end if
        if (null == this.price || !(0 < this.price)) {
            return "";
        } // end if
        var payment = this.getPayment();
        var paymentOnWeeks = (this.week / 4) * payment;
        var paymentOnWeeksStr = this.myFormat.numberWithCommas(paymentOnWeeks);
        return "\u20A9" + paymentOnWeeksStr;
    };
    Klass.prototype.getPayment = function () {
        var commission = this.getCommision();
        if (commission < 0) {
            return -1;
        }
        return Math.round(this.price * ((100 - commission) / 100));
    };
    Klass.prototype.getPaymentStr = function () {
        // 4주 단위 가격을 가져옵니다.
        var payment = this.getPayment();
        var totalPayment = payment * (this.week / 4);
        if (0 < totalPayment) {
            return this.myFormat.numberWithCommas(totalPayment);
        } // end if
        return "";
    };
    Klass.prototype.getPaymentTotalStr = function () {
        // 4주 단위 가격을 가져옵니다.
        var payment = this.getPayment();
        var totalPayment = payment * (this.week / 4) * this.student_cnt;
        if (0 < totalPayment) {
            return this.myFormat.numberWithCommas(totalPayment);
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
    Klass.prototype.hasNotKlassVenue = function () {
        return !this.hasKlassVenue();
    };
    Klass.prototype.hasKlassVenue = function () {
        if (null == this.venue_title || "" === this.venue_title) {
            return false;
        }
        if (null == this.venue_address || "" === this.venue_address) {
            return false;
        }
        if (null == this.venue_latitude || "" === this.venue_latitude) {
            return false;
        }
        if (null == this.venue_longitude || "" === this.venue_longitude) {
            return false;
        }
        return true;
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
    // @ Deprecated
    Klass.prototype.getEnrollmentDateList = function () {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("klass / getEnrollmentDateList / 시작");
        if (isDebug)
            console.log("klass / getEnrollmentDateList / this.klass_calendar_list : ", this.klass_calendar_list);
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
        if (isDebug)
            console.log("klass / getEnrollmentDateList / enrollmentDateList : ", enrollmentDateList);
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
        // days
        if (null != klass.days_list && 0 < klass.days_list.length) {
        }
        // teacher
        if (null != klass.teacher) {
            klass.teacher = new teacher_1.Teacher().setJSON(klass.teacher);
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
        if (null != klass.teacher_resume &&
            "" != klass.teacher_resume &&
            null != klass.teacher) {
            klass.teacher.resume = klass.teacher_resume;
            klass.teacher.resume_arr = klass.teacher_resume_list;
        } // end if
        // teacher - greeting
        if (null != klass.teacher_greeting &&
            "" != klass.teacher_greeting &&
            null != klass.teacher) {
            klass.teacher.greeting = klass.teacher_greeting;
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
    Klass.prototype.isNotSame = function (target) {
        return !this.isSame(target);
    };
    // @ Desc : 다른 Klass 객체와 데이터를 비교, 동일한지 확인합니다.
    Klass.prototype.isSame = function (target) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("klass / isSame / 시작");
        if (null == target) {
            if (isDebug)
                console.log("klass / isSame / target is not valid!");
            return false;
        }
        if (this.id != target.id) {
            if (isDebug)
                console.log("klass / isSame / id has been changed! / this.id:" + this.id + " != target.id:" + target.id);
            return false;
        }
        if (this.teacher_id != target.teacher_id) {
            if (isDebug)
                console.log("klass / isSame / teacher_id has been changed! / this.teacher_id:" + this.teacher_id + " != target.teacher_id:" + target.teacher_id);
            return false;
        }
        if (this.teacher_resume != target.teacher_resume) {
            if (isDebug)
                console.log("klass / isSame / teacher_resume has been changed! / this.teacher_resume:" + this.teacher_resume + " != target.teacher_resume:" + target.teacher_resume);
            return false;
        }
        if (this.teacher_greeting != target.teacher_greeting) {
            if (isDebug)
                console.log("klass / isSame / teacher_greeting has been changed! / this.teacher_greeting:" + this.teacher_greeting + " != target.teacher_greeting:" + target.teacher_greeting);
            return false;
        }
        if (this.title != target.title) {
            if (isDebug)
                console.log("klass / isSame / title has been changed! / this.title:" + this.title + " != target.title:" + target.title);
            return false;
        }
        if (this.desc != target.desc) {
            if (isDebug)
                console.log("klass / isSame / desc has been changed! / this.desc:" + this.desc + " != target.desc:" + target.desc);
            return false;
        }
        if (this.feature != target.feature) {
            if (isDebug)
                console.log("klass / isSame / feature has been changed! / this.feature:" + this.feature + " != target.feature:" + target.feature);
            return false;
        }
        if (this.target != target.target) {
            if (isDebug)
                console.log("klass / isSame / target has been changed! / this.target:" + this.target + " != target.target:" + target.target);
            return false;
        }
        if (this.schedule != target.schedule) {
            if (isDebug)
                console.log("klass / isSame / schedule has been changed! / this.schedule:" + this.schedule + " != target.schedule:" + target.schedule);
            return false;
        }
        if (this.date_begin != target.date_begin) {
            if (isDebug)
                console.log("klass / isSame / date_begin has been changed! / this.date_begin:" + this.date_begin + " != target.date_begin:" + target.date_begin);
            return false;
        }
        if (this.time_begin != target.time_begin) {
            if (isDebug)
                console.log("klass / isSame / time_begin has been changed! / this.time_begin:" + this.time_begin + " != target.time_begin:" + target.time_begin);
            return false;
        }
        if (this.time_end != target.time_end) {
            if (isDebug)
                console.log("klass / isSame / time_end has been changed! / this.time_end:" + this.time_end + " != target.time_end:" + target.time_end);
            return false;
        }
        if (this.time_duration_minutes != target.time_duration_minutes) {
            if (isDebug)
                console.log("klass / isSame / time_duration_minutes has been changed! / this.time_duration_minutes:" + this.time_duration_minutes + " != target.time_duration_minutes:" + target.time_duration_minutes);
            return false;
        }
        if (this.level != target.level) {
            if (isDebug)
                console.log("klass / isSame / level has been changed! / this.level:" + this.level + " != target.level:" + target.level);
            return false;
        }
        if (this.week != target.week) {
            if (isDebug)
                console.log("klass / isSame / week has been changed! / this.week:" + this.week + " != target.week:" + target.week);
            return false;
        }
        if (this.days != target.days) {
            if (isDebug)
                console.log("klass / isSame / days has been changed! / this.days:" + this.days + " != target.days:" + target.days);
            return false;
        }
        if (this.venue_title != target.venue_title) {
            if (isDebug)
                console.log("klass / isSame / venue_title has been changed! / this.venue_title:" + this.venue_title + " != target.venue_title:" + target.venue_title);
            return false;
        }
        if (this.venue_telephone != target.venue_telephone) {
            if (isDebug)
                console.log("klass / isSame / venue_telephone has been changed! / this.venue_telephone:" + this.venue_telephone + " != target.venue_telephone:" + target.venue_telephone);
            return false;
        }
        if (this.venue_address != target.venue_address) {
            if (isDebug)
                console.log("klass / isSame / venue_address has been changed! / this.venue_address:" + this.venue_address + " != target.venue_address:" + target.venue_address);
            return false;
        }
        if (this.venue_road_address != target.venue_road_address) {
            if (isDebug)
                console.log("klass / isSame / venue_road_address has been changed! / this.venue_road_address:" + this.venue_road_address + " != target.venue_road_address:" + target.venue_road_address);
            return false;
        }
        if (this.venue_latitude != target.venue_latitude) {
            if (isDebug)
                console.log("klass / isSame / venue_latitude has been changed! / this.venue_latitude:" + this.venue_latitude + " != target.venue_latitude:" + target.venue_latitude);
            return false;
        }
        if (this.venue_longitude != target.venue_longitude) {
            if (isDebug)
                console.log("klass / isSame / venue_longitude has been changed! / this.venue_longitude:" + this.venue_longitude + " != target.venue_longitude:" + target.venue_longitude);
            return false;
        }
        if (this.subway_line != target.subway_line) {
            if (isDebug)
                console.log("klass / isSame / subway_line has been changed! / this.subway_line:" + this.subway_line + " != target.subway_line:" + target.subway_line);
            return false;
        }
        if (this.subway_station != target.subway_station) {
            if (isDebug)
                console.log("klass / isSame / subway_station has been changed! / this.subway_station:" + this.subway_station + " != target.subway_station:" + target.subway_station);
            return false;
        }
        if (this.price != target.price) {
            if (isDebug)
                console.log("klass / isSame / price has been changed! / this.price:" + this.price + " != target.price:" + target.price);
            return false;
        }
        if (this.student_cnt != target.student_cnt) {
            if (isDebug)
                console.log("klass / isSame / student_cnt has been changed! / this.student_cnt:" + this.student_cnt + " != target.student_cnt:" + target.student_cnt);
            return false;
        }
        if (this.class_status != target.class_status) {
            if (isDebug)
                console.log("klass / isSame / class_status has been changed! / this.class_status:" + this.class_status + " != target.class_status:" + target.class_status);
            return false;
        }
        if (this.class_banner_url != target.class_banner_url) {
            if (isDebug)
                console.log("klass / isSame / class_banner_url has been changed! / this.class_banner_url:" + this.class_banner_url + " != target.class_banner_url:" + target.class_banner_url);
            return false;
        }
        if (this.class_poster_url != target.class_poster_url) {
            if (isDebug)
                console.log("klass / isSame / class_poster_url has been changed! / this.class_poster_url:" + this.class_poster_url + " != target.class_poster_url:" + target.class_poster_url);
            return false;
        }
        if (this.date_created != target.date_created) {
            if (isDebug)
                console.log("klass / isSame / date_created has been changed! / this.date_created:" + this.date_created + " != target.date_created:" + target.date_created);
            return false;
        }
        if (this.date_updated != target.date_updated) {
            if (isDebug)
                console.log("klass / isSame / date_updated has been changed! / this.date_updated:" + this.date_updated + " != target.date_updated:" + target.date_updated);
            return false;
        }
        return true;
    };
    return Klass;
}());
exports.Klass = Klass;
//# sourceMappingURL=klass.js.map