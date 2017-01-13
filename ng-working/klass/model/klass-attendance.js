"use strict";
var my_is_1 = require('../../util/helper/my-is');
var KlassAttendance = (function () {
    function KlassAttendance() {
        this.id = -1;
        this.klass_id = -1;
        this.user_id = -1;
        this.status = "";
        this.date_attend = "";
        this.date_created = "";
        this.date_updated = "";
        this.myIs = new my_is_1.HelperMyIs();
    }
    KlassAttendance.prototype.isNotReady = function () {
        return !this.isReady();
    };
    KlassAttendance.prototype.isReady = function () {
        return ("R" === this.status) ? true : false;
    };
    KlassAttendance.prototype.isSame = function (target) {
        return this.myIs.isSame(this, target);
    };
    KlassAttendance.prototype.isSharing = function (key, target) {
        return this.myIs.isSharing(key, this, target);
    };
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