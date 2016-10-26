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
/*
* @ Desc   : 시간을 나타내주는 원형 시계 컴포넌트, 시작 시간과 종료 시간을 작은 List로 나타내주는 시계 리스트를 담고 있는 컨테이너 컴포넌트입니다.
* @ Author : Wonder Jung
*/
var ClockBoardComponent = (function () {
    function ClockBoardComponent(imageService) {
        this.imageService = imageService;
        this.clockHeight = 83;
    }
    ClockBoardComponent.prototype.ngOnInit = function () {
        // Do something
        console.log("TEST / ClockBoardComponent / this.klassTimeBegin : ", this.klassTimeBegin);
        console.log("TEST / ClockBoardComponent / this.klassTimeEnd : ", this.klassTimeEnd);
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], ClockBoardComponent.prototype, "klassTimeBegin", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], ClockBoardComponent.prototype, "klassTimeEnd", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], ClockBoardComponent.prototype, "clockHeight", void 0);
    ClockBoardComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'clock-board',
            templateUrl: 'clock-board.component.html',
            styleUrls: ['clock-board.component.css']
        }), 
        __metadata('design:paramtypes', [image_service_1.ImageService])
    ], ClockBoardComponent);
    return ClockBoardComponent;
}());
exports.ClockBoardComponent = ClockBoardComponent;
//# sourceMappingURL=clock-board.component.js.map