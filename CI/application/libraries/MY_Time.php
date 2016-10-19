<?php

class MY_Time{

	// public static $STATUS_CODE_OK=200;

	// @ Desc : "2017-08-01" 형식의 시간:분 문자열인지 확인합니다. 12시간 단위
	// @ Usage : $this->is_valid_time_format_yyyy_mm_dd($target);
	public function is_valid_time_format_yyyy_mm_dd($target){
		if(empty($target)) {
			return false;
		}
		return preg_match("/20[0-9]{2}-(1[012]|0[0-9])-(3[01]|2[0-9]|1[0-9]|0[0-9])/", $target);
	}
	// @ Usage : $this->is_not_valid_time_format_yyyy_mm_dd($target);
	public function is_not_valid_time_format_yyyy_mm_dd($target){
		return !$this->is_valid_time_format_yyyy_mm_dd($target);
	}

	// @ Desc : "09:20" 형식의 시간:분 문자열인지 확인합니다. 12시간 단위
	// @ Usage : $this->is_valid_time_format_hh12_mm($target);
	public function is_valid_time_format_hh12_mm($target){
		if(empty($target)) {
			return false;
		}
		return preg_match("/(1[012]|0[0-9]):([0-5][0-9])/", $target);
	}
	public function is_not_valid_time_format_hh12_mm($target){
		return !$this->is_valid_time_format_hh12_mm($target);
	}

	// @ Desc : "19:20" 형식의 시간:분 문자열인지 확인합니다. 24시간 단위
	// @ Usage : $this->is_valid_HHmm($target);
	public function is_valid_HHmm($target){
		if(empty($target)) {
			return false;
		}

		$is_over_20h = preg_match("/(2[0-3]|[01][0-9]):([0-5][0-9])/", $target);
		$is_under_20h = preg_match("/(1[012]|0[0-9]):([0-5][0-9])/", $target);

		return ($is_over_20h || $is_under_20h);
	}
	// @ Usage : $this->is_not_valid_HHmm($target);
	public function is_not_valid_HHmm($target){
		return !$this->is_valid_HHmm($target);
	}

	public function digit_to_HHmm($digit=-1, $to24=false) 
	{
		if(!(-1 < $digit)) {
			return null;
		}

		if($digit == 0 && $to24) {
			return "24:00";
		}

		// hours to sec
		$seconds = $digit * 3600;
		return $this->sec_to_HHmm($seconds);
	}

	// @ Private
	// @ Desc : "19:20" 형식의 시간:분을 초단위로 바꾸어 줍니다.
	public function convert_hh24_mm_to_seconds($str_time){

		if($this->is_not_valid_HHmm($str_time)) {
			return -1;
		}

		sscanf($str_time, "%d:%d", $hours, $minutes);
		$time_seconds = $hours * 3600 + $minutes * 60 + $seconds;

		return $time_seconds;
	}
	public function sec_to_HHmm($seconds) {

		if(!is_numeric($seconds)) {
			return -1;
		}

		return gmdate("H:i", $seconds);
	}
	public function sec_to_YYYYMMHHMMSS($seconds) {

		if(!is_numeric($seconds)) {
			return -1;
		}

		return gmdate("YmdHis", $seconds);
	}
	// @ Usage : $this->get_now_micro();
	public function get_now_micro() {

		$t = microtime(true);
		$micro = sprintf("%06d",($t - floor($t)) * 1000000);
		$d = new DateTime( date('Y-m-d H:i:s.'.$micro, $t) );

		return $d->format("Y-m-d H:i:s.u"); 

	}

	public function get_date() {
		return new DateTime();
	}

	public function get_micro() {
		// micro second is 0.000001 second.
		return microtime(true);
	}

	public function get_diff_micro($micro_begin, $micro_end) {
		$micro_diff = $micro_end - $micro_begin;		
		return $micro_diff;
	}


	// @ referer : http://stackoverflow.com/questions/18256346/difference-with-microseconds-precision-between-two-datetime-in-php
	public function get_diff_millisec_from_dates($date1, $date2){

		//Absolute val of Date 1 in seconds from  (EPOCH Time) - Date 2 in seconds from (EPOCH Time)
		$diff = abs(strtotime($date1->format('d-m-Y H:i:s.u'))-strtotime($date2->format('d-m-Y H:i:s.u')));

		//Creates variables for the microseconds of date1 and date2
		$micro1 = $date1->format("u");
		$micro2 = $date2->format("u");

		//Absolute difference between these micro seconds:
		$micro = abs($micro1 - $micro2);

		//Creates the variable that will hold the seconds (?):
		$difference = $diff.".".$micro;

		return $difference;

	}	

	// @ desc : 년/월/일/시/분/초/마이크로 로 반환합니다. / $this->get_now_YYYYMMDDHHMMSSU();
	public function get_now_YYYYMMDDHHMMSSU() {
		return date('Y-m-d H:i:s.u');
	}

	public function get_now_YYYYMMDD() {
		return date('Y-m-d');
	}

	// $this->get_days_ago(3);
	public function get_days_ago($day_cnt=-1, $target_YYYYMMDD="") {
		if(empty($target_YYYYMMDD)) {
			$target_YYYYMMDD = $this->get_now_YYYYMMDD();
		}

		$day_cnt *= -1;
		$day_expression = "$day_cnt days";

		return date('Y-m-d', strtotime($day_expression, strtotime($target_YYYYMMDD)));	
	}

	public function get_days_after($day_after=-1, $target_YYYYMMDD="") {

		if(empty($target_YYYYMMDD)) {
			$target_YYYYMMDD = $this->get_now_YYYYMMDD();
		}

		$day_expression = "$day_after days";

		return date('Y-m-d', strtotime($day_expression, strtotime($target_YYYYMMDD)));		
	}

}
