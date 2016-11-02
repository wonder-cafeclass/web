export class Calendar {
	public yyyy_mm_dd_DD;
	public year;
	public month;
	public date; // "21" of the "21"st February 2011
	public day:string;  // Monday, Tuesday, ...
	public dayEng:string;  // Monday, Tuesday, ...
	public dayKor:string;  // 월요일, 화요일, ...

	public hasKlass:boolean=false;
	public isExpired:boolean=false;

	public isEnrollment:boolean=false;			// 강의 참여가 가능한지 알려주는 플래그.
	public isEnrollmentWeek:boolean=false; 		// 매주마다 강의 참여가 가능한지 알려주는 플래그.
	public isEnrollment2weeks:boolean=false; 	// 2주마다 강의 참여가 가능한지 알려주는 플래그.
	public isEnrollment4weeks:boolean=false; 	// 4주마다 강의 참여가 가능한지 알려주는 플래그.

	public isFirstDayOfWeek:boolean=false;
	public isLastDayOfWeek:boolean=false;

	public isFirstWeekOfMonth:boolean=false;	
	public isLastWeekOfMonth:boolean=false;

	public isFirstDayOfMonth:boolean=false;
	public isLastDayOfMonth:boolean=false;

	public isFirstDay:boolean=false;
	public isLastDay:boolean=false;

	public isFirstWeek:boolean=false;
	public isLastWeek:boolean=false;

	// 월별 이름을 나타내기위한 2번째주 화요일을 나타내는 플래그.
	public isMonthIndicator:boolean=false;

	// View에서 선택되었는지 여부를 나타내는 플래그.
	public isFocus:boolean=false;

}