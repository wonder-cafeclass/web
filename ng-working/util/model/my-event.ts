export class MyEvent {

	public valueNext:string;
	public id:string;

	constructor(
	    public eventName:string,
	    public title:string,
	    public key:string,
	    public value:string,
	    public metaObj:any
	) {
		let randomNum:number = (Math.random() * 1000000);
		this.id = `${key}_${eventName}_${randomNum}`;
	}

	public copy() :any {

		let copy = 
		new MyEvent(
			this.eventName, 
			this.title, 
			this.key, 
			this.value, 
			this.metaObj
		);

		copy.id = this.id;
		copy.valueNext = this.valueNext;

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