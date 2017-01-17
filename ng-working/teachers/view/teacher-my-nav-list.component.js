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
var teacher_info_dashboard_component_1 = require('./teacher-my-nav-list/teacher-info-dashboard.component');
var teacher_info_klass_component_1 = require('./teacher-my-nav-list/teacher-info-klass.component');
var TeacherMyNavListComponent = (function () {
    function TeacherMyNavListComponent(klassColorService, myEventService, myLoggerService, radiobtnService, watchTower, myCheckerService) {
        this.klassColorService = klassColorService;
        this.myEventService = myEventService;
        this.myLoggerService = myLoggerService;
        this.radiobtnService = radiobtnService;
        this.watchTower = watchTower;
        this.myCheckerService = myCheckerService;
        this.showDashboard = false;
        this.showMyInfo = false;
        this.showMyKlass = false;
        this.showMyIncome = false;
        this.showMyFeedback = false;
        this.emitter = new core_1.EventEmitter();
        this.isAdmin = false;
        this.radiobtnService.setWatchTower(this.watchTower);
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
            null, this.watchTower.getMyEventService().KEY_TEACHER_MY_INFO_DASHBOARD);
        // 대시보드 노출이 기본값
        this.showDashboard = true;
        if (this.isDebug())
            console.log("teacher-my-nav-list / this.navTabsOptions : ", this.navTabsOptions);
    };
    TeacherMyNavListComponent.prototype.resetNavFlag = function () {
        this.showDashboard = false;
        this.showMyInfo = false;
        this.showMyKlass = false;
        this.showMyIncome = false;
        this.showMyFeedback = false;
    };
    TeacherMyNavListComponent.prototype.onChangedFromChild = function (myEvent) {
        if (this.isDebug())
            console.log("teacher-my-nav-list / onChangedFromChild / init");
        if (this.isDebug())
            console.log("teacher-my-nav-list / onChangedFromChild / myEvent : ", myEvent);
        if (this.isDebug())
            console.log("teacher-my-nav-list / onChangedFromChild / myEvent.key : ", myEvent.key);
        if (this.isDebug())
            console.log("teacher-my-nav-list / onChangedFromChild / 시작");
        if (this.isDebug())
            console.log("teacher-my-nav-list / onChangedFromChild / myEvent : ", myEvent);
        var isOK = this.myCheckerService.isOK(myEvent.myChecker, myEvent.value);
        if (!isOK) {
            if (this.isDebug())
                console.log("teacher-my-nav-list / onChangedFromChild / 중단 / 값이 유효하지 않습니다.");
            var lastHistory = this.myCheckerService.getLastHistory();
            if (this.isDebug())
                console.log("teacher-my-nav-list / onChangedFromChild / lastHistory : ", lastHistory);
            return;
        } // end if
        if (myEvent.hasEventName(this.myEventService.ON_READY)) {
            if (myEvent.hasKey(this.myEventService.KEY_TEACHER_MY_INFO_DASHBOARD)) {
                if (null != myEvent.metaObj) {
                    this.dashboardComponent = myEvent.metaObj;
                } // end if
            }
            else if (myEvent.hasKey(this.myEventService.KEY_TEACHER_MY_INFO)) {
                if (null != myEvent.metaObj) {
                    this.teacherInfoComponent = myEvent.metaObj;
                } // end if
            }
            else if (myEvent.hasKey(this.myEventService.KEY_TEACHER_MY_KLASS)) {
                if (null != myEvent.metaObj) {
                    this.klassComponent = myEvent.metaObj;
                } // end if        
            }
            else if (myEvent.hasKey(this.myEventService.KEY_TEACHER_MY_INCOME)) {
                if (null != myEvent.metaObj) {
                    this.incomeComponent = myEvent.metaObj;
                } // end if
            }
            else if (myEvent.hasKey(this.myEventService.KEY_TEACHER_MY_FEEDBACK)) {
                if (null != myEvent.metaObj) {
                    this.feedbackComponent = myEvent.metaObj;
                } // end if
            } // end if
        }
        else if (myEvent.hasEventName(this.myEventService.ON_CHANGE)) {
            if (myEvent.hasKey(this.myEventService.KEY_TEACHER_MY_INFO_DASHBOARD)) {
                if (myEvent.metaObj instanceof teacher_info_dashboard_component_1.TeacherInfoDashboardComponent) {
                    // 다른 컴포넌트의 수업 리스트를 업데이트해줍니다.
                    if (null != this.klassComponent) {
                        this.klassComponent.reload();
                    }
                }
                else {
                    this.resetNavFlag();
                    this.showDashboard = true;
                } // end if
            }
            else if (myEvent.hasKey(this.myEventService.KEY_TEACHER_MY_INFO)) {
                this.resetNavFlag();
                this.showMyInfo = true;
            }
            else if (myEvent.hasKey(this.myEventService.KEY_TEACHER_MY_KLASS)) {
                if (myEvent.metaObj instanceof teacher_info_klass_component_1.TeacherInfoKlassComponent) {
                    // 다른 컴포넌트의 수업 리스트를 업데이트해줍니다.
                    if (null != this.dashboardComponent) {
                        this.dashboardComponent.reload();
                    }
                }
                else {
                    this.resetNavFlag();
                    this.showMyKlass = true;
                } // end if
            }
            else if (myEvent.hasKey(this.myEventService.KEY_TEACHER_MY_INCOME)) {
                this.resetNavFlag();
                this.showMyIncome = true;
            }
            else if (myEvent.hasKey(this.myEventService.KEY_TEACHER_MY_FEEDBACK)) {
                this.resetNavFlag();
                this.showMyFeedback = true;
            } // end if
        } // end if  
    }; // end method
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
exports.TeacherMyNavListComponent = TeacherMyNavListComponent; // end class
//# sourceMappingURL=teacher-my-nav-list.component.js.map