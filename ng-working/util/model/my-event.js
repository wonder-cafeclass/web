"use strict";
var my_prop_picker_1 = require('./my-prop-picker');
var MyEvent = (function () {
    function MyEvent(id, eventName, key, value, metaObj, myChecker) {
        this.id = id;
        this.eventName = eventName;
        this.key = key;
        this.value = value;
        this.metaObj = metaObj;
        this.myChecker = myChecker;
        this.myPropPicker = new my_prop_picker_1.MyPropPicker();
    }
    MyEvent.prototype.isNotValid = function () {
        return !this.isValid();
    };
    MyEvent.prototype.isValid = function () {
        if (null == this.eventName || "" === this.eventName) {
            return false;
        }
        if (null == this.key || "" === this.key) {
            return false;
        }
        if (null == this.myChecker) {
            return false;
        }
        return true;
    };
    MyEvent.prototype.hasNotMetaObj = function () {
        return !this.hasMetaObj();
    };
    MyEvent.prototype.hasMetaObj = function () {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("my-event / hasMetaObj / init");
        var hasMeta = (null != this.metaObj) ? true : false;
        if (isDebug)
            console.log("my-event / hasMetaObj / hasMeta : ", hasMeta);
        return hasMeta;
    };
    MyEvent.prototype.searchMetaProp = function (keys) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("my-event / searchMetaProp / init");
        if (null == keys || 0 === keys.length) {
            if (isDebug)
                console.log("my-event / searchMetaProp / 중단 / keys is not valid!");
            return null;
        }
        if (null == this.metaObj) {
            if (isDebug)
                console.log("my-event / searchMetaProp / 중단 / this.metaObj is not valid!");
            return null;
        }
        if (isDebug)
            console.log("my-event / searchMetaProp / this.myPropPicker.search");
        return this.myPropPicker.search(keys, this.metaObj);
    };
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
    MyEvent.prototype.hasEventName = function (eventName) {
        if (null == eventName || "" === eventName) {
            return false;
        }
        if (this.eventName === eventName) {
            return true;
        }
        return false;
    };
    MyEvent.prototype.hasKey = function (key) {
        if (null == key || "" === key) {
            return false;
        }
        if (this.key === key) {
            return true;
        }
        return false;
    };
    MyEvent.prototype.isSameRegExp = function (left, right) {
        if (null == left) {
            return false;
        }
        if (null == right) {
            return false;
        }
        var leftStr = "" + left;
        var rightStr = "" + right;
        if (leftStr === rightStr) {
            return true;
        }
        return false;
    };
    return MyEvent;
}());
exports.MyEvent = MyEvent;
//# sourceMappingURL=my-event.js.map