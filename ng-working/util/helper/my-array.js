"use strict";
/*
*	@ Desc : 배열 관련 함수 모음
*/
var HelperMyArray = (function () {
    function HelperMyArray() {
    }
    HelperMyArray.prototype.hasNotStr = function (arrStr, value) {
        return !this.hasStr(arrStr, value);
    };
    HelperMyArray.prototype.hasStr = function (arrStr, value) {
        if (null == value || "" == value) {
            return false;
        }
        else if (null == arrStr || 0 == arrStr.length) {
            return false;
        }
        for (var i = 0; i < arrStr.length; ++i) {
            var valueFromList = arrStr[i];
            if (valueFromList === value) {
                return true;
            }
        }
        return false;
    };
    HelperMyArray.prototype.removeStr = function (arrStr, value) {
        if (null == value || "" == value) {
            return arrStr;
        }
        else if (null == arrStr || 0 == arrStr.length) {
            return arrStr;
        }
        else if (this.hasNotStr(arrStr, value)) {
            return arrStr;
        }
        var arrStrNext = [];
        for (var i = 0; i < arrStr.length; ++i) {
            var valueFromList = arrStr[i];
            if (valueFromList === value) {
                continue;
            }
            arrStrNext.push(valueFromList);
        }
        return arrStrNext;
    };
    HelperMyArray.prototype.addStrUnique = function (arrStr, value) {
        if (null == value || "" == value) {
            return arrStr;
        }
        else if (null == arrStr) {
            // 배열이 없다면 새로 만듭니다.
            arrStr = [];
        }
        else if (this.hasStr(arrStr, value)) {
            // 이미 있는 문자열이라면 추가하지 않습니다.
            return arrStr;
        }
        arrStr.push(value);
        return arrStr;
    };
    return HelperMyArray;
}());
exports.HelperMyArray = HelperMyArray;
//# sourceMappingURL=my-array.js.map