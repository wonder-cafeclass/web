"use strict";
var my_is_1 = require('./my-is');
var my_array_1 = require('./my-array');
var my_time_1 = require('./my-time');
var my_prop_picker_1 = require('../model/my-prop-picker');
/*
*	@ Desc : 서버에서 전달 받은 json 객체의 데이터를 검색, 조회하는 헬퍼
*/
var HelperMyConst = (function () {
    function HelperMyConst() {
        this.myIs = new my_is_1.HelperMyIs();
        this.myArray = new my_array_1.HelperMyArray();
        this.myTime = new my_time_1.HelperMyTime();
        this.myPropPicker = new my_prop_picker_1.MyPropPicker();
    }
    HelperMyConst.prototype.setConstJSON = function (constJSON) {
        this.constJSON = constJSON;
    };
    HelperMyConst.prototype.getList = function (key) {
        if (null == key || "" === key) {
            return null;
        } // end if
        var list = this.constJSON[key];
        if (null == list || 0 === list.length) {
            return null;
        } // end if
        return list;
    };
    // @ Desc : 키 리스트에서 기본값을 가져옵니다.
    HelperMyConst.prototype.getDefault = function (key) {
        var list = this.getList(key);
        return list[0];
    };
    HelperMyConst.prototype.getDefaultNested = function (parentKey, parentValue, childKey) {
        var nestedList = this.getNestedChildList(parentKey, parentValue, childKey);
        return nestedList[0];
    };
    // @ Desc : 키 리스트에서 첫번째값 - 보통 기본값의 다음 - 을 가져옵니다.
    HelperMyConst.prototype.getFirst = function (key) {
        var list = this.getList(key);
        return list[1];
    };
    HelperMyConst.prototype.getFirstNested = function (parentKey, parentValue, childKey) {
        var nestedList = this.getNestedChildList(parentKey, parentValue, childKey);
        return nestedList[1];
    };
    HelperMyConst.prototype.getNestedChildListFromPrevParent = function (childKey) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("my-const / getNestedChildListFromPrevParent / 시작");
        if (null == this.parentListPrev) {
            return;
        }
        if (null == this.parentValuePrev) {
            return;
        }
        if (this.hasNotList(childKey)) {
            if (isDebug)
                console.log("my-const / getNestedChildListFromPrevParent / \uC911\uB2E8 / this.hasNotList(childKey : " + childKey + ")");
            return [];
        }
        var childList = this.getList(childKey);
        var nestedChildList = this.myArray.getListFromLists(
        // key:string, 
        this.parentValuePrev, 
        // srcList:string[], 
        this.parentListPrev, 
        // targetList:string[]
        childList);
        if (isDebug)
            console.log("my-const / getNestedChildListFromPrevParent / nestedChildList : ", nestedChildList);
        return nestedChildList;
    };
    HelperMyConst.prototype.getNestedChildList = function (parentKey, parentValue, childKey) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("my-const / getNestedChildList / 시작");
        this.parentListPrev = null;
        this.parentValuePrev = null;
        if (this.hasNotList(parentKey)) {
            if (isDebug)
                console.log("my-const / getNestedChildList / \uC911\uB2E8 / this.hasNotList(parentKey : " + parentKey + ")");
            return [];
        }
        if (this.hasNotList(childKey)) {
            if (isDebug)
                console.log("my-const / getNestedChildList / \uC911\uB2E8 / this.hasNotList(childKey : " + childKey + ")");
            return [];
        }
        if (this.hasNot(parentKey, parentValue)) {
            if (isDebug)
                console.log("my-const / getNestedChildList / \uC911\uB2E8 / this.hasNot(parentKey : " + parentKey + ", parentValue : " + parentValue + ")");
            return [];
        }
        this.parentValuePrev = parentValue;
        var parentList = this.parentListPrev = this.getList(parentKey);
        var childList = this.getList(childKey);
        if (isDebug)
            console.log("my-const / getNestedChildList / parentList : ", parentList);
        if (isDebug)
            console.log("my-const / getNestedChildList / childList : ", childList);
        var nestedChildList = this.myArray.getListFromLists(
        // key:string, 
        parentValue, 
        // srcList:string[], 
        parentList, 
        // targetList:string[]
        childList);
        if (isDebug)
            console.log("my-const / getNestedChildList / nestedChildList : ", nestedChildList);
        return nestedChildList;
    };
    // @ Example : 지하철 역 이미지 가져오기.
    HelperMyConst.prototype.getNestedChildValue = function (parentKey, parentValue, childKeySrc, childValue, childKeyTarget) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("my-const / getNestedChildValue / 시작");
        if (isDebug)
            console.log("my-const / getNestedChildValue / parentKey : " + parentKey);
        if (isDebug)
            console.log("my-const / getNestedChildValue / parentValue : " + parentValue);
        if (isDebug)
            console.log("my-const / getNestedChildValue / childKeySrc : " + childKeySrc);
        if (isDebug)
            console.log("my-const / getNestedChildValue / childValue : " + childValue);
        if (isDebug)
            console.log("my-const / getNestedChildValue / childKeyTarget : " + childKeyTarget);
        // 중첩 자식 배열 중, 검색 기준이 되는 배열을 가져옵니다.
        var srcList = this.getNestedChildList(parentKey, parentValue, childKeySrc);
        if (null == srcList || 0 == srcList.length) {
            if (isDebug)
                console.log("my-const / getNestedChildValue / \uC911\uB2E8 / srcList is not valid!");
            return;
        }
        if (isDebug)
            console.log("my-const / getNestedChildValue / srcList : ", srcList);
        var targetList = this.getNestedChildList(parentKey, parentValue, childKeyTarget);
        if (null == targetList || 0 == targetList.length) {
            if (isDebug)
                console.log("my-const / getNestedChildValue / \uC911\uB2E8 / targetList is not valid!");
            return;
        }
        if (isDebug)
            console.log("my-const / getNestedChildValue / targetList : ", targetList);
        var result = this.myArray.getValueFromLists(childValue, srcList, targetList);
        if (isDebug)
            console.log("my-const / getNestedChildValue / result : ", result);
        return result;
    };
    HelperMyConst.prototype.hasNotList = function (key) {
        return !this.hasList(key);
    };
    HelperMyConst.prototype.hasList = function (key) {
        if (null == key || "" === key) {
            return false;
        } // end if
        if (null == this.constJSON[key]) {
            return false;
        } // end if
        var list = this.constJSON[key];
        if (null == list || 0 === list.length) {
            return false;
        } // end if
        return true;
    };
    HelperMyConst.prototype.hasNot = function (key, value) {
        return !this.has(key, value);
    };
    HelperMyConst.prototype.has = function (key, value) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("my-const / has / 시작");
        if (null == key || "" === key) {
            if (isDebug)
                console.log("my-const / has / \uC911\uB2E8 / Not valid! (key : " + key + ")");
            return false;
        } // end if
        if (null == value || "" === value) {
            if (isDebug)
                console.log("my-const / has / \uC911\uB2E8 / Not valid! (value : " + value + ")");
            return false;
        } // end if
        if (this.hasNotList(key)) {
            if (isDebug)
                console.log("my-const / has / \uC911\uB2E8 / this.hasNotList(key : " + key + ")");
            return false;
        } // end if
        var valueList = this.getList(key);
        if (isDebug)
            console.log("my-const / has / value : ", value);
        if (isDebug)
            console.log("my-const / has / valueList : ", valueList);
        return this.myArray.hasStr(valueList, value);
    };
    return HelperMyConst;
}());
exports.HelperMyConst = HelperMyConst;
//# sourceMappingURL=my-const.js.map