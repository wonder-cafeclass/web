/*
*	@ Desc : 배열 관련 함수 모음
*/
export class HelperMyArray {

	constructor() {}

	hasNotStr(arrStr:string[], value:string):boolean {
		return !this.hasStr(arrStr, value);
	}
	hasStr(arrStr:string[], value:string):boolean {

        if(null == value || "" == value) {
            return false;
        } else if(null == arrStr || 0 == arrStr.length) {
            return false;
        }

        for (var i = 0; i < arrStr.length; ++i) {
            let valueFromList:string = arrStr[i];
            if(valueFromList === value) {
                return true;
            }
        }

        return false;

	}
	removeStr(arrStr:string[], value:string):string[] {

        if(null == value || "" == value) {
            return arrStr;
        } else if(null == arrStr || 0 == arrStr.length) {
            return arrStr;
        } else if(this.hasNotStr(arrStr, value)) {
        	return arrStr;	
        }

        let arrStrNext:string[] = [];
        for (var i = 0; i < arrStr.length; ++i) {
            let valueFromList:string = arrStr[i];
            if(valueFromList === value) {
                continue;
            }

            arrStrNext.push(valueFromList);
        }

		return arrStrNext;
	}
	addStrUnique(arrStr:string[], value:string):string[] {

        if(null == value || "" == value) {
            return arrStr;
        } else if(null == arrStr) {
        	// 배열이 없다면 새로 만듭니다.
            arrStr = [];
        } else if(this.hasStr(arrStr, value)) {
        	// 이미 있는 문자열이라면 추가하지 않습니다.
        	return arrStr;	
        }

        arrStr.push(value);

        return arrStr;
	}
    getValueFromLists(key:string, srcList:string[], targetList:string[]):string {

        // let isDebug:boolean = true;
        let isDebug:boolean = false;
        if(isDebug) console.log("my-array / getValueFromLists / 시작");


        if(null == key || "" === key) {
            if(isDebug) console.log("my-array / getValueFromLists / 중단 / key is not valid!");
            return "";
        }
        if(null == srcList || 0 === srcList.length) {
            if(isDebug) console.log("my-array / getValueFromLists / 중단 / srcList is not valid!");
            return "";
        }
        if(null == targetList || 0 === targetList.length) {
            if(isDebug) console.log("my-array / getValueFromLists / 중단 / targetList is not valid!");
            return "";
        }
        if(srcList.length !== targetList.length) {
            if(isDebug) console.log("my-array / getValueFromLists / 중단 / srcList.length !== targetList.length");
            return "";
        }
        if(this.hasNotStr(srcList, key)) {
            if(isDebug) console.log("my-array / getValueFromLists / 중단 / this.hasNotStr(srcList, key)");
            return "";   
        }

        for (var i = 0; i < srcList.length; ++i) {
            let keyFromList:string = srcList[i];
            if(keyFromList === key) {
                return targetList[i]; 
            }
        }

        return "";
    }
}