import { HelperMyIs } 		from './my-is';
import { HelperMyArray } 	from './my-array';
import { HelperMyTime } 	from './my-time';
import { MyPropPicker }     from '../model/my-prop-picker';
import { DefaultOption }    from '../../widget/input/default/model/default-option';
/*
*	@ Desc : 서버에서 전달 받은 json 객체의 데이터를 검색, 조회하는 헬퍼 
*/
export class HelperMyConst {

	private myIs:HelperMyIs;
	private myArray:HelperMyArray;
	private myTime:HelperMyTime;
	private myPropPicker:MyPropPicker;

	private constJSON:any;

	constructor() {
        this.myIs = new HelperMyIs();
        this.myArray = new HelperMyArray();
        this.myTime = new HelperMyTime();
        this.myPropPicker = new MyPropPicker();
    }

    setConstJSON(constJSON):void {
    	this.constJSON = constJSON;
    }

    private getList(key:string):any {

    	if(null == key || "" === key) {
    		return null;
    	} // end if

    	let list:any = this.constJSON[key];
    	if(null == list || 0 === list.length) {
    		return null;
    	} // end if

    	return this.myArray.copy(list);
    }

    getListNoDefault(key:string):string[] {
    	let list:string[] = this.getList(key);

    	// 첫번째 기본값을 버린 리스트를 가져옵니다.
    	list.shift();
		return list;
    }

    getValue(srcKey:string, srcValue:string, targetKey:string) {

        let isDebug:boolean = true;
        // let isDebug:boolean = false;
        if(isDebug) console.log("my-const / getValue / 시작");

    	let srcList:string[] = this.getList(srcKey);
    	let targetList:string[] = this.getList(targetKey);

    	if(isDebug) console.log("my-const / getValue / srcList : ",srcList);
    	if(isDebug) console.log("my-const / getValue / targetList : ",targetList);

    	let result:string = this.myArray.getValueFromLists(srcValue, srcList, targetList);

    	return result;
    }


    // @ Desc : 키 리스트에서 기본값을 가져옵니다.
    getDefault(key:string):string {

    	let list = this.getList(key);

    	return list[0];
    }
    getDefaultNested(parentKey:string, parentValue:string, childKey:string) {
    	let nestedList:string[] = this.getNestedChildList(parentKey, parentValue, childKey);
    	return nestedList[0];
    }

    // @ Desc : 키 리스트에서 첫번째값 - 보통 기본값의 다음 - 을 가져옵니다.
    getFirst(key:string):string {

    	let list = this.getList(key);

    	return list[1];
    }
    getFirstNested(parentKey:string, parentValue:string, childKey:string) {
    	let nestedList:string[] = this.getNestedChildList(parentKey, parentValue, childKey);
    	return nestedList[1];
    }


