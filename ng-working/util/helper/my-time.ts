import { MyClockTime } from '../model/my-clock-time';

/*
*	@ Desc : 시간 관련 함수 모음
*/
export class HelperMyTime {

	constructor() {}

	/*2012-12-11*/
	public DATE_TYPE_YYYY_MM_DD:number=1;	
	/*01:02*/
	public DATE_TYPE_HH_MM:number=2;	
	/*01:02*/
	public DATE_TYPE_MM_SS:number=3;	
	// TODO /*01:02 --> 01:00 // 01:52 --> 02:00 // 01:00,01:15,01:30,01:45,02:00 으로 반환*/
	public DATE_TYPE_HH_MM_ROUND:number=4;
	/*20121211010203*/ 
	public DATE_TYPE_YYYYMMDDHHMMSS:number=5;	
	/* 2012-12-11 01:02:03 */
	public DATE_TYPE_YYYY_MM_DD_HH_MM_SS:number=6;
	/* 2012년 12월 11일 01:02:03 */
	public DATE_TYPE_H_YYYY_MM_DD_HH_MM_SS:number=7;

	public getUniqueId():number {
		return Math.round(window.performance.now() * 100);
	}

	private getTimeFormatHHMM(target:Date):string {
		
		if(null == target) {
			return "";
		}
		return this.getTimeFormat(target, this.DATE_TYPE_HH_MM);		
	}

	private getTimeFormat(target:Date, timeFormat:number):string {

		if(null == target) {
			return "";
		}
		if(null == timeFormat) {
			return "";
		}

		if(this.DATE_TYPE_HH_MM === timeFormat) {
			
			let hours:string = this.getDoubleDigit(target.getHours());
			let minutes:string = this.getDoubleDigit(target.getMinutes());

			return `${ hours }:${ minutes }`;

		}

		return "";

	} // end method

	getDiffMinutesHHMM(headHHMM:string, tailHHMM:string):number {
		if(null == headHHMM || "" === headHHMM) {
			return -1;
		}
		if(this.isNotHHMM(headHHMM)) {
			return -1;
		}
		if(null == tailHHMM || "" === tailHHMM) {
			return -1;
		}
		if(this.isNotHHMM(tailHHMM)) {
			return -1;
		}

		let headDate:Date = this.getDateFromHHMM(headHHMM);
		if(null == headDate) {
			return -1;
		}
		let tailDate:Date = this.getDateFromHHMM(tailHHMM);
		if(null == tailDate) {
			return -1;
		}

		return this.getDiffMinutes(headDate, tailDate);
	}

	getDiffDaysYYYYMMDD_HHMMSS(headYYYYMMDD_HHMMSS:string, tailYYYYMMDD_HHMMSS:string):number {
		if(null == headYYYYMMDD_HHMMSS || "" === headYYYYMMDD_HHMMSS) {
			return -1;
		}
		if(this.isNotYYYYMMDD_HHMMSS(headYYYYMMDD_HHMMSS)) {
			return -1;
		}
		if(null == tailYYYYMMDD_HHMMSS || "" === tailYYYYMMDD_HHMMSS) {
			return -1;
		}
		if(this.isNotYYYYMMDD_HHMMSS(tailYYYYMMDD_HHMMSS)) {
			return -1;
		}

		let headDate:Date = this.getDateFromYYYYMMDD_HHMMSS(headYYYYMMDD_HHMMSS);
		if(null == headDate) {
			return -1;
		}
		let tailDate:Date = this.getDateFromYYYYMMDD_HHMMSS(tailYYYYMMDD_HHMMSS);
		if(null == tailDate) {
			return -1;
		}

		return this.getDiffDays(headDate, tailDate);
	}

	private getDiffMinutes(head:Date, tail:Date) :number{
		let minutes = 60*1000;
		return Math.abs((head.getTime() - tail.getTime()) / minutes);
	}

	private getDiffHours(head:Date, tail:Date) :number{
		let hour = 60*60*1000;
		return Math.abs((head.getTime() - tail.getTime()) / hour);
	}

	private getDiffDays(head:Date, tail:Date) :number{
		let day = 60*60*1000*24;
		return Math.abs((head.getTime() - tail.getTime()) / day);
	}

