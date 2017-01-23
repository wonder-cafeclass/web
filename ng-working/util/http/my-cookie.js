"use strict";
/*
*	@ Desc : 브라우저의 쿠키 제어 on js.
*
*/
var MyCookie = (function () {
    function MyCookie() {
    }
    // @ Desc : 쿠키의 값을 가져온 뒤 삭제합니다.
    MyCookie.prototype.popCookie = function (cname) {
        var value = this.getCookie(cname);
        this.deleteCookie(cname);
        return value;
    };
    MyCookie.prototype.deleteCookie = function (cname) {
        var d = new Date();
        d.setTime(d.getTime() - (24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=;" + expires + ";";
    };
    MyCookie.prototype.setCookie = function (cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    };
    MyCookie.prototype.getCookie = function (cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                var value = c.substring(name.length, c.length);
                if (null == value ||
                    "" == value ||
                    undefined == value ||
                    "undefined" == value) {
                    return "";
                }
                return value;
            }
        }
        return "";
    };
    return MyCookie;
}());
exports.MyCookie = MyCookie;
//# sourceMappingURL=my-cookie.js.map