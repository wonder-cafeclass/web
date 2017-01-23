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
	/* 2012년 12월 11일*/
	public DATE_TYPE_H_YYYY_MM_DD:number=8;
	/* 2012년 12월 11일 화요일*/
	public DATE_TYPE_H_YYYY_MM_DD_K_D:number=9;

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

	// @ Desc : 지정된 날짜가 오늘을 포함 이전 날짜인지 확인.
	isBeforeTomorrow(YYYYMMDD_HHMMSS:string):boolean {

		if(this.isNotYYYYMMDD_HHMMSS(YYYYMMDD_HHMMSS)) {
			return false;
		}

		let headDate:Date = this.getDateFromYYYYMMDD_HHMMSS(YYYYMMDD_HHMMSS);

		let todayDate:Date = new Date();

		let diffDays:number = this.getDiffDays(headDate, todayDate);

		return (-1 < diffDays)?true:false;

	} // end method

	// @ Desc : 오늘로부터 며칠전인지를 구함. / wonder.jung
	getDaysAgo(YYYYMMDD:string):number {

		if(this.isNotYYYYMMDD(YYYYMMDD)) {
			return null;
		}

		let headDate:Date = this.getDateFromYYYYMMDD(YYYYMMDD);
		let todayDate:Date = new Date();

		return this.getDiffDays(headDate, todayDate);

	} // end method


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
		return Math.floor((tail.getTime() - head.getTime()) / minutes);
	}

	private getDiffHours(head:Date, tail:Date) :number{
		let hour = 60*60*1000;
		return Math.floor((tail.getTime() - head.getTime()) / hour);
	}

	private getDiffDays(head:Date, tail:Date) :number{
		let day = 60*60*1000*24;
		return Math.floor((tail.getTime() - head.getTime()) / day);
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

	private addWeeksToDate(target:Date, weeks:number):Date {

		if(null == target) {
			return target;
		}
		if(null == weeks) {
			return target;
		}

		let days:number = weeks * 7;
		return this.addDaysToDate(target, days);
	}

	private addDaysToDate(target:Date, days:number):Date {

		if(null == target) {
			return target;
		}
		if(null == days) {
			return target;
		}

		let hours:number = days * 24;
		return this.addHoursToDate(target, hours);
	}

	private addHoursToDate(target:Date, hours:number):Date {

		if(null == target) {
			return target;
		}
		if(null == hours) {
			return target;
		}

		let minutes:number = hours * 60;
		return this.addMinutesToDate(target, minutes);
	}

	private addMinutesToDate(target:Date, minutes:number):Date {

		if(null == target) {
			return target;
		}
		if(null == minutes) {
			return target;
		}

		return new Date(target.getTime() + (minutes*60*1000));
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

	private getDateFromYYYYMMDD(date_str:string):Date {

		if(null == date_str || "" == date_str) {
			return null;
		}

		return this.getDate(date_str, this.DATE_TYPE_YYYY_MM_DD);

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

		} else if(this.DATE_TYPE_YYYY_MM_DD === input_date_format_type) {

			dateInput = this.getDate(date_str, this.DATE_TYPE_YYYY_MM_DD);
			
		} // end if // wonder.jung

		if(null == dateInput) {
			return "";			
		}

		if(this.DATE_TYPE_H_YYYY_MM_DD_HH_MM_SS === output_date_format_type) {

			return this.getDateFommattedStr(dateInput, this.DATE_TYPE_H_YYYY_MM_DD_HH_MM_SS);	

		} else if(this.DATE_TYPE_H_YYYY_MM_DD === output_date_format_type) {

			return this.getDateFommattedStr(dateInput, this.DATE_TYPE_H_YYYY_MM_DD);	

		} else if(this.DATE_TYPE_H_YYYY_MM_DD_K_D === output_date_format_type) {

			return this.getDateFommattedStr(dateInput, this.DATE_TYPE_H_YYYY_MM_DD_K_D);

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

		} else if(this.DATE_TYPE_YYYY_MM_DD === input_date_format_type) {

			let year = date.getFullYear();
			let month = this.getDoubleDigit(date.getMonth() + 1);
			let days = this.getDoubleDigit(date.getDate());

			// 2012년 12월 11일 01:02:03
			return `${year}-${month}-${days}`;

		} else if(this.DATE_TYPE_H_YYYY_MM_DD === input_date_format_type) {

			let year = date.getFullYear();
			let month = date.getMonth() + 1;
			let days = date.getDate();

			// 2012년 12월 11일 01:02:03
			return `${year}년 ${month}월 ${days}일`;	

		} else if(this.DATE_TYPE_H_YYYY_MM_DD_K_D === input_date_format_type) {

			let year = date.getFullYear();
			let month = date.getMonth() + 1;
			let days = date.getDate();
			let daysKorean = this.getDayKorean(date.getDay());

			// 2012년 12월 11일 01:02:03
			return `${year}년 ${month}월 ${days}일 ${daysKorean}`;	

		} // end if

		return "";
	}

	private getDayKorean(dayIdx:number):string {
		if(!(0 <= dayIdx && dayIdx <= 6)) {
			return "";
		}

		if(0 === dayIdx) {
			return "일요일";
		} else if(1 === dayIdx) {
			return "월요일";
		} else if(2 === dayIdx) {
			return "화요일";
		} else if(3 === dayIdx) {
			return "수요일";
		} else if(4 === dayIdx) {
			return "목요일";
		} else if(5 === dayIdx) {
			return "금요일";
		} else if(6 === dayIdx) {
			return "토요일";
		} // end if

		return "";
	}

	private getDayIdx(day:string):number {

		if(null == day || "" === day) {
			return -1;
		}

		let dayList:string[] = 
		[
			"sunday",
			"monday",
			"tuesday",
			"wednesday",
			"thursday",
			"friday",
			"saturday"
		];

		for (var i = 0; i < dayList.length; ++i) {
			let dayFromList:string = dayList[i];
			if(-1 < dayFromList.indexOf(day.toLowerCase())) {
				return i;
			}
		}

		return -1;
	}	


	/*
	@ Input : 
	["tue","fri"],0,3
	@ Return :
	[
		0:"2017년 2월 7일 화요일"
		1:"2017년 2월 10일 금요일"
		2:"2017년 2월 14일 화요일"
		3:"2017년 2월 17일 금요일"
		4:"2017년 2월 21일 화요일"
		5:"2017년 2월 24일 금요일"
	]
	*/
	public getDateListYYYYMMDDKDWidthDayList(
		dayList:string[], 
		weekIdxBegin:number, 
		weekIdxEnd:number):string[]{

		let dayIdxList:number[] = [];
		for (var i = 0; i < dayList.length; ++i) {
			let day:string = dayList[i];
			let dayIdx:number = this.getDayIdx(day);
			dayIdxList.push(dayIdx);
		}

		return this.getDateListWithDayOnFormat(
			dayIdxList, 
			weekIdxBegin, 
			weekIdxEnd,
			this.DATE_TYPE_H_YYYY_MM_DD_K_D
		);
	} // end method

	public getDateListYYYYMMDDWidthDayList(
		dayList:string[], 
		weekIdxBegin:number, 
		weekIdxEnd:number):string[]{

		let dayIdxList:number[] = [];
		for (var i = 0; i < dayList.length; ++i) {
			let day:string = dayList[i];
			let dayIdx:number = this.getDayIdx(day);
			dayIdxList.push(dayIdx);
		}

		return this.getDateListWithDayOnFormat(
			dayIdxList, 
			weekIdxBegin, 
			weekIdxEnd,
			this.DATE_TYPE_YYYY_MM_DD
		);
	} // end method	


	/*
	@ Input : 
	[2,5],0,3
	@ Return :
	[
		0:"2017년 2월 7일 화요일"
		1:"2017년 2월 10일 금요일"
		2:"2017년 2월 14일 화요일"
		3:"2017년 2월 17일 금요일"
		4:"2017년 2월 21일 화요일"
		5:"2017년 2월 24일 금요일"
	]
	*/
	public getDateListYYYYMMDDKD(
		dayIdxList:number[], 
		weekIdxBegin:number, 
		weekIdxEnd:number):string[]{

		return this.getDateListWithDayOnFormat(
			dayIdxList, 
			weekIdxBegin, 
			weekIdxEnd,
			this.DATE_TYPE_H_YYYY_MM_DD_K_D
		);
	} // end method

	public getDateListWithDayOnFormat(
		dayIdxList:number[], 
		weekIdxBegin:number, 
		weekIdxEnd:number,
		inputDateFormatType:number):string[] {

		let dateList:Date[] = 
		this.getDateListWithDayList(dayIdxList, weekIdxBegin, weekIdxEnd);

		let dateStrList:string[] = [];
		for (var i = 0; i < dateList.length; ++i) {
			let date:Date = dateList[i];
			let dateStr:string = this.getDateFommattedStr(date, inputDateFormatType);

			dateStrList.push(dateStr);
		}

		return dateStrList;

	}	

	// 원하는 기능 : 요일을 선택하면 사용자가 넣은 범위 안에서 해당 요일의 날짜를 구해준다. 
	public getDateListWithDayList(
		// 0 ~ 6 : Sunday ~ Saturday
		dayIdxList:number[], 
		// 검색을 시작하는 주의 인덱스. 현재를 기준으로 몇주 전인지를 결졍. -1: 1주전. -2: 2주전.
		weekIdxBegin:number, 
		// 검색을 끝내는 주의 인덱스. 현재를 기준으로 몇주 뒤인지를 결졍. 1: 1주뒤. 2: 2주뒤.
		weekIdxEnd:number):Date[] {

		if(null == dayIdxList || !(0 < dayIdxList.length)) {
			return [];
		}

		for (var i = 0; i < dayIdxList.length; ++i) {
			let dayIdx:number = dayIdxList[i];
			if(!(0 <= dayIdx && dayIdx <= 6)) {
				return [];
			}
		}

		if(isNaN(weekIdxBegin)) {
			return [];
		}
		if(isNaN(weekIdxEnd)) {
			return [];
		}
		if(!(weekIdxBegin <= weekIdxEnd)) {
			return [];
		}

		// 오늘의 요일을 가져온다. 
		let today:Date = new Date();
		let dayIdxToday:number = today.getDay();

		// 한주의 시작. 경계값.
		let sundayThisWeek:Date = this.addDaysToDate(today, -1 * dayIdxToday);
		console.log("TEST / sundayThisWeek : ",sundayThisWeek);

		// 검색을 하려는 요일 값들을 이번주 요일의 date 객체 리스트로 만듭니다.
		let dayListThisWeek:Date[] = [];
		for (var i = 0; i < dayIdxList.length; ++i) {
			let dayIdx:number = dayIdxList[i];
			console.log("TEST / dayIdx : ",dayIdx);
			let date:Date = this.addDaysToDate(sundayThisWeek, dayIdx);
			console.log("TEST / date : ",date);

			dayListThisWeek.push(date);
		} // end for
		console.log("TEST / dayListThisWeek : ",dayListThisWeek);

		let dayMilliSec:number = 60*60*1000*24;
		let weekMilliSec:number = dayMilliSec*7;
		let dateListNext:Date[] = [];
		for (var i = weekIdxBegin; i < (weekIdxEnd + 1); ++i) {

			for (var j = 0; j < dayListThisWeek.length; ++j) {
				let date:Date = dayListThisWeek[j];
				let dateNext:Date = this.addWeeksToDate(date, i);

				dateListNext.push(dateNext);
			} // end for

		} // end for

		return dateListNext;
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

		let res = date_str_yyyymmdd_hhmmss.match(/^([2]{1}[0-9]{3})-([0]{1}[1-9]{1}|[1]{1}[0-2]{1})-([0]{1}[1-9]{1}|[1]{1}[0-9]{1}|[2]{1}[0-9]{1}|[3]{1}[0-1]{1}) (0[0-9]|1[0-9]|2[0-4]):([0-5]{1}[0-9]{1}):([0-5]{1}[0-9]{1})$/gi);
		if(null === res || !(0 < res.length)) {
		  return false;
		}		

		return true;
	}	


	public isNotYYYYMMDD(date_str_yyyymmdd:string):boolean{
		return !this.isYYYYMMDD(date_str_yyyymmdd);
	}

	// @ Public
	// @ Desc : 사용자가 입력한 시간이 다음과 같은 포맷인지 (ex : 2017-01-13) 확인합니다.
	public isYYYYMMDD(date_str_yyyymmdd:string):boolean{

		if(null == date_str_yyyymmdd || "" === date_str_yyyymmdd) {
			return false;
		}

		let res = date_str_yyyymmdd.match(/^([2]{1}[0-9]{3})-([0]{1}[1-9]{1}|[1]{1}[0-2]{1})-([0]{1}[1-9]{1}|[1]{1}[0-9]{1}|[2]{1}[0-9]{1}|[3]{1}[0-1]{1})$/gi);
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