	addHoursHHMM(hhmm:string, hours:number):string {

	    // let isDebug:boolean = true;
	    let isDebug:boolean = false;
	    if(isDebug) console.log("my-time / addHoursHHMM / 시작");
	    if(isDebug) console.log("my-time / addHoursHHMM / hhmm : ",hhmm);
	    if(isDebug) console.log("my-time / addHoursHHMM / hours : ",hours);

		if(this.isNotHHMM(hhmm)) {
			if(isDebug) console.log("my-time / addHoursHHMM / 중단 / hhmm is not valid!");
			return "";
		}

		let dateFromHHMM:Date = this.getDateFromHHMM(hhmm);
		if(null == dateFromHHMM) {
			if(isDebug) console.log("my-time / addHoursHHMM / 중단 / dateFromHHMM is not valid!");
			return "";
		}
		if(isDebug) console.log("my-time / addHoursHHMM / dateFromHHMM : ",dateFromHHMM);

		let dateAfterHours:Date = this.addHoursToDate(dateFromHHMM, hours);
		if(null == dateAfterHours) {
			if(isDebug) console.log("my-time / addHoursHHMM / 중단 / dateAfterHours is not valid!");
			return "";
		}
		if(isDebug) console.log("my-time / addHoursHHMM / dateAfterHours : ",dateAfterHours);

		let hhmmAfterHours:string = this.getTimeFormatHHMM(dateAfterHours);
		if(null == hhmmAfterHours) {
			if(isDebug) console.log("my-time / addHoursHHMM / 중단 / hhmmAfterHours is not valid!");
			return "";
		}
		if(isDebug) console.log("my-time / addHoursHHMM / hhmmAfterHours : ",hhmmAfterHours);

		return hhmmAfterHours;

	} // end method

	addMinutesHHMM(hhmm:string, minutes:number):string {

	    // let isDebug:boolean = true;
	    let isDebug:boolean = false;
	    if(isDebug) console.log("my-time / addMinutesHHMM / 시작");
	    if(isDebug) console.log("my-time / addMinutesHHMM / hhmm : ",hhmm);
	    if(isDebug) console.log("my-time / addMinutesHHMM / minutes : ",minutes);

		if(this.isNotHHMM(hhmm)) {
			if(isDebug) console.log("my-time / addMinutesHHMM / 중단 / hhmm is not valid!");
			return "";
		}	    

		let dateFromHHMM:Date = this.getDateFromHHMM(hhmm);
		if(null == dateFromHHMM) {
			if(isDebug) console.log("my-time / addMinutesHHMM / 중단 / dateFromHHMM is not valid!");
			return "";
		}
		if(isDebug) console.log("my-time / addMinutesHHMM / dateFromHHMM : ",dateFromHHMM);

		let dateAfterMinutes:Date = this.addMinutesToDate(dateFromHHMM, minutes);
		if(null == dateAfterMinutes) {
			if(isDebug) console.log("my-time / addMinutesHHMM / 중단 / dateAfterMinutes is not valid!");
			return "";
		}
		if(isDebug) console.log("my-time / addMinutesHHMM / dateAfterMinutes : ",dateAfterMinutes);

		let hhmmAfterMinutes:string = this.getTimeFormatHHMM(dateAfterMinutes);
		if(null == hhmmAfterMinutes) {
			if(isDebug) console.log("my-time / addMinutesHHMM / 중단 / hhmmAfterMinutes is not valid!");
			return "";
		}
		if(isDebug) console.log("my-time / addMinutesHHMM / hhmmAfterMinutes : ",hhmmAfterMinutes);

		return hhmmAfterMinutes;

	} // end method

	private addHoursToDate(target:Date, hours:number):Date {

		if(null == target) {
			return target;
		}
		if(null == hours) {
			return target;
		}

		target.setTime(target.getTime() + (hours*60*60*1000));

		return target;

	}

	private addMinutesToDate(target:Date, minutes:number):Date {

		if(null == target) {
			return target;
		}
		if(null == minutes) {
			return target;
		}

		target.setTime(target.getTime() + (minutes*60*1000));

		return target;

	}

	public getHoursFromHHMM(date_str:string):number {
		let date:Date = this.getDateFromHHMM(date_str);

		if(null == date) {
			return -1;
		}

		return date.getHours();
	}

