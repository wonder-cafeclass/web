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
var input_view_updown_1 = require('./model/input-view-updown');
var InputViewUpdownComponent = (function () {
    function InputViewUpdownComponent() {
    }
    InputViewUpdownComponent.prototype.ngOnInit = function () {
        // Do nothing.
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', input_view_updown_1.InputViewUpdown)
    ], InputViewUpdownComponent.prototype, "data", void 0);
    InputViewUpdownComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'input-view-updown',
            templateUrl: 'input-view-updown.component.html',
            styleUrls: ['input-view-updown.component.css']
        }), 
        __metadata('design:paramtypes', [])
    ], InputViewUpdownComponent);
    return InputViewUpdownComponent;
}());
exports.InputViewUpdownComponent = InputViewUpdownComponent;
//# sourceMappingURL=input-view-updown.component.js.map