"use strict";
var my_is_1 = require('./my-is');
/*
*	@ Desc : 배열 관련 함수 모음
*/
var HelperMyArray = (function () {
    function HelperMyArray() {
        this.myIs = new my_is_1.HelperMyIs();
    }
    HelperMyArray.prototype.copy = function (targetList) {
        var copyList = [];
        for (var i = 0; i < targetList.length; ++i) {
            var target = targetList[i];
            copyList.push(target);
        }
        return copyList;
    };
    HelperMyArray.prototype.isNotOK = function (target) {
        return !this.isOK(target);
    };
    HelperMyArray.prototype.isOK = function (target) {
        if (null == target || 0 == target.length) {
            return false;
        }
        return true;
    };
    HelperMyArray.prototype.isNotStrArr = function (target) {
        return !this.isStrArr(target);
    };
    HelperMyArray.prototype.isStrArr = function (target) {
        var isStrArr = true;
        if (this.isNotOK(target)) {
            return false;
        }
        for (var i = 0; i < target.length; ++i) {
            var element = target[i];
            if (this.myIs.isNotString(element)) {
                return false;
            } // end if
        } // end for
        return true;
    }; // end method
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
    // @ Desc : 중첩 배열도 검색하여, 해당 문자열을 삭제.
    HelperMyArray.prototype.removeStrRecursive = function (arrStr, value) {
        if (null == value || "" == value) {
            return arrStr;
        }
        else if (null == arrStr || 0 == arrStr.length) {
            return arrStr;
        }
        var arrStrNext = [];
        for (var i = 0; i < arrStr.length; ++i) {
            var element = arrStr[i];
            if (this.myIs.isArray(element)) {
                element = this.removeStrRecursive(element, value);
            }
            else if (element === value) {
                continue;
            }
            arrStrNext.push(element);
        }
        return arrStrNext;
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
    HelperMyArray.prototype.replaceStr = function (arrStr, value, newValue) {
        if (null == value || "" == value) {
            return arrStr;
        }
        else if (null == newValue || "" == newValue) {
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
                arrStrNext.push(newValue);
            }
            else {
                arrStrNext.push(valueFromList);
            }
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
    HelperMyArray.prototype.getValueFromLists = function (key, srcList, targetList) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("my-array / getValueFromLists / 시작");
        if (null == key || "" === key) {
            if (isDebug)
                console.log("my-array / getValueFromLists / 중단 / key is not valid!");
            return "";
        }
        if (null == srcList || 0 === srcList.length) {
            if (isDebug)
                console.log("my-array / getValueFromLists / 중단 / srcList is not valid!");
            return "";
        }
        if (null == targetList || 0 === targetList.length) {
            if (isDebug)
                console.log("my-array / getValueFromLists / 중단 / targetList is not valid!");
            return "";
        }
        if (srcList.length !== targetList.length) {
            if (isDebug)
                console.log("my-array / getValueFromLists / 중단 / srcList.length !== targetList.length");
            return "";
        }
        if (this.hasNotStr(srcList, key)) {
            if (isDebug)
                console.log("my-array / getValueFromLists / 중단 / this.hasNotStr(srcList, key)");
            return "";
        }
        for (var i = 0; i < srcList.length; ++i) {
            var keyFromList = srcList[i];
            if (keyFromList === key) {
                return targetList[i];
            }
        }
        return "";
    };
    HelperMyArray.prototype.getListFromLists = function (key, srcList, targetList) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("my-array / getListFromLists / 시작");
        if (null == key || "" === key) {
            if (isDebug)
                console.log("my-array / getListFromLists / 중단 / key is not valid!");
            return [];
        }
        if (null == srcList || 0 === srcList.length) {
            if (isDebug)
                console.log("my-array / getListFromLists / 중단 / srcList is not valid!");
            return [];
        }
        if (null == targetList || 0 === targetList.length) {
            if (isDebug)
                console.log("my-array / getListFromLists / 중단 / targetList is not valid!");
            return [];
        }
        if (srcList.length !== targetList.length) {
            if (isDebug)
                console.log("my-array / getListFromLists / 중단 / srcList.length !== targetList.length");
            return [];
        }
        if (this.hasNotStr(srcList, key)) {
            if (isDebug)
                console.log("my-array / getListFromLists / 중단 / this.hasNotStr(srcList, key)");
            return [];
        }
        for (var i = 0; i < srcList.length; ++i) {
            var keyFromList = srcList[i];
            if (keyFromList === key) {
                return targetList[i];
            }
        }
        return [];
    };
    return HelperMyArray;
}());
exports.HelperMyArray = HelperMyArray;
//# sourceMappingURL=my-array.js.map