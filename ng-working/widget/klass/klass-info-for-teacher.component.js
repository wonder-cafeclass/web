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
var my_event_watchtower_service_1 = require('../../util/service/my-event-watchtower.service');
var my_array_1 = require('../../util/helper/my-array');
var klass_1 = require('../../widget/klass/model/klass');
var KlassInfoForTeacherComponent = (function () {
    function KlassInfoForTeacherComponent(watchTower, router) {
        this.watchTower = watchTower;
        this.router = router;
        // @ Common Props
        this.emitter = new core_1.EventEmitter();
        this.isLast = false;
        this.isShowAttendance = false;
        this.attendancePercentage = "";
        // 날짜별로 유저 출석 테이블을 구성.
        this.atTable = [];
        // Do something...
        this.myArray = new my_array_1.HelperMyArray();
    } // end constructor
    KlassInfoForTeacherComponent.prototype.isDebug = function () {
        return this.watchTower.isDebug();
    }; // end method
    KlassInfoForTeacherComponent.prototype.ngOnInit = function () {
        if (this.isDebug())
            console.log("klass-info-for-teacher / ngOnInit / init");
        this.asyncViewPack();
    };
    KlassInfoForTeacherComponent.prototype.asyncViewPack = function () {
        var _this = this;
        if (this.isDebug())
            console.log("klass-info-for-teacher / asyncViewPack / 시작");
        // 이미 View 기본정보가 들어왔다면 바로 가져온다. 
        if (this.watchTower.getIsViewPackReady()) {
            if (this.isDebug())
                console.log("klass-info-for-teacher / asyncViewPack / isViewPackReady : ", true);
            this.init();
        } // end if
        // View에 필요한 기본 정보가 비동기로 들어올 경우, 처리.
        this.watchTower.isViewPackReady$.subscribe(function (isViewPackReady) {
            if (_this.isDebug())
                console.log("klass-info-for-teacher / asyncViewPack / subscribe / isViewPackReady : ", isViewPackReady);
            _this.init();
        }); // end subscribe
    };
    KlassInfoForTeacherComponent.prototype.init = function () {
        if (this.isDebug())
            console.log("klass-info-for-teacher / init / 시작");
        // 출석률을 업데이트합니다.
        this.updateAttendancePercentage();
        // 부모 객체에게 준비되었다는 이벤트를 보냅니다.
        this.emitEventOnReady();
    }; // end method
    KlassInfoForTeacherComponent.prototype.emitEventOnReady = function () {
        if (this.isDebug())
            console.log("klass-info-for-teacher / emitEventOnReady / 시작");
        var myEvent = this.watchTower.getEventOnReady(
        // eventKey:string, 
        this.eventKey, 
        // component
        this);
        this.emitter.emit(myEvent);
        if (this.isDebug())
            console.log("klass-info-for-teacher / emitEventOnReady / Done!");
    };
    // @ Desc : 현재 클래스 상태를 우리말로 표시합니다.
    KlassInfoForTeacherComponent.prototype.getKlassStatusDesc = function (klass) {
        if (this.isDebug())
            console.log("klass-info-for-teacher / getKlassStatusDesc / 시작");
        if (null == klass) {
            if (this.isDebug())
                console.log("klass-info-for-teacher / getKlassStatusDesc / 중단 / null == klass");
            return;
        }
        var klassStatusKor = this.watchTower
            .getMyConst()
            .getValue(
        // srcKey:string, 
        "class_status_list", 
        // srcValue:string, 
        klass.status, 
        // targetKey:string
        "class_status_kor_list");
        return klassStatusKor;
    };
    KlassInfoForTeacherComponent.prototype.onClickKlass = function (event, klass) {
        if (this.isDebug())
            console.log("klass-info-for-teacher / onClickKlass / 시작");
        event.preventDefault();
        event.stopPropagation();
        // 부모 객체로 클래스를 선택한 것을 전달. 해당 수업 상세 페이지로 이동!
        if (null == klass) {
            if (this.isDebug())
                console.log("klass-info-for-teacher / onClickKlass / 중단 / null == klass");
            return;
        } // end if
        this.emitOnClickMeta("" + klass.id, klass);
    }; // end method
    KlassInfoForTeacherComponent.prototype.emitOnClickMeta = function (value, meta) {
        var myEvent = this.watchTower.getEventOnClickMetaFreePass(
        // eventKey:string, 
        this.eventKey, 
        // value:string, 
        value, 
        // meta:any
        meta);
        this.emitter.emit(myEvent);
    }; // end method
    KlassInfoForTeacherComponent.prototype.emitOnChangeMeta = function (value, meta) {
        var myEvent = this.watchTower.getEventOnChangeMeta(
        // eventKey:string, 
        this.eventKey, 
        // value:string, 
        value, 
        // myChecker:MyChecker,
        this.watchTower.getMyCheckerService().getFreePassChecker(), 
        // meta:any
        meta);
        this.emitter.emit(myEvent);
    }; // end method
    KlassInfoForTeacherComponent.prototype.isValidAttendance = function () {
        if (this.isDebug())
            console.log("klass-info-for-teacher / isValidAttendance / 시작");
        if (null == this.klass) {
            return false;
        }
        if (this.myArray.isNotOK(this.klass.klass_attendance_table)) {
            return false;
        }
        return true;
    };
    KlassInfoForTeacherComponent.prototype.onClickAttendance = function (event) {
        if (this.isDebug())
            console.log("klass-info-for-teacher / onClickAttendance / 시작");
        event.preventDefault();
        event.stopPropagation();
        if (null == this.klass) {
            if (this.isDebug())
                console.log("klass-info-for-teacher / onClickAttendance / 중단 / null == this.klass");
            return;
        }
        else if (this.myArray.isNotOK(this.klass.klass_attendance_table)) {
            if (this.isDebug())
                console.log("klass-info-for-teacher / onClickAttendance / 중단 / this.klass.klass_attendance_table is not valid!");
            return;
        }
        this.isShowAttendance = !this.isShowAttendance;
    }; // end method
    KlassInfoForTeacherComponent.prototype.updateAttendancePercentage = function () {
        if (this.isDebug())
            console.log("klass-info-for-teacher / updateAttendancePercentage / 시작");
        this.attendancePercentage = this.klass.getAttendancePercentage();
    }; // end if
    KlassInfoForTeacherComponent.prototype.onCheck = function (event, value, radioBtnPresence, radioBtnAbsence, ka) {
        if (this.isDebug())
            console.log("klass-info-for-teacher / onCheck / 시작");
        if (this.isDebug())
            console.log("klass-info-for-teacher / onCheck / event : ", event);
        if (this.isDebug())
            console.log("klass-info-for-teacher / onCheck / value : ", value);
        if (this.isDebug())
            console.log("klass-info-for-teacher / onCheck / radioBtnPresence : ", radioBtnPresence);
        if (this.isDebug())
            console.log("klass-info-for-teacher / onCheck / radioBtnAbsence : ", radioBtnAbsence);
        if (this.isDebug())
            console.log("klass-info-for-teacher / onCheck / ka : ", ka);
        if (null == ka) {
            if (this.isDebug())
                console.log("klass-info-for-teacher / onCheck / 중단 / null == ka");
            return;
        } // end if
        if (ka.hasNotStarted()) {
            if (this.isDebug())
                console.log("klass-info-for-teacher / onCheck / 중단 / ka.hasNotStarted()");
            // 시작되지 않은 수업의 출결 상태를 변경하는 것은 불가능합니다.
            // 출석, 결석을 모두 선택하지 않은 상태로 되돌립니다.
            radioBtnPresence.checked = false;
            radioBtnAbsence.checked = false;
            return;
        } // end if
        // 가지고 있는 출석 데이터 업데이트
        ka.updateStatus(value);
        // 화면에 표시된 출석률 업데이트
        this.updateAttendancePercentage();
        // 출석/결석 변경에 문제가 없습니다.
        // 부모 객체에게 출석 데이터 업데이트 전달
        this.emitOnChangeMeta("", ka);
    };
    KlassInfoForTeacherComponent.prototype.onClickTeacher = function (event) {
        if (this.isDebug())
            console.log("klass-info-for-teacher / onClickTeacher / 시작");
        event.preventDefault();
        event.stopPropagation();
    }; // end method
    KlassInfoForTeacherComponent.prototype.onClickStatus = function (event) {
        if (this.isDebug())
            console.log("klass-info-for-teacher / onClickStatus / 시작");
        event.preventDefault();
        event.stopPropagation();
    }; // end method
    KlassInfoForTeacherComponent.prototype.onClickReview = function (event) {
        if (this.isDebug())
            console.log("klass-info-for-teacher / onClickReview / 시작");
        event.preventDefault();
        event.stopPropagation();
        var newKlassId = this.klass.id;
        this.router.navigate([("/class-center/" + newKlassId), { moveto: 'review' }]);
    };
    KlassInfoForTeacherComponent.prototype.onClickQuestion = function (event) {
        if (this.isDebug())
            console.log("klass-info-for-teacher / onClickQuestion / 시작");
        event.preventDefault();
        event.stopPropagation();
        var newKlassId = this.klass.id;
        this.router.navigate([("/class-center/" + newKlassId), { moveto: 'question' }]);
    };
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], KlassInfoForTeacherComponent.prototype, "emitter", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], KlassInfoForTeacherComponent.prototype, "eventKey", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', klass_1.Klass)
    ], KlassInfoForTeacherComponent.prototype, "klass", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], KlassInfoForTeacherComponent.prototype, "isLast", void 0);
    KlassInfoForTeacherComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'klass-info-for-teacher',
            templateUrl: 'klass-info-for-teacher.component.html',
            styleUrls: ['klass-info-for-teacher.component.css']
        }), 
        __metadata('design:paramtypes', [my_event_watchtower_service_1.MyEventWatchTowerService, router_1.Router])
    ], KlassInfoForTeacherComponent);
    return KlassInfoForTeacherComponent;
}());
exports.KlassInfoForTeacherComponent = KlassInfoForTeacherComponent; // end class
//# sourceMappingURL=klass-info-for-teacher.component.js.map