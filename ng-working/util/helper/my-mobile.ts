/*
*	@ Desc : 대한민국 휴대폰 번호 관련 처리 로직. / @ Deprecated
*/
export class HelperMyMobile {

	constructor() {}

	private mobileDigits:string
	private head:string="010";
	private body:string="";
	private tail:string="";

	public set(mobileDigits:string) :void {

		if( null == mobileDigits || "" === mobileDigits ) {
			return;
		}

		this.update(mobileDigits);

	} // end method

	private update(mobileDigits:string) :void {

		// let isDebug:boolean = true;
		let isDebug:boolean = false;
		if(isDebug) console.log("my-mobile / update / init");

		if(null == mobileDigits || "" == mobileDigits) {
			return;
		}
		if(isDebug) console.log("my-mobile / update / BEFORE / this.mobileDigits : ",this.mobileDigits);
		this.mobileDigits = mobileDigits;
		if(isDebug) console.log("my-mobile / update / AFTER / this.mobileDigits : ",this.mobileDigits);

		// 초기화.
		this.head = "010";
		this.body = "";
		this.tail = "";

		let mobileArr:string[] = mobileDigits.split("-");
		if(isDebug) console.log("my-mobile / update / mobileArr : ",mobileArr);
		if(null != mobileArr && 3 == mobileArr.length) {
			this.head = mobileArr[0];
			this.body = mobileArr[1];
			this.tail = mobileArr[2];
		}		
	}

	public getMobileArr() :string[] {
		// let isDebug:boolean = true;
		let isDebug:boolean = false;
		if(isDebug) console.log("my-mobile / getMobileArr / init");

		return [this.head, this.body, this.tail];
	}


	// HEAD
	public getMobileHead():string {

		// let isDebug:boolean = true;
		let isDebug:boolean = false;
		if(isDebug) console.log("my-mobile / getMobileHead / init");

		let mobileArr:string[] = this.getMobileArr();
		return mobileArr[0];
	}
	public getMobileWithNewHead(newHead:string):string {

		// let isDebug:boolean = true;
		let isDebug:boolean = false;
		if(isDebug) console.log("my-mobile / getMobileWithNewHead / init");

		if(null == newHead || "" == newHead) {
			return this.mobileDigits;
		}

		let mobileArr:string[] = this.getMobileArr();
		let newMobileDigits:string = `${newHead}-${mobileArr[1]}-${mobileArr[2]}`;

		this.update(newMobileDigits);

		return newMobileDigits;
	}
	public isMobileHeadNotEmpty():boolean {

		// let isDebug:boolean = true;
		let isDebug:boolean = false;
		if(isDebug) console.log("my-mobile / isMobileHeadNotEmpty / init");

		return !this.isMobileHeadEmpty();
	}
	public isMobileHeadEmpty():boolean {

		// let isDebug:boolean = true;
		let isDebug:boolean = false;
		if(isDebug) console.log("my-mobile / isMobileHeadEmpty / init");

		let mobileHead:string = this.getMobileHead();
		return (null == mobileHead || "" == mobileHead)?true:false;
	}
	public isMobileHeadNotSame(target:string):boolean {

		// let isDebug:boolean = true;
		let isDebug:boolean = false;
		if(isDebug) console.log("my-mobile / isMobileHeadNotSame / init");

		return !this.isMobileHeadSame(target);
	}
	public isMobileHeadSame(target:string):boolean {

		// let isDebug:boolean = true;
		let isDebug:boolean = false;
		if(isDebug) console.log("my-mobile / isMobileHeadSame / init");

		if(null == target || "" === target) {
			return false;
		}
		let mobileHead:string = this.getMobileHead();
		return (mobileHead === target)?true:false;
	}

