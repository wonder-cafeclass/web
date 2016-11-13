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