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
var my_event_watchtower_service_1 = require('../../../util/service/my-event-watchtower.service');
var MyTitleComponent = (function () {
    function MyTitleComponent(watchTower) {
        this.watchTower = watchTower;
        // @ Common Props
        this.title = "";
        this.desc = "";
    } // end constructor
    MyTitleComponent.prototype.isDebug = function () {
        return this.watchTower.isDebug();
    }; // end method
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], MyTitleComponent.prototype, "title", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], MyTitleComponent.prototype, "desc", void 0);
    MyTitleComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'my-title',
            templateUrl: 'my-title.component.html',
            styleUrls: ['my-title.component.css']
        }), 
        __metadata('design:paramtypes', [my_event_watchtower_service_1.MyEventWatchTowerService])
    ], MyTitleComponent);
    return MyTitleComponent;
}());
exports.MyTitleComponent = MyTitleComponent; // end class
//# sourceMappingURL=my-title.component.js.map