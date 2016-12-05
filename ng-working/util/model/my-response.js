"use strict";
var MyResponse = (function () {
    function MyResponse(success, message, query, error, data, extra) {
        this.success = success;
        this.message = message;
        this.query = query;
        this.error = error;
        this.data = data;
        this.extra = extra;
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