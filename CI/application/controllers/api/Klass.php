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
        $this->load->library('MY_Tracker');
        $this->load->library('MY_Pagination');
        */

        // Please add library you need here!
        $this->load->library('MY_Calendar');
        $this->load->library('MY_KlassCalendar', ['my_calendar'=>$this->my_calendar]);
        $this->load->library('MY_Thumbnail');
        $this->load->library('MY_Decorator');
    }

    public function selectile_get() {

        if($this->is_not_ok()) {
            return;
        }

        $output = array();
        $is_ok = true;

        $output['levels'] = 
        $this->my_decorator->get_levels();
        if( is_null($output['levels']) || 
            empty($output['levels'])) {
            $is_ok = false;
        }
        $output['subway_line'] = 
        $this->my_decorator->get_subway_lines();
        if( is_null($output['subway_line']) || 
            empty($output['subway_line'])) {
            $is_ok = false;
        }
        $output['subway_station'] = 
        $this->my_decorator->get_subway_stations();
        if( is_null($output['subway_station']) || 
            empty($output['subway_station'])) {
            $is_ok = false;
        }
        $output['days'] = 
        $this->my_decorator->get_days();
        if( is_null($output['days']) || 
            empty($output['days'])) {
            $is_ok = false;
        }
        $output['times'] = 
        $this->my_decorator->get_times();
        if( is_null($output['times']) || 
            empty($output['times'])) {
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
            $new_klass = 
            $this->my_decorator->get_klass_course_new_class();

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
        $output = [];
        $this->my_tracker->add_init(__FILE__, __FUNCTION__, __LINE__);

        if($this->is_not_ok()) 
        {
            $this->my_tracker->add_stopped(__FILE__, __FUNCTION__, __LINE__, "\$this->is_not_ok()");
            $output["track"] = $this->my_tracker->flush();
            $this->respond_200_Failed(
                // $msg=""
                "\$this->is_not_ok()",
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
        } // end if        

        $param = array();
        $param['id'] = $id = $this->my_paramchecker->get('id','klass_id');
        $output['check_list'] = $check_list = $this->my_paramchecker->get_check_list();
        $output['param'] = $param;

        $query_arr = array();
        
        // 수업 - klass 정보를 가져옵니다.
        $klass = $this->get_klass($id);
        $output["klass_src"] = $klass;

        /*
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
        */

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
        if (!empty($klass))
        {
            $output["klass"] = $klass;
            $output["track"] = $this->my_tracker->flush();
            $this->respond_200($output);
        }
        else
        {
            $this->my_tracker->add_stopped(__FILE__, __FUNCTION__, __LINE__, "empty(\$klass)");
            $output["track"] = $this->my_tracker->flush();
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
        $output = [];
        $this->my_tracker->add_init(__FILE__, __FUNCTION__, __LINE__);

        if($this->is_not_ok()) 
        {
            $this->respond_200_Failed_v2(__FILE__,__FUNCTION__,__LINE__,$output,"\$this->is_not_ok()");
            return;
        } // end if

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
        $output["klass_list_src"] = $klass_list;

        $klass_list = $this->my_decorator->deco_klass($klass_list);
        $output["klass_list"] = $klass_list;

        $new_klass = 
        $this->my_decorator->get_klass_course_new_class();
        $output["new_klass"] = [$new_klass];

        if (empty($klass_list))
        {
            // 조회한 결과가 없는 경우, "수업없음" 클래스 정보를 내려준다.
            $no_klass = 
            $this->my_decorator->get_klass_course_no_class();
            $output["klass_list"] = [$no_klass];
        } // end if

        $this->respond_200_v2(__FILE__,__FUNCTION__,__LINE__,$output);

    } // end method

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

        // TODO - 선생님이 수업을 연속으로 등록하는 것을 막기 위해서 가장 마지막으로 등록한 수업으로부터 3분이 지났는지 확인합니다.
        // TODO - 건네받은 userid가 선생님이 맞는지 확인합니다.

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

            // 선생님이 수업을 추가한 것을 로그로 기록합니다.

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
        $this->my_tracker->add_init(__FILE__, __FUNCTION__, __LINE__);

        if($this->is_not_ok()) {
            $this->my_tracker->add_stopped(__FILE__, __FUNCTION__, __LINE__, "\$this->is_not_ok()");
            $output["track"] = $this->my_tracker->flush();
            $this->respond_200_Failed(
                // $msg=""
                "\$this->is_not_ok()",
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

        $output = array();
        $is_not_allowed_api_call = $this->my_paramchecker->is_not_allowed_api_call();
        if($is_not_allowed_api_call) 
        {   
            $this->my_tracker->add_stopped(__FILE__, __FUNCTION__, __LINE__, "\$is_not_allowed_api_call");
            $output["track"] = $this->my_tracker->flush();
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
            "klass_venue_telephone",
            // $is_no_record=false
            true
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
        $klass_student_cnt = 
        $this->my_paramchecker->post(
            // $key=""
            "klass_student_cnt",
            // $key_filter=""
            "klass_student_cnt"
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
            "klass_student_cnt"=>$klass_student_cnt,
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
        $this->my_tracker->add(__FILE__, __FUNCTION__, __LINE__, "\$is_ok");

        if($is_ok) 
        {
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
                $klass_price,
                // $student_cnt
                $klass_student_cnt
            );
            $output["track"] = $this->my_tracker->flush();

            // 쿼리 가져오기
            $queries = array();
            array_push($queries, $this->my_sql->get_last_query());
            $output["queries"] = $queries;

            $klass = $this->get_klass($klass_id);
            $output["klass"] = $klass;
            
            $this->respond_200($output);
        }
        else
        {
            $output["track"] = $this->my_tracker->flush();
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

            $klass = $this->get_klass($klass_id);
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

    // @ Desc : 낱개의 수업을 가져옵니다.
    private function get_klass($klass_id=-1)
    {
        $this->my_tracker->add_init(__FILE__, __FUNCTION__, __LINE__);

        if(!(0 < $klass_id)) {
            $this->my_tracker->add_stopped(__FILE__, __FUNCTION__, __LINE__, "\$klass_id is not valid!");
            return;
        } // end if

        $klass_list = $this->my_sql->select_klass($klass_id);
        $klass_list = $this->my_decorator->deco_klass($klass_list);

        $klass = null;
        if(!empty($klass_list)) 
        {
            $klass = $klass_list[0];
            $klass->calendar_table_monthly = $this->my_klasscalendar->getMonthly($klass);
        }

        return $klass;
    }    

    // @ Desc : 수업 리스트를 가져옵니다. 검색어, 권한, 상태등의 조회 조건을 줄수 있습니다.
    public function fetchklasslist_post() 
    {
        $output = [];
        if($this->is_not_ok()) 
        {
            $this->respond_200_Failed_v2(__FILE__,__FUNCTION__,__LINE__,$output,"\$this->is_not_ok()");
            return;
        } // end if

        $is_not_allowed_api_call = $this->my_paramchecker->is_not_allowed_api_call();
        if($is_not_allowed_api_call) 
        {  
            $this->respond_200_Failed_v2(__FILE__,__FUNCTION__,__LINE__,$output,"\$is_not_allowed_api_call");
            return;
        }

        // login user id - 로그인한 유저의 아이디. 선생님 여부를 판별하는데 사용합니다. 선생님이라면, 수업 추가 탭이 제일 앞에 들어갑니다.
        $login_user_id = 
        $this->my_paramchecker->post(
            // $key=""
            "login_user_id",
            // $key_filter=""
            "user_id",
            // $is_no_record=false
            true
        );

        // Pagination
        $page_num = 
        $this->my_paramchecker->post(
            // $key=""
            "page_num",
            // $key_filter=""
            "page_num",
            // $is_no_record=false
            true
        );
        if(empty($page_num)) {
            $page_num = 1;
        }

        $page_size = 
        $this->my_paramchecker->post(
            // $key=""
            "page_size",
            // $key_filter=""
            "page_size",
            // $is_no_record=false
            true
        );
        if(empty($page_size)) {
            $page_size = 10;
        } // end if 

        $limit = 
        $this->my_pagination->get_limit(
            // $page_num=-1, 
            $page_num,
            // $page_size=-1
            $page_size
        );
        $offset = 
        $this->my_pagination->get_offset(
            // $page_num=-1, 
            $page_num,
            // $page_size=-1
            $page_size
        ); 

        // Where condition
        $search_query = 
        $this->my_paramchecker->post(
            // $key=""
            "search_query",
            // $key_filter=""
            "search_query",
            // $is_no_record=false
            true
        );

        $klass_status = 
        $this->my_paramchecker->post(
            // $key=""
            "klass_status",
            // $key_filter=""
            "klass_status",
            // $is_no_record=false
            true
        );     

        $klass_level = 
        $this->my_paramchecker->post(
            // $key=""
            "klass_level",
            // $key_filter=""
            "klass_level",
            // $is_no_record=false
            true
        );        

        $klass_subway_line = 
        $this->my_paramchecker->post(
            // $key=""
            "klass_subway_line",
            // $key_filter=""
            "klass_subway_line",
            // $is_no_record=false
            true
        );        

        $klass_subway_station = 
        $this->my_paramchecker->post(
            // $key=""
            "klass_subway_station",
            // $key_filter=""
            "klass_subway_station",
            // $is_no_record=false
            true
        );

        $klass_days = 
        $this->my_paramchecker->post(
            // $key=""
            "klass_days",
            // $key_filter=""
            "klass_days_for_search",
            // $is_no_record=false
            true
        );        

        $klass_time = 
        $this->my_paramchecker->post(
            // $key=""
            "klass_time",
            // $key_filter=""
            "klass_time",
            // $is_no_record=false
            true
        );        

        $output["params"] = 
        [
            "page_num"=>$page_num,
            "page_size"=>$page_size,
            "limit"=>$limit,
            "offset"=>$offset,
            "search_query"=>$search_query,
            "klass_status"=>$klass_status,
            "klass_level"=>$klass_level,
            "klass_subway_line"=>$klass_subway_line,
            "klass_subway_station"=>$klass_subway_station,
            "klass_days"=>$klass_days,
            "klass_time"=>$klass_time
        ];

        // CHECK LIST
        $is_ok = $this->has_check_list_success();
        $this->my_tracker->add(__FILE__, __FUNCTION__, __LINE__, "\$is_ok : $is_ok");
        $output["check_list"] = $this->get_check_list();

        if(!$is_ok) 
        {
            $this->respond_200_Failed_v2(__FILE__,__FUNCTION__,__LINE__,$output,"fetchklasslist_post is failed!");
            return;
        } // end if

        // 검색어에 해당하는 전체 결과수를 가져옵니다.
        // 이 데이터로 pagination을 새로 만듭니다.
        $klass_cnt = 
        $this->my_sql->select_klass_cnt_on_admin(
            // $search_query="", 
            $search_query,
            // $klass_status="", 
            $klass_status,
            // $level="", 
            $klass_level,
            // $klass_subway_line="", 
            $klass_subway_line,
            // $klass_subway_station="", 
            $klass_subway_station,
            // $day="", 
            $klass_days,
            // $time=""
            $klass_time
        );
        $output["klass_cnt"] = $klass_cnt;
        $pagination = 
        $this->my_pagination->get(
            // $total_row_cnt=-1, 
            $klass_cnt,
            // $cursor_page_num=-1, 
            $page_num,
            // $row_cnt_per_page=-1
            $page_size
        );
        $output["pagination"] = $pagination;

        // 검색어로 유저를 찾습니다.
        $klass_list =
        $this->my_sql->select_klass_on_admin(
            // $limit=-1, 
            $limit,
            // $offset=-1, 
            $offset,
            // $search_query="", 
            $search_query,
            // $klass_status="", 
            $klass_status,
            // $level="", 
            $klass_level,
            // $klass_subway_line="", 
            $klass_subway_line,
            // $klass_subway_station="", 
            $klass_subway_station,
            // $day="", 
            $klass_days,
            // $time=""
            $klass_time
        );

        $klass_list = $this->my_decorator->deco_klass($klass_list);
        // 비어있는 수업이라면 '수업 없음' 탭을 가져옵니다.
        if (empty($klass_list))
        {
            $this->my_tracker->add(__FILE__, __FUNCTION__, __LINE__, "조회한 결과가 없는 경우, \"수업없음\" 클래스 정보를 내려준다.");
            $no_klass = 
            $this->my_decorator->get_klass_course_no_class();
            $klass_list = array();
            array_unshift($klass_list,$no_klass);
        } // end if

        // 해당 $login_user_id로 선생님 정보를 가져옵니다.
        $teacher = null;
        if(0 < $login_user_id) 
        {
            $teacher = $this->my_sql->select_teacher_by_user_id($login_user_id);
        } // end if
        if((1 === $page_num) && isset($teacher))
        {
            // 첫번째 페이지이면서 선생님일 경우, 새로운 클래스 만들기 탭을 가져옵니다.
            $new_klass = 
            $this->my_decorator->get_klass_course_new_class();
            // 새로운 클래스를 수업 리스트 가장 앞에 추가합니다.
            array_unshift($klass_list,$new_klass);
        } // end if
        
        $output["klass_list"] = $klass_list;
        $this->respond_200_v2(__FILE__,__FUNCTION__,__LINE__,$output); 
    }    

    // REMOVE ME
    /*
    public function search_post() 
    {
        // wonder.jung
        $output = [];
        $this->my_tracker->add_init(__FILE__, __FUNCTION__, __LINE__);

        if($this->is_not_ok()) 
        {
            $this->respond_200_Failed_v2(__FILE__,__FUNCTION__,__LINE__,$output,"\$this->is_not_ok()");
            return;
        } // end if

        $is_not_allowed_api_call = $this->my_paramchecker->is_not_allowed_api_call();
        if($is_not_allowed_api_call) 
        {  
            $this->respond_200_Failed_v2(__FILE__,__FUNCTION__,__LINE__,$output,"\$is_not_allowed_api_call");
            return;
        }

        // Pagination
        $page_num = 
        $this->my_paramchecker->post(
            // $key=""
            "page_num",
            // $key_filter=""
            "page_num",
            // $is_no_record=false
            true
        );
        if(empty($page_num)) {
            $page_num = 1;
        }

        $page_size = 
        $this->my_paramchecker->post(
            // $key=""
            "page_size",
            // $key_filter=""
            "page_size",
            // $is_no_record=false
            true
        );
        if(empty($page_size)) {
            $page_size = 10;
        } // end if 

        $limit = 
        $this->my_pagination->get_limit(
            // $page_num=-1, 
            $page_num,
            // $page_size=-1
            $page_size
        );
        $offset = 
        $this->my_pagination->get_offset(
            // $page_num=-1, 
            $page_num,
            // $page_size=-1
            $page_size
        ); 

        // Where condition
        $search_query = 
        $this->my_paramchecker->post(
            // $key=""
            "search_query",
            // $key_filter=""
            "search_query",
            // $is_no_record=false
            true
        );

        $klass_status = 
        $this->my_paramchecker->post(
            // $key=""
            "klass_status",
            // $key_filter=""
            "klass_status",
            // $is_no_record=false
            true
        );  
        if(empty($klass_status))
        {
            // 기본값은 개강('O' - Open) 입니다.
            $klass_status = "O";
        }

        $klass_level = 
        $this->my_paramchecker->post(
            // $key=""
            "klass_level",
            // $key_filter=""
            "klass_level",
            // $is_no_record=false
            true
        );        

        $klass_subway_line = 
        $this->my_paramchecker->post(
            // $key=""
            "klass_subway_line",
            // $key_filter=""
            "klass_subway_line",
            // $is_no_record=false
            true
        );        

        $klass_days = 
        $this->my_paramchecker->post(
            // $key=""
            "klass_days",
            // $key_filter=""
            "klass_days_for_search",
            // $is_no_record=false
            true
        );        

        $klass_time = 
        $this->my_paramchecker->post(
            // $key=""
            "klass_time",
            // $key_filter=""
            "klass_time",
            // $is_no_record=false
            true
        );        

        $output["params"] = 
        [
            "page_num"=>$page_num,
            "page_size"=>$page_size,
            "limit"=>$limit,
            "offset"=>$offset,
            "search_query"=>$search_query,
            "klass_status"=>$klass_status,
            "klass_level"=>$klass_level,
            "klass_subway_line"=>$klass_subway_line,
            "klass_days"=>$klass_days,
            "klass_time"=>$klass_time
        ];
        $this->my_tracker->add(__FILE__, __FUNCTION__, __LINE__, "param checked");        

        // CHECK LIST
        $is_ok = $this->has_check_list_success();
        $this->my_tracker->add(__FILE__, __FUNCTION__, __LINE__, "\$is_ok : $is_ok");
        $output["check_list"] = $this->get_check_list();

        if(!$is_ok) 
        {
            $this->respond_200_Failed_v2(__FILE__,__FUNCTION__,__LINE__,$output,"fetchklasslist_post is failed!");
            return;
        } // end if

        // 검색어에 해당하는 전체 결과수를 가져옵니다.
        // 이 데이터로 pagination을 새로 만듭니다.
        $klass_cnt = 
        $this->my_sql->select_klass_cnt_on_admin(
            // $search_query="", 
            $search_query,
            // $klass_status="", 
            $klass_status,
            // $level="", 
            $klass_level,
            // $station="", 
            $klass_subway_line,
            // $day="", 
            $klass_days,
            // $time=""
            $klass_time
        );
        $output["klass_cnt"] = $klass_cnt;
        $pagination = 
        $this->my_pagination->get(
            // $total_row_cnt=-1, 
            $klass_cnt,
            // $cursor_page_num=-1, 
            $page_num,
            // $row_cnt_per_page=-1
            $page_size
        );
        $output["pagination"] = $pagination;

        // 검색어로 유저를 찾습니다.
        $klass_list =
        $this->my_sql->select_klass_on_admin(
            // $limit=-1, 
            $limit,
            // $offset=-1, 
            $offset,
            // $search_query="", 
            $search_query,
            // $klass_status="", 
            $klass_status,
            // $level="", 
            $klass_level,
            // $station="", 
            $klass_subway_line,
            // $day="", 
            $klass_days,
            // $time=""
            $klass_time
        );

        $klass_list = $this->my_decorator->deco_klass($klass_list);
        
        $output["klass_list"] = $klass_list;
        $this->respond_200_v2(__FILE__,__FUNCTION__,__LINE__,$output);         
    }
    */

    /*
    public function search_get() 
    {
        $output = [];
        $this->my_tracker->add_init(__FILE__, __FUNCTION__, __LINE__);

        if($this->is_not_ok()) 
        {
            $this->respond_200_Failed_v2(__FILE__,__FUNCTION__,__LINE__,$output,"\$this->is_not_ok()");
            return;
        } // end if

        $q = 
        $this->my_paramchecker->get(
            // $key=""
            "q",
            // $key_filter=""
            "klass_query"
        );
        $level = 
        $this->my_paramchecker->get(
            // $key=""
            "level",
            // $key_filter=""
            "klass_level"
        );
        $station = 
        $this->my_paramchecker->get(
            // $key=""
            "station",
            // $key_filter=""
            "klass_station"
        );
        $day = 
        $this->my_paramchecker->get(
            // $key=""
            "day",
            // $key_filter=""
            "klass_day"
        );
        $time = 
        $this->my_paramchecker->get(
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

        $klass_list = $this->my_decorator->deco_klass($klass_list);
        $output["klass_list"] = $klass_list;

        $new_klass = $this->get_klass_course_new_class();
        $output["new_klass"] = [$new_klass];

        if (empty($klass_list))
        {
            $this->my_tracker->add(__FILE__, __FUNCTION__, __LINE__, "조회한 결과가 없는 경우, \"수업없음\" 클래스 정보를 내려준다.");
            $no_klass = $this->get_klass_course_no_class();
            $output["klass_list"] = [$no_klass];
        }

        $this->respond_200_v2($output);
    } // end method
    */

    // MOVE TO Decorator
    /*
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

    private function get_klass_course_no_class() 
    {
        $output = [];
        $this->my_tracker->add_init(__FILE__, __FUNCTION__, __LINE__);

        if($this->is_not_ok()) 
        {
            $this->respond_200_Failed_v2(__FILE__,__FUNCTION__,__LINE__,$output,"\$this->is_not_ok()");
            return;
        } // end if
        
        $klass_course = new KlassCourse();
        $klass_course->id = -1;
        $klass_course->class_poster_url_loadable = 
        $this->get_class_img_default();
        $klass_course->title="수업이 없습니다.";

        $klass_course = 
        $this->set_default_klass_course($klass_course);

        return $klass_course;
    }
    private function get_klass_course_new_class() 
    {

        $output = [];
        $this->my_tracker->add_init(__FILE__, __FUNCTION__, __LINE__);

        if($this->is_not_ok()) 
        {
            $this->respond_200_Failed_v2(__FILE__,__FUNCTION__,__LINE__,$output,"\$this->is_not_ok()");
            return;
        } // end if

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
    */



    // REMOVE ME
    /*
    // REFACTOR ME - 컨트롤러마다 나뉘어있음. Klass.php, Admin.php 두곳. 라이브러리 클래스로 해결할 것.
    // @ Desc : 수업 관련 추가 정보를 넣어줍니다.
    private function decorate_klass($klass_list=null) 
    {
        $this->my_tracker->add_init(__FILE__, __FUNCTION__, __LINE__);

        if(empty($klass_list)) {
            $this->my_tracker->add_stopped(__FILE__, __FUNCTION__, __LINE__, "empty(\$klass_list)");
            return;
        } // end if

        $const_map = $this->my_paramchecker->get_const_map();
        if(is_null($const_map)) {
            $this->my_tracker->add_stopped(__FILE__, __FUNCTION__, __LINE__, "is_null(\$const_map)");
            return;
        } // end if

        // $rows = $query->custom_result_object('KlassCourse');

        $klass_list_next = array();
        foreach ($klass_list as $klass)
        {
            // join으로 가져온 klass와 teacher의 정보를 나눕니다.

            $klassCourse = new KlassCourse();
            $klassCourse->id = intval($klass->klass_id);
            $klassCourse->title = $klass->klass_title;
            $klassCourse->desc = $klass->klass_desc;
            $klassCourse->feature = $klass->klass_feature;
            $klassCourse->target = $klass->klass_target;
            $klassCourse->schedule = $klass->klass_schedule;
            $klassCourse->date_begin = $klass->klass_date_begin;
            $klassCourse->time_begin = $klass->klass_time_begin;
            $klassCourse->time_duration_minutes = intval($klass->klass_time_duration_minutes);
            $klassCourse->time_end = $klass->klass_time_end;
            $klassCourse->level = $klass->klass_level;
            $klassCourse->week = intval($klass->klass_week);
            $klassCourse->days = $klass->klass_days;

            $klassCourse->subway_line = $klass->klass_subway_line;
            $klassCourse->subway_station = $klass->klass_subway_station;

            $klassCourse->venue_title = $klass->klass_venue_title;
            $klassCourse->venue_telephone = $klass->klass_venue_telephone;
            $klassCourse->venue_address = $klass->klass_venue_address;
            $klassCourse->venue_road_address = $klass->klass_venue_road_address;
            $klassCourse->venue_latitude = $klass->klass_venue_latitude;
            $klassCourse->venue_longitude = $klass->klass_venue_longitude;

            $klassCourse->status = $klass->klass_status;
            $klassCourse->price = intval($klass->klass_price);
            $klassCourse->student_cnt = intval($klass->klass_student_cnt);
            $klassCourse->class_poster_url = $klass->klass_class_poster_url;
            $klassCourse->class_banner_url = $klass->klass_class_banner_url;

            $klassCourse->date_created = $klass->klass_date_created;
            $klassCourse->date_updated = $klass->klass_date_updated;

            $klassCourse->teacher_id = intval($klass->teacher_id);
            $klassCourse->teacher_resume = $klass->teacher_resume;
            $klassCourse->teacher_greeting = $klass->teacher_greeting;

            $teacher = new Teacher();
            $teacher->id = intval($klass->teacher_id);
            $teacher->user_id = intval($klass->teacher_user_id);
            $teacher->nickname = $klass->teacher_nickname;
            $teacher->name = $klass->teacher_name;
            $teacher->gender = $klass->teacher_gender;
            $teacher->birthday = $klass->teacher_birthday;
            $teacher->thumbnail = $klass->teacher_thumbnail;
            $teacher->status = $klass->teacher_status;
            $teacher->mobile = $klass->teacher_mobile;
            $teacher->email = $klass->teacher_email;
            $teacher->resume = $klass->teacher_resume;
            $teacher->greeting = $klass->teacher_greeting;
            $teacher->memo = $klass->teacher_memo;
            $teacher->date_created = $klass->teacher_date_created;
            $teacher->date_updated = $klass->teacher_date_updated;

            $klassCourse->teacher = $teacher;

            // 추가할 정보들을 넣는다.
            $klassCourse = $this->get_class_poster_img_url($klassCourse);
            $klassCourse = $this->get_time_begin_img_url($klassCourse);
            $klassCourse = $this->get_level_img_url($klassCourse);
            $klassCourse = $this->get_days_list($klassCourse);
            $klassCourse = $this->get_days_img_url($klassCourse);
            $klassCourse = $this->get_subway_station_img_url($klassCourse);
            $klassCourse = $this->get_price_with_format($klassCourse);
            
            array_push($klass_list_next, $klassCourse);
        }

        return $klass_list_next;
        
    } // end method

    private function get_class_poster_img_url($klass=null)
    {
        if(is_null($klass)) 
        {
            $this->my_tracker->add_stopped(__FILE__, __FUNCTION__, __LINE__, "is_null(\$klass)");
            return;
        } // end if

        $klass->class_img_err_url = $this->my_path->get("/assets/images/event/error.svg");
        if(empty($klass->class_poster_url)) {
            $klass->class_poster_url = "";
            $klass->class_poster_url_loadable = $this->my_path->get("/assets/images/class/poster/no_cover_image.jpg");
        }
        else
        {
            $klass->class_poster_url_loadable = $this->my_path->get_loadable_url_class_poster($klass->class_poster_url);   
        } 

        return $klass;       
    }
    private function get_time_begin_img_url($klass=null)
    {
        if(is_null($klass)) 
        {
            $this->my_tracker->add_stopped(__FILE__, __FUNCTION__, __LINE__, "is_null(\$klass)");
            return;
        } // end if

        $time_begin = $klass->time_begin;
        if(empty($time_begin))
        {
            $this->my_tracker->add_stopped(__FILE__, __FUNCTION__, __LINE__, "empty(\$time_begin)");
            return;
        } // end if

        $const_map = $this->my_paramchecker->get_const_map();
        if(is_null($const_map)) {
            $this->my_tracker->add_stopped(__FILE__, __FUNCTION__, __LINE__, "is_null(\$const_map)");
            return;
        } // end if

        $military_hours = date("H", strtotime($time_begin));
        $class_times_list = $const_map->{"class_times_list"};
        $class_times_eng_list = $const_map->{"class_times_eng_list"};
        $class_times_kor_list = $const_map->{"class_times_kor_list"};
        $class_times_img_url_list = $const_map->{"class_times_img_url_list"};

        if(6 <= $military_hours && $military_hours < 12) 
        {       
            // 오전
            $target_idx = 1;
        } 
        else if(12 <= $military_hours && $military_hours < 14) 
        {
            // 점심
            $target_idx = 2;
        }
        else if(14 <= $military_hours && $military_hours < 18) 
        {
            // 오후
            $target_idx = 3;
        }
        else if(18 <= $military_hours && $military_hours < 20) 
        {
            // 저녁
            $target_idx = 4;
        }
        else 
        {
            // TODO - Show Error - 지정된 시간이 없음.
            $target_idx = 0;
        }

        $klass->time_begin_name = $class_times_list[$target_idx];
        $klass->time_begin_name_eng = $class_times_eng_list[$target_idx];
        $klass->time_begin_name_kor = $class_times_kor_list[$target_idx];
        $klass->time_begin_img_url = $class_times_img_url_list[$target_idx];

        return $klass;
    } // end method
    private function get_level_img_url($klass=null)
    {

        if(is_null($klass)) 
        {
            $this->my_tracker->add_stopped(__FILE__, __FUNCTION__, __LINE__, "is_null(\$klass)");
            return;
        } // end if

        $class_level = $klass->level;
        if(empty($class_level))
        {
            $this->my_tracker->add_stopped(__FILE__, __FUNCTION__, __LINE__, "empty(\$class_level)");
            return;
        } // end if

        $const_map = $this->my_paramchecker->get_const_map();
        if(is_null($const_map)) {
            $this->my_tracker->add_stopped(__FILE__, __FUNCTION__, __LINE__, "is_null(\$const_map)");
            return;
        } // end if


        $class_level_list = $const_map->{"class_level_list"};

        $idx_selected = -1;
        for ($i=0; $i < count($class_level_list); $i++) 
        {
            $cur_class_level = $class_level_list[$i];
            if(!empty($cur_class_level) && $cur_class_level === $class_level) 
            {
                $idx_selected = $i;
                break;
            }
        }
        $class_level_eng_list = $const_map->{"class_level_eng_list"};
        $class_level_kor_list = $const_map->{"class_level_kor_list"};
        $class_level_img_url_list = $const_map->{"class_level_img_url_list"};

        if(!(0 < $idx_selected)) 
        {
            // 선택한 항목이 없다. 기본 이미지를 돌려준다.
            $klass->level_eng = $class_level_eng_list[0];
            $klass->level_kor = $class_level_kor_list[0];
            $klass->level_img_url = $class_level_img_url_list[0];
        }
        else
        {
            // 선택한 항목이 있다. 선택한 이미지를 돌려준다.
            $klass->level_eng = $class_level_eng_list[$idx_selected];
            $klass->level_kor = $class_level_kor_list[$idx_selected];
            $klass->level_img_url = $class_level_img_url_list[$idx_selected];
        } // end if

        return $klass;

    } // end method
    private function get_days_list($klass=null)
    {
        if(is_null($klass)) 
        {
            $this->my_tracker->add_stopped(__FILE__, __FUNCTION__, __LINE__, "is_null(\$klass)");
            return;
        } // end if

        $class_days = $klass->days;
        if(empty($class_days))
        {
            $this->my_tracker->add_stopped(__FILE__, __FUNCTION__, __LINE__, "empty(\$class_days)");
            return;
        } // end if

        $const_map = $this->my_paramchecker->get_const_map();
        if(is_null($const_map)) {
            $this->my_tracker->add_stopped(__FILE__, __FUNCTION__, __LINE__, "is_null(\$const_map)");
            return;
        } // end if

        $class_days_list = $const_map->{"class_days_list"};

        // "|"로 구분된 요일 정보를 분리해서 전달한다.
        $days_list = explode($klass->delimiter, $class_days);

        // 유효성 검증 완료! 데이터를 저장합니다.
        $klass->days_list = $days_list;

        return $klass;
    } 
    private function get_days_map($days_list=null)
    {
        if(empty($days_list))
        {
            $this->my_tracker->add_stopped(__FILE__, __FUNCTION__, __LINE__, "empty(\$days_list)");
            return;
        } // end if

        $days_map = [];
        for ($i=0; $i < count($days_list); $i++) 
        {
                $day = $days_list[$i];
                $day = strtolower($day);
                $days_map[$day] = $day;
        } // end for

        return $days_map;
    }
    private function get_days_img_url($klass=null)
    {
        if(is_null($klass)) 
        {
            $this->my_tracker->add_stopped(__FILE__, __FUNCTION__, __LINE__, "is_null(\$klass)");
            return;
        } // end if

        $days_list = $klass->days_list;
        if(empty($days_list))
        {
            $this->my_tracker->add_stopped(__FILE__, __FUNCTION__, __LINE__, "empty(\$days_list)");
            return;
        } // end if

        $const_map = $this->my_paramchecker->get_const_map();
        if(is_null($const_map)) {
            $this->my_tracker->add_stopped(__FILE__, __FUNCTION__, __LINE__, "is_null(\$const_map)");
            return;
        } // end if

        $days_list = $klass->days_list;
        $days_map = $this->get_days_map($days_list);

        $class_days_list = $const_map->{"class_days_list"};
        
        $selected_idx_arr = array();
        for ($i=0; $i < count($class_days_list); $i++) 
        {
            $cur_class_days = $class_days_list[$i];
            if(!empty($days_map[$cur_class_days])) 
            {
                array_push($selected_idx_arr, $i);
            } // end if
        } // end for
        $class_days_eng_list = $const_map->{"class_days_eng_list"};
        $class_days_kor_list = $const_map->{"class_days_kor_list"};
        $class_days_img_url_list = $const_map->{"class_days_img_url_list"};

        // 수업 요일이 주당 2일 이상으로 변경될 가능성을 고려, 설계한다.
        for ($i=0; $i < count($selected_idx_arr); $i++) 
        {
            $selected_idx = $selected_idx_arr[$i];

            if(empty($klass->days_eng)) {
                $klass->days_eng = $class_days_eng_list[$selected_idx];
            } else {
                $klass->days_eng .= $klass->delimiter . "" . $class_days_eng_list[$selected_idx];
            }
            if(empty($klass->days_kor)) {
                $klass->days_kor = $class_days_kor_list[$selected_idx];
            } else {
                $klass->days_kor .= $klass->delimiter . "" . $class_days_kor_list[$selected_idx];
            }
            if(empty($klass->days_img_url)) {
                $klass->days_img_url = $class_days_img_url_list[$selected_idx];
            } else {
                $klass->days_img_url .= $klass->delimiter . "" . $class_days_img_url_list[$selected_idx];
            }
        } // end for

        return $klass;
    }
    private function get_subway_station_img_url($klass=null)
    {
        if(is_null($klass)) 
        {
            $this->my_tracker->add_stopped(__FILE__, __FUNCTION__, __LINE__, "is_null(\$klass)");
            return;
        } // end if

        $subway_line = $klass->subway_line;
        if(empty($subway_line))
        {
            $this->my_tracker->add_stopped(__FILE__, __FUNCTION__, __LINE__, "empty(\$subway_line)");
            return;
        } // end if

        $subway_station = $klass->subway_station;
        if(empty($subway_line))
        {
            $this->my_tracker->add_stopped(__FILE__, __FUNCTION__, __LINE__, "empty(\$subway_station)");
            return;
        } // end if

        $const_map = $this->my_paramchecker->get_const_map();
        if(is_null($const_map)) {
            $this->my_tracker->add_stopped(__FILE__, __FUNCTION__, __LINE__, "is_null(\$const_map)");
            return;
        } // end if

        $subway_line_list = $const_map->{"subway_line_list"};
        
        $idx_subway_line = -1;
        for ($i=0; $i < count($subway_line_list); $i++) 
        {
            $subway_line_from_list = $subway_line_list[$i];
            if(!empty($subway_line_from_list) && $subway_line_from_list === $subway_line) 
            {
                $idx_subway_line = $i;
                break;
            }
        } // end for

        $subway_station_list = $const_map->{"subway_station_list"};
        $subway_station_list = $subway_station_list[$idx_subway_line];

        $idx_subway_station = -1;
        for ($i=0; $i < count($subway_station_list); $i++) 
        {
            $subway_station_from_list = $subway_station_list[$i];
            if(!empty($subway_station_from_list) && $subway_station_from_list === $subway_station) 
            {
                $idx_subway_station = $i;
                break;
            }
        } // end for

        $subway_station_img_list = $const_map->{"subway_station_img_list"};
        $klass->subway_station_img = $subway_station_img_list[$idx_subway_line][$idx_subway_station];

        return $klass;
    } 
    private function get_price_with_format($klass=null)
    {
        if(is_null($klass)) 
        {
            $this->my_tracker->add_stopped(__FILE__, __FUNCTION__, __LINE__, "is_null(\$klass)");
            return;
        } // end if

        if(!isset($klass->price)) 
        {
                return;
        }
        $klass->price_with_format = number_format($klass->price);

        return $klass;
    } 
    */

}
