<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * Custom Calendar class
 * Provide days, dates, months by user needs.
 *
 * @author    Wonder Jung, @cafeclass
 * @license   MIT
 */


class MY_Calendar {

	private $CI=null;

    public function __construct($params=null)
    {

        // get singleton object.
        $this->CI =& get_instance();
        if(!isset($this->CI)) {
            return;
        }

        if(!isset($this->CI->my_error)) {
            return;
        }

    }

    /*
    *   @ Desc : 날짜별 정보를 시작하는 날짜의 월의 1일부터 부터 종료하는 날짜의 월의 31일까지 리스트로 돌려받습니다.
    *
    */
    public function get_date_list_by_month($yyyy_mm_dd_begin="", $weeks=-1) 
    {
        if(empty($yyyy_mm_dd_begin)) 
        {
            $this->CI->my_error->add(
                // $class_name=""
                static::class,
                // $method_name=""
                __FUNCTION__,
                // $event=""
                MY_Error::$EVENT_PARAM_IS_NOT_VALID,
                // $message=""
                "empty(\$yyyy_mm_dd_begin)"
            );
            return;
        }
        if(!(-1 < $weeks)) 
        {
            $this->CI->my_error->remessage("!(-1 < \$weeks)");
            return;
        }

        $days_after = $weeks * 7;

        $yyyy_mm_dd_end = 
        $this->get_days_after(
            // $day_after=-1
            $days_after,
            // $target_YYYYMMDD=""
            $yyyy_mm_dd_begin
        );

        if(empty($yyyy_mm_dd_end)) {
            $this->CI->my_error->remessage("empty(\$yyyy_mm_dd_end)");
            return;
        }

        // ex) 2016-10-27 --> 2016-10-01
        $yyyy_mm_dd_exploded = explode("-",$yyyy_mm_dd_begin);
        if(empty($yyyy_mm_dd_exploded)) {
            $this->CI->my_error->remessage("empty(\$yyyy_mm_dd_exploded) - 1");
            return;
        }
        $yyyy_mm_dd_begin = $yyyy_mm_dd_exploded[0] . "-" . $yyyy_mm_dd_exploded[1] . "-" . "01";


        // ex) 2016-11-27 --> 2016-11-31
        $yyyy_mm_dd_exploded = explode("-",$yyyy_mm_dd_end);
        if(empty($yyyy_mm_dd_exploded)) {
            $this->CI->my_error->remessage("empty(\$yyyy_mm_dd_exploded) - 2");
            return;
        }
        $yyyy_mm_dd_end = $yyyy_mm_dd_exploded[0] . "-" . $yyyy_mm_dd_exploded[1] . "-" . "31";

        return $this->get($yyyy_mm_dd_begin, $yyyy_mm_dd_end);
    }

    public function get_weeks($yyyy_mm_dd_begin="", $weeks=-1) 
    {
        if(empty($yyyy_mm_dd_begin)) 
        {
            return;
        }
        if(!(-1 < $weeks)) 
        {
            return;
        }

        $days_after = $weeks * 7;

        $yyyy_mm_dd_end = 
        $this->get_days_after(
            // $day_after=-1
            $days_after,
            // $target_YYYYMMDD=""
            $yyyy_mm_dd_begin
        );

        if(empty($yyyy_mm_dd_end)) {
            return;
        }

        $calendar_list = 
        $this->get(
            // $yyyy_mm_dd_begin=""
            $yyyy_mm_dd_begin
            // $yyyy_mm_dd_end=""
            , $yyyy_mm_dd_end
        );

        return $calendar_list;

    }
    public function get($yyyy_mm_dd_begin="", $yyyy_mm_dd_end="") 
    {
        if(empty($yyyy_mm_dd_begin)) 
        {
            return;
        }
        if(empty($yyyy_mm_dd_end)) 
        {
            return;
        }

        $date = $yyyy_mm_dd_begin;
        $end = $yyyy_mm_dd_end;
        $max_cnt = 365; // 1년 이상은 조회 불가.
        $list = array();

        // TODO - 1달전 데이터 가져오기. 달력 표시를 위해~

        for ($i=0; $i < $max_cnt; $i++) 
        { 
            if(strtotime($date) <= strtotime($end)) 
            {
                $result = date('Y-m-d-D', strtotime($date));
                array_push($list, $result);

                $date = date("Y-m-d", strtotime("+1 day", strtotime($date)));

            } 
            else 
            {
                // 1년 이상은 조회 불가.
                break;
            }
        }

        return $list;

    }
    private function get_date($year=-1, $month=-1, $days=-1) {

        if(!(1970 < $year)) {
            return;
        }
        if(!(0 < $month)) {
            return;
        }
        if(!(0 < $days)) {
            return;
        }

        $result = null;
        $time=mktime(12, 0, 0, $month, $d, $year);          
        if (date('m', $time)==$month) 
        {
            $result = date('Y-m-d-D', $time);
        }

        return $result;
    }

    public function get_now_YYYYMMDD() {
        return date('Y-m-d');
    }

    // TimeManager::get_days_ago(3);
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