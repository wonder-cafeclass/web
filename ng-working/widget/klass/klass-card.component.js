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
var klass_1 = require('../../klass/model/klass');
var KlassCardComponent = (function () {
    function KlassCardComponent(watchTower) {
        // Do something...
        this.watchTower = watchTower;
        // @ Common Props
        this.emitter = new core_1.EventEmitter();
        this.size = "default";
        this.isSmall = false;
        this.width = -1;
        this.widthStr = "";
    } // end constructor
    KlassCardComponent.prototype.isDebug = function () {
        return this.watchTower.isDebug();
    }; // end method
    KlassCardComponent.prototype.ngOnInit = function () {
        if (this.isDebug())
            console.log("klass-card / ngOnInit / init");
        if (this.isDebug())
            console.log("klass-card / ngOnInit / this.width : ", this.width);
        if (0 < this.width) {
            this.widthStr = this.width + "px";
        }
        else {
            this.widthStr = "100%";
        }
        this.asyncViewPack();
    };
    KlassCardComponent.prototype.asyncViewPack = function () {
        var _this = this;
        if (this.isDebug())
            console.log("klass-card / asyncViewPack / 시작");
        // 이미 View 기본정보가 들어왔다면 바로 가져온다. 
        if (this.watchTower.getIsViewPackReady()) {
            if (this.isDebug())
                console.log("klass-card / asyncViewPack / isViewPackReady : ", true);
            this.init();
        } // end if
        // View에 필요한 기본 정보가 비동기로 들어올 경우, 처리.
        this.watchTower.isViewPackReady$.subscribe(function (isViewPackReady) {
            if (_this.isDebug())
                console.log("klass-card / asyncViewPack / subscribe / isViewPackReady : ", isViewPackReady);
            _this.init();
        }); // end subscribe
    };
    KlassCardComponent.prototype.init = function () {
        if (this.isDebug())
            console.log("klass-card / init / 시작");
        // 부모 객체에게 준비되었다는 이벤트를 보냅니다.
        this.emitEventOnReady();
    };
    KlassCardComponent.prototype.emitEventOnReady = function () {
        if (this.isDebug())
            console.log("klass-card / emitEventOnReady / 시작");
        var myEvent = this.watchTower.getEventOnReady(
        // eventKey:string, 
        this.eventKey, 
        // component
        this);
        this.emitter.emit(myEvent);
        if (this.isDebug())
            console.log("klass-card / emitEventOnReady / Done!");
    };
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], KlassCardComponent.prototype, "emitter", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], KlassCardComponent.prototype, "eventKey", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', klass_1.Klass)
    ], KlassCardComponent.prototype, "klass", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], KlassCardComponent.prototype, "size", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], KlassCardComponent.prototype, "isSmall", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], KlassCardComponent.prototype, "width", void 0);
    KlassCardComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'klass-card',
            templateUrl: 'klass-card.component.html',
            styleUrls: ['klass-card.component.css']
        }), 
        __metadata('design:paramtypes', [my_event_watchtower_service_1.MyEventWatchTowerService])
    ], KlassCardComponent);
    return KlassCardComponent;
}());
exports.KlassCardComponent = KlassCardComponent; // end class
// TODO - Dirty word list 검수 과정 필요! 
//# sourceMappingURL=klass-card.component.js.map