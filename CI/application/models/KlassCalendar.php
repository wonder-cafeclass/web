<?php

class KlassCalendar {
	public $yyyy_mm_dd_DD;
	public $year;
	public $month;
	public $date; // "21" of the "21"st February 2011
	public $day;  // Monday, Tuesday, ...
	public $hasKlass=false;
	public $isExpired=false;

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