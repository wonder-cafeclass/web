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
/*
*	@ Desc : 생년월일을 표시하기 위해 필요한 "연도","월","일" 배열을 돌려줍니다.
*/
var MyBirthdayService = (function () {
    function MyBirthdayService() {
        this.dayCntPerMonths = [
            31,
            29,
            31,
            30,
            31,
            30,
            31,
            31,
            30,
            31,
            30,
            31 // December		
        ];
    }
    MyBirthdayService.prototype.do = function () {
        // Something...
    };
    // @ Desc : 1950년부터 (현재연도 - 20년) 까지의 연도 배열을 가져옵니다.
    MyBirthdayService.prototype.getYear = function () {
        // 현재 연도 가져오기.
        var d = new Date();
        var n = d.getFullYear();
        var yearMin = 1950;
        var yearMax = n - 20;
        var yearArr = [];
        for (var i = yearMin; i <= yearMax; ++i) {
            yearArr.push(i);
        }
        return yearArr;
    };
    // @ Desc : 1월 ~ 12월
    MyBirthdayService.prototype.getMonth = function () {
        var monthArr = [];
        for (var i = 1; i <= 12; ++i) {
            monthArr.push(i);
        }
        return monthArr;
    };
    MyBirthdayService.prototype.getDay = function (month) {
        if (month < 1 || 12 < month) {
            return null;
        }
        var dayCnt = this.dayCntPerMonths[(month - 1)];
        var dayArr = [];
        for (var i = 1; i <= dayCnt; ++i) {
            dayArr.push(i);
        }
        return dayArr;
    };
    MyBirthdayService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], MyBirthdayService);
    return MyBirthdayService;
}());
exports.MyBirthdayService = MyBirthdayService;
//# sourceMappingURL=my-birthday.service.js.map