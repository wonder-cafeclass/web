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
require APPPATH . '/models/KlassReview.php';
require APPPATH . '/models/KlassQuestion.php';


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
class Klass_ extends REST_Controller implements MY_Class{

    function __construct()
    {
        // Construct the parent class
        parent::__construct();

        // Configure limits on our controller methods
        // Ensure you have created the 'limits' table and enabled 'limits' within application/config/rest.php
        // $this->methods['list_get']['limit'] = 500; // 500 requests per hour per user/key

        // init database
        $this->load->database();

        // init error logger
        $this->load->library('MY_Error');

        // init path util
        $this->load->library('MY_Path');

        // init param checker
        $this->load->library('MY_ParamChecker');

        // init MyReponse
        $this->load->library('MY_Response');

        // init MyTime
        $this->load->library('MY_Time');

        // init MyCalendar
        $this->load->library('MY_Calendar');

        // init MyKlassCalendar
        $this->load->library('MY_KlassCalendar', ['my_calendar'=>$this->my_calendar]);
            
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

    public function course_get()
    {
        if($this->is_not_ok()) 
        {
            return;
        }

        $extra = array();
        $extra['id'] = $id = $this->my_paramchecker->get('id','klass_id');

        $extra['check_list'] = $check_list = $this->my_paramchecker->get_check_list();

        $query_arr = array();
        
        // 수업 - klass 정보를 가져옵니다.
        $this->db->where('id', $id);
        $limit = 1;
        $offset = 0;
        $query = $this->db->get('klass', $limit, $offset);
        $klass_list = $this->add_klass_extra_info($query);
        $klass = null;
        if(!empty($klass_list)) 
        {
            $klass = $klass_list[0];
            $klass->calendar_table_monthly = $this->my_klasscalendar->getMonthly($klass);
        }

        // 수업의 선생님 - klass_teacher 정보를 가져옵니다.
        $teacher_id = -1;
        $teacher = null;
        if(isset($klass) && isset($klass->teacher_id))
        {
            $teacher_id = intval($klass->teacher_id);
        }
        if(0 < $teacher_id)
        {
            $this->db->where('id', $teacher_id);
            $limit = 1;
            $offset = 0;
            $query = $this->db->get('teacher', $limit, $offset);

            $teacher = $this->add_klass_teacher_extra_info($query);
        }
        if(isset($klass))
        {
            $klass->teacher = $teacher;
        }
        array_push($query_arr, $this->db->last_query());

        // 수업의 리뷰를 가져옵니다.
        $review_list = null;
        // 1. 부모 리뷰를 먼저 가져옵니다.(최신순)
        if(0 < $klass->id)
        {
            $this->db->select('review.id, review.klass_id, review.user_id, user.name, user.nickname, user.thumbnail, review.parent_id, review.comment, review.date_created, review.date_updated');
            $this->db->from('review');
            $this->db->join('user', 'review.user_id = user.id');
            $this->db->where('review.klass_id', $klass->id);
            $this->db->where('review.parent_id=', 0);
            $this->db->order_by('review.id', 'DESC');
            $query = $this->db->get();

            $review_list = $this->add_klass_review_extra_info($query);
        }
        if(isset($review_list))
        {
            $klass->review_list = $review_list;
        }
        array_push($query_arr, $this->db->last_query());

        // 2. 부모 리뷰에 연결된 자식 리뷰 댓글들을 가져옵니다.(순차시간)
        for ($i=0; $i < count($review_list); $i++) 
        {

            $review = $review_list[$i];
            $review_id = intval($review->id);

            if(!(0 < $review_id)) 
            {
                continue;
            }

            $this->db->select('review.id, review.klass_id, review.user_id, user.name, user.nickname, user.thumbnail, review.parent_id, review.comment, review.date_created, review.date_updated');
            $this->db->from('review');
            $this->db->join('user', 'review.user_id = user.id');
            $this->db->where('review.parent_id', $review_id);
            $this->db->order_by('review.id', 'DESC');
            $query = $this->db->get();

            $review->child_review_list = $this->add_klass_review_extra_info($query);
        }
        array_push($query_arr, $this->db->last_query());

        // 수업의 문의를 가져옵니다.
        $question_list = null;
        // 1. 부모 문의를 먼저 가져옵니다.(최신순)
        if(0 < $klass->id)
        {
            $this->db->select('question.id, question.klass_id, question.user_id, user.name, user.nickname, user.thumbnail, question.parent_id, question.comment, question.date_created, question.date_updated');
            $this->db->from('question');
            $this->db->join('user', 'question.user_id = user.id');
            $this->db->where('question.klass_id', $klass->id);
            $this->db->where('question.parent_id=', 0);
            $this->db->order_by('question.id', 'DESC');
            $query = $this->db->get();

            $question_list = $this->add_klass_question_extra_info($query);
        }
        if(isset($question_list))
        {
            $klass->question_list = $question_list;
        }
        array_push($query_arr, $this->db->last_query());

        // 2. 부모 문의에 연결된 자식 문의 댓글(답변)들을 가져옵니다.(순차시간)
        for ($i=0; $i < count($question_list); $i++) 
        {

            $question = $question_list[$i];
            $question_id = intval($question->id);

            if(!(0 < $question_id)) 
            {
                continue;
            }

            $this->db->select('question.id, question.klass_id, question.user_id, user.name, user.nickname, user.thumbnail, question.parent_id, question.comment, question.date_created, question.date_updated');
            $this->db->from('question');
            $this->db->join('user', 'question.user_id = user.id');
            $this->db->where('question.parent_id', $question_id);
            $this->db->order_by('question.id', 'DESC');
            $query = $this->db->get();

            $question->child_question_list = $this->add_klass_question_extra_info($query);
        }
        array_push($query_arr, $this->db->last_query());



        // 조회 결과를 가져옵니다.
        if (!empty($klass))
        {
            $response_body = 
            $this->my_response->getResBodySuccess(
                $query_arr, 
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
                $query_arr, 
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

    private function add_klass_review_extra_info($query=null)
    {
        if($this->is_not_ok()) {
            return;
        }

        if(is_null($query)) {
            return;
        }

        $rows = $query->custom_result_object('KlassReview');
        if(!empty($rows))
        {
            foreach ($rows as $row) 
            {
                $row->id = intval($row->id);
                $row->parent_id = intval($row->parent_id);
                $row->klass_id = intval($row->klass_id);
                $row->user_id = intval($row->user_id);

                if(empty($row->thumbnail))
                {
                    $row->thumbnail = "user_anonymous_150x150.png";
                }

                $row->thumbnail_url = $this->my_path->get("/assets/images/user/" . $row->thumbnail);

                // 읽기 쉬운 시간 표기로 바꿉니다.
                $row->date_updated_human_readable = 
                $this->my_time->get_YYYYMMDDHHMMSS_human_readable_kor($row->date_updated);

            }
        }

        return $rows;
    }

    private function add_klass_question_extra_info($query=null)
    {
        if($this->is_not_ok()) {
            return;
        }

        if(is_null($query)) {
            return;
        }

        $rows = $query->custom_result_object('KlassQuestion');
        if(!empty($rows))
        {
            foreach ($rows as $row) 
            {
                $row->id = intval($row->id);
                $row->parent_id = intval($row->parent_id);
                $row->klass_id = intval($row->klass_id);
                $row->user_id = intval($row->user_id);

                if(empty($row->thumbnail))
                {
                    $row->thumbnail = "user_anonymous_150x150.png";
                }

                $row->thumbnail_url = $this->my_path->get("/assets/images/user/" . $row->thumbnail);

                // 읽기 쉬운 시간 표기로 바꿉니다.
                $row->date_updated_human_readable = 
                $this->my_time->get_YYYYMMDDHHMMSS_human_readable_kor($row->date_updated);

            }
        }

        return $rows;
    }    

    private function add_klass_teacher_extra_info($query=null)
    {
        if($this->is_not_ok()) {
            return;
        }

        if(is_null($query)) {
            return;
        }

        $rows = $query->custom_result_object('KlassTeacher');
        $teacher = null;
        if(!empty($rows))
        {
            $teacher = $rows[0];   
        }
        if(isset($teacher) && !empty($teacher->resume))
        {
            $teacher->resume_arr = explode("|",$teacher->resume);
        }
        if(isset($teacher) && !empty($teacher->greeting))
        {
            $teacher->greeting_arr = explode("|",$teacher->greeting);
        }
        if(isset($teacher) && !empty($teacher->thumbnail))
        {
            $teacher->thumbnail_url = $this->my_path->get("/assets/images/teacher/" . $teacher->thumbnail);
        }
        if(isset($teacher) && empty($teacher->nickname))
        {
            $teacher->nickname = $teacher->name;
        }

        return $teacher;
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
            $row->set_days_list($const_map);
            $row->days_img_url($const_map, $this->my_path);
            $row->venue_subway_station_img_url($const_map, $this->my_path);
            $row->venue_cafe_logo_img_url($const_map, $this->my_path);
            $row->price_with_format();
            $row->set_klass_price_list();
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