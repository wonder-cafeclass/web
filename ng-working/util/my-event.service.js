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
var MyEventService = (function () {
    function MyEventService() {
        // 부모 자식간의 컴포넌트 통신시 어떤 이벤트가 발생했는지 정의하는 서비스 객체.
        this.ON_CHANGE_KLASS_DISCOUNT = "ON_CHANGE_KLASS_DISCOUNT";
        this.ON_CHANGE_KLASS_TITLE = "ON_CHANGE_KLASS_TITLE";
        this.ON_CHANGE_KLASS_PRICE = "ON_CHANGE_KLASS_PRICE";
        this.ON_CHANGE_KLASS_TIME = "ON_CHANGE_KLASS_TIME";
        this.ON_CHANGE_KLASS_DATE = "ON_CHANGE_KLASS_DATE";
        this.ON_CHANGE_KLASS_DAYS = "ON_CHANGE_KLASS_DAYS";
        this.ON_CHANGE_KLASS_LEVEL = "ON_CHANGE_KLASS_LEVEL";
        this.ON_CHANGE_KLASS_ENROLMENT_INTERVAL = "ON_CHANGE_KLASS_ENROLMENT_INTERVAL";
        this.ON_CHANGE_KLASS_WEEKS_MIN = "ON_CHANGE_KLASS_WEEKS_MIN";
        this.ON_CHANGE_KLASS_WEEKS_MAX = "ON_CHANGE_KLASS_WEEKS_MAX";
        this.ON_CHANGE_KLASS_DATE_BEGIN = "ON_CHANGE_KLASS_DATE_BEGIN";
        this.ON_CHANGE_KLASS_ENROLMENT_WEEKS = "ON_CHANGE_KLASS_ENROLMENT_WEEKS";
        this.ON_CHANGE_NAV_TABS_KLASS_INFO = "ON_CHANGE_NAV_TABS_KLASS_INFO";
        this.ON_MOUSEENTER_KLASS_CALENDAR_DATE = "ON_MOUSEENTER_KLASS_CALENDAR_DATE";
        this.ON_MOUSELEAVE_KLASS_CALENDAR_DATE = "ON_MOUSELEAVE_KLASS_CALENDAR_DATE";
    }
    MyEventService.prototype.has_it = function (event_name) {
        if (this.ON_CHANGE_KLASS_DISCOUNT === event_name ||
            this.ON_CHANGE_KLASS_PRICE === event_name ||
            this.ON_CHANGE_KLASS_TIME === event_name ||
            this.ON_CHANGE_KLASS_DATE === event_name ||
            this.ON_CHANGE_KLASS_LEVEL === event_name ||
            this.ON_CHANGE_KLASS_ENROLMENT_INTERVAL === event_name ||
            this.ON_CHANGE_KLASS_WEEKS_MIN === event_name ||
            this.ON_CHANGE_KLASS_WEEKS_MAX === event_name ||
            this.ON_CHANGE_KLASS_DATE_BEGIN === event_name) {
            return true;
        }
        return false;
    };
    MyEventService.prototype.is_it = function (target_event_name, event_name) {
        if (!this.has_it(target_event_name)) {
            return false;
        }
        if (!this.has_it(event_name)) {
            return false;
        }
        if (target_event_name === event_name) {
            return true;
        }
        return false;
    };
    MyEventService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], MyEventService);
    return MyEventService;
}());
exports.MyEventService = MyEventService;
//# sourceMappingURL=my-event.service.js.map