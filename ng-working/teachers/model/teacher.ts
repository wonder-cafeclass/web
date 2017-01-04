import { HelperMyArray }            from '../../util/helper/my-array';
import { HelperMyIs }               from '../../util/helper/my-is';
import { HelperMyTime }             from '../../util/helper/my-time';
import { HelperMyFormat }           from '../../util/helper/my-format';
import { HelperMyMobile } 			from '../../util/helper/my-mobile';
import { HelperMyBirthday } 		from '../../util/helper/my-birthday';

export class Teacher {

	public id:number=-1;
	public user_id:number=-1;
	public nickname:string="";
	public name:string="";
	public gender:string="";
	public gender_readable:string="";
	public birthday:string=""; 
	public thumbnail:string="";
	public thumbnail_url:string=""; // @ Deprecated
	public status:string="";
	public mobile:string="";
	public email:string="";
    public resume:string="";
    public resume_arr:string[]=[];
    public greeting:string="";
	public memo:string="";
	public date_created:string="";
	public date_updated:string="";

	private delimiter:string="|||";

    private myArray:HelperMyArray=null;
    private myIs:HelperMyIs=null;
    private myTime:HelperMyTime=null;
    private myFormat:HelperMyFormat=null;
    private myMobile:HelperMyMobile=null;
    private myBirthday:HelperMyBirthday=null;

	constructor() {
        this.myArray = new HelperMyArray();
        this.myIs = new HelperMyIs();
        this.myTime = new HelperMyTime();
        this.myFormat = new HelperMyFormat();
        this.myMobile = new HelperMyMobile();
        this.myBirthday = new HelperMyBirthday();
	} 

	set(	id:number,
			user_id:number,
			nickname:string,
			name:string,
			gender:string,
			birthday:string, 
			thumbnail:string,
			status:string,
			mobile:string,
			email:string,
			resume:string,
			greeting:string,
			memo:string,
			date_created:string,
			date_updated:string ):Teacher {

		this.id = id;
		this.user_id = user_id;
		this.nickname = nickname;
		this.name = name;
		this.gender = gender;
		this.setBirthday(birthday);
		this.thumbnail = thumbnail;
		this.status = status;
		this.setMobile(mobile);
		this.email = email;
		this.resume = resume;
		this.greeting = greeting;
		this.memo = memo;
		this.date_created = date_created;
		this.date_updated = date_updated;

		return this;

	} // end method

	setMobile(mobile:string):void {
		this.mobile = mobile;
		this.myMobile.set(mobile);
	}

	setBirthday(birthday:string):void {
		this.birthday = birthday;
		this.myBirthday.set(birthday);
	}

	getResumeArr():string[] {

		if(null == this.resume || "" === this.resume) {
			return [];
		}

		return this.resume.split(this.delimiter);
	}

	setResume(resume:string):void {

		if(null == resume || "" === resume) {
			return;
		}

		this.resume = resume;
		this.resume_arr = resume.split(this.delimiter);

	}

	setResumeArr(resumeArr:string[]):void {

		if(this.myArray.isNotOK(resumeArr)) {
			return;
		}

		this.resume_arr = resumeArr;
		this.resume = resumeArr.join(this.delimiter);

	} // end if

	setGreeting(greeting:string):void {

		if(null == greeting || "" === greeting) {
			console.log("getGreetingOnHTMLView / 중단 / greeting is not valid");
		}

		let greetingBR:string = this.myFormat.nextlineToBR(greeting);

		this.greeting = greetingBR;

	} // end method

	// @ Desc : HTML 뷰에 표시될 문자열 배열로 인사말을 가져옵니다. <BR> 태그 기준으로 배열로 변경됩니다.
	getGreetingArr():string[] {
		return this.myFormat.splitWithBR(this.greeting);
	}

	// @ Desc : HTML 뷰에 표시될 문자열로 인사말을 가져옵니다. 줄바꿈이 <BR> 태그로 바뀝니다.
	getGreetingOnHTMLView():string {

		if(null == this.greeting || "" === this.greeting) {
			console.log("getGreetingOnHTMLView / 중단 / this.greeting is not valid");
			return "";
		}

		let greetingBR:string = this.myFormat.nextlineToBR(this.greeting);

		return greetingBR;
		
	} // end method
	// @ Desc : HTML Textarea 뷰에 표시될 줄바꿈 <br> 태그를 \n 으로 바꿔 줍니다.
	getGreetingOnTextarea():string {

		if(null == this.greeting || "" === this.greeting) {
			console.log("getGreetingOnTextarea / 중단 / this.greeting is not valid");
			return "";
		}

		let greetingNextline:string = this.myFormat.brToNextline(this.greeting);

		return greetingNextline;
	} // end method

    copy():Teacher {

        return this.myIs.copy(
            // src:any
            this, 
            // copy:any
            new Teacher()
        );

    } // end method

    setJSON(json):Teacher {

        // let isDebug:boolean = true;
        let isDebug:boolean = false;
        if(isDebug) console.log("teacher / setJSON / init");

        if(null == json) {
        	return null;
        }

        if(isDebug) console.log("teacher / setJSON / json : ",json);

        let teacher:Teacher = this._setJSON(json);

        if(isDebug) console.log("teacher / setJSON / teacher : ",teacher);

        // json 자동 설정 이후의 추가 작업을 여기서 합니다.
        teacher.setMobile(teacher.mobile);
        teacher.setBirthday(teacher.birthday);
        teacher.setResume(teacher.resume);

        return teacher;

    } // end method

    private _setJSON(json):Teacher {

        return this.myIs.copyFromJSON(
            // target:any,
            this,
            // json
            json
        );

    } // end method 

	// Mobile Methods - INIT
	getMobileArr() :string[] {
		return this.myMobile.getMobileArr();
	} 
	// Head
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
	// Body
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
	// Tail
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
	// Year
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
	// Month
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
	// Day
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

		if(this.birthday !== teacher.birthday) {
			return false;
		}

		if(this.thumbnail !== teacher.thumbnail) {
			return false;
		}

		if(this.mobile !== teacher.mobile) {
			return false;
		}

		if(this.resume !== teacher.resume) {
			return false;
		}

		if(this.greeting !== teacher.greeting) {
			return false;
		} // end if

		return true;
	}	       

}