"use strict";
/*
*	@ Desc : 가격, 시간, 시간등의 포맷 지원
*/
var HelperMyFormat = (function () {
    function HelperMyFormat() {
    }
    HelperMyFormat.prototype.numberWithCommas = function (x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };
    return HelperMyFormat;
}());
exports.HelperMyFormat = HelperMyFormat;
//# sourceMappingURL=my-format.js.map