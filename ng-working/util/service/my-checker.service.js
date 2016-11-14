"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var my_checker_1 = require('../model/my-checker');
var MyCheckerService = (function () {
    function MyCheckerService() {
        this.TYPE_STRING = "TYPE_STRING";
        this.TYPE_NUMBER = "TYPE_NUMBER";
        this.TYPE_ARRAY = "TYPE_ARRAY";
        this.REGEX_SAFE_STR = /[^a-zA-Z0-9ㄱ-ㅎㅏ-ㅣ\x20\s\(\)\.\:\;?\!\=\'\"`\^\(\)\&\~]/g;
        this.MIN_STR_SAFE_TITLE = 2;
        this.MAX_STR_SAFE_TITLE = 48;
        this.MIN_STR_SAFE_COMMENT = 2;
        this.MAX_STR_SAFE_COMMENT = 120;
    }
    MyCheckerService.prototype.getLastHistory = function () {
        return this.history;
    };
    MyCheckerService.prototype.isOK = function (myChecker, value) {
        this.history = {
            myChecker: myChecker,
            value: value,
            reason: "",
            success: true,
            msg: ""
        };
        if (undefined === myChecker || null === myChecker) {
            this.history.reason = "null === myChecker";
            this.history.success = false;
            return false;
        }
        if (undefined === value || null === value) {
            this.history.reason = "null === value";
            this.history.success = false;
            return false;
        }
        if (this.TYPE_STRING === myChecker.type) {
            if ('string' != typeof value) {
                this.history.reason = "'string' != typeof value";
                this.history.success = false;
                return false;
            }
            var valueStr = value;
            // 음수는 검사 영역에 포함되지 않습니다.
            var max = -1;
            if (null != myChecker.max) {
                max = myChecker.max;
            }
            if (0 < max && max < valueStr.length) {
                this.history.reason =
                    "0 < max && max < valueStr.length / max : " + max + " / valueStr.length : " + valueStr.length;
                this.history.success = false;
                this.history.msg = myChecker.msg = "\uCD5C\uB300 " + max + "\uC790\uAE4C\uC9C0 \uC785\uB825\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4.";
                return false;
            }
            var min = -1;
            if (null != myChecker.min) {
                min = myChecker.min;
            }
            if (0 <= min && valueStr.length < min) {
                this.history.reason =
                    "0 <= min && valueStr.length < min / min : " + min + " / valueStr.length : " + valueStr.length;
                this.history.success = false;
                this.history.msg = myChecker.msg = "\uCD5C\uC18C " + min + "\uC790\uAE4C\uC9C0 \uC785\uB825\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4.";
                return false;
            }
            var matchArr = valueStr.match(this.REGEX_SAFE_STR);
            if (null != matchArr && 0 < matchArr.length) {
                this.history.reason =
                    "target string is not allowed with this.REGEX_SAFE_STR : " + this.REGEX_SAFE_STR;
                this.history.success = false;
                this.history.msg = myChecker.msg = "허용되지 않는 문자가 포함되어 있습니다. : " + matchArr.join(",");
                return false;
            }
        }
        else if (this.TYPE_NUMBER === myChecker.type) {
            if ('number' != typeof value) {
                this.history.reason = "'number' != typeof value";
                this.history.success = false;
                return false;
            }
        }
        else if (this.TYPE_ARRAY === myChecker.type) {
        }
        return true;
    };
    MyCheckerService.prototype.getTitleChecker = function () {
        // public myChecker:MyChecker
        return new my_checker_1.MyChecker(
        // public type:string
        this.TYPE_STRING, this.MIN_STR_SAFE_TITLE, this.MAX_STR_SAFE_TITLE, this.REGEX_SAFE_STR);
    }; // end method
    MyCheckerService.prototype.getCommentChecker = function () {
        // public myChecker:MyChecker
        return new my_checker_1.MyChecker(
        // public type:string
        this.TYPE_STRING, this.MIN_STR_SAFE_COMMENT, this.MAX_STR_SAFE_COMMENT, this.REGEX_SAFE_STR);
    }; // end method
    MyCheckerService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], MyCheckerService);
    return MyCheckerService;
}());
exports.MyCheckerService = MyCheckerService;
//# sourceMappingURL=my-checker.service.js.map