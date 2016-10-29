<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * Custom Klass Calendar class
 * Provide Table format for Cafeclass
 *
 * @author    Wonder Jung, @cafeclass
 * @license   MIT
 */


class MY_KlassCalendar {

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

        if(!isset($this->CI->my_calendar)) {
            return;
        }
    }

    private function getKlassCalendarFrom_yyyy_mm_dd_DD ($date_list=null, $klass_course=null, $calendar_list=null)
    {
        // ["2016-10-01-Sat","2016-10-02-Sun",...] --> [new KlassCalendar(...), new KlassCalendar(...), ...]

        $has_class_began = false;
        $has_class_closed = false;
        $klass_cal_list = array();

        if(is_null($date_list))
        {
            return $klass_cal_list;
        }
        if(is_null($klass_course))
        {
            return $klass_course;
        }
        if(is_null($calendar_list))
        {
            return $klass_cal_list;
        }

        $date_end = "";
        if(!empty($date_list))
        {
            $date_end = $date_list[count($date_list) - 1];
        }
        
        for ($i=0; $i < count($calendar_list); $i++) 
        {

            // 2016-10-01-Sat
            $cal_date = $calendar_list[$i];

            $fragments = explode("-",$cal_date);
            if(empty($fragments) || 4 != count($fragments))
            {   
                // error report
                break;
            }
            $year = intval($fragments[0]);
            $month = intval($fragments[1]);
            $date = intval($fragments[2]);
            $day = $fragments[3];

            // KlassCalendar 객체를 만듭니다.
            $klassCalendar = new KlassCalendar($cal_date, $year, $month, $date, $day);

            if(0 === $i)
            {
                $klassCalendar->isFirstDay = true;
            }
            else if((count($calendar_list) - 1) === $i)
            {
                $klassCalendar->isLastDay = true;
            }

            $strpos = strpos(strtolower($cal_date), strtolower($klass_course->days));
            $is_klass_day = false;
            if(-1 < $strpos) 
            {
                // 수업이 있는 날짜입니다.
                $is_klass_day = true;
            }
            $strpos = -1;

            // 수업 시작 날짜 이전인지 검사.
            if(!$has_class_began)
            {
                $strpos = strpos(strtolower($cal_date), strtolower($klass_course->date_begin));
            }
            if(-1 < $strpos) 
            {
                $has_class_began = true;
            }
            $strpos = -1;

            // 수업 종료 날짜 이후인지 검사.
            if($has_class_began && !$has_class_closed && !empty($date_end)) 
            {
                $strpos = strpos(strtolower($cal_date), strtolower($date_end));
            }
            if(-1 < $strpos) 
            {
                $has_class_closed = true;
            }

            // 수업 시작 날짜이거나 그 이후, 수업 종료 이전이면서 수업 요일이면, KlassCalendar에 "수업있음" true
            if($has_class_began && !$has_class_closed &&  $is_klass_day)
            {
                $klassCalendar->hasKlass=true;
            }

            // 오늘 날짜까지는 Expired로 표시? --> Peter님과 논의 필요.
            $is_expired = false;
            $yyyy_mm_dd = "$year-$month-$date";
            $time_cal_date = strtotime($yyyy_mm_dd);

            $yyyy_mm_dd_now = $this->CI->my_calendar->get_now_YYYYMMDD();
            $time_now = strtotime($yyyy_mm_dd_now);
            if($time_cal_date < $time_now) {
                // 오늘보다 이전의 시간임.
                $klassCalendar->isExpired = true;
            }

            array_push($klass_cal_list, $klassCalendar);
        } // end for        

        return $klass_cal_list;

    }

    private function setMonthBeginsEndsLinear($klass_cal_list=null)
    {
        if(is_null($klass_cal_list))
        {
            return;
        }

        for ($i=0; $i < count($klass_cal_list); $i++) 
        {
            $klass_cal = $klass_cal_list[$i];

            if(0 === $i)
            {
                // 캘린더의 첫번째 날을 찾았습니다.
                $klass_cal->isFirstWeekOfMonth = true;
                $klass_cal->isFirstDayOfMonth = true;
                // 지금 달(month) 정보를 저장합니다.
                $month_prev = intval($klass_cal->month);

                continue;
            } 
            else if((count($klass_cal_list) - 1) === $i)
            {
                // 캘린더의 마지막 날을 찾았습니다.
                $klass_cal->isLastWeekOfMonth = true;
                $klass_cal->isLastDayOfMonth = true;
                continue;
            }

            if($month_prev !== intval($klass_cal->month))
            {
                // 다음 달로 넘어갔습니다.
                $klass_cal_prev = $klass_cal_list[($i - 1)];
                $klass_cal_prev->isLastWeekOfMonth = true;
                $klass_cal_prev->isLastDayOfMonth = true;

                $klass_cal->isFirstWeekOfMonth = true;
                $klass_cal->isFirstDayOfMonth = true;

                // 다음 달을 비교할 정보로 저장.
                $month_prev = intval($klass_cal->month);
            }
        } // end for

        return $klass_cal_list;
    } 

    private function setEdgeOfMonthNWeek($real_cal_list=null)
    {
        for ($i=0; $i < count($real_cal_list); $i++) 
        {

            $row = $real_cal_list[$i];

            $field_first = $row[0];
            $field_last = $row[count($row) - 1];
            if(!is_null($field_first))
            {
                // 한 주(week)의 첫번째 날
                $field_first->isFirstDayOfWeek = true;
            }
            if(!is_null($field_last))
            {
                // 한 주(week)의 첫번째 날
                $field_last->isLastDayOfWeek = true;
            }

            // 각 달의 경계가 되는 시작, 끝 주(week)에 포함된 날들을 찾아 표시해줍니다.
            $isFirstDayOfMonth = false;
            $isLastDayOfMonth = false;
            $month_matched = -1;
            for ($j=0; $j < count($row); $j++) 
            {
                $field = $row[$j];
                if(is_null($field))
                {
                    continue;
                }

                if(!$isFirstDayOfMonth && $field->isFirstDayOfMonth)
                {
                    $isFirstDayOfMonth = true;
                    $month_matched_first_day = intval($field->month);
                }
                if(!$isLastDayOfMonth && $field->isLastDayOfMonth)
                {
                    $isLastDayOfMonth = true;
                    $month_matched_last_day = intval($field->month);
                }
            }

            if($isFirstDayOfMonth)
            {
                // 이번달의 첫번째 주(week)입니다.
                for ($j=0; $j < count($row); $j++) 
                {
                    $field = $row[$j];
                    if(is_null($field))
                    {
                        continue;
                    }
                    if($month_matched_first_day !== intval($field->month))
                    {
                        continue;   
                    }

                    $field->isFirstWeekOfMonth = true;

                    if(0 === $i)
                    {
                        // 달력의 첫 주.
                        $field->isFirstWeek = true;
                    } // end if
                } // end for

                // 월별 이름 표시를 위해 2주차 화요일에 플래그 값을 준다.
                $row_2nd_week = $real_cal_list[($i + 1)];
                $wendesday = null;
                if(!empty($row_2nd_week))
                {
                    $wendesday = $row_2nd_week[3];
                }
                if(!is_null($wendesday))
                {
                    $wendesday->isMonthIndicator = true;
                }
            }
            if($isLastDayOfMonth)
            {
                // 이번달의 마지막 주(week)입니다.
                for ($j=0; $j < count($row); $j++) 
                {
                    $field = $row[$j];
                    if(is_null($field))
                    {
                        continue;
                    }
                    if($month_matched_last_day !== intval($field->month))
                    {
                        continue;
                    }
                    $field->isLastWeekOfMonth = true;

                    if((count($real_cal_list) - 1) === $i)
                    {
                        // 달력의 마지막 주.
                        $field->isLastWeek = true;
                    } // end if
                } // end for
            } // end if
        }

        return $real_cal_list;
    }

    private function getCalendarTableLinear($klass_cal_list=null)
    {

        // 매달 캘린더 정보를 선형(linear) 방식으로 리스트로 하나로 보여줍니다.
        // 실제 달력의 형태와 동일한 2차 배열을 만듭니다.
        $real_cal_list = array();
        $week_days = ["sun","mon","tue","wed","thu","fri","sat"];
        $week_days_length = count($week_days);

        // 1개월, 2개월, 3개월일 경우 최대 표시 주수가 다릅니다.
        $klass_cnt = count($klass_cal_list);
        $klass_week_cnt = intval($klass_cnt/$week_days_length) + 2;
        $row_weeks_max = $klass_week_cnt;

        $offset = -1;
        for ($i=0; $i < $row_weeks_max; $i++) 
        { 

            $real_cal_row_list = array();
            $isNullList = true;
            for ($j=0; $j < $week_days_length; $j++) 
            { 
                $cur_day = $week_days[$j];

                if($offset < 0)
                {
                    // 달력 날짜가 지정되지 않았습니다.
                    $klass_cal = $klass_cal_list[0];
                    if(strtolower($cur_day) === strtolower($klass_cal->day))
                    {
                        // 같은 요일 발견!
                        $offset = $j;
                    }
                }

                // $klass_cal_list에 사용할 인덱스를 구합니다.
                $idx_for_klass_cal = -1;
                if(-1 < $offset)
                {
                    $idx_for_klass_cal = ($i * $week_days_length) + $j - $offset;
                }                

                $next_klass_cal = null;
                if(-1 < $idx_for_klass_cal && $idx_for_klass_cal < count($klass_cal_list))
                {
                    $next_klass_cal = $klass_cal_list[$idx_for_klass_cal];
                }

                if(!is_null($next_klass_cal))
                {
                    // 달력 위에 표시될 날짜 객체를 넣어줍니다.
                    array_push($real_cal_row_list, $next_klass_cal);
                    $isNullList = false;
                }
                else 
                {   
                    // 달력 위의 빈 날짜는 null로 채워줍니다.
                    array_push($real_cal_row_list, null);
                }

            }

            if($isNullList) {
                continue;
            }

            array_push($real_cal_list, $real_cal_row_list);
        } // end for

        // 정제된 캘린더 데이터로 각 달(month)의 경계가 되는 주(week)의 대한 정보를 추가합니다.

        $real_cal_list = $this->setEdgeOfMonthNWeek($real_cal_list);

        return $real_cal_list;
    }

    /*
    private function getCalendarTableMonthly($klass_cal_list=null)
    {
        // $klass_cal_list를 월별로 분리합니다.
        $k_cal_monthly_list_group = array();
        $k_cal_list = array();
        for ($i=0; $i < count($klass_cal_list); $i++) { 
            $klass_cal = $klass_cal_list[$i];

            if($klass_cal->isFirstDayOfMonth)
            {
                if(!empty($k_cal_list))
                {
                    array_push($k_cal_monthly_list_group, $k_cal_list);
                }
                $k_cal_list = array();
            }
            else if((count($klass_cal_list) - 1) === $i)
            {
                // Last idx
                if(!empty($k_cal_list))
                {
                    array_push($k_cal_monthly_list_group, $k_cal_list);
                }
            }

            array_push($k_cal_list, $klass_cal);
        }

        // 월별로 달력 테이블 배열을 만듭니다.
        $cal_table_list = array();
        for ($i=0; $i < count($k_cal_monthly_list_group); $i++) { 
            $k_cal_list = $k_cal_monthly_list_group[$i];
            $cal_table = $this->getCalendarTableLinear($k_cal_list);

            if(!is_null($cal_table))
            {
                array_push($cal_table_list, $cal_table);
            }
        }

        // wonder.jung
        return $cal_table_list;
    }
    */

    public function getLinear($klass_course=null, $calendar_list=null)
    {
        if(empty($calendar_list))
        {
            return;
        }
        if(is_null($klass_course)) 
        {
            return;
        }
        if(!$this->CI->my_paramchecker->is_ok("klass_day", $klass_course->days))
        {
            return;
        }

        // ex) begin : 10-29 / end : 11-21 --> ["2016-10-01-Mon", "2016-10-02-Tue", "2016-10-03-Wed", ..., "2016-11-29-Sat", "2016-11-30-Sat"]
        $date_list = $this->CI->my_calendar->get_weeks($klass_course->date_begin, $klass_course->week_max);

        // ["2016-10-01-Sat","2016-10-02-Sun",...] --> [new KlassCalendar(...), new KlassCalendar(...), ...]
        $klass_cal_list = $this->getKlassCalendarFrom_yyyy_mm_dd_DD($date_list, $klass_course, $calendar_list);

        // 일차원 배열에서 각 달(Month)의 경계를 찾아 플래그 값을 넣습니다.
        $klass_cal_list = $this->setMonthBeginsEndsLinear($klass_cal_list);

        // 매달 캘린더 정보를 선형(linear) 방식으로 리스트로 하나로 보여줍니다.
        // 실제 달력의 형태와 동일한 2차 배열을 만듭니다.
        $klass_cal_list = $this->getCalendarTableLinear($klass_cal_list);

        return $klass_cal_list;
    }

    public function getMonthly($klass_course=null, $calendar_list=null)
    {
        if(empty($calendar_list))
        {
            return;
        }
        if(is_null($klass_course)) 
        {
            return;
        }
        if(!$this->CI->my_paramchecker->is_ok("klass_day", $klass_course->days))
        {
            return;
        }

        // ex) begin : 10-29 / end : 11-21 --> ["2016-10-01-Mon", "2016-10-02-Tue", "2016-10-03-Wed", ..., "2016-11-29-Sat", "2016-11-30-Sat"]
        $date_list = $this->CI->my_calendar->get_weeks($klass_course->date_begin, $klass_course->week_max);

        // ["2016-10-01-Sat","2016-10-02-Sun",...] --> [new KlassCalendar(...), new KlassCalendar(...), ...]
        $klass_cal_list = $this->getKlassCalendarFrom_yyyy_mm_dd_DD($date_list, $klass_course, $calendar_list);

        // 월별로 리스트를 분리합니다.
        $has_changed = false;
        $month_prev = -1;
        $klass_monthly_list = array();
        $klass_monthly_list_group = array();
        for ($i=0; $i < count($klass_cal_list); $i++) 
        { 
            $klass_cal = $klass_cal_list[$i];
            if($month_prev < 0) 
            {
                $month_prev = intval($klass_cal->month);
                array_push($klass_monthly_list, $klass_cal);
                continue;
            } 
            else if($month_prev !== intval($klass_cal->month))
            {
                $month_prev = intval($klass_cal->month);
                array_push($klass_monthly_list_group, $klass_monthly_list);
                $klass_monthly_list = array();
            }
            else if((count($klass_cal_list) - 1) === $i)
            {
                // last idx
                array_push($klass_monthly_list_group, $klass_monthly_list);
            }

            array_push($klass_monthly_list, $klass_cal);
        }

        // 일차원 배열에서 각 달(Month)의 경계를 찾아 플래그 값을 넣습니다.
        $klass_monthly_list_group_next = array();
        for ($i=0; $i < count($klass_monthly_list_group); $i++)
        {
            $klass_monthly_list = $klass_monthly_list_group[$i];
            $klass_monthly_list = $this->setMonthBeginsEndsLinear($klass_monthly_list);
            array_push($klass_monthly_list_group_next, $klass_monthly_list);
        }
        $klass_monthly_list_group = $klass_monthly_list_group_next;

        // 매달 캘린더 정보를 선형(linear) 방식으로 리스트로 하나로 보여줍니다.
        // 실제 달력의 형태와 동일한 2차 배열을 만듭니다.
        // $klass_cal_list = $this->getCalendarTableMonthly($klass_cal_list);
        $klass_monthly_list_group_next = array();
        for ($i=0; $i < count($klass_monthly_list_group); $i++)
        {
            $klass_monthly_list = $klass_monthly_list_group[$i];
            $klass_monthly_list = $this->getCalendarTableLinear($klass_monthly_list);
            array_push($klass_monthly_list_group_next, $klass_monthly_list);
        }
        $klass_monthly_list_group = $klass_monthly_list_group_next;

        return $klass_monthly_list_group;

    }
}