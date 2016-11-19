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
var NameComponent = (function () {
    function NameComponent() {
        this.top = -1;
        this.left = -1;
        this.isFocus = false;
        this.isFocusInfo = false;
    }
    NameComponent.prototype.ngOnInit = function () { };
    NameComponent.prototype.onClick = function (event) {
        event.stopPropagation();
        event.preventDefault();
        if (!this.isFocus) {
            this.isFocus = true;
        } // end if
    };
    NameComponent.prototype.onBlur = function (event) {
        event.stopPropagation();
        event.preventDefault();
        if (this.isFocus) {
            this.isFocus = false;
        } // end if
    };
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
    NameComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'name',
            templateUrl: 'name.component.html',
            styleUrls: ['name.component.css']
        }), 
        __metadata('design:paramtypes', [])
    ], NameComponent);
    return NameComponent;
}());
exports.NameComponent = NameComponent;
//# sourceMappingURL=name.component.js.map