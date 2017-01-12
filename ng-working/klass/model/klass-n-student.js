"use strict";
var my_is_1 = require('../../util/helper/my-is');
var teacher_1 = require('../../teachers/model/teacher');
var user_1 = require('../../users/model/user');
var klass_1 = require('./klass');
var KlassNStudent = (function () {
    function KlassNStudent() {
        this.id = -1;
        this.klass_id = -1;
        this.user_id = -1;
        this.status = "";
        this.date_created = "";
        this.date_updated = "";
        this.myIs = new my_is_1.HelperMyIs();
    }
    KlassNStudent.prototype.isSame = function (target) {
        return this.myIs.isSame(this, target);
    };
    KlassNStudent.prototype.isSharing = function (key, target) {
        return this.myIs.isSharing(key, this, target);
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