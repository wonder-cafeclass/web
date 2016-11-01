export class MyEvent {

	public valueNext:string;

	constructor(
	    public eventName:string,
	    public title:string,
	    public key:string,
	    public value:string,
	    public metaObj:any
	) {}
}