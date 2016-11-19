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
var PhoneNumberComponent = (function () {
    function PhoneNumberComponent() {
        this.top = -1;
        this.left = -1;
        this.isFocus = false;
        this.isFocusInfo = false;
        this.isFocusPhoneNumHead = false;
        this.isFocusPhoneNumBody = false;
        this.isFocusPhoneNumTail = false;
        this.isFocusPhoneNumInfo = false;
    }
    PhoneNumberComponent.prototype.ngOnInit = function () { };
    PhoneNumberComponent.prototype.onMouseOverInfo = function (event) {
        event.stopPropagation();
        event.preventDefault();
        if (!this.isFocusInfo) {
            this.isFocusInfo = true;
        } // end if
    };
    PhoneNumberComponent.prototype.onMouseOutInfo = function (event) {
        event.stopPropagation();
        event.preventDefault();
        if (this.isFocusInfo) {
            this.isFocusInfo = false;
        } // end if
    };
    PhoneNumberComponent.prototype.onClickPhoneNumHead = function (event) {
        event.stopPropagation();
        event.preventDefault();
        if (!this.isFocusPhoneNumHead) {
            this.isFocusPhoneNumHead = true;
        } // end if
    };
    PhoneNumberComponent.prototype.onBlurPhoneNumHead = function (event) {
        event.stopPropagation();
        event.preventDefault();
        if (this.isFocusPhoneNumHead) {
            this.isFocusPhoneNumHead = false;
        } // end if
    };
    PhoneNumberComponent.prototype.onClickPhoneNumBody = function (event) {
        event.stopPropagation();
        event.preventDefault();
        if (!this.isFocusPhoneNumBody) {
            this.isFocusPhoneNumBody = true;
        } // end if
    };
    PhoneNumberComponent.prototype.onBlurPhoneNumBody = function (event) {
        event.stopPropagation();
        event.preventDefault();
        if (this.isFocusPhoneNumBody) {
            this.isFocusPhoneNumBody = false;
        } // end if
    };
    PhoneNumberComponent.prototype.onClickPhoneNumTail = function (event) {
        event.stopPropagation();
        event.preventDefault();
        if (!this.isFocusPhoneNumTail) {
            this.isFocusPhoneNumTail = true;
        } // end if
    };
    PhoneNumberComponent.prototype.onBlurPhoneNumTail = function (event) {
        event.stopPropagation();
        event.preventDefault();
        if (this.isFocusPhoneNumTail) {
            this.isFocusPhoneNumTail = false;
        } // end if
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], PhoneNumberComponent.prototype, "top", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], PhoneNumberComponent.prototype, "left", void 0);
    PhoneNumberComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'phone-number',
            templateUrl: 'phone-number.component.html',
            styleUrls: ['phone-number.component.css']
        }), 
        __metadata('design:paramtypes', [])
    ], PhoneNumberComponent);
    return PhoneNumberComponent;
}());
exports.PhoneNumberComponent = PhoneNumberComponent;
//# sourceMappingURL=phone-number.component.js.map