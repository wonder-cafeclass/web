"use strict";
var MyEvent = (function () {
    function MyEvent(id, eventName, key, value, metaObj, myChecker) {
        this.id = id;
        this.eventName = eventName;
        this.key = key;
        this.value = value;
        this.metaObj = metaObj;
        this.myChecker = myChecker;
        // REFACTOR ME - key value 처리 util을 만들어야 할 듯.
        this.loopCnt = 0;
        this.loopCntMax = 5;
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
    MyEvent.prototype.digMetaProp = function (keys) {
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("my-event / digMetaProp / init");
        if (null == keys || 0 === keys.length) {
            return null;
        }
        if (isDebug)
            console.log("my-event / digMetaProp / digMetaPropRecursive");
        return this.digMetaPropRecursive(keys, this.metaObj);
    };
    MyEvent.prototype.digMetaPropRecursive = function (keys, metaObj) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("my-event / digMetaPropRecursive / init");
        if (this.loopCntMax < this.loopCnt) {
            // 5 depths 이상일 경우는 중단.
            if (isDebug)
                console.log("my-event / digMetaPropRecursive / 중단 / 5 depths 이상일 경우");
            return null;
        }
        if (null == keys || 0 === keys.length) {
            if (isDebug)
                console.log("my-event / digMetaPropRecursive / 중단 / keys is not valid!");
            return metaObj;
        }
        if (null == metaObj) {
            if (isDebug)
                console.log("my-event / digMetaPropRecursive / 중단 / metaObj is not valid!");
            return null;
        }
        if (isDebug)
            console.log("my-event / digMetaPropRecursive / BEFORE / keys.length : ", keys.length);
        var key = keys.shift();
        if (null == key || "" === key) {
            if (isDebug)
                console.log("my-event / digMetaPropRecursive / 중단 / key is not valid!");
            return metaObj;
        }
        if (isDebug)
            console.log("my-event / digMetaPropRecursive / AFTER / keys.length : ", keys.length);
        if (isDebug)
            console.log("my-event / digMetaPropRecursive / AFTER / key : ", key);
        if (null == metaObj[key]) {
            if (isDebug)
                console.log("my-event / digMetaPropRecursive / 중단 / metaObj[key] is not valid!");
            return null;
        }
        var nextMetaObj = metaObj[key];
        if (0 == keys.length) {
            if (isDebug)
                console.log("my-event / digMetaPropRecursive / 중단 / No more key!");
            return nextMetaObj;
        }
        this.loopCnt++;
        if (isDebug)
            console.log("my-event / digMetaPropRecursive / this.loopCnt : ", this.loopCnt);
        return this.digMetaPropRecursive(keys, nextMetaObj);
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
    return MyEvent;
}());
exports.MyEvent = MyEvent;
//# sourceMappingURL=my-event.js.map