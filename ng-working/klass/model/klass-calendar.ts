import { HelperMyIs } 				from '../../util/helper/my-is';
import { KlassCalendarDay } 		from './klass-calendar-day';

export class KlassCalendar {

	private myIs:HelperMyIs;
	private dayList:KlassCalendarDay[];
	private dayTable:KlassCalendarDay[][];

	private weekDaysCnt:number = 7;
	
	constructor() {
		this.myIs = new HelperMyIs();
		this.dayList = [];
		this.dayTable = [[]];
	}

	getDayList():KlassCalendarDay[] {
		return this.dayList;
	}

	getDayTable():KlassCalendarDay[][] {
		return this.dayTable;
	}

	addDay(day:KlassCalendarDay):void {

		// 시간순 1차원 리스트에 추가.
		this.addDayList(day);

		// 캘린더 형식의 2depth 테이블에 추가. 
		this.addDayTable(day);

	}

	private addDayList(day:KlassCalendarDay):void {
		if(null == day) {
			return;
		}
		this.dayList.push(day);
	}

	private addDayTable(day:KlassCalendarDay):void {

		// 마지막 주에 해당하는 배열을 가져옵니다.
		let lastWeekIdx:number = (this.dayTable.length - 1);
		let lastWeekDaysList:KlassCalendarDay[] = this.dayTable[lastWeekIdx];

		if(null == lastWeekDaysList) {
			return;
		}

		if(this.weekDaysCnt === lastWeekDaysList.length) {
			// 마지막 주에 모든 날짜들이 채워졌습니다.
			// 새로운 주를 만듭니다.
			this.dayTable.push([]);			

			// 새로 만든 마지막 주를 가져옵니다.
			lastWeekIdx = (this.dayTable.length - 1);
			lastWeekDaysList = this.dayTable[lastWeekIdx];
		}

		if(lastWeekDaysList.length < this.weekDaysCnt) {
			lastWeekDaysList.push(day);
		}

		this.dayTable[lastWeekIdx] = lastWeekDaysList;

	}

	isSame(target:KlassCalendar):boolean {
		return this.myIs.isSame(this, target);
	}	

	isSharing(key:string, target:KlassCalendar):boolean {
		return this.myIs.isSharing(key, this, target);
	}

		
}