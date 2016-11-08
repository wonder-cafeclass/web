"use strict";
var MyEvent = (function () {
    function MyEvent(eventName, title, key, value, metaObj) {
        this.eventName = eventName;
        this.title = title;
        this.key = key;
        this.value = value;
        this.metaObj = metaObj;
    }
    MyEvent.prototype.copy = function () {
        var copy = new MyEvent(this.eventName, this.title, this.key, this.value, this.metaObj);
        return copy;
    };
    MyEvent.prototype.isSame = function (myEvent) {
        if (this.eventName !== myEvent.eventName) {
            return false;
        }
        if (this.title !== myEvent.title) {
            return false;
        }
        if (this.key !== myEvent.key) {
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