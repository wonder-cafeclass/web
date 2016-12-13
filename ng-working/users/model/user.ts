import { HelperMobile } 	from '../../util/helper/mobile';
import { HelperBirthday } 	from '../../util/helper/birthday';

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
	) {
		// 휴대 전화번호를 관리하는 객체를 만듭니다.
		this.helperMobile = new HelperMobile(this.mobile);
		// 생일을 관리하는 객체를 만듭니다.
		this.helperBirthday = new HelperBirthday(this.birthday);
	}

	public password:string;

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

	


	// Platforms - INIT
	isFacebookUser() :boolean {
		return (null != this.facebook_id && "" != this.facebook_id)?true:false;
	}  
	isKakaoUser() :boolean {
		return (null != this.kakao_id && "" != this.kakao_id)?true:false;
	}  
	isNaverUser() :boolean {
		return (null != this.naver_id && "" != this.naver_id)?true:false;
	}  
	isGoogleUser() :boolean {
		return (null != this.google_id && "" != this.google_id)?true:false;
	} 
	// Platforms - DONE 




	// Mobile Methods - INIT
	private helperMobile:HelperMobile;
	getMobileArr() :string[] {
		return this.helperMobile.getMobileArr();
	} 

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





	updateWithJSON(userJSON) :void {

		// let isDebug:boolean = true;
		let isDebug:boolean = false;
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

	copy() :User {
		return new User(
			// public id:number,
			this.id,
			// public nickname:string,
			this.nickname,
			// public name:string,
			this.name,
			// public gender:string,
			this.gender,
			// public birthday:string, 
			this.birthday,
			// public thumbnail:string,
			this.thumbnail,
			// public status:string,
			this.status,
			// public permission:string,
			this.permission,
			// public kakao_id:string,
			this.kakao_id,
			// public naver_id:string,
			this.naver_id,
			// public facebook_id:string,
			this.facebook_id,
			// public google_id:string,
			this.google_id,
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