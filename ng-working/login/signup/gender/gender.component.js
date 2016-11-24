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
var my_logger_service_1 = require('../../../util/service/my-logger.service');
var my_checker_service_1 = require('../../../util/service/my-checker.service');
var my_event_service_1 = require('../../../util/service/my-event.service');
var GenderComponent = (function () {
    function GenderComponent(myLoggerService, myEventService) {
        this.myLoggerService = myLoggerService;
        this.myEventService = myEventService;
        this.top = -1;
        this.left = -1;
        this.topWarning = -1;
        this.leftWarning = -1;
        this.gender = "";
        this.myCheckerService = null;
        this.emitter = new core_1.EventEmitter();
        this.tooltipMsgGenderNotValid = "앗! 성별이 필요합니다.";
        this.isFocus = false;
        this.isFocusInfo = false;
        this.isSuccessInput = false;
        this.keyFemale = "F";
        this.keyMale = "M";
        this.keyNoGender = "U";
        this.isShowPopover = false;
    }
    GenderComponent.prototype.ngOnInit = function () { };
    GenderComponent.prototype.setMyChecker = function () {
        if (null == this.myCheckerService) {
            return;
        }
        if (null == this.myChecker) {
            this.myChecker = this.myCheckerService.getMyChecker("user_gender");
        }
    };
    GenderComponent.prototype.isOK = function (input) {
        this.setMyChecker();
        if (null == this.myCheckerService) {
            return false;
        }
        return this.myCheckerService.isOK(this.myChecker, input);
    };
    // @ Desc : 이메일이 제대로 입력되었는지 확인합니다.
    GenderComponent.prototype.hasNotDone = function () {
        return !this.hasDone();
    };
    GenderComponent.prototype.hasDone = function () {
        return this.isOK(this.gender);
    };
    // @ Desc : 이메일 입력을 확인해 달라는 표시를 보여줍니다.
    GenderComponent.prototype.showWarning = function () {
        this.isSuccessInput = false;
        this.tooltipMsg = this.tooltipMsgGenderNotValid;
    };
    GenderComponent.prototype.onClick = function (event) {
        event.stopPropagation();
        event.preventDefault();
        if (!this.isFocus) {
            this.isFocus = true;
        } // end if
        this.setMyChecker();
    };
    GenderComponent.prototype.onBlur = function (event) {
        event.stopPropagation();
        event.preventDefault();
        if (this.isFocus) {
            this.isFocus = false;
        } // end if
    };
    GenderComponent.prototype.onMouseOverInfo = function (event) {
        event.stopPropagation();
        event.preventDefault();
        if (!this.isFocusInfo) {
            this.isFocusInfo = true;
        } // end if
    };
    GenderComponent.prototype.onMouseOutInfo = function (event) {
        event.stopPropagation();
        event.preventDefault();
        if (this.isFocusInfo) {
            this.isFocusInfo = false;
        } // end if
    };
    GenderComponent.prototype.emitGenderSelected = function (gender) {
        if (this.keyFemale != gender && this.keyMale != gender) {
            return;
        }
        // 부모 객체에게 Change Event 발송 
        var myEventOnChange = this.myEventService.getMyEvent(
        // public eventName:string
        this.myEventService.ON_CHANGE, 
        // public key:string
        this.myEventService.KEY_USER_GENDER, 
        // public value:string
        gender, 
        // public metaObj:any
        null, 
        // public myChecker:MyChecker
        this.myChecker);
        this.emitter.emit(myEventOnChange);
    };
    GenderComponent.prototype.onClickGenderFemale = function (event) {
        event.stopPropagation();
        event.preventDefault();
        this.setMyChecker();
        if (this.gender === this.keyMale) {
            this.gender = this.keyMale;
        }
        this.emitGenderSelected(this.keyFemale);
        this.tooltipMsg = null;
    };
    GenderComponent.prototype.onClickGenderMale = function (event) {
        event.stopPropagation();
        event.preventDefault();
        this.setMyChecker();
        if (this.gender === this.keyFemale) {
            this.gender = this.keyFemale;
        }
        this.emitGenderSelected(this.keyMale);
        this.tooltipMsg = null;
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], GenderComponent.prototype, "top", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], GenderComponent.prototype, "left", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], GenderComponent.prototype, "topWarning", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], GenderComponent.prototype, "leftWarning", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], GenderComponent.prototype, "gender", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', my_checker_service_1.MyCheckerService)
    ], GenderComponent.prototype, "myCheckerService", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], GenderComponent.prototype, "emitter", void 0);
    GenderComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'gender',
            templateUrl: 'gender.component.html',
            styleUrls: ['gender.component.css']
        }), 
        __metadata('design:paramtypes', [my_logger_service_1.MyLoggerService, my_event_service_1.MyEventService])
    ], GenderComponent);
    return GenderComponent;
}());
exports.GenderComponent = GenderComponent;
//# sourceMappingURL=gender.component.js.map