import { HelperMyIs } from '../../util/helper/my-is';
import { HelperMyTime } from '../../util/helper/my-time';

export class KlassCalendarDay {

	private myIs:HelperMyIs;
	private myTime:HelperMyTime;

	public year:number;
	public month:number;
	public date:number;
	public day:string;
	public dayEng:string;
	public dayKor:string;
	public hasKlass:boolean;
	public isEnrollment:boolean;
	public isEnrollment2weeks:boolean;
	public isEnrollment4weeks:boolean;
	public isEnrollmentWeek:boolean;
	public isExpired:boolean;
	public isFirstDay:boolean;
	public isFirstDayOfMonth:boolean;
	public isFirstDayOfWeek:boolean;
	public isFirstWeekOfMonth:boolean;
	public isLastDay:boolean;
	public isLastDayOfMonth:boolean;
	public isLastDayOfWeek:boolean;
	public isLastWeek:boolean;
	public isLastWeekOfMonth:boolean;
	public isMonthIndicator:boolean;
	public yyyy_mm_dd_DD:string;
	
	constructor() {
		this.myIs = new HelperMyIs();
		this.myTime = new HelperMyTime();
	}

	setFromJSON(json:any):KlassCalendarDay {

		if(null == json) {
			return;
		}

		if(null != json["year"]) {
        	this.year = parseInt(json["year"]);
		}
		if(null != json["month"]) {
        	this.month = parseInt(json["month"]);
		}
		if(null != json["date"]) {
        	this.date = parseInt(json["date"]);
		}
		if(null != json["day"] && "" != json["day"]) {
        	this.day = json["day"];
		}
		if(null != json["dayEng"] && "" != json["dayEng"]) {
        	this.dayEng = json["dayEng"];
		}
		if(null != json["dayKor"] && "" != json["dayKor"]) {
        	this.dayKor = json["dayKor"];
		}
		if(null != json["hasKlass"]) {
        	this.hasKlass = json["hasKlass"];
		}
		if(null != json["isEnrollment"]) {
        	this.isEnrollment = json["isEnrollment"];
		}
		if(null != json["isEnrollment2weeks"]) {
        	this.isEnrollment2weeks = json["isEnrollment2weeks"];
		}
		if(null != json["isEnrollment4weeks"]) {
        	this.isEnrollment4weeks = json["isEnrollment4weeks"];
		}
		if(null != json["isEnrollmentWeek"]) {
        	this.isEnrollmentWeek = json["isEnrollmentWeek"];
		}
		if(null != json["isExpired"]) {
        	this.isExpired = json["isExpired"];
		}
		if(null != json["isFirstDay"]) {
        	this.isFirstDay = json["isFirstDay"];
		}
		if(null != json["isFirstDayOfMonth"]) {
        	this.isFirstDayOfMonth = json["isFirstDayOfMonth"];
		}
		if(null != json["isFirstDayOfWeek"]) {
        	this.isFirstDayOfWeek = json["isFirstDayOfWeek"];
		}
		if(null != json["isFirstWeekOfMonth"]) {
        	this.isFirstWeekOfMonth = json["isFirstWeekOfMonth"];
		}
		if(null != json["isLastDay"]) {
        	this.isLastDay = json["isLastDay"];
		}
		if(null != json["isLastDayOfMonth"]) {
        	this.isLastDayOfMonth = json["isLastDayOfMonth"];
		}
		if(null != json["isLastDayOfWeek"]) {
        	this.isLastDayOfWeek = json["isLastDayOfWeek"];
		}
		if(null != json["isLastWeek"]) {
        	this.isLastWeek = json["isLastWeek"];
		}
		if(null != json["isLastWeekOfMonth"]) {
        	this.isLastWeekOfMonth = json["isLastWeekOfMonth"];
		}
		if(null != json["isMonthIndicator"]) {
        	this.isMonthIndicator = json["isMonthIndicator"];
		}
		if(null != json["yyyy_mm_dd_DD"]) {
        	this.yyyy_mm_dd_DD = json["yyyy_mm_dd_DD"];
		}

		return this;
	}

	getYYYYMMDD():string {
		let month:string = this.myTime.getDoubleDigit(this.month);
		let date:string = this.myTime.getDoubleDigit(this.date);

		return `${this.year}-${month}-${date}`;
	}

	isSame(target:KlassCalendarDay):boolean {
		return this.myIs.isSame(this, target);
	}	

	isSharing(key:string, target:KlassCalendarDay):boolean {
		return this.myIs.isSharing(key, this, target);
	}


}