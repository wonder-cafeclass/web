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
var my_event_service_1 = require('../../util/service/my-event.service');
var my_checker_service_1 = require('../../util/service/my-checker.service');
var my_logger_service_1 = require('../../util/service/my-logger.service');
var klass_color_service_1 = require('../../klass/service/klass-color.service');
var klass_radiobtn_service_1 = require('../../klass/service/klass-radiobtn.service');
var my_event_watchtower_service_1 = require('../../util/service/my-event-watchtower.service');
var TeacherMyNavListComponent = (function () {
    function TeacherMyNavListComponent(klassColorService, myEventService, myLoggerService, radiobtnService, watchTower, myCheckerService) {
        this.klassColorService = klassColorService;
        this.myEventService = myEventService;
        this.myLoggerService = myLoggerService;
        this.radiobtnService = radiobtnService;
        this.watchTower = watchTower;
        this.myCheckerService = myCheckerService;
        this.showMyInfo = false;
        this.showMyHistory = false;
        this.showMyPayment = false;
        this.showMyFavorite = false;
        this.emitter = new core_1.EventEmitter();
        this.isAdmin = false;
    }
    TeacherMyNavListComponent.prototype.isDebug = function () {
        return this.watchTower.isDebug();
    };
    TeacherMyNavListComponent.prototype.ngAfterViewInit = function () {
        // 자식 뷰가 모두 완료된 이후에 초기화를 진행.
        if (this.isDebug())
            console.log("teacher-my-nav-list / ngAfterViewInit");
        this.asyncViewPack();
    };
    TeacherMyNavListComponent.prototype.asyncViewPack = function () {
        var _this = this;
        if (this.isDebug())
            console.log("teacher-my-nav-list / asyncViewPack / 시작");
        // 이미 View 기본정보가 들어왔다면 바로 가져온다. 
        if (this.watchTower.getIsViewPackReady()) {
            if (this.isDebug())
                console.log("teacher-my-nav-list / asyncViewPack / isViewPackReady : ", true);
            this.init();
        } // end if
        // View에 필요한 기본 정보가 비동기로 들어올 경우, 처리.
        this.watchTower.isViewPackReady$.subscribe(function (isViewPackReady) {
            if (_this.isDebug())
                console.log("teacher-my-nav-list / asyncViewPack / subscribe / isViewPackReady : ", isViewPackReady);
            _this.init();
        }); // end subscribe
    };
    TeacherMyNavListComponent.prototype.setViewPack = function () {
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
    TeacherMyNavListComponent.prototype.init = function () {
        // 뷰에 필요한 공통 정보를 설정합니다.
        this.setViewPack();
        if (this.isDebug())
            console.log("teacher-my-nav-list / init");
        // COLOR
        this.colorWhite = this.klassColorService.white;
        this.colorOrange = this.klassColorService.orange;
        this.colorGray = this.klassColorService.gray;
        if (this.isDebug())
            console.log("teacher-my-nav-list / init / this.colorWhite : ", this.colorWhite);
        if (this.isDebug())
            console.log("teacher-my-nav-list / init / this.colorOrange : ", this.colorOrange);
        if (this.isDebug())
            console.log("teacher-my-nav-list / init / this.colorGray : ", this.colorGray);
        this.navTabsOptions =
            this.radiobtnService.getNavTabsTeacherMyInfo(
            // user:User
            null, 
            // keyFocus:string
            null);
        this.showMyInfo = true;
        if (this.isDebug())
            console.log("teacher-my-nav-list / this.navTabsOptions : ", this.navTabsOptions);
    };
    TeacherMyNavListComponent.prototype.onChangedFromChild = function (myEvent, myinfo, myhistory, mypayment, myfavorite) {
        if (this.isDebug())
            console.log("teacher-my-nav-list / onChangedFromChild / init");
        if (this.isDebug())
            console.log("teacher-my-nav-list / onChangedFromChild / myEvent : ", myEvent);
        if (this.isDebug())
            console.log("teacher-my-nav-list / onChangedFromChild / myEvent.key : ", myEvent.key);
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
    ], TeacherMyNavListComponent.prototype, "emitter", void 0);
    TeacherMyNavListComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'teacher-my-nav-list',
            templateUrl: 'teacher-my-nav-list.component.html',
            styleUrls: ['teacher-my-nav-list.component.css']
        }), 
        __metadata('design:paramtypes', [klass_color_service_1.KlassColorService, my_event_service_1.MyEventService, my_logger_service_1.MyLoggerService, klass_radiobtn_service_1.KlassRadioBtnService, my_event_watchtower_service_1.MyEventWatchTowerService, my_checker_service_1.MyCheckerService])
    ], TeacherMyNavListComponent);
    return TeacherMyNavListComponent;
}());
exports.TeacherMyNavListComponent = TeacherMyNavListComponent;
//# sourceMappingURL=teacher-my-nav-list.component.js.map