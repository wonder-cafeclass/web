"use strict";
var MyChecker = (function () {
    function MyChecker(type, min, max, regexExclude // 매칭 결과가 없어야 함.
        ) {
        this.type = type;
        this.min = min;
        this.max = max;
        this.regexExclude = regexExclude;
        // 이하
        this.isBoolean = false;
        // initialize
        this.regexIncludeArr = [];
        this.regexExcludeArr = [];
    }
    return MyChecker;
}());
exports.MyChecker = MyChecker;
//# sourceMappingURL=my-checker.js.map