	private getDateFromHHMM(date_str:string):Date {

		if(null == date_str || "" == date_str) {
			return null;
		}

		return this.getDate(date_str, this.DATE_TYPE_HH_MM);

	}

	private getDateFromYYYYMMDD_HHMMSS(date_str:string):Date {

		if(null == date_str || "" == date_str) {
			return null;
		}

		return this.getDate(date_str, this.DATE_TYPE_YYYY_MM_DD_HH_MM_SS);

	}


	public getNow_YYYY_MM_DD_HH_MM_SS():string {
		return this.getNow(this.DATE_TYPE_YYYY_MM_DD_HH_MM_SS);
	}

	public getNow_H_YYYY_MM_DD_HH_MM_SS():string {
		return this.getNow(this.DATE_TYPE_H_YYYY_MM_DD_HH_MM_SS);
	}

	private getNow(input_date_format_type:number):string {

		if(null == input_date_format_type) {
			return null;
		}

		let now:Date = new Date();

		return this.getDateFommattedStr(now, input_date_format_type);

	}

	public convert(date_str:string, input_date_format_type:number, output_date_format_type:number):string {

	    // let isDebug:boolean = true;
	    let isDebug:boolean = false;
	    if(isDebug) console.log("my-time / convert / 시작");

		let dateInput:Date = null;

		if(this.DATE_TYPE_YYYY_MM_DD_HH_MM_SS === input_date_format_type) {
			dateInput = this.getDate(date_str, this.DATE_TYPE_YYYY_MM_DD_HH_MM_SS);
		}

		if(null == dateInput) {
			return "";			
		}

		if(this.DATE_TYPE_H_YYYY_MM_DD_HH_MM_SS === output_date_format_type) {
			return this.getDateFommattedStr(dateInput, this.DATE_TYPE_H_YYYY_MM_DD_HH_MM_SS);	
		}

		return "";
	}

	private getDateFommattedStr(date:Date, input_date_format_type:number):string {

		if(this.DATE_TYPE_YYYY_MM_DD_HH_MM_SS === input_date_format_type) {

			let year = date.getFullYear();
			let month = this.getDoubleDigit(date.getMonth() + 1);
			let days = this.getDoubleDigit(date.getDate());
			let hours = this.getDoubleDigit(date.getHours());
			let minutes = this.getDoubleDigit(date.getMinutes());
			let seconds = this.getDoubleDigit(date.getSeconds());

			// 2012-12-11 01:02:03
			return `${year}-${month}-${days} ${hours}:${minutes}:${seconds}`;

		} else if(this.DATE_TYPE_H_YYYY_MM_DD_HH_MM_SS === input_date_format_type) {

			let year = date.getFullYear();
			let month = date.getMonth() + 1;
			let days = date.getDate();
			let hours = this.getDoubleDigit(date.getHours());
			let minutes = this.getDoubleDigit(date.getMinutes());
			let seconds = this.getDoubleDigit(date.getSeconds());

			// 2012년 12월 11일 01:02:03
			return `${year}년 ${month}월 ${days}일 ${hours}:${minutes}:${seconds}`;

		} // end if

		return "";
	}