    /*
	// parent list
	// parentKey - subway_line_list
	// parentValue - line1
	"subway_line_list":[
		"Everywhere",
		"line1",
	],
	// child list
	"subway_station_list":[
		[
			"everywhere"
		],
		[
			"seoul"
		],
	],

	// return ["seoul"];

    */
    private parentListPrev:string[];
    private parentValuePrev:string;
    getNestedChildListFromPrevParent(childKey:string):string[] {

        // let isDebug:boolean = true;
        let isDebug:boolean = false;
        if(isDebug) console.log("my-const / getNestedChildListFromPrevParent / 시작");

    	if(null == this.parentListPrev) {
    		return;
    	}
    	if(null == this.parentValuePrev) {
    		return;
    	}

    	if(this.hasNotList(childKey)) {
    		if(isDebug) console.log(`my-const / getNestedChildListFromPrevParent / 중단 / this.hasNotList(childKey : ${childKey})`);
    		return [];	
    	}

    	let childList = this.getList(childKey);

    	let nestedChildList:string[] = 
    	this.myArray.getListFromLists(
    		// key:string, 
    		this.parentValuePrev, 
    		// srcList:string[], 
    		this.parentListPrev, 
    		// targetList:string[]
    		childList
		);

		if(isDebug) console.log(`my-const / getNestedChildListFromPrevParent / nestedChildList : `,nestedChildList);

    	return nestedChildList;

    }
    getNestedChildList(parentKey:string, parentValue:string, childKey:string):string[] {

        // let isDebug:boolean = true;
        let isDebug:boolean = false;
        if(isDebug) console.log("my-const / getNestedChildList / 시작");

        this.parentListPrev=null;
        this.parentValuePrev=null;

    	if(this.hasNotList(parentKey)) {
    		if(isDebug) console.log(`my-const / getNestedChildList / 중단 / this.hasNotList(parentKey : ${parentKey})`);
    		return [];	
    	}
    	if(this.hasNotList(childKey)) {
    		if(isDebug) console.log(`my-const / getNestedChildList / 중단 / this.hasNotList(childKey : ${childKey})`);
    		return [];	
    	}
    	if(this.hasNot(parentKey, parentValue)) {
    		if(isDebug) console.log(`my-const / getNestedChildList / 중단 / this.hasNot(parentKey : ${parentKey}, parentValue : ${parentValue})`);
    		return [];
    	}

    	this.parentValuePrev = parentValue;
    	let parentList = this.parentListPrev = this.getList(parentKey);
    	let childList = this.getList(childKey);

    	if(isDebug) console.log(`my-const / getNestedChildList / parentList : `,parentList);
    	if(isDebug) console.log(`my-const / getNestedChildList / childList : `,childList);

    	let nestedChildList:string[] = 
    	this.myArray.getListFromLists(
    		// key:string, 
    		parentValue, 
    		// srcList:string[], 
    		parentList, 
    		// targetList:string[]
    		childList
		);

		if(isDebug) console.log(`my-const / getNestedChildList / nestedChildList : `,nestedChildList);

    	return nestedChildList;
    }
    // @ Example : 지하철 역 이미지 가져오기.
    getNestedChildValue(parentKey:string, parentValue:string, childKeySrc:string, childValue:string, childKeyTarget:string):string {

        // let isDebug:boolean = true;
        let isDebug:boolean = false;
        if(isDebug) console.log("my-const / getNestedChildValue / 시작");

        if(isDebug) console.log(`my-const / getNestedChildValue / parentKey : ${parentKey}`);
        if(isDebug) console.log(`my-const / getNestedChildValue / parentValue : ${parentValue}`);
        if(isDebug) console.log(`my-const / getNestedChildValue / childKeySrc : ${childKeySrc}`);
        if(isDebug) console.log(`my-const / getNestedChildValue / childValue : ${childValue}`);
        if(isDebug) console.log(`my-const / getNestedChildValue / childKeyTarget : ${childKeyTarget}`);


    	// 중첩 자식 배열 중, 검색 기준이 되는 배열을 가져옵니다.
    	let srcList:string[] = this.getNestedChildList(parentKey, parentValue, childKeySrc);
    	if(null == srcList || 0 == srcList.length) {
    		if(isDebug) console.log(`my-const / getNestedChildValue / 중단 / srcList is not valid!`);
    		return 
    	}
    	if(isDebug) console.log(`my-const / getNestedChildValue / srcList : `,srcList);

    	let targetList:string[] = this.getNestedChildList(parentKey, parentValue, childKeyTarget);
    	if(null == targetList || 0 == targetList.length) {
    		if(isDebug) console.log(`my-const / getNestedChildValue / 중단 / targetList is not valid!`);
    		return 
    	}
    	if(isDebug) console.log(`my-const / getNestedChildValue / targetList : `,targetList);

    	let result:string = this.myArray.getValueFromLists(childValue, srcList, targetList);
    	if(isDebug) console.log(`my-const / getNestedChildValue / result : `,result);

    	return result;
    }

    hasNotList(key:string):boolean {
    	return !this.hasList(key);
    }
    hasList(key:string):boolean {

    	if(null == key || "" === key) {
    		return false;
    	} // end if
    	if(null == this.constJSON[key]) {
    		return false;
    	} // end if
    	let list = this.constJSON[key];
        list = this.myArray.copy(list);
    	if(null == list || 0 === list.length) {
    		return false;
    	} // end if

    	return true;

    }    
    hasNot(key:string, value:string):boolean {
    	return !this.has(key, value);
    }
    has(key:string, value:string):boolean {

        // let isDebug:boolean = true;
        let isDebug:boolean = false;
        if(isDebug) console.log("my-const / has / 시작");

    	if(null == key || "" === key) {
    		if(isDebug) console.log(`my-const / has / 중단 / Not valid! (key : ${key})`);
    		return false;
    	} // end if
    	if(null == value || "" === value) {
    		if(isDebug) console.log(`my-const / has / 중단 / Not valid! (value : ${value})`);
    		return false;
    	} // end if
    	if(this.hasNotList(key)) {
    		if(isDebug) console.log(`my-const / has / 중단 / this.hasNotList(key : ${key})`);
    		return false;
    	} // end if
    	let valueList = this.getList(key);

    	if(isDebug) console.log(`my-const / has / value : `,value);
    	if(isDebug) console.log(`my-const / has / valueList : `,valueList);

    	return this.myArray.hasStr(valueList, value);
    }

    // @ 체크박스 처럼 여러가지 선택이 가능한 경우.
    getDefaultOptionListWithFocusList(keyList:string[], valueList:string[], valueFocusList:string[]):DefaultOption[] {

        let isDebug:boolean = true;
        // let isDebug:boolean = false;
        if(isDebug) console.log("my-const / getDefaultOptionList / 시작");

        let defaultOptionList:DefaultOption[] = this.getDefaultOptionList(keyList, valueList, "");

        if(this.myArray.isNotStrArr(valueFocusList)) {
            return defaultOptionList;
        }

        // focus map
        let valueMap = this.getValueMap(valueFocusList);

        for (var i = 0; i < defaultOptionList.length; ++i) {
            let option:DefaultOption = defaultOptionList[i];
            if(null == option) {
                continue;
            } // end if
            if(null != valueMap[option.value]) {
                option.isFocus = true;
            } else {
                option.isFocus = false;
            }
        } // end for

        return defaultOptionList;
    } // end method.

