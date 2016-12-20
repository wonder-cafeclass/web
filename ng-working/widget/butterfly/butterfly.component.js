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
var ButterflyComponent = (function () {
    function ButterflyComponent(myCheckerService, myEventService) {
        this.myCheckerService = myCheckerService;
        this.myEventService = myEventService;
        // @ Common Props
        this.emitter = new core_1.EventEmitter();
        this.fontSizeTitle = 12;
        this.paddingTitle = 10;
        this.fontSizeText = 12;
        this.paddingText = 10;
        this.cageWidth = -1;
    }
    ButterflyComponent.prototype.ngOnInit = function () {
        // Do something.
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("butterfly / ngOnInit / 시작");
        if (0 < this.cageWidth) {
            this.cageWidthStr = this.cageWidth + "px";
        }
        else {
            this.cageWidthStr = "100%";
        }
        this.emitEventOnReady();
    };
    ButterflyComponent.prototype.setText = function (text) {
        if (null == text || "" === text) {
            return;
        }
        this.text = text;
    };
    ButterflyComponent.prototype.emitEventOnReady = function () {
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("butterfly / emitEventOnReady / 시작");
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
            console.log("butterfly / emitEventOnReady / Done!");
    };
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], ButterflyComponent.prototype, "emitter", void 0);
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
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], ButterflyComponent.prototype, "eventKey", void 0);
    ButterflyComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'butterfly',
            templateUrl: 'butterfly.component.html',
            styleUrls: ['butterfly.component.css']
        }), 
        __metadata('design:paramtypes', [my_checker_service_1.MyCheckerService, my_event_service_1.MyEventService])
    ], ButterflyComponent);
    return ButterflyComponent;
}());
exports.ButterflyComponent = ButterflyComponent;
//# sourceMappingURL=butterfly.component.js.map