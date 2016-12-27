"use strict";
var my_is_1 = require('../../util/helper/my-is');
var KlassLevel = (function () {
    function KlassLevel(key, name_eng, name_kor, img_url) {
        this.key = key;
        this.name_eng = name_eng;
        this.name_kor = name_kor;
        this.img_url = img_url;
        this.myIs = new my_is_1.HelperMyIs();
    }
    KlassLevel.prototype.isSame = function (target) {
        return this.myIs.isSame(this, target);
    };
    KlassLevel.prototype.isSharing = function (key, target) {
        return this.myIs.isSharing(key, this, target);
    };
    return KlassLevel;
}());
exports.KlassLevel = KlassLevel;
//# sourceMappingURL=klass-level.js.map