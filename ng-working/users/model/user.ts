import { HelperMobile } 	from '../../util/helper/mobile';
import { HelperBirthday } 	from '../../util/helper/birthday';

import { HelperMyIs } 	from '../../util/helper/my-is';


import { Teacher } 			from '../../teachers/model/teacher';

export class User {

	public id:number=-1;
	public nickname:string="";
	public name:string="";
	public gender:string="";
	public birthday:string="";
	public thumbnail:string="";
	public status:string="";
	public permission:string="";
	public kakao_id:string="";
	public naver_id:string="";
	public facebook_id:string="";
	public google_id:string="";
	public mobile:string="";
	public email:string="";
	public date_created:string="";
	public date_updated:string="";

	private helperMobile:HelperMobile=null;
	private helperBirthday:HelperBirthday=null;
	private myIs:HelperMyIs=null;

	constructor() {
		// 휴대 전화번호를 관리하는 객체를 만듭니다.
		this.helperMobile = new HelperMobile(this.mobile);
		// 생일을 관리하는 객체를 만듭니다.
		this.helperBirthday = new HelperBirthday(this.birthday);

		this.myIs = new HelperMyIs();
	}

	public password:string;
	private isAdmin:boolean=false;
	private teacher:Teacher;

	set(id:number,
		nickname:string,
		name:string,
		gender:string,
		birthday:string, 
		thumbnail:string,
		status:string,
		permission:string,
		kakao_id:string,
		naver_id:string,
		facebook_id:string,
		google_id:string,
		mobile:string,
		email:string,
		date_created:string,
		date_updated:string	) {

		this.id = id;
		this.nickname = nickname;
		this.name = name;
		this.gender = gender;
		this.birthday = birthday;
		this.thumbnail = thumbnail;
		this.status = status;
		this.permission = permission;
		this.kakao_id = kakao_id;
		this.naver_id = naver_id;
		this.facebook_id = facebook_id;
		this.google_id = google_id;
		this.mobile = mobile;
		this.email = email;
		this.date_created = date_created;
		this.date_updated = date_updated;

		return this;

	} // end method

    setJSON(json):User {

        // let isDebug:boolean = true;
        let isDebug:boolean = false;
        if(isDebug) console.log("klass / setJSON / init");
        if(isDebug) console.log("klass / setJSON / json : ",json);

        let user:User = this._setJSON(json);

        if(isDebug) console.log("klass / setJSON / user : ",user);

        // json 자동 설정 이후의 추가 작업을 여기서 합니다.

        return user;

    } // end method	


    private _setJSON(json):User {

        return this.myIs.copyFromJSON(
            // target:any,
            this,
            // json
            json
        );

    } // end method	

	setIsAdmin(isAdmin:boolean) :void {
		if(null == isAdmin) {
			return;
		}
		this.isAdmin = isAdmin;
	}
	getIsAdmin() :boolean {
		return this.isAdmin;
	}

	isTeacher():boolean {
		return (null != this.teacher)?true:false;
	}
	setTeacher(teacher:Teacher):void {
		if(null == teacher) {
			return;
		}
		this.teacher = teacher;
	}
	getTeacherId():number {
		if(!this.isTeacher()) {
			return -1;
		}

		return +this.teacher.id;
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

	copy():User {

        return this.myIs.copy(
            // src:any
            this, 
            // copy:any
            new User()
        );

    } // end method

	// @ 사용자가 변경 가능한 값들을 기준으로 비교, 결과를 알려준다.
	isNotSame(user:User) :boolean {
		return !this.isSame(user);
	}
	isSame(user:User) :boolean {

		if(this.name !== user.name) {
			return false;
		}

		if(this.email !== user.email) {
			return false;
		}

		if(this.nickname !== user.nickname) {
			return false;
		}

		if(this.kakao_id !== user.kakao_id) {
			return false;
		}

		if(this.naver_id !== user.naver_id) {
			return false;
		}

		if(this.facebook_id !== user.facebook_id) {
			return false;
		}

		if(this.google_id !== user.google_id) {
			return false;
		}

		if(this.gender !== user.gender) {
			return false;
		}

		if(this.birthday !== user.birthday) {
			return false;
		}

		if(this.thumbnail !== user.thumbnail) {
			return false;
		}

		if(this.mobile !== user.mobile) {
			return false;
		}

		return true;
	}	
}