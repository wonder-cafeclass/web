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
var my_checker_service_1 = require('../../../util/service/my-checker.service');
var my_logger_service_1 = require('../../../util/service/my-logger.service');
var NameComponent = (function () {
    function NameComponent(myLoggerService) {
        this.myLoggerService = myLoggerService;
        this.top = -1;
        this.left = -1;
        this.topWarning = -1;
        this.leftWarning = -1;
        this.myCheckerService = null;
        this.isFocus = false;
        this.isFocusInfo = false;
        this.isSuccessInput = false;
        this.tooltipHeadMsg = null;
        this.tooltipHeadNotAllowed = "이름에 문제가 있습니다.";
        this.tooltipHeadAllowed = "성공! 이름이 완벽합니다.";
    }
    NameComponent.prototype.ngOnInit = function () { };
    NameComponent.prototype.setMyChecker = function () {
        if (null == this.myCheckerService) {
            return;
        }
        if (null == this.myChecker) {
            this.myChecker = this.myCheckerService.getMyChecker("user_name");
            console.log("name / this.myChecker : ", this.myChecker);
        }
    };
    NameComponent.prototype.isOK = function (input) {
        if (null == this.myCheckerService) {
            return false;
        }
        return this.myCheckerService.isOK(this.myChecker, input);
    };
    NameComponent.prototype.onClick = function (event, element) {
        event.stopPropagation();
        event.preventDefault();
        if (!this.isFocus) {
            this.isFocus = true;
        } // end if
        // Checker가 없다면, Checker를 가져옵니다.
        this.setMyChecker();
    };
    NameComponent.prototype.onBlur = function (event, element) {
        event.stopPropagation();
        event.preventDefault();
        if (null == this.myCheckerService) {
            return;
        }
        if (this.isFocus) {
            this.isFocus = false;
        } // end if
        var name = element.value;
        // 입력한 이름을 검사합니다.
        // 패스워드를 검사합니다.
        if (null != name && "" != name) {
            // 1. 사용자가 입력한 이메일 주소를 검사합니다.
            var isOK = this.isOK(name);
            if (!isOK) {
                // 원인을 찾아봅니다.
                var history_1 = this.myCheckerService.getLastHistory();
                console.log("password / onBlur / history : ", history_1);
                if (null != history_1 && null != history_1.key && null != history_1.msg) {
                    // Do something..
                    if ("min" === history_1.key) {
                        // 최소 문자 갯수보다 적은 경우.
                        this.tooltipHeadMsg = history_1.msg;
                    }
                    else if ("max" === history_1.key) {
                        // 최대 문자 갯수보다 많은 경우.
                        this.tooltipHeadMsg = history_1.msg;
                        // 넘는 문자열은 지웁니다.
                        element.value = name = name.slice(0, history_1.value);
                    }
                    else if ("regexExclude" === history_1.key) {
                        // 정규표현식에 포함되지 않는 문자열인 경우.
                        this.tooltipHeadMsg = history_1.msg;
                        var regExpStr = history_1.value + "";
                        var regExpStrNameRange = /[^a-zA-Z가-힣0-9 ]+/g + "";
                        if (regExpStr == regExpStrNameRange) {
                            this.tooltipHeadMsg = "이름에 사용할 수 없는 문자가 있어요.";
                            var matchArr = history_1.matchArr;
                            if (null != matchArr && 0 < matchArr.length) {
                                for (var i = 0; i < matchArr.length; ++i) {
                                    var keywordNotAllowed = matchArr[i];
                                    // 사용할 수 없는 문자들을 지웁니다.
                                    element.value = name = name.replace(keywordNotAllowed, "");
                                } // end for
                            } // end if
                        } // end if
                    }
                    else {
                        // 이에 해당되지 않는 예외 실패.
                        this.tooltipHeadMsg = this.tooltipHeadNotAllowed;
                    } // end if
                } // end if
            } // end if - isOK
            // 비속어, 욕설 검사.
            var nameBeforeSanitize = name;
            name = this.myCheckerService.sanitizeDirtyWord(name);
            console.log("TEST / 1 / nameBeforeSanitize : ", nameBeforeSanitize);
            console.log("TEST / 1 / name : ", name);
            if (nameBeforeSanitize != name) {
                // 비속어, 욕설이 제거되었습니다. 
                // 사용자에게 금칙어임을 알립니다.
                this.tooltipHeadMsg = "금칙어는 제외됩니다.";
                element.value = name;
                var _self_1 = this;
                setTimeout(function () {
                    // 메시지를 3초 뒤에 화면에서 지웁니다.
                    _self_1.tooltipHeadMsg = null;
                    element.focus();
                }, 2500);
                // Logger - Spam 행위로 등록.
                this.myLoggerService.logActionDirtyWord(nameBeforeSanitize);
            } // end if - dirty word
        } // end if - check Name
    }; // end method
    NameComponent.prototype.onMouseOverInfo = function (event) {
        event.stopPropagation();
        event.preventDefault();
        if (!this.isFocusInfo) {
            this.isFocusInfo = true;
        } // end if
    };
    NameComponent.prototype.onMouseOutInfo = function (event) {
        event.stopPropagation();
        event.preventDefault();
        if (this.isFocusInfo) {
            this.isFocusInfo = false;
        } // end if
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], NameComponent.prototype, "top", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], NameComponent.prototype, "left", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], NameComponent.prototype, "topWarning", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], NameComponent.prototype, "leftWarning", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', my_checker_service_1.MyCheckerService)
    ], NameComponent.prototype, "myCheckerService", void 0);
    NameComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'name',
            templateUrl: 'name.component.html',
            styleUrls: ['name.component.css']
        }), 
        __metadata('design:paramtypes', [my_logger_service_1.MyLoggerService])
    ], NameComponent);
    return NameComponent;
}());
exports.NameComponent = NameComponent;
//# sourceMappingURL=name.component.js.map