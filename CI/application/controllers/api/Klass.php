<?php

defined('BASEPATH') OR exit('No direct script access allowed');

// This can be removed if you use __autoload() in config.php OR use Modular Extensions
require APPPATH . '/libraries/REST_Controller.php';
require APPPATH . '/libraries/MY_Class.php';
require APPPATH . '/models/SelectTile.php';
require APPPATH . '/models/KlassCourse.php';
require APPPATH . '/models/KlassKeyword.php';
require APPPATH . '/models/KlassLevel.php';
require APPPATH . '/models/KlassStation.php';
require APPPATH . '/models/KlassDay.php';
require APPPATH . '/models/KlassTime.php';
require APPPATH . '/models/KlassCalendar.php';


/**
 * This is an example of a few basic user interaction methods you could use
 * all done with a hardcoded array
 *
 * @package         CodeIgniter
 * @subpackage      Rest Server
 * @category        Controller
 * @author          Phil Sturgeon, Chris Kacerguis
 * @license         MIT
 * @link            https://github.com/chriskacerguis/codeigniter-restserver
 */
class Klass extends REST_Controller implements MY_Class{

    function __construct()
    {
        // Construct the parent class
        parent::__construct();

        // Configure limits on our controller methods
        // Ensure you have created the 'limits' table and enabled 'limits' within application/config/rest.php
        // $this->methods['list_get']['limit'] = 500; // 500 requests per hour per user/key

        // init database
        $this->load->database();

        // init path util
        $this->load->library('MY_Path');

        // init error logger
        $this->load->library('MY_Error');

        // init param checker
        $this->load->library('MY_ParamChecker');

        // init MyReponse
        $this->load->library('MY_Response');

        // init MyTime
        $this->load->library('MY_Time');

        // init MyCalendar
        $this->load->library('MY_Calendar');
            
        // Set time zone as Seoul
        date_default_timezone_set('Asia/Seoul');
    }

    public function is_not_ok() {
        return !$this->is_ok();
    }
    public function is_ok() {

        $is_ok = true;
        if($this->my_error->hasError()) {
            $response_body = 
            $this->my_response->getResBodyFail(
                // $message=""
                MY_Response::$EVENT_UNKNOWN_ERROR_OCCURED, 
                // $query="" 
                "", 
                // $data=null 
                null, 
                // $error=null 
                $this->my_error->get(),
                // $extra=null
                null
            );
            $this->set_response($response_body, REST_Controller::HTTP_OK); 
            $is_ok = false;
        }

        return $is_ok;
    }

    public function selectile_get() {

        if($this->is_not_ok()) {
            return;
        }

        $output = array();
        $is_ok = true;

        $output['levels'] = $this->get_levels();
        if(is_null($output['levels']) || empty($output['levels'])) {
            $is_ok = false;
        }
        $output['stations'] = $this->get_stations();
        if(is_null($output['stations']) || empty($output['stations'])) {
            $is_ok = false;
        }
        $output['days'] = $this->get_days();
        if(is_null($output['days']) || empty($output['days'])) {
            $is_ok = false;
        }
        $output['times'] = $this->get_times();
        if(is_null($output['times']) || empty($output['times'])) {
            $is_ok = false;
        }

        $response_body = array();
        if ($is_ok)
        {
            $response_body = 
            $this->my_response->getResBodySuccess(
                // $query="" 
                "", 
                // $data=null 
                $output, 
                // $error=null 
                $this->my_error->get(),
                // $extra=null
                null
            );
        }
        else
        {
            $response_body = 
            $this->my_response->getResBodyFail(
                // $message=""
                'Selectile is not valid!', 
                // $query="" 
                "", 
                // $data=null 
                $output, 
                // $error=null 
                $this->my_error->get(),
                // $extra=null
                null
            );
        }        

        $this->set_response($response_body, REST_Controller::HTTP_OK);

    }

    private function convertKlassCalendar($klass_course=null, $calendar_list=null) 
    {
        if(empty($calendar_list))
        {
            return;
        }
        if(is_null($klass_course)) 
        {
            return;
        }
        if(!$this->my_paramchecker->is_ok("klass_day", $klass_course->days))
        {
            return;
        }

        $has_class_began = false;
        $has_class_closed = false;
        $klass_cal_list = array();

        // 수업이 종료되는 날짜를 가져옵니다.
        $date_list = $this->my_calendar->get_weeks($klass_course->date_begin, $klass_course->week_max);
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

            $yyyy_mm_dd_now = $this->my_calendar->get_now_YYYYMMDD();
            $time_now = strtotime($yyyy_mm_dd_now);
            if($time_cal_date < $time_now) {
                // 오늘보다 이전의 시간임.
                $klassCalendar->isExpired = true;
            }

            array_push($klass_cal_list, $klassCalendar);
        }

