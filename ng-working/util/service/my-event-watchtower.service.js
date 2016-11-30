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
var Subject_1 = require('rxjs/Subject');
/*
*	@ Desc : 부모와 자식 객체 간의 - 모듈 단위로 부모, 자식 관계라도 상관없음. - 이벤트를 주고 받을수 있는 shared service 객체
*/
var MyEventWatchTowerService = (function () {
    function MyEventWatchTowerService() {
        // Observable string sources
        this.loginAnnouncedSource = new Subject_1.Subject();
        this.toggleTopMenuAnnouncedSource = new Subject_1.Subject();
        // Observable string streams
        this.loginAnnounced$ = this.loginAnnouncedSource.asObservable();
        this.toggleTopMenuAnnounced$ = this.toggleTopMenuAnnouncedSource.asObservable();
    }
    // Service message commands
    MyEventWatchTowerService.prototype.announceLogin = function (loginUser) {
        this.loginUser = loginUser;
        this.loginAnnouncedSource.next(loginUser);
    };
    MyEventWatchTowerService.prototype.announceToggleTopMenu = function (toggleTopMenu) {
        this.toggleTopMenuAnnouncedSource.next(toggleTopMenu);
    };
    MyEventWatchTowerService.prototype.getLoginUser = function () {
        return this.loginUser;
    };
    MyEventWatchTowerService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], MyEventWatchTowerService);
    return MyEventWatchTowerService;
}());
exports.MyEventWatchTowerService = MyEventWatchTowerService;
//# sourceMappingURL=my-event-watchtower.service.js.map