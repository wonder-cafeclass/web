"use strict";
var my_is_1 = require('../../util/helper/my-is');
var KlassStudent = (function () {
    function KlassStudent() {
        this.id = -1;
        this.klass_id = -1;
        this.user_id = -1;
        this.status = "";
        this.date_created = "";
        this.date_updated = "";
        this.myIs = new my_is_1.HelperMyIs();
    }
    KlassStudent.prototype.isSame = function (target) {
        return this.myIs.isSame(this, target);
    };
    KlassStudent.prototype.isSharing = function (key, target) {
        return this.myIs.isSharing(key, this, target);
    };
    KlassStudent.prototype.setJSON = function (json) {
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
        return klassStudent;
    }; // end method
    KlassStudent.prototype._setJSON = function (json) {
        return this.myIs.copyFromJSON(
        // target:any,
        this, 
        // json
        json);
    }; // end method	
    return KlassStudent;
}());
exports.KlassStudent = KlassStudent;
//# sourceMappingURL=klass-student.js.map