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
var EmailComponent = (function () {
    function EmailComponent() {
        this.top = -1;
        this.left = -1;
        this.topWarning = -1;
        this.leftWarning = -1;
        this.myCheckerService = null;
        this.isFocus = false;
        this.isFocusInfo = false;
        this.isWarning = false;
        this.isSuccessInput = false;
        this.tooltipMsg = "";
        this.tooltipMsgEmailNotValid = "이메일 주소를 다시 확인해주세요.";
        this.tooltipMsgEmailValid = "성공! 이메일 주소가 완벽해요.";
    }
    EmailComponent.prototype.ngOnInit = function () { };
    EmailComponent.prototype.setMyChecker = function () {
        if (null == this.myCheckerService) {
            return;
        }
        if (null == this.myChecker) {
            this.myChecker = this.myCheckerService.getMyChecker("user_email");
        }
    };
    EmailComponent.prototype.onClick = function (event) {
        event.stopPropagation();
        event.preventDefault();
        // Checker가 없다면, Checker를 가져옵니다.
        this.setMyChecker();
    };
    EmailComponent.prototype.onBlur = function (event, email, element) {
        event.stopPropagation();
        event.preventDefault();
        if (null == this.myCheckerService) {
            return;
        }
        if (this.isFocus) {
            this.isFocus = false;
        } // end if
        // 이메일 주소가 입력된 경우에만 검사를 진행합니다.
        if (null != email && "" != email) {
            // 1. 사용자가 입력한 이메일 주소를 검사합니다.
            var isOK = this.isOK(email);
            if (!isOK) {
                // 1-1-1. 이메일 주소에 문제가 있습니다!
                var lastHistory = this.myCheckerService.getLastHistory();
                console.log("email / onBlur / lastHistory : ", lastHistory);
                this.isWarning = true;
                if (null == this.lockFocus) {
                    this.lockFocus = {};
                    element.focus();
                } // end if
                // 1-1-2. 경고 메시지를 노출합니다.
                this.tooltipMsg = this.tooltipMsgEmailNotValid;
                this.isSuccessInput = false;
            }
            else {
                // 1-2-1. 정상적인 이메일 주소를 등록했습니다.
                this.isWarning = false;
                // 1-1-2. 성공 메시지를 노출합니다.
                this.tooltipMsg = this.tooltipMsgEmailValid;
                this.isSuccessInput = true;
                var _self_1 = this;
                setTimeout(function () {
                    // 성공 안내메시지를 3초 뒤에 화면에서 지웁니다.
                    _self_1.tooltipMsg = null;
                    _self_1.isSuccessInput = false;
                }, 2500);
            } // end if
        } // end if
    };
    EmailComponent.prototype.onFocus = function (event) {
        event.stopPropagation();
        event.preventDefault();
        if (!this.isFocus) {
            this.isFocus = true;
        } // end if
        // release lock
        this.lockFocus = null;
    };
    EmailComponent.prototype.isOK = function (email) {
        if (null == this.myCheckerService) {
            return false;
        }
        return this.myCheckerService.isOK(this.myChecker, email);
    };
    EmailComponent.prototype.onMouseOverInfo = function (event) {
        event.stopPropagation();
        event.preventDefault();
        if (!this.isFocusInfo) {
            this.isFocusInfo = true;
        } // end if
    };
    EmailComponent.prototype.onMouseOutInfo = function (event) {
        event.stopPropagation();
        event.preventDefault();
        if (this.isFocusInfo) {
            this.isFocusInfo = false;
        } // end if
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], EmailComponent.prototype, "top", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], EmailComponent.prototype, "left", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], EmailComponent.prototype, "topWarning", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], EmailComponent.prototype, "leftWarning", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', my_checker_service_1.MyCheckerService)
    ], EmailComponent.prototype, "myCheckerService", void 0);
    EmailComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'email',
            templateUrl: 'email.component.html',
            styleUrls: ['email.component.css']
        }), 
        __metadata('design:paramtypes', [])
    ], EmailComponent);
    return EmailComponent;
}());
exports.EmailComponent = EmailComponent;
//# sourceMappingURL=email.component.js.map