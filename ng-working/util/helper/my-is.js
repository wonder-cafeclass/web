"use strict";
/*
*	@ Desc : 비교 관련 함수 모음
*/
var HelperMyIs = (function () {
    function HelperMyIs() {
    }
    HelperMyIs.prototype.isFunction = function (functionToCheck) {
        var type = this.getType(functionToCheck);
        if (null == type || "" === type) {
            false;
        }
        var getType = {};
        return (type == '[object Function]') ? true : false;
    };
    HelperMyIs.prototype.isArray = function (functionToCheck) {
        var type = this.getType(functionToCheck);
        if (null == type || "" === type) {
            false;
        }
        var getType = {};
        return (type == '[object Array]') ? true : false;
    };
    HelperMyIs.prototype.isNotString = function (target) {
        return !this.isString(target);
    };
    HelperMyIs.prototype.isString = function (target) {
        var type = this.getType(target);
        if (null == type || "" === type) {
            false;
        }
        var getType = {};
        return (type == '[object String]') ? true : false;
    };
    HelperMyIs.prototype.isNotNumber = function (target) {
        return !this.isString(target);
    };
    HelperMyIs.prototype.isNumber = function (target) {
        var type = this.getType(target);
        if (null == type || "" === type) {
            false;
        }
        var getType = {};
        return (type == '[object Number]') ? true : false;
    };
    HelperMyIs.prototype.isArrayList = function (target) {
        if (null == target) {
            return false;
        }
        var isArray = this.isArray(target);
        if (!isArray) {
            return false;
        }
        // 모든 인자가 array 이어야 합니다.
        for (var i = 0; i < target.length; ++i) {
            var element = target[i];
            if (!this.isArray(element)) {
                return false;
            }
        }
        return true;
    };
    HelperMyIs.prototype.isStringList = function (target) {
        if (null == target) {
            return false;
        }
        var isArray = this.isArray(target);
        if (!isArray) {
            return false;
        }
        // 모든 인자가 array 이어야 합니다.
        for (var i = 0; i < target.length; ++i) {
            var element = target[i];
            if (!this.isString(element)) {
                return false;
            }
        }
        return true;
    };
    HelperMyIs.prototype.getType = function (anyToCheck) {
        var getType = {};
        if (null == anyToCheck) {
            return "";
        }
        return getType.toString.call(anyToCheck);
    };
    HelperMyIs.prototype.copy = function (src, copy) {
        if (null == src || null == copy) {
            return null;
        }
        for (var key in src) {
            if (this.isFunction(src[key])) {
                // 함수는 복사하지 않습니다.
                continue;
            }
            copy[key] = src[key];
        } // end for
        return copy;
    }; // end method
    HelperMyIs.prototype.copyFromJSON = function (target, json) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("klass / copyFromJSON / init");
        if (null == target) {
            if (isDebug)
                console.log("klass / copyFromJSON / 중단 / target is not valid!");
            return target;
        } // end if
        if (null == json) {
            if (isDebug)
                console.log("klass / copyFromJSON / 중단 / json is not valid!");
            return target;
        } // end if
        for (var key in target) {
            if (this.isFunction(target[key])) {
                // 함수는 복사하지 않습니다.
                continue;
            }
            if (isDebug)
                console.log("klass / copyFromJSON / key : ", key);
            // For Debug
            var type = this.getType(target[key]);
            if (isDebug)
                console.log("klass / copyFromJSON / type : ", type);
            if (null == json[key]) {
                // null은 복사하지 않습니다.
                continue;
            }
            if (this.isNumber(target[key])) {
                target[key] = parseInt(json[key]);
            }
            else {
                target[key] = json[key];
            }
        } // end for
        return target;
    };
    // @ Desc : 객체의 모든 변수의 값이 동일한지 확인합니다.
    HelperMyIs.prototype.isSame = function (src, target) {
        if (null == src || null == target) {
            return false;
        }
        for (var key in src) {
            if (null == target[key]) {
                return false;
            }
            if (src[key] != target[key]) {
                return false;
            }
        } // end for
        return true;
    };
    // @ Desc : 특정 변수가 동일한지 확인합니다.
    HelperMyIs.prototype.isSharing = function (key, src, target) {
        if (null == src || null == target) {
            return false;
        }
        if (null == key || "" === key) {
            return false;
        }
        if (null == src[key] || null == target[key]) {
            return false;
        }
        if (src[key] != target[key]) {
            return false;
        }
        return true;
    };
    return HelperMyIs;
}());
exports.HelperMyIs = HelperMyIs;
//# sourceMappingURL=my-is.js.map