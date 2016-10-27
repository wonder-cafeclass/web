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
var PriceTagComponent = (function () {
    function PriceTagComponent() {
        this.fontSizePrice = 16;
    }
    PriceTagComponent.prototype.ngOnInit = function () {
        this.priceWithFormat = this.numberWithCommas(this.price);
        // 최대 백만원 단위까지 나타낼 수 있도록 폰트 사이즈를 조정.
        if (1000000 < this.price) {
            this.fontSizePrice = 14;
        }
    };
    PriceTagComponent.prototype.numberWithCommas = function (x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], PriceTagComponent.prototype, "title", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], PriceTagComponent.prototype, "price", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], PriceTagComponent.prototype, "currency", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], PriceTagComponent.prototype, "color", void 0);
    PriceTagComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'pricetag-updown',
            templateUrl: 'pricetag.component.html',
            styleUrls: ['pricetag.component.css']
        }), 
        __metadata('design:paramtypes', [])
    ], PriceTagComponent);
    return PriceTagComponent;
}());
exports.PriceTagComponent = PriceTagComponent;
//# sourceMappingURL=pricetag.component.js.map