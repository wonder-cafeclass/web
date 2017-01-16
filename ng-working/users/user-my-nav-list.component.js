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
var my_event_watchtower_service_1 = require('../util/service/my-event-watchtower.service');
var klass_color_service_1 = require('../klass/service/klass-color.service');
var klass_radiobtn_service_1 = require('../klass/service/klass-radiobtn.service');
var my_info_component_1 = require('./view/user-my-nav-list/my-info.component');
var my_info_dashboard_component_1 = require('./view/user-my-nav-list/my-info-dashboard.component');
var UserMyNavListComponent = (function () {
    function UserMyNavListComponent(klassColorService, myEventService, myLoggerService, radiobtnService, watchTower, myCheckerService) {
        this.klassColorService = klassColorService;
        this.myEventService = myEventService;
        this.myLoggerService = myLoggerService;
        this.radiobtnService = radiobtnService;
        this.watchTower = watchTower;
        this.myCheckerService = myCheckerService;
        this.showHome = true;
        this.showMyInfo = false;
        this.showMyHistory = false;
        this.showMyPayment = false;
        this.showMyFavorite = false;
        this.emitter = new core_1.EventEmitter();
        this.isAdmin = false;
        this.radiobtnService.setWatchTower(this.watchTower);
        this.watchTower.announceIsLockedBottomFooterFlexible(false);
    }
    UserMyNavListComponent.prototype.isDebug = function () {
        return this.watchTower.isDebug();
    };
    UserMyNavListComponent.prototype.ngAfterViewInit = function () {
        // 자식 뷰가 모두 완료된 이후에 초기화를 진행.
        if (this.isDebug())
            console.log("user-my-nav-list / ngAfterViewInit");
        this.asyncViewPack();
    };
    UserMyNavListComponent.prototype.asyncViewPack = function () {
        var _this = this;
        if (this.isDebug())
            console.log("user-my-nav-list / asyncViewPack / 시작");
        // 이미 View 기본정보가 들어왔다면 바로 가져온다. 
        if (this.watchTower.getIsViewPackReady()) {
            if (this.isDebug())
                console.log("user-my-nav-list / asyncViewPack / isViewPackReady : ", true);
            this.init();
        } // end if
        // View에 필요한 기본 정보가 비동기로 들어올 경우, 처리.
        this.watchTower.isViewPackReady$.subscribe(function (isViewPackReady) {
            if (_this.isDebug())
                console.log("user-my-nav-list / asyncViewPack / subscribe / isViewPackReady : ", isViewPackReady);
            _this.init();
        }); // end subscribe
    };
    UserMyNavListComponent.prototype.setViewPack = function () {
        this.isAdmin = this.watchTower.getIsAdminServer();
        this.myCheckerService.setReady(
        // checkerMap:any
        this.watchTower.getCheckerMap(), 
        // constMap:any
        this.watchTower.getConstMap(), 
        // dirtyWordList:any
        this.watchTower.getDirtyWordList(), 
        // apiKey:string
        this.watchTower.getApiKey()); // end setReady
    };
    UserMyNavListComponent.prototype.init = function () {
        // 뷰에 필요한 공통 정보를 설정합니다.
        this.setViewPack();
        if (this.isDebug())
            console.log("user-my-nav-list / init");
        // COLOR
        this.colorWhite = this.klassColorService.white;
        this.colorOrange = this.klassColorService.orange;
        this.colorGray = this.klassColorService.gray;
        if (this.isDebug())
            console.log("user-my-nav-list / init / this.colorWhite : ", this.colorWhite);
        if (this.isDebug())
            console.log("user-my-nav-list / init / this.colorOrange : ", this.colorOrange);
        if (this.isDebug())
            console.log("user-my-nav-list / init / this.colorGray : ", this.colorGray);
        this.navTabsOptions =
            this.radiobtnService.getNavTabsUserMyInfo(
            // user:User
            this.watchTower.getLoginUser(), this.watchTower.getMyEventService().KEY_USER_MY_INFO_DASHBOARD);
        if (this.isDebug())
            console.log("user-my-nav-list / this.navTabsOptions : ", this.navTabsOptions);
    };
    UserMyNavListComponent.prototype.resetNavFlag = function () {
        // 모든 플래그값을 초기화
        this.showHome = false;
        this.showMyInfo = false;
        this.showMyHistory = false;
        this.showMyPayment = false;
        this.showMyFavorite = false;
    };
    UserMyNavListComponent.prototype.onChangedFromChild = function (myEvent) {
        if (this.isDebug())
            console.log("user-my-nav-list / onChangedFromChild / init");
        if (this.isDebug())
            console.log("user-my-nav-list / onChangedFromChild / myEvent : ", myEvent);
        if (this.isDebug())
            console.log("user-my-nav-list / onChangedFromChild / myEvent.key : ", myEvent.key);
        if (this.isDebug())
            console.log("user-my-nav-list / onChangedFromChild / 시작");
        if (this.isDebug())
            console.log("user-my-nav-list / onChangedFromChild / myEvent : ", myEvent);
        var isOK = this.myCheckerService.isOK(myEvent.myChecker, myEvent.value);
        if (!isOK) {
            if (this.isDebug())
                console.log("user-my-nav-list / onChangedFromChild / 중단 / 값이 유효하지 않습니다.");
            var lastHistory = this.myCheckerService.getLastHistory();
            if (this.isDebug())
                console.log("user-my-nav-list / onChangedFromChild / lastHistory : ", lastHistory);
            return;
        } // end if
        if (myEvent.hasEventName(this.myEventService.ON_READY)) {
            if (myEvent.hasKey(this.myEventService.KEY_USER_MY_INFO_DASHBOARD)) {
                if (null != myEvent.metaObj) {
                    this.myInfoDashboardComponent = myEvent.metaObj;
                } // end if
            }
            else if (myEvent.hasKey(this.myEventService.KEY_USER_MY_INFO)) {
                if (null != myEvent.metaObj) {
                    this.myInfoComponent = myEvent.metaObj;
                } // end if
            } // end if
        }
        else if (myEvent.hasEventName(this.myEventService.ON_CHANGE)) {
            if (myEvent.hasKey(this.myEventService.KEY_USER_MY_INFO_DASHBOARD)) {
                this.resetNavFlag();
                this.showHome = true;
            }
            else if (myEvent.hasKey(this.myEventService.KEY_USER_MY_INFO)) {
                this.resetNavFlag();
                this.showMyInfo = true;
            }
            else if (myEvent.hasKey(this.myEventService.KEY_USER_MY_KLASS)) {
                this.resetNavFlag();
                this.showMyHistory = true;
            }
            else if (myEvent.hasKey(this.myEventService.KEY_USER_MY_PAYMENT)) {
                this.resetNavFlag();
                this.showMyPayment = true;
            }
            else if (myEvent.hasKey(this.myEventService.KEY_USER_MY_FAVORITE)) {
                this.resetNavFlag();
                this.showMyFavorite = true;
            } // end if
        } // end if
    }; // end method
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], UserMyNavListComponent.prototype, "emitter", void 0);
    __decorate([
        core_1.ViewChild(my_info_component_1.MyInfoComponent), 
        __metadata('design:type', my_info_component_1.MyInfoComponent)
    ], UserMyNavListComponent.prototype, "myInfoComponent", void 0);
    __decorate([
        core_1.ViewChild(my_info_dashboard_component_1.MyInfoDashboardComponent), 
        __metadata('design:type', my_info_dashboard_component_1.MyInfoDashboardComponent)
    ], UserMyNavListComponent.prototype, "myInfoDashboardComponent", void 0);
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