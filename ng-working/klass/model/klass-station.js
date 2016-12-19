"use strict";
var my_is_1 = require('../../util/helper/my-is');
var KlassStation = (function () {
    function KlassStation(key, name_eng, name_kor, img_url) {
        this.key = key;
        this.name_eng = name_eng;
        this.name_kor = name_kor;
        this.img_url = img_url;
        this.myIs = new my_is_1.HelperMyIs();
    }
    KlassStation.prototype.isSame = function (target) {
        return this.myIs.isSame(this, target);
    };
    KlassStation.prototype.isSharing = function (key, target) {
        return this.myIs.isSharing(key, this, target);
    };
    return KlassStation;
}());
exports.KlassStation = KlassStation;
//# sourceMappingURL=klass-station.js.map