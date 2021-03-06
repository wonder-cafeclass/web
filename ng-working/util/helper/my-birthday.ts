/*
*	@ Desc : 생일 관련 처리 로직. ex) 1990-01-21
*/
export class HelperMyBirthday {

	constructor() {}

	private birthdayStr:string
	private head:string="";
	private body:string="";
	private tail:string="";

	public set(birthdayStr:string) :void {

		if( null == birthdayStr || "" === birthdayStr ) {
			return;
		}

		this.update(birthdayStr);

	} // end method

	private update(birthdayStr:string) :void {

		// let isDebug:boolean = true;
		let isDebug:boolean = false;
		if(isDebug) console.log("helper.birth / update / init");

		if(null == birthdayStr || "" == birthdayStr) {
			return;
		}

		if(isDebug) console.log("helper.birth / update / BEFORE / birthdayStr : ",birthdayStr);
		this.birthdayStr = birthdayStr;
		if(isDebug) console.log("helper.birth / update / AFTER / birthdayStr : ",birthdayStr);

		// 초기화.
		this.head = "";
		this.body = "";
		this.tail = "";

		if(isDebug) console.log("helper.birth / update / this.birthdayStr : ",this.birthdayStr);

		let birthArr:string[] = this.birthdayStr.split("-");
		if(isDebug) console.log("helper.birth / update / birthArr : ",birthArr);
		if(null != birthArr && 3 == birthArr.length) {
			this.head = birthArr[0];
			this.body = birthArr[1];
			this.tail = birthArr[2];
		}		
	}

	public getBirthdayArr() :string[] {
		// let isDebug:boolean = true;
		let isDebug:boolean = false;
		if(isDebug) console.log("helper.birth / getBirthdayArr / init");

		return [this.head, this.body, this.tail];
	}


	// HEAD
	public getBirthYear():string {

		// let isDebug:boolean = true;
		let isDebug:boolean = false;
		if(isDebug) console.log("helper.birth / getBirthYear / init");

		let birthArr:string[] = this.getBirthdayArr();
		return birthArr[0];
	}
	public getBirthdayWithNewBirthYear(newHead:string):string {

		// let isDebug:boolean = true;
		let isDebug:boolean = false;
		if(isDebug) console.log("helper.birth / getBirthdayWithNewBirthYear / init");

		if(null == newHead || "" == newHead) {
			return this.birthdayStr;
		}

		if(isDebug) console.log("helper.birth / getBirthdayWithNewBirthYear / this.birthdayStr : ",this.birthdayStr);

		let birthArr:string[] = this.getBirthdayArr();
		let newBirthdayDigits:string = `${newHead}-${birthArr[1]}-${birthArr[2]}`;

		if(isDebug) console.log("helper.birth / getBirthdayWithNewBirthYear / newBirthdayDigits : ",newBirthdayDigits);

		this.update(newBirthdayDigits);

		return newBirthdayDigits;
	}
	public isBirthYearNotEmpty():boolean {

		// let isDebug:boolean = true;
		let isDebug:boolean = false;
		if(isDebug) console.log("helper.birth / isBirthYearNotEmpty / init");

		return !this.isBirthYearEmpty();
	}
	public isBirthYearEmpty():boolean {

		// let isDebug:boolean = true;
		let isDebug:boolean = false;
		if(isDebug) console.log("helper.birth / isBirthYearEmpty / init");

		let birthYear:string = this.getBirthYear();
		return (null == birthYear || "" == birthYear)?true:false;
	}
	public isBirthYearNotSame(target:string):boolean {

		// let isDebug:boolean = true;
		let isDebug:boolean = false;
		if(isDebug) console.log("helper.birth / isBirthYearNotSame / init");

		return !this.isBirthYearSame(target);
	}
	public isBirthYearSame(target:string):boolean {

		// let isDebug:boolean = true;
		let isDebug:boolean = false;
		if(isDebug) console.log("helper.birth / isBirthYearSame / init");

		if(null == target || "" === target) {
			return false;
		}
		let birthYear:string = this.getBirthYear();
		return (birthYear === target)?true:false;
	}

