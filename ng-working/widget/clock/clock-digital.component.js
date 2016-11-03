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
var clock_time_1 = require('./model/clock-time');
/*
* @ Desc   : 시간을 나타내주는 원형 시계 컴포넌트, 시작 시간과 종료 시간을 작은 List로 나타내주는 시계 리스트를 담고 있는 컨테이너 컴포넌트입니다.
* @ Author : Wonder Jung
*/
var ClockDigitalComponent = (function () {
    function ClockDigitalComponent(imageService) {
        this.imageService = imageService;
        this.clockHeight = 83;
        this.clockWidth = 83;
        this.is24 = false;
        this.rowHeight = 0;
        this.rowPadding = 10;
        this.elementHeight = 20;
        this.textMarginTop = 0;
        this.fontSize = 14;
    }
    ClockDigitalComponent.prototype.ngOnInit = function () {
        this.rowHeight = Math.round(this.clockHeight / 2);
        this.fontSize = 14;
        if (60 <= this.rowHeight) {
            this.fontSize = 24;
        }
        this.textMarginTop = Math.floor((this.rowHeight - ((this.rowPadding * 2) + this.elementHeight)) / 2);
        if (24 <= this.fontSize) {
            this.textMarginTop = 2;
        }
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], ClockDigitalComponent.prototype, "clockHeight", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], ClockDigitalComponent.prototype, "clockWidth", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', clock_time_1.ClockTime)
    ], ClockDigitalComponent.prototype, "clockTimeBegin", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', clock_time_1.ClockTime)
    ], ClockDigitalComponent.prototype, "clockTimeEnd", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], ClockDigitalComponent.prototype, "is24", void 0);
    ClockDigitalComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'clock-digital',
            templateUrl: 'clock-digital.component.html',
            styleUrls: ['clock-digital.component.css']
        }), 
        __metadata('design:paramtypes', [image_service_1.ImageService])
    ], ClockDigitalComponent);
    return ClockDigitalComponent;
}());
exports.ClockDigitalComponent = ClockDigitalComponent;
//# sourceMappingURL=clock-digital.component.js.map