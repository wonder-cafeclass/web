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
var my_event_service_1 = require('../../util/my-event.service');
var my_event_1 = require('../../util/model/my-event');
var checkbox_option_1 = require('../../widget/checkbox/model/checkbox-option');
var KlassCheckboxService = (function () {
    // 카페 클래스에서 사용하는 대표적인 체크박스 설정값 - week_min,week_max,...
    function KlassCheckboxService(myEventService) {
        this.myEventService = myEventService;
    }
    /*
    *    @ Desc : 유저가 몇주(weeks) 수강하려는 결정을 도와주는 체크박스 데이터
    */
    KlassCheckboxService.prototype.getKlassEnrolmentWeeks = function (klass, idxFocus) {
        var optionList = [
            new checkbox_option_1.CheckboxOption(
            // public myEvent:MyEvent
            new my_event_1.MyEvent(
            // public eventName:string
            this.myEventService.ON_CHANGE_KLASS_ENROLMENT_WEEKS, 
            // public title:string
            "4주", 
            // public key:string
            "week_max", 
            // public value:string
            "4", 
            // public metaObj:any
            klass), 
            // public isFocus:boolean
            false),
            new checkbox_option_1.CheckboxOption(
            // public myEvent:MyEvent
            new my_event_1.MyEvent(
            // public eventName:string
            this.myEventService.ON_CHANGE_KLASS_ENROLMENT_WEEKS, 
            // public title:string
            "8주", 
            // public key:string
            "week_max", 
            // public value:string
            "8", 
            // public metaObj:any
            klass), 
            // public isFocus:boolean
            false),
            new checkbox_option_1.CheckboxOption(
            // public myEvent:MyEvent
            new my_event_1.MyEvent(
            // public eventName:string
            this.myEventService.ON_CHANGE_KLASS_ENROLMENT_WEEKS, 
            // public title:string
            "12주", 
            // public key:string
            "week_max", 
            // public value:string
            "12", 
            // public metaObj:any
            klass), 
            // public isFocus:boolean
            false)
        ];
        if (idxFocus < optionList.length) {
            for (var i = 0; i < optionList.length; ++i) {
                var option = optionList[i];
                if (i === idxFocus) {
                    option.isFocus = true;
                    optionList[i] = option;
                }
            }
        }
        return optionList;
    };
    /*
    *    @ Desc : 유저가 다음 수업에 참여할 수 있는 주(weeks) 간격에 대한 체크박스 데이터.
    */
    KlassCheckboxService.prototype.getKlassEnrolmentInterval = function (klass, valueFocus) {
        var optionList = [
            new checkbox_option_1.CheckboxOption(
            // public myEvent:MyEvent
            new my_event_1.MyEvent(
            // public eventName:string
            this.myEventService.ON_CHANGE_KLASS_ENROLMENT_INTERVAL, 
            // public title:string
            "4주마다", 
            // public key:string
            "enrollment_interval_week", 
            // public value:string
            "4", 
            // public metaObj:any
            klass), 
            // public isFocus:boolean
            false),
            new checkbox_option_1.CheckboxOption(
            // public myEvent:MyEvent
            new my_event_1.MyEvent(
            // public eventName:string
            this.myEventService.ON_CHANGE_KLASS_ENROLMENT_INTERVAL, 
            // public title:string
            "2주마다", 
            // public key:string
            "enrollment_interval_week", 
            // public value:string
            "2", 
            // public metaObj:any
            klass), 
            // public isFocus:boolean
            false),
            new checkbox_option_1.CheckboxOption(
            // public myEvent:MyEvent
            new my_event_1.MyEvent(
            // public eventName:string
            this.myEventService.ON_CHANGE_KLASS_ENROLMENT_INTERVAL, 
            // public title:string
            "매주마다", 
            // public key:string
            "enrollment_interval_week", 
            // public value:string
            "1", 
            // public metaObj:any
            klass), 
            // public isFocus:boolean
            false)
        ];
        if (null != valueFocus && "" != valueFocus) {
            for (var i = 0; i < optionList.length; ++i) {
                var option = optionList[i];
                if (option.myEvent.value === valueFocus) {
                    option.isFocus = true;
                    optionList[i] = option;
                }
            }
        }
        return optionList;
    };
    /*
    *    @ Desc : 가장 짧은 수강 기간에 대한 체크박스 데이터.
    */
    KlassCheckboxService.prototype.getKlassWeeksMin = function (klass, valueFocus) {
        var optionList = [
            new checkbox_option_1.CheckboxOption(
            // public myEvent:MyEvent
            new my_event_1.MyEvent(
            // public eventName:string
            this.myEventService.ON_CHANGE_KLASS_WEEKS_MIN, 
            // public title:string
            "4주", 
            // public key:string
            "week_min", 
            // public value:string
            "4", 
            // public metaObj:any
            klass), 
            // public isFocus:boolean
            false),
            new checkbox_option_1.CheckboxOption(
            // public myEvent:MyEvent
            new my_event_1.MyEvent(
            // public eventName:string
            this.myEventService.ON_CHANGE_KLASS_WEEKS_MIN, 
            // public title:string
            "8주", 
            // public key:string
            "week_min", 
            // public value:string
            "8", 
            // public metaObj:any
            klass), 
            // public isFocus:boolean
            false),
            new checkbox_option_1.CheckboxOption(
            // public myEvent:MyEvent
            new my_event_1.MyEvent(
            // public eventName:string
            this.myEventService.ON_CHANGE_KLASS_WEEKS_MIN, 
            // public title:string
            "12주", 
            // public key:string
            "week_min", 
            // public value:string
            "12", 
            // public metaObj:any
            klass), 
            // public isFocus:boolean
            false)
        ];
        if (null != valueFocus && "" != valueFocus) {
            for (var i = 0; i < optionList.length; ++i) {
                var option = optionList[i];
                if (option.myEvent.value === valueFocus) {
                    option.isFocus = true;
                    optionList[i] = option;
                }
            }
        }
        return optionList;
    };
    /*
    *    @ Desc : 가장 긴 수강 기간에 대한 체크박스 데이터.
    */
    KlassCheckboxService.prototype.getKlassWeeksMax = function (klass, valueFocus) {
        var optionList = [
            new checkbox_option_1.CheckboxOption(
            // public myEvent:MyEvent
            new my_event_1.MyEvent(
            // public eventName:string
            this.myEventService.ON_CHANGE_KLASS_WEEKS_MIN, 
            // public title:string
            "4주", 
            // public key:string
            "week_min", 
            // public value:string
            "4", 
            // public metaObj:any
            klass), 
            // public isFocus:boolean
            false),
            new checkbox_option_1.CheckboxOption(
            // public myEvent:MyEvent
            new my_event_1.MyEvent(
            // public eventName:string
            this.myEventService.ON_CHANGE_KLASS_WEEKS_MIN, 
            // public title:string
            "8주", 
            // public key:string
            "week_min", 
            // public value:string
            "8", 
            // public metaObj:any
            klass), 
            // public isFocus:boolean
            false),
            new checkbox_option_1.CheckboxOption(
            // public myEvent:MyEvent
            new my_event_1.MyEvent(
            // public eventName:string
            this.myEventService.ON_CHANGE_KLASS_WEEKS_MIN, 
            // public title:string
            "12주", 
            // public key:string
            "week_min", 
            // public value:string
            "12", 
            // public metaObj:any
            klass), 
            // public isFocus:boolean
            false)
        ];
        if (null != valueFocus && "" != valueFocus) {
            for (var i = 0; i < optionList.length; ++i) {
                var option = optionList[i];
                if (option.myEvent.value === valueFocus) {
                    option.isFocus = true;
                    optionList[i] = option;
                }
            }
        }
        return optionList;
    };
    KlassCheckboxService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [my_event_service_1.MyEventService])
    ], KlassCheckboxService);
    return KlassCheckboxService;
}());
exports.KlassCheckboxService = KlassCheckboxService;
//# sourceMappingURL=klass-checkbox.service.js.map