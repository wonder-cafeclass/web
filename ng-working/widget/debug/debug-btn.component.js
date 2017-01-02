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
var my_event_watchtower_service_1 = require('../../util/service/my-event-watchtower.service');
var image_service_1 = require('../../util/image.service');
var DebugBtnComponent = (function () {
    function DebugBtnComponent(imageService, watchTower) {
        this.imageService = imageService;
        this.watchTower = watchTower;
        // @ Common Props
        this.eventKey = "";
        this.emitter = new core_1.EventEmitter();
        this.isDebugging = false;
        if (this.isDebug())
            console.log("DebugBtn / constructor / init");
        this.asyncViewPack();
    } // end constructor
    DebugBtnComponent.prototype.isDebug = function () {
        return this.watchTower.isDebug();
    }; // end method
    DebugBtnComponent.prototype.asyncViewPack = function () {
        var _this = this;
        if (this.isDebug())
            console.log("DebugBtn / asyncViewPack / 시작");
        // 이미 View 기본정보가 들어왔다면 바로 가져온다. 
        if (this.watchTower.getIsEventPackReady()) {
            if (this.isDebug())
                console.log("DebugBtn / asyncViewPack / getIsEventPackReady : ", this.watchTower.getIsEventPackReady());
            this.init();
        } // end if
        // View에 필요한 기본 정보가 비동기로 들어올 경우, 처리.
        this.watchTower.isEventPackReady$.subscribe(function (isEventPackReady) {
            if (_this.isDebug())
                console.log("DebugBtn / asyncViewPack / subscribe / isEventPackReady : ", isEventPackReady);
            _this.init();
        }); // end subscribe
    };
    DebugBtnComponent.prototype.init = function () {
        if (this.isDebug())
            console.log("DebugBtn / init / 시작");
        // watchTower에 설정된 isDebug 값이 있다면 가져옵니다.
        this.isDebugging = this.watchTower.isDebug();
        // 부모 객체에게 준비되었다는 이벤트를 보냅니다.
        this.emitEventOnReady();
    };
    DebugBtnComponent.prototype.emitEventOnReady = function () {
        if (this.isDebug())
            console.log("DebugBtn / emitEventOnReady / 시작");
        var myEvent = this.watchTower.getEventOnReady(
        // eventKey:string, 
        this.eventKey, 
        // component
        this);
        this.emitter.emit(myEvent);
        if (this.isDebug())
            console.log("DebugBtn / emitEventOnReady / Done!");
    };
    DebugBtnComponent.prototype.emitEventOnChange = function (value) {
        if (this.isDebug())
            console.log("DebugBtn / emitEventOnChange / 시작");
        if (null == value) {
            if (this.isDebug())
                console.log("DebugBtn / emitEventOnChange / 중단 / value is not valid!");
            return;
        }
        var myEvent = this.watchTower.getEventOnChange(
        // eventKey:string, 
        this.eventKey, 
        // value:string, 
        value, 
        // myChecker:MyChecker
        this.watchTower.getMyCheckerService().getFreePassChecker());
        this.emitter.emit(myEvent);
        if (this.isDebug())
            console.log("DebugBtn / emitEventOnChange / Done!");
    };
    DebugBtnComponent.prototype.onToggleDebugging = function (event) {
        event.stopPropagation();
        event.preventDefault();
        if (this.isDebug())
            console.log("DebugBtn / onToggleDebugging / \uC2DC\uC791");
        this.isDebugging = !this.isDebugging;
        if (this.isDebug())
            console.log("DebugBtn / onToggleDebugging / this.isDebugging : " + this.isDebugging);
        this.watchTower.announceIsDebugging(this.isDebugging);
    }; // end method
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], DebugBtnComponent.prototype, "eventKey", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], DebugBtnComponent.prototype, "emitter", void 0);
    DebugBtnComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'debug-btn',
            templateUrl: 'debug-btn.component.html',
            styleUrls: ['debug-btn.component.css']
        }), 
        __metadata('design:paramtypes', [image_service_1.ImageService, my_event_watchtower_service_1.MyEventWatchTowerService])
    ], DebugBtnComponent);
    return DebugBtnComponent;
}());
exports.DebugBtnComponent = DebugBtnComponent; // end class
//# sourceMappingURL=debug-btn.component.js.map