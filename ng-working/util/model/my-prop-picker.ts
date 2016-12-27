export class MyPropPicker {

	// @ Desc : JSON 형태의 key, value 데이터를 검색해주는 클래스.

	private loopCnt:number = 0;
	private loopCntMax:number = 5;

	// @ Usage : myPropPicker.search(["history","key"])
	public search(keys:string[], targetObj) :any {

	    // let isDebug:boolean = true;
	    let isDebug:boolean = false;
	    if(isDebug) console.log("my-prop-picker / digMetaProp / init");

		if(null == keys || 0 === keys.length) {
			if(isDebug) console.log("my-prop-picker / digMetaProp / 중단 / keys is not valid!");
			return null;
		}
		if(5 < keys.length) {
			if(isDebug) console.log("my-prop-picker / digMetaProp / 중단 / keys is over maxDepth : 5");
			return null;
		}
		if(null == targetObj) {
			if(isDebug) console.log("my-prop-picker / digMetaProp / 중단 / targetObj is not valid!");
			return null;
		}

		if(isDebug) console.log("my-prop-picker / digMetaProp / searchRecursive");

		this.loopCnt = 0;

		return this.searchRecursive(keys, targetObj);
	}

	private searchRecursive(keys:string[], targetObj) :any {

	    // let isDebug:boolean = true;
	    let isDebug:boolean = false;
	    if(isDebug) console.log("my-prop-picker / searchRecursive / init");

		if(this.loopCntMax < this.loopCnt) {
			// 5 depths 이상일 경우는 중단.
			if(isDebug) console.log("my-prop-picker / searchRecursive / 중단 / 5 depths 이상일 경우");
			return null;
		}

		if(null == keys || 0 === keys.length) {
			if(isDebug) console.log("my-prop-picker / searchRecursive / 중단 / keys is not valid!");
			return targetObj;
		}
		if(null == targetObj) {
			if(isDebug) console.log("my-prop-picker / searchRecursive / 중단 / targetObj is not valid!");
			return null;
		}

		if(isDebug) console.log("my-prop-picker / searchRecursive / BEFORE / keys.length : ",keys.length);

		let key:string = keys.shift();
		if(null == key || "" === key) {
			if(isDebug) console.log("my-prop-picker / searchRecursive / 중단 / key is not valid!");
			return targetObj;
		}
		if(isDebug) console.log("my-prop-picker / searchRecursive / AFTER / keys.length : ",keys.length);
		if(isDebug) console.log("my-prop-picker / searchRecursive / AFTER / key : ",key);

		if(null == targetObj[key]) {
			if(isDebug) console.log("my-prop-picker / searchRecursive / 중단 / targetObj[key] is not valid!");
			return null;
		}

		let nexttargetObj = targetObj[key];
		if(0 == keys.length) {
			if(isDebug) console.log("my-prop-picker / searchRecursive / 중단 / No more key!");
			return nexttargetObj;
		}

		this.loopCnt++;

		if(isDebug) console.log("my-prop-picker / searchRecursive / this.loopCnt : ",this.loopCnt);

		return this.searchRecursive(keys, nexttargetObj);
	}	

}