	// BODY
	public getMobileBody():string {

		// let isDebug:boolean = true;
		let isDebug:boolean = false;
		if(isDebug) console.log("my-mobile / getMobileBody / init");

		let mobileArr:string[] = this.getMobileArr();
		return mobileArr[1];
	}
	public getMobileWithNewBody(newBody:string):string {

		// let isDebug:boolean = true;
		let isDebug:boolean = false;
		if(isDebug) console.log("my-mobile / getMobileWithNewBody / init");

		if(null == newBody || "" == newBody) {
			return this.mobileDigits;
		}

		let mobileArr:string[] = this.getMobileArr();
		let newMobileDigits:string = `${mobileArr[0]}-${newBody}-${mobileArr[2]}`;

		this.update(newMobileDigits);

		return newMobileDigits;
	}	
	public isMobileBodyNotEmpty():boolean {

		// let isDebug:boolean = true;
		let isDebug:boolean = false;
		if(isDebug) console.log("my-mobile / isMobileBodyNotEmpty / init");

		return !this.isMobileBodyEmpty();
	}
	public isMobileBodyEmpty():boolean {

		// let isDebug:boolean = true;
		let isDebug:boolean = false;
		if(isDebug) console.log("my-mobile / isMobileBodyEmpty / init");

		let mobileBody:string = this.getMobileBody();
		return (null == mobileBody || "" == mobileBody)?true:false;
	}
	public isMobileBodyNotSame(target:string):boolean {

		// let isDebug:boolean = true;
		let isDebug:boolean = false;
		if(isDebug) console.log("my-mobile / isMobileBodyNotSame / init");

		return !this.isMobileBodySame(target);
	}
	public isMobileBodySame(target:string):boolean {

		// let isDebug:boolean = true;
		let isDebug:boolean = false;
		if(isDebug) console.log("my-mobile / isMobileBodySame / init");

		if(null == target || "" === target) {
			return false;
		}
		let mobileBody:string = this.getMobileBody();
		return (mobileBody === target)?true:false;
	}

	// TAIL
	public getMobileTail():string {

		// let isDebug:boolean = true;
		let isDebug:boolean = false;
		if(isDebug) console.log("my-mobile / getMobileTail / init");

		let mobileArr:string[] = this.getMobileArr();
		return mobileArr[2];
	}
	public getMobileWithNewTail(newTail:string):string {

		// let isDebug:boolean = true;
		let isDebug:boolean = false;
		if(isDebug) console.log("my-mobile / getMobileWithNewTail / init");

		if(null == newTail || "" == newTail) {
			return this.mobileDigits;
		}

		let mobileArr:string[] = this.getMobileArr();
		let newMobileDigits:string = `${mobileArr[0]}-${mobileArr[1]}-${newTail}`;

		this.update(newMobileDigits);

		return newMobileDigits;
	}	
	public isMobileTailNotEmpty():boolean {

		// let isDebug:boolean = true;
		let isDebug:boolean = false;
		if(isDebug) console.log("my-mobile / isMobileTailNotEmpty / init");

		return !this.isMobileTailEmpty();
	}
	public isMobileTailEmpty():boolean {

		// let isDebug:boolean = true;
		let isDebug:boolean = false;
		if(isDebug) console.log("my-mobile / isMobileTailEmpty / init");

		let mobileTail:string = this.getMobileTail();
		return (null == mobileTail || "" == mobileTail)?true:false;
	}
	public isMobileTailNotSame(target:string):boolean {

		// let isDebug:boolean = true;
		let isDebug:boolean = false;
		if(isDebug) console.log("my-mobile / isMobileTailNotSame / init");

		return !this.isMobileTailSame(target);
	}
	public isMobileTailSame(target:string):boolean {

		// let isDebug:boolean = true;
		let isDebug:boolean = false;
		if(isDebug) console.log("my-mobile / isMobileTailSame / init");

		if(null == target || "" === target) {
			return false;
		}
		let mobileTail:string = this.getMobileTail();
		return (mobileTail === target)?true:false;
	} // end method

} // end class