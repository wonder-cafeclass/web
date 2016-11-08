"use strict";
var MyEvent = (function () {
    function MyEvent(eventName, title, key, value, metaObj) {
        this.eventName = eventName;
        this.title = title;
        this.key = key;
        this.value = value;
        this.metaObj = metaObj;
        var randomNum = (Math.random() * 1000000);
        this.id = key + "_" + eventName + "_" + randomNum;
    }
    MyEvent.prototype.copy = function () {
        var copy = new MyEvent(this.eventName, this.title, this.key, this.value, this.metaObj);
        copy.id = this.id;
        copy.valueNext = this.valueNext;
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