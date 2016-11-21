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
var PasswordComponent = (function () {
    function PasswordComponent() {
        this.top = -1;
        this.left = -1;
        this.topWarning = -1;
        this.leftWarning = -1;
        this.myCheckerService = null;
        this.isFocus = false;
        this.isFocusInfo = false;
        this.isFocusRepassword = false;
        this.password = "";
        this.repassword = "";
        this.isValidPassword = false;
        this.tooltipHeadMsg = null;
        this.tooltipHeadNotAllowed = "패스워드에 문제가 있습니다.";
        this.tooltipHeadAllowed = "성공! 패스워드가 완벽합니다.";
        this.isSuccessInput = false;
        this.tooltipTailMsg = null;
        this.tooltipTailInit = "입력한 패스워드를 확인해볼께요.";
        this.tooltipTailNotMatch = "패스워드가 일치하지 않습니다!";
        this.tooltipTailMatched = "성공! 패스워드가 정확히 일치합니다.";
    }
    PasswordComponent.prototype.ngOnInit = function () { };
    PasswordComponent.prototype.setMyChecker = function () {
        if (null == this.myCheckerService) {
            return;
        }
        if (null == this.myChecker) {
            this.myChecker = this.myCheckerService.getMyChecker("user_password");
        }
    };
    PasswordComponent.prototype.isOK = function (input) {
        if (null == this.myCheckerService) {
            return;
        }
        return this.myCheckerService.isOK(this.myChecker, input);
    };
    PasswordComponent.prototype.onClick = function (event, element) {
        event.stopPropagation();
        event.preventDefault();
        if (!this.isFocus) {
            this.isFocus = true;
        } // end if
        this.password = element.value;
        // Checker가 없다면, Checker를 가져옵니다.
        this.setMyChecker();
    };
    PasswordComponent.prototype.onBlur = function (event, element, elementNext) {
        event.stopPropagation();
        event.preventDefault();
        if (null == this.myCheckerService) {
            return;
        }
        if (this.isFocus) {
            this.isFocus = false;
        } // end if
        this.password = element.value;
        // 패스워드를 검사합니다.
        if (null != this.password && "" != this.password) {
            // 1. 사용자가 입력한 이메일 주소를 검사합니다.
            var isOK = this.isOK(this.password);
            if (!isOK) {
                // 패스워드에 문제가 있습니다.
                // wonder.jung
                // 원인을 찾아봅니다.
                var history_1 = this.myCheckerService.getLastHistory();
                console.log("password / onBlur / history : ", history_1);
                if (null != history_1 && null != history_1.key && null != history_1.msg) {
                    if ("min" === history_1.key) {
                        // 최소 문자 갯수보다 적은 경우.
                        this.tooltipHeadMsg = history_1.msg;
                    }
                    else if ("max" === history_1.key) {
                        // 최대 문자 갯수보다 많은 경우.
                        this.tooltipHeadMsg = history_1.msg;
                    }
                    else if ("regexInclude" === history_1.key) {
                        // 정규표현식에 포함되지 않는 문자열인 경우.
                        this.tooltipHeadMsg = history_1.msg;
                        console.log("TEST / history.value : ", history_1.value);
                        var regExpStr = history_1.value + "";
                        var regExpStrSpecialChar = /[!@#\\$%\^\&*\)\(+=._-]+/ + "";
                        var regExpStrNumbers = /[0-9]+/ + "";
                        var regExpAlphabet = /[a-z]+/ + "";
                        if (regExpStr == regExpStrSpecialChar) {
                            this.tooltipHeadMsg = "특수문자가 최소 1글자가 있어야 해요.";
                        }
                        else if (regExpStr == regExpStrNumbers) {
                            this.tooltipHeadMsg = "숫자가 최소 1개 있어야 해요.";
                        }
                        else if (regExpStr == regExpAlphabet) {
                            this.tooltipHeadMsg = "알파벳 소문자가 최소 1개 있어야 해요.";
                        }
                    }
                    else {
                        // 이에 해당되지 않는 예외 실패.
                        this.tooltipHeadMsg = this.tooltipHeadNotAllowed;
                    }
                }
                this.isFocus = true;
                element.focus();
            }
            else {
                // 패스워드가 정상입니다. 재입력 창으로 안내합니다.
                // 패스워드 재입력을 알려줘야 합니다.
                this.showRepassword(elementNext, this.tooltipTailInit);
                // 입력 성공을 유저에게 알립니다.
                this.tooltipHeadMsg = this.tooltipHeadAllowed;
                this.isValidPassword = true;
                var _self_1 = this;
                setTimeout(function () {
                    // 성공 안내메시지를 3초 뒤에 화면에서 지웁니다.
                    _self_1.tooltipHeadMsg = null;
                    _self_1.isValidPassword = false;
                }, 2500);
            } // end if
        } // end if
    };
    PasswordComponent.prototype.onKeyup = function (event, element) {
        event.stopPropagation();
        event.preventDefault();
        if (null == this.myCheckerService) {
            return;
        }
        // 입력 글자수가 최대글자수를 넘지 않았는지 검사합니다.
        // 모든 영문을 소문자로 고정 변경.
        this.password = element.value.toLowerCase();
        // 패스워드를 검사합니다.
        if (null != this.password && "" != this.password) {
            // 1. 사용자가 입력한 이메일 주소를 검사합니다.
            var isOK = this.isOK(this.password);
            if (!isOK) {
                // 패스워드에 문제가 있습니다.
                // wonder.jung
                // 원인을 찾아봅니다.
                var history_2 = this.myCheckerService.getLastHistory();
                if (null != history_2 &&
                    null != history_2.key &&
                    null != history_2.msg &&
                    null != history_2.value) {
                    if ("max" === history_2.key) {
                        console.log("password / onKeyup / history : ", history_2);
                        // 최대 문자 갯수보다 많은 경우.
                        this.tooltipHeadMsg = history_2.msg;
                        // 글자수를 줄여줍니다.
                        var max = history_2.value;
                        element.value = this.password = this.password.slice(0, max);
                    }
                }
                this.isFocus = true;
                element.focus();
            } // end inner if
        } // end outer if
    }; // end method
    PasswordComponent.prototype.showRepassword = function (element, msgWarning) {
        if (null == element) {
            return;
        }
        element.focus();
        this.isFocusRepassword = true;
        this.tooltipTailMsg = msgWarning;
    };
    PasswordComponent.prototype.onMouseOverInfo = function (event) {
        event.stopPropagation();
        event.preventDefault();
        if (!this.isFocusInfo) {
            this.isFocusInfo = true;
        } // end if
    };
    PasswordComponent.prototype.onMouseOutInfo = function (event) {
        event.stopPropagation();
        event.preventDefault();
        if (this.isFocusInfo) {
            this.isFocusInfo = false;
        } // end if
    };
    PasswordComponent.prototype.onClickRepassword = function (event, element) {
        event.stopPropagation();
        event.preventDefault();
        if (!this.isFocusRepassword) {
            this.isFocusRepassword = true;
        } // end if
        this.repassword = element.value;
    };
    PasswordComponent.prototype.onBlurRepassword = function (event, element) {
        event.stopPropagation();
        event.preventDefault();
        if (this.isFocusRepassword) {
            this.isFocusRepassword = false;
        } // end if
        this.repassword = element.value;
        console.log("onBlurRepassword / this.password : ", this.password);
        console.log("onBlurRepassword / this.repassword : ", this.repassword);
        if (null != this.password &&
            "" != this.password &&
            null != this.repassword &&
            "" != this.repassword) {
            // 1. 패스워드와 재입력 패스워드를 비교합니다.
            if (this.password != this.repassword) {
                // 1-1. 처음 입력한 패스워드와 재확인 패스워드가 다를 경우.
                console.log("TEST / this.tooltipTailNotMatch : ", this.tooltipTailNotMatch);
                this.showRepassword(element, this.tooltipTailNotMatch);
                this.isSuccessInput = false;
            }
            else {
                // 1-2. 성공! 똑같은 패스워드를 입력했습니다.
                this.tooltipTailMsg = this.tooltipTailMatched;
                this.isSuccessInput = true;
                var _self_2 = this;
                setTimeout(function () {
                    // 성공 안내메시지를 3초 뒤에 화면에서 지웁니다.
                    _self_2.tooltipTailMsg = null;
                    _self_2.isSuccessInput = false;
                }, 2500);
            }
        } // end if
    }; // end method
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], PasswordComponent.prototype, "top", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], PasswordComponent.prototype, "left", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], PasswordComponent.prototype, "topWarning", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], PasswordComponent.prototype, "leftWarning", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', my_checker_service_1.MyCheckerService)
    ], PasswordComponent.prototype, "myCheckerService", void 0);
    PasswordComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'password',
            templateUrl: 'password.component.html',
            styleUrls: ['password.component.css']
        }), 
        __metadata('design:paramtypes', [])
    ], PasswordComponent);
    return PasswordComponent;
}());
exports.PasswordComponent = PasswordComponent;
//# sourceMappingURL=password.component.js.map