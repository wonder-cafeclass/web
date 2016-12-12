"use strict";
var MyRegEx = (function () {
    function MyRegEx() {
        // @ Desc : 정규표현식 모음 클래스
        this.EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        this.REGEX_SAFE_STR = /[^a-zA-Z0-9가-힣ㄱ-ㅎㅏ-ㅣ\x20\s\(\)\.\:\;?\!\=\'\"`\^\(\)\&\~]/g;
    }
    return MyRegEx;
}());
exports.MyRegEx = MyRegEx;
//# sourceMappingURL=my-regex.js.map