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
var GenderComponent = (function () {
    function GenderComponent() {
        this.top = -1;
        this.left = -1;
        this.isFocus = false;
        this.isFocusInfo = false;
        this.isFemale = true;
    }
    GenderComponent.prototype.ngOnInit = function () { };
    GenderComponent.prototype.onClick = function (event) {
        event.stopPropagation();
        event.preventDefault();
        if (!this.isFocus) {
            this.isFocus = true;
        } // end if
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
    GenderComponent.prototype.onClickGenderFemale = function (event) {
        event.stopPropagation();
        event.preventDefault();
        if (!this.isFemale) {
            this.isFemale = true;
        } // end if    
    };
    GenderComponent.prototype.onClickGenderMale = function (event) {
        event.stopPropagation();
        event.preventDefault();
        if (this.isFemale) {
            this.isFemale = false;
        } // end if
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], GenderComponent.prototype, "top", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], GenderComponent.prototype, "left", void 0);
    GenderComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'gender',
            templateUrl: 'gender.component.html',
            styleUrls: ['gender.component.css']
        }), 
        __metadata('design:paramtypes', [])
    ], GenderComponent);
    return GenderComponent;
}());
exports.GenderComponent = GenderComponent;
//# sourceMappingURL=gender.component.js.map