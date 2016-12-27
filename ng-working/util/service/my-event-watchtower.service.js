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
var my_const_1 = require('../../util/helper/my-const');
/*
*	@ Desc : 부모와 자식 객체 간의 - 모듈 단위로 부모, 자식 관계라도 상관없음. - 이벤트를 주고 받을수 있는 shared service 객체
*/
var MyEventWatchTowerService = (function () {
    function MyEventWatchTowerService() {
        // @ Required for view
        this.isAdmin = false;
        this.apiKey = "";
        this.isViewPackReady = false;
        this.isLockedBottomFooterFlexible = false;
        this.isEventPackReady = false;
        // Observable sources
        // @ Required for view
        this.isAdminSource = new Subject_1.Subject();
        this.myCheckerServicePackReadySource = new Subject_1.Subject();
        this.isViewPackReadySource = new Subject_1.Subject();
        // @ Optional for view
        this.loginAnnouncedSource = new Subject_1.Subject();
        this.loginTeacherAnnouncedSource = new Subject_1.Subject();
        this.toggleTopMenuAnnouncedSource = new Subject_1.Subject();
        this.errorMsgArrSource = new Subject_1.Subject();
        this.contentHeightSource = new Subject_1.Subject();
        this.isLockedBottomFooterFlexibleSource = new Subject_1.Subject();
        this.myEventServiceSource = new Subject_1.Subject();
        this.myCheckerServiceSource = new Subject_1.Subject();
        this.isEventPackReadySource = new Subject_1.Subject();
        // Observable streams
        // @ Required for view
        this.isAdmin$ = this.isAdminSource.asObservable();
        this.myCheckerServicePackReady$ = this.myCheckerServicePackReadySource.asObservable();
        this.isViewPackReady$ = this.isViewPackReadySource.asObservable();
        // @ Optional for view
        this.loginAnnounced$ = this.loginAnnouncedSource.asObservable();
        this.loginTeacherAnnounced$ = this.loginTeacherAnnouncedSource.asObservable();
        this.toggleTopMenuAnnounced$ = this.toggleTopMenuAnnouncedSource.asObservable();
        this.errorMsgArr$ = this.errorMsgArrSource.asObservable();
        this.contentHeight$ = this.contentHeightSource.asObservable();
        this.isLockedBottomFooterFlexible$ = this.isLockedBottomFooterFlexibleSource.asObservable();
        this.myEventService$ = this.myEventServiceSource.asObservable();
        this.myCheckerService$ = this.myCheckerServiceSource.asObservable();
        this.isEventPackReady$ = this.isEventPackReadySource.asObservable();
        this.myConst = new my_const_1.HelperMyConst();
    }
    // Service message commands
    // @ Required for view
    MyEventWatchTowerService.prototype.announceIsAdmin = function (isAdmin) {
        this.isAdmin = isAdmin;
        if (null != this.loginUser) {
            this.loginUser.setIsAdmin(this.isAdmin);
        }
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
        this.myConst.setConstJSON(this.constMap);
        this.myCheckerServicePackReadySource.next(true);
        if (isDebug)
            console.log("my-event-watchtower / announceMyCheckerServiceReady / done.");
        if (isDebug)
            console.log("my-event-watchtower / announceMyCheckerServiceReady / apiKey : " + apiKey);
        this.announceIsViewPackReady();
    };
    // @ Desc : 뷰에 필요한 정보들이 모두 도착했는지 검사해서 알려줍니다.
    MyEventWatchTowerService.prototype.announceIsViewPackReady = function () {
        // let isDebug:boolean = true;
        var isDebug = false;
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
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("my-event-watchtower / announceLogin / \uC2DC\uC791");
        this.loginUser = loginUser;
        if (null != this.loginUser) {
            if (isDebug)
                console.log("my-event-watchtower / announceLogin / setTeacher");
            this.loginUser.setTeacher(this.loginTeacher);
            this.loginUser.setIsAdmin(this.isAdmin);
        }
        this.loginAnnouncedSource.next(loginUser);
        if (isDebug)
            console.log("my-event-watchtower / announceLogin / \uB05D");
    };
    MyEventWatchTowerService.prototype.announceLoginTeacher = function (loginTeacher) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("my-event-watchtower / announceLoginTeacher / \uC2DC\uC791");
        this.loginTeacher = loginTeacher;
        if (null != this.loginTeacher) {
            if (isDebug)
                console.log("my-event-watchtower / announceLoginTeacher / setTeacher");
            this.loginUser.setTeacher(this.loginTeacher);
        }
        this.loginTeacherAnnouncedSource.next(loginTeacher);
        if (isDebug)
            console.log("my-event-watchtower / announceLoginTeacher / \uB05D");
    };
    MyEventWatchTowerService.prototype.announceToggleTopMenu = function (toggleTopMenu) {
        this.toggleTopMenuAnnouncedSource.next(toggleTopMenu);
    };
    // @ Desc : 콘텐츠 추가 등으로 화면의 높이가 변경되었을 경우, 호출됩니다.
    MyEventWatchTowerService.prototype.announceContentHeight = function () {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("my-event-watchtower / announceContentHeight / 시작");
        var body = document.body;
        var clientHeight = body.clientHeight;
        if (this.contentHeight === clientHeight) {
            if (isDebug)
                console.log("my-event-watchtower / announceContentHeight / 중단 / 같은 높이라면 업데이트하지 않습니다");
            return;
        }
        // @ Alternatives
        // let offsetHeight:number = body.offsetHeight;
        // let html = document.documentElement;
        // let scrollHeight:number = body.scrollHeight;
        this.contentHeight = clientHeight;
        this.contentHeightSource.next(clientHeight);
        /*
        // 실제 보여지는 브라우저 내의 화면 높이를 의미합니다.
        let contentHeight:number = window.innerHeight;
        if(isDebug) console.log("footer / announceContentHeight / contentHeight : ",contentHeight);

        // 위와 같습니다.
        let clientHeight:number = document.documentElement.clientHeight;
        if(isDebug) console.log("footer / announceContentHeight / clientHeight : ",clientHeight);

        // 물리적인 디스플레이의 높이를 의미합니다.
        let screenHeight:number = screen.height;
        if(isDebug) console.log("footer / announceContentHeight / screenHeight : ",screenHeight);
        */
    };
    // @ Desc : 화면에 출력해야 하는 Error message를 app.component에게 공유함.
    MyEventWatchTowerService.prototype.announceErrorMsgArr = function (errorMsgArr) {
        this.errorMsgArr = errorMsgArr;
        this.errorMsgArrSource.next(errorMsgArr);
    };
    MyEventWatchTowerService.prototype.announceIsLockedBottomFooterFlexible = function (isLockedBottomFooterFlexible) {
        this.isLockedBottomFooterFlexible = isLockedBottomFooterFlexible;
        this.isLockedBottomFooterFlexibleSource.next(isLockedBottomFooterFlexible);
    };
    MyEventWatchTowerService.prototype.announceMyEventService = function (myEventService) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("m-e-w / announceMyEventService / init");
        this.myEventService = myEventService;
        this.myEventServiceSource.next(myEventService);
        if (null != this.myCheckerService) {
            if (isDebug)
                console.log("m-e-w / announceMyEventService / next");
            this.isEventPackReady = true;
            this.isEventPackReadySource.next(true);
        } // end if
    };
    MyEventWatchTowerService.prototype.announceMyCheckerService = function (myCheckerService) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("m-e-w / announceMyCheckerService / init");
        this.myCheckerService = myCheckerService;
        this.myCheckerServiceSource.next(myCheckerService);
        if (null != this.myEventService) {
            if (isDebug)
                console.log("m-e-w / announceMyCheckerService / next");
            this.isEventPackReady = true;
            this.isEventPackReadySource.next(true);
        } // end if
    };
    MyEventWatchTowerService.prototype.getLoginUser = function () {
        return this.loginUser;
    };
    MyEventWatchTowerService.prototype.getLoginTeacher = function () {
        return this.loginTeacher;
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
    MyEventWatchTowerService.prototype.getIsEventPackReady = function () {
        return this.isEventPackReady;
    };
    MyEventWatchTowerService.prototype.getCheckerMap = function () {
        return this.checkerMap;
    };
    MyEventWatchTowerService.prototype.getConstMap = function () {
        return this.constMap;
    };
    MyEventWatchTowerService.prototype.getMyConst = function () {
        return this.myConst;
    };
    MyEventWatchTowerService.prototype.getDirtyWordList = function () {
        return this.dirtyWordList;
    };
    MyEventWatchTowerService.prototype.getApiKey = function () {
        return this.apiKey;
    };
    MyEventWatchTowerService.prototype.getMyEventService = function () {
        return this.myEventService;
    };
    MyEventWatchTowerService.prototype.getMyCheckerService = function () {
        return this.myCheckerService;
    };
    // EVENT SECTION
    MyEventWatchTowerService.prototype.getEventOnReady = function (eventKey, component) {
        if (null == this.myEventService) {
            return null;
        }
        if (null == this.myCheckerService) {
            return null;
        }
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("m-e-w / getEventOnReady / 시작");
        var myEventOnReady = this.myEventService.getMyEvent(
        // public eventName:string
        this.myEventService.ON_READY, 
        // public key:string
        eventKey, 
        // public value:string
        "", 
        // public metaObj:any
        component, 
        // public myChecker:MyChecker
        this.myCheckerService.getFreePassChecker());
        if (isDebug)
            console.log("m-e-w / getEventOnReady / myEventOnReady : ", myEventOnReady);
        return myEventOnReady;
    };
    MyEventWatchTowerService.prototype.getEventOnRemove = function (eventKey, value, myChecker) {
        if (null == this.myEventService) {
            return null;
        }
        if (null == this.myCheckerService) {
            return null;
        }
        if (null == myChecker) {
            return null;
        }
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("my-event-watchtower / getEventOnChange / 시작");
        var myEventOnChange = this.myEventService.getMyEvent(
        // public eventName:string
        this.myEventService.ON_REMOVE_ROW, 
        // public key:string
        eventKey, 
        // public value:string
        value, 
        // public metaObj:any
        null, 
        // public myChecker:MyChecker
        myChecker);
        return myEventOnChange;
    };
    MyEventWatchTowerService.prototype.getEventOnChange = function (eventKey, value, myChecker) {
        if (null == this.myEventService) {
            return null;
        }
        if (null == this.myCheckerService) {
            return null;
        }
        if (null == myChecker) {
            return null;
        }
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("my-event-watchtower / getEventOnChange / 시작");
        var myEventOnChange = this.myEventService.getMyEvent(
        // public eventName:string
        this.myEventService.ON_READY, 
        // public key:string
        eventKey, 
        // public value:string
        value, 
        // public metaObj:any
        null, 
        // public myChecker:MyChecker
        myChecker);
        return myEventOnChange;
    };
    MyEventWatchTowerService.prototype.getEventWithMeta = function (eventName, eventKey, value, myChecker, meta) {
        if (null == this.myEventService) {
            return null;
        }
        if (null == this.myCheckerService) {
            return null;
        }
        if (null == myChecker) {
            return null;
        }
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("my-event-watchtower / getEventWithMeta / 시작");
        var myEvent = this.myEventService.getMyEvent(
        // public eventName:string
        eventName, 
        // public key:string
        eventKey, 
        // public value:string
        value, 
        // public metaObj:any
        meta, 
        // public myChecker:MyChecker
        myChecker);
        return myEvent;
    };
    MyEventWatchTowerService.prototype.getEventOnChangeMeta = function (eventKey, value, myChecker, meta) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("my-event-watchtower / getEventOnChangeMeta / 시작");
        return this.getEventWithMeta(
        // eventName:string, 
        this.myEventService.ON_CHANGE, 
        // eventKey:string, 
        eventKey, 
        // value:string, 
        value, 
        // myChecker:MyChecker, 
        myChecker, 
        // meta:any
        meta);
    };
    MyEventWatchTowerService.prototype.getEventOnAddCommentMeta = function (eventKey, value, myChecker, meta) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("my-event-watchtower / getEventOnAddCommentMeta / 시작");
        return this.getEventWithMeta(
        // eventName:string, 
        this.myEventService.ON_ADD_COMMENT, 
        // eventKey:string, 
        eventKey, 
        // value:string, 
        value, 
        // myChecker:MyChecker, 
        myChecker, 
        // meta:any
        meta);
    };
    MyEventWatchTowerService.prototype.getEventOnAddCommentReplyMeta = function (eventKey, value, myChecker, meta) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("my-event-watchtower / getEventOnAddCommentReplyMeta / 시작");
        return this.getEventWithMeta(
        // eventName:string, 
        this.myEventService.ON_ADD_COMMENT_REPLY, 
        // eventKey:string, 
        eventKey, 
        // value:string, 
        value, 
        // myChecker:MyChecker, 
        myChecker, 
        // meta:any
        meta);
    };
    MyEventWatchTowerService.prototype.getEventOnLoginRequired = function (eventKey) {
        if (null == this.myEventService) {
            return null;
        }
        if (null == this.myCheckerService) {
            return null;
        }
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("m-e-w / getEventOnLoginRequired / 시작");
        var myEventOnReady = this.myEventService.getMyEvent(
        // public eventName:string
        this.myEventService.ON_LOGIN_REQUIRED, 
        // public key:string
        eventKey, 
        // public value:string
        "", 
        // public metaObj:any
        null, 
        // public myChecker:MyChecker
        this.myCheckerService.getFreePassChecker());
        if (isDebug)
            console.log("m-e-w / getEventOnLoginRequired / myEventOnReady : ", myEventOnReady);
        return myEventOnReady;
    };
    MyEventWatchTowerService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], MyEventWatchTowerService);
    return MyEventWatchTowerService;
}());
exports.MyEventWatchTowerService = MyEventWatchTowerService;
//# sourceMappingURL=my-event-watchtower.service.js.map