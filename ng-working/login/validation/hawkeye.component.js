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
var router_1 = require('@angular/router');
var my_event_watchtower_service_1 = require('../../util/service/my-event-watchtower.service');
var HawkeyeComponent = (function () {
    function HawkeyeComponent(watchTower, router) {
        this.watchTower = watchTower;
        this.router = router;
    } // end function
    HawkeyeComponent.prototype.ngAfterViewInit = function () {
        // 디버깅 모드로 변경.
        this.watchTower.announceIsDebugging(true);
        // 홈으로 이동.
        this.router.navigate(['/']);
    };
    HawkeyeComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'hawkeye',
            templateUrl: 'hawkeye.component.html',
            styleUrls: ['hawkeye.component.css']
        }), 
        __metadata('design:paramtypes', [my_event_watchtower_service_1.MyEventWatchTowerService, router_1.Router])
    ], HawkeyeComponent);
    return HawkeyeComponent;
}());
exports.HawkeyeComponent = HawkeyeComponent; // end class
//# sourceMappingURL=hawkeye.component.js.map