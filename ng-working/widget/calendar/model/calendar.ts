export class Calendar {
	public yyyy_mm_dd_DD;
	public year;
	public month;
	public date; // "21" of the "21"st February 2011
	public day;  // Monday, Tuesday, ...
	public hasKlass:boolean=false;
	public isExpired:boolean=false;
	public isEnrollment:boolean=false;

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

	// 월별 이름을 나타내기위한 2번째주 화요일을 나타내는 플래그값.
	public isMonthIndicator:boolean=false;

}