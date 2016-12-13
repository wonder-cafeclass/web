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

	isNotSameName(name:string) :boolean {
		return !this.isSameName(name);
	}
	isSameName(name:string) :boolean {
		if(null != name && name === this.name) {
			return true;
		}
		return false;
	} 
	isNotSameNickname(nickname:string) :boolean {
		return !this.isSameNickname(nickname);
	}
	isSameNickname(nickname) :boolean {
		if(null != nickname && nickname === this.nickname) {
			return true;
		}
		return false;
	} 
	isNotSameGender(gender:string) :boolean {
		return !this.isSameGender(gender);
	}
	isSameGender(gender) :boolean {
		if(null != gender && gender === this.gender) {
			return true;
		}
		return false;
	}
	isNotSameResume(resume:string) :boolean {
		return !this.isSameResume(resume);
	}
	isSameResume(resume) :boolean {
		if(null != resume && resume === this.resume) {
			return true;
		}
		return false;
	} 
	isNotSameGreeting(greeting:string) :boolean {
		return !this.isSameGreeting(greeting);
	}
	isSameGreeting(greeting) :boolean {
		if(null != greeting && greeting === this.greeting) {
			return true;
		}
		return false;
	}
	isNotSameThumbnail(thumbnail:string) :boolean {
		return !this.isSameThumbnail(thumbnail);
	}
	isSameThumbnail(thumbnail) :boolean {
		if(null != thumbnail && thumbnail === this.thumbnail) {
			return true;
		}
		return false;
	}	 


	getMobileArr() :string[] {

		// let isDebug:boolean = true;
		let isDebug:boolean = false;
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
	isNotSameMobileHead(target:string) :boolean {
		return !this.isSameMobileHead(target);
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
	isNotSameMobileBody(target:string) :boolean {
		return !this.isSameMobileBody(target);
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
	isNotSameMobileTail(target:string) :boolean {
		return !this.isSameMobileTail(target);
	}
	isSameMobileTail(target:string) :boolean {
		let mobileTail:string = this.getMobileTail();
		if(null == mobileTail || "" === mobileTail) {
			return false;
		}
		return (mobileTail === target)?true:false;
	}



	getBirthdayArr() :string[] {

		// let isDebug:boolean = true;
		let isDebug:boolean = false;
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
	isNotSameBirthYear(target:string) :boolean {
		return !this.isSameBirthYear(target);
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
	isNotSameBirthMonth(target:string) :boolean {
		return !this.isSameBirthMonth(target);
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
	isNotSameBirthDay(target:string) :boolean {
		return !this.isSameBirthDay(target);
	}
	isSameBirthDay(target:string) :boolean {
		let birthdayTail:string = this.getBirthDay();
		if(null == birthdayTail || "" === birthdayTail) {
			return false;
		}
		return (birthdayTail === target)?true:false;
	}


	updateWithJSON(userJSON) :void {

		// let isDebug:boolean = true;
		let isDebug:boolean = false;
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

	copy() :Teacher {
		return new Teacher(
			// public id:number,
			this.id,
			// public user_id:number,
			this.user_id,
			// public nickname:string,
			this.nickname,
			// public name:string,
			this.name,
			// public gender:string,
			this.gender,
			// public resume:string,
			this.resume,
			// public greeting:string,
			this.greeting,
			// public birthday:string, 
			this.birthday,
			// public thumbnail:string,
			this.thumbnail,
			// public status:string,
			this.status,
			// public permission:string,
			this.permission,
			// public mobile:string,
			this.mobile,
			// public email:string,
			this.email,
			// public date_created:string,
			this.date_created,
			// public date_updated:string			
			this.date_updated
		);
	}	  
}