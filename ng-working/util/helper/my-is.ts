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

}

/*
function isFunction(functionToCheck) {
 var getType = {};
 return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}
*/