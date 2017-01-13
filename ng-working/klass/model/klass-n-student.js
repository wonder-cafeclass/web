"use strict";
var my_is_1 = require('../../util/helper/my-is');
var teacher_1 = require('../../teachers/model/teacher');
var user_1 = require('../../users/model/user');
var klass_1 = require('./klass');
var KlassNStudent = (function () {
    // public attendanceList:KlassAttendance[]; // @ Deprecated - 횟수만 노출하는 것으로 변경.
    // public paymentIMPortList:PaymentImport[]; // @ Deprecated - 횟수만 노출하는 것으로 변경.
    function KlassNStudent() {
        this.id = -1;
        this.klass_id = -1;
        this.user_id = -1;
        this.status = "";
        this.date_created = "";
        this.date_updated = "";
        // 출,결석 횟수
        this.attendanceTotalCnt = -1;
        this.attendanceReadyCnt = -1;
        this.attendancePresenceCnt = -1;
        this.attendanceAbsenceCnt = -1;
        // 결재 횟수
        this.paymentTotalCnt = -1;
        this.myIs = new my_is_1.HelperMyIs();
    }
    KlassNStudent.prototype.isSame = function (target) {
        return this.myIs.isSame(this, target);
    };
    KlassNStudent.prototype.isSharing = function (key, target) {
        return this.myIs.isSharing(key, this, target);
    };
    // @ Desc : '완료된 수업 수 / 전체 수업 수'
    KlassNStudent.prototype.getProgress = function () {
        if (!(0 < this.attendanceTotalCnt)) {
            return "";
        }
        if (!(-1 < this.attendanceReadyCnt)) {
            return "";
        }
        if (!(-1 < this.attendancePresenceCnt)) {
            return "";
        }
        if (!(-1 < this.attendanceAbsenceCnt)) {
            return "";
        }
        var totalCnt = this.attendanceTotalCnt;
        var doneCnt = totalCnt - this.attendanceReadyCnt;
        return doneCnt + "/" + totalCnt;
    };
    KlassNStudent.prototype.isFinished = function () {
        if (!(0 < this.attendanceTotalCnt)) {
            return false;
        }
        if (!(-1 < this.attendanceReadyCnt)) {
            return false;
        }
        if (!(-1 < this.attendancePresenceCnt)) {
            return false;
        }
        if (!(-1 < this.attendanceAbsenceCnt)) {
            return false;
        }
        var totalCnt = this.attendanceTotalCnt;
        var doneCnt = totalCnt - this.attendanceReadyCnt;
        return (totalCnt === doneCnt) ? true : false;
    };
    KlassNStudent.prototype.setJSON = function (json) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("klassStudent / setJSON / init");
        if (isDebug)
            console.log("klassStudent / setJSON / json : ", json);
        var klassStudent = this._setJSON(json);
        if (isDebug)
            console.log("klassStudent / setJSON / klassStudent : ", klassStudent);
        // json 자동 설정 이후의 추가 작업을 여기서 합니다.
        if (null != json.klass) {
            klassStudent.klass = new klass_1.Klass().setJSON(json.klass);
        }
        if (null != json.teacher) {
            klassStudent.teacher = new teacher_1.Teacher().setJSON(json.teacher);
        }
        if (null != json.user) {
            klassStudent.user = new user_1.User().setJSON(json.user);
        }
        if (null != json.attendance_total_cnt && -1 < json.attendance_total_cnt) {
            klassStudent.attendanceTotalCnt = json.attendance_total_cnt;
        }
        if (null != json.attendance_ready_cnt && -1 < json.attendance_ready_cnt) {
            klassStudent.attendanceReadyCnt = json.attendance_ready_cnt;
        }
        if (null != json.attendance_presence_cnt && -1 < json.attendance_presence_cnt) {
            klassStudent.attendancePresenceCnt = json.attendance_presence_cnt;
        }
        if (null != json.attendance_absence_cnt && -1 < json.attendance_absence_cnt) {
            klassStudent.attendanceAbsenceCnt = json.attendance_absence_cnt;
        }
        if (null != json.payment_import_cnt && -1 < json.payment_import_cnt) {
            klassStudent.paymentTotalCnt = json.payment_import_cnt;
        }
        return klassStudent;
    }; // end method
    KlassNStudent.prototype._setJSON = function (json) {
        return this.myIs.copyFromJSON(
        // target:any,
        this, 
        // json
        json);
    }; // end method	
    return KlassNStudent;
}());
exports.KlassNStudent = KlassNStudent;
//# sourceMappingURL=klass-n-student.js.map