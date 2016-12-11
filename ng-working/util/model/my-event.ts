import { MyChecker } from './my-checker';
import { MyPropPicker } from './my-prop-picker';

export class MyEvent {

	public parentEventList:MyEvent[];
	private myPropPicker:MyPropPicker;

	constructor(
		public id:number,
	    public eventName:string,
	    public key:string,
	    public value:string,
	    public metaObj:any,
	    public myChecker:MyChecker
	) {
		this.myPropPicker = new MyPropPicker();
	}

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

	public searchMetaProp(keys:string[]) :any {

	    // let isDebug:boolean = true;
	    let isDebug:boolean = false;
	    if(isDebug) console.log("my-event / searchMetaProp / init");

		if(null == keys || 0 === keys.length) {
			if(isDebug) console.log("my-event / searchMetaProp / 중단 / keys is not valid!");
			return null;
		}

		if(null == this.metaObj) {
			if(isDebug) console.log("my-event / searchMetaProp / 중단 / this.metaObj is not valid!");
			return null;
		}

		if(isDebug) console.log("my-event / searchMetaProp / this.myPropPicker.search");

		return this.myPropPicker.search(keys, this.metaObj);
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

	public hasEventName(eventName:string) :boolean {

		if(null == eventName || "" === eventName) {
			return false;
		}

		if(this.eventName === eventName) {
			return true;
		}

		return false;
	}

	public hasKey(key:string) :boolean {

		if(null == key || "" === key) {
			return false;
		}

		if(this.key === key) {
			return true;
		}

		return false;
	}

	public isSameRegExp(left, right) :boolean {
		if(null == left) {
			return false;
		}
		if(null == right) {
			return false;
		}
		let leftStr:string = "" + left;
		let rightStr:string = "" + right;

		if(leftStr === rightStr) {
			return true;
		}

		return false;
	}
}