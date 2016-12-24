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
var my_checker_service_1 = require('../../util/service/my-checker.service');
var my_event_service_1 = require('../../util/service/my-event.service');
var my_event_watchtower_service_1 = require('../../util/service/my-event-watchtower.service');
var PriceTagHComponent = (function () {
    function PriceTagHComponent(myCheckerService, myEventService, watchTower) {
        this.myCheckerService = myCheckerService;
        this.myEventService = myEventService;
        this.watchTower = watchTower;
        this.fontSizeTitle = 12;
        this.paddingTitle = 10;
        this.fontSizeDesc = 12;
        this.paddingDesc = 10;
        this.fontSizePrice = 12;
        this.paddingTopPrice = 10;
        this.cageWidth = -1;
        this.cageWidthStr = "";
        this.emitter = new core_1.EventEmitter();
    }
    PriceTagHComponent.prototype.ngOnInit = function () {
        this.priceWithFormat = this.numberWithCommas(this.price);
        if (0 < this.cageWidth) {
            this.cageWidthStr = this.cageWidth + "px";
        }
        else {
            this.cageWidthStr = "100%";
        }
        // 부모 객체에게 준비되었다는 이벤트를 보냅니다.
        this.emitEventOnReady();
    };
    PriceTagHComponent.prototype.emitEventOnReady = function () {
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("pricetag-h / emitEventOnReady / 시작");
        var myEventOnChange = this.myEventService.getMyEvent(
        // public eventName:string
        this.myEventService.ON_READY, 
        // public key:string
        this.eventKey, 
        // public value:string
        "", 
        // public metaObj:any
        this, 
        // public myChecker:MyChecker
        this.myCheckerService.getFreePassChecker());
        this.emitter.emit(myEventOnChange);
        if (isDebug)
            console.log("pricetag-h / emitEventOnReady / Done!");
    };
    PriceTagHComponent.prototype.setTitle = function (title) {
        // title
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("pricetag-h / setTitle / 시작");
        if (null == title || "" === title) {
            if (isDebug)
                console.log("pricetag-h / setTitle / 중단 / title is not valid!");
            return;
        }
        this.title = title;
    };
    PriceTagHComponent.prototype.setPrice = function (price) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("pricetag-h / setPrice / 시작");
        if (isDebug)
            console.log("pricetag-h / setPrice / price : ", price);
        this.priceWithFormat = this.numberWithCommas(price);
        if (isDebug)
            console.log("pricetag-h / setPrice / this.priceWithFormat : ", this.priceWithFormat);
    };
    // @ Desc : 가격 밑에 보여지는 설명 ex) 수수료등.
    PriceTagHComponent.prototype.setPriceDesc = function (priceDesc) {
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("pricetag-h / setPrice / 시작");
        if (isDebug)
            console.log("pricetag-h / setPrice / priceDesc : ", priceDesc);
        this.priceDesc = priceDesc;
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
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], PriceTagHComponent.prototype, "eventKey", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], PriceTagHComponent.prototype, "emitter", void 0);
    PriceTagHComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'pricetag-h',
            templateUrl: 'pricetag-h.component.html',
            styleUrls: ['pricetag-h.component.css']
        }), 
        __metadata('design:paramtypes', [my_checker_service_1.MyCheckerService, my_event_service_1.MyEventService, my_event_watchtower_service_1.MyEventWatchTowerService])
    ], PriceTagHComponent);
    return PriceTagHComponent;
}());
exports.PriceTagHComponent = PriceTagHComponent;
//# sourceMappingURL=pricetag-h.component.js.map