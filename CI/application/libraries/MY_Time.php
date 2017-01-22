<?php

class MY_Time{

	private $CI=null;

    public function __construct()
    {
    	// Do something...
        $this->CI =& get_instance();
        if(!isset($this->CI)) {
            return;
        }
    }

    public function test_weekdays()
    {
        $output = [];

        $output["last_week_sunday"] = $this->get_sunday(-1);
        $output["last_week_monday"] = $this->get_monday(-1);
        $output["last_week_tuesday"] = $this->get_tuesday(-1);
        $output["last_week_wednesday"] = $this->get_wednesday(-1);
        $output["last_week_thursday"] = $this->get_thursday(-1);
        $output["last_week_friday"] = $this->get_friday(-1);
        $output["last_week_saturday"] = $this->get_saturday(-1);
/*
        $output["this_week_sunday"] = $this->get_sunday(0);
        $output["this_week_monday"] = $this->get_monday(0);
        $output["this_week_tuesday"] = $this->get_tuesday(0);
        $output["this_week_wednesday"] = $this->get_wednesday(0);
        $output["this_week_thursday"] = $this->get_thursday(0);
        $output["this_week_friday"] = $this->get_friday(0);
        $output["this_week_saturday"] = $this->get_saturday(0);

        $output["next_week_sunday"] = $this->get_sunday(1);
        $output["next_week_monday"] = $this->get_monday(1);
        $output["next_week_tuesday"] = $this->get_tuesday(1);
        $output["next_week_wednesday"] = $this->get_wednesday(1);
        $output["next_week_thursday"] = $this->get_thursday(1);
        $output["next_week_friday"] = $this->get_friday(1);
        $output["next_week_saturday"] = $this->get_saturday(1);

        $output["next_next_week_sunday"] = $this->get_sunday(2);
        $output["next_next_week_monday"] = $this->get_monday(2);
        $output["next_next_week_tuesday"] = $this->get_tuesday(2);
        $output["next_next_week_wednesday"] = $this->get_wednesday(2);
        $output["next_next_week_thursday"] = $this->get_thursday(2);
        $output["next_next_week_friday"] = $this->get_friday(2);
        $output["next_next_week_saturday"] = $this->get_saturday(2);
*/

        return $output;
    }

    public function get_sunday($interval_weeks=0)
    {
    	return $this->get_day(0,$interval_weeks);
    }
    public function get_monday($interval_weeks=0)
    {
    	return $this->get_day(1,$interval_weeks);
    }
    public function get_tuesday($interval_weeks=0)
    {
    	return $this->get_day(2,$interval_weeks);
    }
    public function get_wednesday($interval_weeks=0)
    {
    	return $this->get_day(3,$interval_weeks);
    }
    public function get_thursday($interval_weeks=0)
    {
    	return $this->get_day(4,$interval_weeks);
    }
    public function get_friday($interval_weeks=0)
    {
    	return $this->get_day(5,$interval_weeks);
    }
    public function get_saturday($interval_weeks=0)
    {
    	return $this->get_day(6,$interval_weeks);
    }

    public function get_day_with_day_name($day_name="", $interval_weeks=0)
    {
    	if(empty($day_name)) 
    	{
            $this->CI->my_tracker->add_stopped(__CLASS__, __FUNCTION__, __LINE__, "empty(\$day_name)");
    	} // end if

    	$day_idx = $this->get_day_idx($day_name);

        $this->CI->my_tracker->add(__CLASS__, __FUNCTION__, __LINE__, "\$day_idx : $day_idx");

    	return $this->get_day($day_idx, $interval_weeks);
    } // end method

    private function get_day_idx($day_name="")
    {
    	$day_name_lower = strtolower($day_name);
    	if(strpos(strtolower("Sunday"), $day_name_lower) !== false)
    	{
    		return 0;
    	}
    	else if(strpos(strtolower("Monday"), $day_name_lower) !== false)
    	{
    		return 1;
    	}
    	else if(strpos(strtolower("Tuesday"), $day_name_lower) !== false)
    	{
    		return 2;
    	}
    	else if(strpos(strtolower("Wednesday"), $day_name_lower) !== false)
    	{
    		return 3;
    	}
    	else if(strpos(strtolower("Thursday"), $day_name_lower) !== false)
    	{
    		return 4;
    	}
    	else if(strpos(strtolower("Friday"), $day_name_lower) !== false)
    	{
    		return 5;
    	}
    	else if(strpos(strtolower("Saturday"), $day_name_lower) !== false)
    	{
    		return 6;
    	} // end if  

        return -1;
    } // end method

