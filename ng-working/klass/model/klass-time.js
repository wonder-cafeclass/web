"use strict";
var my_is_1 = require('../../util/helper/my-is');
var my_array_1 = require('../../util/helper/my-array');
var KlassTime = (function () {
    function KlassTime(key, name_eng, name_kor, hh_mm, img_url) {
        this.key = key;
        this.name_eng = name_eng;
        this.name_kor = name_kor;
        this.hh_mm = hh_mm;
        this.img_url = img_url;
        this.myIs = new my_is_1.HelperMyIs();
        this.myArray = new my_array_1.HelperMyArray();
    }
    KlassTime.prototype.getKeyNotDefault = function () {
        if (this.myArray.isOK(this.selectableList)) {
            // 기본값 여부 검사
            var target = this.selectableList[0];
            if (target.key === this.key) {
                return "";
            } // end if
        } // end if
        return this.key;
    };
    KlassTime.prototype.isSame = function (target) {
        return this.myIs.isSame(this, target);
    };
    KlassTime.prototype.isSharing = function (key, target) {
        return this.myIs.isSharing(key, this, target);
    };
    return KlassTime;
}());
exports.KlassTime = KlassTime;
//# sourceMappingURL=klass-time.js.map