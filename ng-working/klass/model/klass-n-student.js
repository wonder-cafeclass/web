"use strict";
var my_is_1 = require('../../util/helper/my-is');
var my_time_1 = require('../../util/helper/my-time');
var my_array_1 = require('../../util/helper/my-array');
var teacher_1 = require('../../teachers/model/teacher');
var user_1 = require('../../users/model/user');
var klass_1 = require('./klass');
var klass_attendance_1 = require('./klass-attendance');
var KlassNStudent = (function () {
    function KlassNStudent() {
        this.id = -1;
        this.klass_id = -1;
        this.teacher_id = -1;
        this.user_id = -1;
        this.status = "";
        this.date_created = "";
        this.date_updated = "";
        this.attendance_list = [];
        // 출,결석 횟수
        this.attendance_total_cnt = -1;
        this.attendance_ready_cnt = -1;
        this.attendance_presence_cnt = -1;
        this.attendance_absence_cnt = -1;
        this.review_cnt = -1;
        this.question_cnt = -1;
        // 결재 횟수
        this.payment_import_cnt = -1;
        this.receipt_url = "";
        this.myIs = new my_is_1.HelperMyIs();
        this.myTime = new my_time_1.HelperMyTime();
        this.myArray = new my_array_1.HelperMyArray();
    }
    KlassNStudent.prototype.isSame = function (target) {
        return this.myIs.isSame(this, target);
    };
    KlassNStudent.prototype.isSharing = function (key, target) {
        return this.myIs.isSharing(key, this, target);
    };
    KlassNStudent.prototype.isEnableCancle = function () {
        // 취소 관련 정책 확인 필요.
        // http://cafeclass.kr/%EC%95%BD%EA%B4%80-%EB%B0%8F-%EC%A0%95%EC%B1%85/%EA%B0%95%EC%9D%98-%EC%B0%B8%EA%B0%80%EC%9E%90-%EC%95%BD%EA%B4%80/
        // 강의 개시 1일전 통보 취소는?
        // 2. 강의 개시 당일 통보시 : 강의 참가비의 10% 배상        
        // 강의 시작 며칠전인지 확인 필요.
        var headYYYYMMDD_HHMMSS = this.klass.date_begin + " " + this.klass.time_begin + ":00";
        var diffDays = this.myTime.getDiffDaysYYYYMMDD_HHMMSS(
        // headYYYYMMDD_HHMMSS:string
        headYYYYMMDD_HHMMSS, 
        // tailYYYYMMDD_HHMMSS:string
        this.myTime.getNow_YYYY_MM_DD_HH_MM_SS());
        if (2 <= diffDays) {
            // 1. 강의 개시 시점으로부터 2일 이전 통보 시 : 손해배상 없음
            return true;
        } // end if
        return false;
    };
    // @ Desc : '완료된 수업 수 / 전체 수업 수'
    KlassNStudent.prototype.getProgress = function () {
        if (!(0 < this.attendance_total_cnt)) {
            return "";
        }
        if (!(-1 < this.attendance_ready_cnt)) {
            return "";
        }
        if (!(-1 < this.attendance_presence_cnt)) {
            return "";
        }
        if (!(-1 < this.attendance_absence_cnt)) {
            return "";
        }
        var totalCnt = this.attendance_total_cnt;
        var doneCnt = totalCnt - this.attendance_ready_cnt;
        return doneCnt + "/" + totalCnt;
    };
    KlassNStudent.prototype.isFinished = function () {
        if (!(0 < this.attendance_total_cnt)) {
            return false;
        }
        if (!(-1 < this.attendance_ready_cnt)) {
            return false;
        }
        if (!(-1 < this.attendance_presence_cnt)) {
            return false;
        }
        if (!(-1 < this.attendance_absence_cnt)) {
            return false;
        }
        var totalCnt = this.attendance_total_cnt;
        var doneCnt = totalCnt - this.attendance_ready_cnt;
        return (totalCnt === doneCnt) ? true : false;
    };
    // @ Desc : 자료실 자료가 있는지 여부.
    KlassNStudent.prototype.hasSupplement = function () {
        return false;
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
        if (klassStudent.myArray.isOK(json.attendance_list)) {
            var kaList = [];
            for (var i = 0; i < json.attendance_list.length; ++i) {
                var json_attendance = json.attendance_list[i];
                var ka = new klass_attendance_1.KlassAttendance().setJSON(json_attendance);
                kaList.push(ka);
            } // end for
            klassStudent.attendance_list = kaList;
        } // end if
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