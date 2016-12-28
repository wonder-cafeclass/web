// @ Deprecated - REMOVE ME
/*
import { HelperMyArray }            from '../../util/helper/my-array';
import { HelperMyIs }               from '../../util/helper/my-is';
import { HelperMyTime }             from '../../util/helper/my-time';
import { HelperMyFormat }           from '../../util/helper/my-format';
import { HelperMyMobile } 			from '../../util/helper/my-mobile';
import { HelperMyBirthday } 		from '../../util/helper/my-birthday';
*/

export class KlassTeacher {
/*
	public id:number=-1;
	public user_id:number=-1;
	public nickname:string="";
	public name:string="";
	public gender:string="";
	public birthday:string=""; 
	public thumbnail:string="";
	public thumbnail_url:string="";
	public status:string="";
	public mobile:string="";
	public email:string="";
    public resume:string="";
    public resume_arr:string[]=[];
    public greeting:string="";
    public greeting_arr:string[]=[];
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

	setMobile(mobile:string):void {
		this.mobile = mobile;
		this.myMobile.set(mobile);
	}

	getResumeArr():string[] {

		if(null == this.resume || "" === this.resume) {
			return [];
		}

		return this.resume.split(this.delimiter);
	}

	getGreetingArr():string[] {

		if(null == this.greeting || "" === this.greeting) {
			return [];
		}

		return this.greeting.split(this.delimiter);
	}

    copy():Klass {

        return this.myIs.copy(
            // src:any
            this, 
            // copy:any
            new Klass()
        );

    } // end method

    setJSON(json):Klass {

        // let isDebug:boolean = true;
        let isDebug:boolean = false;
        if(isDebug) console.log("klass-teacher / setJSON / init");

        if(isDebug) console.log("klass-teacher / setJSON / json : ",json);

        let klass:Klass = this._setJSON(json);

        if(isDebug) console.log("klass-teacher / setJSON / klass : ",klass);

        // json 자동 설정 이후의 추가 작업을 여기서 합니다.

        return klass;

    } // end method

    private _setJSON(json):Klass {

        return this.myIs.copyFromJSON(
            // target:any,
            this,
            // json
            json
        );

    } // end method 

	// Mobile Methods - INIT
	private myMobile:HelperMyMobile;
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
	private myBirthday:HelperMyBirthday;
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

    /*
	setJSON(json):KlassTeacher {

		if(null == json) {
			return this;
		}

		if(null != json["birthday"]) {
			this.birthday = json["birthday"];	
		}

		if(null != json["date_created"]) {
			this.date_created = json["date_created"];	
		}

		if(null != json["date_updated"]) {
			this.date_updated = json["date_updated"];	
		}
		
		if(null != json["email"]) {
			this.email = json["email"];	
		}

		if(null != json["gender"]) {
			this.gender = json["gender"];	
		}

		if(null != json["greeting"]) {
			this.greeting = json["greeting"];	
		}

		if(null != json["id"]) {
			this.id = parseInt(json["id"]);	
		}

		if(null != json["memo"]) {
			this.memo = json["memo"];	
		}

		if(null != json["mobile"]) {
			this.mobile = json["mobile"];	
		}

		if(null != json["name"]) {
			this.name = json["name"];	
		}

		if(null != json["nickname"]) {
			this.nickname = json["nickname"];	
		}

		if(null != json["resume"]) {
			this.resume = json["resume"];	
		}

		if(null != json["status"]) {
			this.status = json["status"];	
		}

		if(null != json["thumbnail"]) {
			this.thumbnail = json["thumbnail"];	
		}

		if(null != json["user_id"]) {
			this.user_id = parseInt(json["user_id"]);	
		}

		return this;
	}   
	*/
}