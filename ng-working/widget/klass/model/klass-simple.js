"use strict";
var my_is_1 = require('../../../util/helper/my-is');
// @ Desc : 홈 리스트에서 노출할 최소한의 정보만 가져오는 클래스
var KlassSimple = (function () {
    function KlassSimple() {
        this.id = -1;
        this.teacher_id = -1;
        this.teacher_thumbnail = "";
        this.title = "";
        this.desc = "";
        this.type = "";
        this.date_begin = "";
        this.time_begin = "";
        this.time_begin_img_url = "";
        this.time_duration_minutes = -1;
        this.time_end = "";
        this.level = "";
        this.level_eng = "";
        this.level_kor = "";
        this.level_img_url = "";
        this.week = -1;
        this.days = "";
        this.days_list = [];
        this.days_img_url = "";
        this.days_img_url_list = [];
        this.days_a_week_img_url = "";
        this.days_eng = "";
        this.days_kor = "";
        this.subway_line = "";
        this.subway_station = "";
        this.subway_station_img = "";
        this.price = -1;
        this.price_with_format = "";
        // 수업 참여 학생수
        this.student_cnt = -1;
        this.status = "";
        this.class_poster_url = "";
        this.class_poster_url_loadable = "";
        this.delimiter = "|||";
        this.myIs = null;
        this.myIs = new my_is_1.HelperMyIs();
    }
    // @ Desc : 수업없음 클래스인지 여부.
    KlassSimple.prototype.isNoClassBtn = function () {
        return (-1 === this.id) ? true : false;
    };
    KlassSimple.prototype.isNotNoClassBtn = function () {
        return !this.isNoClassBtn();
    };
    // @ Desc : 새로운 클래스를 만드는 버튼 역할의 수업인지 여부.
    KlassSimple.prototype.isNewClassBtn = function () {
        return (-100 === this.id) ? true : false;
    };
    KlassSimple.prototype.isNotNewClassBtn = function () {
        return !this.isNewClassBtn();
    };
    KlassSimple.prototype.setJSON = function (json) {
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("klass / setJSON / init");
        if (isDebug)
            console.log("klass / setJSON / json : ", json);
        var klass = this._setJSON(json);
        // teacher
        if (null != json.teacher) {
            klass.teacher_id = parseInt(json.teacher.id);
            klass.teacher_thumbnail = json.teacher.thumbnail;
        }
        // days_img_url_list
        if (null != klass.days_img_url && "" != klass.days_img_url) {
            klass.days_img_url_list = klass.days_img_url.split("|||");
        }
        else {
            klass.days_img_url_list = [];
        }
        if (isDebug)
            console.log("klass / setJSON / klass : ", klass);
        return klass;
    }; // end method
    KlassSimple.prototype._setJSON = function (json) {
        return this.myIs.copyFromJSON(
        // target:any,
        this, 
        // json
        json);
    }; // end method
    return KlassSimple;
}());
exports.KlassSimple = KlassSimple;
//# sourceMappingURL=klass-simple.js.map