"use strict";
var my_array_1 = require('../../util/helper/my-array');
var my_is_1 = require('../../util/helper/my-is');
var Klass = (function () {
    function Klass() {
        this.delimiter_banner = "|||";
        this.helperMyArray = new my_array_1.HelperMyArray();
        this.helperMyIs = new my_is_1.HelperMyIs();
    }
    Klass.prototype.hasNotBanner = function (banner) {
        return this.helperMyArray.hasNotStr(this.class_banner_url_arr, banner);
    };
    Klass.prototype.hasBanner = function (banner) {
        return this.helperMyArray.hasStr(this.class_banner_url_arr, banner);
    };
    Klass.prototype.removeBanner = function (banner) {
        this.class_banner_url_arr = this.helperMyArray.removeStr(this.class_banner_url_arr, banner);
        this.updateBannerUrl();
    };
    Klass.prototype.addBanner = function (banner) {
        this.class_banner_url_arr = this.helperMyArray.addStrUnique(this.class_banner_url_arr, banner);
        this.updateBannerUrl();
    };
    Klass.prototype.updateBannerUrl = function () {
        this.class_banner_url = this.class_banner_url_arr.join(this.delimiter_banner);
    };
    Klass.prototype.copy = function () {
        return this.helperMyIs.copy(
        // src:any
        this, 
        // copy:any
        new Klass());
    }; // end method
    return Klass;
}());
exports.Klass = Klass;
//# sourceMappingURL=klass.js.map