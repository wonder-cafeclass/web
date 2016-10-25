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
var ClockComponent = (function () {
    function ClockComponent(imageService) {
        this.imageService = imageService;
    }
    ClockComponent.prototype.ngOnInit = function () {
        // Do something
        this.clock1hrUrl = this.imageService.get(this.imageService.clock1hrUrl);
        this.clock2hrUrl = this.imageService.get(this.imageService.clock2hrUrl);
        this.clock3hrUrl = this.imageService.get(this.imageService.clock3hrUrl);
        this.clockBGUrl = this.imageService.get(this.imageService.clockBGUrl);
        console.log("TEST / this.clock1hrUrl ::: ", this.clock1hrUrl);
        console.log("TEST / this.clock2hrUrl ::: ", this.clock2hrUrl);
        console.log("TEST / this.clock3hrUrl ::: ", this.clock3hrUrl);
        console.log("TEST / this.clockBGUrl ::: ", this.clockBGUrl);
    };
    ClockComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'simple-clock',
            templateUrl: 'clock.component.html',
            styleUrls: ['clock.component.css']
        }), 
        __metadata('design:paramtypes', [image_service_1.ImageService])
    ], ClockComponent);
    return ClockComponent;
}());
exports.ClockComponent = ClockComponent;
//# sourceMappingURL=clock.component.js.map