export class MyChecker {

	public msg:string;

	constructor(
	    public type:string,
	    public min:number,
	    public max:number,
	    public regex:RegExp
	) {}

}