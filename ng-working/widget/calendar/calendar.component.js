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
var CalendarComponent = (function () {
    function CalendarComponent() {
        this.calWidth = 150;
    }
    CalendarComponent.prototype.ngOnInit = function () {
        // Do something
        console.log("TEST / CalendarComponent / dateBegin : ", this.dateBegin);
        console.log("TEST / CalendarComponent / weekMin : ", this.weekMin);
        console.log("TEST / CalendarComponent / weekMax : ", this.weekMax);
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], CalendarComponent.prototype, "dateBegin", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], CalendarComponent.prototype, "weekMin", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], CalendarComponent.prototype, "weekMax", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], CalendarComponent.prototype, "calWidth", void 0);
    CalendarComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'simple-calendar',
            templateUrl: 'calendar.component.html',
            styleUrls: ['calendar.component.css']
        }), 
        __metadata('design:paramtypes', [])
    ], CalendarComponent);
    return CalendarComponent;
}());
exports.CalendarComponent = CalendarComponent;
//# sourceMappingURL=calendar.component.js.map