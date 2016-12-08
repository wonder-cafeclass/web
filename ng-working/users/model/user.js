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