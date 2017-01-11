"use strict";
/*
*	@ Desc : 가격, 시간, 시간등의 포맷 지원
*/
var HelperMyFormat = (function () {
    function HelperMyFormat() {
    }
    HelperMyFormat.prototype.getKRWWithCommas = function (target) {
        var numberWithCommas = this.numberWithCommas(target);
        return "\u20A9" + numberWithCommas;
    };
    HelperMyFormat.prototype.numberWithCommas = function (x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };
    // @ Desc : "도전하는 삶이 아름답습니다.↵당신의 도전에 힘이 되어 드리겠습니다.↵" --> "도전하는 삶이 아름답습니다.<br>당신의 도전에 힘이 되어 드리겠습니다.<br>"
    HelperMyFormat.prototype.nextlineToBR = function (target) {
        if (null == target || "" === target) {
            return "";
        }
        target = target.replace(/(\n|\n\r)/gi, "<br>");
        return target;
    };
    HelperMyFormat.prototype.brToNextline = function (target) {
        if (null == target || "" === target) {
            return "";
        }
        target = target.replace(/(\<br\>|\<\/br\>|\<br\/\>)/gi, "\n");
        return target;
    };
    HelperMyFormat.prototype.splitWithBR = function (target) {
        if (null == target || "" === target) {
            return [];
        } // end if
        return target.split("<br>");
    };
    return HelperMyFormat;
}());
exports.HelperMyFormat = HelperMyFormat;
//# sourceMappingURL=my-format.js.map