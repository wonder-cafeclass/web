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
var EmailComponent = (function () {
    function EmailComponent() {
        this.top = -1;
        this.left = -1;
        this.isFocus = false;
        this.isFocusInfo = false;
    }
    EmailComponent.prototype.ngOnInit = function () { };
    EmailComponent.prototype.onClick = function (event) {
        event.stopPropagation();
        event.preventDefault();
        if (!this.isFocus) {
            this.isFocus = true;
        } // end if
    };
    EmailComponent.prototype.onBlur = function (event) {
        event.stopPropagation();
        event.preventDefault();
        if (this.isFocus) {
            this.isFocus = false;
        } // end if
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
        __metadata('design:paramtypes', [])
    ], EmailComponent);
    return EmailComponent;
}());
exports.EmailComponent = EmailComponent;
//# sourceMappingURL=email.component.js.map