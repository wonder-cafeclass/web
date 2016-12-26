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
        if(0 < intval($klass->id))
        {
            $klass->review_list = $this->my_sql->select_klass_review_list(intval($klass->id));
        }
        if(empty($klass->review_list))
        {
            $klass->review_list = [];   
        }

        // 수업의 문의를 가져옵니다.
        // $question_list = null;
        if(0 < intval($klass->id))
        {
            $klass->question_list = $this->my_sql->select_klass_question_list(intval($klass->id));
        }
        if(empty($klass->question_list))
        {
            $klass->question_list = [];   
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

    // @ 수업을 업데이트합니다.
    public function update_post()
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
        $klass_id = 
        $this->my_paramchecker->post(
            // $key=""
            "klass_id",
            // $key_filter=""
            "klass_id"
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
        $klass_title = 
        $this->my_paramchecker->post(
            // $key=""
            "klass_title",
            // $key_filter=""
            "klass_title"
        ); 
        $klass_desc = 
        $this->my_paramchecker->post(
            // $key=""
            "klass_desc",
            // $key_filter=""
            "klass_desc"
        ); 
        $klass_feature = 
        $this->my_paramchecker->post(
            // $key=""
            "klass_feature",
            // $key_filter=""
            "klass_feature"
        ); 
        $klass_target = 
        $this->my_paramchecker->post(
            // $key=""
            "klass_target",
            // $key_filter=""
            "klass_target"
        );
        $klass_schedule = 
        $this->my_paramchecker->post(
            // $key=""
            "klass_schedule",
            // $key_filter=""
            "klass_schedule"
        );
        $klass_date_begin = 
        $this->my_paramchecker->post(
            // $key=""
            "klass_date_begin",
            // $key_filter=""
            "klass_date_begin"
        );
        $klass_time_begin = 
        $this->my_paramchecker->post(
            // $key=""
            "klass_time_begin",
            // $key_filter=""
            "klass_time_hhmm"
        );
        $klass_time_end = 
        $this->my_paramchecker->post(
            // $key=""
            "klass_time_end",
            // $key_filter=""
            "klass_time_hhmm"
        );
        $klass_time_duration_minutes = 
        $this->my_paramchecker->post(
            // $key=""
            "klass_time_duration_minutes",
            // $key_filter=""
            "klass_time_duration_minutes"
        );
        $klass_level = 
        $this->my_paramchecker->post(
            // $key=""
            "klass_level",
            // $key_filter=""
            "klass_level"
        );
        $klass_week = 
        $this->my_paramchecker->post(
            // $key=""
            "klass_week",
            // $key_filter=""
            "klass_week"
        );
        $klass_days = 
        $this->my_paramchecker->post(
            // $key=""
            "klass_days",
            // $key_filter=""
            "klass_days"
        );
        $klass_venue_title = 
        $this->my_paramchecker->post(
            // $key=""
            "klass_venue_title",
            // $key_filter=""
            "klass_venue_title"
        );
        $klass_venue_telephone = 
        $this->my_paramchecker->post(
            // $key=""
            "klass_venue_telephone",
            // $key_filter=""
            "klass_venue_telephone"
        );
        $klass_venue_address = 
        $this->my_paramchecker->post(
            // $key=""
            "klass_venue_address",
            // $key_filter=""
            "klass_venue_address"
        );
        $klass_venue_road_address = 
        $this->my_paramchecker->post(
            // $key=""
            "klass_venue_road_address",
            // $key_filter=""
            "klass_venue_road_address"
        );
        $klass_venue_latitude = 
        $this->my_paramchecker->post(
            // $key=""
            "klass_venue_latitude",
            // $key_filter=""
            "klass_venue_latitude"
        );
        $klass_venue_longitude = 
        $this->my_paramchecker->post(
            // $key=""
            "klass_venue_longitude",
            // $key_filter=""
            "klass_venue_longitude"
        );
        $klass_subway_line = 
        $this->my_paramchecker->post(
            // $key=""
            "klass_subway_line",
            // $key_filter=""
            "klass_subway_line"
        );
        $klass_subway_station = 
        $this->my_paramchecker->post(
            // $key=""
            "klass_subway_station",
            // $key_filter=""
            "klass_subway_station"
        );
        $klass_price = 
        $this->my_paramchecker->post(
            // $key=""
            "klass_price",
            // $key_filter=""
            "klass_price"
        );        
        $klass_banner_url = 
        $this->my_paramchecker->post(
            // $key=""
            "klass_banner_url",
            // $key_filter=""
            "klass_banner_url"
        );      
        // @ Optional  
        $klass_poster_url = 
        $this->my_paramchecker->post(
            // $key=""
            "klass_poster_url",
            // $key_filter=""
            "klass_poster_url",
            // $is_no_record=false
            true
        );

        $output = array();
        $output["params"] = 
        [
            "user_id"=>$user_id,
            "teacher_id"=>$teacher_id,
            "klass_id"=>$klass_id,
            "teacher_id"=>$teacher_id,
            "teacher_resume"=>$teacher_resume,
            "teacher_greeting"=>$teacher_greeting,
            "klass_title"=>$klass_title,
            "klass_feature"=>$klass_feature,
            "klass_target"=>$klass_target,
            "klass_schedule"=>$klass_schedule,
            "klass_date_begin"=>$klass_date_begin,
            "klass_time_begin"=>$klass_time_begin,
            "klass_time_end"=>$klass_time_end,
            "klass_time_duration_minutes"=>$klass_time_duration_minutes,
            "klass_level"=>$klass_level,
            "klass_week"=>$klass_week,
            "klass_days"=>$klass_days,
            "klass_venue_title"=>$klass_venue_title,
            "klass_venue_telephone"=>$klass_venue_telephone,
            "klass_venue_address"=>$klass_venue_address,
            "klass_venue_road_address"=>$klass_venue_road_address,
            "klass_venue_latitude"=>$klass_venue_latitude,
            "klass_venue_longitude"=>$klass_venue_longitude,
            "klass_subway_line"=>$klass_subway_line,
            "klass_subway_station"=>$klass_subway_station,
            "klass_price"=>$klass_price,
            "klass_banner_url"=>$klass_banner_url,
            "klass_poster_url"=>$klass_poster_url
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
            // wonder.jung
            $this->my_sql->update_klass(
                // $klass_id=-1,
                $klass_id,
                // $user_id=-1,
                $user_id,
                // $teacher_id=-1
                $teacher_id,
                // $teacher_resume=""
                $teacher_resume,
                // $teacher_greeting=""
                $teacher_greeting,
                // $title=""
                $klass_title,
                // $feature=""
                $klass_feature,
                // $target=""
                $klass_target,
                // $schedule=""
                $klass_schedule,
                // $date_begin=""
                $klass_date_begin,
                // $time_begin=""
                $klass_time_begin,
                // $time_end=""
                $klass_time_end,
                // $time_duration_minutes=-1
                $klass_time_duration_minutes,
                // $level=""
                $klass_level,
                // $week=-1
                $klass_week,
                // $days=""
                $klass_days,
                // $venue_title=""
                $klass_venue_title,
                // $venue_telephone=""
                $klass_venue_telephone,
                // $venue_address=""
                $klass_venue_address,
                // $venue_road_address=""
                $klass_venue_road_address,
                // $venue_latitude=""
                $klass_venue_latitude,
                // $venue_longitude=""
                $klass_venue_longitude,
                // $subway_line=""
                $klass_subway_line,
                // $subway_station=""
                $klass_subway_station,
                // $banner_url=""
                $klass_banner_url,
                // $poster_url=""
                $klass_poster_url,
                // $price=-1
                $klass_price
            );

            // 쿼리 가져오기
            $queries = array();
            array_push($queries, $this->my_sql->get_last_query());
            $output["queries"] = $queries;

            $klass = $this->my_sql->select_klass($klass_id);
            $output["klass"] = $klass;
            
            $this->respond_200($output);
        }
        else
        {
            $this->respond_200_Failed(
                // $msg=""
                "update_post is failed!",
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

    public function updatetitle_post() 
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
        $klass_title = 
        $this->my_paramchecker->post(
            // $key=""
            "klass_title",
            // $key_filter=""
            "klass_title"
        );

        $output = array();
        $output["params"] = 
        [
            "klass_id"=>$klass_id,
            "klass_title"=>$klass_title
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
            $this->my_sql->update_klass_title(
                // $user_id=-1, 
                $user_id,
                // $klass_id=-1, 
                $klass_id,
                // $klass_title_to_update=""
                $klass_title
            );
            $klass = $this->my_sql->select_klass($klass_id);
            $klass_title = "";
            if(isset($klass) && isset($klass->title)) 
            {
                $klass_title = $klass->title;
            }
            $output["klass_title"] = $klass_title;
            $this->respond_200($output);

        } else {
            $this->respond_200_Failed(
                // $msg=""
                "addposter_post is failed!",
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

    // @ Desc : 수업 리뷰를 삭제합니다. 물리적인 삭제가 아닌 리뷰 상태를 비활성(N)으로 바꿉니다.
    public function removereview_post() 
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
        $klass_review_id = 
        $this->my_paramchecker->post(
            // $key=""
            "klass_review_id",
            // $key_filter=""
            "klass_review_id"
        );

        $output = array();
        $output["params"] = 
        [
            "user_id"=>$user_id,
            "klass_id"=>$klass_id,
            "klass_review_id"=>$klass_review_id
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

            $queries = array();

            // 새로운 수업 질문을 추가합니다.
            $this->my_sql->remove_klass_review(
                // $user_id=-1, 
                $user_id,
                // $klass_id=-1, 
                $klass_id,
                // $klass_review_id=-1
                $klass_review_id
            );

            // 쿼리 가져오기
            array_push($queries, $this->my_sql->get_last_query());

            // 수업의 질문 리스트를 가져옵니다.
            $removed_klass_review = 
            $this->my_sql->select_klass_review_by_id(
                // $klass_review_id=-1, 
                $klass_review_id
            );
            $output["removed_klass_review"] = $removed_klass_review;

            $output["queries"] = $queries;

            $this->respond_200($output);

        } else {
            $this->respond_200_Failed(
                // $msg=""
                "addquestion_post is failed!",
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
    public function addreview_post() 
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
        $klass_review = 
        $this->my_paramchecker->post(
            // $key=""
            "klass_review",
            // $key_filter=""
            "klass_review"
        );
        $klass_review_star = 
        $this->my_paramchecker->post(
            // $key=""
            "klass_review_star",
            // $key_filter=""
            "klass_review_star"
        );

        $output = array();
        $output["params"] = 
        [
            "user_id"=>$user_id,
            "klass_id"=>$klass_id,
            "klass_review"=>$klass_review,
            "klass_review_star"=>$klass_review_star
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

            $queries = array();

            // 새로운 수업 질문을 추가합니다.
            $this->my_sql->add_klass_review(
                // $user_id=-1, 
                $user_id,
                // $klass_id=-1, 
                $klass_id,
                // $klass_review=""
                $klass_review,
                // $klass_review_star=-1
                $klass_review_star
            );

            // 쿼리 가져오기
            array_push($queries, $this->my_sql->get_last_query());

            // 수업의 질문 리스트를 가져옵니다.
            $new_klass_review = 
            $this->my_sql->select_klass_review_last(
                // $klass_id=-1, 
                $klass_id,
                // $user_id=-1
                $user_id
            );

            $output["klass_review"] = $new_klass_review;
            $output["queries"] = $queries;

            $this->respond_200($output);

        } else {
            $this->respond_200_Failed(
                // $msg=""
                "addquestion_post is failed!",
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
    public function addreviewreply_post() 
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
        $klass_review = 
        $this->my_paramchecker->post(
            // $key=""
            "klass_review",
            // $key_filter=""
            "klass_review"
        );
        $klass_review_parent_id = 
        $this->my_paramchecker->post(
            // $key=""
            "klass_review_parent_id",
            // $key_filter=""
            "klass_review_parent_id"
        );

        $output = array();
        $output["params"] = 
        [
            "user_id"=>$user_id,
            "klass_id"=>$klass_id,
            "klass_review"=>$klass_review,
            "klass_review_parent_id"=>$klass_review_parent_id
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

            $queries = array();

            // 새로운 수업 질문을 추가합니다.
            $this->my_sql->add_klass_review_reply(
                // $user_id=-1, 
                $user_id,
                // $klass_id=-1, 
                $klass_id,
                // $klass_review_parent_id=-1
                $klass_review_parent_id,
                // $klass_reply=""
                $klass_review
            );

            // 쿼리 가져오기
            array_push($queries, $this->my_sql->get_last_query());

            // 수업의 질문 리스트를 가져옵니다.
            $new_klass_review = 
            $this->my_sql->select_klass_review_last(
                // $klass_id=-1, 
                $klass_id,
                // $user_id=-1
                $user_id
            );

            $output["klass_review"] = $new_klass_review;
            $output["queries"] = $queries;

            $this->respond_200($output);

        } else {
            $this->respond_200_Failed(
                // $msg=""
                "addreviewreply_post is failed!",
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



    // @ Desc : 수업 문의를 삭제합니다. 물리적인 삭제가 아닌 문의 상태를 비활성(N)으로 바꿉니다.
    public function removequestion_post() 
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
        $klass_question_id = 
        $this->my_paramchecker->post(
            // $key=""
            "klass_question_id",
            // $key_filter=""
            "klass_question_id"
        );

        $output = array();
        $output["params"] = 
        [
            "user_id"=>$user_id,
            "klass_id"=>$klass_id,
            "klass_question_id"=>$klass_question_id
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

            $queries = array();

            // 새로운 수업 질문을 추가합니다.
            $this->my_sql->remove_klass_question(
                // $user_id=-1, 
                $user_id,
                // $klass_id=-1, 
                $klass_id,
                // $klass_question_id=-1
                $klass_question_id
            );

            // 쿼리 가져오기
            array_push($queries, $this->my_sql->get_last_query());

            // 수업의 질문 리스트를 가져옵니다.
            $removed_klass_question = 
            $this->my_sql->select_klass_question_by_id(
                // $klass_question_id=-1, 
                $klass_question_id
            );
            $output["removed_klass_question"] = $removed_klass_question;

            $output["queries"] = $queries;

            $this->respond_200($output);

        } else {
            $this->respond_200_Failed(
                // $msg=""
                "removequestion_post is failed!",
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
    public function addquestion_post() 
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
        $klass_question = 
        $this->my_paramchecker->post(
            // $key=""
            "klass_question",
            // $key_filter=""
            "klass_question"
        );

        $output = array();
        $output["params"] = 
        [
            "user_id"=>$user_id,
            "klass_id"=>$klass_id,
            "klass_question"=>$klass_question
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

            $queries = array();

            // 새로운 수업 질문을 추가합니다.
            $this->my_sql->add_klass_question(
                // $user_id=-1, 
                $user_id,
                // $klass_id=-1, 
                $klass_id,
                // $klass_question=""
                $klass_question
            );

            // 쿼리 가져오기
            array_push($queries, $this->my_sql->get_last_query());

            // 수업의 질문 리스트를 가져옵니다.
            $klass_question = 
            $this->my_sql->select_klass_question_last($klass_id, $user_id);

            $output["klass_question"] = $klass_question;
            $output["queries"] = $queries;

            $this->respond_200($output);

        } else {
            $this->respond_200_Failed(
                // $msg=""
                "addquestion_post is failed!",
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
    // @ Desc : 수업 문의의 답글을 등록합니다.
    public function addquestionreply_post() 
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
        $klass_question = 
        $this->my_paramchecker->post(
            // $key=""
            "klass_question",
            // $key_filter=""
            "klass_question"
        );
        $klass_question_parent_id = 
        $this->my_paramchecker->post(
            // $key=""
            "klass_question_parent_id",
            // $key_filter=""
            "klass_question_parent_id"
        );

        $output = array();
        $output["params"] = 
        [
            "user_id"=>$user_id,
            "klass_id"=>$klass_id,
            "klass_question"=>$klass_question,
            "klass_question_parent_id"=>$klass_question_parent_id
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

            $queries = array();

            // 새로운 수업 질문을 추가합니다.
            $this->my_sql->add_klass_question_reply(
                // $user_id=-1, 
                $user_id,
                // $klass_id=-1, 
                $klass_id,
                // $klass_question_parent_id=-1, 
                $klass_question_parent_id,
                // $klass_question=""
                $klass_question
            );

            // 쿼리 가져오기
            array_push($queries, $this->my_sql->get_last_query());

            // 수업의 질문 리스트를 가져옵니다.
            $klass_question = 
            $this->my_sql->select_klass_question_last($klass_id, $user_id);

            $output["klass_question"] = $klass_question;
            $output["queries"] = $queries;

            $this->respond_200($output);

        } else {
            $this->respond_200_Failed(
                // $msg=""
                "addquestionreply_post is failed!",
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

    public function addposter_post() 
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
        $klass_poster_url = 
        $this->my_paramchecker->post(
            // $key=""
            "klass_poster_url",
            // $key_filter=""
            "klass_poster_url"
        );

        $output = array();
        $output["params"] = 
        [
            "klass_id"=>$klass_id,
            "klass_poster_url"=>$klass_poster_url
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

            // 이전 포스터 주소를 가져옵니다.
            $klass_poster_prev = $this->my_sql->get_klass_poster($klass_id);
            // 있다면 해당 포스터를 삭제합니다.
            if(!empty($klass_poster_prev)) 
            {
                $output["klass_poster_deleted"] = $klass_poster_prev;
                $output["klass_poster_path_deleted"]
                = $this->my_thumbnail->get_path_thumbnail_klass_poster($klass_poster_prev);
                $output["has_deleted"]
                = $this->my_thumbnail->delete_thumbnail_klass_poster($klass_poster_prev);
            }

            $this->my_sql->add_klass_poster(
                // $user_id=-1, 
                $user_id,
                // $klass_id=-1, 
                $klass_id,
                // $klass_poster_url_to_add=""
                $klass_poster_url
            );
            $output["klass_poster"] = $this->my_sql->get_klass_poster($klass_id);
            $this->respond_200($output);

        } else {
            $this->respond_200_Failed(
                // $msg=""
                "addposter_post is failed!",
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

    public function updatebanner_post()   
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

            $this->my_sql->update_klass_banner(
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
                "updatebanner_post is failed!",
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

    /*
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
    */

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
    private function get_level_default()
    {
        return $this->my_paramchecker->get_const_from_list(
            'ALL', 
            'class_level_list', 
            'class_level_list'
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
    private function get_days_default()
    {
        return $this->my_paramchecker->get_const_from_list(
            'ALL', 
            'class_level_list', 
            'class_level_list'
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
    private function get_time_begin_default()
    {
        return $this->my_paramchecker->get_const_from_list(
            'always',
            'class_times_list',
            'class_times_list'
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
    private function get_subway_line_default()
    {
        return $this->my_paramchecker->get_const_from_list(
            'line2',
            'subway_line_list',
            'subway_line_list'
        );
    }
    private function get_subway_station_default()
    {
        $subway_station_list = 
        $this->my_paramchecker->get_const_from_list(
            'line2',
            'subway_line_list',
            'subway_station_list'
        );

        return $subway_station_list[0];
    }    
    private function get_venue_subway_station_default()
    {
        return $this->my_paramchecker->get_const_from_list(
            'everywhere',
            'class_venue_subway_station_list',
            'class_venue_subway_station_list'
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
        $klass_course->level =  
        $this->get_level_default();
        $klass_course->level_img_url =  
        $this->get_level_img_default();

        $klass_course->days = 
        $this->get_days_default();
        $klass_course->days_img_url = 
        $this->get_days_img_default();

        $klass_course->time_begin = 
        $this->get_time_begin_default();
        $klass_course->time_begin_img_url = 
        $this->get_time_begin_img_default();

        $klass_course->subway_line = 
        $this->get_subway_line_default();
        $klass_course->subway_station = 
        $this->get_subway_station_default();

        $klass_course->venue_subway_station = 
        $this->get_venue_subway_station_default();
        $klass_course->venue_subway_station_img_url = 
        $this->get_venue_subway_station_img_default();
        $klass_course->subway_station_img = 
        $this->get_venue_subway_station_img_default();

        return $klass_course;

    }   

    private function get_klass_course_no_class() {

        if($this->is_not_ok()) {
            return;
        }
        
        $klass_course = new KlassCourse();
        $klass_course->id = -1;
        $klass_course->class_poster_url_loadable = 
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
        $klass_course->class_poster_url_loadable = 
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
        $class_times_hh_mm_list = $const_map->class_times_hh_mm_list;
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
            $hh_mm = $class_times_hh_mm_list[$i];

            $time_obj = 
            new KlassTime(
                $key, 
                $name_eng, 
                $name_kor, 
                $img_url, 
                $hh_mm
            );

            array_push($klass_time_list, $time_obj);
        }

        return $klass_time_list;
    }



}
