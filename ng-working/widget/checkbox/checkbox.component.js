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
var my_event_watchtower_service_1 = require('../../util/service/my-event-watchtower.service');
/*
*
*	@ Desc : 하나의 체크박스만을 나타내는 컴포넌트. 컴포넌트 내부에서 다수의 checkbox 참조를 제어할 수 없어 만든 래핑 컴포넌트.
*	@ Author : Wonder Jung
*/
var CheckBoxComponent = (function () {
    function CheckBoxComponent(myCheckerService, watchTower) {
        this.myCheckerService = myCheckerService;
        this.watchTower = watchTower;
        this.emitter = new core_1.EventEmitter();
        this.eventKey = "";
        this.metaObj = null;
        this.isChecked = false;
    }
    CheckBoxComponent.prototype.isDebug = function () {
        return this.watchTower.isDebug();
    };
    CheckBoxComponent.prototype.ngOnInit = function () {
        this.subscribeEventPack();
    };
    CheckBoxComponent.prototype.subscribeEventPack = function () {
        var _this = this;
        if (this.isDebug())
            console.log("checkbox / subscribeEventPack / init");
        var isEventPackReady = this.watchTower.getIsEventPackReady();
        if (this.isDebug())
            console.log("checkbox / subscribeEventPack / isEventPackReady : ", isEventPackReady);
        if (this.watchTower.getIsEventPackReady()) {
            this.init();
        }
        else {
            // 2. EventPack 로딩이 완료되지 않았습니다. 로딩을 기다립니다.
            this.watchTower.isEventPackReady$.subscribe(function (isEventPackReady) {
                if (_this.isDebug())
                    console.log("checkbox / subscribeEventPack / isEventPackReady : ", isEventPackReady);
                _this.init();
            }); // end subscribe
        } // end if
    }; // end method  
    CheckBoxComponent.prototype.init = function () {
        if (this.isDebug())
            console.log("checkbox / init / 시작");
        if (this.isDebug())
            console.log("checkbox / init / this.eventKey : ", this.eventKey);
        this.emitEventOnReady(this.eventKey);
    };
    CheckBoxComponent.prototype.emitEventOnReady = function (eventKey) {
        if (this.isDebug())
            console.log("checkbox / emitEventOnReady / 시작");
        if (this.isDebug())
            console.log("checkbox / emitEventOnReady / eventKey : ", eventKey);
        var myEvent = this.watchTower.getEventOnReady(
        // eventKey:string, 
        eventKey, 
        // component
        this);
        this.emitter.emit(myEvent);
        if (this.isDebug())
            console.log("checkbox / emitEventOnReady / Done!");
    };
    CheckBoxComponent.prototype.onChange = function (event, value) {
        event.preventDefault();
        event.stopPropagation();
        if (this.isDebug())
            console.log("checkbox / onChange / 시작");
        if (this.isDebug())
            console.log("checkbox / onChange / value : ", value);
        this.isChecked = value;
        this.emitEventOnChange(value);
    };
    CheckBoxComponent.prototype.isChecked = function () {
        return this.isChecked;
    };
    CheckBoxComponent.prototype.setIsChecked = function (isChecked) {
        this.isChecked = isChecked;
    };
    CheckBoxComponent.prototype.emitEventOnChange = function (value) {
        var myEvent = this.watchTower.getEventOnChangeMeta(
        // eventKey:string, 
        this.eventKey, 
        // value:string, 
        value, 
        // myChecker:MyChecker, 
        this.myCheckerService.getFreePassChecker(), 
        // meta:any
        this.metaObj);
        this.emitter.emit(myEvent);
    };
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], CheckBoxComponent.prototype, "emitter", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], CheckBoxComponent.prototype, "eventKey", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], CheckBoxComponent.prototype, "metaObj", void 0);
    CheckBoxComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'checkbox-single',
            templateUrl: 'checkbox.component.html',
            styleUrls: ['checkbox.component.css']
        }), 
        __metadata('design:paramtypes', [my_checker_service_1.MyCheckerService, my_event_watchtower_service_1.MyEventWatchTowerService])
    ], CheckBoxComponent);
    return CheckBoxComponent;
}());
exports.CheckBoxComponent = CheckBoxComponent;
//# sourceMappingURL=checkbox.component.js.map