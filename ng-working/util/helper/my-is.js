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
    HelperMyIs.prototype.isString = function (functionToCheck) {
        var type = this.getType(functionToCheck);
        if (null == type || "" === type) {
            false;
        }
        var getType = {};
        return (type == '[object String]') ? true : false;
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