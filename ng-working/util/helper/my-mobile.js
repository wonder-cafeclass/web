"use strict";
/*
*	@ Desc : 대한민국 휴대폰 번호 관련 처리 로직. / @ Deprecated
*/
var HelperMyMobile = (function () {
    function HelperMyMobile() {
        this.head = "010";
        this.body = "";
        this.tail = "";
    }
    HelperMyMobile.prototype.set = function (mobileDigits) {
        if (null == mobileDigits || "" === mobileDigits) {
            return;
        }
        this.update(mobileDigits);
    }; // end method
    HelperMyMobile.prototype.update = function (mobileDigits) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("my-mobile / update / init");
        if (null == mobileDigits || "" == mobileDigits) {
            return;
        }
        if (isDebug)
            console.log("my-mobile / update / BEFORE / this.mobileDigits : ", this.mobileDigits);
        this.mobileDigits = mobileDigits;
        if (isDebug)
            console.log("my-mobile / update / AFTER / this.mobileDigits : ", this.mobileDigits);
        // 초기화.
        this.head = "010";
        this.body = "";
        this.tail = "";
        var mobileArr = mobileDigits.split("-");
        if (isDebug)
            console.log("my-mobile / update / mobileArr : ", mobileArr);
        if (null != mobileArr && 3 == mobileArr.length) {
            this.head = mobileArr[0];
            this.body = mobileArr[1];
            this.tail = mobileArr[2];
        }
    };
    HelperMyMobile.prototype.getMobileArr = function () {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("my-mobile / getMobileArr / init");
        return [this.head, this.body, this.tail];
    };
    // HEAD
    HelperMyMobile.prototype.getMobileHead = function () {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("my-mobile / getMobileHead / init");
        var mobileArr = this.getMobileArr();
        return mobileArr[0];
    };
    HelperMyMobile.prototype.getMobileWithNewHead = function (newHead) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("my-mobile / getMobileWithNewHead / init");
        if (null == newHead || "" == newHead) {
            return this.mobileDigits;
        }
        var mobileArr = this.getMobileArr();
        var newMobileDigits = newHead + "-" + mobileArr[1] + "-" + mobileArr[2];
        this.update(newMobileDigits);
        return newMobileDigits;
    };
    HelperMyMobile.prototype.isMobileHeadNotEmpty = function () {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("my-mobile / isMobileHeadNotEmpty / init");
        return !this.isMobileHeadEmpty();
    };
    HelperMyMobile.prototype.isMobileHeadEmpty = function () {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("my-mobile / isMobileHeadEmpty / init");
        var mobileHead = this.getMobileHead();
        return (null == mobileHead || "" == mobileHead) ? true : false;
    };
    HelperMyMobile.prototype.isMobileHeadNotSame = function (target) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("my-mobile / isMobileHeadNotSame / init");
        return !this.isMobileHeadSame(target);
    };
    HelperMyMobile.prototype.isMobileHeadSame = function (target) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("my-mobile / isMobileHeadSame / init");
        if (null == target || "" === target) {
            return false;
        }
        var mobileHead = this.getMobileHead();
        return (mobileHead === target) ? true : false;
    };
    // BODY
    HelperMyMobile.prototype.getMobileBody = function () {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("my-mobile / getMobileBody / init");
        var mobileArr = this.getMobileArr();
        return mobileArr[1];
    };
    HelperMyMobile.prototype.getMobileWithNewBody = function (newBody) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("my-mobile / getMobileWithNewBody / init");
        if (null == newBody || "" == newBody) {
            return this.mobileDigits;
        }
        var mobileArr = this.getMobileArr();
        var newMobileDigits = mobileArr[0] + "-" + newBody + "-" + mobileArr[2];
        this.update(newMobileDigits);
        return newMobileDigits;
    };
    HelperMyMobile.prototype.isMobileBodyNotEmpty = function () {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("my-mobile / isMobileBodyNotEmpty / init");
        return !this.isMobileBodyEmpty();
    };
    HelperMyMobile.prototype.isMobileBodyEmpty = function () {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("my-mobile / isMobileBodyEmpty / init");
        var mobileBody = this.getMobileBody();
        return (null == mobileBody || "" == mobileBody) ? true : false;
    };
    HelperMyMobile.prototype.isMobileBodyNotSame = function (target) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("my-mobile / isMobileBodyNotSame / init");
        return !this.isMobileBodySame(target);
    };
    HelperMyMobile.prototype.isMobileBodySame = function (target) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("my-mobile / isMobileBodySame / init");
        if (null == target || "" === target) {
            return false;
        }
        var mobileBody = this.getMobileBody();
        return (mobileBody === target) ? true : false;
    };
    // TAIL
    HelperMyMobile.prototype.getMobileTail = function () {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("my-mobile / getMobileTail / init");
        var mobileArr = this.getMobileArr();
        return mobileArr[2];
    };
    HelperMyMobile.prototype.getMobileWithNewTail = function (newTail) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("my-mobile / getMobileWithNewTail / init");
        if (null == newTail || "" == newTail) {
            return this.mobileDigits;
        }
        var mobileArr = this.getMobileArr();
        var newMobileDigits = mobileArr[0] + "-" + mobileArr[1] + "-" + newTail;
        this.update(newMobileDigits);
        return newMobileDigits;
    };
    HelperMyMobile.prototype.isMobileTailNotEmpty = function () {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("my-mobile / isMobileTailNotEmpty / init");
        return !this.isMobileTailEmpty();
    };
    HelperMyMobile.prototype.isMobileTailEmpty = function () {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("my-mobile / isMobileTailEmpty / init");
        var mobileTail = this.getMobileTail();
        return (null == mobileTail || "" == mobileTail) ? true : false;
    };
    HelperMyMobile.prototype.isMobileTailNotSame = function (target) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("my-mobile / isMobileTailNotSame / init");
        return !this.isMobileTailSame(target);
    };
    HelperMyMobile.prototype.isMobileTailSame = function (target) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("my-mobile / isMobileTailSame / init");
        if (null == target || "" === target) {
            return false;
        }
        var mobileTail = this.getMobileTail();
        return (mobileTail === target) ? true : false;
    }; // end method
    return HelperMyMobile;
}());
exports.HelperMyMobile = HelperMyMobile; // end class
//# sourceMappingURL=my-mobile.js.map