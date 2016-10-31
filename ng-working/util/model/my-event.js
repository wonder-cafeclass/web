"use strict";
var MyEvent = (function () {
    function MyEvent(eventName, title, key, value, metaObj) {
        this.eventName = eventName;
        this.title = title;
        this.key = key;
        this.value = value;
        this.metaObj = metaObj;
    }
    return MyEvent;
}());
exports.MyEvent = MyEvent;
//# sourceMappingURL=my-event.js.map