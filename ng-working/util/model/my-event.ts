export class MyEvent {

	public valueNext:string;

	constructor(
	    public eventName:string,
	    public title:string,
	    public key:string,
	    public value:string,
	    public metaObj:any
	) {}

	public copy() :any {
		let copy = 
		new MyEvent(
			this.eventName, 
			this.title, 
			this.key, 
			this.value, 
			this.metaObj
		);

		return copy;
	}

	public isSame(myEvent:MyEvent) :boolean {

		if(this.eventName !== myEvent.eventName) {
			return false;
		}
		if(this.title !== myEvent.title) {
			return false;
		}
		if(this.key !== myEvent.key) {
			return false;
		}
		if(this.value !== myEvent.value) {
			return false;
		}

		return true;
	}
}