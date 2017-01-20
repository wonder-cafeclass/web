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
var pagination_1 = require('../../../widget/pagination/model/pagination');
var TeacherInfoReviewComponent = (function () {
    function TeacherInfoReviewComponent(teacherService, myEventService, watchTower, router) {
        this.teacherService = teacherService;
        this.myEventService = myEventService;
        this.watchTower = watchTower;
        this.router = router;
        this.eventKey = "";
        this.emitter = new core_1.EventEmitter();
        this.teacherService.setWatchTower(watchTower);
    }
    TeacherInfoReviewComponent.prototype.isDebug = function () {
        return this.watchTower.isDebug();
    };
    TeacherInfoReviewComponent.prototype.ngAfterViewInit = function () {
        // 자식 뷰가 모두 완료된 이후에 초기화를 진행.
        if (this.isDebug())
            console.log("teacher-info-review / ngAfterViewInit");
        this.asyncViewPack();
    };
    TeacherInfoReviewComponent.prototype.asyncViewPack = function () {
        var _this = this;
        if (this.isDebug())
            console.log("teacher-info-review / asyncViewPack / 시작");
        // 이미 View 기본정보가 들어왔다면 바로 가져온다. 
        if (this.watchTower.getIsViewPackReady()) {
            if (this.isDebug())
                console.log("teacher-info-review / asyncViewPack / isViewPackReady : ", true);
            this.init();
        } // end if
        // View에 필요한 기본 정보가 비동기로 들어올 경우, 처리.
        this.watchTower.isViewPackReady$.subscribe(function (isViewPackReady) {
            if (_this.isDebug())
                console.log("teacher-info-review / asyncViewPack / subscribe / isViewPackReady : ", isViewPackReady);
            _this.init();
        }); // end subscribe
    };
    TeacherInfoReviewComponent.prototype.init = function () {
        if (this.isDebug())
            console.log("teacher-info-review / init / 시작");
        // 로그인한 유저 정보를 가져옵니다.
        this.setLoginUser();
        // 페이지 진입을 기록으로 남깁니다.
        this.logActionPage();
        // 컴포넌트가 준비된 것을 부모 객체에게 전달합니다.
        this.emitEventOnReady();
        // 페이지네이션 초기화.
        this.updatePagination(null);
        // 해당 유저에게 필요한 정보를 DB로 부터 가져옵니다.
        this.fetchReviews(-1);
    };
    TeacherInfoReviewComponent.prototype.updatePagination = function (jsonPagination) {
        if (this.isDebug())
            console.log("teacher-info-klass / updatePagination / 시작");
        if (this.isDebug())
            console.log("teacher-info-klass / updatePagination / jsonPagination : ", jsonPagination);
        if (null == jsonPagination) {
            this.pagination = new pagination_1.Pagination();
        }
        else {
            this.pagination = new pagination_1.Pagination().setJSON(jsonPagination);
        }
    };
    TeacherInfoReviewComponent.prototype.setLoginUser = function () {
        if (this.isDebug())
            console.log("teacher-info-review / setLoginUser / 시작");
        // 로그인 데이터를 가져옵니다.
        this.loginUser = this.watchTower.getLoginUser();
        if (null == this.loginUser) {
            // 로그인 데이터를 가져오지 못한다면, 로그인 페이지로 이동합니다.
            this.router.navigate(['/login']);
        } // end if
    };
    TeacherInfoReviewComponent.prototype.getLoginUserId = function () {
        var loginUser = this.watchTower.getLoginUser();
        if (null == loginUser) {
            return -1;
        }
        return loginUser.id;
    };
    TeacherInfoReviewComponent.prototype.getLoginTeacherId = function () {
        this.watchTower.getLoginTeacher();
        var loginTeacher = this.watchTower.getLoginTeacher();
        if (null == loginTeacher) {
            return -1;
        }
        return loginTeacher.id;
    };
    TeacherInfoReviewComponent.prototype.logActionPage = function () {
        if (this.isDebug())
            console.log("teacher-info-review / logActionPage / 시작");
        this.watchTower.logPageEnter(
        // pageType:string
        this.watchTower.getMyLoggerService().pageTypeTeacherInfoReview);
    }; // end method  
    TeacherInfoReviewComponent.prototype.emitEventOnReady = function () {
        if (this.isDebug())
            console.log("teacher-info-review / emitEventOnReady / 시작");
        var myEvent = this.watchTower.getEventOnReady(
        // eventKey:string, 
        this.eventKey, 
        // component
        this);
        this.emitter.emit(myEvent);
    };
    TeacherInfoReviewComponent.prototype.fetchReviews = function (klassId) {
        var _this = this;
        if (this.isDebug())
            console.log("teacher-info-review / fetchReviews / 시작");
        // 수업별 리뷰를 가져옵니다.
        this.teacherService.fetchKlassReviewByTeacher(
        // apiKey:string,
        this.watchTower.getApiKey(), 
        // loginUserId:number,
        this.getLoginUserId(), 
        // teacherId:number,
        this.getLoginTeacherId(), 
        // klassId:number,
        klassId, 
        // pageNum:number,
        this.pagination.pageNum, 
        // pageRowCnt:number
        this.pagination.pageRowCnt).then(function (myResponse) {
            // 로그 등록 결과를 확인해볼 수 있습니다.
            if (_this.isDebug())
                console.log("teacher-info-review / fetchReviews / myResponse : ", myResponse);
            if (myResponse.isSuccess() && myResponse.hasDataProp("list")) {
            }
            else if (myResponse.isFailed()) {
                if (_this.isDebug())
                    console.log("teacher-info-review / fetchReviews / 수강 학생 정보 등록에 실패했습니다.");
                _this.watchTower.logAPIError("fetchKlassNStudentList has been failed!");
                if (null != myResponse.error) {
                    _this.watchTower.announceErrorMsgArr([myResponse.error]);
                } // end if
            } // end if
        }); // end service
    };
    TeacherInfoReviewComponent.prototype.onClickKlass = function (klass) {
        if (this.isDebug())
            console.log("teacher-info-review / onClickKlass / 시작");
        if (null == klass) {
            if (this.isDebug())
                console.log("teacher-info-review / onClickKlass / 중단 / null == klass");
            return;
        } // end if
        if (!(0 < klass.id)) {
            if (this.isDebug())
                console.log("teacher-info-review / onClickKlass / 중단 / klass.id is not valid!");
            return;
        } // end if
        // 클래스 상세 페이지로 이동합니다.
        this.router.navigate([("/class-center/" + klass.id)]);
    };
    TeacherInfoReviewComponent.prototype.onChangedFromChild = function (myEvent) {
        if (this.isDebug())
            console.log("teacher-info-review / onChangedFromChild / init");
        if (this.isDebug())
            console.log("teacher-info-review / onChangedFromChild / myEvent : ", myEvent);
        if (this.isDebug())
            console.log("teacher-info-review / onChangedFromChild / myEvent.key : ", myEvent.key);
        if (this.isDebug())
            console.log("teacher-info-review / onChangedFromChild / myEvent.value : ", myEvent.value);
        if (myEvent.isNotValid()) {
            if (this.isDebug())
                console.log("teacher-info-review / onChangedFromChild / ON_CHANGE_NOT_VALID / 중단 / myEvent.isNotValid()");
            // 에러 로그 등록
            this.watchTower.logErrorBadValue("teacher-info-review / onChangedFromChild / myEvent.isNotValid()");
            return;
        } // end if
        if (this.watchTower.isNotOK(myEvent)) {
            if (this.isDebug())
                console.log("teacher-info-review / onChangedFromChild / 중단 / 값이 유효하지 않습니다.");
            // 에러 로그 등록
            this.watchTower.logErrorBadValue("teacher-info-review / onChangedFromChild / this.watchTower.isNotOK(myEvent)");
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
    ], TeacherInfoReviewComponent.prototype, "eventKey", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], TeacherInfoReviewComponent.prototype, "emitter", void 0);
    TeacherInfoReviewComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'teacher-info-review',
            templateUrl: 'teacher-info-review.component.html',
            styleUrls: ['teacher-info-review.component.css']
        }), 
        __metadata('design:paramtypes', [teacher_service_1.TeacherService, my_event_service_1.MyEventService, my_event_watchtower_service_1.MyEventWatchTowerService, router_1.Router])
    ], TeacherInfoReviewComponent);
    return TeacherInfoReviewComponent;
}());
exports.TeacherInfoReviewComponent = TeacherInfoReviewComponent;
//# sourceMappingURL=teacher-info-review.component.js.map