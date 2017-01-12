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
var router_1 = require('@angular/router');
var my_event_watchtower_service_1 = require('../../../util/service/my-event-watchtower.service');
var user_service_1 = require('../../../users/service/user.service');
var MyInfoDashboardComponent = (function () {
    function MyInfoDashboardComponent(userService, watchTower, router) {
        this.userService = userService;
        this.watchTower = watchTower;
        this.router = router;
        this.eventKey = "";
        this.emitter = new core_1.EventEmitter();
        this.userService.setWatchTower(watchTower);
    }
    MyInfoDashboardComponent.prototype.isDebug = function () {
        return this.watchTower.isDebug();
    };
    MyInfoDashboardComponent.prototype.ngAfterViewInit = function () {
        // 자식 뷰가 모두 완료된 이후에 초기화를 진행.
        if (this.isDebug())
            console.log("my-info-dashboard / ngAfterViewInit");
        this.asyncViewPack();
    };
    MyInfoDashboardComponent.prototype.asyncViewPack = function () {
        var _this = this;
        if (this.isDebug())
            console.log("my-info-dashboard / asyncViewPack / 시작");
        // 이미 View 기본정보가 들어왔다면 바로 가져온다. 
        if (this.watchTower.getIsViewPackReady()) {
            if (this.isDebug())
                console.log("my-info-dashboard / asyncViewPack / isViewPackReady : ", true);
            this.init();
        } // end if
        // View에 필요한 기본 정보가 비동기로 들어올 경우, 처리.
        this.watchTower.isViewPackReady$.subscribe(function (isViewPackReady) {
            if (_this.isDebug())
                console.log("my-info-dashboard / asyncViewPack / subscribe / isViewPackReady : ", isViewPackReady);
            _this.init();
        }); // end subscribe
    };
    MyInfoDashboardComponent.prototype.init = function () {
        if (this.isDebug())
            console.log("my-info-dashboard / init / 시작");
        // 로그인한 유저 정보를 가져옵니다.
        this.setLoginUser();
        // 페이지 진입을 기록으로 남깁니다.
        this.logActionPage();
        // 컴포넌트가 준비된 것을 부모 객체에게 전달합니다.
        this.emitEventOnReady();
        // 해당 유저에게 필요한 정보를 DB로 부터 가져옵니다.
        this.fetchUserInfoDashboard();
    };
    MyInfoDashboardComponent.prototype.setLoginUser = function () {
        if (this.isDebug())
            console.log("my-info-dashboard / setLoginUser / 시작");
        // 로그인 데이터를 가져옵니다.
        this.loginUser = this.watchTower.getLoginUser();
        if (null == this.loginUser) {
            // 로그인 데이터를 가져오지 못한다면, 로그인 페이지로 이동합니다.
            this.router.navigate(['/login']);
        } // end if
    };
    MyInfoDashboardComponent.prototype.getLoginUserId = function () {
        var loginUser = this.watchTower.getLoginUser();
        if (null == loginUser) {
            return -1;
        }
        return loginUser.id;
    };
    MyInfoDashboardComponent.prototype.logActionPage = function () {
        if (this.isDebug())
            console.log("my-info-dashboard / logActionPage / 시작");
        this.watchTower.logPageEnter(
        // pageType:string
        this.watchTower.getMyLoggerService().pageTypeMyInfoDashBoard);
    }; // end method  
    MyInfoDashboardComponent.prototype.emitEventOnReady = function () {
        if (this.isDebug())
            console.log("my-info-dashboard / emitEventOnReady / 시작");
        var myEvent = this.watchTower.getEventOnReady(
        // eventKey:string, 
        this.eventKey, 
        // component
        this);
        this.emitter.emit(myEvent);
    };
    MyInfoDashboardComponent.prototype.fetchUserInfoDashboard = function () {
        var _this = this;
        if (this.isDebug())
            console.log("my-info-dashboard / fetchUserInfoDashboard / 시작");
        // 1. 수강중인 클래스 정보 가져오기 (최대 5개 노출)
        this.userService.fetchKlassNStudentList(
        // apiKey:string,
        this.watchTower.getApiKey(), 
        // pageNum:number,
        1, 
        // pageSize:number,
        5, 
        // userId:number
        this.getLoginUserId()).then(function (myResponse) {
            // 로그 등록 결과를 확인해볼 수 있습니다.
            if (_this.isDebug())
                console.log("my-info-dashboard / fetchUserInfoDashboard / myResponse : ", myResponse);
            if (myResponse.isSuccess()) {
            }
            else if (myResponse.isFailed()) {
                if (_this.isDebug())
                    console.log("my-info-dashboard / fetchUserInfoDashboard / 수강 학생 정보 등록에 실패했습니다.");
                _this.watchTower.logAPIError("fetchKlassNStudentList has been failed!");
                if (null != myResponse.error) {
                    _this.watchTower.announceErrorMsgArr([myResponse.error]);
                } // end if
            } // end if
        }); // end service
        // 2. 관심 강의 리스트 가져오기(나중에...)
    };
    MyInfoDashboardComponent.prototype.onChangedFromChild = function (myEvent) {
        if (this.isDebug())
            console.log("my-info-dashboard / onChangedFromChild / init");
        if (this.isDebug())
            console.log("my-info-dashboard / onChangedFromChild / myEvent : ", myEvent);
        if (this.isDebug())
            console.log("my-info-dashboard / onChangedFromChild / myEvent.key : ", myEvent.key);
        if (this.isDebug())
            console.log("my-info-dashboard / onChangedFromChild / myEvent.value : ", myEvent.value);
        if (myEvent.isNotValid()) {
            if (this.isDebug())
                console.log("my-info-dashboard / onChangedFromChild / ON_CHANGE_NOT_VALID / 중단 / myEvent.isNotValid()");
            // 에러 로그 등록
            this.watchTower.logErrorBadValue("my-info-dashboard / onChangedFromChild / myEvent.isNotValid()");
            return;
        } // end if
        if (this.watchTower.isNotOK(myEvent)) {
            if (this.isDebug())
                console.log("my-info-dashboard / onChangedFromChild / 중단 / 값이 유효하지 않습니다.");
            // 에러 로그 등록
            this.watchTower.logErrorBadValue("my-info-dashboard / onChangedFromChild / this.watchTower.isNotOK(myEvent)");
            return;
        } // end if
        if (myEvent.hasEventName(this.watchTower.getMyEventService().ON_READY)) {
        }
        else if (myEvent.hasEventName(this.watchTower.getMyEventService().ON_CHANGE)) {
        } // end if
    }; // end method
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], MyInfoDashboardComponent.prototype, "eventKey", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], MyInfoDashboardComponent.prototype, "emitter", void 0);
    MyInfoDashboardComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'my-info-dashboard',
            templateUrl: 'my-info-dashboard.component.html',
            styleUrls: ['my-info-dashboard.component.css']
        }), 
        __metadata('design:paramtypes', [user_service_1.UserService, my_event_watchtower_service_1.MyEventWatchTowerService, router_1.Router])
    ], MyInfoDashboardComponent);
    return MyInfoDashboardComponent;
}());
exports.MyInfoDashboardComponent = MyInfoDashboardComponent;
//# sourceMappingURL=my-info-dashboard.component.js.map