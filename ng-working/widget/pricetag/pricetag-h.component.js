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
var PriceTagHComponent = (function () {
    function PriceTagHComponent() {
        this.fontSizeTitle = 12;
        this.paddingTitle = 10;
        this.fontSizeDesc = 12;
        this.paddingDesc = 10;
        this.fontSizePrice = 12;
        this.paddingTopPrice = 10;
        this.cageWidth = -1;
        this.cageWidthStr = "";
    }
    PriceTagHComponent.prototype.ngOnInit = function () {
        this.priceWithFormat = this.numberWithCommas(this.price);
        if (0 < this.cageWidth) {
            this.cageWidthStr = this.cageWidth + "px";
        }
        else {
            this.cageWidthStr = "100%";
        }
    };
    PriceTagHComponent.prototype.numberWithCommas = function (x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], PriceTagHComponent.prototype, "title", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], PriceTagHComponent.prototype, "fontSizeTitle", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], PriceTagHComponent.prototype, "paddingTitle", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], PriceTagHComponent.prototype, "desc", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], PriceTagHComponent.prototype, "fontSizeDesc", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], PriceTagHComponent.prototype, "paddingDesc", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], PriceTagHComponent.prototype, "price", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], PriceTagHComponent.prototype, "fontSizePrice", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], PriceTagHComponent.prototype, "paddingTopPrice", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], PriceTagHComponent.prototype, "cageWidth", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], PriceTagHComponent.prototype, "currency", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], PriceTagHComponent.prototype, "color", void 0);
    PriceTagHComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'pricetag-h',
            templateUrl: 'pricetag-h.component.html',
            styleUrls: ['pricetag-h.component.css']
        }), 
        __metadata('design:paramtypes', [])
    ], PriceTagHComponent);
    return PriceTagHComponent;
}());
exports.PriceTagHComponent = PriceTagHComponent;
//# sourceMappingURL=pricetag-h.component.js.map