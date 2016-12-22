/*
*	@ Desc : 비교 관련 함수 모음
*/
export class HelperMyIs {

	constructor() {}

	isFunction(functionToCheck:any) :boolean {

		let type:string = this.getType(functionToCheck);
		if(null == type || "" === type) {
			false;
		}

		var getType = {};
		return (type == '[object Function]')?true:false;
	}

	isArray(functionToCheck:any) :boolean {

		let type:string = this.getType(functionToCheck);
		if(null == type || "" === type) {
			false;
		}

		var getType = {};
		return (type == '[object Array]')?true:false;
	}	

	isNotString(target:any) :boolean {
		return !this.isString(target);
	}
	isString(target:any) :boolean {

		let type:string = this.getType(target);
		if(null == type || "" === type) {
			false;
		}

		var getType = {};
		return (type == '[object String]')?true:false;
	}

	isNotNumber(target:any) :boolean {
		return !this.isString(target);
	}
	isNumber(target:any) :boolean {

		let type:string = this.getType(target);
		if(null == type || "" === type) {
			false;
		}

		var getType = {};
		return (type == '[object Number]')?true:false;
	}

	isArrayList(target:any) :boolean {

		if(null == target) {
			return false;
		}

		let isArray:boolean = this.isArray(target);
		if(!isArray) {
			return false;
		}

		// 모든 인자가 array 이어야 합니다.
		for (var i = 0; i < target.length; ++i) {
			let element = target[i];
			if(!this.isArray(element)) {
				return false;
			}
		}

		return true;
	}

	isStringList(target:any) :boolean {

		if(null == target) {
			return false;
		}

		let isArray:boolean = this.isArray(target);
		if(!isArray) {
			return false;
		}

		// 모든 인자가 array 이어야 합니다.
		for (var i = 0; i < target.length; ++i) {
			let element = target[i];
			if(!this.isString(element)) {
				return false;
			}
		}

		return true;
	}	

	getType(anyToCheck:any) :string {

		var getType = {};

		if(null == anyToCheck) {
			return "";
		}

		return getType.toString.call(anyToCheck);
	}

	copy(src:any, copy:any) :any {

		if(null == src || null == copy) {
			return null;
		}

        for(var key in src) {

            if(this.isFunction(src[key])) {
                // 함수는 복사하지 않습니다.
                continue;
            }

            copy[key] = src[key];

        } // end for

        return copy;
		
	} // end method

	copyFromJSON(target:any, json) :any {

        // let isDebug:boolean = true;
        let isDebug:boolean = false;
        if(isDebug) console.log("klass / copyFromJSON / init");

		if(null == target) {
			if(isDebug) console.log("klass / copyFromJSON / 중단 / target is not valid!");
			return target;
		} // end if

		if(null == json) {
			if(isDebug) console.log("klass / copyFromJSON / 중단 / json is not valid!");
			return target;
		} // end if

        for(var key in target) {

            if(this.isFunction(target[key])) {
                // 함수는 복사하지 않습니다.
                continue;
            }

        	if(isDebug) console.log("klass / copyFromJSON / key : ",key);
        	// For Debug
        	let type:string = this.getType(target[key]);

        	if(isDebug) console.log("klass / copyFromJSON / type : ",type);

            if(null == json[key]) {
            	// null은 복사하지 않습니다.
            	continue;
            }

            if(this.isNumber(target[key])) {
            	target[key] = parseInt(json[key]);
            } else {
            	target[key] = json[key];	
            }

        } // end for

        return target;

	}

	// @ Desc : 객체의 모든 변수의 값이 동일한지 확인합니다.
	isSame(src:any, target:any) :boolean {

		if(null == src || null == target) {
			return false;
		}

        for(var key in src) {

        	if(null == target[key]) {
        		return false;
        	}

        	if(src[key] != target[key]) {
        		return false;
        	}

        } // end for


		return true;

	}

	// @ Desc : 특정 변수가 동일한지 확인합니다.
	isSharing(key:string, src:any, target:any) :boolean {

		if(null == src || null == target) {
			return false;
		}
		if(null == key || "" ===  key) {
			return false;
		}
		if(null == src[key] || null == target[key]) {
			return false;
		}
    	if(src[key] != target[key]) {
    		return false;
    	}

		return true;

	}	

}