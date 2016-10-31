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
var MiniCalendarComponent = (function () {
    function MiniCalendarComponent() {
        this.calWidth = 150;
        this.calWidthMin = 150;
    }
    MiniCalendarComponent.prototype.ngOnInit = function () {
        // set column width
        if (this.calWidth < this.calWidthMin) {
            this.calWidth = this.calWidthMin;
        }
        for (var i = 0; i < this.calendarTable.length; ++i) {
            var row = this.calendarTable[i];
            for (var j = 0; j < row.length; ++j) {
                var ct = row[j];
                if (null != ct && (0 < ct.month)) {
                    this.monthBegin = +ct.month;
                    break;
                }
            }
        }
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Array)
    ], MiniCalendarComponent.prototype, "calendarTable", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], MiniCalendarComponent.prototype, "dayBegin", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], MiniCalendarComponent.prototype, "dateBegin", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], MiniCalendarComponent.prototype, "weekMin", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], MiniCalendarComponent.prototype, "weekMax", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], MiniCalendarComponent.prototype, "calWidth", void 0);
    MiniCalendarComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'mini-calendar',
            templateUrl: 'mini-calendar.component.html',
            styleUrls: ['mini-calendar.component.css']
        }), 
        __metadata('design:paramtypes', [])
    ], MiniCalendarComponent);
    return MiniCalendarComponent;
}());
exports.MiniCalendarComponent = MiniCalendarComponent;
//# sourceMappingURL=mini-calendar.component.js.map