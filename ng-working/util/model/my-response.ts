export class MyResponse {

	constructor(
		public success:boolean,
	    public message:string,
	    public query:string,
	    public error:string,
	    public data:any,
	    public extra:any
	) {}

	public isSuccess():boolean {
		if(null == this.success || !this.success) {
			return false;
		}
		return true;
	}
	public isFailed():boolean {
		return !this.isSuccess();
	}

	public getMessage():string {
		return this.message;
	}

	public getQuery():string {
		return this.query;
	}

	public getError():string {
		return this.error;
	}

	public getData():any {
		return this.data;
	}

	public getDataProp(key:string):any {

		if(this.hasDataProp(key)) {
			return this.data[key];
		}

		return null;
	}

	public digDataProp(keyArr:string[]):any {
		if(null == keyArr || 0 == keyArr.length) {
			return null;
		}

		return this.digDataPropRecursive(keyArr, this.data);
	}

	/*
	*	@ Desc : 최대 5단계까지 key 배열로 원하는 값을 조회, 가져옵니다.
	*/
	private loopProtector:number=5;
	private loopCounter:number=0;
	private digDataPropRecursive(keyArr:string[], target:any):any {

		if(null == keyArr || 0 == keyArr.length) {
			return null;
		}
		if(null == target) {
			return null;
		}
		if(this.loopProtector < this.loopCounter) {
			// 최대 5 단계까지 조회 가능합니다.
			return null;
		}

		// get first key
		let key:string = keyArr.shift();
		if(null == key || "" == key) {
			return null;
		}

		let nextTarget:any = null;
		for (var k in target){
			if(k === key) {
				nextTarget = target[k];
			}
		}

		if(0 == keyArr.length) {
			// 마지막 값을 찾았습니다. loopCounter를 초기화합니다.
			this.loopCounter = 0;
			return nextTarget;
		}

		// 다음 depth에서 값을 찾습니다. loopCounter를 +1.
		this.loopCounter++;
		return this.digDataPropRecursive(keyArr, nextTarget);
	}

	public hasNotDataProp(key:string):boolean {
		return !this.hasDataProp(key);
	}
	public hasDataProp(key:string):boolean {

		if(null == this.data) {
			return false;
		}

		for (var k in this.data){
			if(k === key) {
				return true;
			}
		}

		return false;
	}

	public getExtra():any {
		return this.extra;
	}

	
}