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
var my_event_service_1 = require('../../../util/service/my-event.service');
var user_service_1 = require('../../../users/service/user.service');
var MyInfoKlassComponent = (function () {
    function MyInfoKlassComponent(userService, myEventService, watchTower, router) {
        this.userService = userService;
        this.myEventService = myEventService;
        this.watchTower = watchTower;
        this.router = router;
        this.eventKey = "";
        this.emitter = new core_1.EventEmitter();
        this.userService.setWatchTower(watchTower);
    }
    MyInfoKlassComponent.prototype.isDebug = function () {
        return this.watchTower.isDebug();
    };
    MyInfoKlassComponent.prototype.ngAfterViewInit = function () {
        // 자식 뷰가 모두 완료된 이후에 초기화를 진행.
        if (this.isDebug())
            console.log("my-info-klass / ngAfterViewInit");
        this.asyncViewPack();
    };
    MyInfoKlassComponent.prototype.asyncViewPack = function () {
        var _this = this;
        if (this.isDebug())
            console.log("my-info-klass / asyncViewPack / 시작");
        // 이미 View 기본정보가 들어왔다면 바로 가져온다. 
        if (this.watchTower.getIsViewPackReady()) {
            if (this.isDebug())
                console.log("my-info-klass / asyncViewPack / isViewPackReady : ", true);
            this.init();
        } // end if
        // View에 필요한 기본 정보가 비동기로 들어올 경우, 처리.
        this.watchTower.isViewPackReady$.subscribe(function (isViewPackReady) {
            if (_this.isDebug())
                console.log("my-info-klass / asyncViewPack / subscribe / isViewPackReady : ", isViewPackReady);
            _this.init();
        }); // end subscribe
    };
    MyInfoKlassComponent.prototype.init = function () {
        if (this.isDebug())
            console.log("my-info-klass / init / 시작");
        // 로그인한 유저 정보를 가져옵니다.
        this.setLoginUser();
        // 페이지 진입을 기록으로 남깁니다.
        this.logActionPage();
        // 컴포넌트가 준비된 것을 부모 객체에게 전달합니다.
        this.emitEventOnReady();
        // 해당 유저에게 필요한 정보를 DB로 부터 가져옵니다.
        this.fetchUserKlassList();
    };
    MyInfoKlassComponent.prototype.setLoginUser = function () {
        if (this.isDebug())
            console.log("my-info-klass / setLoginUser / 시작");
        // 로그인 데이터를 가져옵니다.
        this.loginUser = this.watchTower.getLoginUser();
        if (null == this.loginUser) {
            // 로그인 데이터를 가져오지 못한다면, 로그인 페이지로 이동합니다.
            this.router.navigate(['/login']);
        } // end if
    };
    MyInfoKlassComponent.prototype.getLoginUserId = function () {
        var loginUser = this.watchTower.getLoginUser();
        if (null == loginUser) {
            return -1;
        }
        return loginUser.id;
    };
    MyInfoKlassComponent.prototype.logActionPage = function () {
        if (this.isDebug())
            console.log("my-info-klass / logActionPage / 시작");
        this.watchTower.logPageEnter(
        // pageType:string
        this.watchTower.getMyLoggerService().pageTypeMyInfoDashBoard);
    }; // end method  
    MyInfoKlassComponent.prototype.emitEventOnReady = function () {
        if (this.isDebug())
            console.log("my-info-klass / emitEventOnReady / 시작");
        var myEvent = this.watchTower.getEventOnReady(
        // eventKey:string, 
        this.eventKey, 
        // component
        this);
        this.emitter.emit(myEvent);
    };
    MyInfoKlassComponent.prototype.fetchUserKlassList = function () {
        var _this = this;
        if (this.isDebug())
            console.log("my-info-klass / fetchUserKlassList / 시작");
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
                console.log("my-info-klass / fetchUserKlassList / myResponse : ", myResponse);
            if (myResponse.isSuccess() && myResponse.hasDataProp("list")) {
            }
            else if (myResponse.isFailed()) {
                if (_this.isDebug())
                    console.log("my-info-klass / fetchUserKlassList / 수강 학생 정보 등록에 실패했습니다.");
                _this.watchTower.logAPIError("fetchKlassNStudentList has been failed!");
                if (null != myResponse.error) {
                    _this.watchTower.announceErrorMsgArr([myResponse.error]);
                } // end if
            } // end if
        }); // end service
        // 2. 관심 강의 리스트 가져오기(나중에...)
    };
    MyInfoKlassComponent.prototype.onClickKlass = function (klass) {
        if (this.isDebug())
            console.log("my-info-klass / onClickKlass / 시작");
        if (null == klass) {
            if (this.isDebug())
                console.log("my-info-klass / onClickKlass / 중단 / null == klass");
            return;
        } // end if
        if (!(0 < klass.id)) {
            if (this.isDebug())
                console.log("my-info-klass / onClickKlass / 중단 / klass.id is not valid!");
            return;
        } // end if
        // 클래스 상세 페이지로 이동합니다.
        // this.router.navigate([`/class-center/${klass.id}`]);
    };
    MyInfoKlassComponent.prototype.onChangedFromChild = function (myEvent) {
        if (this.isDebug())
            console.log("my-info-klass / onChangedFromChild / init");
        if (this.isDebug())
            console.log("my-info-klass / onChangedFromChild / myEvent : ", myEvent);
        if (this.isDebug())
            console.log("my-info-klass / onChangedFromChild / myEvent.key : ", myEvent.key);
        if (this.isDebug())
            console.log("my-info-klass / onChangedFromChild / myEvent.value : ", myEvent.value);
        if (myEvent.isNotValid()) {
            if (this.isDebug())
                console.log("my-info-klass / onChangedFromChild / ON_CHANGE_NOT_VALID / 중단 / myEvent.isNotValid()");
            // 에러 로그 등록
            this.watchTower.logErrorBadValue("my-info-klass / onChangedFromChild / myEvent.isNotValid()");
            return;
        } // end if
        if (this.watchTower.isNotOK(myEvent)) {
            if (this.isDebug())
                console.log("my-info-klass / onChangedFromChild / 중단 / 값이 유효하지 않습니다.");
            // 에러 로그 등록
            this.watchTower.logErrorBadValue("my-info-klass / onChangedFromChild / this.watchTower.isNotOK(myEvent)");
            return;
        } // end if
        if (myEvent.hasEventName(this.watchTower.getMyEventService().ON_READY)) {
        }
        else if (myEvent.hasEventName(this.watchTower.getMyEventService().ON_CHANGE)) {
        }
        else if (myEvent.hasEventName(this.watchTower.getMyEventService().ON_CLICK)) {
            if (myEvent.hasKey(this.myEventService.KEY_WIDGET_KLASS_CARD)) {
                this.onClickKlass(myEvent.metaObj);
            } // end if
        } // end if
    }; // end method
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], MyInfoKlassComponent.prototype, "eventKey", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], MyInfoKlassComponent.prototype, "emitter", void 0);
    MyInfoKlassComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'my-info-klass',
            templateUrl: 'my-info-klass.component.html',
            styleUrls: ['my-info-klass.component.css']
        }), 
        __metadata('design:paramtypes', [user_service_1.UserService, my_event_service_1.MyEventService, my_event_watchtower_service_1.MyEventWatchTowerService, router_1.Router])
    ], MyInfoKlassComponent);
    return MyInfoKlassComponent;
}());
exports.MyInfoKlassComponent = MyInfoKlassComponent;
//# sourceMappingURL=my-info-klass.component.js.map