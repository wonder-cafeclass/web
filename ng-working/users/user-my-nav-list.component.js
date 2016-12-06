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
var my_event_service_1 = require('../util/service/my-event.service');
var my_checker_service_1 = require('../util/service/my-checker.service');
var my_logger_service_1 = require('../util/service/my-logger.service');
var klass_color_service_1 = require('../klass/service/klass-color.service');
var klass_radiobtn_service_1 = require('../klass/service/klass-radiobtn.service');
var my_event_watchtower_service_1 = require('../util/service/my-event-watchtower.service');
var UserMyNavListComponent = (function () {
    function UserMyNavListComponent(klassColorService, myEventService, myLoggerService, radiobtnService, myEventWatchTowerService, myCheckerService) {
        this.klassColorService = klassColorService;
        this.myEventService = myEventService;
        this.myLoggerService = myLoggerService;
        this.radiobtnService = radiobtnService;
        this.myEventWatchTowerService = myEventWatchTowerService;
        this.myCheckerService = myCheckerService;
        this.showMyInfo = false;
        this.showMyHistory = false;
        this.showMyPayment = false;
        this.showMyFavorite = false;
        this.emitter = new core_1.EventEmitter();
        this.isAdmin = false;
    }
    UserMyNavListComponent.prototype.ngOnInit = function () {
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("user-my-nav-list / ngOnInit / init");
        // 운영 서버인지 서비스 서버인지 판단하는 플래그값 가져옴.
        this.setIsAdmin();
        // my-checker.service의 apikey 가져옴. 
        this.setMyCheckerServiceReady();
    };
    UserMyNavListComponent.prototype.setIsAdmin = function () {
        var _this = this;
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("user-my-nav-list / setIsAdmin / 시작");
        // 사전에 등록된 값을 가져옴. 페이지 이동시에는 직접 값을 가져와야 함.
        this.isAdmin = this.myEventWatchTowerService.getIsAdmin();
        if (isDebug)
            console.log("user-my-nav-list / setIsAdmin / 시작 / this.isAdmin : ", this.isAdmin);
        // 운영 서버인지 서비스 서버인지 판단하는 플래그값 가져옴.
        this.myEventWatchTowerService.isAdmin$.subscribe(function (isAdmin) {
            if (isDebug)
                console.log("user-my-nav-list / setIsAdmin / isAdmin : ", isAdmin);
            _this.isAdmin = isAdmin;
        });
    };
    UserMyNavListComponent.prototype.setMyCheckerServiceReady = function () {
        var _this = this;
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("user-my-nav-list / setMyCheckerServiceReady / 시작");
        // 페이지 이동으로 진입한 경우, watch tower에 저장된 변수 값을 가져온다.
        if (this.myEventWatchTowerService.getIsMyCheckerReady()) {
            this.setMyCheckerService();
            this.init();
        }
        this.myEventWatchTowerService.myCheckerServiceReady$.subscribe(function (isReady) {
            if (isDebug)
                console.log("user-my-nav-list / setMyCheckerServiceReady / isReady : ", isReady);
            if (!isReady) {
                // 에러 로그 등록
                _this.myLoggerService.logError(
                // apiKey:string
                _this.myEventWatchTowerService.getApiKey(), 
                // errorType:string
                _this.myLoggerService.errorTypeNotValidValue, 
                // errorMsg:string
                "user-my-nav-list / setMyCheckerServiceReady / Failed! / isReady : " + isReady);
                return;
            }
            _this.setMyCheckerService();
            _this.init();
        });
    };
    UserMyNavListComponent.prototype.setMyCheckerService = function () {
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("user-my-nav-list / setMyCheckerService / 시작");
        if (this.myEventWatchTowerService.getIsMyCheckerReady()) {
            this.myCheckerService.setReady(
            // checkerMap:any
            this.myEventWatchTowerService.getCheckerMap(), 
            // constMap:any
            this.myEventWatchTowerService.getConstMap(), 
            // dirtyWordList:any
            this.myEventWatchTowerService.getDirtyWordList(), 
            // apiKey:string
            this.myEventWatchTowerService.getApiKey()); // end setReady
            if (isDebug)
                console.log("user-my-nav-list / setMyCheckerService / done!");
        } // end if
    };
    UserMyNavListComponent.prototype.init = function () {
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("user-my-nav-list / init");
        // COLOR
        this.colorWhite = this.klassColorService.white;
        this.colorOrange = this.klassColorService.orange;
        this.colorGray = this.klassColorService.gray;
        if (isDebug)
            console.log("user-my-nav-list / init / this.colorWhite : ", this.colorWhite);
        if (isDebug)
            console.log("user-my-nav-list / init / this.colorOrange : ", this.colorOrange);
        if (isDebug)
            console.log("user-my-nav-list / init / this.colorGray : ", this.colorGray);
        this.navTabsOptions =
            this.radiobtnService.getNavTabsUserMyInfo(
            // user:User
            null, null);
        this.showMyInfo = true;
        if (isDebug)
            console.log("user-my-nav-list / this.navTabsOptions : ", this.navTabsOptions);
    };
    UserMyNavListComponent.prototype.onChangedFromChild = function (myEvent, myinfo, myhistory, mypayment, myfavorite) {
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("user-my-nav-list / onChangedFromChild / init");
        if (isDebug)
            console.log("user-my-nav-list / onChangedFromChild / myEvent : ", myEvent);
        if (isDebug)
            console.log("user-my-nav-list / onChangedFromChild / myEvent.key : ", myEvent.key);
        // 모든 플래그값을 초기화
        this.showMyInfo = false;
        this.showMyHistory = false;
        this.showMyPayment = false;
        this.showMyFavorite = false;
        if (this.myEventService.KEY_USER_MY_INFO === myEvent.key) {
            this.showMyInfo = true;
        }
        else if (this.myEventService.KEY_USER_MY_HISTORY === myEvent.key) {
            this.showMyHistory = true;
        }
        else if (this.myEventService.KEY_USER_MY_PAYMENT === myEvent.key) {
            this.showMyPayment = true;
        }
        else if (this.myEventService.KEY_USER_MY_FAVORITE === myEvent.key) {
            this.showMyFavorite = true;
        }
    };
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], UserMyNavListComponent.prototype, "emitter", void 0);
    UserMyNavListComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'user-my-nav-list',
            templateUrl: 'user-my-nav-list.component.html',
            styleUrls: ['user-my-nav-list.component.css']
        }), 
        __metadata('design:paramtypes', [klass_color_service_1.KlassColorService, my_event_service_1.MyEventService, my_logger_service_1.MyLoggerService, klass_radiobtn_service_1.KlassRadioBtnService, my_event_watchtower_service_1.MyEventWatchTowerService, my_checker_service_1.MyCheckerService])
    ], UserMyNavListComponent);
    return UserMyNavListComponent;
}());
exports.UserMyNavListComponent = UserMyNavListComponent;
//# sourceMappingURL=user-my-nav-list.component.js.map