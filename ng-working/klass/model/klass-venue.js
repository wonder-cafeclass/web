"use strict";
var my_array_1 = require('../../util/helper/my-array');
var my_is_1 = require('../../util/helper/my-is');
var my_time_1 = require('../../util/helper/my-time');
var KlassVenue = (function () {
    function KlassVenue() {
        this.isFocus = false;
        this.title = "";
        this.telephone = "";
        this.address = "";
        this.roadAddress = "";
        // 위도 / latitude / point.y
        // * 위도 값의 범위 : +90.00000(North)북위 90도 ~ -90.000000(South)남위 90도 	    
        this.latitude = -1;
        // 경도 / longitude / point.x
        // * 경도 값의 범위 : +180.000000(East)동경 180도 ~ -180.000000(West)서경 180도 [그리니치 천문대 기준 0도]
        this.longitude = -1;
        this.delimiter = "|||";
        this.myArray = new my_array_1.HelperMyArray();
        this.myIs = new my_is_1.HelperMyIs();
        this.myTime = new my_time_1.HelperMyTime();
    }
    KlassVenue.prototype.copy = function () {
        return this.myIs.copy(
        // src:any
        this, 
        // copy:any
        new KlassVenue());
    }; // end method
    KlassVenue.prototype.set = function (title, telephone, address, roadAddress, latitude, longitude) {
        this.title = title;
        this.telephone = telephone;
        this.address = address;
        this.roadAddress = roadAddress;
        this.latitude = latitude;
        this.longitude = longitude;
        return this;
    };
    KlassVenue.prototype.setJSON = function (json) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("klass-venue / setJSON / init");
        if (isDebug)
            console.log("klass-venue / setJSON / json : ", json);
        var klassVenue = this._setJSON(json);
        if (isDebug)
            console.log("klass-venue / setJSON / klassVenue : ", klassVenue);
        // 추가 작업이 필요한 데이터들을 여기서 다룹니다.
        return klassVenue;
    }; // end method
    KlassVenue.prototype._setJSON = function (json) {
        return this.myIs.copyFromJSON(
        // target:any,
        this, 
        // json
        json);
    }; // end method     
    return KlassVenue;
}());
exports.KlassVenue = KlassVenue;
//# sourceMappingURL=klass-venue.js.map