    // @ Desc : 이번주 월요일, 지난주 월요일, 다음주 화요일등의 날짜를 YYYY-MM-DD 형식으로 돌려줍니다.
    public function get_day($day_idx=-1, $interval_weeks=0)
    {

    	if(!(-1 < $day_idx || $day_idx < 7)) 
    	{
            $this->CI->my_tracker->add_stopped(__CLASS__, __FUNCTION__, __LINE__, "\$day_idx is not valid!");
            return null;
    	} // end if

    	$day = "";
    	if($day_idx === 0)
    	{
    		$day = "Sunday";
    	}
    	else if($day_idx === 1)
    	{
    		$day = "Monday";
    	}
    	else if($day_idx === 2)
    	{
    		$day = "Tuesday";
    	}
    	else if($day_idx === 3)
    	{
    		$day = "Wednesday";	
    	}
    	else if($day_idx === 4)
    	{
    		$day = "Thursday";
    	}
    	else if($day_idx === 5)
    	{	
    		$day = "Friday";
    	}
    	else if($day_idx === 6)
    	{
    		$day = "Saturday";	
    	} // end if

    	$today = date('D',strtotime('now'));
    	$today_idx = $this->get_day_idx($today);
        if(!(-1 < $today_idx))
        {
            $this->CI->my_tracker->add_stopped(__CLASS__, __FUNCTION__, __LINE__, "\$today_idx is not valid!");
            return null;
        }

    	// 지난주는 사용자 입력:-1 / 여기서는 : $interval_week=-2
    	// 이번주는 사용자 입력:0 / 여기서는 : $interval_week=-1
    	// 다음주는 사용자 입력:1 / $interval_week=1
    	if($interval_weeks < 1) 
    	{
    		$interval_weeks -= 1;
    	}
    	// 오늘과 같거나 오늘보다 지난 요일이면 지난주의 날짜를 돌려주므로 $interval_week를 1개 늘려줍니다.
    	if($today_idx <= $day_idx)
    	{
    		$interval_weeks += 1;
    	}

    	// Examples
		// echo date('Y-m-d',strtotime('-1 Monday')); //last Monday
		// echo date('Y-m-d',strtotime('-2 Monday')); //two Mondays ago
		// echo date('Y-m-d',strtotime('+1 Monday')); //next Monday  

		$strtotime = "";
		if(0 == $interval_weeks) 
		{	
			$strtotime = "$day";
		}
		else if(0 < $interval_weeks) 
		{	
			$strtotime = "+$interval_weeks $day";
		}
		else if($interval_weeks < 0) 
		{	
			$strtotime = "$interval_weeks $day";
		}

    	if(empty($strtotime)) 
    	{
            $this->CI->my_tracker->add_stopped(__CLASS__, __FUNCTION__, __LINE__, "empty(\$strtotime)");
            return null;
    	} // end if


		$date = date('Y-m-d',strtotime($strtotime)); 

    	return $date;
    }

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
	public function is_valid_HHmm($target=""){
		if(empty($target)) {
			return false;
		}

		// 시간 범위 검색을 위한 24시 표현도 허용.
		if("24:00" === $target) {
			return true;
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
            $this->CI->my_error->add(
                // $class_name=""
                static::class,
                // $method_name=""
                __FUNCTION__,
                // $event=""
                MY_Error::$EVENT_PARAM_IS_NOT_VALID,
                // $message=""
                "!(-1 < \$digit)", 
                // $extra=null
                $digit
            );
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

            $this->CI->my_error->add(
                // $class_name=""
                static::class,
                // $method_name=""
                __FUNCTION__,
                // $event=""
                MY_Error::$EVENT_PARAM_IS_NOT_VALID,
                // $message=""
                "\$this->is_not_valid_HHmm(\$str_time)", 
                // $extra=null
                $str_time
            );

			return null;
		}

		sscanf($str_time, "%d:%d", $hours, $minutes);
		$time_seconds = $hours * 3600 + $minutes * 60 + $seconds;

		return $time_seconds;
	}
	public function sec_to_HHmm($seconds) {

		if(!is_numeric($seconds)) {
            $this->CI->my_error->add(
                // $class_name=""
                static::class,
                // $method_name=""
                __FUNCTION__,
                // $event=""
                MY_Error::$EVENT_PARAM_IS_NOT_VALID,
                // $message=""
                "!is_numeric(\$seconds)", 
                // $extra=null
                $seconds
            );			
			return -1;
		}

		return gmdate("H:i", $seconds);
	}
	public function sec_to_YYYYMMHHMMSS($seconds) {

		if(!is_numeric($seconds)) {
            $this->CI->my_error->add(
                // $class_name=""
                static::class,
                // $method_name=""
                __FUNCTION__,
                // $event=""
                MY_Error::$EVENT_PARAM_IS_NOT_VALID,
                // $message=""
                "!is_numeric(\$seconds)", 
                // $extra=null
                $seconds
            );	
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

	public function get_YYYYMMDDHHMMSS_human_readable_kor($yyyy_mm_dd_hh_ss="") 
	{
		if(empty($yyyy_mm_dd_hh_ss)) 
		{
			return "";
		}

		$time_str = date('Y년 n월 j일 A g:i:s', strtotime($yyyy_mm_dd_hh_ss));
		$time_str = str_replace("AM","오전",$time_str);
		$time_str = str_replace("PM","오후",$time_str);

		return $time_str;
	}

	// @ desc : 년/월/일/시/분/초/마이크로 로 반환합니다. / $this->get_now_YYYYMMDDHHMMSSU();
	public function get_now_YYYYMMDDHHMMSSU() 
	{
		return date('Y-m-d H:i:s.u');
	}

	public function get_now_YYYYMMDD() 
	{
		return date('Y-m-d');
	}

	public function get_now_YYYY() 
	{
		return date('Y');
	}
	
	public function get_days_ago($day_cnt=-1, $target_YYYYMMDD="") {
		if(empty($target_YYYYMMDD)) {
			$target_YYYYMMDD = $this->get_now_YYYYMMDD();
		}

		$day_cnt *= -1;
		$day_expression = "$day_cnt days";

		return date('Y-m-d', strtotime($day_expression, strtotime($target_YYYYMMDD)));	
	}

	public function get_days_after($day_after=-1, $target_YYYYMMDD="") 
    {

		if(empty($target_YYYYMMDD)) 
        {
			$target_YYYYMMDD = $this->get_now_YYYYMMDD();
		}

		$day_expression = "$day_after days";

		return date('Y-m-d', strtotime($day_expression, strtotime($target_YYYYMMDD)));		
	}

    public function get_day_diff($head_YYYYMMDD="", $tail_YYYYMMDD="") {

        if(empty($head_YYYYMMDD)) {
            return null;
        } // end if
        if(empty($tail_YYYYMMDD)) {
            return null;
        } // end if

        $date_head=date_create($head_YYYYMMDD);
        $date_tail=date_create($tail_YYYYMMDD);
        $diff=date_diff($date_head,$date_tail);

        return intval($diff->format("%R%a"));
    }

    // @ Desc : 해당 날짜가 지금으로부터 몇주뒤인지를 구합니다.
    public function get_week_interval($target_YYYYMMDD="")
    {
        if(empty($target_YYYYMMDD))
        {
            return null;
        }

        // 이번주의 경계가 되는 날짜들을 구합니다.
        // 1. 일요일 - 이번주의 첫번째 요일
        $this_week_sunday = $this->get_sunday(0);
        $day_diff_this_week_sunday = 
        $this->get_day_diff(
            // $head_YYYYMMDD="", 
            $this_week_sunday,
            // $tail_YYYYMMDD=""
            $target_YYYYMMDD
        );

        // 2. 토요일 - 이번주의 마지막 요일
        $this_week_saturday = $this->get_saturday(0);
        $day_diff_this_week_saturday = 
        $this->get_day_diff(
            // $head_YYYYMMDD="", 
            $this_week_saturday,
            // $tail_YYYYMMDD=""
            $target_YYYYMMDD
        );

        if( 0 <= $day_diff_this_week_sunday &&  
            $day_diff_this_week_saturday <= 0) 
        {
            // 이번주의 요일입니다.
            return 0;
        }

        if($day_diff_this_week_sunday < 0)
        {
            // 과거
            $outcome = floor($day_diff_this_week_sunday/7);
        }
        else if(0 < $day_diff_this_week_saturday)
        {
            // 미래
            $outcome = ceil($day_diff_this_week_saturday/7);
        }
        // $this->CI->my_tracker->add(__CLASS__, __FUNCTION__, __LINE__, "\$target_YYYYMMDD : $target_YYYYMMDD");
        // $this->CI->my_tracker->add(__CLASS__, __FUNCTION__, __LINE__, "\$outcome : $outcome");

        return $outcome;


    }

}
