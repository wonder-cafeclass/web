"use strict";
var MyResponse = (function () {
    function MyResponse(success, message, query, error, data, extra) {
        this.success = success;
        this.message = message;
        this.query = query;
        this.error = error;
        this.data = data;
        this.extra = extra;
        /*
        *	@ Desc : 최대 5단계까지 key 배열로 원하는 값을 조회, 가져옵니다.
        */
        this.loopProtector = 5;
        this.loopCounter = 0;
    }
    MyResponse.prototype.isSuccess = function () {
        if (null == this.success || !this.success) {
            return false;
        }
        return true;
    };
    MyResponse.prototype.isFailed = function () {
        return !this.isSuccess();
    };
    MyResponse.prototype.getMessage = function () {
        return this.message;
    };
    MyResponse.prototype.getQuery = function () {
        return this.query;
    };
    MyResponse.prototype.getError = function () {
        return this.error;
    };
    MyResponse.prototype.getData = function () {
        return this.data;
    };
    MyResponse.prototype.getDataProp = function (key) {
        if (this.hasDataProp(key)) {
            return this.data[key];
        }
        return null;
    };
    MyResponse.prototype.digDataProp = function (keyArr) {
        if (null == keyArr || 0 == keyArr.length) {
            return null;
        }
        return this.digDataPropRecursive(keyArr, this.data);
    };
    MyResponse.prototype.digDataPropRecursive = function (keyArr, target) {
        if (null == keyArr || 0 == keyArr.length) {
            return null;
        }
        if (null == target) {
            return null;
        }
        if (this.loopProtector < this.loopCounter) {
            // 최대 5 단계까지 조회 가능합니다.
            return null;
        }
        // get first key
        var key = keyArr.shift();
        if (null == key || "" == key) {
            return null;
        }
        var nextTarget = null;
        for (var k in target) {
            if (k === key) {
                nextTarget = target[k];
            }
        }
        if (0 == keyArr.length) {
            // 마지막 값을 찾았습니다. loopCounter를 초기화합니다.
            this.loopCounter = 0;
            return nextTarget;
        }
        // 다음 depth에서 값을 찾습니다. loopCounter를 +1.
        this.loopCounter++;
        return this.digDataPropRecursive(keyArr, nextTarget);
    };
    MyResponse.prototype.hasNotDataProp = function (key) {
        return !this.hasDataProp(key);
    };
    MyResponse.prototype.hasDataProp = function (key) {
        if (null == this.data) {
            return false;
        }
        for (var k in this.data) {
            if (k === key) {
                return true;
            }
        }
        return false;
    };
    MyResponse.prototype.getExtra = function () {
        return this.extra;
    };
    return MyResponse;
}());
exports.MyResponse = MyResponse;
//# sourceMappingURL=my-response.js.map