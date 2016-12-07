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
        // @ Required for view
        this.isAdmin = null;
        this.apiKey = "";
        this.isViewPackReady = false;
        // Observable sources
        // @ Required for view
        this.isAdminSource = new Subject_1.Subject();
        // REMOVE ME
        // private checkerMapSource = new Subject<any>();
        // private constMapSource = new Subject<any>();
        // private dirtyWordListSource = new Subject<any>();
        // private apiKeySource = new Subject<string>();
        this.myCheckerServicePackReadySource = new Subject_1.Subject();
        this.isViewPackReadySource = new Subject_1.Subject();
        // @ Optional for view
        this.loginAnnouncedSource = new Subject_1.Subject();
        this.toggleTopMenuAnnouncedSource = new Subject_1.Subject();
        this.errorMsgArrSource = new Subject_1.Subject();
        // Observable streams
        // @ Required for view
        this.isAdmin$ = this.isAdminSource.asObservable();
        // REMOVE ME
        // checkerMap$ = this.checkerMapSource.asObservable();
        // constMap$ = this.constMapSource.asObservable();
        // dirtyWordList$ = this.dirtyWordListSource.asObservable();
        // apiKey$ = this.apiKeySource.asObservable();
        this.myCheckerServicePackReady$ = this.myCheckerServicePackReadySource.asObservable();
        this.isViewPackReady$ = this.isViewPackReadySource.asObservable();
        // @ Optional for view
        this.loginAnnounced$ = this.loginAnnouncedSource.asObservable();
        this.toggleTopMenuAnnounced$ = this.toggleTopMenuAnnouncedSource.asObservable();
        this.errorMsgArr$ = this.errorMsgArrSource.asObservable();
    }
    // Service message commands
    // @ Required for view
    MyEventWatchTowerService.prototype.announceIsAdmin = function (isAdmin) {
        this.isAdmin = isAdmin;
        this.isAdminSource.next(isAdmin);
        this.announceIsViewPackReady();
    };
    MyEventWatchTowerService.prototype.announceMyCheckerServiceReady = function (checkerMap, constMap, dirtyWordList, apiKey) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("my-event-watchtower / announceMyCheckerServiceReady / \uC2DC\uC791");
        if (null == checkerMap) {
            if (isDebug)
                console.log("my-event-watchtower / announceMyCheckerServiceReady / checkerMap is not valid!");
            return;
        }
        if (null == constMap) {
            if (isDebug)
                console.log("my-event-watchtower / announceMyCheckerServiceReady / constMap is not valid!");
            return;
        }
        if (null == dirtyWordList) {
            if (isDebug)
                console.log("my-event-watchtower / announceMyCheckerServiceReady / dirtyWordList is not valid!");
            return;
        }
        if (null == apiKey || "" == apiKey) {
            if (isDebug)
                console.log("my-event-watchtower / announceMyCheckerServiceReady / apiKey is not valid!");
            return;
        }
        this.checkerMap = checkerMap;
        this.constMap = constMap;
        this.dirtyWordList = dirtyWordList;
        this.apiKey = apiKey;
        this.myCheckerServicePackReadySource.next(true);
        if (isDebug)
            console.log("my-event-watchtower / announceMyCheckerServiceReady / done.");
        if (isDebug)
            console.log("my-event-watchtower / announceMyCheckerServiceReady / apiKey : " + apiKey);
        this.announceIsViewPackReady();
    };
    // @ Desc : 뷰에 필요한 정보들이 모두 도착했는지 검사해서 알려줍니다.
    MyEventWatchTowerService.prototype.announceIsViewPackReady = function () {
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("my-event-watchtower / announceIsViewPackReady / \uC2DC\uC791");
        if (null == this.isAdmin || !this.getIsMyCheckerReady()) {
            return;
        }
        if (isDebug)
            console.log("my-event-watchtower / announceIsViewPackReady / \uC900\uBE44\uC644\uB8CC!");
        this.isViewPackReady = true;
        this.isViewPackReadySource.next(true);
    };
    // @ Optional for view
    MyEventWatchTowerService.prototype.announceLogin = function (loginUser) {
        this.loginUser = loginUser;
        this.loginAnnouncedSource.next(loginUser);
    };
    MyEventWatchTowerService.prototype.announceToggleTopMenu = function (toggleTopMenu) {
        this.toggleTopMenuAnnouncedSource.next(toggleTopMenu);
    };
    // @ Desc : 화면에 출력해야 하는 Error message를 app.component에게 공유함.
    MyEventWatchTowerService.prototype.announceErrorMsgArr = function (errorMsgArr) {
        this.errorMsgArr = errorMsgArr;
        this.errorMsgArrSource.next(errorMsgArr);
    };
    MyEventWatchTowerService.prototype.getLoginUser = function () {
        return this.loginUser;
    };
    MyEventWatchTowerService.prototype.getIsAdmin = function () {
        return this.isAdmin;
    };
    MyEventWatchTowerService.prototype.getIsMyCheckerReady = function () {
        if (null == this.getCheckerMap()) {
            return false;
        }
        if (null == this.getConstMap()) {
            return false;
        }
        if (null == this.getDirtyWordList()) {
            return false;
        }
        if (null == this.getApiKey()) {
            return false;
        }
        return true;
    };
    MyEventWatchTowerService.prototype.getIsViewPackReady = function () {
        return this.isViewPackReady;
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