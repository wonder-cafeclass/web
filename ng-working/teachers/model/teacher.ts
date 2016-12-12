export class Teacher {
	constructor(
		public id:number,
		public user_id:number,
		public nickname:string,
		public name:string,
		public gender:string,
		public resume:string,
		public greeting:string,
		public birthday:string, 
		public thumbnail:string,
		public status:string,
		public permission:string,
		public mobile:string,
		public email:string,
		public date_created:string,
		public date_updated:string
	) {}  

	getMobileArr() :string[] {

		let isDebug:boolean = true;
		// let isDebug:boolean = false;
		if(isDebug) console.log("teacher.model / getMobileArr / init");

		let mobileArr:string[] = this.mobile.split("-");
		let mobileHead:string = "";
		let mobileBody:string = "";
		let mobileTail:string = "";
		if(isDebug) console.log("teacher.model / getMobileArr / mobileArr : ",mobileArr);
		if(null != mobileArr && 3 == mobileArr.length) {
		  mobileHead = mobileArr[0];
		  mobileBody = mobileArr[1];
		  mobileTail = mobileArr[2];
		}

		return [mobileHead, mobileBody, mobileTail];

	}   

	getMobileHead() :string {
		let mobileArr:string[] = this.getMobileArr();
		return mobileArr[0];
	}
	isSameMobileHead(target:string) :boolean {
		let mobileHead:string = this.getMobileHead();
		if(null == mobileHead || "" === mobileHead) {
			return false;
		}
		return (mobileHead === target)?true:false;
	}

	getMobileBody() :string {
		let mobileArr:string[] = this.getMobileArr();
		return mobileArr[1];
	}
	isSameMobileBody(target:string) :boolean {
		let mobileBody:string = this.getMobileBody();
		if(null == mobileBody || "" === mobileBody) {
			return false;
		}
		return (mobileBody === target)?true:false;
	}

	getMobileTail() :string {
		let mobileArr:string[] = this.getMobileArr();
		return mobileArr[2];
	}
	isSameMobileTail(target:string) :boolean {
		let mobileTail:string = this.getMobileTail();
		if(null == mobileTail || "" === mobileTail) {
			return false;
		}
		return (mobileTail === target)?true:false;
	}



	getBirthdayArr() :string[] {

		let isDebug:boolean = true;
		// let isDebug:boolean = false;
		if(isDebug) console.log("teacher.model / getBirthdayArr / init");

		let birthdayArr:string[] = this.birthday.split("-");
		let birthYear:string = "";
		let birthMonth:string = "";
		let birthDay:string = "";
		if(isDebug) console.log("teacher.model / getBirthdayArr / birthdayArr : ",birthdayArr);
		if(null != birthdayArr && 3 == birthdayArr.length) {
		  birthYear = birthdayArr[0];
		  birthMonth = birthdayArr[1];
		  birthDay = birthdayArr[2];
		}

		return [birthYear, birthMonth, birthDay];

	}

	getBirthYear() :string {
		let birthdayArr:string[] = this.getBirthdayArr();
		return birthdayArr[0];
	}
	isSameBirthYear(target:string) :boolean {
		let birthdayHead:string = this.getBirthYear();
		if(null == birthdayHead || "" === birthdayHead) {
			return false;
		}
		return (birthdayHead === target)?true:false;
	}

	getBirthMonth() :string {
		let birthdayArr:string[] = this.getBirthdayArr();
		return birthdayArr[1];
	}
	isSameBirthMonth(target:string) :boolean {
		let birthdayBody:string = this.getBirthMonth();
		if(null == birthdayBody || "" === birthdayBody) {
			return false;
		}
		return (birthdayBody === target)?true:false;
	}

	getBirthDay() :string {
		let birthdayArr:string[] = this.getBirthdayArr();
		return birthdayArr[2];
	}
	isSameBirthDay(target:string) :boolean {
		let birthdayTail:string = this.getBirthDay();
		if(null == birthdayTail || "" === birthdayTail) {
			return false;
		}
		return (birthdayTail === target)?true:false;
	}


	updateWithJSON(userJSON) :void {

		let isDebug:boolean = true;
		// let isDebug:boolean = false;
		if(isDebug) console.log("teacher.model / updateWithJson / init");

		if(null == userJSON) {
			if(isDebug) console.log("teacher.model / updateWithJson / 중단 / userJSON is not valid!");
			return;
		}

		this.id = +userJSON["id"];
		this.nickname = userJSON["nickname"];
		this.name = userJSON["name"];
		this.gender = userJSON["gender"];
		this.birthday = userJSON["birthday"];
		this.thumbnail = userJSON["thumbnail"];
		this.status = userJSON["status"];
		this.permission = userJSON["permission"];
		this.mobile = userJSON["mobile"];
		this.email = userJSON["email"];
		this.date_created = userJSON["date_created"];
		this.date_updated = userJSON["date_updated"];
	
	} 	  
}