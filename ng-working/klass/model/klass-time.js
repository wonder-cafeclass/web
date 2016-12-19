"use strict";
var my_is_1 = require('../../util/helper/my-is');
var KlassTime = (function () {
    function KlassTime(key, name_eng, name_kor, hh_mm, img_url) {
        this.key = key;
        this.name_eng = name_eng;
        this.name_kor = name_kor;
        this.hh_mm = hh_mm;
        this.img_url = img_url;
        this.myIs = new my_is_1.HelperMyIs();
    }
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