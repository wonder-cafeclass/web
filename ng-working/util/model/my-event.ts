import { MyChecker } from './my-checker';

export class MyEvent {

	public parentEventList:MyEvent[];

	constructor(
		public id:number,
	    public eventName:string,
	    public key:string,
	    public value:string,
	    public metaObj:any,
	    public myChecker:MyChecker
	) {}

	public isNotValid() :boolean {
		return !this.isValid();
	}

	public isValid() :boolean {

		if(null == this.eventName || "" === this.eventName) {
			return false;
		}
		if(null == this.key || "" === this.key) {
			return false;
		}
		if(null == this.myChecker) {
			return false;
		}

		return true;
	}

	public hasNotMetaObj() :boolean {
		return !this.hasMetaObj();
	}
	public hasMetaObj() :boolean {

	    // let isDebug:boolean = true;
	    let isDebug:boolean = false;
	    if(isDebug) console.log("my-event / hasMetaObj / init");

	    let hasMeta:boolean = (null != this.metaObj)?true:false;
	    if(isDebug) console.log("my-event / hasMetaObj / hasMeta : ",hasMeta);

		return hasMeta;
	}

	public digMetaProp(keys:string[]) :any {

	    let isDebug:boolean = true;
	    // let isDebug:boolean = false;
	    if(isDebug) console.log("my-event / digMetaProp / init");

		if(null == keys || 0 === keys.length) {
			return null;
		}

		if(isDebug) console.log("my-event / digMetaProp / digMetaPropRecursive");

		return this.digMetaPropRecursive(keys, this.metaObj);
	}

	// REFACTOR ME - key value 처리 util을 만들어야 할 듯.
	private loopCnt:number = 0;
	private loopCntMax:number = 5;
	private digMetaPropRecursive(keys:string[], metaObj) :any {

	    // let isDebug:boolean = true;
	    let isDebug:boolean = false;
	    if(isDebug) console.log("my-event / digMetaPropRecursive / init");

		if(this.loopCntMax < this.loopCnt) {
			// 5 depths 이상일 경우는 중단.
			if(isDebug) console.log("my-event / digMetaPropRecursive / 중단 / 5 depths 이상일 경우");
			return null;
		}

		if(null == keys || 0 === keys.length) {
			if(isDebug) console.log("my-event / digMetaPropRecursive / 중단 / keys is not valid!");
			return metaObj;
		}
		if(null == metaObj) {
			if(isDebug) console.log("my-event / digMetaPropRecursive / 중단 / metaObj is not valid!");
			return null;
		}

		if(isDebug) console.log("my-event / digMetaPropRecursive / BEFORE / keys.length : ",keys.length);

		let key:string = keys.shift();
		if(null == key || "" === key) {
			if(isDebug) console.log("my-event / digMetaPropRecursive / 중단 / key is not valid!");
			return metaObj;
		}
		if(isDebug) console.log("my-event / digMetaPropRecursive / AFTER / keys.length : ",keys.length);
		if(isDebug) console.log("my-event / digMetaPropRecursive / AFTER / key : ",key);

		if(null == metaObj[key]) {
			if(isDebug) console.log("my-event / digMetaPropRecursive / 중단 / metaObj[key] is not valid!");
			return null;
		}

		let nextMetaObj = metaObj[key];
		if(0 == keys.length) {
			if(isDebug) console.log("my-event / digMetaPropRecursive / 중단 / No more key!");
			return nextMetaObj;
		}

		this.loopCnt++;

		if(isDebug) console.log("my-event / digMetaPropRecursive / this.loopCnt : ",this.loopCnt);

		return this.digMetaPropRecursive(keys, nextMetaObj);
	}

	public copy() :any {

		let copy = 
		new MyEvent(
			this.id,
			this.eventName, 
			this.key, 
			this.value, 
			this.metaObj,
			this.myChecker
		);

		return copy;
	}

	public isSame(myEvent:MyEvent) :boolean {

		if(this.id !== myEvent.id) {
			return false;
		}

		return true;
	}	

	public isSameValue(myEvent:MyEvent) :boolean {

		if(this.id !== myEvent.id) {
			return false;
		}
		if(this.value !== myEvent.value) {
			return false;
		}		

		return true;
	}		
}