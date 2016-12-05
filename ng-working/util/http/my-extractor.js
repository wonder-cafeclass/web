"use strict";
var my_response_1 = require('../model/my-response');
/*
*	@ Desc : API 통신에서 돌아온 response에 대해 처리하는 클래스
*
*/
var MyExtractor = (function () {
    function MyExtractor() {
    }
    MyExtractor.prototype.extractData = function (res) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("my-extractor / extractData / 시작");
        if (isDebug)
            console.log("my-extractor / extractData / res : ", res);
        function isJsonString(str) {
            if (null == str || "" == str) {
                return false;
            }
            try {
                JSON.parse(str);
            }
            catch (e) {
                return false;
            }
            return true;
        }
        function hasJsonString(res) {
            var bodyStr = "";
            if (null != res && null != res["_body"]) {
                bodyStr = res["_body"];
            }
            if (isJsonString(bodyStr)) {
                return true;
            }
            return false;
        }
        function getJson(res) {
            if (null == res) {
                return null;
            }
            return res.json();
        }
        function isErrorHtml(str) {
            // Do something...
            var matchArr = str.match(/^\<.+\>$/gi);
            if (null != matchArr && 2 == matchArr.length) {
            }
            return true;
        }
        function hasErrorHtml(res) {
            var bodyStr = "";
            if (null != res && null != res["_body"]) {
                bodyStr = res["_body"];
            }
            if (isErrorHtml(bodyStr)) {
                return true;
            }
            return false;
        }
        function getErrorHtml(res) {
            var bodyStr = "";
            if (null != res && null != res["_body"]) {
                bodyStr = res["_body"];
            }
            return bodyStr;
        }
        var myResponse = null;
        if (hasJsonString(res)) {
            if (isDebug)
                console.log("my-extractor / extractData / 1-1. body string이 json object인 경우.");
            var jsonObj = getJson(res);
            if (null != jsonObj &&
                null != jsonObj["success"] &&
                null != jsonObj["message"]) {
                myResponse =
                    new my_response_1.MyResponse(
                    // public success:boolean
                    jsonObj["success"], 
                    // public message:string
                    jsonObj["message"], 
                    // public query:string
                    jsonObj["query"], 
                    // public error:string
                    jsonObj["error"], 
                    // public data:any
                    jsonObj["data"], 
                    // public extra:any
                    jsonObj["extra"]);
            }
            return myResponse;
        }
        else if (hasErrorHtml(res)) {
            if (isDebug)
                console.log("my-extractor / extractData / 1-2. body string이 json object이 아니고, 에러 메시지 html일 경우.");
            myResponse =
                new my_response_1.MyResponse(
                // public success:boolean
                false, 
                // public message:string
                "", 
                // public query:string
                "", 
                // public error:string
                getErrorHtml(res), 
                // public data:any
                null, 
                // public extra:any
                res);
            return myResponse;
        }
        else {
            if (isDebug)
                console.log("my-extractor / extractData / 1-3. 그 외의 경우.");
            return null;
        } // end if
    };
    MyExtractor.prototype.handleError = function (error) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("my-extractor / handleError / 시작");
        if (isDebug)
            console.log("my-extractor / handleError / error : ", error);
        function isJsonString(str) {
            if (null == str || "" == str) {
                return false;
            }
            try {
                JSON.parse(str);
            }
            catch (e) {
                return false;
            }
            return true;
        }
        function hasJsonString(res) {
            var bodyStr = "";
            if (null != res && null != res["_body"]) {
                bodyStr = res["_body"];
            }
            if (isJsonString(bodyStr)) {
                return true;
            }
            return false;
        }
        function getJson(res) {
            if (null == res) {
                return null;
            }
            return res.json();
        }
        if (hasJsonString(error)) {
            // 에러 객체에서 에러 메시지를 뽑아냅니다.
            var jsonError = getJson(error);
            if (isDebug)
                console.log("my-extractor / handleError / jsonError : ", jsonError);
            return Promise.reject(jsonError);
        }
        // 그 이외의 에러 상황. console에 노출합니다.
        // In a real world app, we might use a remote logging infrastructure
        // We'd also dig deeper into the error to get a better message
        var errMsg = (error.message) ? error.message :
            error.status ? error.status + " - " + error.statusText : 'Server error';
        if (isDebug)
            console.log("my-extractor / handleError / errMsg : ", errMsg);
        return Promise.reject(errMsg);
    };
    return MyExtractor;
}());
exports.MyExtractor = MyExtractor;
//# sourceMappingURL=my-extractor.js.map