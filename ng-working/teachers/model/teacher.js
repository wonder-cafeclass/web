"use strict";
var mobile_1 = require('../../util/helper/mobile');
var birthday_1 = require('../../util/helper/birthday');
var Teacher = (function () {
    function Teacher(id, user_id, nickname, name, gender, resume, greeting, birthday, thumbnail, status, permission, mobile, email, date_created, date_updated) {
        this.id = id;
        this.user_id = user_id;
        this.nickname = nickname;
        this.name = name;
        this.gender = gender;
        this.resume = resume;
        this.greeting = greeting;
        this.birthday = birthday;
        this.thumbnail = thumbnail;
        this.status = status;
        this.permission = permission;
        this.mobile = mobile;
        this.email = email;
        this.date_created = date_created;
        this.date_updated = date_updated;
        // 휴대 전화번호를 관리하는 객체를 만듭니다.
        this.helperMobile = new mobile_1.HelperMobile(this.mobile);
        // 생일을 관리하는 객체를 만듭니다.
        this.helperBirthday = new birthday_1.HelperBirthday(this.birthday);
    }
    // Common Properties - INIT
    Teacher.prototype.isNotSameName = function (name) {
        return !this.isSameName(name);
    };
    Teacher.prototype.isSameName = function (name) {
        if (null != name && name === this.name) {
            return true;
        }
        return false;
    };
    Teacher.prototype.isNotSameNickname = function (nickname) {
        return !this.isSameNickname(nickname);
    };
    Teacher.prototype.isSameNickname = function (nickname) {
        if (null != nickname && nickname === this.nickname) {
            return true;
        }
        return false;
    };
    Teacher.prototype.isNotSameGender = function (gender) {
        return !this.isSameGender(gender);
    };
    Teacher.prototype.isSameGender = function (gender) {
        if (null != gender && gender === this.gender) {
            return true;
        }
        return false;
    };
    Teacher.prototype.isNotSameResume = function (resume) {
        return !this.isSameResume(resume);
    };
    Teacher.prototype.isSameResume = function (resume) {
        if (null != resume && resume === this.resume) {
            return true;
        }
        return false;
    };
    Teacher.prototype.isNotSameGreeting = function (greeting) {
        return !this.isSameGreeting(greeting);
    };
    Teacher.prototype.isSameGreeting = function (greeting) {
        if (null != greeting && greeting === this.greeting) {
            return true;
        }
        return false;
    };
    Teacher.prototype.isNotSameThumbnail = function (thumbnail) {
        return !this.isSameThumbnail(thumbnail);
    };
    Teacher.prototype.isSameThumbnail = function (thumbnail) {
        if (null != thumbnail && thumbnail === this.thumbnail) {
            return true;
        }
        return false;
    };
    Teacher.prototype.isEmptyThumbnail = function () {
        return (null == this.thumbnail || "" === this.thumbnail) ? true : false;
    };
    Teacher.prototype.getMobileArr = function () {
        return this.helperMobile.getMobileArr();
    };
    // Head
    Teacher.prototype.setMobileHead = function (mobileHead) {
        this.mobile = this.helperMobile.getMobileWithNewHead(mobileHead);
    };
    Teacher.prototype.getMobileHead = function () {
        return this.helperMobile.getMobileHead();
    };
    Teacher.prototype.isMobileHeadEmpty = function () {
        return this.helperMobile.isMobileHeadEmpty();
    };
    Teacher.prototype.isNotSameMobileHead = function (target) {
        return this.helperMobile.isMobileHeadNotSame(target);
    };
    Teacher.prototype.isSameMobileHead = function (target) {
        return this.helperMobile.isMobileHeadSame(target);
    };
    // Body
    Teacher.prototype.setMobileBody = function (mobileBody) {
        this.mobile = this.helperMobile.getMobileWithNewBody(mobileBody);
    };
    Teacher.prototype.getMobileBody = function () {
        return this.helperMobile.getMobileBody();
    };
    Teacher.prototype.isNotSameMobileBody = function (target) {
        return this.helperMobile.isMobileBodyNotSame(target);
    };
    Teacher.prototype.isSameMobileBody = function (target) {
        return this.helperMobile.isMobileBodySame(target);
    };
    // Tail
    Teacher.prototype.setMobileTail = function (mobileTail) {
        this.mobile = this.helperMobile.getMobileWithNewTail(mobileTail);
    };
    Teacher.prototype.getMobileTail = function () {
        return this.helperMobile.getMobileTail();
    };
    Teacher.prototype.isNotSameMobileTail = function (target) {
        return this.helperMobile.isMobileTailNotSame(target);
    };
    Teacher.prototype.isSameMobileTail = function (target) {
        return this.helperMobile.isMobileTailSame(target);
    };
    Teacher.prototype.getBirthdayArr = function () {
        return this.helperBirthday.getBirthdayArr();
    };
    // Year
    Teacher.prototype.setBirthYear = function (newBirthYear) {
        this.birthday = this.helperBirthday.getBirthdayWithNewBirthYear(newBirthYear);
    };
    Teacher.prototype.getBirthYear = function () {
        return this.helperBirthday.getBirthYear();
    };
    Teacher.prototype.isNotSameBirthYear = function (target) {
        return this.helperBirthday.isBirthYearNotSame(target);
    };
    Teacher.prototype.isSameBirthYear = function (target) {
        return this.helperBirthday.isBirthYearSame(target);
    };
    // Month
    Teacher.prototype.setBirthMonth = function (newBirthMonth) {
        this.birthday = this.helperBirthday.getBirthdayWithNewBirthMonth(newBirthMonth);
    };
    Teacher.prototype.getBirthMonth = function () {
        return this.helperBirthday.getBirthMonth();
    };
    Teacher.prototype.isNotSameBirthMonth = function (target) {
        return this.helperBirthday.isBirthMonthNotSame(target);
    };
    Teacher.prototype.isSameBirthMonth = function (target) {
        return this.helperBirthday.isBirthMonthSame(target);
    };
    // Day
    Teacher.prototype.setBirthDay = function (newBirthDay) {
        this.birthday = this.helperBirthday.getBirthdayWithNewBirthDay(newBirthDay);
    };
    Teacher.prototype.getBirthDay = function () {
        return this.helperBirthday.getBirthDay();
    };
    Teacher.prototype.isNotSameBirthDay = function (target) {
        return this.helperBirthday.isBirthDayNotSame(target);
    };
    Teacher.prototype.isSameBirthDay = function (target) {
        return this.helperBirthday.isBirthDaySame(target);
    };
    // Birthday Methods - DONE	
    Teacher.prototype.updateWithJSON = function (teacherJSON) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("teacher.model / updateWithJson / init");
        if (null == teacherJSON) {
            if (isDebug)
                console.log("teacher.model / updateWithJson / 중단 / teacherJSON is not valid!");
            return;
        }
        this.id = +teacherJSON["id"];
        this.nickname = teacherJSON["nickname"];
        this.resume = teacherJSON["resume"];
        this.greeting = teacherJSON["greeting"];
        this.name = teacherJSON["name"];
        this.gender = teacherJSON["gender"];
        this.birthday = teacherJSON["birthday"];
        this.thumbnail = teacherJSON["thumbnail"];
        this.status = teacherJSON["status"];
        this.permission = teacherJSON["permission"];
        this.mobile = teacherJSON["mobile"];
        this.email = teacherJSON["email"];
        this.date_created = teacherJSON["date_created"];
        this.date_updated = teacherJSON["date_updated"];
    };
    Teacher.prototype.copy = function () {
        return new Teacher(
        // public id:number,
        this.id, 
        // public user_id:number,
        this.user_id, 
        // public nickname:string,
        this.nickname, 
        // public name:string,
        this.name, 
        // public gender:string,
        this.gender, 
        // public resume:string,
        this.resume, 
        // public greeting:string,
        this.greeting, 
        // public birthday:string, 
        this.birthday, 
        // public thumbnail:string,
        this.thumbnail, 
        // public status:string,
        this.status, 
        // public permission:string,
        this.permission, 
        // public mobile:string,
        this.mobile, 
        // public email:string,
        this.email, 
        // public date_created:string,
        this.date_created, 
        // public date_updated:string			
        this.date_updated);
    };
    return Teacher;
}());
exports.Teacher = Teacher;
//# sourceMappingURL=teacher.js.map