    getValueMap(valueList:string[]):any {
        if(this.myArray.isNotStrArr(valueList)) {
            return {};
        }

        let valueMap = {};
        for (var i = 0; i < valueList.length; ++i) {
            let value:string = valueList[i];
            valueMap[value] = {};
        }

        return valueMap;
    }

    getDefaultOptionList(keyList:string[], valueList:string[], valueFocus:string):DefaultOption[] {

        let isDebug:boolean = true;
        // let isDebug:boolean = false;
        if(isDebug) console.log("my-const / getDefaultOptionList / 시작");

        if(this.myArray.isNotStrArr(keyList)) {
            if(isDebug) console.log("my-const / getDefaultOptionList / 중단 / this.myArray.isNotStrArr(keyList)");
            return;   
        }
        if(this.myArray.isNotStrArr(valueList)) {
            if(isDebug) console.log("my-const / getDefaultOptionList / 중단 / this.myArray.isNotStrArr(valueList)");
            return;   
        }
        if(keyList.length !== valueList.length) {
            if(isDebug) console.log("my-const / getDefaultOptionList / 중단 / keyList.length !== valueList.length");
            return;
        }

        let selectOptionList:DefaultOption[] = [];
        for (var i = 0; i < keyList.length; ++i) {

            let key:string = keyList[i];
            let value:string = valueList[i];
            let isFocus:boolean = (value === valueFocus)?true:false;

            let defaultOption:DefaultOption = 
            new DefaultOption(
                // public key:string,
                key,
                // public value:string,
                value,
                // public isFocus:boolean
                isFocus
            );
            if(isDebug) console.log("my-const / setKlassLevel / defaultOption : ",defaultOption);

            selectOptionList.push(defaultOption);
        } // end for

        return selectOptionList;
    }

    getDefaultOptionListWithKeyValueFocus(nameKeyList:string, nameValueList:string, nameFocusList:string[]):DefaultOption[] {

        let isDebug:boolean = true;
        // let isDebug:boolean = false;
        if(isDebug) console.log("my-const / getDefaultOptionListWithKeyValueFocus / 시작");

        if(this.hasNotList(nameKeyList)) {
            if(isDebug) console.log(`my-const / getDefaultOptionListWithKeyValueFocus / this.hasNotList(nameKeyList : ${nameKeyList})`);
            return;
        }
        if(this.hasNotList(nameValueList)) {
            if(isDebug) console.log(`my-const / getDefaultOptionListWithKeyValueFocus / this.hasNotList(nameKeyList : ${nameValueList})`);
            return;
        }

        let keyList:string[] = this.getListNoDefault(nameKeyList);
        let valueList:string[] = this.getListNoDefault(nameValueList);

        let defaultOptionList:DefaultOption[] = 
        this.getDefaultOptionListWithFocusList(
            keyList, 
            valueList, 
            nameFocusList
        );

        if(isDebug) console.log(`my-const / getDefaultOptionListWithKeyValueFocus / defaultOptionList : `,defaultOptionList);
       
        return defaultOptionList;
    } // end method

    getDefaultOptionListWithKeyValue(nameKeyList:string, nameValueList:string, nameFocus:string):DefaultOption[] {

        // let isDebug:boolean = true;
        let isDebug:boolean = false;
        if(isDebug) console.log("my-const / getDefaultOptionListWithKeyValue / 시작");

        if(this.hasNotList(nameKeyList)) {
            if(isDebug) console.log(`my-const / getDefaultOptionListWithKeyValue / this.hasNotList(nameKeyList : ${nameKeyList})`);
            return;
        }
        if(this.hasNotList(nameValueList)) {
            if(isDebug) console.log(`my-const / getDefaultOptionListWithKeyValue / this.hasNotList(nameKeyList : ${nameValueList})`);
            return;
        }

        let keyList:string[] = this.getListNoDefault(nameKeyList);
        let valueList:string[] = this.getListNoDefault(nameValueList);

        if(isDebug) console.log(`my-const / getDefaultOptionListWithKeyValue / keyList : `,keyList);
        if(isDebug) console.log(`my-const / getDefaultOptionListWithKeyValue / valueList : `,valueList);

        let defaultOptionList:DefaultOption[] = this.getDefaultOptionList(keyList, valueList, nameFocus);

        if(isDebug) console.log(`my-const / getDefaultOptionListWithKeyValue / defaultOptionList : `,defaultOptionList);
       

        return defaultOptionList;
    }





}