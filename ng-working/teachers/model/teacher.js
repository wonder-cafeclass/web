"use strict";
var my_array_1 = require('../../util/helper/my-array');
var my_is_1 = require('../../util/helper/my-is');
var my_time_1 = require('../../util/helper/my-time');
var my_format_1 = require('../../util/helper/my-format');
var my_mobile_1 = require('../../util/helper/my-mobile');
var my_birthday_1 = require('../../util/helper/my-birthday');
var Teacher = (function () {
    function Teacher() {
        this.id = -1;
        this.user_id = -1;
        this.nickname = "";
        this.name = "";
        this.gender = "";
        this.birthday = "";
        this.thumbnail = "";
        this.thumbnail_url = ""; // @ Deprecated
        this.status = "";
        this.mobile = "";
        this.email = "";
        this.resume = "";
        this.resume_arr = [];
        this.greeting = "";
        this.greeting_arr = [];
        this.memo = "";
        this.date_created = "";
        this.date_updated = "";
        this.delimiter = "|||";
        this.myArray = null;
        this.myIs = null;
        this.myTime = null;
        this.myFormat = null;
        this.myMobile = null;
        this.myBirthday = null;
        this.myArray = new my_array_1.HelperMyArray();
        this.myIs = new my_is_1.HelperMyIs();
        this.myTime = new my_time_1.HelperMyTime();
        this.myFormat = new my_format_1.HelperMyFormat();
        this.myMobile = new my_mobile_1.HelperMyMobile();
        this.myBirthday = new my_birthday_1.HelperMyBirthday();
    }
    Teacher.prototype.set = function (id, user_id, nickname, name, gender, birthday, thumbnail, status, mobile, email, resume, greeting, memo, date_created, date_updated) {
        this.id = id;
        this.user_id = user_id;
        this.nickname = nickname;
        this.name = name;
        this.gender = gender;
        this.setBirthday(birthday);
        this.thumbnail = thumbnail;
        this.status = status;
        this.setMobile(mobile);
        this.email = email;
        this.resume = resume;
        this.greeting = greeting;
        this.memo = memo;
        this.date_created = date_created;
        this.date_updated = date_updated;
        return this;
    }; // end method
    Teacher.prototype.setMobile = function (mobile) {
        this.mobile = mobile;
        this.myMobile.set(mobile);
    };
    Teacher.prototype.setBirthday = function (birthday) {
        this.birthday = birthday;
        this.myBirthday.set(birthday);
    };
    Teacher.prototype.getResumeArr = function () {
        if (null == this.resume || "" === this.resume) {
            return [];
        }
        return this.resume.split(this.delimiter);
    };
    Teacher.prototype.copy = function () {
        return this.myIs.copy(
        // src:any
        this, 
        // copy:any
        new Teacher());
    }; // end method
    Teacher.prototype.setJSON = function (json) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("klass-teacher / setJSON / init");
        if (isDebug)
            console.log("klass-teacher / setJSON / json : ", json);
        var teacher = this._setJSON(json);
        if (isDebug)
            console.log("klass-teacher / setJSON / teacher : ", teacher);
        // json 자동 설정 이후의 추가 작업을 여기서 합니다.
        teacher.setMobile(teacher.mobile);
        teacher.setBirthday(teacher.birthday);
        return teacher;
    }; // end method
    Teacher.prototype._setJSON = function (json) {
        return this.myIs.copyFromJSON(
        // target:any,
        this, 
        // json
        json);
    }; // end method 
    // Mobile Methods - INIT
    Teacher.prototype.getMobileArr = function () {
        return this.myMobile.getMobileArr();
    };
    // Head
    Teacher.prototype.setMobileHead = function (mobileHead) {
        this.mobile = this.myMobile.getMobileWithNewHead(mobileHead);
    };
    Teacher.prototype.getMobileHead = function () {
        return this.myMobile.getMobileHead();
    };
    Teacher.prototype.isMobileHeadEmpty = function () {
        return this.myMobile.isMobileHeadEmpty();
    };
    Teacher.prototype.isNotSameMobileHead = function (target) {
        return this.myMobile.isMobileHeadNotSame(target);
    };
    Teacher.prototype.isSameMobileHead = function (target) {
        return this.myMobile.isMobileHeadSame(target);
    };
    // Body
    Teacher.prototype.setMobileBody = function (mobileBody) {
        this.mobile = this.myMobile.getMobileWithNewBody(mobileBody);
    };
    Teacher.prototype.getMobileBody = function () {
        return this.myMobile.getMobileBody();
    };
    Teacher.prototype.isNotSameMobileBody = function (target) {
        return this.myMobile.isMobileBodyNotSame(target);
    };
    Teacher.prototype.isSameMobileBody = function (target) {
        return this.myMobile.isMobileBodySame(target);
    };
    // Tail
    Teacher.prototype.setMobileTail = function (mobileTail) {
        this.mobile = this.myMobile.getMobileWithNewTail(mobileTail);
    };
    Teacher.prototype.getMobileTail = function () {
        return this.myMobile.getMobileTail();
    };
    Teacher.prototype.isNotSameMobileTail = function (target) {
        return this.myMobile.isMobileTailNotSame(target);
    };
    Teacher.prototype.isSameMobileTail = function (target) {
        return this.myMobile.isMobileTailSame(target);
    };
    // Mobile Methods - DONE
    // Birthday Methods - INIT
    Teacher.prototype.getBirthdayArr = function () {
        return this.myBirthday.getBirthdayArr();
    };
    // Year
    Teacher.prototype.setBirthYear = function (newBirthYear) {
        this.birthday = this.myBirthday.getBirthdayWithNewBirthYear(newBirthYear);
    };
    Teacher.prototype.getBirthYear = function () {
        return this.myBirthday.getBirthYear();
    };
    Teacher.prototype.isNotSameBirthYear = function (target) {
        return this.myBirthday.isBirthYearNotSame(target);
    };
    Teacher.prototype.isSameBirthYear = function (target) {
        return this.myBirthday.isBirthYearSame(target);
    };
    // Month
    Teacher.prototype.setBirthMonth = function (newBirthMonth) {
        this.birthday = this.myBirthday.getBirthdayWithNewBirthMonth(newBirthMonth);
    };
    Teacher.prototype.getBirthMonth = function () {
        return this.myBirthday.getBirthMonth();
    };
    Teacher.prototype.isNotSameBirthMonth = function (target) {
        return this.myBirthday.isBirthMonthNotSame(target);
    };
    Teacher.prototype.isSameBirthMonth = function (target) {
        return this.myBirthday.isBirthMonthSame(target);
    };
    // Day
    Teacher.prototype.setBirthDay = function (newBirthDay) {
        this.birthday = this.myBirthday.getBirthdayWithNewBirthDay(newBirthDay);
    };
    Teacher.prototype.getBirthDay = function () {
        return this.myBirthday.getBirthDay();
    };
    Teacher.prototype.isNotSameBirthDay = function (target) {
        return this.myBirthday.isBirthDayNotSame(target);
    };
    Teacher.prototype.isSameBirthDay = function (target) {
        return this.myBirthday.isBirthDaySame(target);
    };
    // Birthday Methods - DONE	
    // @ 사용자가 변경 가능한 값들을 기준으로 비교, 결과를 알려준다.
    Teacher.prototype.isNotSame = function (teacher) {
        return !this.isSame(teacher);
    };
    Teacher.prototype.isSame = function (teacher) {
        if (this.name !== teacher.name) {
            return false;
        }
        if (this.email !== teacher.email) {
            return false;
        }
        if (this.nickname !== teacher.nickname) {
            return false;
        }
        if (this.gender !== teacher.gender) {
            return false;
        }
        if (this.birthday !== teacher.birthday) {
            return false;
        }
        if (this.thumbnail !== teacher.thumbnail) {
            return false;
        }
        if (this.mobile !== teacher.mobile) {
            return false;
        }
        if (this.resume !== teacher.resume) {
            return false;
        }
        if (this.greeting !== teacher.greeting) {
            return false;
        } // end if
        return true;
    };
    return Teacher;
}());
exports.Teacher = Teacher;
//# sourceMappingURL=teacher.js.map