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