	// BODY
	public getBirthMonth():string {

		// let isDebug:boolean = true;
		let isDebug:boolean = false;
		if(isDebug) console.log("helper.birth / getBirthMonth / init");

		let birthArr:string[] = this.getBirthdayArr();
		return birthArr[1];
	}
	public getBirthdayWithNewBirthMonth(newBody:string):string {

		// let isDebug:boolean = true;
		let isDebug:boolean = false;
		if(isDebug) console.log("helper.birth / getBirthdayWithNewBirthMonth / init");

		if(null == newBody || "" == newBody) {
			return this.birthdayStr;
		}

		if(isDebug) console.log("helper.birth / getBirthdayWithNewBirthMonth / this.birthdayStr : ",this.birthdayStr);

		let birthArr:string[] = this.getBirthdayArr();
		let newBirthdayDigits:string = `${birthArr[0]}-${newBody}-${birthArr[2]}`;

		if(isDebug) console.log("helper.birth / getBirthdayWithNewBirthMonth / newBirthdayDigits : ",newBirthdayDigits);

		this.update(newBirthdayDigits);

		return newBirthdayDigits;
	}	
	public isBirthMonthNotEmpty():boolean {

		// let isDebug:boolean = true;
		let isDebug:boolean = false;
		if(isDebug) console.log("helper.birth / isBirthMonthNotEmpty / init");

		return !this.isBirthMonthEmpty();
	}
	public isBirthMonthEmpty():boolean {

		// let isDebug:boolean = true;
		let isDebug:boolean = false;
		if(isDebug) console.log("helper.birth / isBirthMonthEmpty / init");

		let birthMonth:string = this.getBirthMonth();
		return (null == birthMonth || "" == birthMonth)?true:false;
	}
	public isBirthMonthNotSame(target:string):boolean {

		// let isDebug:boolean = true;
		let isDebug:boolean = false;
		if(isDebug) console.log("helper.birth / isBirthMonthNotSame / init");

		return !this.isBirthMonthSame(target);
	}
	public isBirthMonthSame(target:string):boolean {

		// let isDebug:boolean = true;
		let isDebug:boolean = false;
		if(isDebug) console.log("helper.birth / isBirthMonthSame / init");

		if(null == target || "" === target) {
			return false;
		}
		let birthMonth:string = this.getBirthMonth();
		return (birthMonth === target)?true:false;
	}

	// TAIL
	public getBirthDay():string {

		// let isDebug:boolean = true;
		let isDebug:boolean = false;
		if(isDebug) console.log("helper.birth / getBirthDay / init");

		let birthArr:string[] = this.getBirthdayArr();
		return birthArr[2];
	}
	public getBirthdayWithNewBirthDay(newTail:string):string {

		// let isDebug:boolean = true;
		let isDebug:boolean = false;
		if(isDebug) console.log("helper.birth / getBirthdayWithNewBirthDay / init");

		if(null == newTail || "" == newTail) {
			return this.birthdayStr;
		}

		if(isDebug) console.log("helper.birth / getBirthdayWithNewBirthDay / this.birthdayStr : ",this.birthdayStr);

		let birthArr:string[] = this.getBirthdayArr();
		let newBirthdayDigits:string = `${birthArr[0]}-${birthArr[1]}-${newTail}`;

		if(isDebug) console.log("helper.birth / getBirthdayWithNewBirthDay / newBirthdayDigits : ",newBirthdayDigits);

		this.update(newBirthdayDigits);

		return newBirthdayDigits;
	}	
	public isBirthDayNotEmpty():boolean {

		// let isDebug:boolean = true;
		let isDebug:boolean = false;
		if(isDebug) console.log("helper.birth / isBirthDayNotEmpty / init");

		return !this.isBirthDayEmpty();
	}
	public isBirthDayEmpty():boolean {

		// let isDebug:boolean = true;
		let isDebug:boolean = false;
		if(isDebug) console.log("helper.birth / isBirthDayEmpty / init");

		let birthDay:string = this.getBirthDay();
		return (null == birthDay || "" == birthDay)?true:false;
	}
	public isBirthDayNotSame(target:string):boolean {

		// let isDebug:boolean = true;
		let isDebug:boolean = false;
		if(isDebug) console.log("helper.birth / isBirthDayNotSame / init");

		return !this.isBirthDaySame(target);
	}
	public isBirthDaySame(target:string):boolean {

		// let isDebug:boolean = true;
		let isDebug:boolean = false;
		if(isDebug) console.log("helper.birth / isBirthDaySame / init");

		if(null == target || "" === target) {
			return false;
		}
		let birthDay:string = this.getBirthDay();
		return (birthDay === target)?true:false;
	} // end method

} // end class