	private getDate(date_str:string, input_date_format_type:number):Date{

	    // let isDebug:boolean = true;
	    let isDebug:boolean = false;
	    if(isDebug) console.log("my-time / getDate / 시작");
		
		if(null == date_str || "" == date_str) {
			return null;
		}
		if(null == input_date_format_type) {
			return null;
		}
		
		//new Date(year, month, day, hours, minutes, seconds, milliseconds)
		if(input_date_format_type == this.DATE_TYPE_YYYY_MM_DD){

			let date_arr = date_str.split("-");
			if(	date_arr == null || 
				date_arr.length != 3 || 
				date_arr[0].length != 4 ||
				date_arr[1].length != 2 ||
				date_arr[2].length != 2
			){
				console.log("!Error! / airborne.dates / getFormattedDate / date_str is not this.DATE_TYPE_YYYY_MM_DD");
				return null;
			}
			
			// ['2012','03','04'] --> 2012
			let year:number = parseInt(date_arr[0]);
			
			// ['2012','03','04'] --> 3
			let month:number = parseInt(date_arr[1])-1;
			
			// ['2012','03','04'] --> 4
			let days:number = parseInt(date_arr[2]);

			return new Date(year, month, days, 0, 0, 0, 0);

		} else if(input_date_format_type == this.DATE_TYPE_YYYY_MM_DD_HH_MM_SS){

			// EX ) "2012-11-22 11:22:33"

			var res = date_str.match(/[0-9]{2,4}/g);

			if(null == res || 6 != res.length) {
				return null;
			}

			let year:number = parseInt(res[0]);
			let month:number = parseInt(res[1])-1; // month starts with 0, january.d
			let day:number = parseInt(res[2]);
			let hour:number = parseInt(res[3]);
			let minute:number = parseInt(res[4]);
			let second:number = parseInt(res[5]);

			return new Date(year, month, day, hour, minute, second);

		} else if(input_date_format_type == this.DATE_TYPE_YYYYMMDDHHMMSS){

			if(date_str.length == 8){
				console.log("date_str.length == 8");
				return null;
			}

			let year:number = parseInt(date_str.slice(0,4));
			let month:number = parseInt(date_str.slice(4,6))-1; // month starts with 0, january.d
			let day:number = parseInt(date_str.slice(6,8));
			let hour:number = parseInt(date_str.slice(8,10));
			let minute:number = parseInt(date_str.slice(10,12));
			let second:number = parseInt(date_str.slice(12,14));

			return new Date(year, month, day, hour, minute, second);

		} else if(input_date_format_type == this.DATE_TYPE_HH_MM){ // wdjung1

			// sample : "07:00"
			if(this.isNotHHMM(date_str)) return null;

			let time_arr = date_str.split(":");
			let hours = parseInt(time_arr[0]);
			if(hours < 0 || 23 < hours) return null;
			let minutes = parseInt(time_arr[1]);
			if(minutes < 0 || 59 < minutes) return null;

			let now_date = new Date();

			let cur_year = now_date.getFullYear();
			let cur_month = now_date.getMonth() + 1;
			// cur_month = this.getDoubleDigit(cur_month);
			let cur_days = now_date.getDate();
			// cur_days = this.getDoubleDigit(cur_days);

			let cur_hours = parseInt(time_arr[0]);
			let cur_minutes = parseInt(time_arr[1]);
			let cur_seconds = 0;

			return new Date(cur_year, cur_month, cur_days, cur_hours, cur_minutes, cur_seconds);

		} else if(input_date_format_type == this.DATE_TYPE_MM_SS){ // wdjung1

			// sample : "07:00"
			if(this.isNotHHMM(date_str)) return null;

			let time_arr = date_str.split(":");
			let minutes = parseInt(time_arr[0]);
			if(minutes < 0 || 59 < minutes) return null;
			let seconds = parseInt(time_arr[1]);
			if(seconds < 0 || 59 < seconds) return null;

			let now_date = new Date();

			let cur_year = now_date.getFullYear();
			let cur_month = now_date.getMonth() + 1;
			// cur_month = this.getDoubleDigit(cur_month);
			let cur_days = now_date.getDate();
			// cur_days = this.getDoubleDigit(cur_days);

			let cur_hours = now_date.getHours();
			let cur_minutes = parseInt(time_arr[0]);
			let cur_seconds = parseInt(time_arr[1]);

			return new Date(cur_year, cur_month, cur_days, cur_hours, cur_minutes, cur_seconds);
		}

		return null;
	}

	public isNotHHMM(time_str:string):boolean{	
		return !this.isHHMM(time_str);
	}
	// @ Public
	// @ Desc : 사용자가 입력한 시간이 다음과 같은 포맷인지 (00시 00분) 확인합니다.
	public isHHMM(time_str:string):boolean{

		if(null == time_str || "" === time_str) {
			return false;
		}

		let res = time_str.match(/^([0-9]|0[0-9]|1[0-9]|2[0-6]):[0-5]0$/gi);
		if(null === res || !(0 < res.length)) {
		  return false;
		}		

		// 17:11 의 포맷인지 확인합니다.
		let time_arr = time_str.split(":");
		if(	time_arr == null || 
			time_arr.length != 2 || 
			time_arr[0].length != 2 ||
			time_arr[1].length != 2
		){
			return false;
		}
		return true;
	}

