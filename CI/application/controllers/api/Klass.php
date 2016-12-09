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
        // init MyCalendar
        $this->load->library('MY_Calendar');

        // init MyKlassCalendar
        $this->load->library('MY_KlassCalendar', ['my_calendar'=>$this->my_calendar]);
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
        $review_list = null;
        if(0 < $klass->id)
        {
            $review_list = $this->my_sql->select_klass_review_list($klass->id);
        }

        // 수업의 문의를 가져옵니다.
        $question_list = null;
        if(0 < $klass->id)
        {
            $question_list = $this->my_sql->select_klass_question_list($klass->id);
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
        $output["klass_list"] = $klass_list;

        if (empty($klass_list))
        {
            // 조회한 결과가 없는 경우, "수업없음" 클래스 정보를 내려준다.
            $no_klass = $this->get_klass_course_no_class();
            $output["klass_list"] = [$no_klass];
        }
        $this->respond_200($output);
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

        if (empty($klass_list))
        {
            // 조회한 결과가 없는 경우, "수업없음" 클래스 정보를 내려준다.
            $no_klass = $this->get_klass_course_no_class();
            $output["klass_list"] = [$no_klass];
        }
        $this->respond_200($output);
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




    

    // REMOVE ME
    /*
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
    */


}
