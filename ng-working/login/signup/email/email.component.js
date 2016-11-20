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
    function EmailComponent(myCheckerService) {
        this.myCheckerService = myCheckerService;
        this.top = -1;
        this.left = -1;
        this.isFocus = false;
        this.isFocusInfo = false;
        console.log("email/ myCheckerService : ", this.myCheckerService);
        // 서버에서 파라미터를 검증할 check 데이터를 받아옵니다.
        this.myCheckerService.getReady();
    }
    EmailComponent.prototype.ngOnInit = function () { };
    EmailComponent.prototype.setMyChecker = function () {
        console.log("setMyChecker / 1");
        if (null == this.myChecker) {
            console.log("setMyChecker / 2");
            this.myChecker = this.myCheckerService.getMyChecker("user_email");
            console.log("setMyChecker / 3 / this.myChecker : ", this.myChecker);
        }
    };
    EmailComponent.prototype.onClick = function (event) {
        event.stopPropagation();
        event.preventDefault();
        if (!this.isFocus) {
            this.isFocus = true;
        } // end if
        // Checker가 없다면, Checker를 가져옵니다.
        this.setMyChecker();
        // "regex_match[/^[a-zA-Z가-힣0-9]+$/]"
        // let myCheckerUserEmail:MyChecker = this.myCheckerService.getMyChecker("user_email");
    };
    EmailComponent.prototype.onBlur = function (event, email) {
        event.stopPropagation();
        event.preventDefault();
        if (this.isFocus) {
            this.isFocus = false;
        } // end if
        // 사용자가 입력한 이메일 주소를 검사합니다.
        if (!this.isOK(email)) {
            alert("이메일 주소를 다시 확인해주세요.");
            var lastHistory = this.myCheckerService.getLastHistory();
            console.log("email / onBlur / lastHistory : ", lastHistory);
        }
    };
    EmailComponent.prototype.isOK = function (email) {
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
    EmailComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'email',
            templateUrl: 'email.component.html',
            styleUrls: ['email.component.css']
        }), 
        __metadata('design:paramtypes', [my_checker_service_1.MyCheckerService])
    ], EmailComponent);
    return EmailComponent;
}());
exports.EmailComponent = EmailComponent;
//# sourceMappingURL=email.component.js.map