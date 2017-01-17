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
var my_event_watchtower_service_1 = require('../../util/service/my-event-watchtower.service');
var my_array_1 = require('../../util/helper/my-array');
var klass_1 = require('../../klass/model/klass');
var KlassInfoForTeacherComponent = (function () {
    function KlassInfoForTeacherComponent(watchTower) {
        this.watchTower = watchTower;
        // @ Common Props
        this.emitter = new core_1.EventEmitter();
        this.isLast = false;
        this.isShowAttendance = false;
        this.attendancePercentage = "";
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
        if (this.myArray.isNotOK(this.klass.klass_n_student_list)) {
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
        else if (this.myArray.isNotOK(this.klass.klass_n_student_list)) {
            if (this.isDebug())
                console.log("klass-info-for-teacher / onClickAttendance / 중단 / this.klass.klass_n_student_list is not valid!");
            return;
        }
        this.isShowAttendance = !this.isShowAttendance;
    }; // end method
    KlassInfoForTeacherComponent.prototype.onClickAttendanceDate = function (event, attendance) {
        if (this.isDebug())
            console.log("klass-info-for-teacher / onClickAttendance / 시작");
        event.preventDefault();
        event.stopPropagation();
        if (null == attendance) {
            if (this.isDebug())
                console.log("klass-info-for-teacher / onClickAttendance / 중단 / null == attendance");
            return;
        }
        attendance.updateStatus();
        // 부모 객체에게 출석 데이터 업데이트 전달
        this.emitOnChangeMeta("", attendance);
        // 화면에 표시된 출석률 업데이트
        this.updateAttendancePercentage();
    }; // end method
    KlassInfoForTeacherComponent.prototype.updateAttendancePercentage = function () {
        if (this.isDebug())
            console.log("klass-info-for-teacher / updateAttendancePercentage / 시작");
        if (null == this.klass) {
            if (this.isDebug())
                console.log("klass-info-for-teacher / updateAttendancePercentage / 중단 / null == klass");
            return;
        } // end if
        if (this.myArray.isNotOK(this.klass.klass_n_student_list)) {
            if (this.isDebug())
                console.log("klass-info-for-teacher / updateAttendancePercentage / 중단 / klass_n_student_list is not valid!");
            return;
        }
        for (var i = 0; i < this.klass.klass_n_student_list.length; ++i) {
            var klassNStudent = this.klass.klass_n_student_list[i];
            if (this.myArray.isNotOK(klassNStudent.attendance_list)) {
                continue;
            }
            var attendance_list = klassNStudent.attendance_list;
            var attendance_total_cnt = 0;
            var attendance_ready_cnt = 0;
            var attendance_presence_cnt = 0;
            var attendance_absence_cnt = 0;
            for (var j = 0; j < attendance_list.length; ++j) {
                var attendance = attendance_list[j];
                attendance_total_cnt++;
                if (attendance.isReady()) {
                    attendance_ready_cnt++;
                }
                else if (attendance.isPresence()) {
                    attendance_presence_cnt++;
                }
                else if (attendance.isAbsence()) {
                    attendance_absence_cnt++;
                }
            } // end for
            klassNStudent.attendance_total_cnt = attendance_total_cnt;
            klassNStudent.attendance_ready_cnt = attendance_ready_cnt;
            klassNStudent.attendance_presence_cnt = attendance_presence_cnt;
            klassNStudent.attendance_absence_cnt = attendance_absence_cnt;
        } // end for
        this.attendancePercentage = this.klass.getAttendancePercentage();
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
    };
    KlassInfoForTeacherComponent.prototype.onClickPrintCertipicate = function (event) {
        if (this.isDebug())
            console.log("klass-info-for-teacher / onClickPrintCertipicate / 시작");
        event.preventDefault();
        event.stopPropagation();
    };
    KlassInfoForTeacherComponent.prototype.onClickSupplement = function (event) {
        if (this.isDebug())
            console.log("klass-info-for-teacher / onClickSupplement / 시작");
        event.preventDefault();
        event.stopPropagation();
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
        __metadata('design:paramtypes', [my_event_watchtower_service_1.MyEventWatchTowerService])
    ], KlassInfoForTeacherComponent);
    return KlassInfoForTeacherComponent;
}());
exports.KlassInfoForTeacherComponent = KlassInfoForTeacherComponent; // end class
//# sourceMappingURL=klass-info-for-teacher.component.js.map