"use strict";
/*
*	@ Desc : 대한민국 휴대폰 번호 관련 처리 로직.
*/
var HelperMobile = (function () {
    function HelperMobile(mobileDigits) {
        this.mobileDigits = mobileDigits;
        this.head = "010";
        this.body = "";
        this.tail = "";
        this.update(this.mobileDigits);
    }
    HelperMobile.prototype.update = function (mobileDigits) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("helper.mobile / update / init");
        if (null == mobileDigits || "" == mobileDigits) {
            return;
        }
        // 초기화.
        this.head = "010";
        this.body = "";
        this.tail = "";
        var mobileArr = this.mobileDigits.split("-");
        if (isDebug)
            console.log("helper.mobile / update / mobileArr : ", mobileArr);
        if (null != mobileArr && 3 == mobileArr.length) {
            this.head = mobileArr[0];
            this.body = mobileArr[1];
            this.tail = mobileArr[2];
        }
    };
    HelperMobile.prototype.getMobileArr = function () {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("helper.mobile / getMobileArr / init");
        return [this.head, this.body, this.tail];
    };
    // HEAD
    HelperMobile.prototype.getMobileHead = function () {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("helper.mobile / getMobileHead / init");
        var mobileArr = this.getMobileArr();
        return mobileArr[0];
    };
    HelperMobile.prototype.getMobileWithNewHead = function (newHead) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("helper.mobile / getMobileWithNewHead / init");
        if (null == newHead || "" == newHead) {
            return this.mobileDigits;
        }
        var mobileArr = this.getMobileArr();
        var newMobileDigits = newHead + "-" + mobileArr[1] + "-" + mobileArr[2];
        this.update(newMobileDigits);
        return newMobileDigits;
    };
    HelperMobile.prototype.isMobileHeadNotEmpty = function () {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("helper.mobile / isMobileHeadNotEmpty / init");
        return !this.isMobileHeadEmpty();
    };
    HelperMobile.prototype.isMobileHeadEmpty = function () {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("helper.mobile / isMobileHeadEmpty / init");
        var mobileHead = this.getMobileHead();
        return (null == mobileHead || "" == mobileHead) ? true : false;
    };
    HelperMobile.prototype.isMobileHeadNotSame = function (target) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("helper.mobile / isMobileHeadNotSame / init");
        return !this.isMobileHeadSame(target);
    };
    HelperMobile.prototype.isMobileHeadSame = function (target) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("helper.mobile / isMobileHeadSame / init");
        if (null == target || "" === target) {
            return false;
        }
        var mobileHead = this.getMobileHead();
        return (mobileHead === target) ? true : false;
    };
    // BODY
    HelperMobile.prototype.getMobileBody = function () {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("helper.mobile / getMobileBody / init");
        var mobileArr = this.getMobileArr();
        return mobileArr[1];
    };
    HelperMobile.prototype.getMobileWithNewBody = function (newBody) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("helper.mobile / getMobileWithNewBody / init");
        if (null == newBody || "" == newBody) {
            return this.mobileDigits;
        }
        var mobileArr = this.getMobileArr();
        var newMobileDigits = mobileArr[0] + "-" + newBody + "-" + mobileArr[2];
        this.update(newMobileDigits);
        return newMobileDigits;
    };
    HelperMobile.prototype.isMobileBodyNotEmpty = function () {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("helper.mobile / isMobileBodyNotEmpty / init");
        return !this.isMobileBodyEmpty();
    };
    HelperMobile.prototype.isMobileBodyEmpty = function () {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("helper.mobile / isMobileBodyEmpty / init");
        var mobileBody = this.getMobileBody();
        return (null == mobileBody || "" == mobileBody) ? true : false;
    };
    HelperMobile.prototype.isMobileBodyNotSame = function (target) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("helper.mobile / isMobileBodyNotSame / init");
        return !this.isMobileBodySame(target);
    };
    HelperMobile.prototype.isMobileBodySame = function (target) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("helper.mobile / isMobileBodySame / init");
        if (null == target || "" === target) {
            return false;
        }
        var mobileBody = this.getMobileBody();
        return (mobileBody === target) ? true : false;
    };
    // TAIL
    HelperMobile.prototype.getMobileTail = function () {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("helper.mobile / getMobileTail / init");
        var mobileArr = this.getMobileArr();
        return mobileArr[2];
    };
    HelperMobile.prototype.getMobileWithNewTail = function (newTail) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("helper.mobile / getMobileWithNewTail / init");
        if (null == newTail || "" == newTail) {
            return this.mobileDigits;
        }
        var mobileArr = this.getMobileArr();
        var newMobileDigits = mobileArr[0] + "-" + mobileArr[1] + "-" + newTail;
        this.update(newMobileDigits);
        return newMobileDigits;
    };
    HelperMobile.prototype.isMobileTailNotEmpty = function () {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("helper.mobile / isMobileTailNotEmpty / init");
        return !this.isMobileTailEmpty();
    };
    HelperMobile.prototype.isMobileTailEmpty = function () {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("helper.mobile / isMobileTailEmpty / init");
        var mobileTail = this.getMobileTail();
        return (null == mobileTail || "" == mobileTail) ? true : false;
    };
    HelperMobile.prototype.isMobileTailNotSame = function (target) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("helper.mobile / isMobileTailNotSame / init");
        return !this.isMobileTailSame(target);
    };
    HelperMobile.prototype.isMobileTailSame = function (target) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("helper.mobile / isMobileTailSame / init");
        if (null == target || "" === target) {
            return false;
        }
        var mobileTail = this.getMobileTail();
        return (mobileTail === target) ? true : false;
    }; // end method
    return HelperMobile;
}());
exports.HelperMobile = HelperMobile; // end class
//# sourceMappingURL=mobile.js.map