"use strict";
var http_1 = require('@angular/http');
/*
*	@ Desc : API Request에서 자주 쓰이는 패턴들을 모은 클래스.
*
*/
var MyRequest = (function () {
    function MyRequest() {
    }
    MyRequest.prototype.getHeaderCafeclassAPI = function (apiKey) {
        var headers = new http_1.Headers({
            'Content-Type': 'application/json',
            'Cafeclass-REST-API-Key': apiKey
        });
        return headers;
    };
    MyRequest.prototype.getReqOptionCafeclassAPI = function (apiKey) {
        var headers = this.getHeaderCafeclassAPI(apiKey);
        var options = new http_1.RequestOptions({ headers: headers });
        return options;
    };
    return MyRequest;
}());
exports.MyRequest = MyRequest;
//# sourceMappingURL=my-request.js.map