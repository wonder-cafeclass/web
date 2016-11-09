"use strict";
var MyEvent = (function () {
    function MyEvent(id, eventName, key, value, metaObj, myChecker) {
        this.id = id;
        this.eventName = eventName;
        this.key = key;
        this.value = value;
        this.metaObj = metaObj;
        this.myChecker = myChecker;
    }
    MyEvent.prototype.copy = function () {
        var copy = new MyEvent(this.id, this.eventName, this.key, this.value, this.metaObj, this.myChecker);
        return copy;
    };
    MyEvent.prototype.isSame = function (myEvent) {
        if (this.id !== myEvent.id) {
            return false;
        }
        return true;
    };
    MyEvent.prototype.isSameValue = function (myEvent) {
        if (this.id !== myEvent.id) {
            return false;
        }
        if (this.value !== myEvent.value) {
            return false;
        }
        return true;
    };
    return MyEvent;
}());
exports.MyEvent = MyEvent;
//# sourceMappingURL=my-event.js.map