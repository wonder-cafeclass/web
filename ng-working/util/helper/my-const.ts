import { HelperMyIs } 		from './my-is';
import { HelperMyArray } 	from './my-array';
import { HelperMyTime } 	from './my-time';
import { MyPropPicker } 	from '../model/my-prop-picker';
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

    	return list;
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





}