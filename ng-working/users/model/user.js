"use strict";
var mobile_1 = require('../../util/helper/mobile');
var birthday_1 = require('../../util/helper/birthday');
var User = (function () {
    function User(id, nickname, name, gender, birthday, thumbnail, status, permission, kakao_id, naver_id, facebook_id, google_id, mobile, email, date_created, date_updated) {
        this.id = id;
        this.nickname = nickname;
        this.name = name;
        this.gender = gender;
        this.birthday = birthday;
        this.thumbnail = thumbnail;
        this.status = status;
        this.permission = permission;
        this.kakao_id = kakao_id;
        this.naver_id = naver_id;
        this.facebook_id = facebook_id;
        this.google_id = google_id;
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
    User.prototype.getMobileArr = function () {
        return this.helperMobile.getMobileArr();
    };
    User.prototype.setMobileHead = function (mobileHead) {
        this.mobile = this.helperMobile.getMobileWithNewHead(mobileHead);
    };
    User.prototype.getMobileHead = function () {
        return this.helperMobile.getMobileHead();
    };
    User.prototype.isMobileHeadEmpty = function () {
        return this.helperMobile.isMobileHeadEmpty();
    };
    User.prototype.isNotSameMobileHead = function (target) {
        return this.helperMobile.isMobileHeadNotSame(target);
    };
    User.prototype.isSameMobileHead = function (target) {
        return this.helperMobile.isMobileHeadSame(target);
    };
    User.prototype.setMobileBody = function (mobileBody) {
        this.mobile = this.helperMobile.getMobileWithNewBody(mobileBody);
    };
    User.prototype.getMobileBody = function () {
        return this.helperMobile.getMobileBody();
    };
    User.prototype.isNotSameMobileBody = function (target) {
        return this.helperMobile.isMobileBodyNotSame(target);
    };
    User.prototype.isSameMobileBody = function (target) {
        return this.helperMobile.isMobileBodySame(target);
    };
    User.prototype.setMobileTail = function (mobileTail) {
        this.mobile = this.helperMobile.getMobileWithNewTail(mobileTail);
    };
    User.prototype.getMobileTail = function () {
        return this.helperMobile.getMobileTail();
    };
    User.prototype.isNotSameMobileTail = function (target) {
        return this.helperMobile.isMobileTailNotSame(target);
    };
    User.prototype.isSameMobileTail = function (target) {
        return this.helperMobile.isMobileTailSame(target);
    };
    User.prototype.getBirthdayArr = function () {
        return this.helperBirthday.getBirthdayArr();
    };
    User.prototype.setBirthYear = function (newBirthYear) {
        this.birthday = this.helperBirthday.getBirthdayWithNewBirthYear(newBirthYear);
    };
    User.prototype.getBirthYear = function () {
        return this.helperBirthday.getBirthYear();
    };
    User.prototype.isNotSameBirthYear = function (target) {
        return this.helperBirthday.isBirthYearNotSame(target);
    };
    User.prototype.isSameBirthYear = function (target) {
        return this.helperBirthday.isBirthYearSame(target);
    };
    User.prototype.setBirthMonth = function (newBirthMonth) {
        this.birthday = this.helperBirthday.getBirthdayWithNewBirthMonth(newBirthMonth);
    };
    User.prototype.getBirthMonth = function () {
        return this.helperBirthday.getBirthMonth();
    };
    User.prototype.isNotSameBirthMonth = function (target) {
        return this.helperBirthday.isBirthMonthNotSame(target);
    };
    User.prototype.isSameBirthMonth = function (target) {
        return this.helperBirthday.isBirthMonthSame(target);
    };
    User.prototype.setBirthDay = function (newBirthDay) {
        this.birthday = this.helperBirthday.getBirthdayWithNewBirthDay(newBirthDay);
    };
    User.prototype.getBirthDay = function () {
        return this.helperBirthday.getBirthDay();
    };
    User.prototype.isNotSameBirthDay = function (target) {
        return this.helperBirthday.isBirthDayNotSame(target);
    };
    User.prototype.isSameBirthDay = function (target) {
        return this.helperBirthday.isBirthDaySame(target);
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
        return new User(
        // public id:number,
        this.id, 
        // public nickname:string,
        this.nickname, 
        // public name:string,
        this.name, 
        // public gender:string,
        this.gender, 
        // public birthday:string, 
        this.birthday, 
        // public thumbnail:string,
        this.thumbnail, 
        // public status:string,
        this.status, 
        // public permission:string,
        this.permission, 
        // public kakao_id:string,
        this.kakao_id, 
        // public naver_id:string,
        this.naver_id, 
        // public facebook_id:string,
        this.facebook_id, 
        // public google_id:string,
        this.google_id, 
        // public mobile:string,
        this.mobile, 
        // public email:string,
        this.email, 
        // public date_created:string,
        this.date_created, 
        // public date_updated:string
        this.date_updated);
    };
    return User;
}());
exports.User = User;
//# sourceMappingURL=user.js.map