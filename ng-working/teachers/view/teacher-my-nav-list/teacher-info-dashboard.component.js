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
var teacher_service_1 = require('../../../teachers/service/teacher.service');
var klass_1 = require('../../../klass/model/klass');
var klass_attendance_1 = require('../../../klass/model/klass-attendance');
var TeacherInfoDashboardComponent = (function () {
    function TeacherInfoDashboardComponent(teacherService, myEventService, watchTower, router) {
        this.teacherService = teacherService;
        this.myEventService = myEventService;
        this.watchTower = watchTower;
        this.router = router;
        this.eventKey = "";
        this.emitter = new core_1.EventEmitter();
        this.teacherService.setWatchTower(watchTower);
    }
    TeacherInfoDashboardComponent.prototype.isDebug = function () {
        return this.watchTower.isDebug();
    };
    TeacherInfoDashboardComponent.prototype.ngAfterViewInit = function () {
        // 자식 뷰가 모두 완료된 이후에 초기화를 진행.
        if (this.isDebug())
            console.log("teacher-info-dashboard / ngAfterViewInit");
        this.asyncViewPack();
    };
    TeacherInfoDashboardComponent.prototype.asyncViewPack = function () {
        var _this = this;
        if (this.isDebug())
            console.log("teacher-info-dashboard / asyncViewPack / 시작");
        // 이미 View 기본정보가 들어왔다면 바로 가져온다. 
        if (this.watchTower.getIsViewPackReady()) {
            if (this.isDebug())
                console.log("teacher-info-dashboard / asyncViewPack / isViewPackReady : ", true);
            this.init();
        } // end if
        // View에 필요한 기본 정보가 비동기로 들어올 경우, 처리.
        this.watchTower.isViewPackReady$.subscribe(function (isViewPackReady) {
            if (_this.isDebug())
                console.log("teacher-info-dashboard / asyncViewPack / subscribe / isViewPackReady : ", isViewPackReady);
            _this.init();
        }); // end subscribe
    };
    TeacherInfoDashboardComponent.prototype.init = function () {
        if (this.isDebug())
            console.log("teacher-info-dashboard / init / 시작");
        // 로그인한 유저 정보를 가져옵니다.
        this.setLoginUser();
        // 페이지 진입을 기록으로 남깁니다.
        this.logActionPage();
        // 컴포넌트가 준비된 것을 부모 객체에게 전달합니다.
        this.emitEventOnReady();
        // 해당 유저에게 필요한 정보를 DB로 부터 가져옵니다.
        this.fetchActiveKlassList();
    };
    TeacherInfoDashboardComponent.prototype.setLoginUser = function () {
        if (this.isDebug())
            console.log("teacher-info-dashboard / setLoginUser / 시작");
        // 로그인 데이터를 가져옵니다.
        this.loginUser = this.watchTower.getLoginUser();
        if (null == this.loginUser) {
            // 로그인 데이터를 가져오지 못한다면, 로그인 페이지로 이동합니다.
            this.router.navigate(['/login']);
        } // end if
    };
    TeacherInfoDashboardComponent.prototype.getLoginUserId = function () {
        var loginUser = this.watchTower.getLoginUser();
        if (null == loginUser) {
            return -1;
        }
        return loginUser.id;
    };
    TeacherInfoDashboardComponent.prototype.getLoginTeacherId = function () {
        this.watchTower.getLoginTeacher();
        var loginTeacher = this.watchTower.getLoginTeacher();
        if (null == loginTeacher) {
            return -1;
        }
        return loginTeacher.id;
    };
    TeacherInfoDashboardComponent.prototype.logActionPage = function () {
        if (this.isDebug())
            console.log("teacher-info-dashboard / logActionPage / 시작");
        this.watchTower.logPageEnter(
        // pageType:string
        this.watchTower.getMyLoggerService().pageTypeTeacherInfoDashBoard);
    }; // end method  
    TeacherInfoDashboardComponent.prototype.emitEventOnReady = function () {
        if (this.isDebug())
            console.log("teacher-info-dashboard / emitEventOnReady / 시작");
        var myEvent = this.watchTower.getEventOnReady(
        // eventKey:string, 
        this.eventKey, 
        // component
        this);
        this.emitter.emit(myEvent);
    };
    TeacherInfoDashboardComponent.prototype.fetchActiveKlassList = function () {
        var _this = this;
        if (this.isDebug())
            console.log("teacher-info-dashboard / fetchActiveKlassList / 시작");
        // 선생님 대시보드에 필요한 정보는?
        // 1. 수강중인 클래스 정보 가져오기
        this.teacherService.fetchActiveKlassList(
        // apiKey:string,
        this.watchTower.getApiKey(), 
        // pageNum:number,
        1, 
        // pageRowCnt:number,
        10, 
        // teacherId:number
        this.getLoginTeacherId()).then(function (myResponse) {
            // 로그 등록 결과를 확인해볼 수 있습니다.
            if (_this.isDebug())
                console.log("teacher-info-dashboard / fetchActiveKlassList / myResponse : ", myResponse);
            if (myResponse.isSuccess() && myResponse.hasDataProp("list")) {
                // Do something... 
                var klassList = [];
                var jsonList = myResponse.getDataProp("list");
                for (var i = 0; i < jsonList.length; ++i) {
                    var json = jsonList[i];
                    var klassNStudent = new klass_1.Klass().setJSON(json);
                    klassList.push(klassNStudent);
                } // end for
                _this.klassList = klassList;
                if (_this.isDebug())
                    console.log("teacher-info-dashboard / fetchActiveKlassList / klassList : ", _this.klassList);
            }
            else if (myResponse.isFailed()) {
                if (_this.isDebug())
                    console.log("teacher-info-dashboard / fetchActiveKlassList / 수강 학생 정보 등록에 실패했습니다.");
                _this.watchTower.logAPIError("fetchKlassNStudentList has been failed!");
                if (null != myResponse.error) {
                    _this.watchTower.announceErrorMsgArr([myResponse.error]);
                } // end if
            } // end if
        }); // end service
    };
    TeacherInfoDashboardComponent.prototype.updateKlassAttendance = function (klassAttendance) {
        var _this = this;
        if (this.isDebug())
            console.log("teacher-info-dashboard / updateKlassAttendance / 시작");
        if (null == klassAttendance) {
            if (this.isDebug())
                console.log("teacher-info-dashboard / updateKlassAttendance / 중단 / null == klassAttendance");
            return;
        }
        if (this.isDebug())
            console.log("teacher-info-dashboard / updateKlassAttendance / klassAttendance : ", klassAttendance);
        // updateAttendance
        this.teacherService.updateAttendance(
        // apiKey:string,
        this.watchTower.getApiKey(), 
        // loginUserId:number,
        this.getLoginUserId(), 
        // attedanceId:number,
        klassAttendance.id, 
        // klassId:number,
        klassAttendance.klass_id, 
        // userId:number,
        klassAttendance.user_id, 
        // klassAttendanceStatus:number
        klassAttendance.status).then(function (myResponse) {
            // 로그 등록 결과를 확인해볼 수 있습니다.
            if (_this.isDebug())
                console.log("teacher-info-dashboard / updateKlassAttendance / myResponse : ", myResponse);
            if (myResponse.isSuccess() && myResponse.hasDataProp("row")) {
            }
            else if (myResponse.isFailed()) {
                if (_this.isDebug())
                    console.log("teacher-info-dashboard / updateKlassAttendance / 수강 학생 정보 등록에 실패했습니다.");
                _this.watchTower.logAPIError("updateKlassAttendance has been failed!");
                if (null != myResponse.error) {
                    _this.watchTower.announceErrorMsgArr([myResponse.error]);
                } // end if
            } // end if
        }); // end service    
    }; // end method
    TeacherInfoDashboardComponent.prototype.onClickKlass = function (klass) {
        if (this.isDebug())
            console.log("teacher-info-dashboard / onClickKlass / 시작");
        if (null == klass) {
            if (this.isDebug())
                console.log("teacher-info-dashboard / onClickKlass / 중단 / null == klass");
            return;
        } // end if
        if (!(0 < klass.id)) {
            if (this.isDebug())
                console.log("teacher-info-dashboard / onClickKlass / 중단 / klass.id is not valid!");
            return;
        } // end if
        // 클래스 상세 페이지로 이동합니다.
        this.router.navigate([("/class-center/" + klass.id)]);
    };
    TeacherInfoDashboardComponent.prototype.onChangedFromChild = function (myEvent) {
        if (this.isDebug())
            console.log("teacher-info-dashboard / onChangedFromChild / init");
        if (this.isDebug())
            console.log("teacher-info-dashboard / onChangedFromChild / myEvent : ", myEvent);
        if (this.isDebug())
            console.log("teacher-info-dashboard / onChangedFromChild / myEvent.key : ", myEvent.key);
        if (this.isDebug())
            console.log("teacher-info-dashboard / onChangedFromChild / myEvent.value : ", myEvent.value);
        if (myEvent.isNotValid()) {
            if (this.isDebug())
                console.log("teacher-info-dashboard / onChangedFromChild / ON_CHANGE_NOT_VALID / 중단 / myEvent.isNotValid()");
            // 에러 로그 등록
            this.watchTower.logErrorBadValue("teacher-info-dashboard / onChangedFromChild / myEvent.isNotValid()");
            return;
        } // end if
        if (this.watchTower.isNotOK(myEvent)) {
            if (this.isDebug())
                console.log("teacher-info-dashboard / onChangedFromChild / 중단 / 값이 유효하지 않습니다.");
            // 에러 로그 등록
            this.watchTower.logErrorBadValue("teacher-info-dashboard / onChangedFromChild / this.watchTower.isNotOK(myEvent)");
            return;
        } // end if
        if (myEvent.hasEventName(this.watchTower.getMyEventService().ON_READY)) {
        }
        else if (myEvent.hasEventName(this.watchTower.getMyEventService().ON_CHANGE)) {
            if (myEvent.hasKey(this.myEventService.KEY_WIDGET_KLASS_TEACHER)) {
                if (myEvent.metaObj instanceof klass_attendance_1.KlassAttendance) {
                    this.updateKlassAttendance(myEvent.metaObj);
                } // end if
            } // end if
        }
        else if (myEvent.hasEventName(this.watchTower.getMyEventService().ON_CLICK)) {
            if (myEvent.hasKey(this.myEventService.KEY_WIDGET_KLASS_TEACHER)) {
                if (myEvent.metaObj instanceof klass_1.Klass) {
                    this.onClickKlass(myEvent.metaObj);
                } // end if
            } // end if
        } // end if
    }; // end method
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], TeacherInfoDashboardComponent.prototype, "eventKey", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], TeacherInfoDashboardComponent.prototype, "emitter", void 0);
    TeacherInfoDashboardComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'teacher-info-dashboard',
            templateUrl: 'teacher-info-dashboard.component.html',
            styleUrls: ['teacher-info-dashboard.component.css']
        }), 
        __metadata('design:paramtypes', [teacher_service_1.TeacherService, my_event_service_1.MyEventService, my_event_watchtower_service_1.MyEventWatchTowerService, router_1.Router])
    ], TeacherInfoDashboardComponent);
    return TeacherInfoDashboardComponent;
}());
exports.TeacherInfoDashboardComponent = TeacherInfoDashboardComponent;
//# sourceMappingURL=teacher-info-dashboard.component.js.map