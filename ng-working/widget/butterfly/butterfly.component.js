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
var ButterflyComponent = (function () {
    function ButterflyComponent() {
        this.fontSizeTitle = 12;
        this.paddingTitle = 10;
        this.fontSizeText = 12;
        this.paddingText = 10;
        this.cageWidth = 150;
    }
    ButterflyComponent.prototype.ngOnInit = function () {
        // Do something.
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], ButterflyComponent.prototype, "title", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], ButterflyComponent.prototype, "text", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], ButterflyComponent.prototype, "fontSizeTitle", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], ButterflyComponent.prototype, "paddingTitle", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], ButterflyComponent.prototype, "fontSizeText", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], ButterflyComponent.prototype, "paddingText", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], ButterflyComponent.prototype, "cageWidth", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], ButterflyComponent.prototype, "color", void 0);
    ButterflyComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'butterfly',
            templateUrl: 'butterfly.component.html',
            styleUrls: ['butterfly.component.css']
        }), 
        __metadata('design:paramtypes', [])
    ], ButterflyComponent);
    return ButterflyComponent;
}());
exports.ButterflyComponent = ButterflyComponent;
//# sourceMappingURL=butterfly.component.js.map