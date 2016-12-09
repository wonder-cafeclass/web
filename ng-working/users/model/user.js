"use strict";
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
    }
    User.prototype.getMobileArr = function () {
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("user.model / getMobileArr / init");
        var mobileArr = this.mobile.split("-");
        var mobileHead = "";
        var mobileBody = "";
        var mobileTail = "";
        if (isDebug)
            console.log("user.model / getMobileArr / mobileArr : ", mobileArr);
        if (null != mobileArr && 3 == mobileArr.length) {
            mobileHead = mobileArr[0];
            mobileBody = mobileArr[1];
            mobileTail = mobileArr[2];
        }
        return [mobileHead, mobileBody, mobileTail];
    };
    User.prototype.getMobileHead = function () {
        var mobileArr = this.getMobileArr();
        return mobileArr[0];
    };
    User.prototype.isSameMobileHead = function (target) {
        var mobileHead = this.getMobileHead();
        if (null == mobileHead || "" === mobileHead) {
            return false;
        }
        return (mobileHead === target) ? true : false;
    };
    User.prototype.getMobileBody = function () {
        var mobileArr = this.getMobileArr();
        return mobileArr[1];
    };
    User.prototype.isSameMobileBody = function (target) {
        var mobileBody = this.getMobileBody();
        if (null == mobileBody || "" === mobileBody) {
            return false;
        }
        return (mobileBody === target) ? true : false;
    };
    User.prototype.getMobileTail = function () {
        var mobileArr = this.getMobileArr();
        return mobileArr[2];
    };
    User.prototype.isSameMobileTail = function (target) {
        var mobileTail = this.getMobileTail();
        if (null == mobileTail || "" === mobileTail) {
            return false;
        }
        return (mobileTail === target) ? true : false;
    };
    User.prototype.getBirthdayArr = function () {
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("user.model / getBirthdayArr / init");
        var birthdayArr = this.birthday.split("-");
        var birthYear = "";
        var birthMonth = "";
        var birthDay = "";
        if (isDebug)
            console.log("user.model / getBirthdayArr / birthdayArr : ", birthdayArr);
        if (null != birthdayArr && 3 == birthdayArr.length) {
            birthYear = birthdayArr[0];
            birthMonth = birthdayArr[1];
            birthDay = birthdayArr[2];
        }
        return [birthYear, birthMonth, birthDay];
    };
    User.prototype.getBirthYear = function () {
        var birthdayArr = this.getBirthdayArr();
        return birthdayArr[0];
    };
    User.prototype.isSameBirthYear = function (target) {
        var birthdayHead = this.getBirthYear();
        if (null == birthdayHead || "" === birthdayHead) {
            return false;
        }
        return (birthdayHead === target) ? true : false;
    };
    User.prototype.getBirthMonth = function () {
        var birthdayArr = this.getBirthdayArr();
        return birthdayArr[1];
    };
    User.prototype.isSameBirthMonth = function (target) {
        var birthdayBody = this.getBirthMonth();
        if (null == birthdayBody || "" === birthdayBody) {
            return false;
        }
        return (birthdayBody === target) ? true : false;
    };
    User.prototype.getBirthDay = function () {
        var birthdayArr = this.getBirthdayArr();
        return birthdayArr[2];
    };
    User.prototype.isSameBirthDay = function (target) {
        var birthdayTail = this.getBirthDay();
        if (null == birthdayTail || "" === birthdayTail) {
            return false;
        }
        return (birthdayTail === target) ? true : false;
    };
    User.prototype.updateWithJSON = function (userJSON) {
        var isDebug = true;
        // let isDebug:boolean = false;
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
    return User;
}());
exports.User = User;
//# sourceMappingURL=user.js.map