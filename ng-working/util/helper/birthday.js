"use strict";
/*
*	@ Desc : 생일 관련 처리 로직. ex) 1990-01-21 / @ Deprecated
*/
var HelperBirthday = (function () {
    function HelperBirthday(birthdayStr) {
        this.birthdayStr = birthdayStr;
        this.head = "";
        this.body = "";
        this.tail = "";
        this.update(this.birthdayStr);
    }
    HelperBirthday.prototype.update = function (birthdayStr) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("helper.birth / update / init");
        if (null == birthdayStr || "" == birthdayStr) {
            return;
        }
        if (isDebug)
            console.log("helper.birth / update / BEFORE / birthdayStr : ", birthdayStr);
        this.birthdayStr = birthdayStr;
        if (isDebug)
            console.log("helper.birth / update / AFTER / birthdayStr : ", birthdayStr);
        // 초기화.
        this.head = "";
        this.body = "";
        this.tail = "";
        if (isDebug)
            console.log("helper.birth / update / this.birthdayStr : ", this.birthdayStr);
        var birthArr = this.birthdayStr.split("-");
        if (isDebug)
            console.log("helper.birth / update / birthArr : ", birthArr);
        if (null != birthArr && 3 == birthArr.length) {
            this.head = birthArr[0];
            this.body = birthArr[1];
            this.tail = birthArr[2];
        }
    };
    HelperBirthday.prototype.getBirthdayArr = function () {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("helper.birth / getBirthdayArr / init");
        return [this.head, this.body, this.tail];
    };
    // HEAD
    HelperBirthday.prototype.getBirthYear = function () {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("helper.birth / getBirthYear / init");
        var birthArr = this.getBirthdayArr();
        return birthArr[0];
    };
    HelperBirthday.prototype.getBirthdayWithNewBirthYear = function (newHead) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("helper.birth / getBirthdayWithNewBirthYear / init");
        if (null == newHead || "" == newHead) {
            return this.birthdayStr;
        }
        if (isDebug)
            console.log("helper.birth / getBirthdayWithNewBirthYear / this.birthdayStr : ", this.birthdayStr);
        var birthArr = this.getBirthdayArr();
        var newBirthdayDigits = newHead + "-" + birthArr[1] + "-" + birthArr[2];
        if (isDebug)
            console.log("helper.birth / getBirthdayWithNewBirthYear / newBirthdayDigits : ", newBirthdayDigits);
        this.update(newBirthdayDigits);
        return newBirthdayDigits;
    };
    HelperBirthday.prototype.isBirthYearNotEmpty = function () {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("helper.birth / isBirthYearNotEmpty / init");
        return !this.isBirthYearEmpty();
    };
    HelperBirthday.prototype.isBirthYearEmpty = function () {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("helper.birth / isBirthYearEmpty / init");
        var birthYear = this.getBirthYear();
        return (null == birthYear || "" == birthYear) ? true : false;
    };
    HelperBirthday.prototype.isBirthYearNotSame = function (target) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("helper.birth / isBirthYearNotSame / init");
        return !this.isBirthYearSame(target);
    };
    HelperBirthday.prototype.isBirthYearSame = function (target) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("helper.birth / isBirthYearSame / init");
        if (null == target || "" === target) {
            return false;
        }
        var birthYear = this.getBirthYear();
        return (birthYear === target) ? true : false;
    };
    // BODY
    HelperBirthday.prototype.getBirthMonth = function () {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("helper.birth / getBirthMonth / init");
        var birthArr = this.getBirthdayArr();
        return birthArr[1];
    };
    HelperBirthday.prototype.getBirthdayWithNewBirthMonth = function (newBody) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("helper.birth / getBirthdayWithNewBirthMonth / init");
        if (null == newBody || "" == newBody) {
            return this.birthdayStr;
        }
        if (isDebug)
            console.log("helper.birth / getBirthdayWithNewBirthMonth / this.birthdayStr : ", this.birthdayStr);
        var birthArr = this.getBirthdayArr();
        var newBirthdayDigits = birthArr[0] + "-" + newBody + "-" + birthArr[2];
        if (isDebug)
            console.log("helper.birth / getBirthdayWithNewBirthMonth / newBirthdayDigits : ", newBirthdayDigits);
        this.update(newBirthdayDigits);
        return newBirthdayDigits;
    };
    HelperBirthday.prototype.isBirthMonthNotEmpty = function () {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("helper.birth / isBirthMonthNotEmpty / init");
        return !this.isBirthMonthEmpty();
    };
    HelperBirthday.prototype.isBirthMonthEmpty = function () {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("helper.birth / isBirthMonthEmpty / init");
        var birthMonth = this.getBirthMonth();
        return (null == birthMonth || "" == birthMonth) ? true : false;
    };
    HelperBirthday.prototype.isBirthMonthNotSame = function (target) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("helper.birth / isBirthMonthNotSame / init");
        return !this.isBirthMonthSame(target);
    };
    HelperBirthday.prototype.isBirthMonthSame = function (target) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("helper.birth / isBirthMonthSame / init");
        if (null == target || "" === target) {
            return false;
        }
        var birthMonth = this.getBirthMonth();
        return (birthMonth === target) ? true : false;
    };
    // TAIL
    HelperBirthday.prototype.getBirthDay = function () {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("helper.birth / getBirthDay / init");
        var birthArr = this.getBirthdayArr();
        return birthArr[2];
    };
    HelperBirthday.prototype.getBirthdayWithNewBirthDay = function (newTail) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("helper.birth / getBirthdayWithNewBirthDay / init");
        if (null == newTail || "" == newTail) {
            return this.birthdayStr;
        }
        if (isDebug)
            console.log("helper.birth / getBirthdayWithNewBirthDay / this.birthdayStr : ", this.birthdayStr);
        var birthArr = this.getBirthdayArr();
        var newBirthdayDigits = birthArr[0] + "-" + birthArr[1] + "-" + newTail;
        if (isDebug)
            console.log("helper.birth / getBirthdayWithNewBirthDay / newBirthdayDigits : ", newBirthdayDigits);
        this.update(newBirthdayDigits);
        return newBirthdayDigits;
    };
    HelperBirthday.prototype.isBirthDayNotEmpty = function () {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("helper.birth / isBirthDayNotEmpty / init");
        return !this.isBirthDayEmpty();
    };
    HelperBirthday.prototype.isBirthDayEmpty = function () {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("helper.birth / isBirthDayEmpty / init");
        var birthDay = this.getBirthDay();
        return (null == birthDay || "" == birthDay) ? true : false;
    };
    HelperBirthday.prototype.isBirthDayNotSame = function (target) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("helper.birth / isBirthDayNotSame / init");
        return !this.isBirthDaySame(target);
    };
    HelperBirthday.prototype.isBirthDaySame = function (target) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("helper.birth / isBirthDaySame / init");
        if (null == target || "" === target) {
            return false;
        }
        var birthDay = this.getBirthDay();
        return (birthDay === target) ? true : false;
    }; // end method
    return HelperBirthday;
}());
exports.HelperBirthday = HelperBirthday; // end class
//# sourceMappingURL=birthday.js.map