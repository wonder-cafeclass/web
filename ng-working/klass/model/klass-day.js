"use strict";
var my_is_1 = require('../../util/helper/my-is');
var my_array_1 = require('../../util/helper/my-array');
var KlassDay = (function () {
    function KlassDay(key, name_eng, name_kor, img_url) {
        this.key = key;
        this.name_eng = name_eng;
        this.name_kor = name_kor;
        this.img_url = img_url;
        this.myIs = new my_is_1.HelperMyIs();
        this.myArray = new my_array_1.HelperMyArray();
    }
    KlassDay.prototype.getKeyNotDefault = function () {
        if (this.myArray.isOK(this.selectableList)) {
            // 기본값 여부 검사
            var target = this.selectableList[0];
            if (target.key === this.key) {
                return "";
            } // end if
        } // end if
        return this.key;
    };
    KlassDay.prototype.isSame = function (target) {
        return this.myIs.isSame(this, target);
    };
    KlassDay.prototype.isSharing = function (key, target) {
        return this.myIs.isSharing(key, this, target);
    };
    return KlassDay;
}());
exports.KlassDay = KlassDay;
//# sourceMappingURL=klass-day.js.map