import { HelperMobile } from '../../util/helper/mobile';
import { HelperBirthday } 	from '../../util/helper/birthday';

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
	) {
		// 휴대 전화번호를 관리하는 객체를 만듭니다.
		this.helperMobile = new HelperMobile(this.mobile);
		// 생일을 관리하는 객체를 만듭니다.
		this.helperBirthday = new HelperBirthday(this.birthday);
	} 

	// Common Properties - INIT
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
	isEmptyThumbnail() :boolean {
		return (null == this.thumbnail || "" === this.thumbnail)?true:false;
	}
	// Common Properties - DONE



	// Mobile Methods - INIT
	private helperMobile:HelperMobile;
	getMobileArr() :string[] {
		return this.helperMobile.getMobileArr();
	} 
	// Head
	setMobileHead(mobileHead:string) :void {
		this.mobile = this.helperMobile.getMobileWithNewHead(mobileHead);
	}
	getMobileHead() :string {
		return this.helperMobile.getMobileHead();
	}
	isMobileHeadEmpty() :boolean {
		return this.helperMobile.isMobileHeadEmpty();
	}
	isNotSameMobileHead(target:string) :boolean {
		return this.helperMobile.isMobileHeadNotSame(target);
	}
	isSameMobileHead(target:string) :boolean {
		return this.helperMobile.isMobileHeadSame(target);
	}
	// Body
	setMobileBody(mobileBody:string) :void {
		this.mobile = this.helperMobile.getMobileWithNewBody(mobileBody);
	}
	getMobileBody() :string {
		return this.helperMobile.getMobileBody();
	}
	isNotSameMobileBody(target:string) :boolean {
		return this.helperMobile.isMobileBodyNotSame(target);
	}
	isSameMobileBody(target:string) :boolean {
		return this.helperMobile.isMobileBodySame(target);
	}
	// Tail
	setMobileTail(mobileTail:string) :void {
		this.mobile = this.helperMobile.getMobileWithNewTail(mobileTail);
	}
	getMobileTail() :string {
		return this.helperMobile.getMobileTail();
	}
	isNotSameMobileTail(target:string) :boolean {
		return this.helperMobile.isMobileTailNotSame(target);
	}
	isSameMobileTail(target:string) :boolean {
		return this.helperMobile.isMobileTailSame(target);
	}
	// Mobile Methods - DONE



	// Birthday Methods - INIT
	private helperBirthday:HelperBirthday;
	getBirthdayArr() :string[] {
		return this.helperBirthday.getBirthdayArr();
	}	
	// Year
	setBirthYear(newBirthYear:string) :void {
		this.birthday = this.helperBirthday.getBirthdayWithNewBirthYear(newBirthYear);
	}
	getBirthYear() :string {
		return this.helperBirthday.getBirthYear();
	}
	isNotSameBirthYear(target:string) :boolean {
		return this.helperBirthday.isBirthYearNotSame(target);
	}
	isSameBirthYear(target:string) :boolean {
		return this.helperBirthday.isBirthYearSame(target);
	}
	// Month
	setBirthMonth(newBirthMonth:string) :void {
		this.birthday = this.helperBirthday.getBirthdayWithNewBirthMonth(newBirthMonth);
	}
	getBirthMonth() :string {
		return this.helperBirthday.getBirthMonth();
	}
	isNotSameBirthMonth(target:string) :boolean {
		return this.helperBirthday.isBirthMonthNotSame(target);
	}
	isSameBirthMonth(target:string) :boolean {
		return this.helperBirthday.isBirthMonthSame(target);
	}
	// Day
	setBirthDay(newBirthDay:string) :void {
		this.birthday = this.helperBirthday.getBirthdayWithNewBirthDay(newBirthDay);
	}
	getBirthDay() :string {
		return this.helperBirthday.getBirthDay();
	}
	isNotSameBirthDay(target:string) :boolean {
		return this.helperBirthday.isBirthDayNotSame(target);
	}
	isSameBirthDay(target:string) :boolean {
		return this.helperBirthday.isBirthDaySame(target);
	}
	// Birthday Methods - DONE	



	updateWithJSON(teacherJSON) :void {

		// let isDebug:boolean = true;
		let isDebug:boolean = false;
		if(isDebug) console.log("teacher.model / updateWithJson / init");

		if(null == teacherJSON) {
			if(isDebug) console.log("teacher.model / updateWithJson / 중단 / teacherJSON is not valid!");
			return;
		}

		this.id = +teacherJSON["id"];
		this.nickname = teacherJSON["nickname"];
		this.resume = teacherJSON["resume"];
		this.greeting = teacherJSON["greeting"];
		this.name = teacherJSON["name"];
		this.gender = teacherJSON["gender"];
		this.birthday = teacherJSON["birthday"];
		this.thumbnail = teacherJSON["thumbnail"];
		this.status = teacherJSON["status"];
		this.permission = teacherJSON["permission"];
		this.mobile = teacherJSON["mobile"];
		this.email = teacherJSON["email"];
		this.date_created = teacherJSON["date_created"];
		this.date_updated = teacherJSON["date_updated"];
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

	// @ 사용자가 변경 가능한 값들을 기준으로 비교, 결과를 알려준다.
	isNotSame(teacher:Teacher) :boolean {
		return !this.isSame(teacher);
	}
	isSame(teacher:Teacher) :boolean {

		if(this.name !== teacher.name) {
			return false;
		}

		if(this.email !== teacher.email) {
			return false;
		}

		if(this.nickname !== teacher.nickname) {
			return false;
		}

		if(this.gender !== teacher.gender) {
			return false;
		}

		if(this.resume !== teacher.resume) {
			return false;
		}

		if(this.greeting !== teacher.greeting) {
			return false;
		}

		if(this.birthday !== teacher.birthday) {
			return false;
		}

		if(this.thumbnail !== teacher.thumbnail) {
			return false;
		}

		if(this.mobile !== teacher.mobile) {
			return false;
		}

		return true;
	}
}