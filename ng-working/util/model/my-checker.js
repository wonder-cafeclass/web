"use strict";
var MyChecker = (function () {
    function MyChecker(type, min, max, regex) {
        this.type = type;
        this.min = min;
        this.max = max;
        this.regex = regex;
    }
    return MyChecker;
}());
exports.MyChecker = MyChecker;
//# sourceMappingURL=my-checker.js.map