"use strict";
var my_array_1 = require('../../util/helper/my-array');
var my_is_1 = require('../../util/helper/my-is');
var my_time_1 = require('../../util/helper/my-time');
var KlassReview = (function () {
    function KlassReview() {
        this.id = -1;
        this.klass_id = -1;
        this.user_id = -1;
        this.name = "";
        this.nickname = "";
        this.thumbnail = "";
        this.thumbnail_url = ""; // @ Deprecated
        this.parent_id = -1;
        this.comment = "";
        this.star = -1;
        this.date_created = "";
        this.date_updated = "";
        this.date_updated_human_readable = "";
        this.delimiter = "|||";
        this.myArray = new my_array_1.HelperMyArray();
        this.myIs = new my_is_1.HelperMyIs();
        this.myTime = new my_time_1.HelperMyTime();
    }
    KlassReview.prototype.copy = function () {
        return this.myIs.copy(
        // src:any
        this, 
        // copy:any
        new KlassReview());
    }; // end method
    KlassReview.prototype.setJSON = function (json) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("klass-review / setJSON / init");
        var klassReview = this._setJSON(json);
        if (isDebug)
            console.log("klass-review / setJSON / klassReview : ", klassReview);
        // 추가 작업이 필요한 데이터들을 여기서 다룹니다.
        if (null != json.child_review_list && 0 < json.child_review_list.length) {
            var child_review_list = [];
            for (var i = 0; i < json.child_review_list.length; ++i) {
                var child_review_json = json.child_review_list[i];
                var childKlassReview = new KlassReview().setJSON(child_review_json);
                child_review_list.push(childKlassReview);
            }
            klassReview.child_review_list = child_review_list;
        } // end if
        return klassReview;
    }; // end method
    KlassReview.prototype._setJSON = function (json) {
        return this.myIs.copyFromJSON(
        // target:any,
        this, 
        // json
        json);
    }; // end method
    return KlassReview;
}());
exports.KlassReview = KlassReview;
//# sourceMappingURL=klass-review.js.map