        // 실제 달력의 형태와 동일한 2차 배열을 만듭니다.
        $real_cal_list = array();
        $week_days = ["sun","mon","tue","wed","thu","fri","sat"];
        $week_days_length = count($week_days);

        // 1개월, 2개월, 3개월일 경우 최대 표시 주수가 다릅니다.
        $klass_cnt = count($calendar_list);
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
                    // 달력위에 표시될 날짜 객체를 넣어줍니다.
                    array_push($real_cal_row_list, $next_klass_cal);
                    $isNullList = false;
                }
                else 
                {   
                    // 달력위의 빈 날짜는 null로 채워줍니다.
                    array_push($real_cal_row_list, null);
                }

            }

            if(!$isNullList) 
            {
                array_push($real_cal_list, $real_cal_row_list);
            }
        }

        return $real_cal_list;
    }

    public function course_get()
    {
        if($this->is_not_ok()) 
        {
            return;
        }

        $extra = array();
        $extra['id'] = $id = $this->my_paramchecker->get('id','klass_id');

        $extra['check_list'] = $check_list = $this->my_paramchecker->get_check_list();
        
        $this->db->where('id', $id);
        $limit = 1;
        $offset = 0;
        $query = $this->db->get('klass', $limit, $offset);
        $klass_list = $this->add_klass_extra_info($query);
        $klass = null;
        if(!empty($klass_list)) 
        {
            $klass = $klass_list[0];

            $calendar_list = 
            $this->my_calendar->get_date_list_by_month(
                $klass->date_begin, 
                intval($klass->week_max)
            );

            $klass_cal_table = $this->convertKlassCalendar($klass, $calendar_list);

            $klass->calendar_table = $klass_cal_table;
        }

        // REFACTOR ME
        $last_query = $this->db->last_query();
        if (!empty($klass))
        {
            $response_body = 
            $this->my_response->getResBodySuccess(
                $last_query, 
                $klass, 
                $this->my_error->get(),
                $extra
            );
        }
        else
        {
            $response_body = 
            $this->my_response->getResBodyFail(
                'Klass could not be found', 
                $last_query, 
                null, 
                $this->my_error->get(),
                $extra
            );
        }
        $this->set_response($response_body, REST_Controller::HTTP_OK); 
    }    

    public function list_get()
    {
        if($this->is_not_ok()) {
            return;
        }

        $check_list = $this->my_paramchecker->get_check_list();
        
        $query = $this->db->query('SELECT * FROM klass ORDER BY id DESC');

        $classes = $query->result();
        $output = $this->add_klass_extra_info($query);
        $last_query = $this->db->last_query();
        if (!empty($classes))
        {
            $response_body = 
            $this->my_response->getResBodySuccess(
                $last_query, 
                $output, 
                $this->my_error->get(),
                $check_list
            );
        }
        else
        {
            $response_body = 
            $this->my_response->getResBodyFail(
                'Klass could not be found', 
                $last_query, 
                $output, 
                $this->my_error->get(),
                $check_list
            );
        }
        $this->set_response($response_body, REST_Controller::HTTP_OK); 
    }

    public function search_get() 
    {
        if($this->is_not_ok()) {
            return;
        }

        // CHECKS PARAMS
        $extra = array();
        $extra['q'] = $q = $this->my_paramchecker->get('q','klass_query');
        $extra['level'] = $level = $this->my_paramchecker->get('level','klass_level');
        $extra['station'] = $station = $this->my_paramchecker->get('station','klass_station');
        $extra['day'] = $day = $this->my_paramchecker->get('day','klass_day');
        $extra['time'] = $time = $this->my_paramchecker->get('time','klass_time');
        $extra['check_list'] = $check_list = $this->my_paramchecker->get_check_list();

        // DB QUERY
        // 유효한 파라미터들만 검색에 사용한다.
        $where_conditions = array();
        if(isset($level))
        {
            $this->db->where('level', $level);
        }
        if(isset($station))
        {
            $this->db->where('venue_subway_station', $station);
        }
        if(isset($day))
        {
            $this->db->where('days', $day);
        }
        if(isset($q)) 
        {
            $keyword_list = explode("|",$q);
            $extra['keyword_list'] = $keyword_list;

            $like_cnt = 0;
            for ($i=0; $i < count($keyword_list); $i++) 
            { 
                $keyword = $keyword_list[$i];

                if(empty($keyword)) 
                {
                    continue;
                }

                if(0 === $like_cnt) 
                {
                    // escaped automatically in 'like' or 'or_like'
                    $this->db->like('title', $keyword);
                    $this->db->or_like('desc', $keyword);
                }
                else
                {
                    $this->db->or_like('title', $keyword);
                    $this->db->or_like('desc', $keyword);
                }

                $like_cnt++;
            }
        }
        // Set time range
        // 시간 관련 검색은 범위를 가져와야 한다.
        $extra['time_begin'] = 
        $time_begin = 
        $this->my_paramchecker->get_const_from_list(
            $time, 
            'class_times_list', 
            'class_times_range_list'
        );
        $extra['time_end'] = 
        $time_end = 
        $this->my_paramchecker->get_const_from_list(
            $time, 
            'class_times_list', 
            'class_times_range_list', 
            1
        );
        $time_begin_HHmm = "";
        $time_end_HHmm = "";
        if(is_numeric($time_begin) && is_numeric($time_end))
        {
            $time_begin_HHmm = $this->my_time->digit_to_HHmm($time_begin);
            $time_end_HHmm = $this->my_time->digit_to_HHmm($time_end, true);
        }
        if( $this->my_time->is_valid_HHmm($time_begin_HHmm) && 
            $this->my_time->is_valid_HHmm($time_end_HHmm)) 
        {
            $this->db->where('time_begin >=', $time_begin_HHmm);
            $this->db->where('time_end <=', $time_end_HHmm);

        }
        $this->db->order_by('id', 'DESC');

        // DB WORKS
        $limit = 30;
        $offset = 0;
        $query = $this->db->get('klass', $limit, $offset);

        // RESULT
        $classes = $query->result();
        $last_query = $this->db->last_query();
        if (!empty($classes))
        {
            $last_query = $this->db->last_query();
            $output = $this->add_klass_extra_info($query);
            $response_body = 
            $this->my_response->getResBodySuccess(
                $last_query, 
                $output, 
                $this->my_error->get(),
                $extra
            );
        }
        else
        {
            // 조회한 결과가 없는 경우, "수업없음" 클래스 정보를 내려준다.
            $course = $this->get_klass_course_no_class();
            $output = array($course);

            $response_body = 
            $this->my_response->getResBodySuccess(
                $last_query, 
                $output, 
                $this->my_error->get(),
                $extra
            );
        }
        $this->set_response($response_body, REST_Controller::HTTP_OK); 
        
    }

    // 수정 및 변경은 admin 패키지에서 진행함.
    /*
    public function insert_post() {

        if($this->is_not_ok()) {
            return;
        }        

        // TODO 지정된 파라미터만 통과, json으로 파라미터 validation 하도록 변경. 
        $name = $this->post('name');
        $name_escaped = $this->db->escape($name);

        // TODO - 입력하는 문자열 검증 필요. wonder.jung
        if(empty($name_escaped)) {

            $response_body = [
                'status' => FALSE,
                'message' => '!empty(\$name_escaped)',
                'data' => null
            ];
            
        } else {

            // TODO - 쿼리 빌더 사용해보기.
            $this->db->query("INSERT INTO `z_test_user`(`name`) VALUES (" . $name_escaped . ")");

            $query = $this->db->query("SELECT id, name FROM z_test_user WHERE name=" . $name_escaped);
            $user_inserted = $query->result();

            $response_body = [
                'status' => TRUE,
                'message' => 'Success',
                'data' => $user_inserted
            ];

        }

        // OK (200) being the HTTP response code
        $this->set_response($response_body, REST_Controller::HTTP_OK);

    }

    public function update_get($id=0) {

        if($this->is_not_ok()) {
            return;
        }

        $response_body = [
            'status' => TRUE,
            'message' => 'TEST',
            'data' => null
        ];

        $this->set_response($response_body, REST_Controller::HTTP_OK);

    }

    public function update_post($id=0) {

        if($this->is_not_ok()) {
            return;
        }

        $name = $this->post('name');
        // 문자열인 경우는 아래 절차를 반드시 거쳐야 함.
        $name_escaped = $this->db->escape($name);


        if((0 < $id) && !empty($name_escaped)) {

            // 유효한 이름값을 넘겨주었다면 업데이트를 진행합니다.
            $query = $this->db->query("SELECT id, name FROM z_test_user WHERE id=" . $id);
            $user = $query->result();

            $error = null;
            if ( is_null($error) && ! $this->db->simple_query("UPDATE z_test_user SET `name`=" . $name_escaped . " WHERE `id`=" . $id))
            {
                $error = $this->db->error(); // Has keys 'code' and 'message'
            }

            $query = $this->db->query("SELECT id, name FROM z_test_user WHERE id=" . $id);
            $user_modified = $query->result();

            // 이전 객체, 이후 객체 비교.
            $data = [
                "user" => $user,
                "user_modified" => $user_modified,
                "id" => $id,
                "name" => $name
            ];

            if(!is_null($error)) {

                $response_body = [
                    'status' => FALSE,
                    'message' => 'Success',
                    'error' => $error,
                    'data' => $data
                ];

            } else {

                $response_body = [
                    'status' => TRUE,
                    'message' => 'Success',
                    'data' => $data
                ];

            }

        } else {

            // 업데이트할 정보가 유효하지 않습니다. 실행을 중단합니다.
            $data = [
                "id" => $id,
                "name" => $name
            ];

            $response_body = [
                'status' => TRUE,
                'message' => 'param is not valid!',
                'data' => $data
            ];
            
        }

        // OK (200) being the HTTP response code
        $this->set_response($response_body, REST_Controller::HTTP_OK);
    }

    public function delete_post($id=0) {

        if($this->is_not_ok()) {
            return;
        }

        // $id = $this->post('id');
        $id = intval($id);

        if(0 < $id) {

            // TODO - 쿼리 빌더 사용해보기.
            $this->db->query("DELETE FROM `z_test_user` WHERE id=" . $id);

            $response_body = [
                'status' => TRUE,
                'message' => 'Success',
                'query' => $this->db->last_query(), // DEBUGGING 모드일때만 제공되는 파라미터
                'data' => null
            ];

            $this->set_response($response_body, REST_Controller::HTTP_OK);
            
        } else {

            $response_body = [
                'status' => FALSE,
                'message' => '\$id is not valid!',
                'query' => $this->db->last_query(), // DEBUGGING 모드일때만 제공되는 파라미터
                'data' => null
            ];

            $this->set_response($response_body, REST_Controller::HTTP_OK);

        }

    }  
    */  

    private function get_klass_course_new_class() {

        if($this->is_not_ok()) {
            return;
        }

        $klass_course = new KlassCourse();
        $klass_course->class_img_url = 
        $this->my_paramchecker->get_const_from_list(
            'new_class', 
            'klass_event_img_list', 
            'klass_event_img_url_list'
        );

        return $klass_course;
    }

    private function get_klass_course_no_class() {

        if($this->is_not_ok()) {
            return;
        }
        
        $klass_course = new KlassCourse();
        $klass_course->class_img_url = 
        $this->my_paramchecker->get_const_from_list(
            'no_class', 
            'klass_event_img_list', 
            'klass_event_img_url_list'
        );
        $klass_course->price_with_format="0";

        return $klass_course;
    }

    private function get_klass_course_no_image() {

        if($this->is_not_ok()) {
            return;
        }

        $klass_course = new KlassCourse();
        $klass_course->class_img_url = 
        $this->my_paramchecker->get_const_from_list(
            'no_image', 
            'klass_event_img_list', 
            'klass_event_img_url_list'
        );
        $klass_course->price_with_format="0";

        return $klass_course;
    }

    private function get_klass_course_error() {

        if($this->is_not_ok()) {
            return;
        }
        
        $klass_course = new KlassCourse();
        $klass_course->class_img_url = 
        $this->my_paramchecker->get_const_from_list(
            'error', 
            'klass_event_img_list', 
            'klass_event_img_url_list'
        );
        $klass_course->price_with_format="0";

        return $klass_course;
    }

    private function get_levels() {

        if($this->is_not_ok()) {
            return;
        }

        $const_map = $this->my_paramchecker->get_const_map();

        $class_level_list = $const_map->class_level_list;
        $class_level_eng_list = $const_map->class_level_eng_list;
        $class_level_kor_list = $const_map->class_level_kor_list;
        $class_level_img_url_list = $const_map->class_level_img_url_list;

        // check list is valid
        $is_valid = true;
        if(count($class_level_list) !== count($class_level_eng_list)) {
            $is_valid = false;
        } else if(count($class_level_list) !== count($class_level_kor_list)) {
            $is_valid = false;
        } else if(count($class_level_list) !== count($class_level_img_url_list)) {
            $is_valid = false;
        }
        $klass_level_list = array();
        if(!$is_valid) {
            return $klass_level_list;
        }
        
        for ($i=0; $i < count($class_level_list); $i++) { 

            $key = $class_level_list[$i];
            $name_eng = $class_level_eng_list[$i];
            $name_kor = $class_level_kor_list[$i];
            $img_url = $class_level_img_url_list[$i];

            $level_obj = new KlassLevel($key, $name_eng, $name_kor, $img_url);

            array_push($klass_level_list, $level_obj);

        }  
        
        return $klass_level_list;    
    }
    public function level_get() {

        if($this->is_not_ok()) {
            return;
        }

        $obj_list = $this->get_levels();

        $response_body = [
            'status' => TRUE,
            'message' => 'Success',
            'data' => $obj_list
        ];
        $this->set_response($response_body, REST_Controller::HTTP_OK);

    }

    private function get_stations() {

        if($this->is_not_ok()) {
            return;
        }

        $const_map = $this->my_paramchecker->get_const_map();

        $subway_station_list = 
        $const_map->class_venue_subway_station_list;
        $subway_station_eng_list = 
        $const_map->class_venue_subway_station_eng_list;
        $subway_station_kor_list = 
        $const_map->class_venue_subway_station_kor_list;
        $subway_station_img_url_list = 
        $const_map->class_venue_subway_station_img_url_list;

        // check list is valid
        $is_valid = true;
        if(count($subway_station_list) !== count($subway_station_eng_list)) 
        {
            $is_valid = false;
        }
        if(count($subway_station_list) !== count($subway_station_kor_list)) 
        {
            $is_valid = false;
        }
        if(count($subway_station_list) !== count($subway_station_img_url_list)) 
        {
            $is_valid = false;
        }

        $klass_station_list = array();
        if(!$is_valid) 
        {
            return $klass_station_list;
        }
        
        for ($i=0; $i < count($subway_station_list); $i++) 
        { 

            $key = $subway_station_list[$i];
            $name_eng = $subway_station_eng_list[$i];
            $name_kor = $subway_station_kor_list[$i];
            $img_url = $subway_station_img_url_list[$i];

            $station_obj = new KlassStation($key, $name_eng, $name_kor, $img_url);

            array_push($klass_station_list, $station_obj);

        }

        return $klass_station_list;       
    }
    public function station_get() {

        if($this->is_not_ok()) {
            return;
        }

        $obj_list = $this->get_stations();

        $response_body = 
        [
            'status' => TRUE,
            'message' => 'Success',
            'data' => $obj_list
        ];
        $this->set_response($response_body, REST_Controller::HTTP_OK);

    }  

    private function get_days() {

        if($this->is_not_ok()) {
            return;
        }

        $const_map = $this->my_paramchecker->get_const_map();

        $class_days_list = $const_map->class_days_list;
        $class_days_eng_list = $const_map->class_days_eng_list;
        $class_days_kor_list = $const_map->class_days_kor_list;
        $class_days_img_url_list = $const_map->class_days_img_url_list;

        // check list is valid
        $is_valid = true;
        if(count($class_days_list) !== count($class_days_eng_list)) 
        {
            $is_valid = false;
        }
        else if(count($class_days_list) !== count($class_days_kor_list)) 
        {
            $is_valid = false;
        }
        else if(count($class_days_list) !== count($class_days_img_url_list)) 
        {
            $is_valid = false;
        }
        $klass_day_list = array();
        if(!$is_valid) 
        {
            return $klass_day_list;
        }
        
        for ($i=0; $i < count($class_days_list); $i++) { 

            $key = $class_days_list[$i];
            $name_eng = $class_days_eng_list[$i];
            $name_kor = $class_days_kor_list[$i];
            $img_url = $class_days_img_url_list[$i];

            $day_obj = new KlassDay($key, $name_eng, $name_kor, $img_url);

            array_push($klass_day_list, $day_obj);

        }  

        return $klass_day_list;
    }
    public function day_get() 
    {
        if($this->is_not_ok()) {
            return;
        }

        $obj_list = $this->get_days();

        $response_body = [
            'status' => TRUE,
            'message' => 'Success',
            'data' => $obj_list
        ];
        $this->set_response($response_body, REST_Controller::HTTP_OK);

    } 

    private function get_times() {

        if($this->is_not_ok()) {
            return;
        }

        $const_map = $this->my_paramchecker->get_const_map();

        $klass_times_list = $const_map->class_times_list;
        $klass_times_eng_list = $const_map->class_times_eng_list;
        $klass_times_kor_list = $const_map->class_times_kor_list;
        $klass_times_img_url_list = $const_map->class_times_img_url_list;

        // check list is valid
        $is_valid = true;
        if(count($klass_times_list) !== count($klass_times_img_url_list)) 
        {
            $is_valid = false;
        }
        $klass_time_list = array();
        if(!$is_valid) 
        {
            // 클래스 레벨의 배열이 길이가 다릅니다. 실행을 중단합니다.
            return $klass_time_list;
        }
        
        for ($i=0; $i < count($klass_times_list); $i++) 
        {
            $key = $klass_times_list[$i];
            $name_eng = $klass_times_eng_list[$i];
            $name_kor = $klass_times_kor_list[$i];
            $img_url = $klass_times_img_url_list[$i];

            $time_obj = new KlassTime($key, $name_eng, $name_kor, $img_url);

            array_push($klass_time_list, $time_obj);
        }

        return $klass_time_list;
    }
    public function time_get() 
    {
        if($this->is_not_ok()) {
            return;
        }

        $obj_list = $this->get_times();

        $response_body = 
        [
            'status' => TRUE,
            'message' => 'Success',
            'data' => $obj_list
        ];
        $this->set_response($response_body, REST_Controller::HTTP_OK);
    } 

    private function add_klass_extra_info($query=null) 
    {
        if($this->is_not_ok()) {
            return;
        }

        if(is_null($query)) {
            return;
        }

        $const_map = $this->my_paramchecker->get_const_map();
        if(is_null($const_map)) {
            return;
        }
        $rows = $query->custom_result_object('KlassCourse');
        $output = array();
        foreach ($rows as $row)
        {
            // 추가할 정보들을 넣는다.
            $row->time_begin_img_url($const_map, $this->my_path);
            $row->level_img_url($const_map, $this->my_path);
            $row->days_img_url($const_map, $this->my_path);
            $row->venue_subway_station_img_url($const_map, $this->my_path);
            $row->venue_cafe_logo_img_url($const_map, $this->my_path);
            $row->price_with_format();
            $row->weeks_to_months();

            // 이미지 주소가 http|https로 시작되지 않을 경우는 내부 주소로 파악, web root domain을 찾아 추가해준다.
            $row->class_img_err_url = $this->my_path->get("/assets/images/event/error.svg");
            $row->class_img_url = $this->my_path->get("/assets/images/class/test.jpg");

            // 주당 수업 가격에 대해 계산한다.
            // 기본 4주/8주/12주 단위로 제공된다. 수업 기간에 따라 가격표가 최대 3개까지 표시될 수 있다.
            // 최소 주당 단위가 수업 주수를 결정하는 단위가 된다.
            $price = $row->price = intval($row->price);
            $week_max = $row->week_max = intval($row->week_max);
            $week_min = $row->week_min = intval($row->week_min);
            $week_unit_cnt = ($week_max / $week_min);

            // 주당 가격 산정은 다음과 같다. 
            // 최소 수업 단위 가격 =  수업가격 / 최소 주 수업
            $fee_per_a_week = $price/$week_min;

            $row->week_list = array();
            $row->price_list = array();
            $row->weekly_price_list = array();
            for ($i=1; $i <= $week_unit_cnt; $i++) { 
                $next_weeks = $week_min * $i;
                array_push($row->week_list, $next_weeks);
                $next_price = $fee_per_a_week * $week_min * $i;
                array_push($row->price_list, $next_price);

                $weeky_price = [
                    'weeks'=>$next_weeks,
                    'price'=>$next_price
                ];
                array_push($row->weekly_price_list, $weeky_price);
            }
            
            array_push($output, $row);
        }

        return $output;
    }    

}
