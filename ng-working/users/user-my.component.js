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
var my_logger_service_1 = require('../util/service/my-logger.service');
var my_checker_service_1 = require('../util/service/my-checker.service');
var my_event_service_1 = require('../util/service/my-event.service');
var my_event_watchtower_service_1 = require('../util/service/my-event-watchtower.service');
var UserMyComponent = (function () {
    function UserMyComponent(myLoggerService, myCheckerService, myEventService, myEventWatchTowerService, router) {
        this.myLoggerService = myLoggerService;
        this.myCheckerService = myCheckerService;
        this.myEventService = myEventService;
        this.myEventWatchTowerService = myEventWatchTowerService;
        this.router = router;
    }
    UserMyComponent.prototype.ngOnInit = function () { };
    UserMyComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'user-my',
            templateUrl: 'user-my.component.html',
            styleUrls: ['user-my.component.css']
        }), 
        __metadata('design:paramtypes', [my_logger_service_1.MyLoggerService, my_checker_service_1.MyCheckerService, my_event_service_1.MyEventService, my_event_watchtower_service_1.MyEventWatchTowerService, router_1.Router])
    ], UserMyComponent);
    return UserMyComponent;
}());
exports.UserMyComponent = UserMyComponent;
//# sourceMappingURL=user-my.component.js.map