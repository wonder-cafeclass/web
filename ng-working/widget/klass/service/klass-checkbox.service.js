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
var my_event_service_1 = require('../../../util/service/my-event.service');
var checkbox_option_1 = require('../../../widget/checkbox/model/checkbox-option');
var KlassCheckBoxService = (function () {
    // 카페 클래스에서 사용하는 대표적인 체크박스 설정값 - week_min,week_max,...
    function KlassCheckBoxService(myEventService) {
        this.myEventService = myEventService;
    }
    /*
    *    @ Desc : 유저가 수강할 수 있는 요일을 선택하는 체크박스 데이터
    */
    KlassCheckBoxService.prototype.getKlassDays = function (klass) {
        var optionList = [
            new checkbox_option_1.CheckBoxOption(
            // public title:string,
            "일요일", false, this.myEventService.getMyEvent(
            // public eventName:string
            this.myEventService.ANY, 
            // public key:string
            this.myEventService.KLASS_DAYS, 
            // public value:string
            this.myEventService.KLASS_DAYS_SUNDAY, 
            // public metaObj:any
            klass, 
            // public myChecker:MyChecker
            null)),
            new checkbox_option_1.CheckBoxOption(
            // public title:string,
            "월요일", false, this.myEventService.getMyEvent(
            // public eventName:string
            this.myEventService.ANY, 
            // public key:string
            this.myEventService.KLASS_DAYS, 
            // public value:string
            this.myEventService.KLASS_DAYS_MONDAY, 
            // public metaObj:any
            klass, 
            // public myChecker:MyChecker
            null)),
            new checkbox_option_1.CheckBoxOption(
            // public title:string,
            "화요일", false, this.myEventService.getMyEvent(
            // public eventName:string
            this.myEventService.ANY, 
            // public key:string
            this.myEventService.KLASS_DAYS, 
            // public value:string
            this.myEventService.KLASS_DAYS_TUESDAY, 
            // public metaObj:any
            klass, 
            // public myChecker:MyChecker
            null)),
            new checkbox_option_1.CheckBoxOption(
            // public title:string,
            "수요일", false, this.myEventService.getMyEvent(
            // public eventName:string
            this.myEventService.ANY, 
            // public key:string
            this.myEventService.KLASS_DAYS, 
            // public value:string
            this.myEventService.KLASS_DAYS_WEDNESDAY, 
            // public metaObj:any
            klass, 
            // public myChecker:MyChecker
            null)),
            new checkbox_option_1.CheckBoxOption(
            // public title:string,
            "목요일", false, this.myEventService.getMyEvent(
            // public eventName:string
            this.myEventService.ANY, 
            // public key:string
            this.myEventService.KLASS_DAYS, 
            // public value:string
            this.myEventService.KLASS_DAYS_THURSDAY, 
            // public metaObj:any
            klass, 
            // public myChecker:MyChecker
            null)),
            new checkbox_option_1.CheckBoxOption(
            // public title:string,
            "금요일", false, this.myEventService.getMyEvent(
            // public eventName:string
            this.myEventService.ANY, 
            // public key:string
            this.myEventService.KLASS_DAYS, 
            // public value:string
            this.myEventService.KLASS_DAYS_FRIDAY, 
            // public metaObj:any
            klass, 
            // public myChecker:MyChecker
            null)),
            new checkbox_option_1.CheckBoxOption(
            // public title:string,
            "토요일", false, this.myEventService.getMyEvent(
            // public eventName:string
            this.myEventService.ANY, 
            // public key:string
            this.myEventService.KLASS_DAYS, 
            // public value:string
            this.myEventService.KLASS_DAYS_SATURDAY, 
            // public metaObj:any
            klass, 
            // public myChecker:MyChecker
            null))
        ];
        // set focus
        var daysMap = {};
        var daysList = klass.days_list;
        if (null != daysList && 0 < daysList.length) {
            for (var i = 0; i < daysList.length; ++i) {
                var day = daysList[i];
                daysMap[day] = day;
            }
        }
        for (var i = 0; i < optionList.length; ++i) {
            var option = optionList[i];
            if (null != daysMap[option.myEvent.value]) {
                option.isFocus = true;
                optionList[i] = option;
            }
        }
        return optionList;
    };
    KlassCheckBoxService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [my_event_service_1.MyEventService])
    ], KlassCheckBoxService);
    return KlassCheckBoxService;
}());
exports.KlassCheckBoxService = KlassCheckBoxService;
//# sourceMappingURL=klass-checkbox.service.js.map