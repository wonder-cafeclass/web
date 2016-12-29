"use strict";
var my_is_1 = require('../../util/helper/my-is');
var my_mobile_1 = require('../../util/helper/my-mobile');
var my_birthday_1 = require('../../util/helper/my-birthday');
var teacher_1 = require('../../teachers/model/teacher');
var User = (function () {
    function User() {
        this.id = -1;
        this.nickname = "";
        this.name = "";
        this.gender = "";
        this.birthday = "";
        this.thumbnail = "";
        this.status = "";
        this.permission = "";
        this.kakao_id = "";
        this.naver_id = "";
        this.facebook_id = "";
        this.google_id = "";
        this.mobile = "";
        this.email = "";
        this.date_created = "";
        this.date_updated = "";
        this.myMobile = null;
        this.myBirthday = null;
        this.myIs = null;
        this.isAdmin = false;
        this.myMobile = new my_mobile_1.HelperMyMobile();
        this.myBirthday = new my_birthday_1.HelperMyBirthday();
        this.myIs = new my_is_1.HelperMyIs();
    }
    User.prototype.set = function (id, nickname, name, gender, birthday, thumbnail, status, permission, kakao_id, naver_id, facebook_id, google_id, mobile, email, date_created, date_updated) {
        this.id = id;
        this.nickname = nickname;
        this.name = name;
        this.gender = gender;
        this.setBirthday(birthday);
        this.thumbnail = thumbnail;
        this.status = status;
        this.permission = permission;
        this.kakao_id = kakao_id;
        this.naver_id = naver_id;
        this.facebook_id = facebook_id;
        this.google_id = google_id;
        this.setMobile(mobile);
        this.email = email;
        this.date_created = date_created;
        this.date_updated = date_updated;
        return this;
    }; // end method
    User.prototype.setMobile = function (mobile) {
        this.mobile = mobile;
        this.myBirthday.set(this.birthday);
    };
    User.prototype.setBirthday = function (birthday) {
        this.birthday = birthday;
        this.myMobile.set(this.mobile);
    };
    User.prototype.setJSON = function (json) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("klass / setJSON / init");
        if (isDebug)
            console.log("klass / setJSON / json : ", json);
        var user = this._setJSON(json);
        user.setMobile(user.mobile);
        user.setBirthday(user.birthday);
        if (null != json.teacher) {
            var teacher = new teacher_1.Teacher().setJSON(json.teacher);
            user.setTeacher(teacher);
        }
        if (isDebug)
            console.log("klass / setJSON / user : ", user);
        return user;
    }; // end method	
    User.prototype._setJSON = function (json) {
        return this.myIs.copyFromJSON(
        // target:any,
        this, 
        // json
        json);
    }; // end method	
    User.prototype.setIsAdmin = function (isAdmin) {
        if (null == isAdmin) {
            return;
        }
        this.isAdmin = isAdmin;
    };
    User.prototype.getIsAdmin = function () {
        return this.isAdmin;
    };
    User.prototype.isTeacher = function () {
        return (null != this.teacher) ? true : false;
    };
    User.prototype.getTeacher = function () {
        return this.teacher;
    };
    User.prototype.setTeacher = function (teacher) {
        if (null == teacher) {
            return;
        }
        this.teacher = teacher;
    };
    User.prototype.getTeacherId = function () {
        if (!this.isTeacher()) {
            return -1;
        }
        return +this.teacher.id;
    };
    // @ Desc : 선생님으로 새롭게 등록하는 경우, 유저 정보에서 선생님 정보로 복사합니다.
    User.prototype.getNewTeacherFromUser = function () {
        var newTeacher = null;
        if (null == this.teacher) {
            newTeacher = new teacher_1.Teacher();
        }
        else {
            newTeacher = this.teacher.copy();
        }
        newTeacher.user_id = this.id;
        newTeacher.email = this.email;
        newTeacher.name = this.name;
        newTeacher.nickname = this.nickname;
        newTeacher.greeting = "";
        newTeacher.resume = "";
        newTeacher.thumbnail = this.thumbnail;
        newTeacher.setMobile(this.mobile);
        newTeacher.gender = this.gender;
        newTeacher.setBirthday(this.birthday);
        return newTeacher;
    };
    // Common Properties - INIT
    User.prototype.isNotSameName = function (name) {
        return !this.isSameName(name);
    };
    User.prototype.isSameName = function (name) {
        if (null != name && name === this.name) {
            return true;
        }
        return false;
    };
    User.prototype.isNotSameNickname = function (nickname) {
        return !this.isSameNickname(nickname);
    };
    User.prototype.isSameNickname = function (nickname) {
        if (null != nickname && nickname === this.nickname) {
            return true;
        }
        return false;
    };
    User.prototype.isNotSameGender = function (gender) {
        return !this.isSameGender(gender);
    };
    User.prototype.isSameGender = function (gender) {
        if (null != gender && gender === this.gender) {
            return true;
        }
        return false;
    };
    User.prototype.isNotSameThumbnail = function (thumbnail) {
        return !this.isSameThumbnail(thumbnail);
    };
    User.prototype.isSameThumbnail = function (thumbnail) {
        if (null != thumbnail && thumbnail === this.thumbnail) {
            return true;
        }
        return false;
    };
    User.prototype.isEmptyThumbnail = function () {
        return (null == this.thumbnail || "" === this.thumbnail) ? true : false;
    };
    // Common Properties - DONE	
    // Platforms - INIT
    User.prototype.isFacebookUser = function () {
        return (null != this.facebook_id && "" != this.facebook_id) ? true : false;
    };
    User.prototype.isKakaoUser = function () {
        return (null != this.kakao_id && "" != this.kakao_id) ? true : false;
    };
    User.prototype.isNaverUser = function () {
        return (null != this.naver_id && "" != this.naver_id) ? true : false;
    };
    User.prototype.isGoogleUser = function () {
        return (null != this.google_id && "" != this.google_id) ? true : false;
    };
    User.prototype.isPlatformUser = function () {
        return (this.isFacebookUser() || this.isKakaoUser() || this.isGoogleUser() || this.isNaverUser()) ? true : false;
    };
    // Platforms - DONE 
    // Mobile Methods - INIT
    User.prototype.getMobileArr = function () {
        return this.myMobile.getMobileArr();
    };
    User.prototype.setMobileHead = function (mobileHead) {
        this.mobile = this.myMobile.getMobileWithNewHead(mobileHead);
    };
    User.prototype.getMobileHead = function () {
        return this.myMobile.getMobileHead();
    };
    User.prototype.isMobileHeadEmpty = function () {
        return this.myMobile.isMobileHeadEmpty();
    };
    User.prototype.isNotSameMobileHead = function (target) {
        return this.myMobile.isMobileHeadNotSame(target);
    };
    User.prototype.isSameMobileHead = function (target) {
        return this.myMobile.isMobileHeadSame(target);
    };
    User.prototype.setMobileBody = function (mobileBody) {
        this.mobile = this.myMobile.getMobileWithNewBody(mobileBody);
    };
    User.prototype.getMobileBody = function () {
        return this.myMobile.getMobileBody();
    };
    User.prototype.isNotSameMobileBody = function (target) {
        return this.myMobile.isMobileBodyNotSame(target);
    };
    User.prototype.isSameMobileBody = function (target) {
        return this.myMobile.isMobileBodySame(target);
    };
    User.prototype.setMobileTail = function (mobileTail) {
        this.mobile = this.myMobile.getMobileWithNewTail(mobileTail);
    };
    User.prototype.getMobileTail = function () {
        return this.myMobile.getMobileTail();
    };
    User.prototype.isNotSameMobileTail = function (target) {
        return this.myMobile.isMobileTailNotSame(target);
    };
    User.prototype.isSameMobileTail = function (target) {
        return this.myMobile.isMobileTailSame(target);
    };
    // Mobile Methods - DONE
    // Birthday Methods - INIT
    User.prototype.getBirthdayArr = function () {
        return this.myBirthday.getBirthdayArr();
    };
    User.prototype.setBirthYear = function (newBirthYear) {
        this.birthday = this.myBirthday.getBirthdayWithNewBirthYear(newBirthYear);
    };
    User.prototype.getBirthYear = function () {
        return this.myBirthday.getBirthYear();
    };
    User.prototype.isNotSameBirthYear = function (target) {
        return this.myBirthday.isBirthYearNotSame(target);
    };
    User.prototype.isSameBirthYear = function (target) {
        return this.myBirthday.isBirthYearSame(target);
    };
    User.prototype.setBirthMonth = function (newBirthMonth) {
        this.birthday = this.myBirthday.getBirthdayWithNewBirthMonth(newBirthMonth);
    };
    User.prototype.getBirthMonth = function () {
        return this.myBirthday.getBirthMonth();
    };
    User.prototype.isNotSameBirthMonth = function (target) {
        return this.myBirthday.isBirthMonthNotSame(target);
    };
    User.prototype.isSameBirthMonth = function (target) {
        return this.myBirthday.isBirthMonthSame(target);
    };
    User.prototype.setBirthDay = function (newBirthDay) {
        this.birthday = this.myBirthday.getBirthdayWithNewBirthDay(newBirthDay);
    };
    User.prototype.getBirthDay = function () {
        return this.myBirthday.getBirthDay();
    };
    User.prototype.isNotSameBirthDay = function (target) {
        return this.myBirthday.isBirthDayNotSame(target);
    };
    User.prototype.isSameBirthDay = function (target) {
        return this.myBirthday.isBirthDaySame(target);
    };
    // Birthday Methods - DONE
    User.prototype.updateWithJSON = function (userJSON) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("user.model / updateWithJson / init");
        if (null == userJSON) {
            if (isDebug)
                console.log("user.model / updateWithJson / 중단 / userJSON is not valid!");
            return;
        }
        this.id = +userJSON["id"];
        this.nickname = userJSON["nickname"];
        this.name = userJSON["name"];
        this.gender = userJSON["gender"];
        this.birthday = userJSON["birthday"];
        this.thumbnail = userJSON["thumbnail"];
        this.status = userJSON["status"];
        this.permission = userJSON["permission"];
        this.kakao_id = userJSON["kakao_id"];
        this.naver_id = userJSON["naver_id"];
        this.facebook_id = userJSON["facebook_id"];
        this.google_id = userJSON["google_id"];
        this.mobile = userJSON["mobile"];
        this.email = userJSON["email"];
        this.date_created = userJSON["date_created"];
        this.date_updated = userJSON["date_updated"];
    };
    User.prototype.copy = function () {
        return this.myIs.copy(
        // src:any
        this, 
        // copy:any
        new User());
    }; // end method
    // @ 사용자가 변경 가능한 값들을 기준으로 비교, 결과를 알려준다.
    User.prototype.isNotSame = function (user) {
        return !this.isSame(user);
    };
    User.prototype.isSame = function (user) {
        if (this.name !== user.name) {
            return false;
        }
        if (this.email !== user.email) {
            return false;
        }
        if (this.nickname !== user.nickname) {
            return false;
        }
        if (this.kakao_id !== user.kakao_id) {
            return false;
        }
        if (this.naver_id !== user.naver_id) {
            return false;
        }
        if (this.facebook_id !== user.facebook_id) {
            return false;
        }
        if (this.google_id !== user.google_id) {
            return false;
        }
        if (this.gender !== user.gender) {
            return false;
        }
        if (this.birthday !== user.birthday) {
            return false;
        }
        if (this.thumbnail !== user.thumbnail) {
            return false;
        }
        if (this.mobile !== user.mobile) {
            return false;
        }
        return true;
    };
    return User;
}());
exports.User = User;
//# sourceMappingURL=user.js.map