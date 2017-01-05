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
var pagination_1 = require('./model/pagination');
/*
*
*	@ Desc : 페이지네이션 컴포넌트.
*	@ Author : Wonder Jung
*/
var PaginationComponent = (function () {
    function PaginationComponent(myCheckerService, watchTower) {
        this.myCheckerService = myCheckerService;
        this.watchTower = watchTower;
        this.emitter = new core_1.EventEmitter();
        this.eventKey = "";
        this.pagination = null;
    }
    PaginationComponent.prototype.isDebug = function () {
        return this.watchTower.isDebug();
    };
    PaginationComponent.prototype.ngOnInit = function () {
        this.subscribeEventPack();
        if (this.isDebug())
            console.log("pagination / ngOnInit / pagination : ", this.pagination);
    };
    PaginationComponent.prototype.subscribeEventPack = function () {
        var _this = this;
        if (this.isDebug())
            console.log("pagination / subscribeEventPack / init");
        var isEventPackReady = this.watchTower.getIsEventPackReady();
        if (this.isDebug())
            console.log("pagination / subscribeEventPack / isEventPackReady : ", isEventPackReady);
        if (this.watchTower.getIsEventPackReady()) {
            this.init();
        }
        else {
            // 2. EventPack 로딩이 완료되지 않았습니다. 로딩을 기다립니다.
            this.watchTower.isEventPackReady$.subscribe(function (isEventPackReady) {
                if (_this.isDebug())
                    console.log("pagination / subscribeEventPack / isEventPackReady : ", isEventPackReady);
                _this.init();
            }); // end subscribe
        } // end if
    }; // end method  
    PaginationComponent.prototype.init = function () {
        if (this.isDebug())
            console.log("pagination / init / 시작");
        if (this.isDebug())
            console.log("pagination / init / this.eventKey : ", this.eventKey);
        this.emitEventOnReady(this.eventKey);
    }; // end method
    PaginationComponent.prototype.emitEventOnReady = function (eventKey) {
        if (this.isDebug())
            console.log("pagination / emitEventOnReady / 시작");
        if (this.isDebug())
            console.log("pagination / emitEventOnReady / eventKey : ", eventKey);
        var myEvent = this.watchTower.getEventOnReady(
        // eventKey:string, 
        eventKey, 
        // component
        this);
        this.emitter.emit(myEvent);
        if (this.isDebug())
            console.log("pagination / emitEventOnReady / Done!");
    }; // end method
    PaginationComponent.prototype.onClick = function (event, pageNumSelected, pageBtn) {
        event.preventDefault();
        event.stopPropagation();
        if (null != pageBtn) {
            pageBtn.blur();
        } // end if
        if (this.isDebug())
            console.log("pagination / onClick / 시작");
        if (this.isDebug())
            console.log("pagination / onClick / value : ", pageNumSelected);
        if (null == this.pagination) {
            if (this.isDebug())
                console.log("pagination / onClick / 중단 / null == this.pagination");
            return;
        } // end if
        if (pageNumSelected === this.pagination.pageNum) {
            if (this.isDebug())
                console.log("pagination / onClick / 중단 / pageNumSelected === this.pagination.pageNum");
            return;
        } // end if
        // 사용자가 선택한 페이지 번호로 보여줍니다.
        this.pagination.pageNum = pageNumSelected;
        this.emitEventOnChange("" + pageNumSelected);
    }; // end method
    PaginationComponent.prototype.emitEventOnChange = function (value) {
        var myEvent = this.watchTower.getEventOnChange(
        // eventKey:string, 
        this.eventKey, 
        // value:string, 
        value, 
        // myChecker:MyChecker, 
        this.myCheckerService.getFreePassChecker());
        this.emitter.emit(myEvent);
    }; // end method
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], PaginationComponent.prototype, "emitter", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], PaginationComponent.prototype, "eventKey", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', pagination_1.Pagination)
    ], PaginationComponent.prototype, "pagination", void 0);
    PaginationComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'pagination',
            templateUrl: 'pagination.component.html',
            styleUrls: ['pagination.component.css']
        }), 
        __metadata('design:paramtypes', [my_checker_service_1.MyCheckerService, my_event_watchtower_service_1.MyEventWatchTowerService])
    ], PaginationComponent);
    return PaginationComponent;
}());
exports.PaginationComponent = PaginationComponent;
//# sourceMappingURL=pagination.component.js.map