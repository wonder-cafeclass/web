<?php

class KlassCalendar {
	public $yyyy_mm_dd_DD;
	public $year;
	public $month;
	public $date; // "21" of the "21"st February 2011
	public $day;  // Monday, Tuesday, ...

	public $hasKlass=false; 				// 해당 날짜에 강의가 있는지 알려주는 플래그.
	public $isExpired=false; 				// 지난 날짜인지 알려주는 플래그.

	public $isEnrollment=false; 			// 강의 참여가 가능한지 알려주는 플래그.
	public $isEnrollmentWeek=false; 		// 매주마다 강의 참여가 가능한지 알려주는 플래그.
	public $isEnrollment2weeks=false; 		// 2주마다 강의 참여가 가능한지 알려주는 플래그.
	public $isEnrollment4weeks=false; 		// 4주마다 강의 참여가 가능한지 알려주는 플래그.

	public $isFirstDayOfWeek=false;
	public $isLastDayOfWeek=false;

	public $isFirstWeekOfMonth=false;	
	public $isLastWeekOfMonth=false;

	public $isFirstDayOfMonth=false;
	public $isLastDayOfMonth=false;

	public $isFirstDay=false;
	public $isLastDay=false;

	public $isFirstWeek=false;
	public $isLastWeek=false;

	public $isMonthIndicator=false;

	public function KlassCalendar($yyyy_mm_dd_DD="", $year=-1, $month=-1, $date=-1, $day="") 
	{
		$this->yyyy_mm_dd_DD = $yyyy_mm_dd_DD;
		$this->year = $year;
		$this->month = $month;
		$this->date = $date;
		$this->day = $day;
	}
}