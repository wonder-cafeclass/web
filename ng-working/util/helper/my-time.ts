/*
*	@ Desc : 시간 관련 함수 모음
*/
export class HelperMyTime {

	constructor() {}

	/*2012-12-11*/
	private DATE_TYPE_YYYY_MM_DD:number=1;	
	/*01:02*/
	private DATE_TYPE_HH_MM:number=2;	
	/*01:02*/
	private DATE_TYPE_MM_SS:number=3;	
	// TODO /*01:02 --> 01:00 // 01:52 --> 02:00 // 01:00,01:15,01:30,01:45,02:00 으로 반환*/
	private DATE_TYPE_HH_MM_ROUND:number=4;
	/*20121211010203*/ 
	private DATE_TYPE_YYYYMMDDHHMMSS:number=5;	
	/* 2012년 12월 11일 01:02:03 */
	private DATE_TYPE_H_YYYY_MM_DD_HH_MM_SS:number=6;

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

	private getDateFromHHMM(date_str:string):Date {

		if(null == date_str || "" == date_str) {
			return null;
		}

		return this.getDate(date_str, this.DATE_TYPE_HH_MM);

	}

	private getDate(date_str:string, input_date_format_type:number):Date{
		
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

	private isNotHHMM(time_str:string):boolean{	
		return !this.isHHMM(time_str);
	}
	// @ Public
	// @ Desc : 사용자가 입력한 시간이 다음과 같은 포맷인지 (00시 00분) 확인합니다.
	private isHHMM(time_str:string):boolean{

		if(null == time_str || "" === time_str) {
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

	private getDoubleDigit(target_number:number):string{
		if(target_number < 10){
			return "0" + target_number;
		}
		return ""+target_number;
	}


}