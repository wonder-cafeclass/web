
import { HelperMyIs } 		from '../../util/helper/my-is';
import { HelperMyMobile } 	from '../../util/helper/my-mobile';
import { HelperMyBirthday } from '../../util/helper/my-birthday';

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

	private myMobile:HelperMyMobile=null;
	private myBirthday:HelperMyBirthday=null;
	private myIs:HelperMyIs=null;

	public isDuplicatedMobile:boolean = false;
	public isDuplicatedEmail:boolean = false;

	constructor() {
		this.myMobile = new HelperMyMobile();
		this.myBirthday = new HelperMyBirthday();
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

		this.setBirthday(birthday);

		this.thumbnail = thumbnail;
		this.status = status;
		this.permission = permission;
		this.kakao_id = kakao_id;
		this.naver_id = naver_id;
		this.facebook_id = facebook_id;
		this.google_id = google_id;

		this.setMobile(mobile);

		this.email = email;
		this.date_created = date_created;
		this.date_updated = date_updated;

		return this;

	} // end method

	setMobile(mobile:string):void {

		this.mobile = mobile;
		this.myBirthday.set(this.birthday);

	}
	setBirthday(birthday:string):void {

		this.birthday = birthday;
		this.myMobile.set(this.mobile);
		
	}

    setJSON(json):User {

    	if(null == json) {
    		return null;
    	}

        // let isDebug:boolean = true;
        let isDebug:boolean = false;
        if(isDebug) console.log("klass / setJSON / init");
        if(isDebug) console.log("klass / setJSON / json : ",json);

        let user:User = this._setJSON(json);
        user.setMobile(user.mobile);
        user.setBirthday(user.birthday);

        if(null != json.teacher) {
        	let teacher:Teacher = new Teacher().setJSON(json.teacher);
        	user.setTeacher(teacher);
        }

        if(isDebug) console.log("klass / setJSON / user : ",user);

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
	getTeacher():Teacher {
		return this.teacher;
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
	// @ Desc : 선생님으로 새롭게 등록하는 경우, 유저 정보에서 선생님 정보로 복사합니다.
	getNewTeacherFromUser():Teacher {

		let newTeacher:Teacher = null;
		if(null == this.teacher) {
			newTeacher = new Teacher();
		} else {
			newTeacher = this.teacher.copy();
		}

		newTeacher.user_id = this.id;
		newTeacher.email = this.email;
		newTeacher.name = this.name;
		newTeacher.nickname = this.nickname;
		newTeacher.greeting = "";
		newTeacher.resume = "";
		newTeacher.thumbnail = this.thumbnail;
		newTeacher.setMobile(this.mobile);
		newTeacher.gender = this.gender;
		newTeacher.setBirthday(this.birthday);

		return newTeacher;
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
	isPlatformUser():boolean {
		return (this.isFacebookUser() || this.isKakaoUser() || this.isGoogleUser() || this.isNaverUser())?true:false;
	}
	// Platforms - DONE 




	// Mobile Methods - INIT
	
	getMobileArr() :string[] {
		return this.myMobile.getMobileArr();
	} 

	setMobileHead(mobileHead:string) :void {
		this.mobile = this.myMobile.getMobileWithNewHead(mobileHead);
	}
	getMobileHead() :string {
		return this.myMobile.getMobileHead();
	}
	isMobileHeadEmpty() :boolean {
		return this.myMobile.isMobileHeadEmpty();
	}
	isNotSameMobileHead(target:string) :boolean {
		return this.myMobile.isMobileHeadNotSame(target);
	}
	isSameMobileHead(target:string) :boolean {
		return this.myMobile.isMobileHeadSame(target);
	}

	setMobileBody(mobileBody:string) :void {
		this.mobile = this.myMobile.getMobileWithNewBody(mobileBody);
	}
	getMobileBody() :string {
		return this.myMobile.getMobileBody();
	}
	isNotSameMobileBody(target:string) :boolean {
		return this.myMobile.isMobileBodyNotSame(target);
	}
	isSameMobileBody(target:string) :boolean {
		return this.myMobile.isMobileBodySame(target);
	}

	setMobileTail(mobileTail:string) :void {
		this.mobile = this.myMobile.getMobileWithNewTail(mobileTail);
	}
	getMobileTail() :string {
		return this.myMobile.getMobileTail();
	}
	isNotSameMobileTail(target:string) :boolean {
		return this.myMobile.isMobileTailNotSame(target);
	}
	isSameMobileTail(target:string) :boolean {
		return this.myMobile.isMobileTailSame(target);
	}
	// Mobile Methods - DONE


	// Birthday Methods - INIT
	getBirthdayArr() :string[] {
		return this.myBirthday.getBirthdayArr();
	}	

	setBirthYear(newBirthYear:string) :void {
		this.birthday = this.myBirthday.getBirthdayWithNewBirthYear(newBirthYear);
	}
	getBirthYear() :string {
		return this.myBirthday.getBirthYear();
	}
	isNotSameBirthYear(target:string) :boolean {
		return this.myBirthday.isBirthYearNotSame(target);
	}
	isSameBirthYear(target:string) :boolean {
		return this.myBirthday.isBirthYearSame(target);
	}

	setBirthMonth(newBirthMonth:string) :void {
		this.birthday = this.myBirthday.getBirthdayWithNewBirthMonth(newBirthMonth);
	}
	getBirthMonth() :string {
		return this.myBirthday.getBirthMonth();
	}
	isNotSameBirthMonth(target:string) :boolean {
		return this.myBirthday.isBirthMonthNotSame(target);
	}
	isSameBirthMonth(target:string) :boolean {
		return this.myBirthday.isBirthMonthSame(target);
	}

	setBirthDay(newBirthDay:string) :void {
		this.birthday = this.myBirthday.getBirthdayWithNewBirthDay(newBirthDay);
	}
	getBirthDay() :string {
		return this.myBirthday.getBirthDay();
	}
	isNotSameBirthDay(target:string) :boolean {
		return this.myBirthday.isBirthDayNotSame(target);
	}
	isSameBirthDay(target:string) :boolean {
		return this.myBirthday.isBirthDaySame(target);
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

	isNotOK() :boolean {
		return !this.isOK();
	}

	isOK() :boolean {

		if(null == this.name || "" === this.name) {
			return false;
		}
		if(null == this.email || "" === this.email) {
			return false;
		}
		if(this.isDuplicatedEmail) {
			return false;
		}
		if(null == this.nickname || "" === this.nickname) {
			return false;
		}
		if(null == this.gender || "" === this.gender) {
			return false;
		}
		if(null == this.thumbnail || "" === this.thumbnail) {
			return false;
		}
		if(null == this.mobile || "" === this.mobile) {
			return false;
		}
		if(this.isDuplicatedMobile) {
			return false;
		}

		return true;		

	} // end method
}