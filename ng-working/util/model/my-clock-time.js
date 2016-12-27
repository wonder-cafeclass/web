"use strict";
var MyClockTime = (function () {
    function MyClockTime() {
        this.hhmm = "";
        this.hhmm24 = "";
        this.hhmm12 = "";
        this.hours = -1;
        this.minutes = -1;
        this.totalMinutes = -1;
        this.hoursForRotate = -1;
        this.isAM = false;
    }
    return MyClockTime;
}());
exports.MyClockTime = MyClockTime;
//# sourceMappingURL=my-clock-time.js.map