	public isNotYYYYMMDD_HHMMSS(date_str_yyyymmdd_hhmmss:string):boolean{
		return !this.isYYYYMMDD_HHMMSS(date_str_yyyymmdd_hhmmss);
	}

	// @ Public
	// @ Desc : 사용자가 입력한 시간이 다음과 같은 포맷인지 (ex : 2017-01-13 22:12:11) 확인합니다.
	public isYYYYMMDD_HHMMSS(date_str_yyyymmdd_hhmmss:string):boolean{

		if(null == date_str_yyyymmdd_hhmmss || "" === date_str_yyyymmdd_hhmmss) {
			return false;
		}

		let res = date_str_yyyymmdd_hhmmss.match(/^([2]{1}[0-9]{3})-([0]{1}[1-9]{1}|[1]{1}[0-2]{1})-([0]{1}[1-9]{1}|[1]{1}[0-9]{1}|[2]{1}[0-9]{1}|[3]{1}[0-1]{1}) ([0-9]|0[0-9]|1[0-9]|2[0-6]):([0-5]|[0-9])$/gi);
		if(null === res || !(0 < res.length)) {
		  return false;
		}		

		return true;
	}	

	public getDoubleDigit(target_number:number):string{
		if(target_number < 10){
			return "0" + target_number;
		}
		return ""+target_number;
	}

	public getClockTime(hhmm:string): MyClockTime {

		if(this.isNotHHMM(hhmm)) {
			return null;
		}

		// 1. ex) 16:00 24시간 형태로 인자를 받습니다.
		let hhmmfragments = hhmm.split(":");
		let hoursStr = hhmmfragments[0];
		let hours = parseInt(hoursStr);
		let minutesStr = hhmmfragments[1];
		let minutes = parseInt(minutesStr);
		let totalMinutes = 60 * hours +  minutes;
		let hoursForRotate = hours;
		let isAM = true;
		let hhmm24 = hhmm;
		let hhmm12 = `오전 ${hoursStr}:${minutesStr}`;
		if(12 <= hoursForRotate) {

		  // 오후 시간대 표시
		  hoursForRotate -= 12;

		  let hoursIn12:string = ""+hoursForRotate;
		  if( 0 == hoursForRotate ) {

		    // 낮 12시인 경우.
		    hoursIn12 = `12`;
		    hhmm12 = `낮 ${hoursIn12}:${minutesStr}`;

		  } else if( 0 < hoursForRotate && hoursForRotate < 3 ) {

		  	hoursIn12 = `0${hoursForRotate}`;
		  	hhmm12 = `낮 ${hoursIn12}:${minutesStr}`;

		  } else if( 3 <= hoursForRotate && hoursForRotate < 6 ) {

		    hoursIn12 = `0${hoursForRotate}`;
		    hhmm12 = `오후 ${hoursIn12}:${minutesStr}`;

		  } else if( 6 <= hoursForRotate && hoursForRotate < 9 ) {

		    // 저녁 시간을 나타냄. 오후 6시부터 저녁
		    hoursIn12 = `0${hoursForRotate}`;
		    hhmm12 = `저녁 ${hoursIn12}:${minutesStr}`;

		  } else if( 9 <= hoursForRotate) {

		    // 밤 시간을 나타냄. 밤은 9시부터...
		    if(hoursForRotate < 10) {
		      hoursIn12 = `0${hoursForRotate}`;
		    }
		    hhmm12 = `밤 ${hoursIn12}:${minutesStr}`;

		  }

		  isAM = false;
		}

		let clockTimeObj:MyClockTime = new MyClockTime();
		clockTimeObj.hhmm = hhmm;
		clockTimeObj.hours = hours;
		clockTimeObj.minutes = minutes;
		clockTimeObj.totalMinutes = totalMinutes;
		clockTimeObj.hoursForRotate = hoursForRotate;
		clockTimeObj.isAM = isAM;
		clockTimeObj.hhmm24 = hhmm24;
		clockTimeObj.hhmm12 = hhmm12;

		return clockTimeObj;
	} 	


}