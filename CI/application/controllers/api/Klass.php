<?php

defined('BASEPATH') OR exit('No direct script access allowed');

// This can be removed if you use __autoload() in config.php OR use Modular Extensions
/*
    !Caution/주의!

    require APPPATH . '${your-class-path}';
    ...
    $this->load->library(${your-class-path});

    // 위의 경우처럼 2번 동일한 클래스를 호출하게 되면 $this->${your-class-path} 의 경우, null을 돌려주게 됩니다.

*/

require APPPATH . '/libraries/MY_REST_Controller.php';
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

/*
*   @ Author : Wonder Jung
*   @ Desc : 카페클래스 유저 정보를 조회,추가,삭제,변경하는 API 클래스.
*/

class Klass extends MY_REST_Controller {

    function __construct()
    {
        // Construct the parent class
        parent::__construct();

        // Library Loaded from parent - MY_REST_Controller
        /*
        date_default_timezone_set('Asia/Seoul');
        $this->load->database();
        $this->load->library('MY_Error');
        $this->load->library('MY_Path');
        $this->load->library('MY_KeyValue');
        $this->load->library('MY_ParamChecker');
        $this->load->library('MY_Response');
        $this->load->library('MY_Time');
        $this->load->library('MY_Curl');
        $this->load->library('MY_ApiKey');
        $this->load->library('MY_Sql');
        $this->load->library('user_agent');
        $this->load->library('MY_Logger');
        */

        // Please add library you need here!
        $this->load->library('MY_Calendar');
        $this->load->library('MY_KlassCalendar', ['my_calendar'=>$this->my_calendar]);
        $this->load->library('MY_Thumbnail');
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
            $this->respond_200($output);
        }
        else
        {
            $this->respond_200_Failed(
                // $msg=""
                'Selectile is not valid!', 
                // $function=""
                __FUNCTION__,
                // $file="" 
                __FILE__,
                // $line=""
                __LINE__,
                // $data=null
                $output
            );
            return;            
        }
    }

    public function coursenew_get()
    {
        if($this->is_not_ok()) 
        {
            return;
        }

        // @ Required
        $teacher_id = 
        $this->my_paramchecker->get(
            // $key=""
            "teacher_id",
            // $key_filter=""
            "teacher_id"
        );

        $output["param"] = array(
            "teacher_id"=>$teacher_id
        );        

        // CHECK LIST
        $is_ok = true;
        $check_list = 
        $this->my_paramchecker->get_check_list();
        $output["check_list"] = $check_list;
        if($this->my_paramchecker->has_check_list_failed())
        {
            $output["check_list"] = $check_list;
            $is_ok = false;
        }
        if($is_ok) {

            // 새로 입력하는 수업 관련 기본 정보를 돌려줍니다.
            // wonder.jung
            // 수업 - 새로운 klass 정보를 가져옵니다.
            $new_klass = $this->get_klass_course_new_class();

            // 수업의 선생님 - klass_teacher 정보를 가져옵니다.
            $teacher = $this->my_sql->select_teacher($teacher_id);
            $new_klass->teacher = $teacher;

            // 수업의 리뷰를 가져옵니다.
            $new_klass->review_list = [];

            // 수업의 문의를 가져옵니다.
            $new_klass->question_list = [];

            $output["klass"] = $new_klass;
            $this->respond_200($output);
        }
        else 
        {
            $this->respond_200_Failed(
                // $msg=""
                "New course failed!",
                // $function=""
                __FUNCTION__,
                // $file="" 
                __FILE__,
                // $line=""
                __LINE__,
                // $data=null
                $output
            );            
        } // end if


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
        $klass = $this->my_sql->select_klass($id);

        // 수업의 선생님 - klass_teacher 정보를 가져옵니다.
        $teacher = null;
        if(isset($klass) && isset($klass->teacher_id))
        {
            $teacher_id = intval($klass->teacher_id);
            $teacher = $this->my_sql->select_teacher($teacher_id);
        }
        if(isset($teacher))
        {
            $klass->teacher = $teacher;
        }

        // 수업의 리뷰를 가져옵니다.
        // $review_list = null;
        if(0 < $klass->id)
        {
            $klass->review_list = $this->my_sql->select_klass_review_list($klass->id);
        }

        // 수업의 문의를 가져옵니다.
        // $question_list = null;
        if(0 < $klass->id)
        {
            $klass->question_list = $this->my_sql->select_klass_question_list($klass->id);
        }

        // 조회 결과를 가져옵니다.
        $output = [];
        if (!empty($klass))
        {
            $output["klass"] = $klass;
            $this->respond_200($output);
        }
        else
        {
            $this->respond_200_Failed(
                // $msg=""
                'Klass could not be found',
                // $function=""
                __FUNCTION__,
                // $file="" 
                __FILE__,
                // $line=""
                __LINE__,
                // $data=null
                $output
            );
        }
    }   

    public function list_get()
    {
        if($this->is_not_ok()) {
            return;
        }

        $output = [];
        $offset = 
        $this->my_paramchecker->post(
            // $key=""
            "offset",
            // $key_filter=""
            "offset"
        );
        $limit = 
        $this->my_paramchecker->post(
            // $key=""
            "limit",
            // $key_filter=""
            "limit"
        );
        $output["param"] = array(
            "offset"=>$offset,
            "limit"=>$limit
        );

        $klass_list = $this->my_sql->select_klass_list($offset, $limit);
        $last_query = $this->my_sql->get_last_query();
        $output["klass_list"] = $klass_list;
        $output["query"] = $last_query;
        
        $new_klass = $this->get_klass_course_new_class();
        $output["new_klass"] = [$new_klass];

        if (empty($klass_list))
        {
            // 조회한 결과가 없는 경우, "수업없음" 클래스 정보를 내려준다.
            $no_klass = $this->get_klass_course_no_class();
            $output["klass_list"] = [$no_klass];
        }
        $this->respond_200($output);
    }

    public function test_get()
    {
        $result = $this->my_sql->test();
        echo $result;
    }

    // @ 새로운 빈 수업을 추가합니다.
    public function addklassempty_post()
    {
        if($this->is_not_ok()) {
            return;
        }

        $output = array();
        $is_not_allowed_api_call = $this->my_paramchecker->is_not_allowed_api_call();
        if($is_not_allowed_api_call) 
        {   
            $this->respond_200_Failed(
                // $msg=""
                "Not allowed api call",
                // $function=""
                __FUNCTION__,
                // $file="" 
                __FILE__,
                // $line=""
                __LINE__,
                // $data=null
                $output
            );
            return;
        }

        // wonder.jung
        $user_id = 
        $this->my_paramchecker->post(
            // $key=""
            "user_id",
            // $key_filter=""
            "user_id"
        );
        $teacher_id = 
        $this->my_paramchecker->post(
            // $key=""
            "teacher_id",
            // $key_filter=""
            "teacher_id"
        );
        $teacher_resume = 
        $this->my_paramchecker->post(
            // $key=""
            "teacher_resume",
            // $key_filter=""
            "teacher_resume"
        );
        $teacher_greeting = 
        $this->my_paramchecker->post(
            // $key=""
            "teacher_greeting",
            // $key_filter=""
            "teacher_greeting"
        );

        $output = array();
        $output["params"] = 
        [
            "user_id"=>$user_id,
            "teacher_id"=>$teacher_id,
            "teacher_resume"=>$teacher_resume,
            "teacher_greeting"=>$teacher_greeting
        ];

        $is_ok = true;
        $check_list = 
        $this->my_paramchecker->get_check_list();
        $output["check_list"] = $check_list;
        if($this->my_paramchecker->has_check_list_failed())
        {
            $is_ok = false;
        }

        if($is_ok) 
        {
            $this->my_sql->add_klass(
                // $user_id=-1, 
                $user_id,
                // $teacher_id=-1, 
                $teacher_id,
                // $teacher_resume="", 
                $teacher_resume,
                // $teacher_greeting=""
                $teacher_greeting
            );

            $klass = $this->my_sql->select_klass_by_teacher($teacher_id);
            $output["klass"] = $klass;
            $this->respond_200($output);
        }
        else
        {
            $this->respond_200_Failed(
                // $msg=""
                "addklassempty_post is failed!",
                // $function=""
                __FUNCTION__,
                // $file="" 
                __FILE__,
                // $line=""
                __LINE__,
                // $data=null
                $output
            );             
        }
    }

    public function addbanner_post() 
    {
        if($this->is_not_ok()) {
            return;
        }

        $output = array();
        $is_not_allowed_api_call = $this->my_paramchecker->is_not_allowed_api_call();
        if($is_not_allowed_api_call) 
        {   
            $this->respond_200_Failed(
                // $msg=""
                "Not allowed api call",
                // $function=""
                __FUNCTION__,
                // $file="" 
                __FILE__,
                // $line=""
                __LINE__,
                // $data=null
                $output
            );
            return;
        }

        $user_id = 
        $this->my_paramchecker->post(
            // $key=""
            "user_id",
            // $key_filter=""
            "user_id"
        );
        $klass_id = 
        $this->my_paramchecker->post(
            // $key=""
            "klass_id",
            // $key_filter=""
            "klass_id"
        );
        $klass_banner_url = 
        $this->my_paramchecker->post(
            // $key=""
            "klass_banner_url",
            // $key_filter=""
            "klass_banner_url"
        );

        $output = array();
        $output["params"] = 
        [
            "klass_id"=>$klass_id,
            "klass_banner_url"=>$klass_banner_url
        ];

        $is_ok = true;
        $check_list = 
        $this->my_paramchecker->get_check_list();
        $output["check_list"] = $check_list;
        if($this->my_paramchecker->has_check_list_failed())
        {
            $is_ok = false;
        }
        
        if($is_ok) {

            $this->my_sql->add_klass_banner(
                // $user_id=-1, 
                $user_id,
                // $klass_id=-1, 
                $klass_id,
                // $klass_banner_url_to_add=""
                $klass_banner_url
            );
            $output["klass_banner_list"] = $this->my_sql->get_klass_banner_list($klass_id);
            $this->respond_200($output);

        } else {
            $this->respond_200_Failed(
                // $msg=""
                "addbanner_post is failed!",
                // $function=""
                __FUNCTION__,
                // $file="" 
                __FILE__,
                // $line=""
                __LINE__,
                // $data=null
                $output
            );            
        } // end if
    }

    public function removebanner_post() 
    {
        if($this->is_not_ok()) {
            return;
        }

        $output = array();
        $is_not_allowed_api_call = $this->my_paramchecker->is_not_allowed_api_call();
        if($is_not_allowed_api_call) 
        {   
            $this->respond_200_Failed(
                // $msg=""
                "Not allowed api call",
                // $function=""
                __FUNCTION__,
                // $file="" 
                __FILE__,
                // $line=""
                __LINE__,
                // $data=null
                $output
            );
            return;
        }

        // wonder.jung
        $user_id = 
        $this->my_paramchecker->post(
            // $key=""
            "user_id",
            // $key_filter=""
            "user_id"
        );
        $klass_id = 
        $this->my_paramchecker->post(
            // $key=""
            "klass_id",
            // $key_filter=""
            "klass_id"
        );
        $klass_banner_url = 
        $this->my_paramchecker->post(
            // $key=""
            "klass_banner_url",
            // $key_filter=""
            "klass_banner_url"
        );

        $output = array();
        $output["params"] = 
        [
            "user_id"=>$user_id,
            "klass_id"=>$klass_id,
            "klass_banner_url"=>$klass_banner_url
        ];

        $is_ok = true;
        $check_list = 
        $this->my_paramchecker->get_check_list();
        $output["check_list"] = $check_list;
        if($this->my_paramchecker->has_check_list_failed())
        {
            $is_ok = false;
        }
        
        if($is_ok) {

            $this->my_sql->remove_klass_banner(
                // $user_id=-1, 
                $user_id,
                // $klass_id=-1, 
                $klass_id,
                // $klass_banner_url_to_add=""
                $klass_banner_url
            );
            $output["query"] = $this->my_sql->get_last_query();

            // 해당 파일을 삭제합니다.
            $this->my_thumbnail->delete_thumbnail_klass_banner($klass_banner_url);

            $output["klass_banner_list"] = $this->my_sql->get_klass_banner_list($klass_id);
            $this->respond_200($output);

        } else {
            $this->respond_200_Failed(
                // $msg=""
                "removebanner_post is failed!",
                // $function=""
                __FUNCTION__,
                // $file="" 
                __FILE__,
                // $line=""
                __LINE__,
                // $data=null
                $output
            );            
        } // end if
    }


    public function search_get() 
    {
        if($this->is_not_ok()) {
            return;
        }

        $output = [];
        $q = 
        $this->my_paramchecker->post(
            // $key=""
            "q",
            // $key_filter=""
            "klass_query"
        );
        $level = 
        $this->my_paramchecker->post(
            // $key=""
            "level",
            // $key_filter=""
            "klass_level"
        );
        $station = 
        $this->my_paramchecker->post(
            // $key=""
            "station",
            // $key_filter=""
            "klass_station"
        );
        $day = 
        $this->my_paramchecker->post(
            // $key=""
            "day",
            // $key_filter=""
            "klass_day"
        );
        $time = 
        $this->my_paramchecker->post(
            // $key=""
            "time",
            // $key_filter=""
            "klass_time"
        );
        $output["param"] = array(
            "q"=>$q,
            "level"=>$level,
            "station"=>$station,
            "day"=>$day,
            "time"=>$time
        );

        $klass_list = 
        $this->my_sql->search_klass(
            // $q=""
            $q,
            // $level=""
            $level,
            // $station=""
            $station,
            // $day=""
            $day,
            // $time=""
            $time
        );
        $output["klass_list"] = $klass_list;
        $new_klass = $this->get_klass_course_new_class();
        $output["new_klass"] = [$new_klass];

        if (empty($klass_list))
        {
            // 조회한 결과가 없는 경우, "수업없음" 클래스 정보를 내려준다.
            $no_klass = $this->get_klass_course_no_class();
            $output["klass_list"] = [$no_klass];
        }
        $this->respond_200($output);
    }
    private function get_class_img_default() 
    {
        return $this->my_paramchecker->get_const_from_list(
            'no_class', 
            'klass_event_img_list', 
            'klass_event_img_url_list'
        );
    }
    private function get_class_img_new() 
    {
        return $this->my_paramchecker->get_const_from_list(
            'new_class', 
            'klass_event_img_list', 
            'klass_event_img_url_list'
        );
    }
    private function get_level_img_default()
    {
        return $this->my_paramchecker->get_const_from_list(
            'ALL', 
            'class_level_list', 
            'class_level_img_url_list'
        );
    }
    private function get_days_img_default()
    {
        return $this->my_paramchecker->get_const_from_list(
            'ALL', 
            'class_level_list', 
            'class_level_img_url_list'
        );
    }
    private function get_time_begin_img_default()
    {
        return $this->my_paramchecker->get_const_from_list(
            'always',
            'class_times_list',
            'class_times_img_url_list'
        );    
    }
    private function get_venue_subway_station_img_default()
    {
        return $this->my_paramchecker->get_const_from_list(
            'everywhere',
            'class_venue_subway_station_list',
            'class_venue_subway_station_img_url_list'
        );        
    
    } 
    private function set_default_klass_course($klass_course) {

        if(is_null($klass_course)) 
        {
            return null;
        }

        $klass_course->price = $klass_course->price_with_format = "0";

        // 기본 이미지 설정.
        $klass_course->level_img_url =  
        $this->get_level_img_default();

        $klass_course->days_img_url = 
        $this->get_days_img_default();

        $klass_course->time_begin_img_url = 
        $this->get_time_begin_img_default();

        $klass_course->venue_subway_station_img_url = 
        $this->get_venue_subway_station_img_default();

        return $klass_course;

    }   

    private function get_klass_course_no_class() {

        if($this->is_not_ok()) {
            return;
        }
        
        $klass_course = new KlassCourse();
        $klass_course->id = -1;
        $klass_course->class_img_url = 
        $this->get_class_img_default();
        $klass_course->title="수업이 없습니다.";

        $klass_course = 
        $this->set_default_klass_course($klass_course);

        return $klass_course;
    }
    private function get_klass_course_new_class() {

        if($this->is_not_ok()) {
            return;
        }

        $klass_course = new KlassCourse();
        $klass_course->id = -100;
        $klass_course->class_img_url = 
        $this->get_class_img_new();
        $klass_course->title="새로운 수업을 만들어요.";

        $klass_course = 
        $this->set_default_klass_course($klass_course);

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



}
