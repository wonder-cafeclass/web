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
var image_service_1 = require('../../util/image.service');
var my_event_service_1 = require('../../util/my-event.service');
var my_event_1 = require('../../util/model/my-event');
var MiniCalendarComponent = (function () {
    function MiniCalendarComponent(imageService, myEventService) {
        this.imageService = imageService;
        this.myEventService = myEventService;
        this.calWidth = 145;
        this.calWidthMin = 145;
        this.emitter = new core_1.EventEmitter();
    }
    MiniCalendarComponent.prototype.ngOnInit = function () {
        // set column width
        if (this.calWidth < this.calWidthMin) {
            this.calWidth = this.calWidthMin;
        }
        // 몇 월인지 가져오기.
        var ct = this.calendarTable[(this.calendarTable.length - 1)][0];
        if (null != ct && (0 < ct.month)) {
            this.monthBegin = +ct.month;
        }
    };
    // (mouseenter)="onMouseEnterKlassDate($event, field)"
    // (mouseleave)="onMouseLeaveKlassDate($event, field)"
    MiniCalendarComponent.prototype.onMouseLeaveKlassDate = function (event, date) {
        event.stopPropagation();
        var myEvent = new my_event_1.MyEvent(
        // public eventName:string
        this.myEventService.ON_MOUSELEAVE_KLASS_CALENDAR_DATE, 
        // public title:string
        "mini-calendar", 
        // public key:string
        "date", 
        // public value:string
        date.date, 
        // public metaObj:any
        date);
        this.emitter.emit(myEvent);
    };
    MiniCalendarComponent.prototype.onMouseEnterKlassDate = function (event, date) {
        event.stopPropagation();
        var myEvent = new my_event_1.MyEvent(
        // public eventName:string
        this.myEventService.ON_MOUSEENTER_KLASS_CALENDAR_DATE, 
        // public title:string
        "mini-calendar", 
        // public key:string
        "date", 
        // public value:string
        date.date, 
        // public metaObj:any
        date);
        this.emitter.emit(myEvent);
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
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], MiniCalendarComponent.prototype, "emitter", void 0);
    MiniCalendarComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'mini-calendar',
            templateUrl: 'mini-calendar.component.html',
            styleUrls: ['mini-calendar.component.css']
        }), 
        __metadata('design:paramtypes', [image_service_1.ImageService, my_event_service_1.MyEventService])
    ], MiniCalendarComponent);
    return MiniCalendarComponent;
}());
exports.MiniCalendarComponent = MiniCalendarComponent;
//# sourceMappingURL=mini-calendar.component.js.map