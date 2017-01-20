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
var teacher_1 = require('../../teachers/model/teacher');
var my_const_1 = require('../../util/helper/my-const');
/*
*	@ Desc : 부모와 자식 객체 간의 - 모듈 단위로 부모, 자식 관계라도 상관없음. - 이벤트를 주고 받을수 있는 shared service 객체
*/
var MyEventWatchTowerService = (function () {
    function MyEventWatchTowerService() {
        // private isDebug:boolean = true;
        this._isDebug = false;
        // @ Required for view
        this.isAdminServer = false;
        this.apiKey = "";
        this.isViewPackReady = false;
        // @ Optional for view
        this.isDebugging = false;
        this.isLockedBottomFooterFlexible = false;
        this.isEventPackReady = false;
        // Observable sources
        // @ Required for view
        this.isAdminServerSource = new Subject_1.Subject();
        this.myCheckerServicePackReadySource = new Subject_1.Subject();
        this.isViewPackReadySource = new Subject_1.Subject();
        // @ Optional for view
        this.isDebuggingSource = new Subject_1.Subject();
        this.loginAnnouncedSource = new Subject_1.Subject();
        this.loginTeacherAnnouncedSource = new Subject_1.Subject();
        this.toggleTopMenuAnnouncedSource = new Subject_1.Subject();
        this.toggleFooterAnnouncedSource = new Subject_1.Subject();
        this.errorMsgArrSource = new Subject_1.Subject();
        this.contentHeightSource = new Subject_1.Subject();
        this.isLockedBottomFooterFlexibleSource = new Subject_1.Subject();
        this.myLoggerServiceSource = new Subject_1.Subject();
        this.myEventServiceSource = new Subject_1.Subject();
        this.myCheckerServiceSource = new Subject_1.Subject();
        this.isEventPackReadySource = new Subject_1.Subject();
        // Observable streams
        // @ Required for view
        this.isAdminServer$ = this.isAdminServerSource.asObservable();
        this.myCheckerServicePackReady$ = this.myCheckerServicePackReadySource.asObservable();
        this.isViewPackReady$ = this.isViewPackReadySource.asObservable();
        // @ Optional for view
        this.isDebugging$ = this.isDebuggingSource.asObservable();
        this.loginAnnounced$ = this.loginAnnouncedSource.asObservable();
        this.loginTeacherAnnounced$ = this.loginTeacherAnnouncedSource.asObservable();
        this.toggleTopMenuAnnounced$ = this.toggleTopMenuAnnouncedSource.asObservable();
        this.toggleFooterAnnounced$ = this.toggleFooterAnnouncedSource.asObservable();
        this.errorMsgArr$ = this.errorMsgArrSource.asObservable();
        this.contentHeight$ = this.contentHeightSource.asObservable();
        this.isLockedBottomFooterFlexible$ = this.isLockedBottomFooterFlexibleSource.asObservable();
        this.myLoggerService$ = this.myLoggerServiceSource.asObservable();
        this.myEventService$ = this.myEventServiceSource.asObservable();
        this.myCheckerService$ = this.myCheckerServiceSource.asObservable();
        this.isEventPackReady$ = this.isEventPackReadySource.asObservable();
        this.myConst = new my_const_1.HelperMyConst();
    }
    // Service message commands
    // @ Required for view
    MyEventWatchTowerService.prototype.announceIsAdminServer = function (isAdminServer) {
        this.isAdminServer = isAdminServer;
        this.isAdminServerSource.next(isAdminServer);
        this.announceIsViewPackReady();
    };
    MyEventWatchTowerService.prototype.announceMyCheckerServiceReady = function (checkerMap, constMap, dirtyWordList, apiKey) {
        if (this._isDebug)
            console.log("my-event-watchtower / announceMyCheckerServiceReady / \uC2DC\uC791");
        if (null == checkerMap) {
            if (this._isDebug)
                console.log("my-event-watchtower / announceMyCheckerServiceReady / checkerMap is not valid!");
            return;
        }
        if (null == constMap) {
            if (this._isDebug)
                console.log("my-event-watchtower / announceMyCheckerServiceReady / constMap is not valid!");
            return;
        }
        if (null == dirtyWordList) {
            if (this._isDebug)
                console.log("my-event-watchtower / announceMyCheckerServiceReady / dirtyWordList is not valid!");
            return;
        }
        if (null == apiKey || "" == apiKey) {
            if (this._isDebug)
                console.log("my-event-watchtower / announceMyCheckerServiceReady / apiKey is not valid!");
            return;
        }
        this.checkerMap = checkerMap;
        this.constMap = constMap;
        this.dirtyWordList = dirtyWordList;
        this.apiKey = apiKey;
        this.myConst.setConstJSON(this.constMap);
        this.myCheckerServicePackReadySource.next(true);
        if (this._isDebug)
            console.log("my-event-watchtower / announceMyCheckerServiceReady / done.");
        if (this._isDebug)
            console.log("my-event-watchtower / announceMyCheckerServiceReady / apiKey : " + apiKey);
        this.announceIsViewPackReady();
    };
    // @ Desc : 뷰에 필요한 정보들이 모두 도착했는지 검사해서 알려줍니다.
    MyEventWatchTowerService.prototype.announceIsViewPackReady = function () {
        if (this._isDebug)
            console.log("my-event-watchtower / announceIsViewPackReady / \uC2DC\uC791");
        if (null == this.isAdminServer || !this.getIsMyCheckerReady()) {
            return;
        }
        if (this._isDebug)
            console.log("my-event-watchtower / announceIsViewPackReady / \uC900\uBE44\uC644\uB8CC!");
        this.isViewPackReady = true;
        this.isViewPackReadySource.next(true);
    };
    // @ Optional for view
    MyEventWatchTowerService.prototype.announceIsDebugging = function (isDebugging) {
        this.isDebugging = isDebugging;
        this.isDebuggingSource.next(isDebugging);
    };
    MyEventWatchTowerService.prototype.announceLogin = function (loginUser) {
        if (this._isDebug)
            console.log("my-event-watchtower / announceLogin / \uC2DC\uC791");
        this.loginUser = loginUser;
        if (null != this.loginUser) {
            if (this._isDebug)
                console.log("my-event-watchtower / announceLogin / setTeacher");
            if (null != this.loginTeacher) {
                this.loginUser.setTeacher(this.loginTeacher);
            } // end if
        }
        this.loginAnnouncedSource.next(loginUser);
        if (this._isDebug)
            console.log("my-event-watchtower / announceLogin / \uB05D");
    };
    MyEventWatchTowerService.prototype.announceLoginTeacher = function (loginTeacher) {
        if (this._isDebug)
            console.log("my-event-watchtower / announceLoginTeacher / \uC2DC\uC791");
        if (null != loginTeacher) {
            this.loginTeacher = new teacher_1.Teacher().setJSON(loginTeacher);
        }
        else {
            this.loginTeacher = null;
        }
        if (null != this.loginUser && null != this.loginTeacher) {
            if (this._isDebug)
                console.log("my-event-watchtower / announceLoginTeacher / setTeacher");
            this.loginUser.setTeacher(this.loginTeacher);
        }
        this.loginTeacherAnnouncedSource.next(loginTeacher);
        if (this._isDebug)
            console.log("my-event-watchtower / announceLoginTeacher / \uB05D");
    };
    MyEventWatchTowerService.prototype.announceToggleTopMenu = function (toggleTopMenu) {
        this.toggleTopMenuAnnouncedSource.next(toggleTopMenu);
    };
    MyEventWatchTowerService.prototype.announceToggleFooter = function (toggleFooter) {
        this.toggleFooterAnnouncedSource.next(toggleFooter);
    };
    // @ Desc : 콘텐츠 추가 등으로 화면의 높이가 변경되었을 경우, 호출됩니다.
    MyEventWatchTowerService.prototype.announceContentHeight = function () {
        if (this._isDebug)
            console.log("my-event-watchtower / announceContentHeight / 시작");
        var body = document.body;
        var clientHeight = body.clientHeight;
        if (this.contentHeight === clientHeight) {
            if (this._isDebug)
                console.log("my-event-watchtower / announceContentHeight / 중단 / 같은 높이라면 업데이트하지 않습니다");
            return;
        }
        this.contentHeight = clientHeight;
        this.contentHeightSource.next(clientHeight);
    };
    // @ Desc : 강제로 푸터를 하단 고정 해제 합니다.
    MyEventWatchTowerService.prototype.announceFooterRelease = function () {
        if (this._isDebug)
            console.log("my-event-watchtower / announceFooterRelease / 시작");
        this.contentHeightSource.next(3000);
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
    MyEventWatchTowerService.prototype.announceMyLoggerService = function (myLoggerService) {
        if (this._isDebug)
            console.log("m-e-w / announceMyLoggerService / init");
        this.myLoggerService = myLoggerService;
        this.myLoggerServiceSource.next(myLoggerService);
        this.announceEventPackReady();
    };
    MyEventWatchTowerService.prototype.announceMyEventService = function (myEventService) {
        if (this._isDebug)
            console.log("m-e-w / announceMyEventService / init");
        this.myEventService = myEventService;
        this.myEventServiceSource.next(myEventService);
        this.announceEventPackReady();
    };
    MyEventWatchTowerService.prototype.announceMyCheckerService = function (myCheckerService) {
        if (this._isDebug)
            console.log("m-e-w / announceMyCheckerService / init");
        this.myCheckerService = myCheckerService;
        this.myCheckerServiceSource.next(myCheckerService);
        this.announceEventPackReady();
    };
    MyEventWatchTowerService.prototype.announceEventPackReady = function () {
        if (null != this.myEventService && null != this.myCheckerService && null != this.myLoggerService) {
            if (this._isDebug)
                console.log("m-e-w / announceEventPackReady / next");
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
    MyEventWatchTowerService.prototype.getIsAdminServer = function () {
        return this.isAdminServer;
    };
    MyEventWatchTowerService.prototype.getIsDebugging = function () {
        return this.isDebugging;
    };
    MyEventWatchTowerService.prototype.isDebug = function () {
        return this.isDebugging;
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
    MyEventWatchTowerService.prototype.getMyLoggerService = function () {
        return this.myLoggerService;
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
        if (this._isDebug)
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
        if (this._isDebug)
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
        if (this._isDebug)
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
        if (this._isDebug)
            console.log("my-event-watchtower / getEventOnChange / 시작");
        var myEventOnChange = this.myEventService.getMyEvent(
        // public eventName:string
        this.myEventService.ON_CHANGE, 
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
        if (this._isDebug)
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
        if (this._isDebug)
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
    MyEventWatchTowerService.prototype.getEventOnClickMeta = function (eventKey, value, myChecker, meta) {
        if (this._isDebug)
            console.log("my-event-watchtower / getEventOnChangeMeta / 시작");
        return this.getEventWithMeta(
        // eventName:string, 
        this.myEventService.ON_CLICK, 
        // eventKey:string, 
        eventKey, 
        // value:string, 
        value, 
        // myChecker:MyChecker, 
        myChecker, 
        // meta:any
        meta);
    };
    MyEventWatchTowerService.prototype.getEventOnClickMetaFreePass = function (eventKey, value, meta) {
        if (this._isDebug)
            console.log("my-event-watchtower / getEventOnChangeMeta / 시작");
        return this.getEventWithMeta(
        // eventName:string, 
        this.myEventService.ON_CLICK, 
        // eventKey:string, 
        eventKey, 
        // value:string, 
        value, 
        // myChecker:MyChecker, 
        this.myCheckerService.getFreePassChecker(), 
        // meta:any
        meta);
    };
    MyEventWatchTowerService.prototype.getEventOnAddCommentMeta = function (eventKey, value, myChecker, meta) {
        if (this._isDebug)
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
        if (this._isDebug)
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
        if (this._isDebug)
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
        if (this._isDebug)
            console.log("m-e-w / getEventOnLoginRequired / myEventOnReady : ", myEventOnReady);
        return myEventOnReady;
    };
    MyEventWatchTowerService.prototype.getDefaultOptionListByKeys = function (keyListName, valueListName, valueFocus) {
        if (null == this.getMyConst()) {
            return [];
        }
        if (null == keyListName || "" === keyListName) {
            return [];
        }
        if (this.getMyConst().hasNotList(keyListName)) {
            return [];
        }
        if (null == valueListName || "" === valueListName) {
            return [];
        }
        if (this.getMyConst().hasNotList(valueListName)) {
            return [];
        }
        var keyList = this.getMyConst().getList(keyListName);
        var valueList = this.getMyConst().getList(valueListName);
        return this.getDefaultOptionList(keyList, valueList, valueFocus);
    };
    MyEventWatchTowerService.prototype.getDefaultOptionList = function (keyList, valueList, valueFocus) {
        if (null == this.getMyConst()) {
            return [];
        }
        var defaultOptionList = this.getMyConst().getDefaultOptionList(
        // keyList:string[], 
        keyList, 
        // valueList:string[],
        valueList, 
        // valueFocus:string
        valueFocus);
        return defaultOptionList;
    }; // end method 
    MyEventWatchTowerService.prototype.getDefaultOptionListWithMetaByKeys = function (keyListName, valueListName, valueFocus, metaObj) {
        if (null == this.getMyConst()) {
            return [];
        }
        if (null == keyListName || "" === keyListName) {
            return [];
        }
        if (this.getMyConst().hasNotList(keyListName)) {
            return [];
        }
        if (null == valueListName || "" === valueListName) {
            return [];
        }
        if (this.getMyConst().hasNotList(valueListName)) {
            return [];
        }
        var keyList = this.getMyConst().getList(keyListName);
        var valueList = this.getMyConst().getList(valueListName);
        return this.getDefaultOptionListWithMeta(keyList, valueList, valueFocus, metaObj);
    }; // end method
    MyEventWatchTowerService.prototype.getDefaultOptionListWithMeta = function (keyList, valueList, valueFocus, metaObj) {
        if (null == this.getMyConst()) {
            return [];
        }
        var defaultOptionList = this.getDefaultOptionList(keyList, valueList, valueFocus);
        for (var i = 0; i < defaultOptionList.length; ++i) {
            var defaultOption = defaultOptionList[i];
            defaultOption.metaObj = metaObj;
        }
        return defaultOptionList;
    }; // end method 
    /*
    getDelimiter():string {
        return this.getSingleValue("delimiter");
    }
    private getSingleValue(key:string):string {

        if(null == this.getMyConst()) {
            return "";
        }

        return this.getMyConst().getSingleValue(key);
    }
    */
    MyEventWatchTowerService.prototype.logAPIError = function (msg) {
        if (this._isDebug)
            console.log("m-e-w / logAPIError / 시작");
        if (!this.getIsMyCheckerReady()) {
            if (this._isDebug)
                console.log("m-e-w / logAPIError / 중단 / !this.getIsMyCheckerReady()");
            return;
        } // end if
        if (!this.getIsEventPackReady()) {
            if (this._isDebug)
                console.log("m-e-w / logAPIError / 중단 / !this.getIsEventPackReady()");
            return;
        } // end if
        if (null == msg || "" === msg) {
            if (this._isDebug)
                console.log("m-e-w / logAPIError / 중단 / msg is not valid!");
            return;
        } // end if
        this.myLoggerService.logError(
        // apiKey:string
        this.getApiKey(), 
        // errorType:string
        this.myLoggerService.errorAPIFailed, 
        // errorMsg:string
        msg); // end logger
    };
    MyEventWatchTowerService.prototype.logErrorBadValue = function (msg) {
        if (this._isDebug)
            console.log("m-e-w / logAPIError / 시작");
        if (!this.getIsMyCheckerReady()) {
            if (this._isDebug)
                console.log("m-e-w / logAPIError / 중단 / !this.getIsMyCheckerReady()");
            return;
        } // end if
        if (!this.getIsEventPackReady()) {
            if (this._isDebug)
                console.log("m-e-w / logAPIError / 중단 / !this.getIsEventPackReady()");
            return;
        } // end if
        if (null == msg || "" === msg) {
            if (this._isDebug)
                console.log("m-e-w / logAPIError / 중단 / msg is not valid!");
            return;
        } // end if
        this.myLoggerService.logError(
        // apiKey:string
        this.getApiKey(), 
        // errorType:string
        this.myLoggerService.errorTypeNotValidValue, 
        // errorMsg:string
        msg); // end logger
    }; // end method
    MyEventWatchTowerService.prototype.logPageEnter = function (pageType) {
        var _this = this;
        if (this._isDebug)
            console.log("m-e-w / logPageEnter / 시작");
        if (!this.getIsMyCheckerReady()) {
            if (this._isDebug)
                console.log("m-e-w / logPageEnter / 중단 / !this.getIsMyCheckerReady()");
            return;
        } // end if
        if (!this.getIsEventPackReady()) {
            if (this._isDebug)
                console.log("m-e-w / logPageEnter / 중단 / !this.getIsEventPackReady()");
            return;
        } // end if
        if (null == pageType || "" === pageType) {
            if (this._isDebug)
                console.log("m-e-w / logPageEnter / 중단 / pageType is not valid!");
        } // end if
        // 페이지 진입을 기록으로 남깁니다.
        this.myLoggerService.logActionPage(
        // apiKey:string
        this.getApiKey(), 
        // pageType:string
        pageType).then(function (myResponse) {
            // 로그 등록 결과를 확인해볼 수 있습니다.
            if (_this._isDebug)
                console.log("m-e-w / logPageEnter / myResponse : ", myResponse);
        }); // end service
    };
    MyEventWatchTowerService.prototype.isNotOK = function (myEvent) {
        return !this.isOK(myEvent);
    };
    MyEventWatchTowerService.prototype.isOK = function (myEvent) {
        if (this._isDebug)
            console.log("m-e-w / isOK / 시작");
        if (!this.getIsMyCheckerReady()) {
            if (this._isDebug)
                console.log("m-e-w / isOK / 중단 / !this.getIsMyCheckerReady()");
            return false;
        } // end if
        if (!this.getIsEventPackReady()) {
            if (this._isDebug)
                console.log("m-e-w / isOK / 중단 / !this.getIsEventPackReady()");
            return false;
        } // end if
        if (null == myEvent) {
            if (this._isDebug)
                console.log("m-e-w / isOK / 중단 / myEvent is not valid!");
            return false;
        } // end if
        var isOK = this.myCheckerService.isOK(myEvent.myChecker, myEvent.value);
        return isOK;
    };
    MyEventWatchTowerService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], MyEventWatchTowerService);
    return MyEventWatchTowerService;
}());
exports.MyEventWatchTowerService = MyEventWatchTowerService;
//# sourceMappingURL=my-event-watchtower.service.js.map