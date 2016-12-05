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
        this.isAdmin = false;
        this.apiKey = "";
        // Observable string sources
        this.loginAnnouncedSource = new Subject_1.Subject();
        this.toggleTopMenuAnnouncedSource = new Subject_1.Subject();
        this.isAdminSource = new Subject_1.Subject();
        this.checkerMapSource = new Subject_1.Subject();
        this.constMapSource = new Subject_1.Subject();
        this.dirtyWordListSource = new Subject_1.Subject();
        this.apiKeySource = new Subject_1.Subject();
        this.myCheckerServiceReadySource = new Subject_1.Subject();
        this.errorMsgArrSource = new Subject_1.Subject();
        // Observable string streams
        this.loginAnnounced$ = this.loginAnnouncedSource.asObservable();
        this.toggleTopMenuAnnounced$ = this.toggleTopMenuAnnouncedSource.asObservable();
        this.isAdmin$ = this.isAdminSource.asObservable();
        this.checkerMap$ = this.checkerMapSource.asObservable();
        this.constMap$ = this.constMapSource.asObservable();
        this.dirtyWordList$ = this.dirtyWordListSource.asObservable();
        this.apiKey$ = this.apiKeySource.asObservable();
        this.myCheckerServiceReady$ = this.myCheckerServiceReadySource.asObservable();
        this.errorMsgArr$ = this.errorMsgArrSource.asObservable();
    }
    // Service message commands
    MyEventWatchTowerService.prototype.announceLogin = function (loginUser) {
        this.loginUser = loginUser;
        this.loginAnnouncedSource.next(loginUser);
    };
    MyEventWatchTowerService.prototype.announceToggleTopMenu = function (toggleTopMenu) {
        this.toggleTopMenuAnnouncedSource.next(toggleTopMenu);
    };
    MyEventWatchTowerService.prototype.announceIsAdmin = function (isAdmin) {
        this.isAdmin = isAdmin;
        this.isAdminSource.next(isAdmin);
    };
    // @ Desc : 화면에 출력해야 하는 Error message를 app.component에게 공유함.
    MyEventWatchTowerService.prototype.announceErrorMsgArr = function (errorMsgArr) {
        this.errorMsgArr = errorMsgArr;
        this.errorMsgArrSource.next(errorMsgArr);
    };
    MyEventWatchTowerService.prototype.announceMyCheckerServiceReady = function (checkerMap, constMap, dirtyWordList, apiKey) {
        if (null == checkerMap) {
            return;
        }
        if (null == constMap) {
            return;
        }
        if (null == dirtyWordList) {
            return;
        }
        if (null == apiKey || "" == apiKey) {
            return;
        }
        this.checkerMap = checkerMap;
        this.checkerMapSource.next(checkerMap);
        this.constMap = constMap;
        this.constMapSource.next(constMap);
        this.dirtyWordList = dirtyWordList;
        this.dirtyWordListSource.next(dirtyWordList);
        this.apiKey = apiKey;
        this.apiKeySource.next(apiKey);
        this.myCheckerServiceReadySource.next(true);
    };
    MyEventWatchTowerService.prototype.getLoginUser = function () {
        return this.loginUser;
    };
    MyEventWatchTowerService.prototype.getIsAdmin = function () {
        return this.isAdmin;
    };
    MyEventWatchTowerService.prototype.getCheckerMap = function () {
        return this.checkerMap;
    };
    MyEventWatchTowerService.prototype.getConstMap = function () {
        return this.constMap;
    };
    MyEventWatchTowerService.prototype.getDirtyWordList = function () {
        return this.dirtyWordList;
    };
    MyEventWatchTowerService.prototype.getApiKey = function () {
        return this.apiKey;
    };
    MyEventWatchTowerService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], MyEventWatchTowerService);
    return MyEventWatchTowerService;
}());
exports.MyEventWatchTowerService = MyEventWatchTowerService;
//# sourceMappingURL=my-event-watchtower.service.js.map