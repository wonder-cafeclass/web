"use strict";
var my_is_1 = require('../../../util/helper/my-is');
var my_time_1 = require('../../../util/helper/my-time');
var KlassAttendance = (function () {
    function KlassAttendance() {
        this.id = -1;
        this.klass_id = -1;
        this.user_id = -1;
        this.status = "";
        this.date_attend = "";
        this.date_created = "";
        this.date_updated = "";
        this.status_ready = "R";
        this.status_presence = "P";
        this.status_absence = "A";
        this.status_ready_kor = "수업전";
        this.status_presence_kor = "출석";
        this.status_absence_kor = "결석";
        this.myIs = new my_is_1.HelperMyIs();
        this.myTime = new my_time_1.HelperMyTime();
    }
    KlassAttendance.prototype.isNotReady = function () {
        return !this.isReady();
    };
    KlassAttendance.prototype.isReady = function () {
        return (this.status_ready === this.status) ? true : false;
    };
    KlassAttendance.prototype.isPresence = function () {
        return (this.status_presence === this.status) ? true : false;
    };
    KlassAttendance.prototype.isAbsence = function () {
        return (this.status_absence === this.status) ? true : false;
    };
    KlassAttendance.prototype.isSame = function (target) {
        return this.myIs.isSame(this, target);
    };
    KlassAttendance.prototype.isSharing = function (key, target) {
        return this.myIs.isSharing(key, this, target);
    };
    KlassAttendance.prototype.getYYYYMMDDKor = function () {
        var yyyymmdd = this.myTime.convert(
        // date_str:string, 
        this.date_attend, 
        // input_date_format_type:number, 
        this.myTime.DATE_TYPE_YYYY_MM_DD_HH_MM_SS, 
        // output_date_format_type:number
        this.myTime.DATE_TYPE_H_YYYY_MM_DD);
        return yyyymmdd;
    };
    KlassAttendance.prototype.hasNotStarted = function () {
        return !this.hasStarted();
    };
    KlassAttendance.prototype.hasStarted = function () {
        return this.myTime.isBeforeTomorrow(this.date_attend);
        // TEST
        // return this.myTime.isBeforeTomorrow("2017-01-01 11:36:37");
    };
    KlassAttendance.prototype.getStatusKor = function () {
        if (this.status_ready === this.status) {
            return this.status_ready_kor;
        }
        else if (this.status_presence === this.status) {
            return this.status_presence_kor;
        }
        else if (this.status_absence === this.status) {
            return this.status_absence_kor;
        }
        return "";
    };
    // @ Desc : 출석 상태를 업데이트 합니다.
    KlassAttendance.prototype.updateStatus = function (status) {
        if (this.status_ready === status) {
            this.status = this.status_ready;
        }
        else if (this.status_presence === status) {
            this.status = this.status_presence;
        }
        else if (this.status_absence === status) {
            this.status = this.status_absence;
        } // end if
    }; // end method
    KlassAttendance.prototype.setJSON = function (json) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("kat / setJSON / init");
        if (isDebug)
            console.log("kat / setJSON / json : ", json);
        var kat = this._setJSON(json);
        if (isDebug)
            console.log("kat / setJSON / kat : ", kat);
        // json 자동 설정 이후의 추가 작업을 여기서 합니다.
        return kat;
    }; // end method
    KlassAttendance.prototype._setJSON = function (json) {
        return this.myIs.copyFromJSON(
        // target:any,
        this, 
        // json
        json);
    }; // end method	
    return KlassAttendance;
}());
exports.KlassAttendance = KlassAttendance;
//# sourceMappingURL=klass-attendance.js.map