"use strict";
var MyChecker = (function () {
    function MyChecker(type, min, max, regexExclude // 매칭 결과가 없어야 함.
        ) {
        this.type = type;
        this.min = min;
        this.max = max;
        this.regexExclude = regexExclude;
    }
    return MyChecker;
}());
exports.MyChecker = MyChecker;
//# sourceMappingURL=my-checker.js.map