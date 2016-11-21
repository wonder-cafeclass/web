import { Injectable }             from '@angular/core';


/*
*	@ Desc : 생년월일을 표시하기 위해 필요한 "연도","월","일" 배열을 돌려줍니다.
*/

@Injectable()
export class MyBirthdayService {

	private dayCntPerMonths:number[] = [
		31, // January
		29, // February
		31,	// March
		30, // April
		31, // May
		30, // June
		31, // July
		31, // August
		30, // September
		31, // October
		30, // November
		31  // December		
	];

	constructor() {}

	do (): void {
		// Something...
	}

	// @ Desc : 1950년부터 (현재연도 - 20년) 까지의 연도 배열을 가져옵니다.
	getYear (): number[] {
		// 현재 연도 가져오기.
		let d:Date = new Date();
		let n:number = d.getFullYear();

		let yearMin:number = 1950;
		let yearMax:number = n - 20;

		let yearArr:number[] = [];
		for (var i = yearMin; i <= yearMax; ++i) {
			yearArr.push(i);
		}

		return yearArr;
	}

	// @ Desc : 1월 ~ 12월
	getMonth (): number[] {
		let monthArr:number[] = [];
		for (var i = 1; i <= 12; ++i) {
			monthArr.push(i);
		}

		return monthArr;

	}

	getDay (month:number): number[] {

		if(month < 1 || 12 < month) {
			return null;
		}

		let dayCnt:number = this.dayCntPerMonths[(month - 1)];

		let dayArr:number[] = [];
		for (var i = 1; i <= dayCnt; ++i) {
			dayArr.push(i);
		}

		return dayArr;
	}
}