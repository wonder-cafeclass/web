export class User {
	constructor(
		public id:number,
		public nickname:string,
		public name:string,
		public gender:string,
		public birthday:string, 
		public thumbnail:string,
		public status:string,
		public permission:string,
		public kakao_id:string,
		public naver_id:string,
		public facebook_id:string,
		public google_id:string,
		public mobile:string,
		public email:string,
		public date_created:string,
		public date_updated:string
	) {}  

	getMobileArr() :string[] {

		let isDebug:boolean = true;
		// let isDebug:boolean = false;
		if(isDebug) console.log("user.model / getMobileArr / init");

		let mobileArr:string[] = this.mobile.split("-");
		let mobileHead:string = "";
		let mobileBody:string = "";
		let mobileTail:string = "";
		if(isDebug) console.log("user.model / getMobileArr / mobileArr : ",mobileArr);
		if(null != mobileArr && 3 == mobileArr.length) {
		  mobileHead = mobileArr[0];
		  mobileBody = mobileArr[1];
		  mobileTail = mobileArr[2];
		}

		return [mobileHead, mobileBody, mobileTail];

	}   

	getBirthdayArr() :string[] {

		let isDebug:boolean = true;
		// let isDebug:boolean = false;
		if(isDebug) console.log("user.model / getBirthdayArr / init");

		let birthdayArr:string[] = this.birthday.split("-");
		let birthYear:string = "";
		let birthMonth:string = "";
		let birthDay:string = "";
		if(isDebug) console.log("user.model / getBirthdayArr / birthdayArr : ",birthdayArr);
		if(null != birthdayArr && 3 == birthdayArr.length) {
		  birthYear = birthdayArr[0];
		  birthMonth = birthdayArr[1];
		  birthDay = birthdayArr[2];
		}

		return [birthYear, birthMonth, birthDay];

	}

	updateWithJSON(userJSON) :void {

		let isDebug:boolean = true;
		// let isDebug:boolean = false;
		if(isDebug) console.log("user.model / updateWithJson / init");

		if(null == userJSON) {
			if(isDebug) console.log("user.model / updateWithJson / 중단 / userJSON is not valid!");
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
		this.kakao_id = userJSON["kakao_id"];
		this.naver_id = userJSON["naver_id"];
		this.facebook_id = userJSON["facebook_id"];
		this.google_id = userJSON["google_id"];
		this.mobile = userJSON["mobile"];
		this.email = userJSON["email"];
		this.date_created = userJSON["date_created"];
		this.date_updated = userJSON["date_updated"];
	
	} 	  
}