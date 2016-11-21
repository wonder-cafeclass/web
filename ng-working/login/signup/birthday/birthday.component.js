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
var my_birthday_service_1 = require("../../../util/service/my-birthday.service");
var BirthdayComponent = (function () {
    function BirthdayComponent(myBirthdayService) {
        this.myBirthdayService = myBirthdayService;
        this.top = -1;
        this.left = -1;
        this.isFocus = false;
        this.isFocusInfo = false;
        this.selectedYear = -1;
        this.selectedMonth = -1;
        this.selectedDay = -1;
    }
    BirthdayComponent.prototype.ngOnInit = function () {
        this.birthYearArr = this.myBirthdayService.getYear();
        this.selectedYear = this.birthYearArr[Math.round(this.birthYearArr.length * 2 / 3)];
        this.birthMonthArr = this.myBirthdayService.getMonth();
        this.selectedMonth = this.birthMonthArr[Math.round(this.birthMonthArr.length / 2)];
        this.birthDayArr = this.myBirthdayService.getDay(this.selectedMonth);
        this.selectedDay = this.birthDayArr[Math.round(this.birthDayArr.length / 2)];
    };
    BirthdayComponent.prototype.onClick = function (event) {
        event.stopPropagation();
        event.preventDefault();
        if (!this.isFocus) {
            this.isFocus = true;
        } // end if
    };
    BirthdayComponent.prototype.onBlur = function (event) {
        event.stopPropagation();
        event.preventDefault();
        if (this.isFocus) {
            this.isFocus = false;
        } // end if
    };
    BirthdayComponent.prototype.onMouseOverInfo = function (event) {
        event.stopPropagation();
        event.preventDefault();
        if (!this.isFocusInfo) {
            this.isFocusInfo = true;
        } // end if
    };
    BirthdayComponent.prototype.onMouseOutInfo = function (event) {
        event.stopPropagation();
        event.preventDefault();
        if (this.isFocusInfo) {
            this.isFocusInfo = false;
        } // end if
    };
    BirthdayComponent.prototype.onChangeBirthYear = function (selectBirthYear) {
        this.selectedYear = selectBirthYear;
    };
    BirthdayComponent.prototype.onChangeBirthMonth = function (selectBirthMonth) {
        this.selectedMonth = selectBirthMonth;
        // 월이 바뀌었습니다. 월별 날짜도 연동되어 바꿉니다.
        this.birthDayArr = this.myBirthdayService.getDay(this.selectedMonth);
        this.selectedDay = this.birthDayArr[Math.round(this.birthDayArr.length / 2)];
    };
    BirthdayComponent.prototype.onChangeBirthDay = function (selectBirthDay) {
        this.selectedDay = selectBirthDay;
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], BirthdayComponent.prototype, "top", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], BirthdayComponent.prototype, "left", void 0);
    BirthdayComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'birthday',
            templateUrl: 'birthday.component.html',
            styleUrls: ['birthday.component.css']
        }), 
        __metadata('design:paramtypes', [my_birthday_service_1.MyBirthdayService])
    ], BirthdayComponent);
    return BirthdayComponent;
}());
exports.BirthdayComponent = BirthdayComponent;
//# sourceMappingURL=birthday.component.js.map